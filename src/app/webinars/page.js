'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, X, Check } from 'lucide-react';
import { WEBINARS } from '@/lib/data/multimedia';

export default function WebinarsPage() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpOrg, setRsvpOrg] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleOpenRegister = (webinar) => {
    setSelectedWebinar(webinar);
    setRsvpSuccess(false);
    setRegisterModalOpen(true);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRsvpSuccess(true);
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>Strategic Dialogue & Executive Briefings</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Public Intel Security Africa Webinars
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          High-level virtual war rooms, defense webinars, and strategic roundtables bringing together military chiefs, intelligence directors, academic authorities, and policymakers.
        </p>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {WEBINARS.map((web) => (
          <div
            key={web.id}
            className="rounded-3xl bg-white border border-slate-200 hover:border-amber-600 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-3 py-1 rounded-md bg-amber-700 text-white font-bold uppercase tracking-wider shadow-xs">
                  {web.status}
                </span>
                <span className="text-slate-500 font-mono font-medium">{web.date} • {web.time}</span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-900 font-serif leading-snug">
                {web.title}
              </h2>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Core Tactical Agenda:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  {web.keyTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Lead Keynote: <strong className="text-slate-900">{web.leadSpeaker}</strong></div>
                <div>Platform: <span className="text-slate-700">{web.platform}</span></div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-amber-800 font-bold">{web.fee}</span>
              <button
                onClick={() => handleOpenRegister(web)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 shadow-sm"
              >
                Reserve Seat / RSVP
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RSVP Modal */}
      {registerModalOpen && selectedWebinar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setRegisterModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 font-serif">Registration Confirmed!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your seat has been reserved for <strong>{selectedWebinar.title}</strong>. An encrypted calendar invite and dial-in link have been sent to <strong>{rsvpEmail}</strong>.
                </p>
                <button
                  onClick={() => setRegisterModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Webinar RSVP</span>
                  <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">{selectedWebinar.title}</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kwame Mensah"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Professional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. kwame@defense-agency.gov"
                    value={rsvpEmail}
                    onChange={(e) => setRsvpEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Organization / Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Ministry of Defense / Naval Command / Media"
                    value={rsvpOrg}
                    onChange={(e) => setRsvpOrg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Confirm Registration
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
