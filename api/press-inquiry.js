/**
 * ZYBORN ART - Press Inquiry API Endpoint
 * Vercel Serverless Function
 * 
 * Integrates with:
 * - Supabase (database storage)
 * - Resend (email delivery)
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, outlet, inquiry_type, message, source } = req.body;

        // Validate required fields
        if (!name || !email || !outlet || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // Get environment variables
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
        const RESEND_API_KEY = process.env.RESEND_API_KEY;

        // Validate environment variables
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            console.error('Missing Supabase configuration');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Store in Supabase
        const supabaseResponse = await fetch(`${SUPABASE_URL}/rest/v1/press_inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                name: name.trim(),
                email: email.toLowerCase().trim(),
                outlet: outlet.trim(),
                inquiry_type: inquiry_type || 'other',
                message: message.trim(),
                source: source || 'press_page',
                submitted_at: new Date().toISOString(),
                status: 'new'
            })
        });

        if (!supabaseResponse.ok) {
            const errorText = await supabaseResponse.text();
            console.error('Supabase error:', errorText);
            // Continue anyway - we'll still send the email notification
        }

        // Send notification email to press team via Resend
        if (RESEND_API_KEY) {
            try {
                // Notification to press team
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'ZYBORN Press <press@zyborn.com>',
                        to: 'press@zyborn.com',
                        subject: `[Press Inquiry] ${inquiry_type || 'General'} - ${outlet}`,
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head><meta charset="utf-8"></head>
                            <body style="margin: 0; padding: 20px; background-color: #f2f2f2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background: #fff; border: 1px solid #ddd;">
                                    <tr>
                                        <td style="padding: 24px; background: #000; color: #F6931B;">
                                            <h2 style="margin: 0; font-size: 18px;">New Press Inquiry</h2>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 24px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                                        <strong style="color: #666;">Name:</strong><br>
                                                        ${name}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                                        <strong style="color: #666;">Email:</strong><br>
                                                        <a href="mailto:${email}" style="color: #F6931B;">${email}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                                        <strong style="color: #666;">Publication:</strong><br>
                                                        ${outlet}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
                                                        <strong style="color: #666;">Inquiry Type:</strong><br>
                                                        ${inquiry_type || 'General'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0;">
                                                        <strong style="color: #666;">Message:</strong><br>
                                                        <p style="margin: 8px 0 0 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 16px 24px; background: #f9f9f9; font-size: 12px; color: #666;">
                                            Submitted: ${new Date().toISOString()}<br>
                                            Source: ${source || 'press_page'}
                                        </td>
                                    </tr>
                                </table>
                            </body>
                            </html>
                        `
                    })
                });

                // Auto-reply to journalist
                await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`
                    },
                    body: JSON.stringify({
                        from: 'ZYBORN Press <press@zyborn.com>',
                        to: email,
                        subject: 'Thank you for your press inquiry - ZYBORN ART',
                        html: `
                            <!DOCTYPE html>
                            <html>
                            <head><meta charset="utf-8"></head>
                            <body style="margin: 0; padding: 0; background-color: #000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000; padding: 40px 20px;">
                                    <tr>
                                        <td align="center">
                                            <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                                                <tr>
                                                    <td style="padding-bottom: 32px;">
                                                        <img src="https://zyborn.com/images/logo.png" alt="ZYBORN" width="120" style="display: block;">
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="color: #fff; font-size: 16px; line-height: 1.6;">
                                                        <h1 style="color: #F6931B; font-size: 24px; margin: 0 0 24px 0;">
                                                            Thank you for your inquiry
                                                        </h1>
                                                        
                                                        <p style="margin: 0 0 16px 0;">
                                                            Dear ${name},
                                                        </p>
                                                        
                                                        <p style="margin: 0 0 16px 0;">
                                                            Thank you for reaching out regarding <strong>WORLD's FIRST CANNED BTC</strong> by ZYBORN.
                                                        </p>
                                                        
                                                        <p style="margin: 0 0 24px 0;">
                                                            Our press team will review your inquiry and respond within 24 hours.
                                                        </p>
                                                        
                                                        <p style="margin: 0 0 16px 0; color: #BDBDBD;">
                                                            In the meantime, you can download our press materials at:
                                                        </p>
                                                        
                                                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                                                            <tr>
                                                                <td style="background-color: #F6931B; padding: 14px 28px; border-radius: 2px;">
                                                                    <a href="https://zyborn.com/press" style="color: #000; text-decoration: none; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">
                                                                        Download Press Kit
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                        
                                                        <p style="margin: 0; color: #6F6F6F; font-size: 14px;">
                                                            Best regards,<br>
                                                            ZYBORN Press Team
                                                        </p>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-top: 48px; border-top: 1px solid #2A2A2A; margin-top: 48px;">
                                                        <p style="color: #6F6F6F; font-size: 12px; margin: 0;">
                                                            © 2009 ZYBORN ART. All rights reserved.<br>
                                                            <a href="https://zyborn.com" style="color: #6F6F6F;">zyborn.com</a>
                                                        </p>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </body>
                            </html>
                        `
                    })
                });

            } catch (emailError) {
                console.error('Email send error:', emailError);
                // Don't fail the request if email fails
            }
        }

        return res.status(200).json({ 
            message: 'Inquiry submitted successfully!',
            status: 'success'
        });

    } catch (error) {
        console.error('Press inquiry error:', error);
        return res.status(500).json({ error: 'Submission failed. Please try again.' });
    }
}
