import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/contentStore';
import { INITIAL_SOCIAL_LINKS } from '@/lib/data/socials';
import { SPECIALIZED_HUBS } from '@/lib/data/categories';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

const DEFAULT_HEADER = {
  siteName: 'Public Intel Security Africa',
  emergencyPhone: '+234 (0) 902 444 8891',
  emergencyEmail: 'tipline@publicintel.africa',
  tagline: 'Strategic Intelligence & Defense Telemetry Network for Africa',
  showBreakingTicker: true,
  breakingTickerText: 'MARITIME ALERT: Gulf of Guinea Multinational Naval Patrol Upgraded across Sector B   SADC Regional Force Mandate Extended'
};

const DEFAULT_FOOTER = {
  aboutText: 'Public Intel Security Africa is a leading multi-platform security media production of Plugins Media Limited, dedicated to reshaping public discourse on security through informed journalism, expert analysis, strategic dialogue, and solution-driven events.',
  headOffice: 'Plot 428 Constitution Ave, Central Business District, Abuja, FCT, Nigeria',
  nairobiOffice: 'Riverside Square, 5th Floor Defense Media Wing, Nairobi, Kenya',
  copyright: `Public Intel Security Africa. A Multi-Platform Media Production of Plugins Media Limited. All rights reserved.`,
  hotlineEmail: 'tips@publicintel.africa',
  hotlinePhone: 'Signal / PGP: +234 800-PUBLIC-INTEL'
};

const DEFAULT_DIVISIONS = SPECIALIZED_HUBS.map((h, idx) => ({
  id: `div-${idx + 1}`,
  name: h.name,
  slug: h.slug,
  path: h.path,
  desc: h.desc,
  category: 'Specialized Division',
  status: 'Active',
  featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  videoUrl: ''
}));

const DEFAULT_EDITORIAL_TEAM = [
  {
    id: 'team-01',
    name: 'Lady Dakore Ekpendu',
    role: 'Executive Director & Editor-in-Chief',
    bureau: 'Abuja Headquarters (West Africa)',
    clearance: 'Super Admin / Top Secret',
    beats: 'Defense Policy, Intelligence Synthesis, High-Level Strategic Summits',
    status: 'Active Command',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: 'Ekpendudakore@gmail.com'
  },
  {
    id: 'team-02',
    name: 'Capt. (Ret.) Tariq Adeleke',
    role: 'Senior Naval & Littoral Security Analyst',
    bureau: 'Lagos Maritime Operations Desk',
    clearance: 'Level 4 Intelligence Clearance',
    beats: 'Gulf of Guinea Maritime Defense, Autonomous Sensors, Anti-Piracy',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: 'tariq.adeleke@publicintelsecurity.africa'
  },
  {
    id: 'team-03',
    name: 'Dr. Raymond Adeyemi',
    role: 'Head of Asymmetric Warfare & Sahel Desk',
    bureau: 'Nairobi Bureau (East & Horn)',
    clearance: 'Level 4 Intelligence Clearance',
    beats: 'UAV Telemetry, Counter-Insurgency, Trans-Border Militias',
    status: 'On Field Assignment',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: 'raymond.adeyemi@publicintelsecurity.africa'
  },
  {
    id: 'team-04',
    name: 'Farida Al-Mansoor',
    role: 'North Africa & Mediterranean Security Fellow',
    bureau: 'Cairo Strategic Hub',
    clearance: 'Level 3 Analyst Clearance',
    beats: 'Critical Infrastructure, Cyber Threats, Geopolitics',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: 'farida.mansoor@publicintelsecurity.africa'
  }
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (section === 'header') {
      const headerSettings = await getContent('header_settings', DEFAULT_HEADER);
      return NextResponse.json({ success: true, headerSettings }, { headers: NO_CACHE_HEADERS });
    }

    if (section === 'footer') {
      const footerSettings = await getContent('footer_settings', DEFAULT_FOOTER);
      return NextResponse.json({ success: true, footerSettings }, { headers: NO_CACHE_HEADERS });
    }

    if (section === 'socials') {
      const socialLinks = await getContent('social_links', INITIAL_SOCIAL_LINKS);
      return NextResponse.json({ success: true, socialLinks }, { headers: NO_CACHE_HEADERS });
    }

    if (section === 'divisions') {
      const specializedDivisions = await getContent('specialized_divisions', DEFAULT_DIVISIONS);
      return NextResponse.json({ success: true, specializedDivisions }, { headers: NO_CACHE_HEADERS });
    }

    if (section === 'editorial_team') {
      const editorialTeam = await getContent('editorial_team', DEFAULT_EDITORIAL_TEAM);
      return NextResponse.json({ success: true, editorialTeam }, { headers: NO_CACHE_HEADERS });
    }

    // Default: return all configuration
    const [headerSettings, footerSettings, socialLinks, specializedDivisions, editorialTeam] = await Promise.all([
      getContent('header_settings', DEFAULT_HEADER),
      getContent('footer_settings', DEFAULT_FOOTER),
      getContent('social_links', INITIAL_SOCIAL_LINKS),
      getContent('specialized_divisions', DEFAULT_DIVISIONS),
      getContent('editorial_team', DEFAULT_EDITORIAL_TEAM)
    ]);

    return NextResponse.json({
      success: true,
      headerSettings,
      footerSettings,
      socialLinks,
      specializedDivisions,
      editorialTeam
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
    const { action, data } = body;

    if (action === 'save_header') {
      await saveContent('header_settings', data, { name: 'Header Section & Breaking Ticker Controls' });
      // If breaking ticker text is set, also update breakingAlerts in threat matrix data
      if (data?.breakingTickerText) {
        try {
          const currentThreat = await getContent('threat_matrix');
          if (currentThreat && currentThreat.breakingAlerts) {
            const updatedAlerts = [data.breakingTickerText, ...(currentThreat.breakingAlerts.filter(a => a !== data.breakingTickerText))];
            await saveContent('threat_matrix', { ...currentThreat, breakingAlerts: updatedAlerts }, { name: 'Continental Security Threat Matrix' });
          }
        } catch (_) {}
      }
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'Header settings saved successfully.' }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'save_footer') {
      await saveContent('footer_settings', data, { name: 'Footer Section & Bureau Directory' });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/about');
        revalidatePath('/contacts');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'Footer settings saved successfully.' }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'save_socials') {
      await saveContent('social_links', data, { name: 'Official Social Media Accounts & Channels' });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'Social media links saved successfully.' }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'save_divisions') {
      await saveContent('specialized_divisions', data, { name: 'Specialized Divisions Directory' });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
        revalidatePath('/coverage');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'Specialized divisions directory saved successfully.' }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'save_editorial_team') {
      await saveContent('editorial_team', data, { name: 'Editorial Board & Fellows Registry' });
      try {
        revalidatePath('/about');
        revalidatePath('/');
      } catch (_) {}
      return NextResponse.json({ success: true, message: 'Editorial board and fellows saved successfully.' }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, error: 'Unknown action specified' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
