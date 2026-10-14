import { NextResponse } from 'next/server';
import { 
  getPendingVerification, 
  getUserByEmail,
  verifyUserCredentials 
} from '@/lib/auth/store';
import { sendLoginAlertEmail } from '@/lib/email/resend';
import { getClientInfo } from '@/lib/network/clientInfo';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email address and password are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const { ip, country, userAgent } = getClientInfo(request);

    // 1. Super Admin Authentication
    if (cleanEmail === 'ekpendudakore@gmail.com') {
      if (password !== 'ladydakore@artellium90') {
        return NextResponse.json(
          { error: 'Invalid administrator credentials. Access denied.' },
          { status: 401 }
        );
      }

      const adminUser = {
        displayName: 'Lady Dakore',
        fullName: 'Lady Dakore Ekpendu',
        email: 'Ekpendudakore@gmail.com',
        role: 'admin',
        isVerified: true,
        joinedDate: 'September 2026',
        bio: 'Executive Director & Chief Editor',
        avatarInitial: 'D'
      };

      // Dispatch security notification email to Super Admin via Resend
      try {
        await sendLoginAlertEmail({
          to: 'Ekpendudakore@gmail.com',
          fullName: 'Lady Dakore Ekpendu',
          timestamp: new Date().toUTCString(),
          userAgent,
          ip,
          country
        });
      } catch (err) {
        console.warn('Admin login alert email note:', err.message);
      }

      return NextResponse.json({
        success: true,
        user: adminUser,
        isAdmin: true,
        redirectTo: '/admin'
      });
    }

    // 2. Reject unauthorized admin role escalation
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized role assignment. Administrator credentials required.' },
        { status: 403 }
      );
    }

    // 3. Check if account is still unverified from sign-up
    // Verification is strictly handled in Create Account; login only alerts user to activate
    const existingVerifiedUser = await getUserByEmail(cleanEmail);
    const pending = await getPendingVerification(cleanEmail);

    if (pending && !existingVerifiedUser) {
      return NextResponse.json({
        success: false,
        error: 'This account has not been activated yet. Please enter the verification code sent when you created your account, or register a new account.'
      }, { status: 401 });
    }

    // 4. Strict Credential Verification (Password Matching)
    // Random emails and wrong passwords will be firmly rejected
    const authResult = await verifyUserCredentials(cleanEmail, password);

    if (!authResult.valid) {
      return NextResponse.json({
        success: false,
        error: authResult.error || 'Invalid email or password. Please verify your credentials or create an account.'
      }, { status: 401 });
    }

    const verifiedUser = authResult.user;

    // 5. Dispatch instant sign-in security notification email via Resend
    // Dispatched ONLY on valid login from the login section
    try {
      await sendLoginAlertEmail({
        to: cleanEmail,
        fullName: verifiedUser.fullName || verifiedUser.displayName,
        timestamp: new Date().toUTCString(),
        userAgent,
        ip,
        country
      });
    } catch (err) {
      console.warn('Reader login alert email note:', err.message);
    }

    return NextResponse.json({
      success: true,
      user: verifiedUser,
      isAdmin: false,
      redirectTo: '/dashboard'
    });

  } catch (error) {
    console.error('Error in signin API route:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error processing sign-in.' },
      { status: 500 }
    );
  }
}
