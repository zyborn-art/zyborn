// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN CMS Preview Bundle
// Provides pixel-perfect live preview for Decap CMS
// ═══════════════════════════════════════════════════════════════════════════
// Phase 1: Foundation & CSS Registration
// Phase 2: Core Section Renderers (Part 1) - 8 sections
// Phase 3: Core Section Renderers (Part 2) - 8 sections (16 total)
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

  /**
   * Convert YouTube/Vimeo URL to embed URL
   */
  function getVideoEmbedUrl(url) {
    if (!url) return '';
    
    // YouTube
    var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) {
      return 'https://www.youtube.com/embed/' + ytMatch[1];
    }
    
    // Vimeo
    var vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) {
      return 'https://player.vimeo.com/video/' + vimeoMatch[1];
    }
    
    // Already an embed URL or unknown format
    return url;
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
    
    if (section.show_form !== false) {
      html += '<div class="hero__form-preview">';
      html += '<div class="email-form email-form--inline">';
      html += '<input type="email" placeholder="Enter your email" class="email-form__input" disabled>';
      html += '<button type="button" class="email-form__button btn btn--primary" disabled>Subscribe</button>';
      html += '</div>';
      html += '</div>';
    }
    
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
    
    if (section.date) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Date</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.date) + '</span>';
      if (section.date_sub) {
        html += '<span class="auction-section__info-sub">' + escapeHtml(section.date_sub) + '</span>';
      }
      html += '</div>';
    }
    
    if (section.estimate) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Estimate</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.estimate) + '</span>';
      if (section.estimate_sub) {
        html += '<span class="auction-section__info-sub">' + escapeHtml(section.estimate_sub) + '</span>';
      }
      html += '</div>';
    }
    
    if (section.format) {
      html += '<div class="auction-section__info-item">';
      html += '<span class="auction-section__info-label">Format</span>';
      html += '<span class="auction-section__info-value">' + escapeHtml(section.format) + '</span>';
      html += '</div>';
    }
    
    html += '</div>';
    
    if (section.cta_text) {
      html += '<div class="auction-section__cta">';
      html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary btn--large">';
      html += escapeHtml(section.cta_text);
      html += '</a>';
      html += '</div>';
    }
    
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
  // PHASE 3: SECTION RENDERERS (Part 2 - 8 sections)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Render Gallery Section
   */
  function renderGallery(section) {
    var columns = section.columns || '3';
    
    var html = '<section class="gallery-section gallery-section--cols-' + columns + '">';
    html += '<div class="gallery-section__container">';
    
    if (section.title) {
      html += '<h2 class="gallery-section__title">' + escapeHtml(section.title) + '</h2>';
    }
    
    if (section.subtitle) {
      html += '<p class="gallery-section__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var images = section.images || [];
    if (images.length > 0) {
      html += '<div class="gallery-section__grid">';
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        html += '<div class="gallery-section__item">';
        html += '<img src="' + escapeHtml(img.src || '') + '" alt="' + escapeHtml(img.alt || '') + '" class="gallery-section__image">';
        if (img.caption) {
          html += '<p class="gallery-section__caption">' + escapeHtml(img.caption) + '</p>';
        }
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="gallery-section__empty">[Add images to gallery]</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render CTA (Call to Action) Section
   */
  function renderCta(section) {
    var html = '<section class="cta-section">';
    html += '<div class="cta-section__container">';
    
    if (section.headline) {
      html += '<h2 class="cta-section__headline">' + escapeHtml(section.headline) + '</h2>';
    }
    
    if (section.text) {
      html += '<p class="cta-section__text">' + escapeHtml(section.text) + '</p>';
    }
    
    if (section.button_text) {
      html += '<a href="' + escapeHtml(section.button_link || '#') + '" class="btn btn--primary btn--large">';
      html += escapeHtml(section.button_text);
      html += '</a>';
    }
    
    if (section.note) {
      html += '<p class="cta-section__note">' + escapeHtml(section.note) + '</p>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Video Section
   */
  function renderVideo(section) {
    var embedUrl = getVideoEmbedUrl(section.video_url);
    
    var html = '<section class="video-section">';
    html += '<div class="video-section__container">';
    
    if (section.title) {
      html += '<h2 class="video-section__title">' + escapeHtml(section.title) + '</h2>';
    }
    
    html += '<div class="video-section__wrapper">';
    if (embedUrl) {
      html += '<iframe src="' + escapeHtml(embedUrl) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else {
      html += '<div class="video-section__placeholder">[Enter a YouTube or Vimeo URL]</div>';
    }
    html += '</div>';
    
    if (section.caption) {
      html += '<p class="video-section__caption">' + escapeHtml(section.caption) + '</p>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Quote Section
   */
  function renderQuote(section) {
    var html = '<section class="quote-section">';
    html += '<div class="quote-section__container">';
    
    html += '<blockquote class="quote-section__quote">';
    html += '<p>"' + escapeHtml(section.text || 'Quote text here...') + '"</p>';
    
    if (section.attribution) {
      html += '<footer>';
      html += '<cite>' + escapeHtml(section.attribution) + '</cite>';
      if (section.attribution_title) {
        html += '<span class="quote-section__title">' + escapeHtml(section.attribution_title) + '</span>';
      }
      html += '</footer>';
    }
    
    html += '</blockquote>';
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Stats Section
   */
  function renderStats(section) {
    var html = '<section class="stats-section">';
    html += '<div class="stats-section__container">';
    
    if (section.title) {
      html += '<h2 class="stats-section__title">' + escapeHtml(section.title) + '</h2>';
    }
    
    var items = section.items || [];
    if (items.length > 0) {
      html += '<div class="stats-section__grid">';
      for (var i = 0; i < items.length; i++) {
        var stat = items[i];
        html += '<div class="stats-section__item">';
        html += '<span class="stats-section__value">' + escapeHtml(stat.value || '0') + '</span>';
        html += '<span class="stats-section__label">' + escapeHtml(stat.label || 'Label') + '</span>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="stats-section__empty">[Add stats items]</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Downloads Section
   */
  function renderDownloads(section) {
    var html = '<section class="downloads-section">';
    html += '<div class="downloads-section__container">';
    
    if (section.title) {
      html += '<h2 class="downloads-section__title">' + escapeHtml(section.title) + '</h2>';
    }
    
    var files = section.files || [];
    if (files.length > 0) {
      html += '<ul class="downloads-section__list">';
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        var icon = file.icon || 'document';
        var iconMap = {
          'document': '📄',
          'image': '🖼️',
          'archive': '📦',
          'video': '🎬',
          'folder': '📁'
        };
        var iconEmoji = iconMap[icon] || '📄';
        
        html += '<li class="downloads-section__item">';
        html += '<span class="downloads-section__icon">' + iconEmoji + '</span>';
        html += '<a href="' + escapeHtml(file.file || '#') + '" class="downloads-section__link" target="_blank">';
        html += escapeHtml(file.label || 'Download');
        html += '</a>';
        html += '</li>';
      }
      html += '</ul>';
    } else {
      html += '<div class="downloads-section__empty">[Add downloadable files]</div>';
    }
    
    html += '</div>';
    html += '</section>';
    
    return html;
  }

  /**
   * Render Spacer Section
   */
  function renderSpacer(section) {
    var size = section.size || 'medium';
    var heights = {
      'small': '2rem',
      'medium': '4rem',
      'large': '8rem'
    };
    var height = heights[size] || heights['medium'];
    
    var html = '<div class="spacer spacer--' + size + '" style="height: ' + height + ';"></div>';
    
    return html;
  }

  /**
   * Render Divider Section
   */
  function renderDivider(section) {
    var style = section.style || 'line';
    var width = section.width || 'medium';
    var spacing = section.spacing || 'medium';
    
    var html = '<div class="divider divider--' + style + ' divider--width-' + width + ' divider--spacing-' + spacing + '">';
    
    if (style === 'dots') {
      html += '<span class="divider__dot"></span>';
      html += '<span class="divider__dot"></span>';
      html += '<span class="divider__dot"></span>';
    } else {
      html += '<hr class="divider__line">';
    }
    
    html += '</div>';
    
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION ROUTER (Phase 3 - 16 types total)
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Route section to appropriate renderer based on type
   */
  function renderSection(section) {
    if (!section || !section.type) {
      return '<div class="preview-error">Unknown section (no type)</div>';
    }
    
    switch (section.type) {
      // Phase 2 sections (8)
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
      
      // Phase 3 sections (8)
      case 'gallery':
        return renderGallery(section);
      case 'cta':
        return renderCta(section);
      case 'video':
        return renderVideo(section);
      case 'quote':
        return renderQuote(section);
      case 'stats':
        return renderStats(section);
      case 'downloads':
        return renderDownloads(section);
      case 'spacer':
        return renderSpacer(section);
      case 'divider':
        return renderDivider(section);
      
      // Phase 4 sections (placeholders - 10)
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
        return '<div class="preview-placeholder" style="padding: 2rem; background: rgba(246,147,27,0.1); border: 1px dashed #F6931B; text-align: center; color: #F6931B; font-family: \'IBM Plex Mono\', monospace;">[' + section.type.toUpperCase() + ' - Coming in Phase 4]</div>';
      
      default:
        return '<div class="preview-error" style="padding: 1rem; background: #ff4444; color: white; text-align: center;">Unknown section type: ' + escapeHtml(section.type) + '</div>';
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
    getVideoEmbedUrl: getVideoEmbedUrl,
    // Section router
    renderSection: renderSection,
    // Phase 2 renderers
    renderHero: renderHero,
    renderCurator: renderCurator,
    renderArtwork: renderArtwork,
    renderAuction: renderAuction,
    renderEmailCapture: renderEmailCapture,
    renderCharity: renderCharity,
    renderThanks: renderThanks,
    renderTextBlock: renderTextBlock,
    // Phase 3 renderers
    renderGallery: renderGallery,
    renderCta: renderCta,
    renderVideo: renderVideo,
    renderQuote: renderQuote,
    renderStats: renderStats,
    renderDownloads: renderDownloads,
    renderSpacer: renderSpacer,
    renderDivider: renderDivider
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3 COMPLETE
  // ─────────────────────────────────────────────────────────────────────────
  
  console.log('[ZYBORN Preview] Phase 3 loaded - 16 section renderers ready');
  console.log('[ZYBORN Preview] Phase 2: hero, curator, artwork, auction, email_capture, charity, thanks, text_block');
  console.log('[ZYBORN Preview] Phase 3: gallery, cta, video, quote, stats, downloads, spacer, divider');

})();
