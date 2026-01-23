/**
 * ZYBORN ART - Footer Subscription API Endpoint
 * Vercel Serverless Function
 * 
 * Features:
 * - Cloudflare Turnstile verification
 * - Honeypot spam protection
 * - Rate limiting (3/IP/hour)
 * - Supabase storage
 * - Resend welcome email (deliverability optimized)
 * 
 * Created: 2025-01-23
 * Updated: 2025-01-23 - Fixed spam deliverability
 */

import crypto from 'crypto';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, website, turnstileToken, timestamp } = req.body;

        // ==========================================
        // STEP 1: Honeypot Check
        // ==========================================
        if (website && website.trim() !== '') {
            console.log('Honeypot triggered');
            return res.status(200).json({ 
                success: true, 
                message: 'Thank you for subscribing!' 
            });
        }

        // ==========================================
        // STEP 2: Time-based Check (< 2 seconds = bot)
        // ==========================================
        if (timestamp) {
            const submissionTime = Date.now() - parseInt(timestamp);
            if (submissionTime < 2000) {
                console.log('Time check failed: too fast');
                return res.status(200).json({ 
                    success: true, 
                    message: 'Thank you for subscribing!' 
                });
            }
        }

        // ==========================================
        // STEP 3: Turnstile Verification
        // ==========================================
        if (!turnstileToken) {
            return res.status(400).json({ error: 'Verification required' });
        }

        const turnstileResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
                    response: turnstileToken
                })
            }
        );

        const turnstileResult = await turnstileResponse.json();

        if (!turnstileResult.success) {
            console.log('Turnstile verification failed:', turnstileResult);
            return res.status(400).json({ error: 'Verification failed. Please try again.' });
        }

        // ==========================================
        // STEP 4: Email Validation
        // ==========================================
        if (!email || typeof email !== 'string') {
            return res.status(400).json({ error: 'Email is required' });
        }

        const cleanEmail = email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // ==========================================
        // STEP 5: Rate Limiting (3/IP/hour)
        // ==========================================
        const clientIP = req.headers['x-forwarded-for']?.split(',')[0] || 
                         req.headers['x-real-ip'] || 
                         'unknown';
        
        const ipHash = crypto.createHash('sha256').update(clientIP).digest('hex').substring(0, 16);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        const rateLimitCheck = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/simple_subscribers?ip_hash=eq.${ipHash}&subscribed_at=gte.${oneHourAgo}&select=id`,
            {
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                }
            }
        );

        const recentSubmissions = await rateLimitCheck.json();

        if (Array.isArray(recentSubmissions) && recentSubmissions.length >= 3) {
            return res.status(429).json({ error: 'Too many requests. Please try again later.' });
        }

        // ==========================================
        // STEP 6: Check for Duplicate Email
        // ==========================================
        const duplicateCheck = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/simple_subscribers?email=eq.${encodeURIComponent(cleanEmail)}&select=id`,
            {
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                }
            }
        );

        const existingEmail = await duplicateCheck.json();

        if (Array.isArray(existingEmail) && existingEmail.length > 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'You\'re already subscribed!' 
            });
        }

        // ==========================================
        // STEP 7: Insert to Supabase
        // ==========================================
        const insertResponse = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/simple_subscribers`,
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
                    ip_hash: ipHash,
                    turnstile_score: turnstileResult.score || null,
                    welcome_sent: false
                })
            }
        );

        if (!insertResponse.ok) {
            const errorText = await insertResponse.text();
            console.error('Supabase insert error:', errorText);
            throw new Error('Database error');
        }

        // ==========================================
        // STEP 8: Send Welcome Email via Resend
        // (Deliverability Optimized)
        // ==========================================
        try {
            // Generate unique unsubscribe token
            const unsubToken = crypto.createHash('sha256')
                .update(cleanEmail + process.env.RESEND_API_KEY)
                .digest('hex')
                .substring(0, 32);

            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    // Sender with name - looks professional
                    from: 'ZYBORN ART <hello@zyborn.com>',
                    to: cleanEmail,
                    
                    // Reply-to for engagement (important for deliverability)
                    reply_to: 'hello@zyborn.com',
                    
                    // Subject: Personal, not salesy
                    subject: "You're on the list — ZYBORN",
                    
                    // CRITICAL: List-Unsubscribe header (Gmail/Yahoo requirement)
                    headers: {
                        'List-Unsubscribe': `<https://zyborn.com/unsubscribe?token=${unsubToken}&email=${encodeURIComponent(cleanEmail)}>`,
                        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
                    },
                    
                    // Plain text version (CRITICAL for deliverability)
                    text: getPlainTextEmail(),
                    
                    // HTML version
                    html: getWelcomeEmailHTML()
                })
            });

            if (resendResponse.ok) {
                await fetch(
                    `${process.env.SUPABASE_URL}/rest/v1/simple_subscribers?email=eq.${encodeURIComponent(cleanEmail)}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': process.env.SUPABASE_ANON_KEY,
                            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                        },
                        body: JSON.stringify({
                            welcome_sent: true,
                            welcome_sent_at: new Date().toISOString()
                        })
                    }
                );
            } else {
                console.error('Resend error:', await resendResponse.text());
            }
        } catch (emailError) {
            console.error('Email sending error:', emailError);
        }

        // ==========================================
        // SUCCESS
        // ==========================================
        return res.status(200).json({ 
            success: true, 
            message: 'Thank you for subscribing!' 
        });

    } catch (error) {
        console.error('Subscription error:', error);
        return res.status(500).json({ 
            error: 'Something went wrong. Please try again.' 
        });
    }
}

/**
 * Plain text email version
 * CRITICAL for deliverability - spam filters penalize HTML-only
 */
function getPlainTextEmail() {
    return `ZYBORN ART
━━━━━━━━━━

You're on the list.

Thank you for subscribing. You'll receive updates on WORLD's FIRST CANNED BTC — an original artwork sealing Bitcoin inside physical tin cans.

Visit: https://zyborn.com

━━━━━━━━━━

© 2009 ZYBORN ART
https://zyborn.com

To unsubscribe, visit: https://zyborn.com/unsubscribe`;
}

/**
 * HTML email - Deliverability optimized
 * 
 * Changes made:
 * - Added preheader text (hidden preview text)
 * - Simplified HTML structure
 * - Reduced image reliance
 * - Added alt text to all elements
 * - Proper semantic structure
 */
function getWelcomeEmailHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>You're on the list — ZYBORN</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    
    <!-- Preheader text (shows in inbox preview, hidden in email) -->
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">
        Thank you for subscribing to ZYBORN ART. You'll receive updates on WORLD's FIRST CANNED BTC.
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>
    
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 48px 24px;">
                
                <!-- Email Container -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 520px;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 32px; border-bottom: 1px solid #333333;">
                            <span style="font-size: 18px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.12em; text-transform: uppercase;">ZYBORN</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 0;">
                            
                            <!-- Heading -->
                            <h1 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 600; color: #FFFFFF; line-height: 1.3;">
                                You're on the list.
                            </h1>
                            
                            <!-- Body Text -->
                            <p style="margin: 0 0 28px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                Thank you for subscribing. You'll receive updates on <strong style="color: #FFFFFF;">WORLD's FIRST CANNED BTC</strong> — an original artwork sealing Bitcoin inside physical tin cans.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="background-color: #F6931B; border-radius: 4px;">
                                        <a href="https://zyborn.com?utm_source=email&utm_medium=welcome&utm_campaign=subscribe" 
                                           style="display: inline-block; padding: 14px 32px; color: #000000; text-decoration: none; font-weight: 600; font-size: 14px;">
                                            Visit ZYBORN.com
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding-top: 32px; border-top: 1px solid #333333;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #6F6F6F;">
                                © 2009 ZYBORN ART
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #6F6F6F;">
                                <a href="https://zyborn.com" style="color: #6F6F6F; text-decoration: underline;">zyborn.com</a>
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
