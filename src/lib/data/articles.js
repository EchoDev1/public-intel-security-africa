import { SEED_ARTICLES } from './articlesSeed';

export { SEED_ARTICLES };

function getNodeFs() {
  if (typeof window === 'undefined') {
    try {
      if (typeof process !== 'undefined' && typeof process.getBuiltinModule === 'function') {
        return process.getBuiltinModule('fs');
      }
    } catch (_) {}
  }
  return null;
}

function getNodePath() {
  if (typeof window === 'undefined') {
    try {
      if (typeof process !== 'undefined' && typeof process.getBuiltinModule === 'function') {
        return process.getBuiltinModule('path');
      }
    } catch (_) {}
  }
  return null;
}

/**
 * Dynamically computes the active article collection:
 * - Real admin uploads are placed first.
 * - Each real upload automatically displaces/disappears 1 dummy article.
 * - If dummy articles are purged, 0 dummy articles are returned.
 */
export function computeArticles() {
  // Server-side environment
  if (typeof window === 'undefined') {
    try {
      const fs = getNodeFs();
      const path = getNodePath();
      if (fs && path) {
        const dataDir = path.join(process.cwd(), '.data');
        const articlesFile = path.join(dataDir, 'custom_articles.json');
        const metaFile = path.join(dataDir, 'articles_meta.json');

        let realArticles = [];
        let meta = { isDummyPurged: false, deletedDummyIds: [] };

      if (fs.existsSync(metaFile)) {
        meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
      }
      if (fs.existsSync(articlesFile)) {
        realArticles = JSON.parse(fs.readFileSync(articlesFile, 'utf-8'));
      }

      if (meta.isDummyPurged) {
        return realArticles;
      }

        const availableDummy = SEED_ARTICLES.filter(a => !meta.deletedDummyIds?.includes(a.id));
        // For each real article uploaded, 1 dummy article automatically disappears
        const remainingDummy = availableDummy.slice(realArticles.length);
        return [...realArticles, ...remainingDummy];
      }
    } catch (_) {}
  }

  // Client-side environment
  if (typeof window !== 'undefined') {
    try {
      const metaRaw = localStorage.getItem('pisa_articles_meta');
      const realRaw = localStorage.getItem('pisa_custom_articles');

      const meta = metaRaw ? JSON.parse(metaRaw) : { isDummyPurged: false, deletedDummyIds: [] };
      const realArticles = realRaw ? JSON.parse(realRaw) : [];

      if (meta.isDummyPurged) {
        return realArticles;
      }

      const availableDummy = SEED_ARTICLES.filter(a => !meta.deletedDummyIds?.includes(a.id));
      const remainingDummy = availableDummy.slice(realArticles.length);
      return [...realArticles, ...remainingDummy];
    } catch (_) {}
  }

  return SEED_ARTICLES;
}

/**
 * Transparent dynamic array proxy for seamless compatibility across all pages and components
 */
export const ARTICLES = new Proxy([], {
  get(target, prop) {
    const list = computeArticles();
    if (prop === 'length') return list.length;
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    if (typeof prop === 'string' && !isNaN(prop)) return list[Number(prop)];
    const val = list[prop];
    if (typeof val === 'function') return val.bind(list);
    return val;
  }
});

export function getArticleBySlug(slug) {
  return computeArticles().find(art => art.slug === slug);
}

export function getArticlesByCategory(categorySlug) {
  return computeArticles().filter(art => art.categorySlug === categorySlug);
}

export function getWorldNewsArticles() {
  return computeArticles().filter(art => art.categorySlug === 'world-news');
}

export function getEconomicSecurityArticles() {
  return computeArticles().filter(art => art.categorySlug === 'economic-and-financial-security');
}

export function getSpecialReports() {
  return computeArticles().filter(art => art.isSpecialReport);
}

export function getBreakingNews() {
  return computeArticles().filter(art => art.isBreaking);
}

export function getFeaturedArticles() {
  return computeArticles().filter(art => art.isFeatured);
}

export function getTopIntelStories() {
  return computeArticles().slice(0, 5);
}
