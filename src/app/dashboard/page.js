'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Bookmark, 
  Bell, 
  Settings, 
  LogOut, 
  ArrowRight, 
  Check, 
  Edit3, 
  Shield, 
  Mail, 
  Calendar, 
  ExternalLink, 
  Trash2, 
  X,
  Compass
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ARTICLES } from '@/lib/data/articles';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoggedIn, signOut, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  // If Lady Dakore or any Admin visits /dashboard, take her straight to /admin
  useEffect(() => {
    if (user && (user.email?.toLowerCase() === 'ekpendudakore@gmail.com' || user.role === 'admin')) {
      router.replace('/admin');
    }
  }, [user, router]);

  // User Profile State initialized with auth context
  const [profile, setProfile] = useState({
    displayName: user?.displayName || 'Reader Member',
    email: user?.email || '',
    role: user?.role || 'reader',
    joinedDate: user?.joinedDate || 'Recently Joined',
    bio: user?.bio || 'No bio added yet.',
  });

  useEffect(() => {
    if (user) {
      setProfile({
        displayName: user.displayName || 'Reader Member',
        email: user.email || '',
        role: user.role || 'reader',
        joinedDate: user.joinedDate || 'Recently Joined',
        bio: user.bio || 'No bio added yet.',
      });
    }
  }, [user]);

  // Saved Articles for Reader Harris
  const [savedArticles, setSavedArticles] = useState([
    ARTICLES[0], // Gulf of Guinea Maritime
    ARTICLES[1], // Autonomous Drone Surveillance
    ARTICLES[3], // Financial Cyber Shield
  ]);

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Priority Maritime Intelligence Alert',
      message: 'Nigerian Navy deployed new autonomous acoustic sensor grid in the Gulf of Guinea.',
      time: '35 mins ago',
      read: false
    },
    {
      id: 2,
      title: 'Breaking Cyber Bulletin',
      message: 'Pan-African CERTs successfully neutralized targeted banking ransomware across payment switches.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      title: 'Weekly Intelligence Digest Available',
      message: 'The Q3 West & Central Africa Strategic Security Assessment is now accessible in your reader portal.',
      time: 'Yesterday',
      read: true
    }
  ]);

  const removeSaved = (id, e) => {
    e.stopPropagation();
    setSavedArticles(prev => prev.filter(item => item.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 bg-slate-50/50 dark:bg-slate-950">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-white">Sign In to View Account</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Please sign in to access your reader profile, saved articles, and notifications.
          </p>
          <button
            onClick={() => openAuthModal('signin')}
            className="w-full py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-8 sm:py-12 px-3 sm:px-4 md:px-6 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-serif">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Manage your profile, saved stories, and preferences.
          </p>
        </div>

        {/* Dashboard Main Grid: Navigation Sidebar + Content View */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Navigation Sidebar */}
          <aside className="md:col-span-4 lg:col-span-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 sm:p-3 shadow-xs space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeTab === 'profile'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeTab === 'saved'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Saved Articles</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {savedArticles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeTab === 'notifications'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Notifications</span>
              </div>
              {notifications.some(n => !n.read) && (
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold border border-amber-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Settings</span>
            </button>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => openAuthModal('signout')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="md:col-span-8 lg:col-span-9 space-y-6">
            
            {/* 1. MY PROFILE TAB (Exact Replica of User's specification) */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                
                {/* Welcome Card with Avatar "h" */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex items-center gap-4 sm:gap-6 transition-colors">
                  {/* Circle Avatar with letter 'h' */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-md border-2 border-white dark:border-slate-800 shrink-0">
                    h
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-serif leading-snug">
                      Welcome back, {profile.displayName}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="font-mono text-slate-700 dark:text-slate-300">{profile.email}</span>
                      <span className="text-slate-400">•</span>
                      <span>Joined {profile.joinedDate}</span>
                    </p>
                  </div>
                </div>

                {/* Profile Information Section */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
                  <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        Profile Information
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        Your personal details and account status.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase tracking-wider border border-amber-300 dark:border-amber-800 flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Details</span>
                    </button>
                  </div>

                  {/* Profile Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Display Name
                      </label>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                        {profile.displayName}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Email Address
                      </label>
                      <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white font-mono">
                        {profile.email}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Account Role
                      </label>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                          <Check className="w-3 h-3" />
                          <span>{profile.role}</span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Bio
                      </label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        {profile.bio}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Cards: Reading List & Latest News */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  
                  {/* Reading List Card */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-600 dark:hover:border-amber-500 transition-all">
                    <div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 w-fit mb-3">
                        <Bookmark className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Reading List
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        View the articles you&apos;ve saved to read later.
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('saved')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 uppercase tracking-wider pt-2"
                    >
                      <span>Explore list</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Latest News Card */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between hover:border-amber-600 dark:hover:border-amber-500 transition-all">
                    <div>
                      <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-3">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Latest News
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Discover breaking stories and featured articles.
                      </p>
                    </div>

                    <Link
                      href="/special-reports"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 uppercase tracking-wider pt-2"
                    >
                      <span>Browse news</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                </div>

              </div>
            )}

            {/* 2. SAVED ARTICLES TAB */}
            {activeTab === 'saved' && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Saved Reading List
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      You have {savedArticles.length} articles saved in your offline reading queue.
                    </p>
                  </div>
                </div>

                {savedArticles.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
                    <p className="text-sm text-slate-500">Your reading list is empty.</p>
                    <Link
                      href="/special-reports"
                      className="inline-block px-4 py-2 rounded-lg bg-amber-700 text-white text-xs font-bold uppercase"
                    >
                      Browse Intelligence Reports
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedArticles.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-amber-600 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                            {article.categoryName} • {article.region}
                          </span>
                          <Link href={`/article/${article.slug}`}>
                            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-amber-700 transition-colors line-clamp-1">
                              {article.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {article.excerpt}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Link
                            href={`/article/${article.slug}`}
                            className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                          >
                            <span>Read</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button
                            onClick={(e) => removeSaved(article.id, e)}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Reader Notifications
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      Security bulletins, threat advisories, and editorial updates.
                    </p>
                  </div>
                  <button
                    onClick={markAllRead}
                    className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                </div>

                <div className="space-y-3">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-colors ${
                        item.read 
                          ? 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                          : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {!item.read && <span className="w-2 h-2 rounded-full bg-amber-600"></span>}
                            <span>{item.title}</span>
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            {item.message}
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {item.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs space-y-6">
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Account Settings & Preferences
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Manage email alerts, reading modes, and account security.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Breaking Intelligence Alerts
                      </h4>
                      <p className="text-xs text-slate-500">
                        Receive instant email notifications when high-priority bulletins are issued.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-xs font-bold">
                      Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Daily African Security Briefing
                      </h4>
                      <p className="text-xs text-slate-500">
                        Delivered every morning at 06:00 GMT with continuous telemetry updates.
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-xs font-bold">
                      Subscribed
                    </span>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>

      </div>

      {/* Edit Details Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Profile Details
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500 text-sm cursor-not-allowed font-mono"
                />
                <span className="text-[10px] text-slate-400">Email cannot be changed directly in reader mode.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Bio
                </label>
                <textarea
                  value={profile.bio === 'No bio added yet.' ? '' : profile.bio}
                  placeholder="Tell us a bit about yourself..."
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value || 'No bio added yet.' }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 resize-none h-20"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
