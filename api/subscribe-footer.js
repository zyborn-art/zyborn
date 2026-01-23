/**
 * ZYBORN ART - Footer Subscription API Endpoint
 * Vercel Serverless Function
 * 
 * Features:
 * - Cloudflare Turnstile verification
 * - Honeypot spam protection
 * - Rate limiting (3/IP/hour)
 * - Supabase storage
 * - Resend welcome email
 * 
 * Created: 2025-01-23
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
            // Bot filled in honeypot field - return fake success
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
        
        // Hash IP for privacy
        const ipHash = crypto.createHash('sha256').update(clientIP).digest('hex').substring(0, 16);

        // Check rate limit
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
        // ==========================================
        try {
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                },
                body: JSON.stringify({
                    from: 'ZYBORN ART <hello@zyborn.com>',
                    to: cleanEmail,
                    subject: 'Welcome to ZYBORN',
                    html: getWelcomeEmailHTML()
                })
            });

            if (resendResponse.ok) {
                // Update welcome_sent flag
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
            // Don't fail the request if email fails
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
 * Simple welcome email HTML
 * Brand-consistent: Black background, minimal, no-fluff
 */
function getWelcomeEmailHTML() {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to ZYBORN</title>
</head>
<body style="margin: 0; padding: 0; background-color: #000000; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #000000;">
        <tr>
            <td align="center" style="padding: 60px 20px;">
                <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="max-width: 100%;">
                    
                    <!-- Divider -->
                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <div style="width: 60px; height: 1px; background-color: #3A3A3A;"></div>
                        </td>
                    </tr>
                    
                    <!-- Logo -->
                    <tr>
                        <td align="center" style="padding-bottom: 40px;">
                            <span style="font-size: 24px; font-weight: 700; color: #FFFFFF; letter-spacing: 0.15em;">ZYBORN</span>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td align="center" style="padding: 0 30px;">
                            <h1 style="margin: 0 0 24px 0; font-size: 20px; color: #FFFFFF; font-weight: 500; line-height: 1.4;">
                                Thank you for subscribing.
                            </h1>
                            
                            <p style="margin: 0 0 32px 0; font-size: 15px; color: #BDBDBD; line-height: 1.7; font-family: 'IBM Plex Mono', 'Courier New', monospace;">
                                You'll receive updates on WORLD's FIRST CANNED BTC and future ZYBORN projects.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td style="background-color: #F6931B; border-radius: 2px;">
                                        <a href="https://zyborn.com" style="display: inline-block; padding: 14px 28px; color: #000000; text-decoration: none; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em;">
                                            Visit ZYBORN.com
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td align="center" style="padding-top: 50px;">
                            <div style="width: 60px; height: 1px; background-color: #3A3A3A;"></div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top: 30px;">
                            <p style="margin: 0; font-size: 11px; color: #6F6F6F; letter-spacing: 0.05em;">
                                © 2009 ZYBORN ART
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 11px;">
                                <a href="https://zyborn.com" style="color: #6F6F6F; text-decoration: none;">zyborn.com</a>
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
