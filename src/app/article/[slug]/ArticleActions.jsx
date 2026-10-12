'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Printer, Bookmark, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ArticleActions({ title, slug, article }) {
  const { user, isLoggedIn, openAuthModal } = useAuth();
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Sync bookmark state with per-user localStorage
  useEffect(() => {
    if (!user?.email) {
      setBookmarked(false);
      return;
    }

    const checkSaved = () => {
      try {
        const userKey = `pi_saved_articles_${user.email.toLowerCase()}`;
        const stored = localStorage.getItem(userKey);
        if (stored) {
          const list = JSON.parse(stored);
          const isSaved = list.some(item => (article?.id && item.id === article.id) || item.slug === slug);
          setBookmarked(isSaved);
        } else {
          setBookmarked(false);
        }
      } catch (_) {
        setBookmarked(false);
      }
    };

    checkSaved();
    window.addEventListener('pi_saved_articles_updated', checkSaved);
    return () => window.removeEventListener('pi_saved_articles_updated', checkSaved);
  }, [user?.email, slug, article?.id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleBookmark = () => {
    if (!isLoggedIn || !user?.email) {
      openAuthModal('signin');
      return;
    }

    const userKey = `pi_saved_articles_${user.email.toLowerCase()}`;
    try {
      const stored = localStorage.getItem(userKey);
      let currentList = stored ? JSON.parse(stored) : [];
      const isSaved = currentList.some(item => (article?.id && item.id === article.id) || item.slug === slug);

      let updatedList;
      if (isSaved) {
        updatedList = currentList.filter(item => !((article?.id && item.id === article.id) || item.slug === slug));
      } else {
        const articleToSave = {
          id: article?.id || slug,
          slug: slug,
          title: title || article?.title,
          categoryName: article?.categoryName || 'Defense & Security',
          region: article?.region || 'Continental Africa',
          excerpt: article?.excerpt || article?.subtitle || '',
          coverImage: article?.coverImage,
          readTime: article?.readTime || '5 min read',
          threatLevel: article?.threatLevel || 'Elevated',
          savedAt: new Date().toISOString()
        };
        updatedList = [articleToSave, ...currentList];
      }

      localStorage.setItem(userKey, JSON.stringify(updatedList));
      setBookmarked(!isSaved);
      window.dispatchEvent(new Event('pi_saved_articles_updated'));
    } catch (_) {}
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
      <div className="flex items-center gap-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
          Actions:
        </span>
        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs font-semibold"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />}
          <span>{copied ? 'Link Copied!' : 'Share Dossier'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700 shadow-2xs font-semibold"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Print / PDF Brief</span>
        </button>
      </div>

      <button
        onClick={toggleBookmark}
        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border shadow-2xs font-semibold ${
          bookmarked
            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800 font-bold'
            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
        }`}
      >
        <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-amber-600 dark:fill-amber-400 text-amber-600 dark:text-amber-400' : ''}`} />
        <span>{bookmarked ? 'Saved to Intel Briefcase' : 'Bookmark Report'}</span>
      </button>
    </div>
  );
}
