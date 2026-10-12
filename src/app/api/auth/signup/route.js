import { NextResponse } from 'next/server';
import { 
  generateVerificationCode, 
  savePendingVerification, 
  getUserByEmail 
} from '@/lib/auth/store';
import { sendVerificationEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const { fullName, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if account is already registered and verified
    const existingUser = await getUserByEmail(cleanEmail);
    if (existingUser && existingUser.isVerified) {
      return NextResponse.json(
        { 
          error: 'An account with this email already exists. Please sign in instead.',
          alreadyRegistered: true 
        },
        { status: 409 }
      );
    }

    // Special check for super admin email
    if (cleanEmail === 'ekpendudakore@gmail.com') {
      return NextResponse.json(
        { 
          error: 'Administrator email detected. Please use the Administrator Sign In portal.',
          isAdmin: true 
        },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP code
    const code = generateVerificationCode();

    // Store pending verification with 15-minute expiration
    await savePendingVerification({
      email: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      password,
      code,
      expiresAt: Date.now() + 15 * 60 * 1000
    });

    // Send verification email via Resend
    let emailResult = await sendVerificationEmail({
      to: cleanEmail,
      fullName: fullName || cleanEmail.split('@')[0],
      code
    });

    if (!emailResult.success) {
      console.warn('Resend verification email notice:', emailResult.error);
    }

    return NextResponse.json({
      success: true,
      pendingVerification: true,
      email: cleanEmail,
      message: `Verification code sent to ${cleanEmail}. Please enter the 6-digit code to complete registration.`
    });
  } catch (error) {
    console.error('Error in signup API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing sign-up.' },
      { status: 500 }
    );
  }
}
