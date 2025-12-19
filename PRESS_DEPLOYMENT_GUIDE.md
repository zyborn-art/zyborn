# ZYBORN Press Page - Deployment Guide

> **Version**: 1.0  
> **URL**: https://zyborn.com/press  
> **Last Updated**: December 2025

---

## 📦 DELIVERED FILES

```
press/
├── index.html              # Press page HTML
├── press.css               # Press page styles
├── press.js                # Press page JavaScript
└── assets/                 # ← YOU ADD FILES HERE
    ├── press-release-zyborn-2026.pdf
    ├── ZYBORN_Media_Kit.zip
    ├── ZYBORN_Press_Images.zip
    └── ZYBORN_Logo_Package.zip

api/
└── press-inquiry.js        # API endpoint for contact form
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Copy Files to Your Local Repository

1. **Extract the ZIP** to a temporary location

2. **Copy files to** `C:\GitHub\zyborn\`:

```
C:\GitHub\zyborn\
├── public\
│   ├── index.html              ← (existing main page)
│   ├── css\                    ← (existing)
│   ├── js\                     ← (existing)
│   ├── images\                 ← (existing)
│   └── press\                  ← NEW FOLDER
│       ├── index.html          ← Copy here
│       ├── press.css           ← Copy here
│       ├── press.js            ← Copy here
│       └── assets\             ← Create this folder
│           └── (empty for now)
├── api\
│   ├── subscribe.js            ← (existing)
│   └── press-inquiry.js        ← Copy here (NEW)
└── vercel.json                 ← Update with new version
```

---

### Step 2: Upload Press Asset Files

**Location**: `C:\GitHub\zyborn\public\press\assets\`

**Files to add (you need to create these):**

| Filename | Description | How to Create |
|----------|-------------|---------------|
| `press-release-zyborn-2026.pdf` | Official press release | Create in Word/Google Docs, export as PDF |
| `ZYBORN_Media_Kit.zip` | All materials combined | ZIP containing press release + images + logos |
| `ZYBORN_Press_Images.zip` | High-res photos only | ZIP your high-res JPG images (300dpi) |
| `ZYBORN_Logo_Package.zip` | Logo variants | ZIP containing logo files (PNG, SVG, white/black versions) |

**How to create the ZIP files:**

1. **Press Images ZIP**:
   - Create folder: `ZYBORN_Press_Images`
   - Add high-res versions of:
     - `hero_highres.jpg` (3000×2000px)
     - `canned_btc_highres.jpg` (4000×5000px)
     - `canned_btc_detail.jpg`
     - `zyborn_portrait.jpg`
     - `exhibition_mockup.jpg`
   - Right-click folder → "Send to" → "Compressed (zipped) folder"

2. **Logo Package ZIP**:
   - Create folder: `ZYBORN_Logo_Package`
   - Add:
     - `logo_white.png` (for dark backgrounds)
     - `logo_black.png` (for light backgrounds)
     - `logo.svg` (vector)
   - Right-click folder → "Send to" → "Compressed (zipped) folder"

3. **Media Kit ZIP**:
   - Create folder: `ZYBORN_Media_Kit`
   - Add:
     - `press-release-zyborn-2026.pdf`
     - `images/` folder (with all high-res images)
     - `logos/` folder (with all logo files)
     - `ZYBORN_Brand_Guidelines.pdf` (if you have one)
   - Right-click folder → "Send to" → "Compressed (zipped) folder"

---

### Step 3: Create Supabase Table for Press Inquiries

**In Supabase Dashboard** (https://app.supabase.com):

1. Go to your **zyborn-production** project
2. Click **SQL Editor** in left sidebar
3. Paste and run:

```sql
-- Create press_inquiries table
CREATE TABLE IF NOT EXISTS press_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    outlet TEXT NOT NULL,
    inquiry_type TEXT DEFAULT 'other',
    message TEXT NOT NULL,
    source TEXT DEFAULT 'press_page',
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'new',
    notes TEXT,
    responded_at TIMESTAMPTZ
);

-- Enable Row Level Security
ALTER TABLE press_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for inserts (allows API to insert)
CREATE POLICY "Allow public insert" ON press_inquiries
    FOR INSERT
    WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_press_inquiries_submitted ON press_inquiries(submitted_at DESC);
