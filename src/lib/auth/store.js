import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
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
  return crypto.createHash('sha256').update(password + 'pi-sec-salt-2026').digest('hex');
}

// Helper to generate a secure 6-digit OTP
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 1. Store Pending Email Verification
 */
export async function savePendingVerification({ email, fullName, password, code, expiresAt }) {
  ensureStorage();
  const cleanEmail = email.trim().toLowerCase();
  const record = {
    email: cleanEmail,
    fullName: fullName || cleanEmail.split('@')[0],
    passwordHash: hashPassword(password),
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
    } catch (_) {
      // Table may not exist yet, fallback store protects state
    }
  }

  return record;
}

/**
 * 2. Get Pending Verification Record
 */
export async function getPendingVerification(email) {
  const cleanEmail = email.trim().toLowerCase();
  
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
  const cleanEmail = email.trim().toLowerCase();
  memoryVerifications.delete(cleanEmail);
  try {
    ensureStorage();
    if (fs.existsSync(VERIFY_FILE)) {
      const all = JSON.parse(fs.readFileSync(VERIFY_FILE, 'utf-8'));
      delete all[cleanEmail];
      fs.writeFileSync(VERIFY_FILE, JSON.stringify(all, null, 2));
    }
  } catch (_) {}
}

/**
 * 4. Save Verified User Account
 */
export async function saveVerifiedUser({ email, fullName, passwordHash }) {
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

  // Write to local fallback storage
  try {
    let all = {};
    if (fs.existsSync(USERS_FILE)) {
      all = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    }
    all[cleanEmail] = user;
    fs.writeFileSync(USERS_FILE, JSON.stringify(all, null, 2));
  } catch (_) {}

  // Sync to Supabase if table exists
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
  }

  // Remove pending verification since now verified
  await removePendingVerification(cleanEmail);

  return user;
}

/**
 * 5. Get User by Email
 */
export async function getUserByEmail(email) {
  const cleanEmail = (email || '').trim().toLowerCase();

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

  return null;
}
