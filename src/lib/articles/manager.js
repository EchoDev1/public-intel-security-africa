import { createServerSupabaseClient } from '../supabase/server';
import { isSupabaseConfigured } from '../supabase/client';
import { SEED_ARTICLES } from '../data/articlesSeed';

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

const fs = getNodeFs();
const path = getNodePath();

const DATA_DIR = path ? path.join(process.cwd(), '.data') : '';
const ARTICLES_FILE = path ? path.join(DATA_DIR, 'custom_articles.json') : '';
const META_FILE = path ? path.join(DATA_DIR, 'articles_meta.json') : '';

// In-memory cache across serverless / Node lifecycle
let memoryRealArticles = [];
let memoryMeta = { isDummyPurged: false, deletedDummyIds: [] };

function withTimeout(promise, ms = 2000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Ensure local storage directory and files exist
function ensureStorage() {
  if (!fs || !DATA_DIR) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(META_FILE)) {
      fs.writeFileSync(META_FILE, JSON.stringify({ isDummyPurged: false, deletedDummyIds: [] }, null, 2));
    }
  } catch (_) {}
}

/**
 * Read Meta configuration (purge flag, deleted dummy IDs)
 */
export function getArticlesMeta() {
  ensureStorage();
  try {
    if (fs && fs.existsSync(META_FILE)) {
      const fileMeta = JSON.parse(fs.readFileSync(META_FILE, 'utf-8'));
      memoryMeta = {
        isDummyPurged: Boolean(fileMeta.isDummyPurged || memoryMeta.isDummyPurged),
        deletedDummyIds: Array.from(new Set([...(fileMeta.deletedDummyIds || []), ...(memoryMeta.deletedDummyIds || [])]))
      };
      return memoryMeta;
    }
  } catch (_) {}
  return memoryMeta;
}

/**
 * Save Meta configuration
 */
export function saveArticlesMeta(meta) {
  memoryMeta = {
    isDummyPurged: Boolean(meta.isDummyPurged),
    deletedDummyIds: Array.isArray(meta.deletedDummyIds) ? meta.deletedDummyIds : []
  };
  ensureStorage();
  try {
    if (fs && META_FILE) {
      fs.writeFileSync(META_FILE, JSON.stringify(memoryMeta, null, 2));
    }
  } catch (_) {}
}

/**
 * Direct synchronous accessor for in-memory real articles
 */
export function getInMemoryRealArticles() {
  return memoryRealArticles;
}

/**
 * Get Real (Admin Uploaded) Articles from local file and Supabase
 */
export async function getRealArticles() {
  ensureStorage();
  let localArticles = [];
  try {
    if (fs && fs.existsSync(ARTICLES_FILE)) {
      localArticles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
    }
  } catch (_) {}

  // Merge local file store with in-memory store
  const combinedMap = new Map();
  memoryRealArticles.forEach(a => combinedMap.set(a.id || a.slug, { ...a, isRealUpload: true }));
  localArticles.forEach(a => combinedMap.set(a.id || a.slug, { ...a, isRealUpload: true }));

  // Attempt Supabase fetch with 2s timeout
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await withTimeout(
        supabase.from('articles').select('*').order('published_at', { ascending: false }),
        2000
      );
      if (!error && Array.isArray(data) && data.length > 0) {
        data.forEach(item => {
          const mapped = {
            id: item.id,
            slug: item.slug,
            title: item.title,
            subtitle: item.subtitle || '',
            excerpt: item.excerpt,
            content: item.content,
            categorySlug: item.category_slug,
            categoryName: item.category_name,
            author: {
              name: item.author_name || 'Lady Dakore Ekpendu',
              role: item.author_role || 'Executive Director & Chief Editor',
              avatar: item.author_avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
            },
            coverImage: item.cover_image,
            coverCaption: item.cover_caption || 'Public Intel Security Africa field lens.',
            videoUrl: item.video_url || item.videoUrl || '',
            videoCaption: item.video_caption || item.videoCaption || '',
            audioUrl: item.audio_url || item.audioUrl || '',
            threatLevel: item.threat_level || 'Guarded',
            region: item.region || 'West Africa',
            country: item.country || 'Nigeria',
            readTime: item.read_time || '5 min read',
            publishedAt: item.published_at,
            isFeatured: item.is_featured ?? true,
            isBreaking: item.is_breaking || false,
            isSpecialReport: item.is_special_report || false,
            views: item.views_count || 1,
            isRealUpload: true,
            keyTakeaways: Array.isArray(item.key_takeaways) ? item.key_takeaways : [item.excerpt]
          };
          combinedMap.set(mapped.id || mapped.slug, mapped);
        });
      }
    } catch (_) {
      // Non-fatal, continue with local and memory store
    }
  }

  memoryRealArticles = Array.from(combinedMap.values()).map(a => ({ ...a, isRealUpload: true }));
  return memoryRealArticles;
}

