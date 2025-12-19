# ZYBORN ART Curatorial Subpage — Complete Technical Specification

> **URL**: `https://zyborn.com/curatorial`
> **Purpose**: Full curatorial recommendation article by Luba Elliott
> **Navigation Source**: Main landing page SECTION 4: CURATOR → CTA "READ MORE"
> **Design Style**: Editorial blog post / magazine article format
> **Version**: 1.1

---

## DESIGN SYSTEM TOKENS (Inherited from Main Landing Page)

### Color Palette (CSS Variables)

```css
:root {
  /* Core */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-orange: #F6931B;          /* Bitcoin Orange - CTAs, emphasis */
  
  /* Steel Grays */
  --color-steel-100: #F2F2F2;       /* Light backgrounds */
  --color-steel-300: #BDBDBD;       /* Secondary text */
  --color-steel-600: #6F6F6F;       /* Dividers, metadata */
  --color-steel-900: #2A2A2A;       /* Dark sections */
  
  /* Spacing */
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

### Typography (Inherited)

**Fonts (Google Fonts)**:
- Primary: `Space Grotesk` (400, 500, 600, 700)
- Secondary: `IBM Plex Mono` (400, 500)

```css
/* Type Scale */
--h1: clamp(40px, 8vw, 72px);       /* Space Grotesk Bold */
--h2: clamp(28px, 5vw, 48px);       /* Space Grotesk Semibold */
--h3: 24px;                          /* Space Grotesk Medium */
--body: 18px;                        /* Space Grotesk Regular (article optimized) */
--body-large: 22px;                  /* Space Grotesk Regular (lead paragraph) */
--meta: 14px;                        /* IBM Plex Mono Regular */
```

---

## PAGE STRUCTURE OVERVIEW

```
┌────────────────────────────────────────────────────────────────────────┐
│  NAVIGATION (Fixed - Same as Main Page)                                │
├────────────────────────────────────────────────────────────────────────┤
│  ARTICLE HEADER                                                        │
│  - Breadcrumb                                                          │
│  - Article Title: "The Can as Currency"                                │
│  - Byline: Luba Elliott                                                │
│  - Meta: Reading time, date                                            │
├────────────────────────────────────────────────────────────────────────┤
│  ARTICLE BODY                                                          │
│  - Lead paragraph                                                      │
│  - Artwork image (HEAD.png)                                            │
│  - Full curatorial text (4 more paragraphs)                            │
│  - Pull quote highlight                                                │
├────────────────────────────────────────────────────────────────────────┤
│  CURATOR PROFILE                                                       │
│  - Name: Luba Elliott                                                  │
│  - Title: AI curator, researcher and consultant                        │
│  - Links: Website, LinkedIn                                            │
├────────────────────────────────────────────────────────────────────────┤
│  BACK TO ARTWORK CTA                                                   │
├────────────────────────────────────────────────────────────────────────┤
│  FOOTER (Same as Main Page)                                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 1: NAVIGATION (Fixed — Identical to Main Page)

**ID**: `#nav`

### Layout
- **Desktop**: Height 80px, logo left, nav center-right, CTA far right
- **Tablet**: Height 72px, logo left, hamburger right
- **Mobile**: Height 64px, hamburger menu, full-screen overlay

### Behavior
- Position: fixed top
- Background: transparent → black on scroll (with blur)
- Z-index: 1000

### Menu Items
1. Artwork (links to `/#artwork`)
2. Curator (links to `/curatorial` — current page, highlighted)
3. Exhibition (links to `/#exhibition`)
4. Auction (links to `/#auction`)
5. Mission (links to `/#mission`)
6. Charity (links to `/#charity`)

### CTA Button
- Text: `NOTIFY ME`
- Style: `.btn-primary`
- Link: `/#hero` (scroll to hero email capture)

### Logo
- File: `logo.png`
- Link: `/` (home)

---

## SECTION 2: ARTICLE HEADER

**ID**: `#article-header`

### Layout
- Background: `var(--color-black)`
- Full width, content constrained to max-width 800px
- Padding: 120px top (accounts for fixed nav), 64px bottom
- Text: `var(--color-white)`

### Breadcrumb (Meta style, steel-300)
```
← Back to Artwork
```
- Link: `/` (home page)
- Hover: `var(--color-orange)`

### Article Label (Meta, uppercase, orange)
```
CURATORIAL RECOMMENDATION
```

### Article Title (H1)
```
The Can as Currency
```

### Byline (Body style)
```
By Luba Elliott
```

### Meta Row (Meta style, steel-300)
- Reading time: `5 min read`
- Separator: `•`
- Date: `December 2025`

---

## SECTION 3: ARTICLE BODY

**ID**: `#article-body`

### Layout
- Background: `var(--color-white)`
- Content max-width: 720px (optimal reading width)
- Padding: 80px vertical
- Text: `var(--color-black)`
- Line-height: 1.7 (for readability)

