# ZYBORN Archive

This directory contains archived files from the Quick Edit system that was replaced in Run 3.

## Contents

| File | Original Location | Purpose |
|------|-------------------|---------|
| `content.json.archived` | `public/data/content.json` | Legacy JSON content for Quick Edit CMS |
| `content-loader.js.archived` | `public/js/content-loader.js` | JavaScript that loaded JSON content into DOM |

## Why Archived?

The Quick Edit system was a Phase 1 solution that allowed fast content updates via JSON.
It was replaced by the Eleventy-based CMS (Phase 2) which provides:

- Single source of truth (no dual editing locations)
- Better SEO (content baked into HTML at build time)
- Faster page loads (no JavaScript required to display content)
- Cleaner architecture (one system to maintain)

## Current Content Location

All content is now managed in:
- `content/pages/home.md` - Home page sections
- `content/pages/curatorial.md` - Curatorial essay
- `content/pages/press.md` - Press page
- `content/custom-pages/*.md` - Partner-created pages

## Rollback (Emergency Only)

If you need to restore the Quick Edit system:

1. Rename `content.json.archived` → `public/data/content.json`
2. Rename `content-loader.js.archived` → `public/js/content-loader.js`
3. Add script tag to `src/_includes/base.njk`:
   ```html
   <script src="/js/content-loader.js"></script>
   ```
4. Restore `quick_edit` collection in `public/admin/config.yml` from git history

**Note:** This is not recommended. The Eleventy system is the supported path forward.

---

*Archived: January 20, 2026*