/**
 * Save a newly published real article
 */
export async function saveRealArticle(article) {
  ensureStorage();
  const realArticle = {
    ...article,
    id: article.id || ('art-real-' + Date.now()),
    publishedAt: article.publishedAt || new Date().toISOString(),
    isRealUpload: true
  };

  // 1. Update in-memory store
  memoryRealArticles = [
    realArticle,
    ...memoryRealArticles.filter(a => a.id !== realArticle.id && a.slug !== realArticle.slug)
  ];

  // 2. Write to local file store
  try {
    if (fs && ARTICLES_FILE) {
      let list = [];
      if (fs.existsSync(ARTICLES_FILE)) {
        list = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
      }
      list = [realArticle, ...list.filter(a => a.id !== realArticle.id && a.slug !== realArticle.slug)];
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(list, null, 2));
    }
  } catch (_) {}

  // 3. Persist to Supabase with timeout if configured
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await withTimeout(
        supabase.from('articles').upsert({
          slug: realArticle.slug,
          title: realArticle.title,
          subtitle: realArticle.subtitle || '',
          excerpt: realArticle.excerpt,
          content: realArticle.content,
          category_slug: realArticle.categorySlug,
          category_name: realArticle.categoryName,
          author_name: realArticle.author?.name || 'Lady Dakore Ekpendu',
          author_role: realArticle.author?.role || 'Executive Director & Chief Editor',
          author_avatar: realArticle.author?.avatar,
          cover_image: realArticle.coverImage,
          cover_caption: realArticle.coverCaption,
          video_url: realArticle.videoUrl || '',
          video_caption: realArticle.videoCaption || '',
          audio_url: realArticle.audioUrl || '',
          threat_level: realArticle.threatLevel || 'Guarded',
          region: realArticle.region || 'West Africa',
          country: realArticle.country || 'Nigeria',
          read_time: realArticle.readTime || '5 min read',
          is_breaking: realArticle.isBreaking || false,
          is_featured: realArticle.isFeatured ?? true,
          is_special_report: realArticle.isSpecialReport || false,
          published_at: realArticle.publishedAt
        }, { onConflict: 'slug' }),
        2500
      );
    } catch (err) {
      console.warn('Supabase article sync notice:', err?.message || err);
    }
  }

  return realArticle;
}

/**
 * Delete an article (handles both real and dummy articles)
 */
export async function deleteArticle(articleId) {
  ensureStorage();
  const meta = getArticlesMeta();

  // Check if it's a seed dummy article
  const isSeedDummy = SEED_ARTICLES.some(a => a.id === articleId);

  if (isSeedDummy) {
    if (!meta.deletedDummyIds.includes(articleId)) {
      meta.deletedDummyIds.push(articleId);
      saveArticlesMeta(meta);
    }
  } else {
    // Delete from in-memory cache
    memoryRealArticles = memoryRealArticles.filter(a => a.id !== articleId && a.slug !== articleId);

    // Delete from local file
    try {
      if (fs && fs.existsSync(ARTICLES_FILE)) {
        let list = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
        list = list.filter(a => a.id !== articleId && a.slug !== articleId);
        fs.writeFileSync(ARTICLES_FILE, JSON.stringify(list, null, 2));
      }
    } catch (_) {}

    // Delete from Supabase with timeout
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        await withTimeout(
          Promise.all([
            supabase.from('articles').delete().eq('id', articleId),
            supabase.from('articles').delete().eq('slug', articleId)
          ]),
          2000
        );
      } catch (_) {}
    }
  }

  return { success: true };
}

/**
 * Purge / Delete all dummy seed news completely
 */
export async function purgeAllDummyArticles() {
  const meta = getArticlesMeta();
  meta.isDummyPurged = true;
  saveArticlesMeta(meta);
  return { success: true, message: 'All dummy seed articles have been removed permanently.' };
}

/**
 * Calculate dynamic live article collection:
 * - Real articles appear at the top.
 * - For each real article uploaded, 1 dummy article automatically disappears from the end.
 * - If dummy articles are purged, 0 dummy articles remain.
 */
export async function getLiveArticlesCollection() {
  const meta = getArticlesMeta();
  const realArticles = await getRealArticles();

  if (meta?.isDummyPurged) {
    return realArticles;
  }

  const deletedIds = Array.isArray(meta?.deletedDummyIds) ? meta.deletedDummyIds : [];
  // Filter deleted dummy articles
  const availableDummy = SEED_ARTICLES.filter(art => !deletedIds.includes(art.id));

  // Automatic phase-out: for each real article uploaded, remove a dummy article from the end
  const realCount = realArticles.length;
  const remainingDummy = availableDummy.slice(realCount);

  return [...realArticles, ...remainingDummy];
}