### Paragraph 1 (Lead — larger font)
```
Zyborn's debut project FIRST CANNED BTC presents a physical embodiment of a fundamentally digital currency, transforming a mass-market household object into something both valuable and enigmatic. As global war narratives intensify, the can emerges as a symbol of durable, reliable, and psychologically reassuring food within an increasingly militarised, bloc-divided world. At once commodity and riddle, the can inspires a simple but charged question: what is inside? Bitcoin worth the equivalent of one million US dollars across a limited edition of 21 units. The amount contained within each can is variable, determined by AI rather than human decision-making, removing predictability and authorship from the act of valuation.
```

**Styling Notes**:
- `FIRST CANNED BTC` should be italicized
- Font size: `var(--body-large)` (22px)

### Artwork Image (After Lead Paragraph)

- File: `HEAD.png`
- Path: `/curatorial/images/HEAD.png`
- Alt: "Survival Rations by ZYBORN"
- Full width within content column
- Caption (Meta style): "Survival Rations - Edition 1/21"
- Margin: 48px 0

### Paragraph 2
```
For me, this project marks a welcome return to the physical realm, encapsulating capitalism itself as a variable canned good. The can is conventionally associated with sameness: every unit identical, interchangeable, mass-produced. Here, that logic is quietly subverted. Each can looks the same, yet contains a different amount of Bitcoin. This gesture foregrounds a unique affordance of digital currency: weightlessness. Whether a can holds 0.01 or 1 BTC, it weighs exactly the same. With a physical currency, this would be impossible, as coins and banknotes betray value through mass. Instead, Zyborn's work masterfully stages a tension between weight and worth, visibility and value, using the immateriality of Bitcoin as its conceptual engine.
```

### Pull Quote (Between Paragraph 2 and 3)
```
"Each can looks the same, yet contains a different amount of Bitcoin."
```
**Styling**:
- Large text: 32px
- Color: `var(--color-orange)`
- Left border: 4px solid `var(--color-orange)`
- Padding-left: 32px
- Margin: 48px 0

### Paragraph 3
```
In this sense, FIRST CANNED BTC responds to a broader generational desire for tangible, real experiences amid digital saturation. At a time of screen fatigue and dematerialised trust systems, Zyborn proposes not a nostalgic return to the past, but a physical form appropriate to a digital currency, one that wasn't shaped by millennia of monetary history. The cans recall Andy Warhol's fascination with consumer packaging, mass production, and advertising. Yet while Warhol captured a new era of post-war consumer abundance in the 1960s, Zyborn addresses a contemporary urge to convert the digital back into the physical, while retaining the excitement of uncertainty and abstraction.
```

**Styling Notes**:
- `FIRST CANNED BTC` should be italicized

### Paragraph 4
```
The metal can itself becomes a manifesto for new money: a sculptural object that could plausibly have existed in 2009. In an ironic reversal, the material of traditional money becomes the casing for a dematerialised currency. Meanwhile, the label adopts the language of canned food packaging: a simple orange palette, factual typography, consumption-ready aesthetics. Complexity is translated into the visual grammar of the everyday. The slogan further anchors the work in advertising history, positioning Bitcoin unambiguously as a product, while also acknowledging its energy consumption — a gesture that signals the project's future-facing concerns, and the artist's latent potential,where efficiency and sustainability increasingly enhance value.
```

### Paragraph 5
```
Opening the can implicates the owner in a performance: an irreversible action in which the contents are finally revealed — a wallet, user manual, and an unknown amount of Bitcoin. Like a transaction itself, the act cannot be undone. Through materiality, concealment, and ritual, Zyborn's art skillfully probes how value is produced, communicated and distributed.
```

---

## SECTION 4: CURATOR PROFILE

**ID**: `#curator-profile`

### Layout
- Background: `var(--color-steel-100)`
- Content max-width: 720px
- Padding: 64px vertical
- Card style with subtle border

### Profile Card

**Structure**:
```
┌────────────────────────────────────────────────────────────────┐
│  ABOUT THE CURATOR                                             │
│                                                                │
│  Luba Elliott                                                  │
│  AI curator, researcher and consultant                         │
│                                                                │
│  ────────────────────────────────────────────                  │
│                                                                │
│  🌐 www.elluba.com                                             │
│  in linkedin.com/in/lubaelliott                                │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Content Details

**Label** (Meta, uppercase, steel-600):
```
ABOUT THE CURATOR
```

**Name** (H3):
```
Luba Elliott
```

**Title** (Body, steel-600):
```
AI curator, researcher and consultant
```

**Divider**: 1px solid `var(--color-steel-300)`

**Links** (arranged horizontally on desktop, vertically on mobile):

| Icon | Label | Link |
|------|-------|------|
| 🌐 | www.elluba.com | http://www.elluba.com/ |
| in | linkedin.com/in/lubaelliott | https://www.linkedin.com/in/lubaelliott/ |

**Link Styling**:
- Font: IBM Plex Mono
- Color: `var(--color-black)`
- Hover: `var(--color-orange)`

---

## SECTION 5: BACK TO ARTWORK CTA

**ID**: `#back-cta`

