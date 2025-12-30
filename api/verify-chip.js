/**
 * ZYBORN ART - NFC Chip Verification API
 * Vercel Serverless Function
 * 
 * Endpoint: /api/verify-chip?uid=<chip_uid>
 * Accessed via: https://zyborn.com/t/<uid>
 * 
 * Core functionality only - no analytics, no ownership display
 */

export default async function handler(req, res) {
    const { uid } = req.query;

    // Validate UID format (14 hex characters for NTAG216)
    if (!uid || !/^[0-9A-Fa-f]{14}$/.test(uid)) {
        return res.status(400).send(getErrorHTML('Invalid chip identifier'));
    }

    const cleanUid = uid.toUpperCase();

    try {
        // Query Supabase for chip
        const response = await fetch(
            `${process.env.SUPABASE_URL}/rest/v1/nfc_chips?uid=eq.${cleanUid}&select=*`,
            {
                method: 'GET',
                headers: {
                    'apikey': process.env.SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Database error');
        }

        const chips = await response.json();

        if (chips.length === 0) {
            // Chip not registered
            return res.status(404).send(getUnregisteredHTML(cleanUid));
        }

        const chip = chips[0];

        if (!chip.is_active) {
            return res.status(403).send(getErrorHTML('This artwork has been deactivated'));
        }

        // Return authenticated HTML
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        return res.status(200).send(getAuthenticatedHTML(chip));

    } catch (error) {
        console.error('Verify chip error:', error);
        return res.status(500).send(getErrorHTML('Verification service temporarily unavailable'));
    }
}

/**
 * Authenticated artwork HTML - ZYBORN brand styling
 */
function getAuthenticatedHTML(chip) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authenticated | ZYBORN</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-black: #000000;
            --color-white: #FFFFFF;
            --color-orange: #F6931B;
            --color-steel-100: #F2F2F2;
            --color-steel-300: #BDBDBD;
            --color-steel-600: #6F6F6F;
            --color-steel-900: #2A2A2A;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: var(--color-black);
            color: var(--color-white);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
        }
        
        .container {
            max-width: 480px;
            width: 100%;
            text-align: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-orange);
            letter-spacing: 0.1em;
            margin-bottom: 48px;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(34, 197, 94, 0.15);
            border: 1px solid #22c55e;
            color: #22c55e;
            padding: 12px 24px;
            border-radius: 2px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 32px;
        }
        
        .status-badge svg {
            width: 20px;
            height: 20px;
        }
        
        .artwork-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
            line-height: 1.2;
        }
        
        .artist {
            font-size: 16px;
            color: var(--color-steel-300);
            margin-bottom: 24px;
        }
        
        .artwork-image {
            width: 100%;
            max-width: 400px;
            border-radius: 4px;
            margin-bottom: 24px;
            border: 1px solid var(--color-steel-600);
        }
        
        .artwork-tagline {
            font-size: 20px;
            font-weight: 600;
            color: var(--color-orange);
            margin-bottom: 32px;
            letter-spacing: 0.02em;
        }
        
        .details {
            background: var(--color-steel-900);
            border: 1px solid var(--color-steel-600);
            border-radius: 2px;
            padding: 24px;
            text-align: left;
            margin-bottom: 24px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--color-steel-600);
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 12px;
            color: var(--color-steel-300);
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .detail-value {
            font-size: 14px;
            color: var(--color-white);
            font-weight: 500;
        }
        
        .certificate {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11px;
            color: var(--color-steel-600);
            margin-bottom: 24px;
            word-break: break-all;
        }
        
        .btn-curatorial {
            display: inline-block;
            background: var(--color-orange);
            color: var(--color-black);
            text-decoration: none;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            padding: 14px 28px;
            border-radius: 2px;
            margin-bottom: 24px;
            transition: filter 0.2s;
        }
        
        .btn-curatorial:hover {
            filter: brightness(1.1);
        }
        
        .back-link {
            display: inline-block;
            color: var(--color-steel-300);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .back-link:hover {
            color: var(--color-orange);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">ZYBORN</div>
        
        <div class="status-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            AUTHENTICATED
        </div>
        
        <h1 class="artwork-title">${escapeHtml(chip.artwork_title)}</h1>
        <p class="artist">by ZYBORN</p>
        
        <img src="/images/hero.png" alt="Survival Rations by ZYBORN - Bitcoin can artwork in gallery display case" class="artwork-image">
        
        <h2 class="artwork-tagline">WORLD's FIRST CANNED BTC</h2>
        
        <div class="details">
            <div class="detail-row">
                <span class="detail-label">Edition</span>
                <span class="detail-value">${chip.edition_number} / 21</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Medium</span>
                <span class="detail-value">Metal, Cold Wallet, NFC</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Dimensions</span>
                <span class="detail-value">10.8 × 7.5 cm</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Year</span>
                <span class="detail-value">2025</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Registered</span>
                <span class="detail-value">${formatDate(chip.registered_at)}</span>
            </div>
        </div>
        
        <p class="certificate">UID: ${chip.uid}</p>
        
        <a href="https://www.zyborn.com/curatorial" class="btn-curatorial">Curatorial Recommendation</a>
        
        <br>
        
        <a href="https://zyborn.com" class="back-link">← zyborn.com</a>
    </div>
</body>
</html>`;
}

/**
 * Unregistered chip HTML
 */
function getUnregisteredHTML(uid) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Not Registered | ZYBORN</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-black: #000000;
            --color-white: #FFFFFF;
            --color-orange: #F6931B;
            --color-steel-300: #BDBDBD;
            --color-steel-600: #6F6F6F;
        }
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: var(--color-black);
            color: var(--color-white);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--color-orange);
            letter-spacing: 0.1em;
            margin-bottom: 48px;
        }
        
        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid #ef4444;
            color: #ef4444;
            padding: 12px 24px;
            border-radius: 2px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 32px;
        }
        
        h1 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 16px;
        }
        
        p {
            color: var(--color-steel-300);
            font-size: 16px;
            max-width: 320px;
            line-height: 1.6;
            margin-bottom: 32px;
        }
        
        .uid {
            font-family: 'IBM Plex Mono', monospace;
            font-size: 11px;
            color: var(--color-steel-600);
            margin-bottom: 32px;
        }
        
        .back-link {
            color: var(--color-orange);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="logo">ZYBORN</div>
    
    <div class="status-badge">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        NOT REGISTERED
    </div>
    
    <h1>Chip Not Found</h1>
    <p>This NFC chip is not registered in the ZYBORN authentication system.</p>
    <p class="uid">UID: ${escapeHtml(uid)}</p>
    
    <a href="https://zyborn.com" class="back-link">← zyborn.com</a>
</body>
</html>`;
}

/**
 * Error HTML
 */
function getErrorHTML(message) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error | ZYBORN</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Space Grotesk', sans-serif;
            background: #000;
            color: #fff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
        }
        .logo { font-size: 24px; font-weight: 700; color: #F6931B; letter-spacing: 0.1em; margin-bottom: 48px; }
        h1 { font-size: 24px; margin-bottom: 16px; }
        p { color: #BDBDBD; font-size: 16px; margin-bottom: 32px; }
        a { color: #F6931B; text-decoration: none; font-size: 14px; }
    </style>
</head>
<body>
    <div class="logo">ZYBORN</div>
    <h1>Error</h1>
    <p>${escapeHtml(message)}</p>
    <a href="https://zyborn.com">← zyborn.com</a>
</body>
</html>`;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
