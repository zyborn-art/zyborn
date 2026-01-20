# ZYBORN ART - Main Website

> **WORLD's FIRST CANNED BTC** - Landing Page, CMS & Email Capture System

## 🏗️ Architecture

```
zyborn/
├── content/                     # CMS-managed content (Eleventy source)
│   ├── pages/
│   │   ├── home.md             # Home page sections
│   │   ├── curatorial.md       # Curatorial essay
│   │   └── press.md            # Press page
│   ├── custom-pages/           # Partner-created pages
│   └── settings/
│       ├── global.json         # Site-wide settings
│       └── navigation.json     # Header menu items
│
├── src/                         # Eleventy templates
│   ├── index.njk               # Home page template
│   ├── curatorial.njk          # Curatorial template
│   ├── press.njk               # Press template
│   ├── pages.njk               # Custom pages template
│   └── _includes/
│       ├── base.njk            # Base HTML layout
│       ├── nav.njk             # Navigation
│       ├── footer.njk          # Footer
│       └── sections/           # Section templates
│           ├── hero.njk
│           ├── curator.njk
│           ├── artwork.njk
│           ├── auction.njk
│           └── [26 section types]
│
├── public/                      # Static assets
│   ├── admin/
│   │   ├── index.html          # Decap CMS admin
│   │   └── config.yml          # CMS configuration
│   ├── css/
│   │   ├── styles.css          # Main stylesheet
│   │   └── sections.css        # Section-specific styles
│   ├── js/
│   │   ├── main.js             # Client-side JavaScript
│   │   └── sections.js         # Section interactions
│   └── images/                 # All image assets
│
├── api/                         # Vercel Serverless Functions
│   ├── subscribe.js            # Email subscription endpoint
│   └── auth.js                 # CMS authentication
│
├── _archive/                    # Archived legacy files
│   ├── content.json.archived   # Old Quick Edit data
│   └── content-loader.js.archived
│
├── .eleventy.js                 # Eleventy configuration
├── vercel.json                  # Vercel configuration
└── README.md                    # This file
```

## 📄 Content Management

All site content is managed through the Decap CMS admin panel at `/admin`.

### Content Structure

| Page | CMS Location | File |
|------|--------------|------|
| Home | Pages → 🏠 Home Page | `content/pages/home.md` |
| Curatorial | Pages → 📖 Curatorial Essay | `content/pages/curatorial.md` |
| Press | Pages → 📰 Press Page | `content/pages/press.md` |
| Custom Pages | ➕ Custom Pages | `content/custom-pages/*.md` |
| Navigation | 🧭 Navigation | `content/settings/navigation.json` |
| Site Settings | ⚙️ Site Settings | `content/settings/global.json` |

### How It Works

1. Content is edited in the CMS at `zyborn.com/admin`
2. Changes are saved to markdown/JSON files in the `content/` directory
3. Eleventy builds static HTML from these files
4. Vercel deploys the built site automatically

### Available Section Types (26)

| Category | Sections |
|----------|----------|
| **Hero & CTA** | Hero, CTA Button, Email Capture |
| **Content** | Text Block, Two Column, Image + Text |
| **Media** | Gallery, Video |
| **Data Display** | Stats, Timeline, Accordion/FAQ |
| **Special** | Curator, Artwork, Auction, Charity, Thanks |
| **Layout** | Spacer, Divider |
| **Advanced** | Team, Logo Grid, Map, Countdown, Feature Grid, Downloads, Quote, Custom HTML |

### Legacy Systems (Removed)

The following legacy systems have been removed in Run 3 cleanup:
- ~~Quick Edit (content.json)~~ → Replaced by Eleventy sections
- ~~content-loader.js~~ → No longer needed

Archived files are in `_archive/` for reference.

## 🛠️ Tech Stack

| Service | Purpose |
|---------|---------|
| **Eleventy** | Static site generator |
| **Decap CMS** | Content management (Git-based) |
| **Vercel** | Hosting, Edge Functions, CDN |
| **Supabase** | PostgreSQL database, Row Level Security |
| **Resend** | Transactional email delivery |
| **GitHub** | Version control, CI/CD trigger, CMS backend |

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
2. Vercel automatically builds with Eleventy
3. Site deploys to production

### Manual

```bash
# Install dependencies
npm install

# Build locally
npm run build

# Deploy with Vercel CLI
vercel --prod
```

## 📁 Local Development

```bash
# Install dependencies
npm install

# Start Eleventy dev server
npm run dev

# Or with Vercel CLI (includes API functions)
vercel dev
```

## 🔗 URLs

| Environment | URL |
|-------------|-----|
| Production | https://zyborn.com |
| CMS Admin | https://zyborn.com/admin |
| Curatorial | https://zyborn.com/curatorial |
| Press | https://zyborn.com/press |
| Auction | https://auction.zyborn.com |

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 4.0 | Jan 2026 | Run 3: Removed Quick Edit redundancy, single source of truth |
| 3.5 | Jan 2026 | Run 2: Added 26 section types for custom pages |
| 3.2 | Jan 2026 | Run 1: Custom pages, navigation CMS control |
| 3.0 | Dec 2025 | Eleventy + Decap CMS integration |
| 2.0 | Dec 2025 | Single-file version with modals |
| 1.0 | Dec 2025 | Initial landing page |

---

**ZYBORN ART** | [zyborn.com](https://zyborn.com) | [@ZYBORN_ART](https://x.com/ZYBORN_ART)