CREATE INDEX idx_press_inquiries_status ON press_inquiries(status);
```

4. Click **Run** (or press Ctrl+Enter)
5. Verify: Go to **Table Editor** → You should see `press_inquiries` table

---

### Step 4: Push to GitHub

1. **Open GitHub Desktop**

2. **You should see the new files listed as changes:**
   - `public/press/index.html`
   - `public/press/press.css`
   - `public/press/press.js`
   - `public/press/assets/` (with your ZIP files)
   - `api/press-inquiry.js`
   - `vercel.json` (modified)

3. **Write commit message:**
   ```
   Add press page with contact form and downloadable assets
   ```

4. **Click "Commit to main"**

5. **Click "Push origin"**

---

### Step 5: Verify Deployment

1. **Check Vercel Dashboard**:
   - Go to https://vercel.com/dashboard
   - Click your **zyborn** project
   - Watch **Deployments** tab for new deployment
   - Wait for status: **Ready** ✓

2. **Test the pages**:
   - Main page: https://zyborn.com
   - Press page: https://zyborn.com/press

3. **Test downloads**:
   - Click each download button
   - Verify files download correctly

4. **Test contact form**:
   - Fill out the form with test data
   - Submit
   - Check your email (press@zyborn.com) for notification
   - Check Supabase → Table Editor → `press_inquiries` for the record

---

## 📁 COMPLETE FILE STRUCTURE (After Deployment)

```
C:\GitHub\zyborn\
├── public\
│   ├── index.html                          # Main landing page
│   ├── css\
│   │   └── styles.css                      # Main styles
│   ├── js\
│   │   └── main.js                         # Main JS
│   ├── images\
│   │   ├── logo.png
│   │   ├── hero.png
│   │   ├── canned_btc.jpg
│   │   └── [partner logos]
│   ├── curatorial\
│   │   └── index.html                      # Curator essay page
│   └── press\                              # NEW
│       ├── index.html                      # Press landing page
│       ├── press.css                       # Press styles
│       ├── press.js                        # Press JS
│       └── assets\                         # Downloadable files
│           ├── press-release-zyborn-2026.pdf
│           ├── ZYBORN_Media_Kit.zip
│           ├── ZYBORN_Press_Images.zip
│           └── ZYBORN_Logo_Package.zip
│
├── api\
│   ├── subscribe.js                        # Email subscription endpoint
│   └── press-inquiry.js                    # Press contact form endpoint (NEW)
│
├── vercel.json                             # Vercel configuration
└── README.md
```

---

## 🔧 TROUBLESHOOTING

### Downloads not working?

1. Check file exists in `/public/press/assets/`
2. Verify filename matches exactly (case-sensitive)
3. Check Vercel deployment logs for errors

### Contact form not submitting?

1. Check browser console (F12) for errors
2. Verify `press_inquiries` table exists in Supabase
3. Check environment variables in Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`

### Not receiving email notifications?

1. Verify Resend domain is still verified
2. Check `press@zyborn.com` email exists and is receiving
3. Check Resend dashboard for delivery logs

### Page shows 404?

1. Verify `vercel.json` has the press rewrite rule
2. Check file is at `/public/press/index.html`
3. Redeploy: Vercel Dashboard → Deployments → Redeploy

---

## 📊 ANALYTICS (Optional)

Add Google Analytics tracking by adding this to `<head>` in `press/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your actual GA4 Measurement ID.

---

## 📝 CHECKLIST

```
[ ] Files copied to C:\GitHub\zyborn\public\press\
[ ] press-release-zyborn-2026.pdf created
[ ] ZYBORN_Media_Kit.zip created
[ ] ZYBORN_Press_Images.zip created  
[ ] ZYBORN_Logo_Package.zip created
[ ] press_inquiries table created in Supabase
[ ] Changes committed and pushed to GitHub
[ ] Vercel deployment successful
[ ] Press page loads at zyborn.com/press
[ ] Download buttons work
[ ] Contact form submits successfully
[ ] Email notification received
```

---

**Questions?** Open a new chat in this Claude project with your issue.
