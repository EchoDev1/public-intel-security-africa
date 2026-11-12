import { createServerSupabaseClient } from './supabase/server';
import { isSupabaseConfigured } from './supabase/client';

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

function ensureDataDir() {
  if (!fs || !DATA_DIR) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (_) {}
}

/**
 * Read content by key.
 * 1. Checks Supabase `categories` table where slug = `__content_${key}__`
 * 2. Falls back to local `.data/content_${key}.json` file
 * 3. Falls back to defaultData
 */
export async function getContent(key, defaultData = null) {
  ensureDataDir();
  const slug = `__content_${key}__`;
  const filePath = path ? path.join(DATA_DIR, `content_${key}.json`) : '';

  // 1. Try Supabase cloud persistence first
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data && data.description) {
        try {
          const parsed = JSON.parse(data.description);
          if (parsed !== undefined && parsed !== null) {
            // Sync local cache file
            try {
              if (fs && filePath) {
                fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
              }
            } catch (_) {}
            return parsed;
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  // 2. Try local file cache
  try {
    if (fs && filePath && fs.existsSync(filePath)) {
      const local = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (local !== undefined && local !== null) {
        return local;
      }
    }
  } catch (_) {}

  // 3. Fallback to defaultData
  return defaultData;
}

/**
 * Save content by key.
 * 1. Saves to local `.data/content_${key}.json` file
 * 2. Upserts to Supabase `categories` table with slug = `__content_${key}__`
 */
export async function saveContent(key, data, meta = {}) {
  ensureDataDir();
  const slug = `__content_${key}__`;
  const filePath = path ? path.join(DATA_DIR, `content_${key}.json`) : '';

  // 1. Save to local storage file
  try {
    if (fs && filePath) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  } catch (_) {}

  // 2. Persist to Supabase cloud categories table
  if (isSupabaseConfigured()) {
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from('categories').upsert({
        slug,
        name: meta.name || `Content: ${key}`,
        pillar: 'System',
        description: JSON.stringify(data)
      }, { onConflict: 'slug' });
    } catch (err) {
      console.error(`ContentStore persistence note for ${key}:`, err.message);
    }
  }

  return { success: true, data };
}
