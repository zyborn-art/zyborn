# ZYBORN Press Kit Landing Page — Technical Specification

> **URL**: `https://zyborn.com/press`  
> **Purpose**: Media-focused landing page for journalists, TV outlets, and press inquiries  
> **Primary KPI**: Media kit downloads & Press contact form submissions  
> **Version**: 1.2

---

## DESIGN PHILOSOPHY

The Press page maintains ZYBORN brand consistency while optimizing for journalist workflow:
- **Speed**: Journalists need assets fast — no hunting required
- **Credibility**: Professional presentation signals legitimacy
- **Completeness**: All assets in one place — downloadable immediately
- **Contact**: Clear path to press representative

---

## DESIGN SYSTEM TOKENS

*Inherits from ZYBORN Brand Kit v1.0*

### Color Palette (CSS Variables)

```css
:root {
  /* Core */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-orange: #F6931B;
  
  /* Steel Grays */
  --color-steel-100: #F2F2F2;
  --color-steel-300: #BDBDBD;
  --color-steel-600: #6F6F6F;
  --color-steel-900: #2A2A2A;
}
```

### Typography

**Fonts (Google Fonts)**:
- Primary: `Space Grotesk` (400, 500, 600, 700)
- Secondary: `IBM Plex Mono` (400, 500)

---

## PAGE STRUCTURE OVERVIEW

```
NAVIGATION (Fixed)
├── Logo → zyborn.com
├── Back to Main Site
└── Press Contact CTA

HERO (Compact)
├── Pre-headline: PRESS & MEDIA
├── Headline: Media Resources
└── Subheadline: Everything journalists need

QUICK DOWNLOADS (Priority Section)
├── Press Release (ZIP)
├── Media Kit (ZIP)
├── High-Res Images (ZIP)
└── Logo Package (ZIP)

PROJECT OVERVIEW
├── About the Artwork
└── Key Facts

PRESS ASSETS GALLERY
├── Head Image (preview + download)
├── Military (preview + download)
├── Home (preview + download)
├── Performance (preview + download)
├── Auction (preview + download)
└── Show (preview + download)

PRESS QUOTES / CURATORIAL
├── Luba Elliott quote
└── Link to full curatorial essay

PRESS CONTACT
├── Contact Form
├── Direct Email
└── Response Time Promise

FOOTER (Simplified)
├── Legal Links
└── Social Links
```

---

## SECTION 1: NAVIGATION

**ID**: `#nav`

### Layout
- Height: 64px (compact for utility page)
- Logo left, utility links right
- Position: fixed top
- Background: `var(--color-black)`

### Elements

**Logo**:
- File: `logo.png`
- Link: `https://zyborn.com/`
- Alt: "ZYBORN"

**Utility Links** (Right side):
1. "← Back to Main Site" → `https://zyborn.com/`
2. "Contact Press Team" (button) → scrolls to `#contact`

---

## SECTION 2: HERO

**ID**: `#hero`

### Layout
- Height: 50vh (compact, not full viewport)
- Background: `var(--color-black)`
- Content: centered
- Padding: 80px vertical

### Content

**Pre-headline** (Meta, uppercase, orange):
```
PRESS & MEDIA
```

**Headline** (H1):
```
Media Resources
```

**Subheadline** (Body, white):
```
Download press materials for WORLD's FIRST CANNED BTC by ZYBORN. 
For press inquiries, contact our media team below.
```

---

## SECTION 3: QUICK DOWNLOADS (Priority)

**ID**: `#downloads`

### Layout
- Background: `var(--color-steel-900)`
- Grid: 4 columns desktop, 2 columns tablet, 1 column mobile
- Card style: Dark cards with icon + label + download button
- Padding: 64px vertical

### Section Header

**Title** (H2):
```
Quick Downloads
```

### Download Cards

**Card 1: Press Release**
- Icon: Document icon (SVG)
- Label: "Press Release"
- Format: "ZIP • 1 MB"
- Button: "DOWNLOAD" → `ZYBORN_Press_Release.zip`

**Card 2: Media Kit**
- Icon: Folder icon (SVG)
- Label: "Complete Media Kit"
- Format: "ZIP • 30 MB"
- Button: "DOWNLOAD" → `ZYBORN_Media_Kit.zip`

**Card 3: High-Res Images**
- Icon: Image icon (SVG)
- Label: "Press Images"
- Format: "ZIP • 12 MB"
- Button: "DOWNLOAD" → `ZYBORN_Press_Images.zip`

