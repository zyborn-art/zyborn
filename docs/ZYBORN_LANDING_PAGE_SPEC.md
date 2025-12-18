# ZYBORN ART Landing Page â€” Complete Specification for HTML Generation

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
| Mobile | 0â€“767px | 4-column | 20px |
| Tablet | 768â€“1023px | 8-column | 40px |
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
- Background: transparent â†’ black on scroll (with blur)
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
- Alt: "ZYBORN"
- Text fallback: "ZYBORN" in Space Grotesk Bold, white

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
AUCTION â€” LONDON
```

**Headline** (H1):
```
WORLD's FIRST CANNED BTC SINCE 2009.01.03
```

**Subheadline** (Body):
```
An original artwork by ZYBORN. Exhibited in London and offered in a limited auction on 3 January 2026.
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
     - Other â€” please specify

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
| Title | WORLD's FIRST CANNED BTC |
| Artist | ZYBORN |
| Medium | Metal |
| Dimensions | 10.8 Ã— 7.50 cm |
| Edition | 1/21 (unique original work) |
| Framing | Unframed |

### Column 2: Included with Purchase

**Title** (H3):
```
Included with purchase
```

**Items** (with checkmark icons):
- âœ“ Signed Artwork
- âœ“ Counterfeit proof certificate of authenticity
- âœ“ Embedded NFC tag linked to a secure digital record
- âœ“ BTC Cold wallet (Ledger)

### Column 3: Artwork Image
- File: `canned_btc.jpg`
- Alt: "WORLD's FIRST CANNED BTC by ZYBORN - tin can artwork"
- Border: 1px solid steel-600
- Hover: subtle lift effect (-4px translateY)

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
In the first two decades of the 21st century, one of the most defining transformations in artistic practice was the rise of digital representation. Images, objects, and experiences migrated onto the plane of the screen, and artworks increasingly existed as data structures, algorithms, or networked entities. Yet, simultaneously, a paradoxical desire emerged: for the immaterial products of the digital world to return to matter to not merely appear, but to take physical form.
```

**Paragraph 2**:
```
In the history of art, the transformation of everyday objects and systems into critical, ritualistic or ironic artefacts is a recurring gesture. Yet when an artist seals Bitcoin inside a tin can, the act opens radically new horizons: immaterial money - normally invisible, disembodied, a purely network-based structure - becomes an object in which the logics of storage, preservation, delay, and the profane commodity form converge.
```

**Paragraph 3**:
```
It is within this contradiction that the true power of the work arises: money is returned to the realm of physical culture, where value manifests not in algorithms but in metallic weight, sealed content, and tangible time.
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

### Info Grid (3 columns desktop, stacked mobile)

**Column 1: Venue**
- Icon: SVG location pin
- Label: VENUE
- Value: Westminster, London

**Column 2: Dates**
- Icon: SVG calendar
- Label: DATES
- Value: 3 January 2026, 14:00â€“16:00

**Column 3: Event**
- Icon: SVG event
- Label: EVENT
- Value: Live Performance, Details to be announced

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
We respect your inbox. Unsubscribe anytime with one click.
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
   - Text: `SIGN UP FOR UPDATES â†’`
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

**UK â€” Ada Lovelace Institute**
- File: `ada_lovelace_institute.png`
- Link: https://www.adalovelaceinstitute.org/
- Alt: "Ada Lovelace Institute logo"

**US â€” Future of Life Institute**
- File: `Future_of_Life_Institute.png`
- Link: https://futureoflife.org/
- Alt: "Future of Life Institute logo"

**EU â€” AlgorithmWatch**
- File: `algorithmwatch.png`
- Link: https://algorithmwatch.org/
- Alt: "AlgorithmWatch logo"

---

## SECTION 10: PARTNERS

**ID**: `#partners`

### Layout
- Background: `var(--color-white)`
- Centered content: max-width 900px
- Padding: 64px vertical

### Section Header

**Label** (Meta, uppercase, steel-600):
```
PARTNERS
```

### Logo Grid (3 columns, grayscale by default)

**Partner 1: BidJS**
- File: `bidjs.png`
- Link: https://bidjs.com/
- Alt: "BidJS logo"

**Partner 2: B&M Law LLP**
- File: `BM_Law.png`
- Link: https://www.bandmlaw.co.uk/
- Alt: "B&M Law LLP logo"

**Partner 3: NotaryPublic.London**
- File: `notary_london.png`
- Link: https://www.notarypublic.london/
- Alt: "NotaryPublic.London logo"

---

## SECTION 11: THANK YOU

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

## SECTION 12: FOOTER

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
Â© 2009 ZYBORN ART. All rights reserved.
```

**Legal Links** (Meta, steel-300):
```
Privacy â€¢ Terms â€¢ Cookie settings
```

---

## ANIMATION GUIDELINES

**Allowed Effects Only** (per brand kit):
- Fade: opacity 0 â†’ 1
- Translate: max â‰¤8px
- Duration: 300â€“400ms
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
| logo.png | Navigation | 120Ã—40px |
| hero.png | Hero | 800Ã—1000px |
| canned_btc.jpg | Artwork Details | 600Ã—800px |
| ada_lovelace_institute.png | Charity | 200Ã—80px |
| Future_of_Life_Institute.png | Charity | 200Ã—80px |
| algorithmwatch.png | Charity | 200Ã—80px |
| bidjs.png | Partners | 150Ã—60px |
| BM_Law.png | Partners | 150Ã—60px |
| notary_london.png | Partners | 150Ã—60px |

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
WORLD's FIRST CANNED BTC â€” ZYBORN ART | January 2025 London Auction
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
â”œâ”€â”€ index.html
â”œâ”€â”€ css/
â”‚   â””â”€â”€ styles.css
â”œâ”€â”€ js/
â”‚   â””â”€â”€ main.js
â”œâ”€â”€ images/
â”‚   â”œâ”€â”€ logo.png
â”‚   â”œâ”€â”€ hero.png
â”‚   â”œâ”€â”€ canned_btc.jpg
â”‚   â”œâ”€â”€ ada_lovelace_institute.png
â”‚   â”œâ”€â”€ Future_of_Life_Institute.png
â”‚   â”œâ”€â”€ algorithmwatch.png
â”‚   â”œâ”€â”€ bidjs.png
â”‚   â”œâ”€â”€ BM_Law.png
â”‚   â””â”€â”€ notary_london.png
â””â”€â”€ fonts/ (if self-hosting)
    â”œâ”€â”€ SpaceGrotesk-*.woff2
    â””â”€â”€ IBMPlexMono-*.woff2
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
