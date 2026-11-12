'use client';

import React, { useState } from 'react';
import { Handshake, Send, CheckCircle2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function PartnershipPage({ mode = 'partnership' }) {
  const isCollaboration = mode === 'collaboration';

  const [formData, setFormData] = useState({
    orgName: '',
    contactName: '',
    email: '',
    phone: '',
    pillar: isCollaboration 
      ? 'Institutional Collaboration & Co-Production' 
      : 'Institutional Research & Defense Think-Tank',
    country: '',
    proposal: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const inquiryType = isCollaboration ? 'Collaboration' : 'Partnership';

    try {
      // 1. Submit through the server API endpoint (bypasses client RLS restrictions & sends receipt email)
      const res = await fetch('/api/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: inquiryType,
          isCollaboration
        })
      });

      if (!res.ok) {
        // Fallback to direct client insert if API has connection issue
        if (isSupabaseConfigured()) {
          await supabase.from('partnership_inquiries').insert([
            {
              organization_name: formData.orgName,
              contact_name: formData.contactName,
              contact_email: formData.email,
              contact_phone: formData.phone,
              partnership_pillar: formData.pillar,
              country: formData.country,
              proposal_summary: `[${inquiryType.toUpperCase()}] ${formData.proposal}`,
              status: 'Received'
            }
          ]);
        }
      }

      // Notify any open admin dashboard tabs
      if (typeof window !== 'undefined') {
        try {
          window.dispatchEvent(new CustomEvent('pisa_inquiries_updated'));
          if (window.BroadcastChannel) {
            const bc = new BroadcastChannel('pisa_inquiries_channel');
            bc.postMessage({ type: inquiryType });
            bc.close();
          }
        } catch (_) {}
      }
    } catch (err) {
      console.warn('Partnership submission notice:', err);
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
          <span>{isCollaboration ? 'Strategic Collaboration & Co-Production' : 'Strategic Alliances & Bureau Relations'}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          {isCollaboration ? 'Institutional Collaboration & Media Syndication' : 'Partnership & Strategic Cooperation'}
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          {isCollaboration
            ? 'Collaborate with Public Intel Security Africa on joint research whitepapers, televised defense roundtables, investigative documentaries, and academic co-hosting.'
            : 'Public Intel Security Africa partners with continental defense institutions, AU/UN agencies, think-tanks, academic faculties, and media syndicates to expand security communication and solution-driven summits.'}
        </p>
      </div>

      {/* Pillars of Partnership / Collaboration */}
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
            {isCollaboration ? 'Initiate an Institutional Collaboration Proposal' : 'Initiate a Strategic Partnership Proposal'}
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
              Thank you for reaching out. The Executive Directorate at Public Intel Security Africa (Plugins Media Limited) has received your {isCollaboration ? 'collaboration' : 'partnership'} inquiry.
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Designated Officer / Lead Contact *</label>
                <input
                  type="text"
                  required
                  placeholder="Full name & title"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="official@organization.org"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Telephone / Secure Line</label>
                <input
                  type="tel"
                  placeholder="+234 ... / +254 ..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Proposed Pillar of Alignment</label>
                <select
                  value={formData.pillar}
                  onChange={(e) => setFormData({ ...formData, pillar: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                >
                  <option value="Institutional Research & Defense Think-Tank">Institutional Research & Defense Think-Tank</option>
                  <option value="Media Syndication & Broadcast Distribution">Media Syndication & Broadcast Distribution</option>
                  <option value="Executive Defense Training & Fellowships">Executive Defense Training & Fellowships</option>
                  <option value="Continental Security Summits & Events">Continental Security Summits & Events</option>
                  <option value="Early Warning Telemetry & Maritime Radar">Early Warning Telemetry & Maritime Radar</option>
                  <option value="Women in Security Leadership Co-Production">Women in Security Leadership Co-Production</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Country / Headquarter Base *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nigeria, Kenya, South Africa, Senegal..."
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Executive Summary / Cooperation Scope *</label>
              <textarea
                required
                rows={4}
                placeholder="Briefly describe your institutional focus, proposed areas of cooperation, joint project concepts, or syndication requirements..."
                value={formData.proposal}
                onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Transmitting Proposal...' : `Transmit ${isCollaboration ? 'Collaboration' : 'Partnership'} Proposal`}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