**Card 4: Logo Package**
- Icon: Logo icon (SVG)
- Label: "Logo Assets"
- Format: "ZIP • 2 MB"
- Button: "DOWNLOAD" → `ZYBORN_Logo_Package.zip`

### Button Style
```css
.download-btn {
  background: var(--color-orange);
  color: var(--color-black);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 12px 24px;
  border: none;
  border-radius: 2px;
}
```

---

## SECTION 4: PROJECT OVERVIEW

**ID**: `#overview`

### Layout
- Background: `var(--color-black)`
- Two columns: Text (60%) | Key Facts (40%)
- Padding: 80px vertical

### Left Column: About

**Title** (H2):
```
About the Project
```

**Body Text**:
```
WORLD's FIRST CANNED BTC is an original artwork by ZYBORN that seals Bitcoin — an immaterial, network-based currency — inside a physical tin can. The work draws on the visual language of industrial packaging while transforming the Bitcoin ecosystem into a sculptural object.

The limited edition of 21 pieces contains AI-distributed amounts of Bitcoin hidden inside each can, transforming the object into a kind of algorithmic lottery and a physical manifestation of potential value.

The artwork will be exhibited in London and offered in a timed online auction opening December 2025.
```

### Right Column: Key Facts

**Title** (H3):
```
Key Facts
```

**Data Grid** (IBM Plex Mono):

| Label | Value |
|-------|-------|
| Artist | ZYBORN |
| Title | Survival Ration |
| Medium | Metal, Cold Wallet, NFC |
| Dimensions | 10.8 × 7.5 cm |
| Edition | 1 of 21 |
| Auction Date | December 2025 |
| Estimate | $1M USD |
| Exhibition | London, 3 January 2026 |

---

## SECTION 5: PRESS ASSETS GALLERY

**ID**: `#gallery`

### Layout
- Background: `var(--color-steel-100)`
- Grid: 3 columns desktop, 2 columns tablet, 1 column mobile
- Card style: Image thumbnail + label + dimensions + download link
- Padding: 80px vertical

### Section Header

**Title** (H2, dark text):
```
Press Images
```

**Subtitle** (Body):
```
High-resolution images approved for editorial use. Please credit: ZYBORN ART
```

### Image Cards

**Card 1: Head Image**
- Thumbnail: `ZYBORN_Survival-Rations_HEAD.png` (cropped preview)
- Label: "Head Image"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_HEAD.png`

**Card 2: Military**
- Thumbnail: `ZYBORN_Survival-Rations_military.png` (cropped preview)
- Label: "Survival Rations: Military"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_military.png`

**Card 3: Home**
- Thumbnail: `ZYBORN_Survival-Rations_home.png` (cropped preview)
- Label: "Survival Rations: Home"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_home.png`

**Card 4: Performance**
- Thumbnail: `ZYBORN_Survival-Rations_performance.png` (cropped preview)
- Label: "Survival Rations: Performance"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_performance.png`

**Card 5: Auction**
- Thumbnail: `ZYBORN_Survival-Rations_auction.png` (cropped preview)
- Label: "Survival Rations: Auction"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_auction.png`

**Card 6: Show**
- Thumbnail: `ZYBORN_Survival-Rations_show.png` (cropped preview)
- Label: "Survival Rations: Show"
- Dimensions: "1536 × 1024 px"
- Link: "Download PNG" → `ZYBORN_Survival-Rations_show.png`

### Image Card Style
- Border: 1px solid `var(--color-steel-300)`
- Background: `var(--color-white)`
- Hover: subtle shadow lift
- Thumbnail: aspect-ratio 4:3, object-fit cover

---

## SECTION 6: CURATORIAL ENDORSEMENT

**ID**: `#curatorial`

### Layout
- Background: `var(--color-black)`
- Centered content, max-width 800px
- Padding: 80px vertical

### Content

**Quote** (H3, white, centered):
```
"Zyborn's debut project FIRST CANNED BTC presents a physical embodiment of a fundamentally digital currency, transforming a mass-market household object into something both valuable and enigmatic."
```

**Attribution** (Meta, steel-300):
```
— Luba Elliott, AI Curator & Researcher
```

**CTA**:
- Text: "Read Full Curatorial Essay →"
- Link: `https://zyborn.com/curatorial`
- Style: Text link, white, underline on hover

