import { NextResponse } from 'next/server';
import { 
  getUserByEmail, 
  getPendingVerification, 
  saveVerifiedUser 
} from '@/lib/auth/store';
import { sendLoginAlertEmail } from '@/lib/email/resend';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const userAgent = request.headers.get('user-agent') || 'Web Browser';
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Local / Secured IP';

    // 1. Check Super Admin Credentials
    if (cleanEmail === 'ekpendudakore@gmail.com') {
      if (password !== 'ladydakore@artellium90') {
        return NextResponse.json(
          { error: 'Invalid admin credentials. Please enter the correct password.' },
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

      // Dispatch instant login notification email to Super Admin via Resend
      try {
        await sendLoginAlertEmail({
          to: 'Ekpendudakore@gmail.com',
          fullName: 'Lady Dakore Ekpendu',
          timestamp: new Date().toUTCString(),
          userAgent,
          ip
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

    // 2. Reject non-admin role escalation
    if (role === 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin credentials required.' },
        { status: 403 }
      );
    }

    // 3. Check if user is pending verification
    const pending = await getPendingVerification(cleanEmail);
    if (pending) {
      return NextResponse.json({
        success: false,
        requiresVerification: true,
        email: cleanEmail,
        error: 'Your email address has not been verified yet. Please enter your verification code to continue.'
      }, { status: 403 });
    }

    // 4. Look up user
    let user = await getUserByEmail(cleanEmail);

    // If user not in store yet, register them as verified reader
    if (!user) {
      user = await saveVerifiedUser({
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0],
        passwordHash: ''
      });
    }

    // 5. Dispatch instant sign-in security notification email via Resend
    try {
      await sendLoginAlertEmail({
        to: cleanEmail,
        fullName: user.fullName || user.displayName,
        timestamp: new Date().toUTCString(),
        userAgent,
        ip
      });
    } catch (err) {
      console.warn('Reader login alert email note:', err.message);
    }

    return NextResponse.json({
      success: true,
      user,
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
