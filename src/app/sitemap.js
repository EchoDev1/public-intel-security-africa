import { computeArticles } from '@/lib/data/articles';
import { CATEGORIES } from '@/lib/data/categories';
import { SITE_CONFIG } from '@/lib/config/site';

/**
 * Dynamic XML sitemap generator for Next.js App Router
 */
export default async function sitemap() {
  const baseUrl = SITE_CONFIG.url;
  const articles = computeArticles();

  // 1. Core institutional & static media pages
  const staticRoutes = [
    { path: '', changeFrequency: 'always', priority: 1.0 },
    { path: '/threat-matrix', changeFrequency: 'hourly', priority: 0.95 },
    { path: '/special-reports', changeFrequency: 'daily', priority: 0.9 },
    { path: '/world-news', changeFrequency: 'daily', priority: 0.85 },
    { path: '/women-in-security', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/radio', changeFrequency: 'daily', priority: 0.8 },
    { path: '/television', changeFrequency: 'daily', priority: 0.8 },
    { path: '/podcasts', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/training', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/webinars', changeFrequency: 'weekly', priority: 0.75 },
    { path: '/coverage', changeFrequency: 'daily', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/contacts', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/collaboration', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/partnership', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/community-reports', changeFrequency: 'daily', priority: 0.7 },
    { path: '/eyewitness-reports', changeFrequency: 'daily', priority: 0.7 },
    { path: '/gallery', changeFrequency: 'weekly', priority: 0.65 },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // 2. Dynamic Category Verticals (25+ security intelligence themes)
  const categoryRoutes = CATEGORIES.map((category) => ({
    url: `${baseUrl}/coverage/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // 3. Dynamic Article Pages
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.publishedAt ? new Date(article.publishedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: article.isSpecialReport ? 0.95 : 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
