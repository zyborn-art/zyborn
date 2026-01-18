# ZYBORN Eleventy Implementation Plan

> **Document Version**: 1.0  
> **Created**: January 18, 2026  
> **Repository**: `C:\GitHub\zyborn`  
> **Hosting**: Vercel  
> **Status**: Planning Complete - Ready for Phase A

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Scope & Requirements](#scope--requirements)
3. [What This Enables](#what-this-enables)
4. [Widget Types Reference](#widget-types-reference)
5. [Live Preview Architecture](#live-preview-architecture)
6. [Relations System](#relations-system)
7. [Phase A: Core Eleventy Setup](#phase-a-core-eleventy-setup)
8. [Phase B: Dynamic Sections](#phase-b-dynamic-sections)
9. [Phase C: Live Preview](#phase-c-live-preview)
10. [Phase D: Relations & Polish](#phase-d-relations--polish)
11. [Questions to Answer Before Building](#questions-to-answer-before-building)
12. [Current State Reference](#current-state-reference)

---

## Executive Summary

### Objective

Implement Eleventy static site generator to enable full content flexibility for zyborn.com. This allows partner to add/remove sections, create new pages, manage dynamic lists (galleries, downloads), and see live preview before publishing.

### Current State

- ✅ Decap CMS installed and working (`zyborn.com/admin`)
- ✅ GitHub OAuth authentication working
- ✅ JSON-only quick edit working (text changes go live in ~60 sec)
- ✅ Phase 2 content collections exist (Markdown files)
- ❌ No build process connecting Markdown to HTML
- ❌ No dynamic sections (HTML structure is fixed)
- ❌ No live preview

### Target State

- ✅ Eleventy generates HTML from templates + content
- ✅ Partner can add/remove/reorder sections
- ✅ Partner can create new pages from CMS
- ✅ Dynamic lists (galleries, downloads, team members)
- ✅ Live preview in CMS editor
- ✅ Relations between content types

---

## Scope & Requirements

### Included Features

| Feature | Priority | Notes |
|---------|----------|-------|
| Core Eleventy Templating | Must Have | Add/remove sections, new pages, dynamic lists |
| All Widget Types | Must Have | string, text, markdown, number, boolean, datetime, select, image, file, list, object, relation, color, map, code, hidden |
| Live Preview | Must Have | See changes before publishing |
| Relations Between Content | Must Have | Link exhibitions ↔ auction items ↔ press releases |

### Excluded Features

| Feature | Reason |
|---------|--------|
| Editorial Workflow | Only one user (partner), no approval needed |
| External Media Services | Built-in uploads sufficient |
| Multi-language (i18n) | English only |
| Custom Editor Components | Standard widgets sufficient |
| Role-Based Access | Single user |

---

## What This Enables

### Page Management

| Action | How It Works |
|--------|--------------|
| Create new page | Click "New" in Pages collection → fill fields → publish → page exists |
| Delete page | Delete the content file → page disappears |
| Reorder sections | Drag/drop in list widget → order changes on site |

### Section Management (on any page)

```yaml
# Partner sees in CMS:
sections:
  - type: "hero"
    headline: "..."
    image: "..."
  - type: "text_block"
    content: "..."
  - type: "gallery"
    images: [...]
  - type: "cta"
    button_text: "..."
```

Partner can:
- Add new section (click "+")
- Remove section (click "×")
- Reorder sections (drag)
- Change section type (dropdown)

Template renders whatever sections exist.

### Dynamic Lists

| Content Type | Partner Can |
|--------------|-------------|
| Gallery images | Add/remove images, reorder, add captions |
| Downloads | Add/remove files, change labels |
| Team members | Add/remove people, update bios |
| Press releases | Create new, archive old |
| Exhibitions | Add future events, mark past ones |
| Charity partners | Add new logos, remove old ones |

---

## Widget Types Reference

### Text Widgets

| Widget | What It Does | Example Use |
|--------|--------------|-------------|
| `string` | Single line text | Titles, names |
| `text` | Multi-line text | Descriptions |
| `markdown` | Rich text editor with formatting | Blog posts, essays |
| `code` | Code editor with syntax highlighting | Embed scripts |

### Data Widgets

| Widget | What It Does | Example Use |
|--------|--------------|-------------|
| `number` | Numeric input with min/max/step | Prices, quantities |
| `boolean` | Toggle on/off | "Show section?" |
| `datetime` | Date & time picker | Event dates |
| `select` | Dropdown menu | Status (live/closed/coming soon) |
| `color` | Color picker | Brand colors |
| `hidden` | Not shown to editor | Layout type, internal IDs |

### Media Widgets

| Widget | What It Does | Example Use |
|--------|--------------|-------------|
| `image` | Image upload + preview | Photos, logos |
| `file` | Any file upload | PDFs, ZIPs |
| `map` | Location picker | Venue coordinates |

### Structure Widgets

| Widget | What It Does | Example Use |
|--------|--------------|-------------|
| `list` | Repeatable items | Gallery images, team members |
| `object` | Grouped fields | Address (street, city, country) |
| `relation` | Link to other content | "Related exhibitions" |

### Widget Examples in CMS

**Color Picker:**
```
┌──────────────────────────┐
│ Accent Color             │
│ ┌────┐                   │
│ │████│  #F6931B          │
│ └────┘                   │
│ [Pick Color]             │
└──────────────────────────┘
```

**Map Widget:**
```
┌──────────────────────────┐
│ Exhibition Venue         │
│ ┌──────────────────────┐ │
│ │    [Google Map]      │ │
│ │        📍            │ │
│ └──────────────────────┘ │
│ Lat: 51.5074            │
│ Lng: -0.1278            │
└──────────────────────────┘
```

**Boolean Widget:**
```
┌──────────────────────────┐
│ Show Auction Banner      │
│                          │
│ ○ Off  ● On              │
│                          │
└──────────────────────────┘
```

---

## Live Preview Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      DECAP CMS EDITOR                            │
├────────────────────────────┬────────────────────────────────────┤
│                            │                                     │
│   EDIT PANEL               │   PREVIEW PANEL                     │
│                            │                                     │
│   Headline: [World's...]   │   ┌─────────────────────────────┐  │
│                            │   │                             │  │
│   Subheadline: [Zyborn's.. │   │   WORLD'S FIRST             │  │
│                            │   │   CANNED BTC                │  │
│   [+ Add Section]          │   │                             │  │
│                            │   │   Zyborn's debut project... │  │
│                            │   │                             │  │
│                            │   └─────────────────────────────┘  │
│                            │                                     │
│   [Publish]                │   Updates in real-time as you type │
└────────────────────────────┴────────────────────────────────────┘
```

### How It Works

1. Eleventy runs in "dev mode" on Vercel (or local)
2. Decap CMS sends draft content to preview endpoint
3. Eleventy renders page with draft content
4. Preview panel shows rendered result
5. Partner sees exactly how it will look before publishing

### Technical Requirements

- Preview API endpoint (`/api/preview`)
- Eleventy serverless functions or on-demand builders
- Decap CMS preview configuration in `config.yml`

---

## Relations System

### Current Collections

- **Exhibitions** (London 2026, etc.)
- **Auction Items** (Survival Rations, etc.)
- **Press Releases** (news articles)
- **Pages** (Home, Curatorial, Press)

### Relation Configuration Example

```yaml
# In Auction Item:
- label: "Related Exhibition"
  name: "exhibition"
  widget: "relation"
  collection: "exhibitions"
  search_fields: ["title"]
  value_field: "slug"
  display_fields: ["title"]

# In Press Release:
- label: "About Artwork"
  name: "artwork"
  widget: "relation"
  collection: "auction_items"
  search_fields: ["title"]
  value_field: "slug"
  display_fields: ["title"]
```

### What Partner Sees

When editing an **Auction Item**:
```
Related Exhibition: [Dropdown: London 2026 ▼]
```

When editing a **Press Release**:
```
About Artwork: [Dropdown: Survival Rations ▼]
Related Exhibition: [Dropdown: London 2026 ▼]
```

### What Shows on Website

- Exhibition page → "Auction items in this exhibition" section (automatic)
- Press release → "Related to: Survival Rations" link
- Artwork page → "Press coverage" section with linked articles

---

## Phase A: Core Eleventy Setup

### Duration
2-3 hours

### Prerequisites
- Current zyborn repo with Decap CMS working
- Node.js installed locally
- Access to Vercel dashboard

### Objectives
- Install Eleventy
- Create base templates
- Migrate current HTML to templates
- Configure build process
- Test local → deploy

### Tasks

#### A.1: Initialize Eleventy

```bash
cd C:\GitHub\zyborn
npm install @11ty/eleventy --save-dev
npm install markdown-it --save-dev
npm install luxon --save-dev
```

#### A.2: Create Eleventy Configuration

Create `.eleventy.js` in project root.

#### A.3: Create Directory Structure

```
C:\GitHub\zyborn\
├── _includes/
│   ├── layouts/
│   │   ├── base.njk          # Base HTML wrapper
│   │   ├── page.njk          # Standard page layout
│   │   └── home.njk          # Home page layout
│   └── partials/
│       ├── nav.njk           # Navigation
│       ├── footer.njk        # Footer
│       └── sections/         # Section templates
│           ├── hero.njk
│           ├── text-block.njk
│           ├── gallery.njk
│           └── cta.njk
├── _data/                    # Global data files
│   └── site.json
├── content/                  # Already exists (Markdown files)
├── public/                   # Static assets (already exists)
└── _site/                    # Output directory (generated)
```

#### A.4: Create Base Template

File: `_includes/layouts/base.njk`

```njk
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ title }} — ZYBORN ART</title>
    <meta name="description" content="{{ meta_description }}">
    <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
    {% include "partials/nav.njk" %}
    
    <main>
        {{ content | safe }}
    </main>
    
    {% include "partials/footer.njk" %}
    
    <script src="/js/main.js"></script>
    <script src="/js/content-loader.js"></script>
</body>
</html>
```

#### A.5: Update package.json Scripts

```json
{
  "scripts": {
    "build": "eleventy",
    "dev": "eleventy --serve",
    "start": "eleventy --serve",
    "debug": "DEBUG=Eleventy* eleventy"
  }
}
```

#### A.6: Update Vercel Configuration

Update `vercel.json` to use Eleventy build output.

### Verification Checklist

- [ ] `npm run dev` starts local server
- [ ] Pages render correctly from templates
- [ ] CSS and JS still load
- [ ] Images display correctly
- [ ] Forms still work
- [ ] `npm run build` generates `_site` folder
- [ ] Deploy to Vercel succeeds
- [ ] Live site looks identical to before

### Phase A Handoff Template

```
PHASE A COMPLETE - Ready for Phase B

Completed:
- Eleventy installed and configured
- Base templates created
- Current HTML migrated to templates
- Build process working
- Deployed to Vercel

Files created:
- .eleventy.js
- _includes/layouts/base.njk
- _includes/layouts/page.njk
- _includes/partials/nav.njk
- _includes/partials/footer.njk
- _data/site.json

Next: Phase B - Dynamic Sections
```

---

## Phase B: Dynamic Sections

### Duration
2-3 hours

### Prerequisites
- Phase A complete
- Eleventy building and deploying successfully

### Objectives
- Create section type system
- Enable add/remove/reorder sections
- Configure all widget types in CMS
- Update templates to render dynamic sections

### Tasks

#### B.1: Define Section Types

Create section templates in `_includes/partials/sections/`:

| Section Type | File | Purpose |
|--------------|------|---------|
| `hero` | `hero.njk` | Image + headline + CTA |
| `text_block` | `text-block.njk` | Rich text content |
| `gallery` | `gallery.njk` | Grid of images |
| `cta` | `cta.njk` | Call to action button |
| `video` | `video.njk` | Embedded video |
| `quote` | `quote.njk` | Testimonial/quote |
| `stats` | `stats.njk` | Numbers/statistics |
| `downloads` | `downloads.njk` | File download list |

#### B.2: Create Section Renderer

File: `_includes/partials/sections.njk`

```njk
{% for section in sections %}
  {% if section.type == "hero" %}
    {% include "partials/sections/hero.njk" %}
  {% elif section.type == "text_block" %}
    {% include "partials/sections/text-block.njk" %}
  {% elif section.type == "gallery" %}
    {% include "partials/sections/gallery.njk" %}
  {# ... etc ... #}
  {% endif %}
{% endfor %}
```

#### B.3: Update CMS Config for Sections

Add to `public/admin/config.yml`:

```yaml
- label: "Sections"
  name: "sections"
  widget: "list"
  types:
    - label: "Hero"
      name: "hero"
      fields:
        - { label: "Headline", name: "headline", widget: "string" }
        - { label: "Subheadline", name: "subheadline", widget: "text" }
        - { label: "Image", name: "image", widget: "image" }
        - { label: "CTA Text", name: "cta_text", widget: "string" }
        - { label: "CTA Link", name: "cta_link", widget: "string" }
    
    - label: "Text Block"
      name: "text_block"
      fields:
        - { label: "Content", name: "content", widget: "markdown" }
    
    - label: "Gallery"
      name: "gallery"
      fields:
        - { label: "Title", name: "title", widget: "string" }
        - label: "Images"
          name: "images"
          widget: "list"
          fields:
            - { label: "Image", name: "src", widget: "image" }
            - { label: "Caption", name: "caption", widget: "string" }
    
    # ... more section types ...
```

#### B.4: Add All Widget Types

Ensure config.yml includes examples of:
- `color` widget for brand colors
- `map` widget for venue locations
- `code` widget for embed scripts
- `boolean` widget for show/hide toggles
- `number` widget with validation
- `relation` widget for linking content

### Verification Checklist

- [ ] Partner can add new section in CMS
- [ ] Partner can remove section in CMS
- [ ] Partner can reorder sections (drag/drop)
- [ ] All section types render correctly
- [ ] Color picker works
- [ ] Map widget works
- [ ] Boolean toggles show/hide sections
- [ ] Changes publish and appear on site

### Phase B Handoff Template

```
PHASE B COMPLETE - Ready for Phase C

Completed:
- Section type system implemented
- 8 section types available
- Add/remove/reorder working
- All widget types configured

Section types available:
- Hero
- Text Block
- Gallery
- CTA
- Video
- Quote
- Stats
- Downloads

Next: Phase C - Live Preview
```

---

## Phase C: Live Preview

### Duration
1-2 hours

### Prerequisites
- Phase A and B complete
- Dynamic sections working

### Objectives
- Configure preview endpoint
- Connect Decap CMS to preview
- Test preview functionality

### Tasks

#### C.1: Create Preview API Endpoint

File: `api/preview.js`

```javascript
// Vercel serverless function for Eleventy preview
export default async function handler(req, res) {
  // Receive draft content from Decap CMS
  // Run Eleventy to generate preview
  // Return rendered HTML
}
```

#### C.2: Configure Decap CMS Preview

Add to `public/admin/config.yml`:

```yaml
# Preview settings
show_preview_links: true

# Preview deployment
site_url: https://zyborn.com
display_url: https://zyborn.com

# Preview path template
preview_path: "{{slug}}"
```

#### C.3: Add Preview Styles

Ensure preview iframe loads correct CSS.

### Verification Checklist

- [ ] Preview panel appears in CMS editor
- [ ] Changes appear in preview as partner types
- [ ] Preview shows correct styling
- [ ] Images display in preview
- [ ] Preview works for all page types

### Phase C Handoff Template

```
PHASE C COMPLETE - Ready for Phase D

Completed:
- Preview API endpoint created
- Decap CMS preview configured
- Real-time preview working

Partner can now:
- See changes instantly before publishing
- Preview all section types
- Preview new pages before creating

Next: Phase D - Relations & Polish
```

---

## Phase D: Relations & Polish

### Duration
1-2 hours

### Prerequisites
- Phases A, B, C complete
- Live preview working

### Objectives
- Configure relations between collections
- Update templates to show related content
- Final testing and polish

### Tasks

#### D.1: Configure Relation Fields

Update `public/admin/config.yml`:

```yaml
# In auction_items collection:
- label: "Related Exhibition"
  name: "exhibition"
  widget: "relation"
  collection: "exhibitions"
  search_fields: ["title"]
  value_field: "slug"
  display_fields: ["title"]

# In press_releases collection:
- label: "Related Artwork"
  name: "artwork"
  widget: "relation"
  collection: "auction_items"
  search_fields: ["title"]
  value_field: "slug"
  display_fields: ["title"]
  required: false

- label: "Related Exhibition"
  name: "exhibition"
  widget: "relation"
  collection: "exhibitions"
  search_fields: ["title"]
  value_field: "slug"
  display_fields: ["title"]
  required: false
```

#### D.2: Create Related Content Templates

File: `_includes/partials/related-items.njk`

```njk
{% if relatedItems.length > 0 %}
<section class="related-items">
  <h3>Related</h3>
  <ul>
    {% for item in relatedItems %}
    <li><a href="{{ item.url }}">{{ item.title }}</a></li>
    {% endfor %}
  </ul>
</section>
{% endif %}
```

#### D.3: Update Page Templates

Add related content sections to:
- Exhibition pages → show related auction items
- Auction item pages → show related press coverage
- Press release pages → show related artwork/exhibition links

#### D.4: Final Testing

- Test all page types
- Test all section types
- Test relations in both directions
- Test on mobile
- Test form submissions
- Test full publish workflow

### Verification Checklist

- [ ] Relations dropdown shows correct options
- [ ] Related items display on pages
- [ ] Bidirectional relations work
- [ ] All existing content still renders
- [ ] Mobile layout correct
- [ ] Forms still submit
- [ ] No console errors
- [ ] Performance acceptable

### Phase D Handoff Template

```
PHASE D COMPLETE - Eleventy Implementation Done

Full capabilities now available:
✅ Add/remove/reorder sections
✅ Create new pages from CMS
✅ Dynamic galleries
✅ Dynamic download lists
✅ Live preview before publishing
✅ Relations between content types
✅ All widget types (color, map, code, etc.)

Partner training needed:
- How to add sections
- How to create new pages
- How to use live preview
- How to link related content
```

---

## Questions to Answer Before Building

### Section Types

**What types of sections should be available?**

| Section Type | Include? | Notes |
|--------------|----------|-------|
| Hero (image + headline) | ? | |
| Text block (paragraphs) | ? | |
| Gallery (grid of images) | ? | |
| CTA (button with text) | ? | |
| Video embed | ? | |
| Quote/testimonial | ? | |
| Stats/numbers | ? | |
| Downloads (file list) | ? | |
| Team/people grid | ? | |
| Logo grid (partners) | ? | |
| FAQ accordion | ? | |
| Contact form | ? | |
| Map | ? | |
| Other: _____________ | ? | |

### Dynamic Section Pages

**Which pages need dynamic sections?**

| Page | Dynamic Sections? | Notes |
|------|-------------------|-------|
| Main page (zyborn.com) | ? | |
| Curatorial page | ? | |
| Press page | ? | |
| Future exhibition pages | ? | |
| Future blog/news pages | ? | |

### New Page Types

**What new page types might partner create?**

| Page Type | Needed? | Notes |
|-----------|---------|-------|
| Blog posts | ? | |
| Event announcements | ? | |
| Artist statements | ? | |
| Project documentation | ? | |
| Other: _____________ | ? | |

---

## Current State Reference

### Repository Structure

```
C:\GitHub\zyborn\
├── api/
│   ├── auth/
│   │   ├── callback.js       # GitHub OAuth callback
│   │   └── index.js          # GitHub OAuth entry
│   ├── subscribe.js          # Email subscription
│   └── ...
├── content/
│   ├── settings/
│   │   └── global.json       # Site settings
│   ├── pages/
│   │   ├── home.md           # Home page content
│   │   ├── curatorial.md     # Curatorial essay
│   │   └── press.md          # Press page
│   ├── exhibition/
│   │   └── london-2026.md    # Exhibition content
│   ├── auction/
│   │   └── survival-rations.md
│   └── press-releases/
│       └── .gitkeep
├── public/
│   ├── admin/
│   │   ├── index.html        # Decap CMS interface
│   │   └── config.yml        # CMS configuration
│   ├── data/
│   │   └── content.json      # Quick edit JSON
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── main.js
│   │   └── content-loader.js # JSON → DOM loader
│   ├── images/
│   └── index.html            # Current static HTML
├── vercel.json
└── package.json
```

### Working Features

- ✅ Decap CMS at `/admin`
- ✅ GitHub OAuth authentication
- ✅ Quick Edit (JSON-only) for text changes
- ✅ All Phase 2 collections in CMS
- ✅ Media uploads
- ✅ Email subscription API
- ✅ NFC verification API

### Technology Stack

| Component | Technology |
|-----------|------------|
| CMS | Decap CMS 3.x |
| Hosting | Vercel |
| Database | Supabase (for subscriptions) |
| Auth (CMS) | GitHub OAuth |
| Email | Resend |
| Version Control | GitHub |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 18, 2026 | Claude | Initial plan |

---

## Next Steps

1. **Answer the questions** in "Questions to Answer Before Building"
2. **Schedule Phase A** - Set aside 2-3 hours of focused time
3. **Start new chat** - Use Phase A section as reference
4. **Complete each phase** - Verify checklist before moving to next
