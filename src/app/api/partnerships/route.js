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

const DEFAULT_PARTNERSHIPS = [
  {
    id: 'part-01',
    org: 'African Centre for Strategic Studies (ACSS)',
    contact: 'Dr. Raymond Adeyemi',
    email: 'raymond.adeyemi@acss-africa.org',
    pillar: 'Maritime & Airspace Surveillance Collaboration',
    agreementType: 'Strategic Research & Media Syndication',
    date: '2026-10-01',
    status: 'Active Partnership',
    notes: 'Initial MOU signed for quarterly joint symposium'
  },
  {
    id: 'part-02',
    org: 'Regional Maritime Early Warning Bureau (Abidjan)',
    contact: 'Capt. Emmanuel Kwesi',
    email: 'e.kwesi@rmewb-littoral.org',
    pillar: 'Coastal Defense & Choke Point Security',
    agreementType: 'Telecommunications & Remote Sensing',
    date: '2026-09-28',
    status: 'Active Partnership',
    notes: 'Active data pipe providing high-resolution imagery'
  },
  {
    id: 'part-03',
    org: 'Pan-African Peace Architecture Forum (Addis Ababa)',
    contact: 'Dr. Sarah Mwangi',
    email: 'sarah.mwangi@papa-security.org',
    pillar: 'Civil-Military Doctrine & Gender Integration',
    agreementType: 'Academic Fellowship & Executive Training',
    date: '2026-09-15',
    status: 'Active Partnership',
    notes: 'Curriculum development and accredited masterclass hosting'
  }
];

const DEFAULT_BUREAUS = [
  {
    id: 'bur-01',
    city: 'Abuja Bureau HQ',
    region: 'West Africa Desk',
    country: 'Nigeria',
    address: 'Plot 412, Constitution Avenue, Central Business District, Abuja, FCT',
    phone: '+234 9 291 8000',
    email: 'abuja.bureau@publicintel.africa',
    isHeadquarters: true,
    officerInCharge: 'Lady Dakore Ekpendu'
  },
  {
    id: 'bur-02',
    city: 'Nairobi Bureau',
    region: 'East Africa & Great Lakes',
    country: 'Kenya',
    address: 'Kilimani Intelligence Tower, Argwings Kodhek Rd, Nairobi',
    phone: '+254 20 491 5000',
    email: 'nairobi.bureau@publicintel.africa',
    isHeadquarters: false,
    officerInCharge: 'Capt. David Kiprop'
  },
  {
    id: 'bur-03',
    city: 'Dakar Maritime Desk',
    region: 'Sahel & Littoral Atlantic',
    country: 'Senegal',
    address: 'Avenue Cheikh Anta Diop, Fann Residence, Dakar',
    phone: '+221 33 869 2000',
    email: 'dakar.bureau@publicintel.africa',
    isHeadquarters: false,
    officerInCharge: 'Col. Amadou Touré'
  }
];

