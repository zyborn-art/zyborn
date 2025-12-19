// api/subscribe.js
// Vercel Edge Function for handling email subscriptions
// Integrates with Supabase (database) and Resend (transactional email)

export const config = {
  runtime: 'edge',
};

// Environment variables (set in Vercel dashboard):
// - SUPABASE_URL
// - SUPABASE_ANON_KEY
// - RESEND_API_KEY
// - RESEND_FROM_EMAIL (e.g., "ZYBORN <noreply@zyborn.com>")

export default async function handler(req) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json();
    const { email, name, role, interests, source, timestamp } = body;

    // Validate required fields
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers }
      );
    }

    // Store in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabaseResponse = await fetch(
        `${supabaseUrl}/rest/v1/subscribers`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            name: name || null,
            role: role || null,
            interests: interests || [],
            source: source || 'landing_page',
            created_at: timestamp || new Date().toISOString(),
          }),
        }
      );

      // Handle duplicate email (409 Conflict from Supabase)
      if (supabaseResponse.status === 409) {
        return new Response(
          JSON.stringify({ 
            message: 'You are already subscribed!',
            status: 'existing'
          }),
          { status: 200, headers }
        );
      }

      if (!supabaseResponse.ok && supabaseResponse.status !== 201) {
        console.error('Supabase error:', await supabaseResponse.text());
        // Continue anyway - we don't want to fail if DB has issues
      }
    }

    // Send welcome email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'ZYBORN <noreply@zyborn.com>';

    if (resendApiKey) {
      const welcomeEmailHtml = generateWelcomeEmail(name, source);
      
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: "You're on the list — ZYBORN",
          html: welcomeEmailHtml,
        }),
      });

      if (!resendResponse.ok) {
        console.error('Resend error:', await resendResponse.text());
        // Continue anyway - subscription was successful even if email failed
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully subscribed!',
        status: 'success'
      }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('Subscribe error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}

function generateWelcomeEmail(name, source) {
  const greeting = name ? `Dear ${name}` : 'Hello';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ZYBORN</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #000000;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
          
          <!-- Header -->
          <tr>
            <td style="padding-bottom: 40px; border-bottom: 1px solid #2A2A2A;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.02em;">ZYBORN</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 0;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #BDBDBD;">
                ${greeting},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #BDBDBD;">
                Thank you for registering your interest in <strong style="color: #FFFFFF;">WORLD's FIRST CANNED BTC</strong>.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #BDBDBD;">
                You're now on the list to receive:
              </p>
              <ul style="margin: 0 0 24px; padding-left: 20px; font-size: 16px; line-height: 1.8; color: #BDBDBD;">
                <li>A reminder when the auction opens (December 2025)</li>
                <li>A final alert 24 hours before bidding closes</li>
                <li>Updates on the London exhibition (3 January 2026)</li>
              </ul>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #BDBDBD;">
                In the meantime, follow us on social media for behind-the-scenes content and project updates.
              </p>
              
              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius: 2px; background-color: #F6931B;">
                    <a href="https://zyborn.com" target="_blank" style="display: inline-block; padding: 16px 32px; font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: 500; color: #000000; text-decoration: none; text-transform: uppercase; letter-spacing: 0.08em;">
                      Visit ZYBORN.COM
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Social Links -->
          <tr>
            <td style="padding: 32px 0; border-top: 1px solid #2A2A2A; border-bottom: 1px solid #2A2A2A;">
              <p style="margin: 0 0 16px; font-size: 12px; font-family: 'Courier New', Courier, monospace; text-transform: uppercase; letter-spacing: 0.08em; color: #6F6F6F;">
                Follow Us
              </p>
              <p style="margin: 0; font-size: 14px; line-height: 2; color: #BDBDBD;">
                <a href="https://www.instagram.com/zyborn.art/" target="_blank" style="color: #FFFFFF; text-decoration: none;">Instagram</a> &nbsp;•&nbsp;
                <a href="https://x.com/ZYBORN_ART" target="_blank" style="color: #FFFFFF; text-decoration: none;">X</a> &nbsp;•&nbsp;
                <a href="https://www.tiktok.com/@zyborn_art" target="_blank" style="color: #FFFFFF; text-decoration: none;">TikTok</a> &nbsp;•&nbsp;
                <a href="https://www.youtube.com/@ZYBORN_ART" target="_blank" style="color: #FFFFFF; text-decoration: none;">YouTube</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 0;">
              <p style="margin: 0 0 8px; font-size: 12px; font-family: 'Courier New', Courier, monospace; color: #6F6F6F;">
                © 2009 ZYBORN ART. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; font-family: 'Courier New', Courier, monospace; color: #6F6F6F;">
                <a href="https://zyborn.com/privacy" target="_blank" style="color: #6F6F6F; text-decoration: underline;">Privacy</a> &nbsp;•&nbsp;
                <a href="https://zyborn.com/unsubscribe" target="_blank" style="color: #6F6F6F; text-decoration: underline;">Unsubscribe</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
