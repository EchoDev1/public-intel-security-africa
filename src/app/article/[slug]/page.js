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
  Lock,
  Play,
  Headphones
} from 'lucide-react';
import { ARTICLES, getArticleBySlug } from '@/lib/data/articles';
import { getLiveArticlesCollection } from '@/lib/articles/manager';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;
import ArticleCard from '@/components/ArticleCard';
import AudioArticlePlayer from './AudioArticlePlayer';
import ArticleActions from './ArticleActions';
import JsonLd from '@/components/seo/JsonLd';
import { SITE_CONFIG } from '@/lib/config/site';
import { getSectionIncomingTitle } from '@/lib/utils/sectionBanners';

export function generateStaticParams() {
  return ARTICLES.map((art) => ({ slug: art.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(String(slug || '')).trim().toLowerCase();
  let article = getArticleBySlug(slug) || getArticleBySlug(decodedSlug);
  if (!article) {
    try {
      const liveList = await getLiveArticlesCollection();
      article = liveList.find(a => 
        (a.slug && a.slug.toLowerCase() === decodedSlug) || 
        (a.id && a.id.toLowerCase() === decodedSlug) ||
        a.slug === slug ||
        a.id === slug
      );
    } catch (_) {}
  }

  if (!article) {
    return {
      title: 'Article Not Found | Public Intel Security Africa',
      description: 'The requested security intelligence report does not exist.',
    };
  }

  const articleUrl = `/article/${article.slug}`;
  const ogImages = article.coverImage
    ? [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.coverCaption || article.title,
        },
      ]
    : ['/images/logo/logo-dark.png'];

  return {
    title: article.title,
    description: article.excerpt || article.subtitle,
    keywords: [
      article.categoryName,
      article.region || 'Africa',
      article.country || 'Continental Africa',
      'African Security Intelligence',
      'Strategic Assessment',
      'Public Intel Security Africa',
    ],
    authors: [{ name: article.author?.name || 'Public Intel Security Africa Editorial Board' }],
    alternates: {
      canonical: articleUrl,
    },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: article.title,
      description: article.excerpt || article.subtitle,
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      section: article.categoryName,
      authors: [article.author?.name || 'Public Intel Africa Editorial Board'],
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.subtitle,
      images: ogImages,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(String(slug || '')).trim().toLowerCase();
  let article = getArticleBySlug(slug) || getArticleBySlug(decodedSlug);
  if (!article) {
    try {
      const liveList = await getLiveArticlesCollection();
      article = liveList.find(a => 
        (a.slug && a.slug.toLowerCase() === decodedSlug) || 
        (a.id && a.id.toLowerCase() === decodedSlug) ||
        a.slug === slug ||
        a.id === slug
      );
    } catch (_) {}
  }

  if (!article) {
    notFound();
  }

  const isSeedArticle = Boolean(
    !article.id ||
    article.id.startsWith('art-0') ||
    article.id.startsWith('hero-rot-') ||
    article.id.startsWith('top-rot-') ||
    article.id.startsWith('comm-') ||
    article.id.includes('-mock-') ||
    article.isRealUpload === false
  );

  const isRealArticle = Boolean(
    (article.isRealUpload === true ||
    (article.id && article.id.startsWith('art-real-')) ||
    (article.id && !isSeedArticle && article.id.startsWith('art-') && article.id.length > 10)) &&
    article.coverImage &&
    typeof article.coverImage === 'string' &&
    article.coverImage.trim() !== ''
  );

  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt || article.subtitle,
    image: [article.coverImage],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_CONFIG.url}/article/${article.slug}`,
    },
    articleSection: article.categoryName,
    author: [
      {
        '@type': 'Person',
        name: article.author?.name || 'Public Intel Africa Bureau',
        jobTitle: article.author?.role || 'Defense Intelligence Analyst',
        url: `${SITE_CONFIG.url}/about`,
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo/logo-dark.png`,
      },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: article.categoryName,
        item: `${SITE_CONFIG.url}/coverage/${article.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${SITE_CONFIG.url}/article/${article.slug}`,
      },
    ],
  };

  return (
    <article className="py-10 px-4 max-w-5xl mx-auto space-y-10 bg-white">
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />
      
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

        {/* Metadata & Author Bar with Official Bureau Badge (No dummy photo) */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-600/70 flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
              <Shield className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{article.author?.name || 'Public Intel Desk'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{article.author?.role || 'Senior Intelligence Analyst'}</p>
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

      {/* Featured Cover Area: Real Photo or Incoming Tactical Card */}
      <div className="space-y-2">
        {isRealArticle && article.coverImage ? (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-md">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              unoptimized
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-radial-[at_top_left] from-slate-900 via-slate-950 to-black p-6 sm:p-12 flex flex-col justify-between border border-amber-600/40 shadow-xl select-none">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab3080c_1px,transparent_1px),linear-gradient(to_bottom,#eab3080c_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono tracking-widest text-amber-400 bg-amber-950/80 border border-amber-500/40">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span>PUBLIC INTEL SECURITY AFRICA // STRATEGIC WIRE</span>
              </span>
              <Shield className="w-6 h-6 text-amber-500/80" />
            </div>

            <div className="relative z-10 text-center py-8 sm:py-12 my-auto">
              <div className="text-amber-400 font-mono text-xs sm:text-sm uppercase tracking-widest mb-2">
                Official Declassified Intelligence Wire
              </div>
              <div className="text-xl sm:text-3xl md:text-4xl font-black tracking-wider uppercase font-mono text-white drop-shadow-xl px-4">
                {getSectionIncomingTitle(article.categoryName || article.categorySlug, article)}
              </div>
              <p className="text-slate-400 text-xs sm:text-sm font-mono mt-3">
                COMMUNICATION STATUS: AWAITING FIELD DISPATCH & TELEMETRY
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-400 border-t border-slate-800 pt-3">
              <span>CLASSIFICATION: CONFIDENTIAL / STRATEGIC MEDIA</span>
              <span className="text-amber-400 font-bold">PAN-AFRICAN SECURITY RADAR</span>
            </div>
          </div>
        )}
        {article.coverCaption && (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic px-2">
            {article.coverCaption}
          </p>
        )}
      </div>

      {/* Video Dispatch Player (if video is provided) */}
      {article.videoUrl && (
        <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-white">
            <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
              <Play className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Field Video Intelligence Dispatch</span>
            </span>
            {article.videoCaption && <span className="text-slate-400 text-xs italic">{article.videoCaption}</span>}
          </div>
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
            {article.videoUrl.includes('youtube.com') || article.videoUrl.includes('youtu.be') ? (
              <iframe
                src={article.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                title="Video Dispatch"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video controls src={article.videoUrl} className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}

      {/* Audio Briefing Player (if audio is provided) */}
      {article.audioUrl && (
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-white">
            <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>Official Audio Briefing & Intercept</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">AUTHENTICATED DISPATCH</span>
          </div>
          <audio controls src={article.audioUrl} className="w-full h-10 rounded-lg accent-amber-500">
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      {/* Audio Narration & Actions Bar */}
      <AudioArticlePlayer title={article.title} readTime={article.readTime} />
      <ArticleActions title={article.title} slug={article.slug} article={article} />

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
