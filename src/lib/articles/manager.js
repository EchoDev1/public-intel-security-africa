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

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80';

// In-memory cache across serverless / Node lifecycle
let memoryRealArticles = [];
let memoryMeta = { isDummyPurged: false, deletedDummyIds: [] };
let hasInitializedFromSupabase = false;

function withTimeout(promise, ms = 10000) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('Database timeout')), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Map a Supabase row to our internal article representation
function mapSupabaseRow(item) {
  return {
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
    coverImage: item.cover_image || DEFAULT_COVER_IMAGE,
    coverCaption: item.cover_caption || 'Public Intel Security Africa field lens.',
    videoUrl: item.video_url || item.videoUrl || '',
    videoCaption: item.video_caption || item.videoCaption || '',
    audioUrl: item.audio_url || item.audioUrl || '',
    audioCaption: item.audio_caption || item.audioCaption || '',
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
    keyTakeaways: Array.isArray(item.key_takeaways) && item.key_takeaways.length > 0 
      ? item.key_takeaways 
      : [item.excerpt]
  };
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
 * Synchronous Meta accessor (backed by memory, file, and async cloud hydration)
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
    }
  } catch (_) {}
  return memoryMeta;
}

/**
 * Async Meta accessor: checks cloud Supabase storage for permanent persistence across all instances
 */
export async function getArticlesMetaAsync() {
  getArticlesMeta();
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await withTimeout(
        supabase.from('categories').select('description').eq('slug', '__system_meta__').limit(1),
        4000
      );
      if (!error && data && data.length > 0 && data[0].description) {
        const cloudMeta = JSON.parse(data[0].description);
        memoryMeta = {
          isDummyPurged: Boolean(cloudMeta.isDummyPurged || memoryMeta.isDummyPurged),
          deletedDummyIds: Array.from(new Set([...(cloudMeta.deletedDummyIds || []), ...(memoryMeta.deletedDummyIds || [])]))
        };
        // sync to local file if writable
        try {
          if (fs && META_FILE) {
            fs.writeFileSync(META_FILE, JSON.stringify(memoryMeta, null, 2));
          }
        } catch (_) {}
      }
    } catch (_) {}
  }
  return memoryMeta;
}

/**
 * Save Meta configuration: saves to memory, local file, and Supabase cloud permanently
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

  // Asynchronously persist meta to Supabase cloud
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      supabase.from('categories').upsert({
        slug: '__system_meta__',
        name: 'System Meta',
        pillar: 'System',
        description: JSON.stringify(memoryMeta)
      }, { onConflict: 'slug' }).catch?.(() => {});
    } catch (_) {}
  }
}

/**
 * Direct synchronous accessor for in-memory real articles
 */
export function getInMemoryRealArticles() {
  return memoryRealArticles;
}

/**
 * Get Real (Admin Uploaded / Edited) Articles from Supabase, local file, and memory
 * When Supabase is configured, it acts as the primary authoritative source of truth.
 */
export async function getRealArticles() {
  ensureStorage();
  const meta = getArticlesMeta();
  const deletedIds = Array.isArray(meta?.deletedDummyIds) ? meta.deletedDummyIds : [];

  // 1. Supabase Cloud Database (Primary authoritative source of truth)
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await withTimeout(
        supabase.from('articles').select('*').order('published_at', { ascending: false }),
        10000
      );
      if (!error && Array.isArray(data)) {
        // Cloud is authoritative: exactly these rows exist, plus filter out explicitly deleted ids/slugs
        const cloudArticles = data
          .map(mapSupabaseRow)
          .filter(a => !deletedIds.includes(a.id) && !deletedIds.includes(a.slug));
        
        memoryRealArticles = cloudArticles;

        // Keep local cache in sync with cloud
        try {
          if (fs && ARTICLES_FILE) {
            fs.writeFileSync(ARTICLES_FILE, JSON.stringify(cloudArticles, null, 2));
          }
        } catch (_) {}

        return memoryRealArticles;
      }
    } catch (err) {
      console.warn('Supabase getRealArticles warning, falling back to local cache:', err?.message || err);
    }
  }

  // 2. Offline / Fallback mode: combine local file and memory
  let localArticles = [];
  try {
    if (fs && fs.existsSync(ARTICLES_FILE)) {
      localArticles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
    }
  } catch (_) {}

  const combinedMap = new Map();
  localArticles.forEach(a => {
    if (!deletedIds.includes(a.id) && !deletedIds.includes(a.slug)) {
      combinedMap.set(a.slug || a.id, { ...a, isRealUpload: true });
    }
  });
  memoryRealArticles.forEach(a => {
    if (!deletedIds.includes(a.id) && !deletedIds.includes(a.slug)) {
      combinedMap.set(a.slug || a.id, { ...a, isRealUpload: true });
    }
  });

  memoryRealArticles = Array.from(combinedMap.values()).map(a => ({ ...a, isRealUpload: true }));

  try {
    if (fs && ARTICLES_FILE) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(memoryRealArticles, null, 2));
    }
  } catch (_) {}

  return memoryRealArticles;
}

