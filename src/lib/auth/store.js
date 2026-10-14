import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/client';

// Resilient fallback storage path
const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const VERIFY_FILE = path.join(DATA_DIR, 'verifications.json');

// Ensure local fallback storage directory exists
function ensureStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
    }
    if (!fs.existsSync(VERIFY_FILE)) {
      fs.writeFileSync(VERIFY_FILE, JSON.stringify({}, null, 2));
    }
  } catch (err) {
    console.warn('Local auth file store init note:', err.message);
  }
}

// In-memory cache for speed
const memoryUsers = new Map();
const memoryVerifications = new Map();

// Helper to hash passwords securely
export function hashPassword(password) {
  if (!password) return '';
  return crypto.createHash('sha256').update(password + 'pi-sec-salt-2026').digest('hex');
}

// Helper to generate a secure 6-digit OTP
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 1. Store Pending Email Verification (Sign-up only)
 */
export async function savePendingVerification({ email, fullName, password, code, expiresAt }) {
  ensureStorage();
  const cleanEmail = email.trim().toLowerCase();
  const record = {
    email: cleanEmail,
    fullName: fullName || cleanEmail.split('@')[0],
    passwordHash: hashPassword(password),
    rawPassword: password, // preserved temporarily until 6-digit code verification activates account
    code,
    expiresAt: expiresAt || Date.now() + 15 * 60 * 1000, // 15 minutes
    createdAt: Date.now()
  };

  memoryVerifications.set(cleanEmail, record);

  try {
    let all = {};
    if (fs.existsSync(VERIFY_FILE)) {
      all = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf-8'));
    }
    all[cleanEmail] = record;
    fs.writeFileSync(VERIFY_FILE, JSON.stringify(all, null, 2));
  } catch (_) {}

  // Attempt Supabase sync if table exists
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('email_verifications').upsert({
        email: cleanEmail,
        code,
        full_name: record.fullName,
        expires_at: new Date(record.expiresAt).toISOString()
      }, { onConflict: 'email' });
    } catch (_) {}
  }

  return record;
}

/**
 * 2. Get Pending Verification Record
 */
export async function getPendingVerification(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return null;
  
  // Check memory
  if (memoryVerifications.has(cleanEmail)) {
    return memoryVerifications.get(cleanEmail);
  }

  // Check file storage
  try {
    ensureStorage();
    if (fs.existsSync(VERIFY_FILE)) {
      const all = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf-8'));
      if (all[cleanEmail]) {
        memoryVerifications.set(cleanEmail, all[cleanEmail]);
        return all[cleanEmail];
      }
    }
  } catch (_) {}

  // Check Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data } = await supabase.from('email_verifications').select('*').eq('email', cleanEmail).single();
      if (data) {
        return {
          email: data.email,
          fullName: data.full_name,
          code: data.code,
          expiresAt: new Date(data.expires_at).getTime()
        };
      }
    } catch (_) {}
  }

  return null;
}

/**
 * 3. Remove Verification Record
 */
export async function removePendingVerification(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return;
  memoryVerifications.delete(cleanEmail);
  try {
    ensureStorage();
    if (fs.existsSync(VERIFY_FILE)) {
      const all = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf-8'));
      delete all[cleanEmail];
      fs.writeFileSync(VERIFY_FILE, JSON.stringify(all, null, 2));
    }
  } catch (_) {}

  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('email_verifications').delete().eq('email', cleanEmail);
    } catch (_) {}
  }
}

/**
 * 4. Save Verified User Account (after successful OTP code verification)
 */
export async function saveVerifiedUser({ email, fullName, passwordHash, rawPassword }) {
  ensureStorage();
  const cleanEmail = email.trim().toLowerCase();
  const namePart = cleanEmail.split('@')[0];
  const displayName = fullName || (namePart.charAt(0).toUpperCase() + namePart.slice(1));

  const user = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    email: cleanEmail,
    fullName: fullName || displayName,
    displayName,
    passwordHash: passwordHash || '',
    role: 'reader',
    isVerified: true,
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    bio: 'Reader Member',
    avatarInitial: displayName.charAt(0).toUpperCase(),
    verifiedAt: new Date().toISOString()
  };

  memoryUsers.set(cleanEmail, user);

  // 1. Write to local fallback storage
  try {
    let all = {};
    if (fs.existsSync(USERS_FILE)) {
      all = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
    all[cleanEmail] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(all, null, 2));
  } catch (_) {}

  // 2. Sync to Supabase reader_accounts table
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('reader_accounts').upsert({
        email: cleanEmail,
        full_name: user.fullName,
        display_name: user.displayName,
        role: user.role,
        is_verified: true,
        verified_at: user.verifiedAt
      }, { onConflict: 'email' });
    } catch (_) {}

    // 3. Sync into Supabase Auth with bcrypt password if password available
    if (rawPassword) {
      try {
        const supabase = createServerSupabaseClient();
        // Check if user already exists in Supabase Auth
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingAuthUser = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail);

        if (existingAuthUser) {
          await supabase.auth.admin.updateUserById(existingAuthUser.id, {
            password: rawPassword,
            email_confirm: true,
            user_metadata: { full_name: user.fullName }
          });
        } else {
          await supabase.auth.admin.createUser({
            email: cleanEmail,
            password: rawPassword,
            email_confirm: true,
            user_metadata: { full_name: user.fullName }
          });
        }
      } catch (err) {
        console.warn('Supabase auth sync notice:', err.message);
      }
    }
  }

  // 4. Remove pending verification since account is now verified
  await removePendingVerification(cleanEmail);

  return user;
}

