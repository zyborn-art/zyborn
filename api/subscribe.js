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

        // Sanitize email
        const cleanEmail = email.toLowerCase().trim();

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
                    email: cleanEmail,
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
                to: cleanEmail,
                subject: "You're on the list — ZYBORN",
                html: getWelcomeEmailHTML(name)
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
                                <li>The auction opens (December 2025)</li>
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
