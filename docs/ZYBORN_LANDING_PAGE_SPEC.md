# ZYBORN ART Landing Page — Complete Specification for HTML Generation

> **Purpose**: Single-page landing for WORLD's FIRST CANNED BTC artwork auction
> **Primary KPI**: Email capture / Lead generation
> **Secondary KPI**: Exhibition attendance

---

## DESIGN SYSTEM TOKENS

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

### Typography

**Fonts (Google Fonts)**:
- Primary: `Space Grotesk` (400, 500, 600, 700)
- Secondary: `IBM Plex Mono` (400, 500)

```css
/* Type Scale */
--h1: clamp(40px, 8vw, 96px);       /* Space Grotesk Bold */
--h2: clamp(28px, 5vw, 56px);       /* Space Grotesk Semibold */
--h3: 24px;                          /* Space Grotesk Medium */
--body: 16px;                        /* Space Grotesk Regular (18px desktop) */
--meta: 12px;                        /* IBM Plex Mono Regular (14px desktop) */
```

**Typography Rules**:
- Left-aligned by default
- NO centered body text
- NO italics, shadows, or outlines
- Uppercase dominant for headlines

### Button Styles

```css
.btn-primary {
  background: var(--color-orange);
  color: var(--color-black);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 16px 32px;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primary:hover {
  filter: brightness(1.08);
}

.btn-secondary {
  background: transparent;
  color: var(--color-white);
  border: 1px solid var(--color-steel-600);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
    
  padding: 16px 32px;
  border-radius: 2px;
}
```

---

## RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Grid | Container Padding |
|------------|-------|------|-------------------|
| Mobile | 0–767px | 4-column | 20px |
| Tablet | 768–1023px | 8-column | 40px |
| Desktop | 1024px+ | 12-column | 80px |
| Wide | 1440px+ | 12-column | centered, max-width: 1400px |

---

## SECTION 1: NAVIGATION (Fixed)

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
1. Artwork
2. Curator
3. Exhibition
4. Auction
5. Mission
6. Charity

### CTA Button
- Text: `NOTIFY ME`
- Style: `.btn-primary`

### Logo
- File: `logo.png`
- Link: `/` (home)

---

## SECTION 2: HERO (Full Viewport)

**ID**: `#hero`

### Layout
- Height: 100vh minimum
- Desktop: Two columns (55% content / 45% image)
- Mobile: Stack (image below content)
- Background: `var(--color-black)`

### Content (Left Column)

**Pre-headline** (Meta style):
```
London
```

**Headline** (H1):
```
WORLD's FIRST CANNED BTC
```

**Subheadline** (Body):
```
Zyborn's debut project FIRST CANNED BTC presents a physical embodiment of a fundamentally digital currency, transforming a mass-market household object into something both valuable and enigmatic.
```

### Email Capture Form

**Layout**: Horizontal on desktop, stacked on mobile

**Fields**:
1. Email input
   - Placeholder: "Enter your email"
   - Type: email
   - Required

2. Select dropdown
   - Label: "I am interested as..."
   - Options:
     - Artist (fine artist, interdisciplinary artist, photographer, etc.)
     - Curator / Exhibition curator
     - Gallerist (gallery owner)
     - Art dealer
     - Artist manager
     - Artist agent
     - Art producer (coordination of projects, biennials, large-scale works)
     - Auction specialist
     - Art appraiser / Valuer
     - Art advisor
     - Collection manager
     - Museum curator / Specialist curator
     - Restorer / Conservator
     - Archivist (artistic archives management)
     - Other — please specify

3. Submit button
   - Text: `NOTIFY ME`
   - Style: `.btn-primary`

**Micro-copy** (Meta style, steel-300):
```
You'll receive one reminder before the auction opens and a final alert 24 hours before bidding closes.
```

### Social Links
- Instagram
  - Link: https://www.instagram.com/zyborn.art/
- X (Twitter) 
  - Link: https://x.com/ZYBORN_ART
- TikTok
  - Link: https://www.tiktok.com/@zyborn_art
- YouTube
  - Link: https://www.youtube.com/@ZYBORN_ART

### Image (Right Column)
- File: `hero.png`
- Alt: "WORLD's FIRST CANNED BTC artwork preview"
- Display: Object-fit contain, max-height 80vh

Remove from the code 

---

## SECTION 3: ARTWORK DETAILS

