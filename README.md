# ZYBORN Web Platform

> Multi-site web presence for ZYBORN ART and the WORLD's FIRST CANNED BTC auction.

---

## 🌐 Live Sites

| Site | URL | Description |
|------|-----|-------------|
| Main | [zyborn.com](https://zyborn.com) | Landing page & email capture |
| Curatorial | [zyborn.com/curatorial](https://zyborn.com/curatorial) | Luba Elliott's essay |
| Press | [zyborn.com/press](https://zyborn.com/press) | Media kit & press resources |
| Auction | [auction.zyborn.com](https://auction.zyborn.com) | BidJS auction platform |

---

## 📁 Repository Structure

```
zyborn/
├── apps/
│   ├── main/                    # zyborn.com (main + curatorial + press)
│   │   ├── public/
│   │   │   ├── index.html       # Main landing page
│   │   │   ├── curatorial/      # Curator essay subpage
│   │   │   ├── press/           # Media kit subpage
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   └── images/
│   │   └── vercel.json
│   │
│   └── auction/                 # auction.zyborn.com
│       ├── public/
│       │   ├── index.html
│       │   └── [auction assets]
│       └── vercel.json
│
├── docs/                        # Technical specifications
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT_WORKFLOW.md
│   ├── ZYBORN_LANDING_PAGE_SPEC.md
│   ├── ZYBORN_CURATORIAL_SUBPAGE_SPEC.md
│   ├── ZYBORN_PRESS_SUBPAGE_SPEC.md
│   └── ZYBORN_AUCTION_SPEC.md
│
├── shared/                      # Shared resources
│   ├── brand-kit/
│   │   └── ZYBORN_BRAND_KIT_v1.0.md
│   └── images/
│
└── README.md                    # This file
```

---

## 🚀 Deployment

### Main Site (zyborn.com)

**Vercel Project**: `zyborn-main`

```bash
cd apps/main
vercel --prod
```

**Domains**:
- `zyborn.com` (primary)
- `www.zyborn.com` (redirect to apex)

### Auction Site (auction.zyborn.com)

**Vercel Project**: `zyborn-auction`

```bash
cd apps/auction
vercel --prod
```

**Domain**:
- `auction.zyborn.com`

---

## 📝 Making Changes

See [DEVELOPMENT_WORKFLOW.md](docs/DEVELOPMENT_WORKFLOW.md) for the complete process.

**Quick Summary**:

1. Edit the relevant SPEC file in `/docs/`
2. Generate updated HTML via Claude
3. Push to GitHub
4. Vercel auto-deploys (< 60 seconds)

---

## 📋 SPEC Files

| Page | SPEC File |
|------|-----------|
| Main Landing | `ZYBORN_LANDING_PAGE_SPEC.md` |
| Curatorial | `ZYBORN_CURATORIAL_SUBPAGE_SPEC.md` |
| Press Kit | `ZYBORN_PRESS_SUBPAGE_SPEC.md` |
| Auction | `ZYBORN_AUCTION_SPEC.md` |

---

## 🎨 Brand Guidelines

All sites follow **ZYBORN Brand Kit v1.0**:

- **Colors**: Black-first with Bitcoin Orange (#F6931B)
- **Fonts**: Space Grotesk + IBM Plex Mono
- **Style**: Industrial, precise, non-decorative

---

## 🔧 Tech Stack

| Component | Technology |
|-----------|------------|
| Hosting | Vercel |
| DNS | GoDaddy |
| Database | Supabase |
| Email | Resend |
| Auction | BidJS |

---

## 📅 Key Dates

| Event | Date |
|-------|------|
| Auction Opens | 24 December 2025 |
| Auction Closes | 3 January 2026 |
| London Exhibition | 3 January 2026 |

---

## 📧 Contact

- **General**: hello@zyborn.com
- **Press**: press@zyborn.com
- **Auction**: auction@zyborn.com

---

© 2009 ZYBORN ART. All rights reserved.
