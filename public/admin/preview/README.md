# ZYBORN CMS Preview System

## Overview

This folder contains the **modular preview system** for Decap CMS. It provides pixel-perfect live previews of all page types and 26 section types in the CMS admin interface.

**Location:** `/public/admin/preview/`  
**Admin URL:** `zyborn.com/admin`

---

## Architecture

The preview system is split into **6 modular files** for easier debugging and maintenance:

```
/public/admin/
├── config.yml              ← CMS configuration (collections, fields)
├── index.html              ← Loads Decap CMS + preview modules
└── preview/
    ├── README.md           ← This file
    ├── styles.css          ← All preview CSS (28 KB)
    ├── utils.js            ← Utility functions (3 KB)
    ├── sections.js         ← 26 section renderers (35 KB)
    ├── page-wrapper.js     ← Header/footer wrapper (3 KB)
    ├── templates.js        ← 4 page templates (13 KB)
    └── register.js         ← CMS registration (2 KB)
```

---

## Load Order (Critical!)

Files must load in this exact order in `index.html`:

```html
<script src="/admin/preview/utils.js"></script>       <!-- 1. Utilities first -->
<script src="/admin/preview/sections.js"></script>    <!-- 2. Section renderers -->
<script src="/admin/preview/page-wrapper.js"></script><!-- 3. Page wrapper -->
<script src="/admin/preview/templates.js"></script>   <!-- 4. Page templates -->
<script src="/admin/preview/register.js"></script>    <!-- 5. CMS registration last -->
```

All modules attach to `window.ZybornPreview` global object.

---

## File Descriptions

### `styles.css` (28 KB)
All CSS for preview rendering. Loaded via `CMS.registerPreviewStyle()`.

**Contains:**
- Page wrapper styles (header, footer, layout)
- All 26 section type styles
- Shared components (buttons, forms, empty states)
- Page-specific styles (curatorial, press, custom)

**To debug CSS:** Open browser DevTools → Sources → Find `styles.css`

---

### `utils.js` (3 KB)
Core utility functions used by all other modules.

**Exports:**
- `get(entry, path, default)` - Safe data extraction from CMS entry
- `toArray(immutableList)` - Convert Immutable.js to array
- `markdownToHtml(md)` - Basic markdown conversion
- `escapeHtml(str)` - XSS protection
- `generateId()` - Unique ID generator
- `getVideoEmbedUrl(url)` - YouTube/Vimeo URL parsing

---

### `sections.js` (35 KB)
All 26 section type renderers. This is the largest file.

**Section Types:**
| Phase 2 (Core) | Phase 3 (Media) | Phase 4 (Advanced) |
|----------------|-----------------|-------------------|
| hero | gallery | two_column |
| curator | cta | feature_grid |
| artwork | video | timeline |
| auction | quote | team |
| email_capture | stats | logo_grid |
| charity | downloads | map |
| thanks | spacer | image_text |
| text_block | divider | custom_html |
| | | accordion |
| | | countdown |

**Main export:** `renderSection(section)` - Routes to correct renderer

---

### `page-wrapper.js` (3 KB)
Wraps page content with header and footer.

**Export:** `PageWrapper(content, options)`

**Options:**
- `showHeader` (boolean, default: true)
- `showFooter` (boolean, default: true)
- `pageClass` (string, e.g., 'preview-page--home')

---

### `templates.js` (13 KB)
Page-level preview templates using React's `createClass`.

**Templates:**
- `HomePreview` - Home page with sections
- `CuratorialPreview` - Curatorial essay pages
- `PressPreview` - Press/media page
- `CustomPagePreview` - Generic pages (sections or markdown)

---

### `register.js` (2 KB)
Final registration with Decap CMS.

**Registers:**
- Preview styles via `CMS.registerPreviewStyle()`
- Templates via `CMS.registerPreviewTemplate()`

---

## Debugging Guide

