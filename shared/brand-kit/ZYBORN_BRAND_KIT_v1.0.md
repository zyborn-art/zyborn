# ZYBORN - BRAND KIT v1.0 (LOCKED)

## 1) Brand Identity

### Brand Name

**ZYBORN**

- Always uppercase
- No abbreviations
- No symbol in Phase 1

### Brand Positioning

Post-digital, auction-grade art practice materializing immaterial value systems (Bitcoin, AI, cryptographic trust) into industrial physical artifacts.

### Brand Attributes

- Industrial
- Precise
- Authoritative
- Non-decorative
- Conceptually rigorous

### What ZYBORN Is Not

- Not crypto-bro
- Not NFT hype
- Not playful
- Not decorative luxury
- Not speculative UI theater

------

## 2) Visual System (Principles)

### Visual Priority

**Typography > Color > Layout > Motion**

### Surface Strategy

- **Black-first**
- Context-driven alternation
- Mobile-first, iOS-optimized
- High contrast, restrained composition

### Aggression Level

7â€“8 / 10
Assertive without theatrics.

------

## 3) Color System (Frozen)

### Core Palette

```txt
--color-black:        #000000
--color-white:        #FFFFFF
--color-orange:       #F6931B   // Bitcoin Orange (primary force)
--color-steel-100:    #F2F2F2
--color-steel-300:    #BDBDBD
--color-steel-600:    #6F6F6F
--color-steel-900:    #2A2A2A
```

### Usage Rules

- **Black**: default background
- **Orange (#F6931B)**:
  - CTAs
  - Key emphasis
  - Large graphic blocks (label logic)
- **Steel grays**:
  - Metadata
  - Dividers
  - Secondary UI
- **White**:
  - Text on black
  - Reading surfaces only

Accessibility: edge cases allowed intentionally.

------

## 4) Typography System (Frozen)

### Primary (Display / Logo / Headlines)

**Space Grotesk** (Open source)

**Usage**

- Logo: Space Grotesk **Bold**
- Headlines: Medium â†’ Bold
- Uppercase dominant
- Tight tracking at large sizes

### Secondary (Utility / Data / Metadata)

**IBM Plex Mono** (Open source)

**Usage**

- Specs
- Dates
- Lot numbers
- NFC / blockchain references
- UI microcopy

### Type Scale (Web)

```txt
H1:  clamp(40px, 8vw, 96px)   // SG Bold
H2:  clamp(28px, 5vw, 56px)   // SG Semibold
H3:  24px                    // SG Medium
Body: 16â€“18px                // SG Regular
Meta: 12â€“14px                // Plex Mono Regular
```

### Typography Rules

- Left-aligned by default
- No centered body text
- No decorative effects
- No italics
- No shadows
- No outlines

------

## 5) Logo Rules (Phase 1)

### Logo Form

- **Text-only wordmark**: `ZYBORN`
- Typeface: Space Grotesk Bold
- Uppercase only

### Placement

- May sit inside **linear blocks** (rectangular only)
- Edge-aligned preferred
- No circular badges
- No emblem treatment
- No glow in production assets

### Color

- White on black (default)
- Black on white (secondary)
- Orange only in controlled graphic contexts

------

## 6) Navigation & CTA Rules

### Navigation

- Minimum **5 items**
- Persistent menu
- Clear hierarchy
- CTA always visible

### CTA Language (Locked)

- **Primary:** Register to bid
- **Secondary:** Notify me

Rules:

- No countdowns
- No urgency gimmicks
- Date + status only (subtle)

------

## 7) UI Components (Developer-Ready)

### Buttons

```css
.btn-primary {
  background: #F6931B;
  color: #000;
  font-family: 'IBM Plex Mono';
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

- Rectangular
- No radius or max 2px
- No gradients
- Hover: brightness +5â€“8%

### Dividers

- 1px solid `--color-steel-600`
- Used liberally for structure

### Cards / Blocks

- Flat
- Minimal shadows
- Border optional (steel gray)
- Padding generous, consistent

------

## 8) Layout System (Rules Only)

### Strategy

- **Mobile-first**
- iOS Safari optimized
- Hybrid width:
  - Hero: full-bleed
  - Content: constrained

### Grid

- 4-column mobile
- 8â€“12 column desktop
- Strong vertical rhythm

### Spacing Tokens

```txt
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-6: 24px
--space-8: 32px
--space-12: 48px
--space-16: 64px
```

------

## 9) Motion & Effects (Strict)

- Minimal only
- Fade / translate â‰¤ 8px
- No parallax
- No scroll theatrics
- No countdown animation
- No loading spinners unless functional

------

## 10) Asset Governance

### Do Not

- Add colors
- Add fonts
- Add symbols
- Add countdowns
- Add decorative effects

### Allowed Later (Explicitly Deferred)

- Symbol / monogram
- NFC landing UX
- Exhibition microsites
- Motion branding

------

## 11) Automation & Dev Notes

- Design tokens map cleanly to CSS variables
- Fonts via Google Fonts (self-host recommended)
- System compatible with:
  - Next.js
  - Vercel
  - Tailwind or vanilla CSS