import { createClient } from '@supabase/supabase-js';

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mbzovjtwyjgnosehpakd.supabase.co';
// Sanitize URL to ensure base origin without /rest/v1 or trailing slashes
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iem92anR3eWpnbm9zZWhwYWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExOTk2MzYsImV4cCI6MjEwNjc3NTYzNn0.RNK3p_6EGc0jMosRADRDm617jep-7e7ng_WbSlh_9gk';

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey &&
    supabaseUrl !== 'https://demo-supabase-public-intel.supabase.co'
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
