'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedAuth = localStorage.getItem('pi-auth-state');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.user?.email !== 'iamharriswalter@gmail.com' && parsed?.isLoggedIn && parsed?.user) {
          return parsed.user;
        }
      }
    } catch (_) {}
    return null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const storedAuth = localStorage.getItem('pi-auth-state');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        if (parsed?.user?.email !== 'iamharriswalter@gmail.com' && parsed?.isLoggedIn && parsed?.user) {
          return true;
        }
      }
    } catch (_) {}
    return false;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'create' | 'verify' | 'signout'
  const [pendingEmail, setPendingEmail] = useState('');

  const saveState = (loggedIn, userData) => {
    setIsLoggedIn(loggedIn);
    setUser(userData);
    try {
      if (loggedIn && userData) {
        localStorage.setItem('pi-auth-state', JSON.stringify({
          isLoggedIn: loggedIn,
          user: userData
        }));
      } else {
        localStorage.removeItem('pi-auth-state');
      }
    } catch (_) {}
  };

  /**
   * Sign In via backend API (triggers security login email notification)
   */
  const signIn = async (email, password, role) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isDakoreAdmin = cleanEmail === 'ekpendudakore@gmail.com';

    // Validate admin credentials upfront if admin email
    if (isDakoreAdmin && password !== 'ladydakore@artellium90') {
      return { success: false, error: 'Invalid admin credentials. Please enter the correct password.' };
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role })
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.requiresVerification) {
          setPendingEmail(cleanEmail);
          setAuthModalMode('verify');
          return { success: false, requiresVerification: true, error: data.error };
        }
        return { success: false, error: data.error || 'Invalid credentials.' };
      }

      saveState(true, data.user);
      setIsAuthModalOpen(false);
      return { 
        success: true, 
        user: data.user, 
        isAdmin: data.isAdmin || data.user?.role === 'admin', 
        redirectTo: data.redirectTo || '/dashboard' 
      };
    } catch (err) {
      // Local fallback for super admin in isolated dev environments
      if (isDakoreAdmin && password === 'ladydakore@artellium90') {
        const adminUser = {
          displayName: 'Lady Dakore',
          fullName: 'Lady Dakore Ekpendu',
          email: 'Ekpendudakore@gmail.com',
          role: 'admin',
          joinedDate: 'September 2026',
          bio: 'Executive Director & Chief Editor',
          avatarInitial: 'D'
        };
        saveState(true, adminUser);
        setIsAuthModalOpen(false);
        return { success: true, user: adminUser, isAdmin: true, redirectTo: '/admin' };
      }
      return { success: false, error: err.message || 'Network error during sign-in.' };
    }
  };

  const loginAsAdmin = (email, password) => {
    return signIn(email, password, 'admin');
  };

  /**
   * Create Account via backend API (triggers 6-digit OTP verification email via Resend)
   * DOES NOT log the user in automatically.
   */
  const createAccount = async ({ displayName, fullName, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();

    if (cleanEmail === 'ekpendudakore@gmail.com') {
      return signIn(email, password, 'admin');
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: fullName || displayName, 
          email: cleanEmail, 
          password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to create account.' };
      }

      setPendingEmail(cleanEmail);
      setAuthModalMode('verify');
      return { 
        success: true, 
        pendingVerification: true, 
        email: cleanEmail, 
        message: data.message 
      };
    } catch (err) {
      return { success: false, error: err.message || 'Network error creating account.' };
    }
  };

  /**
   * Verify 6-digit OTP code (Activates account and logs user in)
   */
  const verifyCode = async (email, code) => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || pendingEmail, code })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Verification failed.' };
      }

      // Account verified: Activate session and log user in
      saveState(true, data.user);
      setIsAuthModalOpen(false);
      return { 
        success: true, 
        user: data.user, 
        redirectTo: '/dashboard',
        message: data.message
      };
    } catch (err) {
      return { success: false, error: err.message || 'Network error verifying code.' };
    }
  };

  /**
   * Resend 6-digit verification code
   */
  const resendVerificationCode = async (email) => {
    try {
      const targetEmail = email || pendingEmail;
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Failed to resend code.' };
      }

      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message || 'Network error resending code.' };
    }
  };

  const signOut = () => {
    saveState(false, null);
    setIsAuthModalOpen(false);
  };

  const openAuthModal = (mode = 'signin') => {
    if (isLoggedIn && mode !== 'create' && mode !== 'signin' && mode !== 'verify') {
      setAuthModalMode('signout');
    } else {
      setAuthModalMode(mode);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        pendingEmail,
        setPendingEmail,
        openAuthModal,
        closeAuthModal,
        signIn,
        loginAsAdmin,
        createAccount,
        verifyCode,
        resendVerificationCode,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
