import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(request) {
  try {
    const { email, topics } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address required' }, { status: 400 });
    }

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      await supabase.from('newsletter_subscribers').insert([
        {
          email,
          subscriber_tier: 'Executive Daily Brief',
          interests: topics || ['National Security', 'Maritime', 'Cybersecurity', 'Geopolitics'],
        }
      ]);
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to the 0600 Hours Continental Intel Briefing.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
