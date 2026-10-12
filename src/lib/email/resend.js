import { Resend } from 'resend';

// Initialize Resend with the RESEND_API_KEY from environment variables
const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

/**
 * Send an email via Resend
 * @param {Object} options
 * @param {string|string[]} options.to - Recipient email(s)
 * @param {string} options.subject - Email subject line
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text body
 * @param {string} [options.from] - Sender address (defaults to onboard or customized domain)
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = 'Public Intel Africa <onboarding@resend.dev>'
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