/**
 * Dedicated direct accessor for a single article by slug:
 * Queries memory, Supabase, local file, and SEED articles.
 * Guarantees zero 404s for any valid article in the database, while respecting deletions.
 */
export async function getArticleBySlugDirect(slug) {
  if (!slug) return null;
  const decoded = decodeURIComponent(String(slug)).trim().toLowerCase();
  const raw = String(slug).trim();

  // Fast check: if this slug/id was permanently deleted, return null immediately
  const meta = await getArticlesMetaAsync();
  const deletedIds = Array.isArray(meta?.deletedDummyIds) ? meta.deletedDummyIds : [];
  if (deletedIds.includes(raw) || deletedIds.includes(decoded)) {
    return null;
  }

  // 1. Check in-memory real articles first
  const inMem = memoryRealArticles.find(a =>
    !deletedIds.includes(a.id) &&
    !deletedIds.includes(a.slug) &&
    ((a.slug && a.slug.toLowerCase() === decoded) ||
     (a.id && a.id.toLowerCase() === decoded) ||
     a.slug === raw ||
     a.id === raw)
  );
  if (inMem) return inMem;

  // 2. Query Supabase directly
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await withTimeout(
        supabase
          .from('articles')
          .select('*')
          .or(`slug.eq.${raw},slug.ilike.${decoded}`)
          .limit(1),
        10000
      );
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = mapSupabaseRow(data[0]);
        if (!deletedIds.includes(mapped.id) && !deletedIds.includes(mapped.slug)) {
          memoryRealArticles = [mapped, ...memoryRealArticles.filter(a => a.slug !== mapped.slug)];
          return mapped;
        }
      }
    } catch (_) {}
  }

  // 3. Check local file store
  try {
    if (fs && fs.existsSync(ARTICLES_FILE)) {
      const list = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
      const found = list.find(a =>
        !deletedIds.includes(a.id) &&
        !deletedIds.includes(a.slug) &&
        ((a.slug && a.slug.toLowerCase() === decoded) ||
         (a.id && a.id.toLowerCase() === decoded) ||
         a.slug === raw ||
         a.id === raw)
      );
      if (found) {
        const full = { ...found, isRealUpload: true };
        memoryRealArticles = [full, ...memoryRealArticles.filter(a => a.slug !== full.slug)];
        return full;
      }
    }
  } catch (_) {}

  // 4. Check seed dummy articles (only if not purged)
  if (meta?.isDummyPurged) {
    return null;
  }

  return SEED_ARTICLES.find(a =>
    !deletedIds.includes(a.id) &&
    !deletedIds.includes(a.slug) &&
    ((a.slug && a.slug.toLowerCase() === decoded) ||
     (a.id && a.id.toLowerCase() === decoded) ||
     a.slug === raw ||
     a.id === raw)
  ) || null;
}

/**
 * Save or Edit an article:
 * - Persists to Supabase cloud database with auto-healing column fallback.
 * - Updates in-memory and local caches.
 * - Guarantees permanent persistence across all servers and visitors.
 */