**ID**: `#artwork`

### Layout
- Background: `var(--color-steel-900)`
- Desktop: Three columns (specs / inclusions / image)
- Mobile: Single column, stacked
- Padding: 80px vertical

### Section Header
**Label** (Meta, uppercase, orange):
```
ARTWORK DETAILS
```

**Title** (H2):
```
Technical Specifications
```

### Column 1: Specifications

| Label | Value |
|-------|-------|
| Title | Survival Rations |
| Artist | ZYBORN |
| Medium | Metal |
| Dimensions | 10.8 × 7.5 cm |
| Edition | 1/21 (unique original work) |
| Framing | Unframed |

### Column 2: Included with Purchase

**Title** (H3):
```
Included with purchase
```

**Items** (with checkmark icons):
- ✓ Signed Artwork
- ✓ Counterfeit proof certificate of authenticity
- ✓ Embedded NFC tag linked to a secure digital record
- ✓ BTC Cold wallet (Ledger)

---

## SECTION 4: CURATOR (Luba Elliott)

**ID**: `#curator`

### Layout
- Background: `var(--color-steel-100)`
- Centered card: max-width 900px
- Card background: `var(--color-white)`
- Padding: 80px vertical

### Card Content

**Label** (Meta, uppercase):
```
CURATORIAL RECOMMENDATION
```

**Curator Name** (H3):
```
Luba Elliott
```

**Title** (H2):
```
The Can as Currency
```

**Paragraph 1**:
```
Zyborn's debut project FIRST CANNED BTC presents a physical embodiment of a fundamentally digital currency, transforming a mass-market household object into something both valuable and enigmatic. As global war narratives intensify, the can emerges as a symbol of durable, reliable, and psychologically reassuring food within an increasingly militarised, bloc-divided world. At once commodity and riddle, the can inspires a simple but charged question: what is inside? Bitcoin worth the equivalent of one million US dollars across a limited edition of 21 units. The amount contained within each can is variable, determined by AI rather than human decision-making, removing predictability and authorship from the act of valuation.
```

**Paragraph 2**:
```
For me, this project marks a welcome return to the physical realm, encapsulating capitalism itself as a variable canned good. The can is conventionally associated with sameness: every unit identical, interchangeable, mass-produced. Here, that logic is quietly subverted. Each can looks the same, yet contains a different amount of Bitcoin. This gesture foregrounds a unique affordance of digital currency: weightlessness. Whether a can holds 0.01 or 1 BTC, it weighs exactly the same. With a physical currency, this would be impossible, as coins and banknotes betray value through mass. Instead, Zyborn's work masterfully stages a tension between weight and worth, visibility and value, using the immateriality of Bitcoin as its conceptual engine.
```

### CTA Button
- Text: `READ MORE`
- Link: `https://zyborn.com/curatorial`
- Style: `.btn-secondary` with black text on light background

---

## SECTION 5: LONDON EXHIBITION

**ID**: `#exhibition`

### Layout
- Background: `var(--color-black)`
- Centered floating card: max-width 900px
- Card background: `var(--color-steel-900)`
- Padding: 80px vertical

### Section Header

**Label** (Meta, uppercase, orange):
```
LONDON EXHIBITION
```

**Title** (H2):
```
See the artwork in person
```

**Description** (Body):
```
WORLD's FIRST CANNED BTC will be exhibited at the ZYBORN launch event in London on 3 January 2026. Visitors can experience the work at full scale, view the surface detail of the artwork by ZYBORN team.
```

### Info Grid (4 columns desktop, stacked mobile)

**Column 1: Venue**
- Icon: SVG location pin
- Label: VENUE
- Value: Westminster, 
- Sub: London

**Column 2: Dates**
- Icon: SVG calendar
- Label: DATES
- Value: 3 January 2026, 
- Sub: 14:00–16:00

**Column 3: Event**
- Icon: SVG event
- Label: EVENT
- Value: Live Performance, 
- Sub: Details to be announced

### Footer Note (Meta, steel-300):
```
Further details are coming
```

---

## SECTION 6: AUCTION

**ID**: `#auction`

### Layout
- Background: `var(--color-steel-100)`
- Text: dark
- Centered content: max-width 900px
- Padding: 80px vertical

### Section Header

**Label** (Meta, uppercase):
```
AUCTION
```

