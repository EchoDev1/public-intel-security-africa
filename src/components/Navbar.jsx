'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Shield, 
  Search, 
  Radio as RadioIcon, 
  Tv, 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight,
  Eye, 
  Sparkles, 
  ShieldCheck,
  User,
  Headphones, 
  Camera,
  Layers,
  FileText,
  Users,
  Award,
  Video,
  Handshake,
  PhoneCall,
  Calendar,
  Compass,
  Moon,
  Sun,
  Globe2
} from 'lucide-react';
import { CATEGORIES, SPECIALIZED_HUBS } from '@/lib/data/categories';
import { useRadio } from '@/context/RadioContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import SearchModal from './SearchModal';
import EyewitnessModal from './EyewitnessModal';
import UserAuthModal from './UserAuthModal';
import Logo from './Logo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mediaDropdownOpen, setMediaDropdownOpen] = useState(false);
  const [partnerDropdownOpen, setPartnerDropdownOpen] = useState(false);
  const [fullDrawerOpen, setFullDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [eyewitnessModalOpen, setEyewitnessModalOpen] = useState(false);
  const [utcTime, setUtcTime] = useState('');
  const [compactUtcTime, setCompactUtcTime] = useState('');

  const { isPlaying, togglePlay } = useRadio();
  const { theme, isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
      const d = now.getUTCDate().toString().padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m = months[now.getUTCMonth()];
      const y = now.getUTCFullYear();
      const hh = now.getUTCHours().toString().padStart(2, '0');
      const mm = now.getUTCMinutes().toString().padStart(2, '0');
      const ss = now.getUTCSeconds().toString().padStart(2, '0');
      setCompactUtcTime(`${d} ${m} ${y} ${hh}:${mm}:${ss} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Topmost Utility Bar - White in Light Mode, Dark in Dark Mode */}
      <div className="bg-white text-slate-700 border-b border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 text-[11px] py-1.5 px-2.5 sm:px-4 font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <span className="flex items-center gap-1 sm:gap-1.5 text-amber-700 dark:text-amber-400 font-semibold font-sans text-[10px] sm:text-[11px] shrink-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              BUREAU RADAR ACTIVE
            </span>
            <span className="inline text-slate-300 dark:text-slate-600 text-[10px] sm:text-xs">|</span>
            <span className="inline text-[9px] sm:text-[10.5px] font-mono text-slate-600 dark:text-slate-300 shrink-0">
              <span className="sm:hidden">{compactUtcTime || '14 Oct 2026 00:00:00 UTC'}</span>
              <span className="hidden sm:inline">{utcTime || '2026-09-28 UTC'}</span>
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400 hidden lg:inline">Pan-African & Global Defense Dispatch</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <button 
              onClick={() => togglePlay()}
              className="flex items-center gap-1.5 text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-sans font-bold text-[10.5px] sm:text-xs uppercase tracking-wider transition-colors"
            >
              <RadioIcon className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin text-red-500' : 'text-amber-600 dark:text-amber-400'}`} />
              <span className="hidden xs:inline">{isPlaying ? 'PAUSE RADIO' : 'LISTEN LIVE'}</span>
              <span className="xs:hidden">RADIO</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            {(isLoggedIn && (user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com')) ? (
              <>
                <Link 
                  href="/admin" 
                  className="hover:text-amber-800 text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5 font-sans text-[10.5px] sm:text-xs tracking-wider"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>ADMIN DASHBOARD</span>
                </Link>
                <span className="text-slate-300 dark:text-slate-600">|</span>
              </>
            ) : null}

            <button 
              onClick={() => openAuthModal(isLoggedIn ? 'signout' : 'signin')}
              className="hover:text-amber-700 text-slate-700 dark:hover:text-amber-400 dark:text-slate-300 transition-colors flex items-center gap-1 font-sans text-[10.5px] sm:text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
              <span>{isLoggedIn ? 'MY ACCOUNT' : 'SIGN IN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Brand Section */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white relative z-30 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Brand Identity */}
          <div className="w-full md:w-auto flex items-center justify-start shrink-0">
            <Logo variant={isDark ? "dark" : "light"} size="default" />
          </div>

          {/* Right Action Widgets */}
          <div className="w-full md:w-auto flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
            {/* The Navigation Menu Button - Bar Icon Alone */}
            <button
              onClick={() => setFullDrawerOpen(true)}
              className="p-1.5 sm:p-2.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-amber-700 dark:hover:bg-amber-600 text-white font-bold transition-colors border border-slate-800 dark:border-slate-700 shadow-sm flex items-center justify-center"
              title="Open Navigation Menu & Coverage Directory"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>

            {/* Submit Eye Witness Intel */}
            <button
              onClick={() => setEyewitnessModalOpen(true)}
              className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-lg shadow-md flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-105"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 animate-pulse" />
              <span className="hidden sm:inline">Submit Eye Witness Intel</span>
              <span className="sm:hidden">Submit Intel</span>
            </button>

            {/* Search Intelligence Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-1.5 sm:p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1 sm:gap-2 text-[11px] sm:text-xs"
              title="Search Intelligence"
              aria-label="Search Intelligence"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-mono text-[11px] font-bold">SEARCH</span>
            </button>

            {/* Dark Mode Switcher Icon - Positioned after Search */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center justify-center text-xs"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Navigation Bar - All 9 Features Fully Visible, No Clipping */}
      <nav className={`sticky top-0 z-20 transition-all duration-200 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md border-b border-slate-200 dark:border-slate-800' 
          : 'bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-1.5 sm:py-2">
          
          {/* All 9 Feature Items: Clean wrap on mobile, strictly single straight line on desktop */}
          <div className="flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-between xl:justify-center gap-x-1 sm:gap-x-1.5 md:gap-x-2 lg:gap-x-2 xl:gap-x-3 2xl:gap-x-4 gap-y-1 sm:gap-y-1.5 text-[10px] sm:text-[10.5px] md:text-[11px] lg:text-[11px] xl:text-xs font-bold uppercase tracking-tight lg:tracking-normal text-slate-700 dark:text-slate-300 w-full mx-auto">
            
            {/* 1. Special Reports */}
            <Link 
              href="/special-reports" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/special-reports' 
                  ? 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Special Reports
            </Link>

            {/* 2. Community Reports */}
            <Link 
              href="/community-reports" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/community-reports' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              Community Reports
            </Link>

            {/* 3. Eye Witness */}
            <Link 
              href="/eyewitness-reports" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/eyewitness-reports' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              Eye Witness
            </Link>

            {/* 4. Webinar */}
            <Link 
              href="/webinars" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/webinars' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              Webinar
            </Link>

            {/* 5. Broadcast & Media Dropdown */}
            <div 
              className="relative shrink-0"
              onMouseEnter={() => setMediaDropdownOpen(true)}
              onMouseLeave={() => setMediaDropdownOpen(false)}
            >
              <button
                className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-0.5 sm:gap-1 whitespace-nowrap transition-colors ${
                  pathname === '/radio' || pathname === '/television' || pathname === '/podcasts' || pathname === '/gallery'
                    ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black'
                    : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
                }`}
              >
                <span>Broadcast & Media</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {mediaDropdownOpen && (
                <div className="absolute top-full left-0 w-64 bg-white dark:bg-white border border-slate-200 dark:border-slate-200 rounded-xl shadow-xl p-3 space-y-1 animate-in fade-in duration-150 z-50">
                  <Link
                    href="/radio"
                    onClick={() => setMediaDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    <RadioIcon className="w-4 h-4 text-amber-600" />
                    <div>
                      <span className="block font-bold">PI Security Radio</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-normal">24/7 Live Stream & Schedule</span>
                    </div>
                  </Link>

                  <Link
                    href="/television"
                    onClick={() => setMediaDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    <Tv className="w-4 h-4 text-red-600" />
                    <div>
                      <span className="block font-bold">PI Security Television</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-normal">HD Broadcast Newsroom</span>
                    </div>
                  </Link>

                  <Link
                    href="/podcasts"
                    onClick={() => setMediaDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    <Headphones className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="block font-bold">PI Security Podcasts</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-normal">On-Demand Investigative Audio</span>
                    </div>
                  </Link>

                  <Link
                    href="/gallery"
                    onClick={() => setMediaDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    <Camera className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="block font-bold">News & Photo Gallery</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-normal">Visual Field Journalism</span>
                    </div>
                  </Link>

                  <Link
                    href="/coverage/world-news"
                    onClick={() => setMediaDropdownOpen(false)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold border-t border-slate-100 dark:border-slate-100 pt-2"
                  >
                    <Globe2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="block font-bold">World News Desk</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-500 font-normal">UN, Multilateral & Global Defense</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Training Academy */}
            <Link 
              href="/training" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/training' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              Training Academy
            </Link>

            {/* 7. Women in Security */}
            <Link 
              href="/women-in-security" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/women-in-security' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-600" />
              <span>Women in Security</span>
            </Link>

            {/* 8. Partnership Dropdown */}
            <div 
              className="relative shrink-0"
              onMouseEnter={() => setPartnerDropdownOpen(true)}
              onMouseLeave={() => setPartnerDropdownOpen(false)}
            >
              <button
                className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md flex items-center gap-0.5 sm:gap-1 whitespace-nowrap transition-colors ${
                  pathname === '/partnership' || pathname === '/collaboration'
                    ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black'
                    : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
                }`}
              >
                <span>Partnership</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {partnerDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white dark:bg-white border border-slate-200 dark:border-slate-200 rounded-xl shadow-xl p-2 space-y-1 animate-in fade-in duration-150 z-50">
                  <Link
                    href="/partnership"
                    onClick={() => setPartnerDropdownOpen(false)}
                    className="block p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    Partnership
                  </Link>
                  <Link
                    href="/collaboration"
                    onClick={() => setPartnerDropdownOpen(false)}
                    className="block p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-50 text-slate-800 dark:text-slate-800 hover:text-amber-800 dark:hover:text-amber-800 text-xs font-semibold"
                  >
                    Collaboration
                  </Link>
                </div>
              )}
            </div>

            {/* 9. Contacts */}
            <Link 
              href="/contacts" 
              className={`px-1.5 sm:px-2 md:px-2 lg:px-2.5 xl:px-3 py-1 sm:py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                pathname === '/contacts' 
                  ? 'text-amber-800 dark:text-amber-800 bg-amber-50 dark:bg-amber-100/80 font-black' 
                  : 'hover:text-amber-700 dark:hover:text-amber-700 hover:bg-slate-100 dark:hover:bg-slate-100 text-slate-700 dark:text-slate-800'
              }`}
            >
              Contacts
            </Link>
          </div>

        </div>
      </nav>

      {/* Full Comprehensive Menu & Directory Drawer */}
      {fullDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl p-5 sm:p-6 overflow-y-auto flex flex-col justify-between transition-colors">
            <div className="space-y-6">
              
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <Logo variant={isDark ? "dark" : "light"} size="compact" showTagline={true} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-400 transition-colors"
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    aria-label="Toggle Dark Mode"
                  >
                    {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                  </button>
                  <button
                    onClick={() => setFullDrawerOpen(false)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                    aria-label="Close Menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* The 25 Coverage Verticals - Only Features Inside Menu */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/coverage/${cat.slug}`}
                      onClick={() => setFullDrawerOpen(false)}
                      className="p-2 sm:p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-400 font-semibold border border-slate-200/70 dark:border-slate-700/60 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 group-hover:scale-125 transition-transform shrink-0"></span>
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors shrink-0 ml-1" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* User Account Quick Access in Drawer */}
              {isLoggedIn ? (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {user?.avatarInitial || 'D'}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user?.displayName || 'User'} <span className="text-[10px] font-bold text-amber-600">({(user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com') ? 'Super Admin' : (user?.role || 'reader')})</span>
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {user?.email || 'Ekpendudakore@gmail.com'}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={(user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com') ? "/admin" : "/dashboard"}
                      onClick={() => setFullDrawerOpen(false)}
                      className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 shrink-0"
                    >
                      <span>{(user?.role === 'admin' || user?.email?.toLowerCase() === 'ekpendudakore@gmail.com') ? "Admin Dashboard" : "Dashboard"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <button
                      onClick={() => { setFullDrawerOpen(false); openAuthModal('signout'); }}
                      className="text-red-600 dark:text-red-400 font-bold hover:underline"
                    >
                      Sign Out
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      onClick={() => { setFullDrawerOpen(false); openAuthModal('create'); }}
                      className="text-slate-600 dark:text-slate-400 font-bold hover:text-amber-600"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Reader Portal</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => { setFullDrawerOpen(false); openAuthModal('signin'); }}
                      className="px-2.5 py-1 rounded bg-amber-700 text-white font-bold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setFullDrawerOpen(false); openAuthModal('create'); }}
                      className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white font-bold"
                    >
                      Register
                    </button>
                  </div>
                </div>
              )}

            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              A Multi-Platform Security Media Production of <strong>Plugins Media Limited</strong>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
      <EyewitnessModal isOpen={eyewitnessModalOpen} onClose={() => setEyewitnessModalOpen(false)} />
      <UserAuthModal />
    </>
  );
}