### Layout
- Background: `var(--color-black)`
- Centered content
- Padding: 80px vertical

### Content

**Title** (H2, white):
```
Experience the Artwork
```

**Subtitle** (Body, steel-300):
```
View full specifications, auction details, and exhibition information.
```

### CTA Button
- Text: `VIEW ARTWORK →`
- Style: `.btn-primary`
- Link: `/` (home page)

---

## SECTION 6: FOOTER (Identical to Main Page)

**ID**: `#footer`

### Layout
- Background: `var(--color-black)`
- Text: `var(--color-white)`
- Padding: 80px top, 40px bottom

### Newsletter Section

**Title** (H3):
```
Still interested, but not ready to bid?
```

**Subtitle** (Body):
```
Join the ZYBORN list for future projects and exhibitions.
```

**Form**: Inline email input + submit button
- Input placeholder: "Enter your email"
- Button text: `SUBSCRIBE`
- Button style: `.btn-primary`
- Form action: `/api/subscribe` (Supabase + Resend integration)

### Divider
- 1px solid `var(--color-steel-600)`
- Margin: 48px vertical

### Footer Links (3 columns)

**Column 1: ZYBORN ART**
- About
- Future charity

**Column 2: Visit**
- Exhibition details
- Map & directions

**Column 3: Connect**
- Instagram (https://www.instagram.com/zyborn.art/)
- X (https://x.com/ZYBORN_ART)

### Bottom Bar

**Copyright** (Meta, steel-300):
```
© 2009 ZYBORN ART. All rights reserved.
```

**Legal Links** (Meta, steel-300):
```
Privacy • Terms • Cookie settings
```

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Article Width | Container Padding |
|------------|-------|---------------|-------------------|
| Mobile | 0–767px | 100% | 20px |
| Tablet | 768–1023px | 100% | 40px |
| Desktop | 1024px+ | 720px max | 80px |
| Wide | 1440px+ | 720px max | centered |

---

## ANIMATION GUIDELINES

**Allowed Effects Only** (per brand kit):
- Fade: opacity 0 → 1
- Translate: max ≤8px
- Duration: 300–400ms
- Easing: ease-out

**Page Load Sequence**:
1. Navigation fades in
2. Article header reveals (label → title → byline)
3. Article body paragraphs fade in on scroll

**Interactive States**:
- Links: underline on hover, color change to orange
- Buttons: scale 1.02 on hover, 0.98 on active
- Back link: arrow animation on hover

---

## SEO & STRUCTURED DATA

**Page Title**:
```
The Can as Currency — Curatorial Recommendation by Luba Elliott | ZYBORN ART
```

**Meta Description**:
```
Read the full curatorial recommendation by Luba Elliott on ZYBORN's debut artwork FIRST CANNED BTC — a physical embodiment of digital currency exploring weight, worth, and the ritual of value.
```

**Canonical URL**:
```
https://zyborn.com/curatorial
```

**Schema.org Markup**:
- Article
- Person (Luba Elliott)
- VisualArtwork reference

---

## ACCESSIBILITY REQUIREMENTS

- All images: descriptive alt text
- Focus states: visible outline (orange)
- Color contrast: WCAG AA minimum
- Keyboard navigation: all interactive elements
- ARIA labels: for navigation and links
- Reading order: logical for screen readers

---

## FILE STRUCTURE

```
curatorial/
├── index.html              # Complete single-file page
└── images/
    └── HEAD.png            # Survival Rations image (1536 × 1024 px)
```

---

## DEPLOYMENT NOTES

**Vercel Configuration**:
- Static HTML deployment
- No build step required
- Route: `/curatorial` → `/curatorial/index.html`

**Assets**:
- Main images referenced from `/images/` (logo)
- Article image from `/curatorial/images/HEAD.png`
- Google Fonts loaded from CDN
- All CSS embedded in HTML file

**API Integration**:
- Footer newsletter uses `/api/subscribe` endpoint
- Same Supabase + Resend integration as main page

---

## CONTENT INTEGRITY NOTES

The article text must be displayed **exactly as provided** in the source document, including:
- Paragraph structure (5 paragraphs)
- Italicization of artwork title (*FIRST CANNED BTC*)
- Em-dashes and special characters preserved
- No editorial changes or rewrites

Curator details must match source exactly:
- Name: Luba Elliott
- Title: AI curator, researcher and consultant
- Website: www.elluba.com
- LinkedIn: https://www.linkedin.com/in/lubaelliott/

---

## CHANGELOG

| Version | Date | Change | Deployed |
|---------|------|--------|----------|
| 1.0 | Dec 15, 2025 | Initial release | ✅ |
| 1.1 | Dec 20, 2025 | Updated image to HEAD.png with new caption "Survival Rations - Edition 1/21", added LinkedIn link to curator profile, integrated /api/subscribe for footer form | ⏳ |

---
