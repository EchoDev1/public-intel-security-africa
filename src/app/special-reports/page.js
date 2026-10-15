import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';
import { getSpecialReports } from '@/lib/data/articles';
import ArticleCard from '@/components/ArticleCard';

export const metadata = {
  title: 'Special Investigative Reports & Strategic Whitepapers',
  description:
    'In-depth security dossiers, data forensics, intelligence assessments, and policy whitepapers covering continental defense, critical infrastructure, and geopolitical conflicts across Africa.',
  alternates: {
    canonical: '/special-reports',
  },
  openGraph: {
    title: 'Special Investigative Reports & Whitepapers | Public Intel Africa',
    description:
      'In-depth security dossiers, data forensics, and policy whitepapers across Africa.',
    url: '/special-reports',
  },
};

export default function SpecialReportsPage() {
  const reports = getSpecialReports();

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-8 md:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-700 text-white text-xs font-black uppercase tracking-wider shadow-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Strategic Investigative Journalism</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif leading-tight">
            Special Investigative Reports & Whitepapers
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            Multi-month investigative dossiers, satellite telemetry cross-examinations, open-source intelligence reconstructions, and continental defense policy frameworks.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 font-semibold">
            <span>Published by Senior Defense Fellows</span>
            <span>•</span>
            <span className="text-amber-800">Executive PDF Briefings Available</span>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide font-serif">
            All Investigative Dossiers
          </h2>
          <span className="text-xs text-slate-500 font-mono font-medium">
            {reports.length} Special Reports Published
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report) => (
            <ArticleCard key={report.id} article={report} />
          ))}
        </div>
      </section>

    </div>
  );
}
