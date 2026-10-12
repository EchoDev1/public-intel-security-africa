'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin'); // 'signin' | 'create' | 'signout'

  // Persist state in localStorage if available
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('pi-auth-state');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        // Purge old demo user if found
        if (parsed?.user?.email === 'iamharriswalter@gmail.com') {
          localStorage.removeItem('pi-auth-state');
          setIsLoggedIn(false);
          setUser(null);
        } else if (parsed?.isLoggedIn && parsed?.user) {
          setIsLoggedIn(true);
          setUser(parsed.user);
        }
      }
    } catch (_) {}
  }, []);

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

  const signIn = (email, password, role) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const isDakoreAdmin = cleanEmail === 'ekpendudakore@gmail.com';

    // Validate admin credentials
    if (isDakoreAdmin) {
      if (password !== 'ladydakore@artellium90') {
        return { success: false, error: 'Invalid admin credentials. Please enter the correct password.' };
      }
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

    // Reject non-admin role elevation attempts
    if (role === 'admin' && !isDakoreAdmin) {
      return { success: false, error: 'Unauthorized. Admin credentials required.' };
    }

    // Standard reader sign-in
    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const namePart = cleanEmail.split('@')[0];
    const readerUser = {
      displayName: namePart,
      fullName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: (email || '').trim(),
      role: 'reader',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      bio: 'Reader Member',
      avatarInitial: cleanEmail.charAt(0).toUpperCase()
    };
    saveState(true, readerUser);
    setIsAuthModalOpen(false);
    return { success: true, user: readerUser, isAdmin: false, redirectTo: '/dashboard' };
  };

  const loginAsAdmin = (email, password) => {
    return signIn(email, password, 'admin');
  };

  const createAccount = ({ displayName, fullName, email, password }) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (cleanEmail === 'ekpendudakore@gmail.com') {
      return signIn(email, password, 'admin');
    }

    const name = displayName || cleanEmail.split('@')[0];
    const newUser = {
      displayName: name,
      fullName: fullName || name,
      email: (email || '').trim(),
      role: 'reader',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      bio: 'Reader Member',
      avatarInitial: (name || 'u').charAt(0).toUpperCase()
    };
    saveState(true, newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser, isAdmin: false, redirectTo: '/dashboard' };
  };

  const signOut = () => {
    saveState(false, null);
    setIsAuthModalOpen(false);
  };

  const openAuthModal = (mode = 'signin') => {
    if (isLoggedIn && mode !== 'create' && mode !== 'signin') {
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
        openAuthModal,
        closeAuthModal,
        signIn,
        loginAsAdmin,
        createAccount,
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
