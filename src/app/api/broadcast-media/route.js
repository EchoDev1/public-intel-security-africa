import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/contentStore';
import { TELEVISION_SHOWS, PODCAST_EPISODES, RADIO_STREAM } from '@/lib/data/multimedia';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

const DEFAULT_RADIO = [
  {
    id: 'rad-01',
    title: 'PI Security Radio 24/7 Live Stream (English)',
    frequency: 'Main Digital Channel 01',
    audioUrl: RADIO_STREAM.streamUrl || 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    host: 'Commander Kolawole & Lady Dakore',
    status: 'Live Now',
    schedule: '24/7 Non-Stop Strategic Audio',
    joinLink: '/radio'
  },
  {
    id: 'rad-02',
    title: 'Sahel French Language Defense Frequency',
    frequency: 'Canal Francophone 02',
    audioUrl: 'https://stream.publicintel.africa/french.mp3',
    host: 'Col. Amadou Touré',
    status: 'Live Now',
    schedule: 'Daily 06:00 - 22:00 UTC',
    joinLink: '/radio'
  },
  {
    id: 'rad-03',
    title: 'Eastern Horn Maritime Audio Ticker',
    frequency: 'Maritime VHF 16 Audio Feed',
    audioUrl: 'https://stream.publicintel.africa/maritime.mp3',
    host: 'Captain Omar Hassan',
    status: 'Upcoming',
    schedule: 'Starting October 10 at 08:00 UTC',
    joinLink: '/radio'
  }
];

export async function GET(request) {
  try {
    const tv = await getContent('tv_channels', TELEVISION_SHOWS);
    const radio = await getContent('radio_channels', DEFAULT_RADIO);
    const podcasts = await getContent('podcast_shows', PODCAST_EPISODES);

    return NextResponse.json({
      success: true,
      tvChannels: Array.isArray(tv) ? tv : TELEVISION_SHOWS,
      radioChannels: Array.isArray(radio) ? radio : DEFAULT_RADIO,
      podcastShows: Array.isArray(podcasts) ? podcasts : PODCAST_EPISODES
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
    const { tvChannels, radioChannels, podcastShows } = body;

    if (tvChannels) {
      await saveContent('tv_channels', tvChannels, { name: 'Television Channels & Broadcasts' });
    }
    if (radioChannels) {
      await saveContent('radio_channels', radioChannels, { name: 'Radio Streams & Relays' });
    }
    if (podcastShows) {
      await saveContent('podcast_shows', podcastShows, { name: 'Podcast Shows & Episodes' });
    }

    try {
      revalidatePath('/television');
      revalidatePath('/radio');
      revalidatePath('/podcasts');
      revalidatePath('/');
      revalidatePath('/admin');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: 'Broadcast media channels and streams saved successfully.'
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
