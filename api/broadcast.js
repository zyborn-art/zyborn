/**
 * ZYBORN ART - Email Broadcast API Endpoint
 * Vercel Serverless Function
 * 
 * Sends auction launch email to all subscribers
 * Protected by secret key
 * 
 * Usage: POST /api/broadcast with x-broadcast-key header
 */

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-broadcast-key');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verify secret key
    const secretKey = req.headers['x-broadcast-key'];
    if (secretKey !== process.env.BROADCAST_SECRET_KEY) {
        return res.status(401).json({ error: 'Unauthorized - Invalid key' });
    }

    try {
        // 1. Fetch all subscribers from Supabase
        const supabaseResponse = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/email_subscribers?select=email,name`,
            {
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                }
            }
        );

        if (!supabaseResponse.ok) {
            throw new Error('Failed to fetch subscribers');
        }

        const subscribers = await supabaseResponse.json();
        
        if (!subscribers || subscribers.length === 0) {
            return res.status(200).json({ 
                success: true, 
                message: 'No subscribers found',
                sent: 0 
            });
        }

        // 2. Send emails to all subscribers
        const results = [];
        
        for (const subscriber of subscribers) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'ZYBORN ART <hello@zyborn.com>',
                        to: subscriber.email,
                        subject: '🎨 The Auction is NOW LIVE — WORLD\'s FIRST CANNED BTC',
                        html: getAuctionLaunchEmailHTML(subscriber.name)
                    })
                });

                if (emailResponse.ok) {
                    results.push({ email: subscriber.email, status: 'sent' });
                } else {
                    const errorText = await emailResponse.text();
                    results.push({ email: subscriber.email, status: 'failed', error: errorText });
                }
                
                // Rate limiting: small delay between emails
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (emailError) {
                results.push({ 
                    email: subscriber.email, 
                    status: 'failed', 
                    error: emailError.message 
                });
            }
        }

        // 3. Calculate summary
        const sent = results.filter(r => r.status === 'sent').length;
        const failed = results.filter(r => r.status === 'failed').length;

        return res.status(200).json({
            success: true,
            summary: {
                total: subscribers.length,
                sent: sent,
                failed: failed
            },
            details: results
        });

    } catch (error) {
        console.error('Broadcast error:', error);
        return res.status(500).json({ 
            error: 'Broadcast failed', 
            message: error.message 
        });
    }
}

/**
 * Auction Launch Email HTML Template
 * ZYBORN brand compliant
 */
function getAuctionLaunchEmailHTML(name) {
    const greeting = name ? `Dear ${name},` : 'Dear Collector,';
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ZYBORN Auction is LIVE</title>
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
                            <p style="margin: 0 0 20px 0; font-size: 14px; color: #F6931B; text-transform: uppercase; letter-spacing: 0.1em;">
                                🎨 AUCTION NOW LIVE
                            </p>
                            
                            <h1 style="margin: 0 0 30px 0; font-size: 28px; color: #FFFFFF; font-weight: 600; line-height: 1.3;">
                                The moment has arrived.
                            </h1>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                ${greeting}
                            </p>
                            
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                Bidding is now open for <strong style="color: #FFFFFF;">WORLD's FIRST CANNED BTC</strong> — a groundbreaking work of conceptual art by ZYBORN.
                            </p>
                            
                            <!-- Auction Details Box -->
                            <div style="background: #1a1a1a; border: 1px solid #F6931B; border-radius: 2px; padding: 24px; margin: 24px 0;">
                                <table width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="color: #6F6F6F; font-size: 12px; text-transform: uppercase; padding-bottom: 8px;">Starting Estimate</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #F6931B; font-size: 32px; font-weight: 700; padding-bottom: 16px;">$1,000,000 USD</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #6F6F6F; font-size: 12px; text-transform: uppercase; padding-bottom: 4px;">Auction Closes</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #FFFFFF; font-size: 16px;">January 3, 2026 at 23:59 GMT</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #BDBDBD; line-height: 1.6;">
                                <strong style="color: #FFFFFF;">How to bid:</strong>
                            </p>
                            
                            <ol style="margin: 0 0 30px 0; padding-left: 20px; font-size: 16px; color: #BDBDBD; line-height: 1.8;">
                                <li>Register at auction.zyborn.com</li>
                                <li>Complete bidder verification (quick video call)</li>
                                <li>Once approved, place your bid</li>
                            </ol>
                            
                            <!-- CTA Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                                <tr>
                                    <td style="background-color: #F6931B; border-radius: 2px;">
                                        <a href="https://auction.zyborn.com" style="display: inline-block; padding: 18px 48px; color: #000000; text-decoration: none; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 0.08em;">
                                            ENTER AUCTION →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 32px 0 0 0; font-size: 14px; color: #6F6F6F; line-height: 1.6;">
                                Questions? Reply to this email or visit <a href="https://zyborn.com" style="color: #F6931B;">zyborn.com</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Exhibition Reminder -->
                    <tr>
                        <td style="padding: 30px; background: #1a1a1a; border-top: 1px solid #2A2A2A;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #F6931B; text-transform: uppercase; letter-spacing: 0.1em;">
                                LONDON EXHIBITION
                            </p>
                            <p style="margin: 0; font-size: 14px; color: #BDBDBD;">
                                See the artwork in person: January 3, 2026 in Westminster, London
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; border-top: 1px solid #2A2A2A;">
                            <p style="margin: 0; font-size: 12px; color: #6F6F6F; text-align: center;">
                                © 2025 ZYBORN ART. All rights reserved.<br>
                                <a href="https://zyborn.com" style="color: #6F6F6F;">zyborn.com</a> | 
                                <a href="https://auction.zyborn.com" style="color: #6F6F6F;">auction.zyborn.com</a>
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
