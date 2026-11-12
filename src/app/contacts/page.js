'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Lock, Send, CheckCircle2 } from 'lucide-react';

const DEFAULT_BUREAUS = [
  {
    id: 'bur-01',
    region: 'West Africa (Headquarters)',
    city: 'Abuja & Lagos Bureau',
    address: 'Plot 428 Constitution Ave, Central Business District, Abuja, FCT, Nigeria.',
    email: 'abuja.desk@publicintelsecurity.africa',
    phone: '+234 (0) 902-INTEL-PISA'
  },
  {
    id: 'bur-02',
    region: 'East & Horn of Africa',
    city: 'Nairobi Bureau',
    address: 'Riverside Square, 5th Floor Defense Media Wing, Nairobi, Kenya.',
    email: 'nairobi.desk@publicintelsecurity.africa',
    phone: '+254 (0) 700-SEC-AFRICA'
  },
  {
    id: 'bur-03',
    region: 'Southern Africa',
    city: 'Johannesburg Bureau',
    address: 'Sandton City Towers, 11th Floor Strategic Affairs, Johannesburg, South Africa.',
    email: 'joburg.desk@publicintelsecurity.africa',
    phone: '+27 (0) 11-INTEL-RADAR'
  },
  {
    id: 'bur-04',
    region: 'North Africa',
    city: 'Cairo Bureau',
    address: 'New Cairo Tech District, Strategic Media Wing, Cairo, Egypt.',
    email: 'cairo.desk@publicintelsecurity.africa',
    phone: '+20 (0) 2-DEFENSE-INTEL'
  }
];

export default function ContactsPage() {
  const [bureaus, setBureaus] = useState(DEFAULT_BUREAUS);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const fetchBureaus = async () => {
    try {
      const res = await fetch('/api/partnerships');
      const data = await res.json();
      if (data?.success && Array.isArray(data.bureaus) && data.bureaus.length > 0) {
        setBureaus(data.bureaus);
      }
    } catch (_) {}
  };

  useEffect(() => {
    fetchBureaus();
    const handleUpdate = () => fetchBureaus();
    window.addEventListener('pisa_bureau_contacts_updated', handleUpdate);
    return () => window.removeEventListener('pisa_bureau_contacts_updated', handleUpdate);
  }, []);

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
        {bureaus.map((b) => (
          <div key={b.id || b.city} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  {b.region || 'Regional Bureau'}
                </span>
                {b.isHeadquarters && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-bold">
                    HQ
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900 font-serif">{b.city}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {b.address}
              </p>
            </div>
            <div className="pt-2 text-xs text-slate-700 space-y-1 font-mono border-t border-slate-200">
              <div>{b.email}</div>
              <div className="font-bold">{b.phone}</div>
              {b.officerInCharge && (
                <div className="text-[11px] text-slate-500 font-sans pt-1">Lead: <strong>{b.officerInCharge}</strong></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Encrypted Whistleblower & Inquiries */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Whistleblower Notice */}
        <div className="md:col-span-5 rounded-3xl bg-red-50 border border-red-200 p-6 md:p-8 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-red-100 text-red-700">
              <Lock className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-red-800">
              Confidential Whistleblower Desk
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 font-serif">
            High-Risk Tip Line & Signal Hotline
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            For whistleblowers, frontline witnesses, and intelligence officers providing sensitive defense disclosures. All submissions are encrypted end-to-end and handled under strict source confidentiality.
          </p>

          <div className="p-4 rounded-xl bg-white border border-red-200 font-mono text-xs space-y-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Secure PGP Email:</span>
              <span className="text-red-700 font-bold">tipline@publicintel.africa</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Signal Encrypted Messengers:</span>
              <span className="text-slate-900 font-bold">+234 (0) 902 444 8891</span>
            </div>
          </div>
        </div>

        {/* General Inquiry Form */}
        <div className="md:col-span-7 rounded-3xl bg-slate-50 border border-slate-200 p-6 md:p-8 space-y-4 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-serif">
              General Newsroom & Media Inquiries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact our editors, symposium directors, or media producers.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">Message Dispatched</h3>
              <p className="text-xs text-emerald-700">
                Your message has been routed to the appropriate continental bureau desk. Our newsroom will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kwame Nkrumah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase text-slate-700">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="kwame@defense.gov"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-700">Subject / Inquiry Type *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Media Accreditation / Interview Request"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-slate-700">Message Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please state your inquiry, operational details, or press query..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-transform hover:scale-102"
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