/**
 * 5. Get User by Email
 */
export async function getUserByEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail) return null;

  // Lady Dakore Super Admin predefined profile
  if (cleanEmail === 'ekpendudakore@gmail.com') {
    return {
      displayName: 'Lady Dakore',
      fullName: 'Lady Dakore Ekpendu',
      email: 'Ekpendudakore@gmail.com',
      role: 'admin',
      isVerified: true,
      joinedDate: 'September 2026',
      bio: 'Executive Director & Chief Editor',
      avatarInitial: 'D'
    };
  }

  if (memoryUsers.has(cleanEmail)) {
    return memoryUsers.get(cleanEmail);
  }

  try {
    ensureStorage();
    if (fs.existsSync(USERS_FILE)) {
      const all = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
      if (all[cleanEmail]) {
        memoryUsers.set(cleanEmail, all[cleanEmail]);
        return all[cleanEmail];
      }
    }
  } catch (_) {}

  // Check Supabase reader_accounts table
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('reader_accounts').select('*').eq('email', cleanEmail).single();
      if (!error && data) {
        const namePart = cleanEmail.split('@')[0];
        const userObj = {
          id: data.id || ('user_' + crypto.randomUUID().slice(0, 8)),
          email: cleanEmail,
          fullName: data.full_name || namePart,
          displayName: data.display_name || data.full_name || namePart,
          role: data.role || 'reader',
          isVerified: Boolean(data.is_verified),
          joinedDate: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently Joined',
          bio: 'Reader Member',
          avatarInitial: (data.display_name || data.full_name || namePart).charAt(0).toUpperCase(),
          verifiedAt: data.verified_at
        };
        memoryUsers.set(cleanEmail, userObj);
        return userObj;
      }
    } catch (_) {}
  }

  return null;
}

/**
 * 6. Authenticate User Credentials (Strict Password Verification)
 * Validates either via Supabase Auth (bcrypt) or local salted SHA-256 store.
 * Returns { valid: boolean, user: Object, error?: string }
 */
export async function verifyUserCredentials(email, password) {
  const cleanEmail = (email || '').trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { valid: false, error: 'Email and password are required.' };
  }

  // 1. Super Admin Credentials Check
  if (cleanEmail === 'ekpendudakore@gmail.com') {
    if (password === 'ladydakore@artellium90') {
      const adminUser = await getUserByEmail(cleanEmail);
      return { valid: true, user: adminUser, isAdmin: true };
    }
    return { valid: false, error: 'Invalid email or password.' };
  }

  // 2. Check Supabase Auth (Native Cloud Engine)
  if (isSupabaseConfigured()) {
    try {
      const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbzovjtwyjgnosehpakd.supabase.co';
      const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iem92anR3eWpnbm9zZWhwYWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTk2MzYsImV4cCI6MjEwNjc3NTYzNn0.RNK3p_6EGc0jMosRADRDm617jep-7e7ng_WbSlh_9gk';

      const anonClient = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
      const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (!authError && authData?.user) {
        let userProfile = await getUserByEmail(cleanEmail);
        if (!userProfile) {
          userProfile = {
            id: authData.user.id,
            email: cleanEmail,
            fullName: authData.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            displayName: authData.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            role: 'reader',
            isVerified: true,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            bio: 'Reader Member',
            avatarInitial: cleanEmail.charAt(0).toUpperCase()
          };
        }
        return { valid: true, user: userProfile, isAdmin: false };
      }
    } catch (_) {}
  }

  // 3. Fallback Check against Local Store
  const localUser = await getUserByEmail(cleanEmail);
  if (localUser && localUser.passwordHash) {
    const hashedAttempt = hashPassword(password);
    if (localUser.passwordHash === hashedAttempt) {
      // Lazy-sync password to Supabase Auth for future sign-ins
      if (isSupabaseConfigured()) {
        try {
          const supabase = createServerSupabaseClient();
          const { data: listData } = await supabase.auth.admin.listUsers();
          const existing = listData?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
          if (existing) {
            await supabase.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
          } else {
            await supabase.auth.admin.createUser({
              email: cleanEmail,
              password,
              email_confirm: true,
              user_metadata: { full_name: localUser.fullName }
            });
          }
        } catch (_) {}
      }
      return { valid: true, user: localUser, isAdmin: false };
    }
  }

  // 4. No valid credentials matched
  return { valid: false, error: 'Invalid email or password. Please verify your credentials or create an account.' };
}
