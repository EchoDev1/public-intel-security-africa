'use client';

import React, { useState } from 'react';
import { Handshake, Send, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    pillar: 'Institutional Research & Defense Think-Tank',
    country: '',
    proposal: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSupabaseConfigured()) {
        await supabase.from('partnership_inquiries').insert([
          {
            organization_name: formData.orgName,
            contact_name: formData.contactName,
            contact_email: formData.email,
            contact_phone: formData.phone,
            partnership_pillar: formData.pillar,
            country: formData.country,
            proposal_summary: formData.proposal,
            status: 'Received'
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase partnership inquiry fallback:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
          <Handshake className="w-3.5 h-3.5 text-amber-700" />
          <span>Strategic Alliances & Co-Production</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Partnership & Strategic Collaboration
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          Public Intel Security Africa partners with continental defense institutions, AU/UN agencies, think-tanks, academic faculties, and media syndicates to expand security communication and solution-driven summits.
        </p>
      </div>

      {/* Pillars of Partnership */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Institutional Co-Production</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Joint research whitepapers, commissioned field documentaries, televised ministerial roundtables, and syndicated security broadcasts.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Events & High-Level Summits</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Co-hosting executive defense masterclasses, regional security conferences, and the annual Women in Security Leadership Summit.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 font-serif">Media Syndication & Broadcast</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Re-broadcasting Public Intel Radio & Television dispatches across terrestrial radio networks, digital portals, and print publications.
          </p>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-10 shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-serif">
            Initiate a Strategic Partnership Proposal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Our Director of International Cooperation & Syndication will respond within 48 hours.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-900 font-serif">Proposal Transmitted!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Thank you for reaching out. The Executive Partnership Board at Public Intel Security Africa (Plugins Media Limited) has received your inquiry.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Organization / Institution Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ECOWAS Defense Commission / Think Tank"
                  value={formData.orgName}
                  onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Contact Person & Designation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ambassador Fatima Bello (Director)"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="fatima@institution.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telephone / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+234 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Country / Headquarters</label>
                <input
                  type="text"
                  placeholder="e.g. Nigeria / Kenya / Ethiopia"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Partnership Track</label>
              <select
                value={formData.pillar}
                onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
              >
                <option value="Institutional Research & Defense Think-Tank">Institutional Research & Defense Think-Tank</option>
                <option value="Event & Summit Sponsorship / Co-Hosting">Event & Summit Sponsorship / Co-Hosting</option>
                <option value="Media Syndication & Content Broadcast">Media Syndication & Content Broadcast</option>
                <option value="Academic Fellowship & Training Academy">Academic Fellowship & Training Academy</option>
                <option value="Corporate Risk Intelligence Subscription">Corporate Risk Intelligence Subscription</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Summary of Partnership Objectives *</label>
              <textarea
                required
                rows={4}
                placeholder="Outline your organization's vision, specific areas of collaboration, and desired timeline..."
                value={formData.proposal}
                onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Proposal...' : 'Transmit Strategic Partnership Inquiry'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
