'use client';

import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, Send, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('newsletter_subscribers').insert([
          {
            email: email,
            subscriber_tier: 'Executive Daily Brief',
            interests: ['National Security', 'Maritime', 'Cybersecurity', 'Geopolitics']
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase newsletter fallback:', err);
    } finally {
      setLoading(false);
      setIsSubscribed(true);
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 p-6 sm:p-8 md:p-12 shadow-lg overflow-hidden transition-colors">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400">
                  <Mail className="w-4 h-4" />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">
                  The 0600 Hours Continental Intel Briefing
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-serif leading-tight">
                Essential Strategic Intelligence, Delivered Before the Markets Open
              </h2>

              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Join over 42,000 defense policymakers, intelligence officers, maritime operators, diplomats, and corporate risk leaders receiving our daily curated security assessments across Africa.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>No commercial ads or spam</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>One-click unencrypted opt-out</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-5">
              {isSubscribed ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Briefing Subscription Active
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Your first classified intelligence roundup will dispatch at 06:00 UTC tomorrow morning.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="Enter official or encrypted email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-600 transition-colors shadow-inner"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all hover:scale-102"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Registering Dispatch...' : 'Subscribe to Strategic Briefing'}</span>
                  </button>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center">
                    Protected by Plugins Media zero-compromise confidentiality protocols.
                  </p>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
