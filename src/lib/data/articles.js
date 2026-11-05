import { SEED_ARTICLES } from './articlesSeed';
import { getInMemoryRealArticles, getArticlesMeta } from '../articles/manager';

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
 * - Each real upload automatically displaces/disappears 1 dummy article from the end.
 * - If dummy articles are purged, 0 dummy articles are returned.
 */
export function computeArticles() {
  // Server-side environment
  if (typeof window === 'undefined') {
    try {
      const fs = getNodeFs();
      const path = getNodePath();
      let realArticles = [];
      let meta = getArticlesMeta() || { isDummyPurged: false, deletedDummyIds: [] };

      // 1. Check in-memory articles
      try {
        const inMemory = getInMemoryRealArticles();
        if (Array.isArray(inMemory) && inMemory.length > 0) {
          realArticles = [...inMemory];
        }
      } catch (_) {}

      // 2. Check local file store
      if (fs && path) {
        const dataDir = path.join(process.cwd(), '.data');
        const articlesFile = path.join(dataDir, 'custom_articles.json');
        const metaFile = path.join(dataDir, 'articles_meta.json');

        if (fs.existsSync(metaFile)) {
          try {
            const fileMeta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
            meta = {
              isDummyPurged: Boolean(fileMeta.isDummyPurged || meta.isDummyPurged),
              deletedDummyIds: Array.from(new Set([...(fileMeta.deletedDummyIds || []), ...(meta.deletedDummyIds || [])]))
            };
          } catch (_) {}
        }

        if (fs.existsSync(articlesFile)) {
          try {
            const fileArticles = JSON.parse(fs.readFileSync(articlesFile, 'utf-8'));
            if (Array.isArray(fileArticles) && fileArticles.length > 0) {
              const map = new Map();
              realArticles.forEach(a => map.set(a.id || a.slug, a));
              fileArticles.forEach(a => map.set(a.id || a.slug, { ...a, isRealUpload: true }));
              realArticles = Array.from(map.values());
            }
          } catch (_) {}
        }
      }

      if (meta.isDummyPurged) {
        return realArticles;
      }

      const deletedIds = Array.isArray(meta.deletedDummyIds) ? meta.deletedDummyIds : [];
      const availableDummy = SEED_ARTICLES.filter(a => !deletedIds.includes(a.id));
      // For each real article uploaded, 1 dummy article automatically disappears from the end
      const remainingDummy = availableDummy.slice(realArticles.length);
      return [...realArticles, ...remainingDummy];
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

      const deletedIds = Array.isArray(meta.deletedDummyIds) ? meta.deletedDummyIds : [];
      const availableDummy = SEED_ARTICLES.filter(a => !deletedIds.includes(a.id));
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
  const all = computeArticles();
  const found = all.find(art => art.slug === slug);
  if (found) return found;
  return SEED_ARTICLES.find(art => art.slug === slug);
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
