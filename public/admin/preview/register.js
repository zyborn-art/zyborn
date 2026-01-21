// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - CMS Registration
// Final file - registers styles and templates with Decap CMS
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW STYLES
  // Load order matters: Live CSS first (provides variables), Preview CSS last
  // ─────────────────────────────────────────────────────────────────────────
  
  // 1. Google Fonts (load first for font availability)
  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
  
  // 2. Live site CSS (provides CSS variables: --color-orange, --font-primary, etc.)
  CMS.registerPreviewStyle('/css/styles.css');
  CMS.registerPreviewStyle('/css/sections.css');
  
  // 3. Preview-specific CSS (uses variables from live CSS, adds preview wrapper/header/footer)
  CMS.registerPreviewStyle('/admin/preview/styles.css');

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────

  CMS.registerPreviewTemplate('home', Z.HomePreview);
  CMS.registerPreviewTemplate('curatorial', Z.CuratorialPreview);
  CMS.registerPreviewTemplate('press', Z.PressPreview);
  CMS.registerPreviewTemplate('custom_pages', Z.CustomPagePreview);

  console.log('[ZYBORN Preview] ✓ All modules loaded and registered');
  console.log('[ZYBORN Preview] CSS Load Order:');
  console.log('  1. Google Fonts');
  console.log('  2. /css/styles.css (live - CSS variables)');
  console.log('  3. /css/sections.css (live - section styles)');
  console.log('  4. /admin/preview/styles.css (preview overrides)');
  console.log('[ZYBORN Preview] Templates: home, curatorial, press, custom_pages');

})();
