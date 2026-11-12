import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/contentStore';
import { WOMEN_IN_SECURITY_PROFILES } from '@/lib/data/womenInSecurity';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

export async function GET(request) {
  try {
    const profiles = await getContent('women_in_security', WOMEN_IN_SECURITY_PROFILES);
    return NextResponse.json({
      success: true,
      profiles: Array.isArray(profiles) ? profiles : WOMEN_IN_SECURITY_PROFILES
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { profiles } = body;

    if (profiles) {
      await saveContent('women_in_security', profiles, { name: 'Women in Security Profiles' });
    }

    try {
      revalidatePath('/women-in-security');
      revalidatePath('/admin');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Women in Security profiles saved successfully.',
      profiles
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
