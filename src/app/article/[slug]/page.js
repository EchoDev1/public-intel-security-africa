import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  Shield, 
  Clock, 
  Globe, 
  Calendar, 
  CheckCircle2, 
  ArrowLeft, 
  Lock
} from 'lucide-react';
import { ARTICLES, getArticleBySlug } from '@/lib/data/articles';
import ArticleCard from '@/components/ArticleCard';
import AudioArticlePlayer from './AudioArticlePlayer';
import ArticleActions from './ArticleActions';

export function generateStaticParams() {
  return ARTICLES.map((art) => ({ slug: art.slug }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug) || ARTICLES[0];

  if (!article) {
    notFound();
  }

  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="py-10 px-4 max-w-5xl mx-auto space-y-10 bg-white">
      
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200 font-medium">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-amber-800">Home</Link>
          <span>/</span>
          <Link href={`/coverage/${article.categorySlug}`} className="hover:text-amber-800 font-bold text-amber-800">
            {article.categoryName}
          </Link>
          <span>/</span>
          <span className="truncate max-w-[200px] md:max-w-xs text-slate-400">{article.title}</span>
        </div>

        <Link
          href={`/coverage/${article.categorySlug}`}
          className="hidden sm:flex items-center gap-1 hover:text-amber-800 transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Category</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-md bg-amber-700 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
            {article.categoryName}
          </span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
            article.threatLevel === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
            article.threatLevel === 'Elevated' ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {article.threatLevel} Threat Assessment
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Globe className="w-3.5 h-3.5 text-amber-700" />
            {article.region} ({article.country})
          </span>
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 font-serif leading-tight">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-300 font-serif italic leading-relaxed">
            {article.subtitle}
          </p>
        )}

        {/* Executive Summary / Investigative Assessment */}
        {article.excerpt && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border-l-4 border-amber-600 dark:border-amber-500 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-sm md:text-base leading-relaxed font-sans font-medium">
            <span className="block text-[11px] font-black uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">
              Investigative Assessment & Strategic Brief
            </span>
            {article.excerpt}
          </div>
        )}

        {/* Metadata & Author Bar */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shrink-0">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{article.author.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{article.author.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="space-y-2">
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
        {article.coverCaption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic px-2">
            {article.coverCaption}
          </p>
        )}
      </div>

      {/* Audio Narration & Actions Bar */}
      <AudioArticlePlayer title={article.title} readTime={article.readTime} />
      <ArticleActions title={article.title} slug={article.slug} />

      {/* Executive Intelligence Findings & Key Takeaways Highlight Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-3 shadow-xs">
          <h4 className="text-xs font-black uppercase tracking-widest text-amber-900 dark:text-amber-400 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Executive Intelligence Findings & Strategic Takeaways</span>
          </h4>
          <ul className="space-y-2.5 text-sm text-slate-800 dark:text-slate-200">
            {article.keyTakeaways.map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Investigative Content Body */}
      <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-800 dark:text-slate-200 text-base md:text-lg leading-relaxed font-sans border-b border-slate-200 dark:border-slate-800 pb-10">
        <div className="whitespace-pre-line">
          {article.content}
        </div>
      </div>

      {/* Verified Sources & Intelligence Citations */}
      {article.sources && article.sources.length > 0 && (
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Sources & Intelligence Citations</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 font-mono">
            {article.sources.map((src, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="text-amber-800 dark:text-amber-400 font-bold">[{i + 1}]</span>
                <span>{src}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Editorial Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <strong>Editorial Notice:</strong> This intelligence dossier is published by the Public Intel Security Africa Bureau (Plugins Media Limited). All geospatial references and satellite telemetry have been independently verified in compliance with pan-African strategic journalism ethics.
      </div>

      {/* Related Intelligence Dossiers */}
      <section className="pt-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 font-serif">
          Related Security Dossiers & Field Dispatches
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedArticles.map((rel) => (
            <ArticleCard key={rel.id} article={rel} />
          ))}
        </div>
      </section>

    </article>
  );
}
