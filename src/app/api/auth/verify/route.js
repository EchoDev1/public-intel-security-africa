import { NextResponse } from 'next/server';
import { 
  getPendingVerification, 
  saveVerifiedUser 
} from '@/lib/auth/store';
import { sendWelcomeVerifiedEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    const pending = await getPendingVerification(cleanEmail);

    if (!pending) {
      return NextResponse.json(
        { error: 'No pending verification found for this email. Please create an account first.' },
        { status: 404 }
      );
    }

    if (Date.now() > pending.expiresAt) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new code.', expired: true },
        { status: 410 }
      );
    }

    if (pending.code !== cleanCode) {
      return NextResponse.json(
        { error: 'Invalid verification code. Please verify the code in your email and try again.' },
        { status: 400 }
      );
    }

    // Mark as verified and save user record
    const user = await saveVerifiedUser({
      email: cleanEmail,
      fullName: pending.fullName,
      passwordHash: pending.passwordHash,
      rawPassword: pending.rawPassword
    });

    // Send Welcome / Confirmation email via Resend
    try {
      await sendWelcomeVerifiedEmail({
        to: cleanEmail,
        fullName: user.fullName
      });
    } catch (err) {
      console.warn('Welcome email dispatch note:', err.message);
    }

    return NextResponse.json({
      success: true,
      user,
      message: 'Account successfully verified! Welcome to Public Intel Security Africa.'
    });
  } catch (error) {
    console.error('Error in verify API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error verifying code.' },
      { status: 500 }
    );
  }
}