---

## SECTION 7: PRESS CONTACT

**ID**: `#contact`

### Layout
- Background: `var(--color-black)`
- Two columns: Contact info (40%) | Form (60%)
- Mobile: Stacked (info above form)
- Padding: 80px vertical

### Left Column: Contact Info

**Title** (H2):
```
Press Contact
```

**Direct Email** (highlighted):
```
press@zyborn.com
```

**Response Promise** (Meta, steel-300):
```
We respond to media inquiries within 24 hours.
```

**For Urgent Requests**:
```
Phone: +44 7857764621
```

### Right Column: Contact Form

**Title** (H3):
```
Send a Press Inquiry
```

**Form Fields**:

1. Name
   - Placeholder: "Your name"
   - Required

2. Email
   - Placeholder: "Email address"
   - Type: email
   - Required

3. Outlet
   - Placeholder: "Publication / Media outlet"
   - Required

4. Inquiry Type (Dropdown)
   - Interview Request
   - Image Request
   - Press Release Request
   - Exhibition Coverage
   - Other

5. Message
   - Placeholder: "How can we help?"
   - Textarea, 4 rows
   - Required

6. Submit Button
   - Text: "SEND INQUIRY"
   - Style: `.btn-primary`

**Privacy Note** (Meta, steel-600):
```
We do not share your information with third parties.
```

---

## SECTION 8: FOOTER (Simplified)

**ID**: `#footer`

### Layout
- Background: `var(--color-black)`
- Single row: Logo | Links | Social
- Padding: 40px vertical

### Content

**Logo**: ZYBORN

**Links** (Meta, steel-300):
- Main Site
- Curatorial
- Privacy Policy

**Social Icons**:
- Instagram → `https://www.instagram.com/zyborn.art/`
- X → `https://x.com/ZYBORN_ART`

**Copyright**:
```
© 2009 ZYBORN ART. All rights reserved.
```

---

## DOWNLOADABLE ASSETS CHECKLIST

**Files to Prepare:**

| File | Contents | Format |
|------|----------|--------|
| `ZYBORN_Press_Release.zip` | Official press release | ZIP |
| `ZYBORN_Media_Kit.zip` | All assets combined | ZIP |
| `ZYBORN_Press_Images.zip` | High-res photos | ZIP |
| `ZYBORN_Logo_Package.zip` | Logo variants | ZIP |

---

## SEO & META

**Page Title**:
```
Press & Media | ZYBORN ART — WORLD's FIRST CANNED BTC
```

**Meta Description**:
```
Download press materials, high-resolution images, and media kit for WORLD's FIRST CANNED BTC by ZYBORN. Press inquiries: press@zyborn.com
```

**Open Graph**:
```html
<meta property="og:title" content="Press & Media | ZYBORN ART" />
<meta property="og:description" content="Media resources for WORLD's FIRST CANNED BTC" />
<meta property="og:image" content="https://zyborn.com/images/og-press.jpg" />
<meta property="og:url" content="https://zyborn.com/press" />
```

---

## FILE STRUCTURE

```
press/
├── index.html              # Complete HTML
├── press.css               # Styles
├── press.js                # JavaScript
├── images/                 # Gallery images
│   ├── ZYBORN_Survival-Rations_HEAD.png
│   ├── ZYBORN_Survival-Rations_military.png
│   ├── ZYBORN_Survival-Rations_home.png
│   ├── ZYBORN_Survival-Rations_performance.png
│   ├── ZYBORN_Survival-Rations_auction.png
│   └── ZYBORN_Survival-Rations_show.png
└── assets/                 # Downloadable files
    ├── ZYBORN_Press_Release.zip
    ├── ZYBORN_Media_Kit.zip
    ├── ZYBORN_Press_Images.zip
    └── ZYBORN_Logo_Package.zip
```

---

## CHANGELOG

| Version | Date | Change | Deployed |
|---------|------|--------|----------|
| 1.0 | Dec 19, 2025 | Initial release | ✅ |
| 1.1 | Dec 20, 2025 | SECTION 5: PRESS ASSETS GALLERY photo name changes and files | ✅ |
| 1.2 | Dec 20, 2025 | SECTION 4: Key Facts - Title changed to "Survival Ration", Dimensions to "10.8 × 7.5 cm". SECTION 7: TIMELINE deleted entirely. | ⏳ |

---
