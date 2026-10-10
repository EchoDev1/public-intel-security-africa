import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

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

    return NextResponse.json({
      success: true,
      message: 'Partnership inquiry transmitted to Public Intel Security Africa executive board.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
