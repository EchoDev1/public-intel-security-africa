import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getContent, saveContent } from '@/lib/contentStore';
import { TRAINING_COURSES } from '@/lib/data/training';
import { sendEmail } from '@/lib/email/resend';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store'
};

const DEFAULT_ENLISTERS = [
  {
    id: 'enl-101',
    fullName: 'Major Kenneth Oladipo',
    email: 'k.oladipo@defense.gov.ng',
    phone: '+234 803 234 5678',
    organization: 'Joint Taskforce Intelligence Branch',
    country: 'Nigeria',
    courseSelected: 'Open Source Intelligence (OSINT) & Geolocation Verification',
    dateApplied: '2026-10-02',
    paymentStatus: 'Paid ($450 via Paystack)',
    approvalStatus: 'Approved & Accredited',
    approvalNotes: 'Cleared for Command Cyber Range access. Enrollment badge generated.'
  },
  {
    id: 'enl-102',
    fullName: 'Fatou Binta Camara',
    email: 'f.camara@ecowas.int',
    phone: '+221 77 456 7890',
    organization: 'Regional Maritime Early Warning Bureau',
    country: 'Senegal',
    courseSelected: 'Executive Masterclass: Critical Infrastructure Cyber Defense',
    dateApplied: '2026-10-04',
    paymentStatus: 'Pending Verification',
    approvalStatus: 'Pending Review',
    approvalNotes: 'Awaiting credential review by Chief Training Director.'
  },
  {
    id: 'enl-103',
    fullName: 'Capt. David Kiprop',
    email: 'dkiprop@kdf.go.ke',
    phone: '+254 712 345 678',
    organization: 'East African Border Security Liaison',
    country: 'Kenya',
    courseSelected: 'Hostile Environment Awareness Training (HEAT)',
    dateApplied: '2026-10-05',
    paymentStatus: 'Free Defense Fellowship Granted',
    approvalStatus: 'Approved & Accredited',
    approvalNotes: 'Fellowship approved by Lady Dakore Ekpendu.'
  }
];

const DEFAULT_GATEWAY = {
  activeGateway: 'Paystack',
  currency: 'USD ($)',
  publicKey: 'pk_live_8934729837498237498234',
  merchantEmail: 'payments@publicintel.africa',
  bankAccountName: 'Plugins Media Limited - Public Intel Academy',
  bankAccountNumber: '0123984712',
  bankName: 'Standard Bank / Zenith Bank PLC',
  swiftCode: 'ZEBLNGLA',
  allowFreeAccreditation: true,
  isLiveMode: true
};

export async function GET(request) {
  try {
    const courses = await getContent('training_courses', TRAINING_COURSES);
    const enlisters = await getContent('training_enlisters', DEFAULT_ENLISTERS);
    const gateway = await getContent('training_payment_gateway', DEFAULT_GATEWAY);

    return NextResponse.json({
      success: true,
      courses: Array.isArray(courses) ? courses : TRAINING_COURSES,
      enlisters: Array.isArray(enlisters) ? enlisters : DEFAULT_ENLISTERS,
      paymentGatewaySettings: gateway || DEFAULT_GATEWAY
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

    // 1. Save Courses (Admin Add / Edit / Delete)
    if (action === 'save_courses') {
      const { courses } = body;
      await saveContent('training_courses', courses, { name: 'Academy Training Courses' });
      try {
        revalidatePath('/training');
        revalidatePath('/admin');
      } catch (_) {}
      return NextResponse.json({
        success: true,
        message: 'Courses updated successfully',
        courses
      }, { headers: NO_CACHE_HEADERS });
    }

    // 2. Student Enlistment (Public Application from /training)
    if (action === 'enlist' || !action) {
      const currentEnlisters = await getContent('training_enlisters', DEFAULT_ENLISTERS);
      const newEnlister = {
        id: 'enl-' + Date.now(),
        fullName: body.fullName || body.applicantName || 'Applicant',
        email: body.email || body.applicantEmail || '',
        phone: body.phone || '',
        organization: body.organization || body.applicantOrg || '',
        country: body.country || 'Africa',
        courseSelected: body.courseSelected || body.courseTitle || 'Accredited Training Course',
        dateApplied: new Date().toISOString().split('T')[0],
        paymentStatus: body.paymentStatus || 'Pending Verification',
        approvalStatus: 'Pending Review',
        approvalNotes: 'Awaiting credential review by Chief Training Director.'
      };

      const updated = [newEnlister, ...currentEnlisters];
      await saveContent('training_enlisters', updated, { name: 'Academy Student Enlisters' });

      // Send confirmation email to applicant if Resend is configured
      if (process.env.RESEND_API_KEY && newEnlister.email) {
        try {
          await sendEmail({
            to: newEnlister.email,
            subject: 'Application Received: Public Intel Security Training Academy',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #0f172a;">
                <h2 style="color: #7e22ce; margin-bottom: 8px;">PUBLIC INTEL DEFENSE ACADEMY</h2>
                <p style="font-size: 14px; color: #475569; margin-top: 0;">Student Admissions & Accreditation Desk</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p>Dear <strong>${newEnlister.fullName}</strong>,</p>
                <p>Your application for <strong>${newEnlister.courseSelected}</strong> has been received by our Admissions Board.</p>
                <p>Status: <strong style="color: #b45309;">Pending Review</strong></p>
                <p>Our training coordinators will verify your institutional credentials and dispatch your curriculum access portal.</p>
                <p style="font-size: 12px; color: #94a3b8; margin-top: 32px;">&copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.</p>
              </div>
            `
          });
        } catch (_) {}
      }

      try {
        revalidatePath('/training');
        revalidatePath('/admin');
      } catch (_) {}

      return NextResponse.json({
        success: true,
        message: 'Application submitted successfully. Enrollment file created.',
        data: newEnlister
      }, { headers: NO_CACHE_HEADERS });
    }

    // 3. Update Enlisters List / Status (Admin Approve / Reject)
    if (action === 'save_enlisters' || action === 'update_enlister') {
      const { enlisters } = body;
      await saveContent('training_enlisters', enlisters, { name: 'Academy Student Enlisters' });
      try {
        revalidatePath('/admin');
      } catch (_) {}
      return NextResponse.json({
        success: true,
        message: 'Enlisters registry updated',
        enlisters
      }, { headers: NO_CACHE_HEADERS });
    }

    // 4. Save Payment Gateway Configuration (Admin)
    if (action === 'save_gateway') {
      const { paymentGatewaySettings } = body;
      await saveContent('training_payment_gateway', paymentGatewaySettings, { name: 'Academy Payment Gateway Settings' });
      try {
        revalidatePath('/admin');
        revalidatePath('/training');
      } catch (_) {}
      return NextResponse.json({
        success: true,
        message: 'Payment Gateway settings saved successfully',
        paymentGatewaySettings
      }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, {
      status: 400,
      headers: NO_CACHE_HEADERS
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, {
      status: 500,
      headers: NO_CACHE_HEADERS
    });
  }
}
