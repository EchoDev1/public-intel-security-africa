import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { sendEmail } from '@/lib/email/resend';
import { getContent, saveContent } from '@/lib/contentStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

const DEFAULT_NEWSLETTER_SETTINGS = {
  headline: 'The 0600 Hours Continental Intel Briefing',
  ctaText: 'Subscribe to Wire',
  subtitle: 'Join over 42,000 defense policymakers, intelligence officers, maritime operators, diplomats, and corporate risk leaders receiving our daily curated security assessments across Africa.'
};

const DEFAULT_SUBSCRIBERS = [
  { id: 1, email: 'ambassador.kone@au-peace.org', tier: 'Executive Diplomatic Brief', subscribedAt: '2026-10-04', status: 'Active' },
  { id: 2, email: 'tariq.defense@nsc.gov.ng', tier: 'National Defense Dispatch', subscribedAt: '2026-10-03', status: 'Active' },
  { id: 3, email: 'intel.analyst@ecowas.int', tier: 'Sahel Telemetry Daily', subscribedAt: '2026-10-02', status: 'Active' },
  { id: 4, email: 'director.security@standardbank.co.za', tier: 'Financial Security Radar', subscribedAt: '2026-10-01', status: 'Active' },
  { id: 5, email: 'field.liaison@unhcr.org', tier: 'Human Security Alert', subscribedAt: '2026-09-29', status: 'Active' }
];

export async function GET() {
  try {
    const settings = await getContent('newsletter_settings', DEFAULT_NEWSLETTER_SETTINGS);
    let subscribers = await getContent('newsletter_subscribers', DEFAULT_SUBSCRIBERS);

    // Also attempt fetching latest from Supabase if table exists
    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (!error && Array.isArray(data) && data.length > 0) {
          const mapped = data.map(sub => ({
            id: sub.id,
            email: sub.email,
            tier: sub.subscriber_tier || 'Executive Daily Brief',
            subscribedAt: sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : '2026-11-01',
            status: 'Active'
          }));
          subscribers = mapped;
        }
      } catch (_) {}
    }

    return NextResponse.json({
      success: true,
      settings,
      subscribers: Array.isArray(subscribers) ? subscribers : DEFAULT_SUBSCRIBERS
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
    const { action, email, topics, settings, id } = body;

    // 1. Admin Save Settings
    if (action === 'save_settings') {
      await saveContent('newsletter_settings', settings, { name: 'Newsletter Broadcast Settings' });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/');
      } catch (_) {}
      return NextResponse.json({
        success: true,
        message: 'Newsletter settings saved successfully.'
      }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Admin Delete / Remove Subscriber
    if (action === 'delete_subscriber') {
      if (isSupabaseConfigured()) {
        try {
          const supabase = createServerSupabaseClient();
          if (id) {
            await supabase.from('newsletter_subscribers').delete().eq('id', id);
          } else if (email) {
            await supabase.from('newsletter_subscribers').delete().eq('email', email);
          }
        } catch (_) {}
      }

      // Also remove from contentStore cached list
      const current = await getContent('newsletter_subscribers', DEFAULT_SUBSCRIBERS);
      const filtered = Array.isArray(current) ? current.filter(s => s.id !== id && s.email !== email) : [];
      await saveContent('newsletter_subscribers', filtered, { name: 'Registered Intel Subscribers' });

      return NextResponse.json({
        success: true,
        message: 'Subscriber removed successfully.'
      }, { headers: NO_CACHE_HEADERS });
    }

    // 3. Reader Public Subscription
    if (!email) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 });
    }

    const newSubRecord = {
      id: `sub-${Date.now()}`,
      email,
      tier: 'Executive Daily Brief',
      subscribedAt: new Date().toISOString().split('T')[0],
      status: 'Active'
    };

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        await supabase.from('newsletter_subscribers').insert([
          {
            email,
            subscriber_tier: 'Executive Daily Brief',
            interests: topics || ['National Security', 'Maritime', 'Cybersecurity', 'Geopolitics'],
          }
        ]);
      } catch (err) {
        console.warn('Supabase newsletter insert note:', err.message);
      }
    }

    // Keep cached list updated
    try {
      const current = await getContent('newsletter_subscribers', DEFAULT_SUBSCRIBERS);
      const updated = [newSubRecord, ...(Array.isArray(current) ? current.filter(s => s.email !== email) : [])];
      await saveContent('newsletter_subscribers', updated, { name: 'Registered Intel Subscribers' });
    } catch (_) {}

    // Dispatch welcome email via Resend if API key is present
    if (process.env.RESEND_API_KEY) {
      try {
        await sendEmail({
          to: email,
          subject: 'Confirmed: The 0600 Hours Continental Intelligence Briefing',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
              <h2 style="color: #b45309; margin-bottom: 8px;">PUBLIC INTEL SECURITY AFRICA</h2>
              <p style="font-size: 14px; color: #475569; margin-top: 0;">24/7 Pan-African Defense & Strategic Intelligence</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p>Welcome to <strong>The 0600 Hours Continental Intelligence Briefing</strong>.</p>
              <p>Your subscription has been confirmed for executive updates across: <em>${(topics || ['National Security', 'Maritime', 'Cybersecurity', 'Geopolitics']).join(', ')}</em>.</p>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">&copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.</p>
            </div>
          `
        });
      } catch (err) {
        console.warn('Resend email dispatch note:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to the 0600 Hours Continental Intel Briefing.',
    }, { headers: NO_CACHE_HEADERS });
  } catch (error) {
    return NextResponse.json({ error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
