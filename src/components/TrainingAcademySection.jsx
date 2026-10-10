'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Award, BookOpen, Clock, Users, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TRAINING_COURSES } from '@/lib/data/training';

export default function TrainingAcademySection() {
  return (
    <section className="py-10 sm:py-14 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 sm:pb-8 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="text-xs font-black uppercase tracking-widest text-amber-800 dark:text-amber-400">
                Strategic Capacity Building
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
              Public Intel Security Training Academy
            </h2>
            <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Accredited intelligence masterclasses, open-source intelligence (OSINT) training, hostile environment awareness (HEAT), and critical cyber defense certifications.
            </p>
          </div>

          <Link
            href="/training"
            className="inline-flex items-center gap-2 text-xs text-amber-800 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 font-bold uppercase tracking-wider transition-colors"
          >
            <span>View All Academy Courses</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Courses Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TRAINING_COURSES.map((course) => (
            <div
              key={course.id}
              className="group rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-amber-600 dark:hover:border-amber-500 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Course Image */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <Image
                    src={course.coverImage}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[10px] font-mono font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700 shadow-xs">
                    {course.code}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium">
                    <span className="font-bold text-amber-300">{course.level}</span>
                    <span className="font-mono">{course.duration}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 bg-white dark:bg-slate-800/90">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors leading-snug font-serif">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="text-[10px] uppercase font-black text-amber-800 dark:text-amber-400 tracking-wider">
                      Accredited Credential:
                    </div>
                    <div className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{course.badge}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card */}
              <div className="p-5 sm:p-6 pt-0 bg-white dark:bg-slate-800/90">
                <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="block text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold">Next Cohort:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{course.nextCohort}</span>
                  </div>

                  <Link
                    href="/training"
                    className="px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
