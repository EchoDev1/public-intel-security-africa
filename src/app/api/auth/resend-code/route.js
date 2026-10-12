import { NextResponse } from 'next/server';
import { 
  getPendingVerification, 
  savePendingVerification, 
  generateVerificationCode 
} from '@/lib/auth/store';
import { sendVerificationEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const pending = await getPendingVerification(cleanEmail);

    if (!pending) {
      return NextResponse.json(
        { error: 'No registration in progress for this email address. Please sign up.' },
        { status: 404 }
      );
    }

    const newCode = generateVerificationCode();

    await savePendingVerification({
      email: cleanEmail,
      fullName: pending.fullName,
      password: '', // Kept in hash
      code: newCode,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    const emailResult = await sendVerificationEmail({
      to: cleanEmail,
      fullName: pending.fullName,
      code: newCode
    });

    if (!emailResult.success) {
      console.warn('Resend verification code note:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `A fresh 6-digit verification code has been dispatched to ${cleanEmail}.`
    });
  } catch (error) {
    console.error('Error in resend-code route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error resending code.' },
      { status: 500 }
    );
  }
}
