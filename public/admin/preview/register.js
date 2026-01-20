// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - CMS Registration
// Final file - registers styles and templates with Decap CMS
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW STYLES
  // ─────────────────────────────────────────────────────────────────────────
  
  CMS.registerPreviewStyle('/css/styles.css');
  CMS.registerPreviewStyle('/css/sections.css');
  CMS.registerPreviewStyle('/admin/preview/styles.css');
  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────

  CMS.registerPreviewTemplate('home', Z.HomePreview);
  CMS.registerPreviewTemplate('curatorial', Z.CuratorialPreview);
  CMS.registerPreviewTemplate('press', Z.PressPreview);
  CMS.registerPreviewTemplate('custom_pages', Z.CustomPagePreview);

  console.log('[ZYBORN Preview] ✓ All modules loaded and registered');
  console.log('[ZYBORN Preview] Styles: styles.css, sections.css, preview/styles.css');
  console.log('[ZYBORN Preview] Templates: home, curatorial, press, custom_pages');

})();