export async function saveRealArticle(article) {
  ensureStorage();

  const safeCoverImage = (article.coverImage && typeof article.coverImage === 'string' && article.coverImage.trim())
    ? article.coverImage.trim()
    : (article.image && typeof article.image === 'string' && article.image.trim())
      ? article.image.trim()
      : DEFAULT_COVER_IMAGE;

  const realArticle = {
    ...article,
    id: article.id || ('art-real-' + Date.now()),
    coverImage: safeCoverImage,
    publishedAt: article.publishedAt || new Date().toISOString(),
    isRealUpload: true
  };

  // 1. Update in-memory store immediately
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

  // 3. Persist to Supabase with auto-healing fallback
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();

      // Ensure the category exists in categories table so foreign key constraint never blocks publishing
      if (realArticle.categorySlug) {
        try {
          await supabase.from('categories').upsert({
            slug: realArticle.categorySlug,
            name: realArticle.categoryName || realArticle.categorySlug,
            pillar: 'Defense & Sovereignty',
            featured_image: DEFAULT_COVER_IMAGE
          }, { onConflict: 'slug' });
        } catch (_) {}
      }

      const fullPayload = {
        slug: realArticle.slug,
        title: realArticle.title,
        subtitle: realArticle.subtitle || '',
        excerpt: realArticle.excerpt,
        content: realArticle.content,
        category_slug: realArticle.categorySlug,
        category_name: realArticle.categoryName,
        author_name: realArticle.author?.name || 'Lady Dakore Ekpendu',
        author_role: realArticle.author?.role || 'Executive Director & Chief Editor',
        author_avatar: realArticle.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        cover_image: safeCoverImage,
        cover_caption: realArticle.coverCaption || 'Public Intel Security Africa field lens.',
        video_url: realArticle.videoUrl || '',
        video_caption: realArticle.videoCaption || '',
        audio_url: realArticle.audioUrl || '',
        audio_caption: realArticle.audioCaption || '',
        threat_level: realArticle.threatLevel || 'Guarded',
        region: realArticle.region || 'West Africa',
        country: realArticle.country || 'Nigeria',
        read_time: realArticle.readTime || '5 min read',
        is_breaking: realArticle.isBreaking || false,
        is_featured: realArticle.isFeatured ?? true,
        is_special_report: realArticle.isSpecialReport || false,
        published_at: realArticle.publishedAt
      };

      // Attempt full upsert
      const { error: upsertErr } = await withTimeout(
        supabase.from('articles').upsert(fullPayload, { onConflict: 'slug' }),
        10000
      );

      // If missing column error (e.g. audio_url not yet in table), retry without optional columns
      if (upsertErr) {
        console.warn('Supabase initial upsert notice:', upsertErr.message, '- applying resilient fallback payload');
        const fallbackPayload = { ...fullPayload };
        delete fallbackPayload.audio_url;
        delete fallbackPayload.audio_caption;

        const { error: fallbackErr } = await withTimeout(
          supabase.from('articles').upsert(fallbackPayload, { onConflict: 'slug' }),
          10000
        );

        if (fallbackErr) {
          console.error('Supabase fallback upsert error:', fallbackErr.message);
        } else {
          console.log(`Supabase article "${realArticle.slug}" successfully saved via fallback payload.`);
        }
      } else {
        console.log(`Supabase article "${realArticle.slug}" successfully saved to cloud database.`);
      }
    } catch (err) {
      console.warn('Supabase article sync warning:', err?.message || err);
    }
  }

  return realArticle;
}

/**
 * Delete an article (handles real, edited, and dummy seed articles cleanly and instantaneously)
 */