**Title** (H2):
```
Bid for WORLD's FIRST CANNED BTC
```

**Description** (Body):
```
The artwork will be offered in a timed online auction starting 24 December 2025 via our partner platform at this domain. Register your interest below to receive a direct link as soon as bidding opens.
```

### Auction Info Grid (3 columns)

**Column 1: Auction Date**
- Label: AUCTION DATE
- Value: 24 December 2025
- Sub: 00:00 GMT

**Column 2: Estimate**
- Label: ESTIMATE
- Value: $1M USD
- Sub: Reserve TBD

**Column 3: Format**
- Label: FORMAT
- Value: Online auction
- Sub: 10 days window

### CTA Button
- Text: `NOTIFY ME WHEN AUCTION OPENS`
- Style: `.btn-primary`
- Action: Scroll to `#email-capture`

### Note (Meta, steel-600):
```
We respect your inbox.
```

---

## SECTION 7: EMAIL CAPTURE (Split Card)

**ID**: `#email-capture`

### Layout
- Background: `var(--color-black)`
- Split card: 45% left (visual) / 55% right (form)
- Mobile: Form only, or visual as header stripe
- Padding: 80px vertical

### Left Panel (Visual/Messaging)

**Background**: Geometric pattern or solid orange block

**Content**:
```
Auction opens
24 December 2025

Don't miss out.

Join collectors and art professionals receiving updates on this historic auction.

Already have an account?
Sign in
```

### Right Panel (Form)

**Title** (H2):
```
Stay ahead of the auction
```

**Subtitle** (Body):
```
Get early access to auction details, exhibition updates, and exclusive insights.
```

**Form Fields**:

1. Email input
   - Placeholder: "Email address"
   - Required

2. Name input
   - Placeholder: "Full name"
   - Required

3. Checkbox group - "I'm interested in:"
   - [ ] Considering bidding
   - [ ] Exhibition updates
   - [ ] Press / media

4. Submit button
   - Text: `SIGN UP FOR UPDATES →`
   - Style: `.btn-primary`

**Privacy Note** (Meta, steel-300):
```
Your information is secure. Read our privacy policy.
```

---

## SECTION 8: MISSION

**ID**: `#mission`

### Layout
- Background: `var(--color-black)`
- Full width with centered text
- Padding: 120px vertical

### Content

**Label** (Meta, uppercase, orange):
```
MISSION
```

**Quote** (H2, centered, max-width 900px):
```
"At the heart of the Fourth Industrial Revolution, we focus on the societal dilemmas of digital transformation within an increasingly militarised and bloc-based global order."
```

---

## SECTION 9: CHARITABLE IMPACT & FOUNDATION

**ID**: `#charity`

### Layout
- Background: `var(--color-steel-100)`
- Centered card: max-width 1000px
- Padding: 80px vertical

### Section Header

**Label** (Meta, uppercase):
```
CHARITABLE IMPACT & FOUNDATION
```

**Title** (H2):
```
Where Art Creates Impact
```

**Description** (Body):
```
All proceeds will be allocated to charitable purposes, including support for the organisations listed below. In parallel, we will establish an independent foundation dedicated to supporting visual artists and the production of art exhibitions.
```

### Logo Grid (3 columns)

**UK — Ada Lovelace Institute**
- File: `ada_lovelace_institute.png`
- Link: https://www.adalovelaceinstitute.org/
- Alt: "Ada Lovelace Institute logo"

**US — Future of Life Institute**
- File: `Future_of_Life_Institute.png`
- Link: https://futureoflife.org/
- Alt: "Future of Life Institute logo"

**EU — AlgorithmWatch**
- File: `algorithmwatch.png`
- Link: https://algorithmwatch.org/
- Alt: "AlgorithmWatch logo"

---

## SECTION 10: THANK YOU

**ID**: `#thanks`

### Layout
- Background: `var(--color-white)`
- Centered text
- Padding: 64px vertical

### Content (Body, centered):
```
Thank you to my supporters for their generous contributions and trust, which made this project possible.
```

---

## SECTION 11: FOOTER

**ID**: `#footer`

### Layout
- Background: `var(--color-black)`
- Text: `var(--color-white)`
- Padding: 80px top, 40px bottom

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
- Instagram 
  - Link: https://www.instagram.com/zyborn.art/

- X
  - Link: https://x.com/ZYBORN_ART


