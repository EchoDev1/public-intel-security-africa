import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/contentStore';
import { WEBINARS } from '@/lib/data/multimedia';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

export async function GET(request) {
  try {
    const webinars = await getContent('webinars', WEBINARS);
    return NextResponse.json({
      success: true,
      webinars: Array.isArray(webinars) ? webinars : WEBINARS
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
    const { webinars } = body;

    if (webinars) {
      await saveContent('webinars', webinars, { name: 'Webinars & Executive Masterclasses' });
    }

    try {
      revalidatePath('/webinars');
      revalidatePath('/admin');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Webinars & Masterclasses saved successfully.',
      webinars
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
