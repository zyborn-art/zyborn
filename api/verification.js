// api/verification.js
// Stores bidder verification submissions in Supabase
// Deploy to: C:\GitHub\zyborn\api\verification.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { fullName, birthDate, nationality, email, phone, submittedAt, source, status } = req.body;

        // Validate required fields
        if (!fullName || !birthDate || !nationality || !email || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Initialize Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Insert verification request
        const { data, error } = await supabase
            .from('bidder_verifications')
            .insert([
                {
                    full_name: fullName,
                    birth_date: birthDate,
                    nationality: nationality,
                    email: email.toLowerCase(),
                    phone: phone,
                    submitted_at: submittedAt || new Date().toISOString(),
                    source: source || 'bidder-verification',
                    status: status || 'pending_call',
                    call_booked: false,
                    verified: false
                }
            ])
            .select();

        if (error) {
            // Check for duplicate email
            if (error.code === '23505') {
                return res.status(409).json({ 
                    error: 'This email has already submitted a verification request.',
                    code: 'DUPLICATE_EMAIL'
                });
            }
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Database error' });
        }

        // Optional: Send notification email to admin
        // You can add Resend integration here if needed

        return res.status(200).json({ 
            success: true, 
            message: 'Verification request submitted',
            id: data[0]?.id 
        });

    } catch (error) {
        console.error('Verification API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