### Check if modules loaded
Open browser console at `/admin`. You should see:
```
[ZYBORN Preview] Utils loaded
[ZYBORN Preview] Sections loaded (26 types)
[ZYBORN Preview] PageWrapper loaded
[ZYBORN Preview] Templates loaded (home, curatorial, press, custom_pages)
[ZYBORN Preview] ✓ All modules loaded and registered
```

### Common issues

| Issue | Cause | Fix |
|-------|-------|-----|
| Preview blank | JS error in module | Check console for errors |
| Styles missing | CSS not loading | Verify `styles.css` path |
| Section unstyled | Missing CSS class | Add styles to `styles.css` |
| Template not found | Registration failed | Check `register.js` |
| Data not showing | Wrong field path | Debug with `console.log(entry.toJS())` |

### Test specific section
```javascript
// In browser console
ZybornPreview.renderHero({ headline: 'Test', subheadline: 'Testing' })
```

### Test page wrapper
```javascript
ZybornPreview.PageWrapper('<p>Test content</p>', { showHeader: true })
```

---

## Adding New Sections

1. **Add renderer to `sections.js`:**
```javascript
function renderNewSection(section) {
  var html = '<section class="new-section">';
  // ... build HTML
  html += '</section>';
  return html;
}
```

2. **Add to switch statement in `renderSection()`:**
```javascript
case 'new_section': return renderNewSection(section);
```

3. **Export the function:**
```javascript
Z.renderNewSection = renderNewSection;
```

4. **Add CSS to `styles.css`:**
```css
.new-section {
  /* styles */
}
```

5. **Add to `config.yml`** (in sections widget types)

---

## Adding New Page Templates

1. **Add template to `templates.js`:**
```javascript
var NewPagePreview = createClass({
  render: function() {
    var entry = this.props.entry;
    // ... build content
    return h('div', { dangerouslySetInnerHTML: { __html: content } });
  }
});
Z.NewPagePreview = NewPagePreview;
```

2. **Register in `register.js`:**
```javascript
CMS.registerPreviewTemplate('new_page', Z.NewPagePreview);
```

3. **Add collection to `config.yml`**

---

## Key Technical Details

### Global Object Pattern
Since Decap CMS doesn't support ES modules, all exports attach to:
```javascript
window.ZybornPreview = {
  // Utils
  get, toArray, markdownToHtml, escapeHtml, generateId, getVideoEmbedUrl,
  // Sections
  renderSection, renderHero, renderCurator, ... (26 total),
  // Page
  PageWrapper,
  // Templates
  HomePreview, CuratorialPreview, PressPreview, CustomPagePreview
};
```

### Decap CMS Globals
Templates use these globals from Decap CMS:
- `createClass` - React component factory
- `h` - React createElement
- `CMS` - Decap CMS API

### Entry Data Access
CMS entries use Immutable.js. Always use utility functions:
```javascript
// ✅ Correct
var title = get(entry, 'title', 'Default');
var sections = toArray(entry.getIn(['data', 'sections']));

// ❌ Wrong (will fail)
var title = entry.title;
var sections = entry.data.sections;
```

---

## Related Files

- `/public/admin/config.yml` - CMS field definitions
- `/public/css/styles.css` - Main site CSS (also loaded in preview)
- `/public/css/sections.css` - Site section CSS (also loaded in preview)

---

## History

| Date | Change |
|------|--------|
| 2026-01-21 | Split monolithic preview-bundle.js (82KB) into 6 modular files |
| 2026-01-21 | Extracted CSS to external styles.css |
| 2026-01-20 | Added Phase 5: Page templates + section styles fix |
| 2026-01-19 | Added Phase 4: Advanced sections + interactive JS |
| 2026-01-18 | Added Phase 3: Media & layout sections |
| 2026-01-17 | Initial Phase 2: Core section renderers |

---

## Troubleshooting for Claude

When debugging CMS preview issues:

1. **Read this README first** to understand architecture
2. **Check browser console** for load errors
3. **Identify which file** contains the broken code
4. **Read only that file** to fix (keeps context small)
5. **Test in browser** before committing

Each file is < 35 KB = fits easily in context window.
