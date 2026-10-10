'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  displayName: 'harris',
  fullName: 'Harris Walter',
  email: 'iamharriswalter@gmail.com',
  role: 'reader',
  joinedDate: 'September 27, 2026',
  bio: 'No bio added yet.',
  avatarInitial: 'h'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signout'); // 'signout' | 'create' | 'signin'

  // Persist state in localStorage if available
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem('pi-auth-state');
      if (storedAuth) {
        const parsed = JSON.parse(storedAuth);
        setIsLoggedIn(parsed.isLoggedIn ?? true);
        if (parsed.user) {
          setUser(parsed.user);
        }
      }
    } catch (_) {}
  }, []);

  const saveState = (loggedIn, userData) => {
    setIsLoggedIn(loggedIn);
    setUser(userData);
    try {
      localStorage.setItem('pi-auth-state', JSON.stringify({
        isLoggedIn: loggedIn,
        user: userData
      }));
    } catch (_) {}
  };

  const signIn = (email, password, role) => {
    const isDakoreAdmin = email && email.trim().toLowerCase() === 'ekpendudakore@gmail.com';
    const isGeneralAdmin = (role === 'admin') || (email && email.toLowerCase().includes('admin'));
    const isAdmin = isDakoreAdmin || isGeneralAdmin;

    // Validate admin password if signing in as Dakore
    if (isDakoreAdmin && password && password !== 'ladydakore@artellium90') {
      return { success: false, error: 'Invalid admin credentials. Please enter the correct password.' };
    }

    const assignedRole = isAdmin ? 'admin' : (role || 'reader');
    const updatedUser = {
      ...DEFAULT_USER,
      email: isDakoreAdmin ? 'Ekpendudakore@gmail.com' : (email || DEFAULT_USER.email),
      displayName: isDakoreAdmin ? 'Lady Dakore' : (isAdmin ? 'Admin Command' : (email ? email.split('@')[0] : DEFAULT_USER.displayName)),
      fullName: isDakoreAdmin ? 'Lady Dakore Ekpendu' : (isAdmin ? 'Lady Dakore Ekpendu' : (email ? email.split('@')[0] : DEFAULT_USER.fullName)),
      role: assignedRole,
      avatarInitial: isDakoreAdmin ? 'D' : (isAdmin ? 'A' : (email ? email[0].toUpperCase() : 'H')),
    };
    saveState(true, updatedUser);
    setIsAuthModalOpen(false);
    return { success: true, user: updatedUser, isAdmin: isAdmin, redirectTo: isAdmin ? '/admin' : '/dashboard' };
  };

  const loginAsAdmin = (email = 'Ekpendudakore@gmail.com', password = 'ladydakore@artellium90') => {
    return signIn(email, password, 'admin');
  };

  const createAccount = ({ displayName, fullName, email, password, role = 'reader' }) => {
    // Functional create account logic
    const newUser = {
      displayName: displayName || email.split('@')[0],
      fullName: fullName || displayName || 'Reader Member',
      email,
      role: role || 'reader',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      bio: 'New reader account registered.',
      avatarInitial: (displayName || email || 'u')[0].toLowerCase()
    };
    saveState(true, newUser);
    setIsAuthModalOpen(false);
    return { success: true, user: newUser };
  };

  const signOut = () => {
    saveState(false, null);
    setIsAuthModalOpen(false);
  };

  const openAuthModal = (mode = 'signout') => {
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
