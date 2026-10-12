import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { sendEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const body = await request.json();

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      await supabase.from('partnership_inquiries').insert([
        {
          organization_name: body.orgName,
          contact_name: body.contactName,
          contact_email: body.email,
          contact_phone: body.phone,
          partnership_pillar: body.pillar,
          country: body.country,
          proposal_summary: body.proposal,
          status: 'Received'
        }
      ]);
    }

    // Send acknowledgment email via Resend if configured
    if (process.env.RESEND_API_KEY && body.email) {
      try {
        await sendEmail({
          to: body.email,
          subject: 'Receipt Confirmed: Public Intel Security Africa Partnership Inquiry',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
              <h2 style="color: #b45309; margin-bottom: 8px;">PUBLIC INTEL SECURITY AFRICA</h2>
              <p style="font-size: 14px; color: #475569; margin-top: 0;">Executive Bureau & Partnerships Desk</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p>Dear <strong>${body.contactName || 'Partner'}</strong>,</p>
              <p>Thank you for submitting a partnership proposal on behalf of <strong>${body.orgName || 'your organization'}</strong> under the <strong>${body.pillar || 'Strategic Partnerships'}</strong> pillar.</p>
              <p>Our executive directorate has received your dossier and will review the alignment of our capabilities.</p>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">&copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.</p>
            </div>
          `
        });
      } catch (err) {
        console.warn('Resend partnership email dispatch note:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Partnership inquiry transmitted to Public Intel Security Africa executive board.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
