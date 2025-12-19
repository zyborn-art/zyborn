# ZYBORN ART - Main Website

> **WORLD's FIRST CANNED BTC** - Landing Page & Email Capture System

## 🏗️ Architecture

```
zyborn-main/
├── public/                      # Static assets (Vercel root)
│   ├── index.html              # Main landing page
│   ├── css/
│   │   └── styles.css          # Main stylesheet
│   ├── js/
│   │   └── main.js             # Client-side JavaScript
│   ├── images/                 # All image assets
│   │   ├── logo.png
│   │   ├── hero.png
│   │   ├── canned_btc.jpg
│   │   └── [partner logos]
│   └── curatorial/             # Curator subpage (add later)
│       └── index.html
│
├── api/                         # Vercel Serverless Functions
│   └── subscribe.js            # Email subscription endpoint
│
├── vercel.json                  # Vercel configuration
└── README.md                    # This file
```

## 🛠️ Tech Stack

| Service | Purpose |
|---------|---------|
| **Vercel** | Hosting, Edge Functions, CDN |
| **Supabase** | PostgreSQL database, Row Level Security |
| **Resend** | Transactional email delivery |
| **GitHub** | Version control, CI/CD trigger |

## 📡 API Endpoints

### POST `/api/subscribe`

Subscribe to email updates.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "collector",
  "interests": ["bidding", "exhibition"],
  "source": "hero_form"
}
```

**Response:**
```json
{
  "message": "Successfully subscribed!",
  "status": "success"
}
```

## 🔧 Environment Variables

Set these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `RESEND_API_KEY` | Resend API key |

## 🚀 Deployment

### Automatic (Recommended)

1. Push changes to `main` branch
2. Vercel automatically deploys

### Manual

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 📁 Local Development

```bash
# Serve locally (simple)
npx serve public

# Or with Vercel CLI (includes API functions)
vercel dev
```

## 📂 File Locations

Copy this folder structure to your local GitHub repository:

```
C:\GitHub\zyborn\
├── public\
│   ├── index.html
│   ├── css\
│   │   └── styles.css
│   ├── js\
│   │   └── main.js
│   └── images\
│       └── [all images]
├── api\
│   └── subscribe.js
├── vercel.json
└── README.md
```

## 🔗 URLs

| Environment | URL |
|-------------|-----|
| Production | https://zyborn.com |
| Curatorial | https://zyborn.com/curatorial |
| Press (future) | https://zyborn.com/press |
| Auction (future) | https://auction.zyborn.com |

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | Dec 2025 | Separate HTML/CSS/JS files, API integration |
| 2.0 | Dec 2025 | Single-file version with modals |
| 1.0 | Dec 2025 | Initial landing page |

---

**ZYBORN ART** | [zyborn.com](https://zyborn.com) | [@ZYBORN_ART](https://x.com/ZYBORN_ART)
