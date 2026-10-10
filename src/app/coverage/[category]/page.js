import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Shield, ArrowLeft, Globe, Filter } from 'lucide-react';
import { getCategoryBySlug, CATEGORIES } from '@/lib/data/categories';
import { getArticlesByCategory, ARTICLES } from '@/lib/data/articles';
import ArticleCard from '@/components/ArticleCard';

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export default async function CategoryDetailPage({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  let categoryArticles = getArticlesByCategory(categorySlug);
  if (categoryArticles.length === 0) {
    categoryArticles = ARTICLES.slice(0, 3).map((art, idx) => ({
      ...art,
      id: `${category.slug}-mock-${idx}`,
      categorySlug: category.slug,
      categoryName: category.name,
      title: `${category.name} Field Analysis: Strategic Continental Review & Threat Assessment (Part ${idx + 1})`,
      excerpt: `Comprehensive intelligence dossier evaluating sovereign vulnerabilities, policy architecture, and regional interdiction operations in ${category.name.toLowerCase()}.`,
    }));
  }

  return (
    <div className="py-10 px-4 max-w-7xl mx-auto space-y-10 bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      
      {/* Breadcrumbs - Direct to Home, No generalized coverage directory */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <Link href="/" className="hover:text-amber-800 dark:hover:text-amber-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <span>/</span>
        <span className="text-amber-800 dark:text-amber-400 font-bold">{category.name}</span>
      </div>

      {/* Category Dedicated Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 md:p-12 shadow-xl text-white">
        {category.featuredImage && (
          <div className="absolute inset-0 opacity-25">
            <Image
              src={category.featuredImage}
              alt={category.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>{category.pillar}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white font-serif leading-tight">
            {category.name}
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-medium">
            {category.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 font-semibold">
            <span>{categoryArticles.length} Published Intelligence Dossiers</span>
            <span>•</span>
            <span className="text-emerald-400">Active Bureau Monitoring Desk</span>
          </div>
        </div>
      </div>

      {/* Articles Grid for this Category */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide font-serif">
            {category.name} Intelligence Dossiers & Field Dispatches
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">
            Showing {categoryArticles.length} Dossiers
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Cross-Vertical Intelligence Desks */}
      <section className="pt-10 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Explore Other Security Desks
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {CATEGORIES.filter((c) => c.slug !== categorySlug).slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/coverage/${cat.slug}`}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-amber-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-amber-600 dark:hover:border-amber-500 text-center transition-all shadow-xs"
            >
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-amber-800 dark:hover:text-amber-400 line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
