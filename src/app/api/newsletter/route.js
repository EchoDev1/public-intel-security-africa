import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { sendEmail } from '@/lib/email/resend';

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
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
