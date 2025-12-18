# ZYBORN.COM — Master Architecture & Domain Strategy

> **Last Updated**: December 2025  
> **Version**: 2.0  
> **Status**: Production-Ready

---

## EXECUTIVE SUMMARY

This document defines the complete domain structure, deployment workflow, and technical architecture for the ZYBORN ART web presence.

---

## DOMAIN STRUCTURE RECOMMENDATION

### Decision Matrix

| Property | Option A (Subpath) | Option B (Subdomain) | **Recommendation** |
|----------|-------------------|---------------------|-------------------|
| **Press** | `zyborn.com/press` | `press.zyborn.com` | **`zyborn.com/press`** |
| **Auction** | `zyborn.com/auction` | `auction.zyborn.com` | **`auction.zyborn.com`** |

### Rationale

**PRESS → Subpath (`zyborn.com/press`)**

1. **SEO Authority Consolidation**: Press coverage links back to your main domain, building domain authority in one place
2. **Simpler DNS**: No additional DNS records needed
3. **Content Relationship**: Press kit is content *about* ZYBORN — belongs under the main brand umbrella
4. **Media Expectation**: Journalists expect `/press` or `/media` paths on corporate sites
5. **Single Deployment**: Lives in same Vercel project as main site

**AUCTION → Subdomain (`auction.zyborn.com`)**

1. **Third-Party Integration**: BidJS requires its own deployment context with specific headers/scripts
2. **Isolated Security**: Payment processing and bidding logic should be sandboxed
3. **Independent Scaling**: Auction traffic spikes won't impact main site performance
4. **Future Flexibility**: Can migrate to dedicated auction platform later without URL changes
5. **Legal Separation**: Terms of service and liability can be scoped to auction operations
6. **Brand Psychology**: Subdomain signals "official auction platform" — more authoritative than a subpath

---

## FINAL DOMAIN STRUCTURE

```
zyborn.com (Vercel Project: zyborn-main)
├── /                      → Main landing page
├── /curatorial            → Luba Elliott essay
├── /press                 → Media kit (NEW)
│
auction.zyborn.com (Vercel Project: zyborn-auction)
└── /                      → BidJS auction platform (NEW)
```

---

