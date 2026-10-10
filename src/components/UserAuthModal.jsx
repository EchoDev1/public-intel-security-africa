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
  Check, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Bookmark,
  Bell,
  Sliders,
  ExternalLink,
  Shield
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
    loginAsAdmin,
    createAccount, 
    signOut 
  } = useAuth();

  // Create Account Form State
  const [createForm, setCreateForm] = useState({
    fullName: '',
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reader',
    agreeTerms: true
  });

  // Sign In Form State
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  // Sign Out Form State
  const [signOutConfirm, setSignOutConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  // Handle Create Account Submission
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!createForm.email || !createForm.password) {
      setStatusMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    if (createForm.password.length < 6) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const isDakore = createForm.email.trim().toLowerCase() === 'ekpendudakore@gmail.com';
      if (isDakore) {
        loginAsAdmin('Ekpendudakore@gmail.com', createForm.password || 'ladydakore@artellium90');
        setIsSubmitting(false);
        setStatusMessage({ type: 'success', text: 'Welcome Lady Dakore! Redirecting straight to Admin Dashboard...' });
        closeAuthModal();
        router.push('/admin');
        return;
      }
      createAccount({
        fullName: createForm.fullName,
        displayName: createForm.displayName,
        email: createForm.email,
        password: createForm.password,
        role: createForm.role
      });
      setIsSubmitting(false);
      setStatusMessage({ type: 'success', text: 'Account created successfully! Welcome to Public Intel.' });
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

    const isDakore = emailInput.toLowerCase() === 'ekpendudakore@gmail.com';

    setIsSubmitting(true);
    setTimeout(() => {
      const res = signIn(emailInput, signInForm.password);
      setIsSubmitting(false);

      if (res?.success === false) {
        setStatusMessage({ type: 'error', text: res.error || 'Invalid email or password.' });
        return;
      }

      if (isDakore || res?.isAdmin || res?.user?.role === 'admin') {
        setStatusMessage({ type: 'success', text: 'Welcome Lady Dakore! Taking you straight to Admin Dashboard...' });
        closeAuthModal();
        router.push('/admin');
      } else {
        setStatusMessage({ type: 'success', text: 'Signed in successfully!' });
        setTimeout(() => {
          closeAuthModal();
        }, 400);
      }
    }, 250);
  };

  // Quick Sign In As Lady Dakore Admin (Takes directly to Admin Dashboard)
  const handleQuickAdminSignIn = () => {
    loginAsAdmin('Ekpendudakore@gmail.com', 'ladydakore@artellium90');
    setStatusMessage({ type: 'success', text: 'Welcome Lady Dakore! Taking you straight to Admin Dashboard...' });
    closeAuthModal();
    router.push('/admin');
  };

  // Quick Sign In As Harris
  const handleQuickDemoSignIn = () => {
    signIn('iamharriswalter@gmail.com', 'password123');
    closeAuthModal();
  };

  // Handle Sign Out Form Submission
  const handleSignOutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      signOut();
      setIsSubmitting(false);
      setAuthModalMode('signin');
      setStatusMessage({ type: 'success', text: 'You have been safely signed out.' });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-amber-600/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
              {isLoggedIn ? (user?.avatarInitial || 'h').toUpperCase() : <User className="w-4 h-4" />}
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {authModalMode === 'signout' && 'My Account & Session'}
                {authModalMode === 'create' && 'Create Reader Account'}
                {authModalMode === 'signin' && 'Sign In to Account'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Public Intel Security Africa Reader Portal
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

        {/* Tab Switcher if logged out */}
        {!isLoggedIn && (
          <div className="px-5 pt-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex gap-2 shrink-0 bg-slate-50/30 dark:bg-slate-900/30">
            <button
              onClick={() => { setAuthModalMode('signin'); setStatusMessage(null); }}
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
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
              className={`pb-2 px-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
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

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">

          {/* ========================================================= */}
          {/* VIEW 1: SIGN OUT FORM (When user is currently logged in) */}
          {/* ========================================================= */}
          {isLoggedIn && authModalMode === 'signout' && (
            <div className="space-y-5">
              
              {/* User Overview Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
                    {user?.avatarInitial || 'h'}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user?.displayName || 'harris'}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                      {user?.email || 'iamharriswalter@gmail.com'}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Active {user?.role || 'reader'}
                    </span>
                  </div>
                </div>

                {user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com' ? (
                  <Link
                    href="/admin"
                    onClick={closeAuthModal}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white border border-amber-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ) : (
                  <Link
                    href="/dashboard"
                    onClick={closeAuthModal}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
                  >
                    <span>Dashboard</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>

              {(user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com') && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-amber-950 text-white border border-amber-500/30 flex items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/30 border border-amber-500/40 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-300">Admin Clearance Verified</p>
                      <p className="text-[10px] text-slate-300">Lady Dakore Ekpendu • Super Administrator</p>
                    </div>
                  </div>
                  <Link
                    href="/admin"
                    onClick={closeAuthModal}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs flex items-center gap-1"
                  >
                    <span>Open Admin</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Quick Navigation to Dashboard Sections */}
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

              {/* Dedicated Functional Sign Out Form */}
              <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20 space-y-3">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold text-xs uppercase tracking-wider">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Account</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  You are currently signed in as <strong className="font-bold">{user?.displayName || 'harris'}</strong>. Signing out will conclude your session on this browser.
                </p>

                <form onSubmit={handleSignOutSubmit} className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Signing Out...' : 'Sign Out Now'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthModalMode('create')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider text-center transition-colors"
                  >
                    Switch / Create New Account
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: CREATE ACCOUNT FORM (Functional registration)     */}
          {/* ========================================================= */}
          {authModalMode === 'create' && (
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Register for a free <strong className="text-slate-900 dark:text-white">Reader Account</strong> to save field reports, customize telemetry alerts, and receive urgent briefings.
                </p>
              </div>

              {/* Full Name & Display Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harris Walter"
                    value={createForm.fullName}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. harris"
                    value={createForm.displayName}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
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
                    placeholder="e.g. iamharriswalter@gmail.com"
                    value={createForm.email}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 6 chars"
                      value={createForm.password}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Repeat password"
                      value={createForm.confirmPassword}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Account Role Selector (Defaulted to Reader) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Account Type
                </label>
                <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                        Reader Account (Default)
                      </h5>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
                        Full access to open dossiers, reading list, and field intelligence telemetry.
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-600 text-white">
                    Reader
                  </span>
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
                  I agree to the Public Intel Security Africa reader terms, privacy protection, and editorial integrity charter.
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
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
                    Sign In here
                  </button>
                </p>
              </div>

            </form>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: SIGN IN FORM (Functional authentication)          */}
          {/* ========================================================= */}
          {authModalMode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enter your email address and password to access your reader profile, saved reports, and notifications.
                </p>
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
                    placeholder="e.g. iamharriswalter@gmail.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
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
                    onClick={() => alert('Password reset link would be dispatched to your registered email.')}
                    className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline"
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
                    className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signInForm.rememberMe}
                  onChange={(e) => setSignInForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember this device</span>
              </label>

              {/* Submit Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                </button>

                {/* Quick 1-Click Admin Access (Redirects to /admin) */}
                <button
                  type="button"
                  onClick={handleQuickAdminSignIn}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-slate-900 to-amber-950 hover:from-black hover:to-amber-900 text-amber-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-amber-600/40 shadow-sm"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Newsroom Login (Lady Dakore)</span>
                </button>

                {/* Quick 1-Click Demo Login as Harris */}
                <button
                  type="button"
                  onClick={handleQuickDemoSignIn}
                  className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <div className="w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px]">h</div>
                  <span>Reader Demo Login (harris)</span>
                </button>
              </div>

              {/* Switch to Create Account */}
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Don&apos;t have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => { setAuthModalMode('create'); setStatusMessage(null); }}
                    className="text-amber-700 dark:text-amber-400 font-bold hover:underline"
                  >
                    Create Account now
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
