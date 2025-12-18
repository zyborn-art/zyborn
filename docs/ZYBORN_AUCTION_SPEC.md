# ZYBORN Auction Platform — Technical Specification

> **URL**: `https://auction.zyborn.com/`  
> **Purpose**: Live auction platform for WORLD's FIRST CANNED BTC  
> **Integration**: BidJS (https://bidjs.com/)  
> **Primary KPI**: Successful bids & Bidder registrations  
> **Version**: 1.0

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                     AUCTION.ZYBORN.COM                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │   ZYBORN UI     │───▶│     BidJS       │───▶│   SUPABASE     │  │
│  │   (Frontend)    │    │   (Auction)     │    │   (Data)       │  │
│  └─────────────────┘    └─────────────────┘    └────────────────┘  │
│         │                       │                      │            │
│    Custom branding         Bidding logic          User records     │
│    Landing page            Real-time updates      Bid history      │
│    Navigation              Payment processing     Analytics        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## BIDJS INTEGRATION

### What BidJS Provides

BidJS is a white-label auction software that handles:
- Bidder registration and verification
- Real-time bidding engine
- Automatic bid increments
- Auction countdown timers
- Payment processing integration
- Bid history and audit logs
- Mobile-responsive bidding interface

### Integration Approach

**Option A: Embedded Widget** (Recommended for Phase 1)
- BidJS provides an embeddable widget
- ZYBORN maintains custom header/footer
- BidJS handles all auction logic

**Option B: Full White-Label** (Phase 2)
- Complete BidJS instance customized to ZYBORN
- Full control over all pages
- Requires BidJS enterprise agreement

---

## DESIGN SYSTEM

### Brand Consistency

The auction platform inherits ZYBORN Brand Kit v1.0 for:
- Navigation header
- Footer
- Color palette
- Typography
- Button styles

### Auction-Specific Elements

BidJS components will be styled to match:
```css
/* BidJS Override Variables */
:root {
  --bidjs-primary: #F6931B;        /* Bitcoin Orange */
  --bidjs-background: #000000;     /* Black */
  --bidjs-text: #FFFFFF;           /* White */
  --bidjs-accent: #2A2A2A;         /* Steel-900 */
  --bidjs-font: 'Space Grotesk', sans-serif;
  --bidjs-mono: 'IBM Plex Mono', monospace;
}
```

---

## PAGE STRUCTURE

### Page 1: Auction Landing (`/`)

```
NAVIGATION
├── ZYBORN Logo → zyborn.com
├── How It Works
├── Lot Details
├── Register to Bid
└── FAQ

AUCTION HERO
├── Countdown Timer (BidJS)
├── Current Bid Display (BidJS)
└── "REGISTER TO BID" CTA

LOT DETAILS
├── Artwork Images (Gallery)
├── Title: WORLD's FIRST CANNED BTC
├── Artist: ZYBORN
├── Estimate: $1,000,000 USD
├── Starting Bid: TBD
└── Full Description

AUCTION INFO
├── Auction Type: Timed Online
├── Opens: 24 December 2025, 00:00 GMT
├── Closes: 3 January 2026, 23:59 GMT
├── Bid Increments Table
└── Buyer's Premium: TBD%

HOW TO BID
├── Step 1: Register
├── Step 2: Verify Identity
├── Step 3: Place Bid
└── Step 4: Win & Pay

AUTHENTICITY
├── Certificate Details
├── NFC Verification
├── Provenance
└── Condition Report

TERMS & CONDITIONS
├── Payment Terms
├── Shipping & Insurance
├── Buyer's Premium
└── Legal Disclaimers

FOOTER
```

### Page 2: Registration (`/register`)

*Handled by BidJS with ZYBORN header/footer*

### Page 3: Bidding Interface (`/lot/1`)

*Handled by BidJS with ZYBORN branding*

---

## SECTION 1: NAVIGATION

**Layout**: Same height and structure as main site

**Logo**: Links to `https://zyborn.com/` (main site)

**Menu Items**:
1. How It Works → `#how-to-bid`
2. Lot Details → `#lot`
3. FAQ → `#faq`
4. Contact → `mailto:auction@zyborn.com`

**CTA Button**:
- Text: "REGISTER TO BID"
- Style: `.btn-primary`
- Link: BidJS registration flow

---

## SECTION 2: AUCTION HERO

**ID**: `#hero`

### Layout
- Background: `var(--color-black)`
- Two columns: Info (55%) | Countdown (45%)
- Height: 80vh
- Padding: 80px vertical

### Left Column: Auction Info

**Pre-headline** (Meta, orange):
```
TIMED ONLINE AUCTION
```

**Headline** (H1):
```
WORLD's FIRST CANNED BTC
```

**Artist** (H3):
```
by ZYBORN
```

**Estimate Display** (Large, prominent):
```
Estimate: $1,000,000 USD
```

### Right Column: BidJS Widget

**Contains**:
- Countdown Timer (Days : Hours : Minutes : Seconds)
- Current Bid Display
- "REGISTER TO BID" or "PLACE BID" button
- Bid Increment Info

**BidJS Widget Embed**:
```html
<div id="bidjs-countdown-widget" 
     data-auction-id="ZYBORN-001"
     data-theme="dark">
</div>
```

---

## SECTION 3: LOT DETAILS

**ID**: `#lot`

### Layout
- Background: `var(--color-steel-900)`
- Two columns: Gallery (50%) | Specs (50%)
- Padding: 80px vertical

### Left Column: Image Gallery

**Primary Image**: `canned_btc.jpg`

**Thumbnails** (clickable):
- Front view
- Back view
- Detail shot
- Label close-up
- With scale reference

**Features**:
- Lightbox on click
- Zoom capability
- Mobile swipe gallery

### Right Column: Specifications

**Title** (H2):
```
Lot Details
```

**Specification Table**:

| Label | Value |
|-------|-------|
| Lot Number | 1 |
| Title | WORLD's FIRST CANNED BTC SINCE 2009.01.03 |
| Artist | ZYBORN |
| Year | 2025 |
| Medium | Metal can, cold wallet, NFC chip |
| Dimensions | 10.8 × 7.50 cm |
| Edition | 1 of 21 (unique contents) |
| Condition | Excellent, sealed |

**Included with Lot**:
- ✓ Original signed artwork
- ✓ Certificate of authenticity
- ✓ BTC Cold wallet (Ledger)
- ✓ NFC chip linked to digital record
- ✓ User manual
- ✓ Presentation case

---

## SECTION 4: AUCTION INFORMATION

**ID**: `#auction-info`

### Layout
- Background: `var(--color-black)`
- Three columns: Dates | Bidding | Terms
- Padding: 80px vertical

### Column 1: Important Dates

**Title** (H3):
```
Auction Schedule
```

| Event | Date/Time |
|-------|-----------|
| Auction Opens | 24 Dec 2025, 00:00 GMT |
| Auction Closes | 3 Jan 2026, 23:59 GMT |
| Exhibition | 3 Jan 2026, London |
| Payment Deadline | 7 days after close |

### Column 2: Bidding Rules

**Title** (H3):
```
How Bidding Works
```

**Content**:
```
This is a timed online auction. Place your maximum bid and 
the system will bid automatically on your behalf up to your 
maximum. If outbid, you'll receive instant notification.

The auction features a soft close: any bid in the final 
5 minutes extends the auction by 5 minutes.
```

**Bid Increments**:

| Current Bid | Increment |
|-------------|-----------|
| $0 - $9,999 | $500 |
| $10,000 - $49,999 | $1,000 |
| $50,000 - $99,999 | $2,500 |
| $100,000 - $499,999 | $5,000 |
| $500,000+ | $10,000 |

### Column 3: Payment Terms

**Title** (H3):
```
Payment & Delivery
```

**Content**:
```
Buyer's Premium: 15%

Accepted Payment Methods:
• Bank wire transfer
• Bitcoin (BTC)
• Ethereum (ETH)

Shipping: Worldwide insured delivery included.
Collection: Available at London exhibition.
```

---

## SECTION 5: HOW TO BID

**ID**: `#how-to-bid`

### Layout
- Background: `var(--color-steel-100)`
- Text: dark
- Four-step horizontal flow (vertical on mobile)
- Padding: 80px vertical

### Section Header

**Title** (H2):
```
How to Bid
```

### Steps

**Step 1: Register**
- Icon: User icon
- Title: "Create Account"
- Description: "Register with your email and create a secure password."

**Step 2: Verify**
- Icon: Shield icon
- Title: "Verify Identity"
- Description: "Complete ID verification to qualify for bidding."

**Step 3: Bid**
- Icon: Gavel icon
- Title: "Place Your Bid"
- Description: "Enter your maximum bid. We'll bid automatically up to your limit."

**Step 4: Win**
- Icon: Trophy icon
- Title: "Win & Collect"
- Description: "Highest bidder wins. Complete payment within 7 days."

### CTA
- Text: "REGISTER NOW"
- Style: `.btn-primary`
- Link: BidJS registration

---

## SECTION 6: AUTHENTICITY & PROVENANCE

**ID**: `#authenticity`

### Layout
- Background: `var(--color-black)`
- Centered content, max-width 900px
- Padding: 80px vertical

### Content

**Title** (H2):
```
Authenticity Guaranteed
```

**Body**:
```
Every WORLD's FIRST CANNED BTC comes with:
```

**Authenticity Items**:

1. **Signed Certificate**
   - Hand-signed by ZYBORN
   - Holographic seal
   - Unique serial number

2. **NFC Verification**
   - Tap to verify authenticity
   - Links to blockchain record
   - Tamper-evident

3. **Notarized Documentation**
   - Witnessed by NotaryPublic.London
   - Legal provenance chain
   - Insurance valuation

4. **Condition Report**
   - Professional assessment
   - Photographic documentation
   - Sealed integrity confirmed

---

## SECTION 7: FAQ

**ID**: `#faq`

### Layout
- Background: `var(--color-steel-900)`
- Accordion-style expandable questions
- Padding: 80px vertical

### Questions

**Q1: How do I register to bid?**
```
Click "Register to Bid" and complete the registration form. 
You'll need to verify your identity before placing a bid.
```

**Q2: What payment methods are accepted?**
```
We accept bank wire transfer, Bitcoin (BTC), and Ethereum (ETH). 
Payment is due within 7 days of winning.
```

**Q3: Is there a buyer's premium?**
```
Yes, a 15% buyer's premium is added to the hammer price.
```

**Q4: Can I view the artwork before bidding?**
```
Yes, the artwork will be on display at our London exhibition 
on 3 January 2026. Contact us for private viewing arrangements.
```

**Q5: How will the artwork be shipped?**
```
Worldwide insured shipping is included. The artwork will be 
shipped in a custom protective case via secure courier.
```

**Q6: What happens if I'm outbid?**
```
You'll receive instant email and SMS notification. You can 
increase your bid at any time until the auction closes.
```

**Q7: What's the soft close feature?**
```
Any bid placed in the final 5 minutes automatically extends 
the auction by 5 minutes, ensuring fair competition.
```

---

## SECTION 8: FOOTER

**ID**: `#footer`

### Layout
- Background: `var(--color-black)`
- Same structure as main site footer
- Additional legal links for auction

### Additional Links
- Auction Terms & Conditions
- Privacy Policy
- Bidder Agreement

### Contact
```
Auction Inquiries: auction@zyborn.com
```

---

## BIDJS CONFIGURATION

### Required BidJS Settings

```javascript
// BidJS Configuration
const bidjsConfig = {
  apiKey: 'YOUR_BIDJS_API_KEY',
  auctionId: 'ZYBORN-CANNED-BTC-001',
  theme: {
    primaryColor: '#F6931B',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    fontFamily: 'Space Grotesk, sans-serif',
  },
  features: {
    softClose: true,
    softCloseMinutes: 5,
    autobid: true,
    proxyBidding: true,
    instantNotifications: true,
  },
  payment: {
    acceptedMethods: ['wire', 'btc', 'eth'],
    buyersPremium: 0.15,
    currency: 'USD',
  }
};
```

### Widget Embed Locations

1. **Countdown Widget**: Hero section
2. **Bid Form**: Lot details page
3. **Registration Modal**: CTA buttons

---

## TECHNICAL REQUIREMENTS

### Vercel Configuration

**vercel.json**:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "frame-ancestors 'self' https://bidjs.com https://*.bidjs.com"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        }
      ]
    }
  ]
}
```

### DNS Requirements

Add CNAME record in GoDaddy:
```
Type: CNAME
Name: auction
Value: cname.vercel-dns.com
TTL: 600
```

---

## FILE STRUCTURE

```
zyborn-auction/
├── public/
│   ├── index.html              # Auction landing page
│   ├── css/
│   │   └── auction.css         # Auction-specific styles
│   ├── js/
│   │   ├── bidjs-config.js     # BidJS configuration
│   │   └── auction.js          # Custom auction scripts
│   └── images/
│       ├── lot/
│       │   ├── front.jpg
│       │   ├── back.jpg
│       │   └── detail.jpg
│       └── icons/
│           └── [step icons]
├── vercel.json
└── README.md
```

---

## IMPLEMENTATION PHASES

### Phase 1: Static Landing (Now)
- Create auction.zyborn.com with landing page
- "Coming Soon" / "Register Interest" functionality
- Link to main site's email capture

### Phase 2: BidJS Integration (Before Dec 24)
- Complete BidJS setup
- Embed auction widgets
- Test bidding flow
- Configure payment processing

### Phase 3: Go Live (Dec 24)
- Enable live bidding
- Activate notifications
- Monitor real-time

---

## SEO & META

**Page Title**:
```
Auction | WORLD's FIRST CANNED BTC by ZYBORN
```

**Meta Description**:
```
Bid on WORLD's FIRST CANNED BTC, an original artwork by ZYBORN. 
Timed online auction Dec 24, 2025 - Jan 3, 2026. Estimate: $1M USD.
```

---

## CHANGELOG

| Version | Date | Change | Status |
|---------|------|--------|--------|
| 1.0 | Dec 2025 | Initial specification | Draft |

---

## NEXT STEPS

1. [ ] Contact BidJS for API credentials
2. [ ] Set up auction.zyborn.com DNS
3. [ ] Create Vercel project: zyborn-auction
4. [ ] Build Phase 1 landing page
5. [ ] Integrate BidJS widgets
6. [ ] Test end-to-end bidding flow
7. [ ] Configure payment processing
8. [ ] Launch Dec 24, 2025
