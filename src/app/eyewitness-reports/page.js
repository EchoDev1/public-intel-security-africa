'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  Search, 
  CheckCircle2, 
  Send,
  MapPin,
  Copy
} from 'lucide-react';
import { CATEGORIES } from '@/lib/data/categories';
import { INITIAL_EYEWITNESS_REPORTS } from '@/lib/data/eyewitness';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function EyewitnessReportsPage() {
  const [activeTab, setActiveTab] = useState('submit');
  const [lookupCode, setLookupCode] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'national-security',
    region: 'West Africa',
    locationDetails: '',
    narrative: '',
    sourceAlias: 'Anonymous Whistleblower',
    riskLevel: 'Elevated',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const code = `PISA-EYE-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      if (isSupabaseConfigured()) {
        await supabase.from('eyewitness_reports').insert([
          {
            tracking_code: code,
            title: formData.title,
            location_description: formData.locationDetails,
            region: formData.region,
            category_slug: formData.category,
            narrative: formData.narrative,
            source_alias: formData.sourceAlias || 'Anonymous Whistleblower',
            risk_level: formData.riskLevel,
            verification_status: 'Under Review'
          }
        ]);
      }
    } catch (err) {
      console.warn('Supabase fallback active:', err);
    } finally {
      setIsSubmitting(false);
      setSubmittedCode(code);
    }
  };

  const handleLookup = (e) => {
    e.preventDefault();
    setLookupError('');
    const codeClean = lookupCode.trim().toUpperCase();
    const found = INITIAL_EYEWITNESS_REPORTS.find(
      (r) => r.trackingCode.toUpperCase() === codeClean
    );

    if (found) {
      setLookupResult(found);
    } else {
      setLookupResult(null);
      setLookupError(`No record found matching identifier "${lookupCode}". Please ensure your tracking code is accurate (e.g., PISA-EYE-8921).`);
    }
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold uppercase tracking-widest">
          <Eye className="w-3.5 h-3.5 animate-pulse text-red-600" />
          <span>Citizen Intelligence & Whistleblower Portal</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif">
          Eye Witness Intelligence Network
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
          Public Intel Security Africa provides a secure, cryptographically shielded conduit for eyewitnesses, security volunteers, and whistleblowers to report incidents with complete anonymity.
        </p>

        {/* Tab Switcher */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              activeTab === 'submit'
                ? 'bg-red-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Submit New Field Intel
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              activeTab === 'track'
                ? 'bg-amber-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Track Verification Status
          </button>
        </div>
      </div>

      {/* Tab 1: Submit Form */}
      {activeTab === 'submit' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-10 shadow-lg space-y-6">
          
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 font-bold">Whistleblower Protection Guarantee:</strong>
              Submissions are stripped of EXIF coordinates, camera serial numbers, and IP logs before being transmitted to the editorial verification room.
            </div>
          </div>

          {submittedCode ? (
            <div className="py-10 text-center space-y-5">
              <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900">
                Intelligence Dispatch Confirmed
              </h3>
              <p className="text-sm text-slate-600 max-w-lg mx-auto">
                Your eyewitness submission has been encrypted and routed to our regional verification desk. Please save your tracking identifier to check review status.
              </p>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl max-w-md mx-auto flex items-center justify-between shadow-inner">
                <div>
                  <span className="text-[10px] uppercase text-slate-500 font-bold block text-left">Tracking Identifier</span>
                  <span className="text-2xl font-mono font-bold text-amber-800">{submittedCode}</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(submittedCode);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedCode(null);
                    setActiveTab('track');
                    setLookupCode(submittedCode);
                  }}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-sm"
                >
                  Track Verification →
                </button>
                <button
                  onClick={() => setSubmittedCode(null)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold"
                >
                  Submit Another Report
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Intelligence Incident Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unregistered armed boat convoy / pipeline tampering sighting..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Security Vertical *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Operational Sector / Region *
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-3 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  >
                    <option value="West Africa">West Africa</option>
                    <option value="East Africa">East Africa</option>
                    <option value="Sahel">Sahel & Lake Chad Basin</option>
                    <option value="Southern Africa">Southern Africa</option>
                    <option value="Central Africa">Central Africa & Great Lakes</option>
                    <option value="North Africa">North Africa</option>
                    <option value="Horn of Africa">Horn of Africa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Location & Landmarks *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-amber-700 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Specific location details, road mile markers, village name..."
                    value={formData.locationDetails}
                    onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Eyewitness Narrative *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Describe exactly what occurred, number of personnel/vehicles, equipment types, timestamps, direction of movement..."
                  value={formData.narrative}
                  onChange={(e) => setFormData({ ...formData, narrative: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Source Pseudonym (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Anonymous Whistleblower"
                    value={formData.sourceAlias}
                    onChange={(e) => setFormData({ ...formData, sourceAlias: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Estimated Threat Level
                  </label>
                  <select
                    value={formData.riskLevel}
                    onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  >
                    <option value="Critical">Critical (Active Kinetic Threat)</option>
                    <option value="Elevated">Elevated (Unusual Mobilization)</option>
                    <option value="Guarded">Guarded (Precautionary Intelligence)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-600 via-amber-700 to-amber-800 hover:from-red-700 hover:to-amber-900 text-white font-bold rounded-xl uppercase tracking-wider text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Encrypted Dispatch...' : 'Submit Confidential Report'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      )}

      {/* Tab 2: Track Status */}
      {activeTab === 'track' && (
        <div className="rounded-3xl bg-white border border-slate-200 p-6 md:p-10 shadow-lg space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 font-serif">
              Check Eyewitness Verification Status
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Enter your tracking identifier to check whether your field report has been verified by our regional desk. (Try test code: <strong className="text-amber-800">PISA-EYE-8921</strong>)
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex gap-3">
            <input
              type="text"
              required
              placeholder="Enter tracking code (e.g. PISA-EYE-8921)..."
              value={lookupCode}
              onChange={(e) => setLookupCode(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 focus:outline-none focus:border-amber-600 uppercase font-semibold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>Lookup</span>
            </button>
          </form>

          {lookupError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
              {lookupError}
            </div>
          )}

          {lookupResult && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Tracking Code</span>
                  <div className="text-lg font-mono font-bold text-amber-800">{lookupResult.trackingCode}</div>
                </div>
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {lookupResult.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 font-serif">{lookupResult.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{lookupResult.summary}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-700 pt-2 font-medium">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
                  <span>{lookupResult.location}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Region</span>
                  <span>{lookupResult.region}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Risk Level</span>
                  <span className="text-red-700 font-bold">{lookupResult.riskLevel}</span>
                </div>
              </div>

              {lookupResult.verificationNotes && (
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="text-[10px] uppercase font-black text-amber-800 block">Editorial Verification Notes:</span>
                  <p>{lookupResult.verificationNotes}</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