export async function GET(request) {
  try {
    let inquiries = [];

    if (isSupabaseConfigured()) {
      try {
        const supabase = createServerSupabaseClient();
        const { data, error } = await supabase
          .from('partnership_inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          inquiries = data;
        }
      } catch (err) {
        console.warn('Supabase fetch inquiries notice:', err.message);
      }
    }

    const partnerships = await getContent('partnerships_registry', DEFAULT_PARTNERSHIPS);
    const bureauContacts = await getContent('bureau_contacts', DEFAULT_BUREAUS);

    return NextResponse.json({
      success: true,
      inquiries,
      partnerships: Array.isArray(partnerships) ? partnerships : DEFAULT_PARTNERSHIPS,
      bureauContacts: Array.isArray(bureauContacts) ? bureauContacts : DEFAULT_BUREAUS
    }, {
      headers: NO_CACHE_HEADERS
    });
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
    const { action } = body;

    // 1. Update Inquiry Status (Admin)
    if (action === 'update_inquiry_status') {
      const { id, status } = body;
      if (isSupabaseConfigured() && id) {
        const supabase = createServerSupabaseClient();
        await supabase.from('partnership_inquiries').update({ status }).eq('id', id);
      }
      try { revalidatePath('/admin'); } catch (_) {}
      return NextResponse.json({ success: true, message: 'Inquiry status updated' }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Delete Inquiry (Admin)
    if (action === 'delete_inquiry') {
      const { id } = body;
      if (isSupabaseConfigured() && id) {
        const supabase = createServerSupabaseClient();
        await supabase.from('partnership_inquiries').delete().eq('id', id);
      }
      try { revalidatePath('/admin'); } catch (_) {}
      return NextResponse.json({ success: true, message: 'Inquiry deleted' }, { headers: NO_CACHE_HEADERS });
    }

    // 3. Save Partnerships List (Admin)
    if (action === 'save_partnerships') {
      const { partnerships } = body;
      await saveContent('partnerships_registry', partnerships, { name: 'Institutional Partnerships Registry' });
      try { revalidatePath('/admin'); revalidatePath('/partnership'); revalidatePath('/collaboration'); } catch (_) {}
      return NextResponse.json({ success: true, message: 'Partnerships registry saved' }, { headers: NO_CACHE_HEADERS });
    }

    // 4. Save Bureau Contacts (Admin)
    if (action === 'save_bureaus') {
      const { bureauContacts } = body;
      await saveContent('bureau_contacts', bureauContacts, { name: 'Regional Bureau Contacts' });
      try { revalidatePath('/admin'); revalidatePath('/contacts'); } catch (_) {}
      return NextResponse.json({ success: true, message: 'Bureau contacts saved' }, { headers: NO_CACHE_HEADERS });
    }

    // 5. Default: Public Inquiry Submission (from /partnership or /collaboration)
    const inquiryType = body.type || (body.isCollaboration ? 'Collaboration' : 'Partnership');
    const formattedProposal = body.type 
      ? `[${body.type.toUpperCase()}] ${body.proposal || ''}`
      : (body.proposal || '');

    if (isSupabaseConfigured()) {
      const supabase = createServerSupabaseClient();
      await supabase.from('partnership_inquiries').insert([
        {
          organization_name: body.orgName || '',
          contact_name: body.contactName || '',
          contact_email: body.email || '',
          contact_phone: body.phone || '',
          partnership_pillar: body.pillar || `${inquiryType} Protocol`,
          country: body.country || '',
          proposal_summary: formattedProposal,
          status: 'Received'
        }
      ]);
    }

    // Send acknowledgment email via Resend if configured
    if (process.env.RESEND_API_KEY && body.email) {
      try {
        await sendEmail({
          to: body.email,
          subject: `Receipt Confirmed: Public Intel Security Africa ${inquiryType} Inquiry`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
              <h2 style="color: #b45309; margin-bottom: 8px;">PUBLIC INTEL SECURITY AFRICA</h2>
              <p style="font-size: 14px; color: #475569; margin-top: 0;">Executive Directorate & Partnerships Desk</p>
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
              <p>Dear <strong>${body.contactName || 'Partner'}</strong>,</p>
              <p>Thank you for submitting a ${inquiryType.toLowerCase()} proposal on behalf of <strong>${body.orgName || 'your organization'}</strong> under the <strong>${body.pillar || 'Strategic Partnerships'}</strong> pillar.</p>
              <p>Our executive directorate has received your dossier and will review the alignment of our capabilities.</p>
              <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">&copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.</p>
            </div>
          `
        });
      } catch (err) {
        console.warn('Resend partnership email dispatch note:', err);
      }
    }

    try {
      revalidatePath('/admin');
      revalidatePath('/partnership');
      revalidatePath('/collaboration');
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: `${inquiryType} inquiry transmitted to Public Intel Security Africa executive board.`,
    }, {
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
