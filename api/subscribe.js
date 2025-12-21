/**
 * ZYBORN ART - Email Subscription API Endpoint
 * Vercel Serverless Function
 * 
 * Integrates with:
 * - Supabase (database storage)
 * - Resend (email delivery)
 * 
 * Updated: 2025-12-21
 */

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).json({ ok: true });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    try {
        const { email, name, role, interests, source, formLocation } = req.body;

        // Validate email with regex (same pattern as press-inquiry.js)
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // Get environment variables
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'hello@zyborn.com';
        const RESEND_FROM_NAME = process.env.RESEND_FROM_NAME || 'ZYBORN ART';

        // Validate environment variables
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.error('Missing Supabase configuration');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Sanitize email
        const cleanEmail = email.toLowerCase().trim();

        // 1. Save to Supabase
        const supabaseResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/email_subscribers`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    email: cleanEmail,
                    full_name: name ? name.trim() : null,
                    role: role || null,
                    interests: interests || [],
                    source: source || 'landing_page',
                    form_location: formLocation || source || 'hero',
                    subscribed_at: new Date().toISOString()
                })
            }
        );

        if (!supabaseResponse.ok) {
            const errorText = await supabaseResponse.text();
            console.error('Supabase error:', errorText);
            
            // Check if it's a duplicate email error
            if (errorText.includes('duplicate') || errorText.includes('23505')) {
                return res.status(200).json({ 
                    success: true, 
                    message: 'You are already subscribed!' 
                });
            }
            throw new Error(`Supabase error: ${errorText}`);
        }

        // 2. Send welcome email via Resend
        if (RESEND_API_KEY) {
            try {
                const resendResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: `${RESEND_FROM_NAME} <${RESEND_FROM_EMAIL}>`,
                        to: cleanEmail,
                        subject: "You're on the list — ZYBORN",
                        html: getWelcomeEmailHTML(name)
                    })
                });

                if (!resendResponse.ok) {
                    const resendError = await resendResponse.text();
                    console.error('Resend error:', resendError);
                    // Don't fail the request if email fails
                }
            } catch (emailError) {
                console.error('Email send error:', emailError);
                // Don't fail the request if email fails
            }
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

/**
 * Generate welcome email HTML
 * Matches ZYBORN brand kit: black background, Bitcoin orange accent
 */
function getWelcomeEmailHTML(name) {
    const greeting = name ? `Hello ${name},` : 'Hello,';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ZYBORN</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #000000; max-width: 100%;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 30px 0; border-bottom: 1px solid #2A2A2A;">
                            <span style="font-size: 28px; font-weight: 700; color: #F6931B; letter-spacing: 0.1em;">ZYBORN</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #6F6F6F; text-transform: uppercase; letter-spacing: 0.1em;">
                                CONFIRMATION
                            </p>
                            
                            <h1 style="margin: 0 0 30px 0; font-size: 24px; color: #FFFFFF; font-weight: 600; line-height: 1.3;">
                                You're on the list.
                            </h1>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                ${greeting}
                            </p>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                Thank you for your interest in <strong style="color: #FFFFFF;">WORLD's FIRST CANNED BTC</strong> by ZYBORN.
                            </p>
                            
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                We'll notify you when:
                            </p>
                            
                            <ul style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; color: #BDBDBD; line-height: 1.8;">
                                <li>The auction opens (24 December 2025)</li>
                                <li>24 hours before bidding closes</li>
                                <li>London exhibition details are finalized (3 January 2026)</li>
                            </ul>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                                <tr>
                                    <td style="background-color: #F6931B; border-radius: 2px;">
                                        <a href="https://zyborn.com" style="display: inline-block; padding: 14px 28px; color: #000000; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                                            Visit ZYBORN.com
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 32px 0 0 0; font-size: 14px; color: #6F6F6F; line-height: 1.6;">
                                You can unsubscribe at any time by clicking the link in any email.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; border-top: 1px solid #2A2A2A;">
                            <p style="margin: 0; font-size: 12px; color: #6F6F6F; text-align: center;">
                                © 2025 ZYBORN ART. All rights reserved.<br>
                                <a href="https://zyborn.com" style="color: #6F6F6F;">zyborn.com</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}
