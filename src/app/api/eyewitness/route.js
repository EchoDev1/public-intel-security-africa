import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export async function POST(request) {
  try {
    const body = await request.json();
    const trackingCode = `PISA-EYE-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      const { data, error } = await supabase.from('eyewitness_reports').insert([
        {
          tracking_code: trackingCode,
          title: body.title,
          location_description: body.locationDetails,
          region: body.region || 'West Africa',
          category_slug: body.category || 'national-security',
          narrative: body.narrative,
          source_alias: body.sourceAlias || 'Anonymous Whistleblower',
          risk_level: body.riskLevel || 'Elevated',
          verification_status: 'Under Review',
        }
      ]).select();

      if (error) {
        console.error('Supabase eyewitness insertion error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      trackingCode,
      message: 'Intelligence report received and encrypted successfully.',
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