### Bottom Bar

**Copyright** (Meta, steel-300):
```
© 2009 ZYBORN ART. All rights reserved.
```

**Legal Links** (Meta, steel-300):
```
Privacy • Terms • Cookie Policy
```

---

## ANIMATION GUIDELINES

**Allowed Effects Only** (per brand kit):
- Fade: opacity 0 → 1
- Translate: max ≤8px
- Duration: 300–400ms
- Easing: ease-out

**Page Load Sequence**:
1. Navigation fades in
2. Hero label reveals
3. Hero H1 reveals (100ms delay)
4. Hero body text reveals (200ms delay)
5. Hero form reveals (300ms delay)
6. Hero image slides in from right (400ms delay)

**Scroll Animations**:
- Sections fade-in-up on viewport entry
- Threshold: 20%
- Trigger once

**Interactive States**:
- Buttons: scale 1.02 on hover, 0.98 on active
- Cards: translateY -4px on hover
- Links: underline on hover

---

## IMAGE ASSETS

| Filename | Section | Dimensions (suggested) |
|----------|---------|------------------------|
| logo.png | Navigation | 120×40px |
| hero.png | Hero | 800×1000px |
| canned_btc.jpg | Artwork Details | 600×800px |
| ada_lovelace_institute.png | Charity | 200×80px |
| Future_of_Life_Institute.png | Charity | 200×80px |
| algorithmwatch.png | Charity | 200×80px |
| bidjs.png | Partners | 150×60px |
| BM_Law.png | Partners | 150×60px |
| notary_london.png | Partners | 150×60px |

---

## FORM INTEGRATION NOTES

**Email Service Options** (for Supabase/SMTP integration):
- ConvertKit
- Zoho ZeptoMail
- Resend
- Loops

**Required Form Data**:
```json
{
  "email": "string (required)",
  "name": "string (optional)",
  "role": "string (dropdown selection)",
  "interests": ["array of checkbox values"],
  "source": "landing_page",
  "timestamp": "ISO datetime"
}
```

---

## SEO & STRUCTURED DATA

**Page Title**:
```
WORLD's FIRST CANNED BTC — ZYBORN ART | January 2025 London Auction
```

**Meta Description**:
```
Bid on WORLD's FIRST CANNED BTC, an original artwork by ZYBORN. Limited edition 1/21. Exhibition in London, auction opens January 2025. Register for updates.
```

**Schema.org Markup**:
- VisualArtwork
- ExhibitionEvent
- AuctionEvent

---

## ACCESSIBILITY REQUIREMENTS

- All images: descriptive alt text
- Form inputs: associated labels
- Focus states: visible outline (orange)
- Color contrast: WCAG AA minimum
- Keyboard navigation: all interactive elements
- ARIA labels: for icon-only buttons

---

## FILE STRUCTURE (Suggested)

```
/zyborn-landing/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── images/
│   ├── logo.png
│   ├── hero.png
│   ├── canned_btc.jpg
│   ├── ada_lovelace_institute.png
│   ├── Future_of_Life_Institute.png
│   ├── algorithmwatch.png
│   ├── bidjs.png
│   ├── BM_Law.png
│   └── notary_london.png
└── fonts/ (if self-hosting)
    ├── SpaceGrotesk-*.woff2
    └── IBMPlexMono-*.woff2
```

---

## HTML GENERATION PROMPT

When generating the HTML file, ensure:

1. Semantic HTML5 structure (`<header>`, `<main>`, `<section>`, `<footer>`)
2. CSS variables defined in `:root`
3. Mobile-first responsive styles
4. Google Fonts import for Space Grotesk and IBM Plex Mono
5. Smooth scroll behavior
6. Form validation with HTML5 attributes
7. Intersection Observer for scroll animations
8. No external JavaScript frameworks (vanilla JS only)
9. Single HTML file with embedded CSS and JS (for easy deployment)
10. All text content exactly as specified above

## SPEC FILE CHANGELOG

```markdown
## CHANGELOG

| Version | Date | Change | Deployed |
|---------|------|--------|----------|
| 1.0 | Dec 15, 2025 | Initial release | ✅ |
| 1.1 | Dec 18, 2025 | Updated hero headline text | ✅ |
| 1.2 | Dec 21, 2025 | Partners section deleted updated hero text and Artwork details picture deleted | ⏳ |
```