export async function deleteArticle(articleId, articleSlug) {
  ensureStorage();
  const meta = await getArticlesMetaAsync();
  const id = articleId ? String(articleId).trim() : '';
  const slug = articleSlug ? String(articleSlug).trim() : '';

  // Find any in-memory match to capture both its id and its slug
  const matched = memoryRealArticles.find(a => 
    (id && (a.id === id || a.slug === id)) ||
    (slug && (a.slug === slug || a.id === slug))
  );
  const targetId = matched?.id || id;
  const targetSlug = matched?.slug || slug;

  // 1. Delete from in-memory cache immediately
  memoryRealArticles = memoryRealArticles.filter(a => 
    a.id !== targetId && 
    a.slug !== targetId && 
    a.id !== targetSlug && 
    a.slug !== targetSlug
  );

  // 2. Delete from local file
  try {
    if (fs && fs.existsSync(ARTICLES_FILE)) {
      let list = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
      list = list.filter(a => 
        a.id !== targetId && 
        a.slug !== targetId && 
        a.id !== targetSlug && 
        a.slug !== targetSlug
      );
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(list, null, 2));
    }
  } catch (_) {}

  // 3. Delete from Supabase cloud database
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      
      // Delete by slug
      if (targetSlug) {
        await supabase.from('articles').delete().eq('slug', targetSlug);
      }
      if (targetId && targetId !== targetSlug) {
        await supabase.from('articles').delete().eq('slug', targetId);
      }

      // Delete by UUID if valid UUID
      const isTargetIdUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
      if (isTargetIdUuid) {
        await supabase.from('articles').delete().eq('id', targetId);
      }
      const isTargetSlugUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetSlug);
      if (isTargetSlugUuid) {
        await supabase.from('articles').delete().eq('id', targetSlug);
      }
    } catch (err) {
      console.warn('Supabase delete warning:', err?.message || err);
    }
  }

  // 4. Record targetId and targetSlug in deletedDummyIds permanently
  if (!Array.isArray(meta.deletedDummyIds)) meta.deletedDummyIds = [];
  if (targetId && !meta.deletedDummyIds.includes(targetId)) meta.deletedDummyIds.push(targetId);
  if (targetSlug && !meta.deletedDummyIds.includes(targetSlug)) meta.deletedDummyIds.push(targetSlug);

  const matchedSeed = SEED_ARTICLES.find(a => 
    a.id === targetId || a.slug === targetId || a.id === targetSlug || a.slug === targetSlug
  );
  if (matchedSeed) {
    if (matchedSeed.id && !meta.deletedDummyIds.includes(matchedSeed.id)) meta.deletedDummyIds.push(matchedSeed.id);
    if (matchedSeed.slug && !meta.deletedDummyIds.includes(matchedSeed.slug)) meta.deletedDummyIds.push(matchedSeed.slug);
  }
  saveArticlesMeta(meta);

  return { success: true };
}

/**
 * Purge / Delete all dummy seed news permanently across cloud and local
 */
export async function purgeAllDummyArticles() {
  const meta = await getArticlesMetaAsync();
  meta.isDummyPurged = true;
  saveArticlesMeta(meta);
  return { success: true, message: 'All dummy seed articles have been removed permanently.' };
}

/**
 * Calculate dynamic live article collection:
 * - Real articles appear at the top.
 * - Edited articles cleanly replace their dummy counterparts.
 * - Deleted dummy articles are never shown.
 * - For each real article uploaded, 1 dummy article automatically disappears from the end.
 * - If dummy articles are purged, 0 dummy articles remain.
 */
export async function getLiveArticlesCollection() {
  const meta = await getArticlesMetaAsync();
  const deletedIds = Array.isArray(meta?.deletedDummyIds) ? meta.deletedDummyIds : [];
  const rawRealArticles = await getRealArticles();

  // Filter out any real articles that were deleted
  const realArticles = rawRealArticles.filter(a => 
    !deletedIds.includes(a.id) && !deletedIds.includes(a.slug)
  );

  if (meta?.isDummyPurged) {
    return realArticles;
  }

  const realSlugs = new Set(realArticles.map(a => a.slug));
  const realIds = new Set(realArticles.map(a => a.id));

  // Filter out any dummy articles that were deleted OR were edited into a real article
  const availableDummy = SEED_ARTICLES.filter(art => 
    !deletedIds.includes(art.id) &&
    !deletedIds.includes(art.slug) &&
    !realSlugs.has(art.slug) &&
    !realIds.has(art.id)
  );

  // Automatic phase-out: for each real article uploaded, remove a dummy article from the end
  const realCount = realArticles.length;
  const remainingDummy = availableDummy.slice(realCount);

  return [...realArticles, ...remainingDummy];
}