## TECHNICAL INFRASTRUCTURE

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              ZYBORN.COM ECOSYSTEM                            │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    VERCEL PROJECT: zyborn-main                       │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  zyborn.com                                                  │    │    │
│  │  │  ├── / (index.html)                                         │    │    │
│  │  │  ├── /curatorial (curatorial/index.html)                    │    │    │
│  │  │  ├── /press (press/index.html)                              │    │    │
│  │  │  └── /api/* (Serverless Functions)                          │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                  VERCEL PROJECT: zyborn-auction                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  auction.zyborn.com                                         │    │    │
│  │  │  ├── / (BidJS Integration)                                  │    │    │
│  │  │  ├── /lot/* (Individual lots)                               │    │    │
│  │  │  └── /api/* (Auction-specific endpoints)                    │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  BACKEND SERVICES                                                            │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐          │
│  │    SUPABASE      │  │     RESEND       │  │     GODADDY      │          │
│  │  ├─ PostgreSQL   │  │  ├─ Transactional│  │  ├─ DNS Records  │          │
│  │  ├─ Auth (future)│  │  ├─ Notifications│  │  ├─ Domain Mgmt  │          │
│  │  ├─ RLS Policies │  │  └─ Broadcasts   │  │  └─ SSL Certs    │          │
│  │  └─ Real-time    │  └──────────────────┘  └──────────────────┘          │
│  └──────────────────┘                                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## DNS CONFIGURATION (GoDaddy)

### Required Records for Full Setup

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | `76.76.21.21` | 600 | Root domain → Vercel |
| CNAME | www | `cname.vercel-dns.com` | 600 | www subdomain |
| CNAME | auction | `cname.vercel-dns.com` | 600 | Auction subdomain |
| TXT | @ | `v=spf1 include:_spf.resend.com ~all` | 3600 | Email SPF |
| TXT | resend._domainkey | `[FROM RESEND DASHBOARD]` | 3600 | DKIM |
| MX | @ | `feedback-smtp.eu-west-1.amazonses.com` | 3600 | Bounce handling |

### Vercel Domain Assignment

**Project: zyborn-main**
- `zyborn.com` (primary)
- `www.zyborn.com` (redirect to apex)

**Project: zyborn-auction**
- `auction.zyborn.com` (primary)

---

## GITHUB REPOSITORY STRUCTURE

### Option A: Monorepo (Recommended for Your Scale)

```
zyborn/
├── .github/
│   └── workflows/
│       └── deploy.yml              # Auto-deploy on push
├── apps/
│   ├── main/                       # Main site + Press + Curatorial
│   │   ├── public/
│   │   │   ├── index.html
│   │   │   ├── curatorial/
│   │   │   │   └── index.html
│   │   │   ├── press/
│   │   │   │   └── index.html
│   │   │   ├── css/
│   │   │   ├── js/
│   │   │   └── images/
│   │   └── vercel.json
│   │
│   └── auction/                    # BidJS auction site
│       ├── public/
│       │   └── index.html
│       └── vercel.json
│
├── docs/                           # All SPEC files
│   ├── ARCHITECTURE.md
│   ├── ZYBORN_LANDING_PAGE_SPEC.md
│   ├── ZYBORN_CURATORIAL_SUBPAGE_SPEC.md
│   ├── ZYBORN_PRESS_SUBPAGE_SPEC.md
│   └── ZYBORN_AUCTION_SPEC.md
│
├── shared/                         # Shared assets
│   ├── brand-kit/
│   └── images/
│
└── README.md
```

### Option B: Separate Repos (If Teams Diverge Later)

- `zyborn/zyborn-main` → Main site
- `zyborn/zyborn-auction` → Auction platform

---

## VERCEL PROJECT CONFIGURATION

### Project: zyborn-main

**vercel.json**
```json
{
  "rewrites": [
    { "source": "/curatorial", "destination": "/curatorial/index.html" },
    { "source": "/curatorial/", "destination": "/curatorial/index.html" },
    { "source": "/press", "destination": "/press/index.html" },
    { "source": "/press/", "destination": "/press/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Project: zyborn-auction

**vercel.json**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Content-Security-Policy", "value": "frame-ancestors 'self' https://bidjs.com" }
      ]
    }
  ]
}
```

---

## FILE STRUCTURE FOR DEPLOYMENT

```
zyborn-main/                        # Vercel Project Root
├── public/
│   ├── index.html                  # Main landing page
│   │
│   ├── curatorial/
│   │   └── index.html              # Curator essay page
│   │
│   ├── press/
│   │   ├── index.html              # Press landing page
│   │   └── assets/
│   │       ├── ZYBORN_Media_Kit.pdf
│   │       ├── press_hero.jpg
│   │       └── logo_variants/
│   │
│   ├── css/
│   │   └── styles.css              # Shared styles (optional)
│   │
│   ├── js/
│   │   └── main.js                 # Shared JS (optional)
│   │
│   └── images/
│       ├── logo.png
│       ├── hero.png
│       ├── canned_btc.jpg
│       └── [partner logos]
│
├── api/                            # Serverless Functions
│   ├── subscribe.js                # Email capture endpoint
│   ├── analytics.js                # Page view tracking
│   └── rsvp.js                     # Exhibition RSVP
│
├── vercel.json
└── package.json                    # If using any build tools
```

---

## NEXT STEPS

1. **Press Page**: Create ZYBORN_PRESS_SUBPAGE_SPEC.md and HTML
2. **Auction Setup**: Integrate BidJS, create ZYBORN_AUCTION_SPEC.md
3. **DNS**: Add `auction` CNAME record in GoDaddy
4. **GitHub**: Set up monorepo or separate repos based on preference
5. **CI/CD**: Configure auto-deploy workflow

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2025 | ZYBORN | Initial architecture |
| 2.0 | Dec 2025 | ZYBORN | Added Press + Auction specs |
