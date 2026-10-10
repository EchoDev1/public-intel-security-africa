'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Award, ShieldCheck, CheckCircle2, X, Check } from 'lucide-react';
import { TRAINING_COURSES } from '@/lib/data/training';

export default function TrainingPage() {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [applicantOrg, setApplicantOrg] = useState('');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const handleOpenApply = (course) => {
    setSelectedCourse(course);
    setAppliedSuccess(false);
    setApplyModalOpen(true);
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setAppliedSuccess(true);
  };

  return (
    <div className="py-12 px-4 max-w-7xl mx-auto space-y-12 bg-white">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-200 p-8 md:p-14 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-widest">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Accredited Defense & Intelligence Education</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 font-serif leading-tight">
            Public Intel Security Training Academy
          </h1>

          <p className="text-sm md:text-base text-slate-600 leading-relaxed font-medium">
            Professional capacity-building certifications in Open-Source Intelligence (OSINT), Hostile Environment Awareness Training (HEAT), and Critical Infrastructure Cyber Defense.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 font-semibold">
            <span>Accredited Certifications</span>
            <span>•</span>
            <span>Virtual Cyber Ranges</span>
            <span>•</span>
            <span className="text-emerald-700">Fellowships Available</span>
          </div>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TRAINING_COURSES.map((course) => (
          <div
            key={course.id}
            className="rounded-3xl bg-white border border-slate-200 hover:border-amber-600 p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 font-mono font-bold text-amber-800">
                  {course.code}
                </span>
                <span className="text-slate-500 font-semibold">{course.level}</span>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100">
                <Image
                  src={course.coverImage}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <h2 className="text-lg font-bold text-slate-900 font-serif leading-snug">
                {course.title}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {course.description}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-900">
                  Core Curriculum Syllabus:
                </h4>
                <ul className="space-y-1 text-xs text-slate-700 font-medium">
                  {course.syllabus.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Duration: <strong className="text-slate-900 font-mono">{course.duration}</strong></div>
                <div>Lead Instructor: <strong className="text-slate-900">{course.instructor}</strong></div>
                <div>Format: <span className="text-amber-800 font-semibold">{course.format}</span></div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Next Cohort:</span>
                <span className="text-xs font-bold text-slate-900">{course.nextCohort}</span>
              </div>
              <button
                onClick={() => handleOpenApply(course)}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-transform hover:scale-105 shadow-sm"
              >
                Apply for Cohort
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {applyModalOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {appliedSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-700">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-emerald-900 font-serif">Application Received!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your admission dossier for <strong>{selectedCourse.title}</strong> has been logged. The Academy Admissions Board will review your credentials and contact you at <strong>{applicantEmail}</strong>.
                </p>
                <button
                  onClick={() => setApplyModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Academy Admission</span>
                  <h3 className="text-base font-bold text-slate-900 font-serif mt-0.5">{selectedCourse.title}</h3>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Capt. Emmanuel Osei"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Official / Institutional Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. emmanuel@navy.gov / media"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Current Agency / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Defense Ministry / Newsroom / Risk Consultancy"
                    value={applicantOrg}
                    onChange={(e) => setApplicantOrg(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Submit Application Dossier
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
