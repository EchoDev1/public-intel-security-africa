'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  X, 
  User, 
  LogOut, 
  UserPlus, 
  LogIn, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ExternalLink,
  Shield,
  Bookmark,
  Bell,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function UserAuthModal() {
  const router = useRouter();
  const { 
    user, 
    isLoggedIn, 
    isAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    closeAuthModal, 
    signIn, 
    createAccount, 
    signOut 
  } = useAuth();

  // Create Account Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true
  });

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handle Create Account Submission
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const emailInput = createForm.email.trim();
    if (!emailInput || !createForm.password) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (createForm.password.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const isDakore = emailInput.toLowerCase() === 'ekpendudakore@gmail.com';
      if (isDakore) {
        const res = signIn(emailInput, createForm.password, 'admin');
        setIsSubmitting(false);
        if (res?.success === false) {
          setStatusMessage({ type: 'error', text: res.error || 'Authentication error.' });
          return;
        }
        setStatusMessage({ type: 'success', text: 'Welcome Lady Dakore. Routing to Admin Dashboard...' });
        closeAuthModal();
        router.push('/admin');
        return;
      }

      createAccount({
        fullName: createForm.fullName,
        email: emailInput,
        password: createForm.password
      });
      setIsSubmitting(false);
      setStatusMessage({ type: 'success', text: 'Account created successfully. Welcome to Public Intel.' });
      setTimeout(() => {
        closeAuthModal();
      }, 500);
    }, 300);
  };

  // Handle Sign In Submission
  const handleSignIn = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    const emailInput = signInForm.email.trim();
    if (!emailInput) {
      setStatusMessage({ type: 'error', text: 'Please enter your email address.' });
      return;
    }

    if (!signInForm.password) {
      setStatusMessage({ type: 'error', text: 'Please enter your password.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = signIn(emailInput, signInForm.password);
      setIsSubmitting(false);

      if (res?.success === false) {
        setStatusMessage({ type: 'error', text: res.error || 'Invalid email or password.' });
        return;
      }

      if (res?.isAdmin || res?.user?.role === 'admin' || emailInput.toLowerCase() === 'ekpendudakore@gmail.com') {
        setStatusMessage({ type: 'success', text: 'Administrator credentials verified. Access granted.' });
        closeAuthModal();
        router.push('/admin');
      } else {
        setStatusMessage({ type: 'success', text: 'Signed in successfully.' });
        setTimeout(() => {
          closeAuthModal();
        }, 400);
      }
    }, 250);
  };

  // Handle Sign Out
  const handleSignOut = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      signOut();
      setIsSubmitting(false);
      closeAuthModal();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-600/10 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              {isLoggedIn ? (user?.avatarInitial || 'U') : <User className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {isLoggedIn && authModalMode === 'signout' ? 'Account Session' : authModalMode === 'create' ? 'Create Account' : 'Sign In'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Public Intel Security Africa
              </p>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (Only when logged out) */}
        {!isLoggedIn && (
          <div className="px-5 pt-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex gap-4 shrink-0 bg-slate-50/30 dark:bg-slate-900/30">
            <button
              onClick={() => { setAuthModalMode('signin'); setStatusMessage(null); }}
              className={`pb-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                authModalMode === 'signin'
                  ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              onClick={() => { setAuthModalMode('create'); setStatusMessage(null); }}
              className={`pb-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                authModalMode === 'create'
                  ? 'border-amber-600 text-amber-700 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>
        )}

        {/* Status Message Notification */}
        {statusMessage && (
          <div className={`mx-5 mt-4 p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
            statusMessage.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/60'
              : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60'
          }`}>
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">

          {/* ========================================================= */}
          {/* VIEW 1: LOGGED IN USER OVERVIEW                           */}
          {/* ========================================================= */}
          {isLoggedIn && authModalMode === 'signout' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
                    {user?.avatarInitial || 'U'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.displayName || user?.fullName || 'User'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {user?.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {user?.role === 'admin' ? 'Administrator' : 'Reader'}
                    </span>
                  </div>
                </div>

                {user?.role === 'admin' ? (
                  <Link
                    href="/admin"
                    onClick={closeAuthModal}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white border border-amber-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={closeAuthModal}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                  >
                    <span>Dashboard</span>
                  </Link>
                )}
              </div>

              {/* Reader Quick Links (non-admin) */}
              {user?.role !== 'admin' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/dashboard"
                    onClick={closeAuthModal}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold truncate">Saved Articles</span>
                  </Link>

                  <Link
                    href="/dashboard"
                    onClick={closeAuthModal}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 flex items-center gap-2 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Bell className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold truncate">Notifications</span>
                  </Link>
                </div>
              )}

              {/* Sign Out Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Signing Out...' : 'Sign Out'}</span>
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CLEAN SIGN IN FORM                                */}
          {/* ========================================================= */}
          {!isLoggedIn && authModalMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5">
              
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password recovery link has been sent to your email.')}
                    className="text-[10.5px] text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-0.5">
                <input
                  type="checkbox"
                  checked={signInForm.rememberMe}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember this device</span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                </button>
              </div>

              {/* Switch to Create Account */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('create'); setStatusMessage(null); }}
                    className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: CLEAN CREATE ACCOUNT FORM                         */}
          {/* ========================================================= */}
          {!isLoggedIn && authModalMode === 'create' && (
            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="At least 6 chars"
                    value={createForm.password}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password"
                    value={createForm.confirmPassword}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={createForm.agreeTerms}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 mt-0.5"
                  required
                />
                <span>
                  I agree to the Public Intel Security Africa reader terms and privacy charter.
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </div>

              {/* Switch to Sign In */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('signin'); setStatusMessage(null); }}
                    className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
