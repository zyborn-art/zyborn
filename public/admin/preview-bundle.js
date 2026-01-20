// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN CMS Preview Bundle
// Provides pixel-perfect live preview for Decap CMS
// ═══════════════════════════════════════════════════════════════════════════
// Phase 1: Foundation & CSS Registration
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW STYLES
  // ─────────────────────────────────────────────────────────────────────────
  
  // Main site CSS
  CMS.registerPreviewStyle('/css/styles.css');
  
  // Section-specific CSS
  CMS.registerPreviewStyle('/css/sections.css');
  
  // Google Fonts - Space Grotesk + IBM Plex Mono
  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────
  
  /**
   * Safe getter for nested data from Decap CMS entry
   * @param {Object} entry - The CMS entry object
   * @param {string} path - Dot-separated path to the value (e.g., 'sections.0.headline')
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} The value at path or defaultValue
   */
  function get(entry, path, defaultValue) {
    if (defaultValue === undefined) defaultValue = '';
    try {
      var keys = path.split('.');
      var value = entry.getIn(['data'].concat(keys));
      return (value !== undefined && value !== null) ? value : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }

  /**
   * Convert Immutable List to JavaScript Array
   * @param {Object} immutableList - Immutable.js List from CMS
   * @returns {Array} Plain JavaScript array
   */
  function toArray(immutableList) {
    if (!immutableList) return [];
    return immutableList.toJS ? immutableList.toJS() : [];
  }

  /**
   * Simple markdown to HTML converter (basic formatting)
   * Handles: headers, bold, italic, line breaks
   * @param {string} md - Markdown string
   * @returns {string} HTML string
   */
  function markdownToHtml(md) {
    if (!md) return '';
    return md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n/gim, '<br>');
  }

  /**
   * Escape HTML to prevent XSS in custom HTML blocks
   * @param {string} str - String to escape
   * @returns {string} Escaped string
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Generate unique ID for interactive elements (accordion, countdown)
   * @returns {string} Unique ID string
   */
  function generateId() {
    return 'preview-' + Math.random().toString(36).substr(2, 9);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT UTILITIES TO WINDOW FOR LATER PHASES
  // ─────────────────────────────────────────────────────────────────────────
  
  window.ZybornPreview = {
    get: get,
    toArray: toArray,
    markdownToHtml: markdownToHtml,
    escapeHtml: escapeHtml,
    generateId: generateId
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 1 COMPLETE - Foundation ready for section renderers (Phase 2-4)
  // ─────────────────────────────────────────────────────────────────────────
  
  console.log('[ZYBORN Preview] Phase 1 loaded - CSS & utilities registered');

})();
