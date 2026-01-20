// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN CMS Preview Bundle
// Provides pixel-perfect live preview for Decap CMS
// ═══════════════════════════════════════════════════════════════════════════
// Phase 1: Foundation & CSS Registration
// Phase 2: Core Section Renderers (Part 1) - 8 sections
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
   */
  function toArray(immutableList) {
    if (!immutableList) return [];
    return immutableList.toJS ? immutableList.toJS() : [];
  }

  /**
   * Simple markdown to HTML converter (basic formatting)
   */
  function markdownToHtml(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/gim, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>')
      .replace(/\n/gim, '<br>');
  }

  /**
   * Escape HTML to prevent XSS
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
   * Generate unique ID for interactive elements
   */
  function generateId() {
    return 'preview-' + Math.random().toString(36).substr(2, 9);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: SECTION RENDERERS (Part 1 - 8 sections)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Render Hero Section
   */
  function renderHero(section) {
    var style = section.style || 'default';
    var bgStyle = section.image ? 'background-image: url(\'' + section.image + '\'); background-size: cover; background-position: center;' : '';
    
    var html = '<section class="hero hero--' + style + '" style="' + bgStyle + '">';
    html += '<div class="hero__overlay"></div>';
    html += '<div class="hero__content">';
    
    if (section.pre_headline) {
      html += '<p class="hero__label">' + escapeHtml(section.pre_headline) + '</p>';
    }
    
    html += '<h1 class="hero__title">' + escapeHtml(section.headline || 'Headline') + '</h1>';
    
    if (section.subheadline) {
      html += '<p class="hero__subtitle">' + escapeHtml(section.subheadline) + '</p>';
    }
    
    if (section.cta_text) {
      html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary">' + escapeHtml(section.cta_text) + '</a>';
    }
    
    if (section.microcopy) {
      html += '<p class="hero__microcopy">' + escapeHtml(section.microcopy) + '</p>';
    }
    
    // Show email form placeholder if enabled
    if (section.show_form !== false) {
      html += '<div class="hero__form-preview">';
      html += '<div class="email-form email-form--inline">';
      html += '<input type="email" placeholder="Enter your email" class="email-form__input" disabled>';
      html += '<button type="button" class="email-form__button btn btn--primary" disabled>Subscribe</button>';
      html += '</div>';
      html += '</div>';
    }
    
    // Show social links placeholder if enabled
    if (section.show_social !== false) {
      html += '<div class="hero__social-preview">';
      html += '<span class="social-links__placeholder">[Social Links]</span>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Curator Feature Section
   */
  function renderCurator(section) {
    var html = '<section class="curator-section">';
    html += '<div class="curator-section__container">';
    
    if (section.label) {
      html += '<p class="curator-section__label">' + escapeHtml(section.label) + '</p>';
    }
    
    html += '<div class="curator-section__content">';
    
    if (section.essay_title) {
      html += '<h2 class="curator-section__title">' + escapeHtml(section.essay_title) + '</h2>';
    }
    
    if (section.name) {
      html += '<p class="curator-section__author">by ' + escapeHtml(section.name) + '</p>';
    }
    
    if (section.excerpt) {
      html += '<p class="curator-section__excerpt">' + escapeHtml(section.excerpt) + '</p>';
    }
    
    if (section.excerpt_2) {
      html += '<p class="curator-section__excerpt">' + escapeHtml(section.excerpt_2) + '</p>';
    }
    
    if (section.read_more_link) {
      html += '<a href="' + escapeHtml(section.read_more_link) + '" class="curator-section__link">';
      html += escapeHtml(section.read_more_text || 'Read More');
      html += ' →</a>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Artwork Details Section
   */
  function renderArtwork(section) {
    var html = '<section class="artwork-section">';
    html += '<div class="artwork-section__container">';
    
    html += '<h2 class="artwork-section__title">' + escapeHtml(section.title || 'Artwork Details') + '</h2>';
    
    html += '<div class="artwork-section__details">';
    
    if (section.artist) {
      html += '<div class="artwork-section__detail">';
      html += '<span class="artwork-section__label">Artist</span>';
      html += '<span class="artwork-section__value">' + escapeHtml(section.artist) + '</span>';
      html += '</div>';
    }
    
    if (section.medium) {
      html += '<div class="artwork-section__detail">';
      html += '<span class="artwork-section__label">Medium</span>';
      html += '<span class="artwork-section__value">' + escapeHtml(section.medium) + '</span>';
      html += '</div>';
    }
    
    if (section.dimensions) {
      html += '<div class="artwork-section__detail">';
      html += '<span class="artwork-section__label">Dimensions</span>';
      html += '<span class="artwork-section__value">' + escapeHtml(section.dimensions) + '</span>';
      html += '</div>';
    }
    
    if (section.edition) {
      html += '<div class="artwork-section__detail">';
      html += '<span class="artwork-section__label">Edition</span>';
      html += '<span class="artwork-section__value">' + escapeHtml(section.edition) + '</span>';
      html += '</div>';
    }
    
    if (section.framing) {
      html += '<div class="artwork-section__detail">';
      html += '<span class="artwork-section__label">Framing</span>';
      html += '<span class="artwork-section__value">' + escapeHtml(section.framing) + '</span>';
      html += '</div>';
    }
    
    html += '</div>';
    
    // Render inclusions list
    var inclusions = section.inclusions || [];
    if (inclusions.length > 0) {
      html += '<div class="artwork-section__inclusions">';
      html += '<h3 class="artwork-section__inclusions-title">Inclusions</h3>';
      html += '<ul class="artwork-section__inclusions-list">';
      for (var i = 0; i < inclusions.length; i++) {
        var item = typeof inclusions[i] === 'object' ? inclusions[i].item : inclusions[i];
        html += '<li>' + escapeHtml(item) + '</li>';
      }
      html += '</ul>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Auction Info Section
   */
  function renderAuction(section) {
    var status = section.status || 'live';
    
    var html = '<section class="auction-section auction-section--' + status + '">';
    html += '<div class="auction-section__container">';
    
    if (section.label) {
      html += '<p class="auction-section__label">' + escapeHtml(section.label) + '</p>';
    }
    
    html += '<h2 class="auction-section__title">' + escapeHtml(section.title || 'Auction') + '</h2>';
    
    if (section.description) {
      html += '<p class="auction-section__description">' + escapeHtml(section.description) + '</p>';
    }
    
    html += '<div class="auction-section__info">';
    
    // Date
    if (section.date) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Date</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.date) + '</span>';
      if (section.date_sub) {
        html += '<span class="auction-section__info-sub">' + escapeHtml(section.date_sub) + '</span>';
      }
      html += '</div>';
    }
    
    // Estimate
    if (section.estimate) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Estimate</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.estimate) + '</span>';
      if (section.estimate_sub) {
        html += '<span class="auction-section__info-sub">' + escapeHtml(section.estimate_sub) + '</span>';
      }
      html += '</div>';
    }
    
    // Format
    if (section.format) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Format</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.format) + '</span>';
      html += '</div>';
    }
    
    html += '</div>';
    
    // CTA Button
    if (section.cta_text) {
      html += '<div class="auction-section__cta">';
      html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary btn--large">';
      html += escapeHtml(section.cta_text);
      html += '</a>';
      html += '</div>';
    }
    
    // Note
    if (section.note) {
      html += '<p class="auction-section__note">' + escapeHtml(section.note) + '</p>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Email Capture Section
   */
  function renderEmailCapture(section) {
    var html = '<section class="email-capture-section">';
    html += '<div class="email-capture-section__container">';
    
    html += '<h2 class="email-capture-section__headline">' + escapeHtml(section.headline || 'Stay Updated') + '</h2>';
    
    if (section.subheadline) {
      html += '<p class="email-capture-section__subheadline">' + escapeHtml(section.subheadline) + '</p>';
    }
    
    if (section.text) {
      html += '<p class="email-capture-section__text">' + escapeHtml(section.text) + '</p>';
    }
    
    // Form preview (non-functional in preview)
    html += '<div class="email-capture-section__form">';
    
    if (section.form_title) {
      html += '<h3 class="email-capture-section__form-title">' + escapeHtml(section.form_title) + '</h3>';
    }
    
    if (section.form_subtitle) {
      html += '<p class="email-capture-section__form-subtitle">' + escapeHtml(section.form_subtitle) + '</p>';
    }
    
    html += '<div class="email-form">';
    html += '<input type="email" placeholder="Enter your email" class="email-form__input" disabled>';
    html += '<button type="button" class="email-form__button btn btn--primary" disabled>';
    html += escapeHtml(section.button_text || 'Subscribe');
    html += '</button>';
    html += '</div>';
    
    // Interest options
    var interests = section.interests || [];
    if (interests.length > 0) {
      html += '<div class="email-capture-section__interests">';
      html += '<p class="email-capture-section__interests-label">I\'m interested in:</p>';
      for (var i = 0; i < interests.length; i++) {
        var opt = typeof interests[i] === 'object' ? interests[i].option : interests[i];
        html += '<label class="email-capture-section__interest-option">';
        html += '<input type="checkbox" disabled> ' + escapeHtml(opt);
        html += '</label>';
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Charity/Impact Section
   */
  function renderCharity(section) {
    var html = '<section class="charity-section">';
    html += '<div class="charity-section__container">';
    
    if (section.label) {
      html += '<p class="charity-section__label">' + escapeHtml(section.label) + '</p>';
    }
    
    html += '<h2 class="charity-section__title">' + escapeHtml(section.title || 'Impact') + '</h2>';
    
    if (section.text) {
      html += '<div class="charity-section__content">' + markdownToHtml(section.text) + '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Thanks/Credits Section
   */
  function renderThanks(section) {
    var html = '<section class="thanks-section">';
    html += '<div class="thanks-section__container">';
    
    if (section.text) {
      html += '<div class="thanks-section__content">' + markdownToHtml(section.text) + '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Text Block Section
   */
  function renderTextBlock(section) {
    var background = section.background || 'default';
    
    var html = '<section class="text-block text-block--' + background + '">';
    html += '<div class="text-block__container">';
    
    if (section.label) {
      html += '<p class="text-block__label">' + escapeHtml(section.label) + '</p>';
    }
    
    if (section.title) {
      html += '<h2 class="text-block__title">' + escapeHtml(section.title) + '</h2>';
    }
    
    if (section.content) {
      html += '<div class="text-block__content">' + markdownToHtml(section.content) + '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION ROUTER (Phase 2 - 8 types)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Route section to appropriate renderer based on type
   * @param {Object} section - Section data object with 'type' property
   * @returns {string} HTML string
   */
  function renderSection(section) {
    if (!section || !section.type) {
      return '<div class="preview-error">Unknown section (no type)</div>';
    }
    
    switch (section.type) {
      // Phase 2 sections
      case 'hero':
        return renderHero(section);
      case 'curator':
        return renderCurator(section);
      case 'artwork':
        return renderArtwork(section);
      case 'auction':
        return renderAuction(section);
      case 'email_capture':
        return renderEmailCapture(section);
      case 'charity':
        return renderCharity(section);
      case 'thanks':
        return renderThanks(section);
      case 'text_block':
        return renderTextBlock(section);
      
      // Phase 3 sections (placeholders)
      case 'gallery':
      case 'cta':
      case 'video':
      case 'quote':
      case 'stats':
      case 'downloads':
      case 'spacer':
      case 'divider':
        return '<div class="preview-placeholder">[' + section.type.toUpperCase() + ' - Coming in Phase 3]</div>';
      
      // Phase 4 sections (placeholders)
      case 'two_column':
      case 'feature_grid':
      case 'timeline':
      case 'accordion':
      case 'team':
      case 'logo_grid':
      case 'map':
      case 'countdown':
      case 'image_text':
      case 'custom_html':
        return '<div class="preview-placeholder">[' + section.type.toUpperCase() + ' - Coming in Phase 4]</div>';
      
      default:
        return '<div class="preview-error">Unknown section type: ' + escapeHtml(section.type) + '</div>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT TO WINDOW
  // ─────────────────────────────────────────────────────────────────────────
  
  window.ZybornPreview = {
    // Utilities
    get: get,
    toArray: toArray,
    markdownToHtml: markdownToHtml,
    escapeHtml: escapeHtml,
    generateId: generateId,
    // Section renderers
    renderSection: renderSection,
    renderHero: renderHero,
    renderCurator: renderCurator,
    renderArtwork: renderArtwork,
    renderAuction: renderAuction,
    renderEmailCapture: renderEmailCapture,
    renderCharity: renderCharity,
    renderThanks: renderThanks,
    renderTextBlock: renderTextBlock
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2 COMPLETE
  // ─────────────────────────────────────────────────────────────────────────
  
  console.log('[ZYBORN Preview] Phase 2 loaded - 8 section renderers ready');
  console.log('[ZYBORN Preview] Supported sections: hero, curator, artwork, auction, email_capture, charity, thanks, text_block');

})();
