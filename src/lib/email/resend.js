import { Resend } from 'resend';

// Initialize Resend with the RESEND_API_KEY from environment variables
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Official verified domain sender
export const DEFAULT_FROM = process.env.EMAIL_FROM || 'Public Intel Security Africa <auth@publicintelsecurity.africa>';

/**
 * Core helper to send an email via Resend
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.from] - Sender address
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = DEFAULT_FROM
}) {
  if (!resend) {
    console.warn('Resend client not initialized: RESEND_API_KEY is not defined.');
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const data = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>?/gm, '')
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return { success: false, error: error.message };
  }
}

/**
 * 1. Verification Code Email (Dispatched on Account Creation)
 */
export async function sendVerificationEmail({ to, fullName, code }) {
  const recipientName = fullName || to.split('@')[0];
  const subject = `[Verification Code: ${code}] Activate Your Public Intel Security Africa Account`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #b45309; padding: 28px 32px; text-align: left;">
          <div style="display: inline-block; padding: 4px 10px; background-color: rgba(217, 119, 6, 0.15); border: 1px solid #d97706; border-radius: 6px; font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
            Pan-African Defense & Strategic Intelligence
          </div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
            PUBLIC INTEL SECURITY AFRICA
          </h1>
        </div>

        <!-- Body -->
        <div style="padding: 32px; color: #e2e8f0;">
          <h2 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
            Verify Your Reader Account
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 12px 0 20px;">
            Hello <strong>${recipientName}</strong>, thank you for registering with Public Intel Security Africa. 
            To activate your account and access your reader portal, enter the 6-digit verification code below:
          </p>

          <!-- OTP Code Box -->
          <div style="background-color: #1e293b; border: 2px solid #d97706; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; margin-bottom: 6px;">
              Your 6-Digit One-Time Code
            </div>
            <div style="font-size: 38px; font-weight: 900; letter-spacing: 10px; color: #ffffff; font-family: 'Courier New', Courier, monospace;">
              ${code}
            </div>
            <div style="font-size: 11px; color: #94a3b8; margin-top: 8px;">
              Valid for the next 15 minutes
            </div>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
            If you did not request this account creation, please disregard this email. Your email will not be activated without this verification code.
          </p>

          <div style="margin-top: 28px; padding: 14px 18px; background-color: rgba(30, 41, 59, 0.7); border-left: 3px solid #d97706; border-radius: 6px; font-size: 12px; color: #cbd5e1;">
            <strong>Security Reminder:</strong> Never share this verification code with anyone. Official Public Intel personnel will never ask for your code.
          </div>
        </div>

        <!-- Footer -->
        <div style="border-top: 1px solid #1e293b; background-color: #0b1120; padding: 20px 32px; font-size: 11px; color: #64748b; line-height: 1.6;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.</p>
          <p style="margin: 4px 0 0;">Confidential Intelligence Tippline: <a href="mailto:tipline@publicintel.africa" style="color: #d97706; text-decoration: none;">tipline@publicintel.africa</a></p>
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 2. Welcome & Account Activated Email (Dispatched after Successful Code Verification)
 */
export async function sendWelcomeVerifiedEmail({ to, fullName }) {
  const recipientName = fullName || to.split('@')[0];
  const subject = `Welcome to Public Intel Security Africa — Account Verified`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Account Verified</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #10b981; padding: 28px 32px;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
            PUBLIC INTEL SECURITY AFRICA
          </h1>
          <p style="margin: 4px 0 0; font-size: 12px; color: #34d399; font-weight: 600;">
            ✓ Account Successfully Verified
          </p>
        </div>

        <div style="padding: 32px; color: #e2e8f0;">
          <h2 style="margin-top: 0; font-size: 18px; font-weight: 700; color: #ffffff;">
            Welcome, ${recipientName}
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
            Your reader membership has been verified and activated. You now have full access to our comprehensive intelligence coverage across all 25 African security verticals.
          </p>

          <div style="background-color: #1e293b; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #334155;">
            <div style="font-size: 13px; font-weight: 700; color: #f59e0b; margin-bottom: 10px;">
              Your Reader Privileges:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cbd5e1; line-height: 1.8;">
              <li>Personalized Reader Portal & Saved Story Dossiers</li>
              <li>Priority Intelligence Advisories & Threat Radar Updates</li>
              <li>Encrypted Whistleblower & Eyewitness Telemetry</li>
              <li>Full Archive Access to Podcasts, TV & Radio Broadcasts</li>
            </ul>
          </div>

          <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
            Access your dashboard anytime by signing in at <a href="https://publicintelsecurity.africa/dashboard" style="color: #d97706; text-decoration: none; font-weight: 600;">publicintelsecurity.africa</a>.
          </p>
        </div>

        <div style="border-top: 1px solid #1e293b; background-color: #0b1120; padding: 20px 32px; font-size: 11px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}

/**
 * 3. Login Security Alert Email (Dispatched on every successful sign-in)
 */
export async function sendLoginAlertEmail({ to, fullName, timestamp, userAgent, ip, country }) {
  const recipientName = fullName || to.split('@')[0];
  const formattedTime = timestamp || new Date().toUTCString();
  const subject = `Security Alert: Successful Sign-in to Your Public Intel Account`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Login Security Alert</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
        
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-bottom: 2px solid #f59e0b; padding: 28px 32px;">
          <div style="display: inline-block; padding: 3px 8px; background-color: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; border-radius: 4px; font-size: 10px; font-weight: 800; color: #f59e0b; text-transform: uppercase; margin-bottom: 6px;">
            Access &amp; Security Telemetry
          </div>
          <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
            PUBLIC INTEL SECURITY AFRICA
          </h1>
        </div>

        <div style="padding: 32px; color: #e2e8f0;">
          <h2 style="margin-top: 0; font-size: 17px; font-weight: 700; color: #ffffff;">
            Successful Sign-in Detected
          </h2>
          <p style="font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 8px 0 20px;">
            Hello <strong>${recipientName}</strong>, we recorded a successful sign-in to your verified Public Intel Security Africa reader account.
          </p>

          <!-- Audit Table -->
          <div style="background-color: #1e293b; border-radius: 10px; border: 1px solid #334155; overflow: hidden; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 16px; color: #94a3b8; font-weight: 600; width: 35%;">Account</td>
                <td style="padding: 10px 16px; color: #ffffff; font-family: monospace;">${to}</td>
              </tr>
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 16px; color: #94a3b8; font-weight: 600;">Time (UTC)</td>
                <td style="padding: 10px 16px; color: #ffffff;">${formattedTime}</td>
              </tr>
              ${ip ? `
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 16px; color: #94a3b8; font-weight: 600;">IP Address</td>
                <td style="padding: 10px 16px; color: #ffffff; font-family: monospace;">${ip}</td>
              </tr>` : ''}
              ${country ? `
              <tr style="border-bottom: 1px solid #334155;">
                <td style="padding: 10px 16px; color: #94a3b8; font-weight: 600;">Geographic Origin</td>
                <td style="padding: 10px 16px; color: #38bdf8; font-weight: 600;">${country}</td>
              </tr>` : ''}
              ${userAgent ? `
              <tr>
                <td style="padding: 10px 16px; color: #94a3b8; font-weight: 600;">Device / Client</td>
                <td style="padding: 10px 16px; color: #cbd5e1; font-size: 12px;">${userAgent}</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="margin-top: 24px; padding: 14px 18px; background-color: rgba(239, 68, 68, 0.1); border-left: 3px solid #ef4444; border-radius: 6px; font-size: 12px; color: #fca5a5; line-height: 1.5;">
            <strong>Was this you?</strong> If yes, no action is required. If you did NOT initiate this sign-in, please secure your account immediately or notify our newsroom security desk at <a href="mailto:tipline@publicintel.africa" style="color: #ffffff; text-decoration: underline;">tipline@publicintel.africa</a>.
          </div>
        </div>

        <div style="border-top: 1px solid #1e293b; background-color: #0b1120; padding: 20px 32px; font-size: 11px; color: #64748b;">
          &copy; ${new Date().getFullYear()} Public Intel Security Africa. A Production of Plugins Media Limited.
        </div>

      </div>
    </body>
    </html>
  `;

  return sendEmail({ to, subject, html });
}
