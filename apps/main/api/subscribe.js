// api/subscribe.js
// Handles email subscription form submissions

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, role, interests, source } = req.body;

    // Validate email
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // 1. Save to Supabase
    const supabaseResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/email_subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          email,
          name: name || null,
          role: role || null,
          interests: interests || [],
          source: source || 'landing_page'
        })
      }
    );

    if (!supabaseResponse.ok) {
      const errorText = await supabaseResponse.text();
      // Check if it's a duplicate email error
      if (errorText.includes('duplicate')) {
        return res.status(200).json({ 
          success: true, 
          message: 'You are already subscribed!' 
        });
      }
      throw new Error(`Supabase error: ${errorText}`);
    }

    // 2. Send welcome email via Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ZYBORN ART <hello@zyborn.com>',
        to: email,
        subject: 'Welcome to ZYBORN — Auction Updates',
        html: `
          <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 40px;">
            <h1 style="color: #F6931B; margin-bottom: 24px;">Thank you for your interest</h1>
            <p style="font-size: 16px; line-height: 1.6;">
              You're now on the list for <strong>WORLD's FIRST CANNED BTC</strong> by ZYBORN.
            </p>
            <p style="font-size: 16px; line-height: 1.6;">
              We'll notify you when:
            </p>
            <ul style="font-size: 16px; line-height: 1.8;">
              <li>The auction opens (24 December 2025)</li>
              <li>24 hours before bidding closes</li>
              <li>Exhibition details are finalized (London, 3 January 2026)</li>
            </ul>
            <p style="margin-top: 32px; font-size: 14px; color: #888;">
              You can unsubscribe at any time by clicking the link in any email.
            </p>
            <hr style="border: 1px solid #333; margin: 32px 0;">
            <p style="font-size: 12px; color: #666;">
              ZYBORN ART<br>
              <a href="https://zyborn.com" style="color: #F6931B;">zyborn.com</a>
            </p>
          </div>
        `
      })
    });

    if (!resendResponse.ok) {
      // Log error but don't fail the whole request
      console.error('Resend error:', await resendResponse.text());
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ 
      error: 'Something went wrong. Please try again.' 
    });
  }
}