'use client';

import React, { useState } from 'react';
import { MapPin, Lock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-3.5 h-3.5 text-amber-700" />
          <span>Continental Bureau Network</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Bureau Directory & Security Contacts
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          Reach our investigative desks, broadcast studios, editorial board, or confidential intelligence verification units across Africa.
        </p>
      </div>

      {/* Bureau Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            West Africa (Headquarters)
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Abuja & Lagos Bureau</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Plot 428 Constitution Ave, Central Business District, Abuja, FCT, Nigeria.
          </p>
          <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
            <div>abuja.desk@publicintelsecurity.africa</div>
            <div className="font-bold">+234 (0) 902-INTEL-PISA</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            East & Horn of Africa
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Nairobi Bureau</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Riverside Square, 5th Floor Defense Media Wing, Nairobi, Kenya.
          </p>
          <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
            <div>nairobi.desk@publicintelsecurity.africa</div>
            <div className="font-bold">+254 (0) 700-SEC-AFRICA</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            Southern Africa
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Johannesburg Bureau</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sandton City Towers, 11th Floor Strategic Affairs, Johannesburg, South Africa.
          </p>
          <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
            <div>joburg.desk@publicintelsecurity.africa</div>
            <div className="font-bold">+27 (0) 11-INTEL-RADAR</div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
            North Africa
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Cairo Bureau</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            New Cairo Tech District, Strategic Media Wing, Cairo, Egypt.
          </p>
          <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono">
            <div>cairo.desk@publicintelsecurity.africa</div>
            <div className="font-bold">+20 (0) 2-DEFENSE-INTEL</div>
          </div>
        </div>
      </div>

      {/* Encrypted Whistleblower & Inquiries */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Whistleblower Notice */}
        <div className="md:col-span-5 rounded-3xl bg-red-50 border border-red-200 p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-red-700">
            <Lock className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Encrypted Whistleblower Tip Line
            </h3>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            For confidential disclosures regarding transnational arms trafficking, high-level defense corruption, or sensitive security documents:
          </p>

          <div className="p-4 rounded-xl bg-white border border-red-200 space-y-2 text-xs font-mono">
            <div className="text-red-700 font-bold">Signal / WhatsApp Secure:</div>
            <div className="text-slate-900 font-bold">+234 800-PUBLIC-INTEL</div>
            <div className="text-red-700 font-bold pt-2">Encrypted PGP Email:</div>
            <div className="text-slate-900 font-bold">secure-tips@publicintelsecurity.africa</div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Zero metadata retention. Source identities are strictly shielded under international journalistic privilege.
          </p>
        </div>

        {/* General Press Inquiries Form */}
        <div className="md:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            Send an Editorial or Media Inquiries Note
          </h3>

          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-base font-bold text-emerald-900 font-serif">Message Dispatched</h4>
              <p className="text-xs text-slate-600">
                Your communication has been forwarded to the Chief of Newsroom Operations.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                />
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <input
                type="text"
                required
                placeholder="Subject (e.g. Broadcast Syndication, Interview Request, Corrections)"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
              />

              <textarea
                required
                rows={4}
                placeholder="Message details..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-600"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Message to Bureau</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
