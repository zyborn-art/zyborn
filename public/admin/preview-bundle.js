// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN CMS Preview Bundle
// Provides pixel-perfect live preview for Decap CMS
// ═══════════════════════════════════════════════════════════════════════════
// MODULAR ARCHITECTURE - Phase 1: External CSS
// CSS moved to /admin/preview/styles.css
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW STYLES (External CSS)
  // ─────────────────────────────────────────────────────────────────────────
  
  CMS.registerPreviewStyle('/css/styles.css');
  CMS.registerPreviewStyle('/css/sections.css');
  CMS.registerPreviewStyle('/admin/preview/styles.css');  // NEW: External preview CSS
  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');

  // ─────────────────────────────────────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ─────────────────────────────────────────────────────────────────────────
  
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

  function toArray(immutableList) {
    if (!immutableList) return [];
    return immutableList.toJS ? immutableList.toJS() : [];
  }

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

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateId() {
    return 'preview-' + Math.random().toString(36).substr(2, 9);
  }

  function getVideoEmbedUrl(url) {
    if (!url) return '';
    var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return 'https://www.youtube.com/embed/' + ytMatch[1];
    var vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
    if (vimeoMatch) return 'https://player.vimeo.com/video/' + vimeoMatch[1];
    return url;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 2: SECTION RENDERERS (8 sections)
  // ─────────────────────────────────────────────────────────────────────────

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
      html += '<div class="hero__form-preview"><div class="email-form email-form--inline">';
      html += '<input type="email" placeholder="Enter your email" class="email-form__input" disabled>';
      html += '<button type="button" class="email-form__button btn btn--primary" disabled>Subscribe</button>';
      html += '</div></div>';
    }
    if (section.show_social !== false) {
      html += '<div class="hero__social-preview"><span class="social-links__placeholder">[Social Links]</span></div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderCurator(section) {
    var html = '<section class="curator-section"><div class="curator-section__container">';
    if (section.label) html += '<p class="curator-section__label">' + escapeHtml(section.label) + '</p>';
    html += '<div class="curator-section__content">';
    if (section.essay_title) html += '<h2 class="curator-section__title">' + escapeHtml(section.essay_title) + '</h2>';
    if (section.name) html += '<p class="curator-section__author">by ' + escapeHtml(section.name) + '</p>';
    if (section.excerpt) html += '<p class="curator-section__excerpt">' + escapeHtml(section.excerpt) + '</p>';
    if (section.excerpt_2) html += '<p class="curator-section__excerpt">' + escapeHtml(section.excerpt_2) + '</p>';
    if (section.read_more_link) {
      html += '<a href="' + escapeHtml(section.read_more_link) + '" class="curator-section__link">' + escapeHtml(section.read_more_text || 'Read More') + ' →</a>';
    }
    html += '</div></div></section>';
    return html;
  }

  function renderArtwork(section) {
    var html = '<section class="artwork-section"><div class="artwork-section__container">';
    html += '<h2 class="artwork-section__title">' + escapeHtml(section.title || 'Artwork Details') + '</h2>';
    html += '<div class="artwork-section__details">';
    if (section.artist) html += '<div class="artwork-section__detail"><span class="artwork-section__label">Artist</span><span class="artwork-section__value">' + escapeHtml(section.artist) + '</span></div>';
    if (section.medium) html += '<div class="artwork-section__detail"><span class="artwork-section__label">Medium</span><span class="artwork-section__value">' + escapeHtml(section.medium) + '</span></div>';
    if (section.dimensions) html += '<div class="artwork-section__detail"><span class="artwork-section__label">Dimensions</span><span class="artwork-section__value">' + escapeHtml(section.dimensions) + '</span></div>';
    if (section.edition) html += '<div class="artwork-section__detail"><span class="artwork-section__label">Edition</span><span class="artwork-section__value">' + escapeHtml(section.edition) + '</span></div>';
    if (section.framing) html += '<div class="artwork-section__detail"><span class="artwork-section__label">Framing</span><span class="artwork-section__value">' + escapeHtml(section.framing) + '</span></div>';
    html += '</div>';
    var inclusions = section.inclusions || [];
    if (inclusions.length > 0) {
      html += '<div class="artwork-section__inclusions"><h3 class="artwork-section__inclusions-title">Inclusions</h3><ul class="artwork-section__inclusions-list">';
      for (var i = 0; i < inclusions.length; i++) {
        var item = typeof inclusions[i] === 'object' ? inclusions[i].item : inclusions[i];
        html += '<li>' + escapeHtml(item) + '</li>';
      }
      html += '</ul></div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderAuction(section) {
    var status = section.status || 'live';
    var html = '<section class="auction-section auction-section--' + status + '"><div class="auction-section__container">';
    if (section.label) html += '<p class="auction-section__label">' + escapeHtml(section.label) + '</p>';
    html += '<h2 class="auction-section__title">' + escapeHtml(section.title || 'Auction') + '</h2>';
    if (section.description) html += '<p class="auction-section__description">' + escapeHtml(section.description) + '</p>';
    html += '<div class="auction-section__info">';
    if (section.date) {
      html += '<div class="auction-section__info-item"><span class="auction-section__info-label">Date</span><span class="auction-section__info-value">' + escapeHtml(section.date) + '</span>';
      if (section.date_sub) html += '<span class="auction-section__info-sub">' + escapeHtml(section.date_sub) + '</span>';
      html += '</div>';
    }
    if (section.estimate) {
      html += '<div class="auction-section__info-item"><span class="auction-section__info-label">Estimate</span><span class="auction-section__info-value">' + escapeHtml(section.estimate) + '</span>';
      if (section.estimate_sub) html += '<span class="auction-section__info-sub">' + escapeHtml(section.estimate_sub) + '</span>';
      html += '</div>';
    }
    if (section.format) html += '<div class="auction-section__info-item"><span class="auction-section__info-label">Format</span><span class="auction-section__info-value">' + escapeHtml(section.format) + '</span></div>';
    html += '</div>';
    if (section.cta_text) html += '<div class="auction-section__cta"><a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary btn--large">' + escapeHtml(section.cta_text) + '</a></div>';
    if (section.note) html += '<p class="auction-section__note">' + escapeHtml(section.note) + '</p>';
    html += '</div></section>';
    return html;
  }

  function renderEmailCapture(section) {
    var html = '<section class="email-capture-section"><div class="email-capture-section__container">';
    html += '<h2 class="email-capture-section__headline">' + escapeHtml(section.headline || 'Stay Updated') + '</h2>';
    if (section.subheadline) html += '<p class="email-capture-section__subheadline">' + escapeHtml(section.subheadline) + '</p>';
    if (section.text) html += '<p class="email-capture-section__text">' + escapeHtml(section.text) + '</p>';
    html += '<div class="email-capture-section__form">';
    if (section.form_title) html += '<h3 class="email-capture-section__form-title">' + escapeHtml(section.form_title) + '</h3>';
    if (section.form_subtitle) html += '<p class="email-capture-section__form-subtitle">' + escapeHtml(section.form_subtitle) + '</p>';
    html += '<div class="email-form"><input type="email" placeholder="Enter your email" class="email-form__input" disabled>';
    html += '<button type="button" class="email-form__button btn btn--primary" disabled>' + escapeHtml(section.button_text || 'Subscribe') + '</button></div>';
    var interests = section.interests || [];
    if (interests.length > 0) {
      html += '<div class="email-capture-section__interests"><p class="email-capture-section__interests-label">I\'m interested in:</p>';
      for (var i = 0; i < interests.length; i++) {
        var opt = typeof interests[i] === 'object' ? interests[i].option : interests[i];
        html += '<label class="email-capture-section__interest-option"><input type="checkbox" disabled> ' + escapeHtml(opt) + '</label>';
      }
      html += '</div>';
    }
    html += '</div></div></section>';
    return html;
  }

  function renderCharity(section) {
    var html = '<section class="charity-section"><div class="charity-section__container">';
    if (section.label) html += '<p class="charity-section__label">' + escapeHtml(section.label) + '</p>';
    html += '<h2 class="charity-section__title">' + escapeHtml(section.title || 'Impact') + '</h2>';
    if (section.text) html += '<div class="charity-section__text">' + markdownToHtml(section.text) + '</div>';
    html += '</div></section>';
    return html;
  }

  function renderThanks(section) {
    var html = '<section class="thanks-section"><div class="thanks-section__container">';
    if (section.text) html += '<div class="thanks-section__content">' + markdownToHtml(section.text) + '</div>';
    html += '</div></section>';
    return html;
  }

  function renderTextBlock(section) {
    var background = section.background || 'default';
    var html = '<section class="text-block text-block--' + background + '"><div class="text-block__container">';
    if (section.label) html += '<p class="text-block__label">' + escapeHtml(section.label) + '</p>';
    if (section.title) html += '<h2 class="text-block__title">' + escapeHtml(section.title) + '</h2>';
    if (section.content) html += '<div class="text-block__content">' + markdownToHtml(section.content) + '</div>';
    html += '</div></section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 3: SECTION RENDERERS (8 sections)
  // ─────────────────────────────────────────────────────────────────────────

  function renderGallery(section) {
    var columns = section.columns || '3';
    var html = '<section class="gallery-section gallery-section--cols-' + columns + '"><div class="gallery-section__container">';
    if (section.title) html += '<h2 class="gallery-section__title">' + escapeHtml(section.title) + '</h2>';
    if (section.subtitle) html += '<p class="gallery-section__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    var images = section.images || [];
    if (images.length > 0) {
      html += '<div class="gallery-section__grid">';
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        html += '<div class="gallery-section__item"><img src="' + escapeHtml(img.src || '') + '" alt="' + escapeHtml(img.alt || '') + '" class="gallery-section__image">';
        if (img.caption) html += '<p class="gallery-section__caption">' + escapeHtml(img.caption) + '</p>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="gallery-section__empty">[Add images to gallery]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderCta(section) {
    var html = '<section class="cta-section"><div class="cta-section__container">';
    if (section.headline) html += '<h2 class="cta-section__headline">' + escapeHtml(section.headline) + '</h2>';
    if (section.text) html += '<p class="cta-section__text">' + escapeHtml(section.text) + '</p>';
    if (section.button_text) html += '<a href="' + escapeHtml(section.button_link || '#') + '" class="btn btn--primary btn--large">' + escapeHtml(section.button_text) + '</a>';
    if (section.note) html += '<p class="cta-section__note">' + escapeHtml(section.note) + '</p>';
    html += '</div></section>';
    return html;
  }

  function renderVideo(section) {
    var embedUrl = getVideoEmbedUrl(section.video_url);
    var html = '<section class="video-section"><div class="video-section__container">';
    if (section.title) html += '<h2 class="video-section__title">' + escapeHtml(section.title) + '</h2>';
    html += '<div class="video-section__wrapper">';
    if (embedUrl) html += '<iframe src="' + escapeHtml(embedUrl) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    else html += '<div class="video-section__placeholder">[Enter a YouTube or Vimeo URL]</div>';
    html += '</div>';
    if (section.caption) html += '<p class="video-section__caption">' + escapeHtml(section.caption) + '</p>';
    html += '</div></section>';
    return html;
  }

  function renderQuote(section) {
    var html = '<section class="quote-section"><div class="quote-section__container">';
    html += '<blockquote class="quote-section__quote"><p>"' + escapeHtml(section.text || 'Quote text here...') + '"</p>';
    if (section.attribution) {
      html += '<footer><cite>' + escapeHtml(section.attribution) + '</cite>';
      if (section.attribution_title) html += '<span class="quote-section__title">' + escapeHtml(section.attribution_title) + '</span>';
      html += '</footer>';
    }
    html += '</blockquote></div></section>';
    return html;
  }

  function renderStats(section) {
    var html = '<section class="stats-section"><div class="stats-section__container">';
    if (section.title) html += '<h2 class="stats-section__title">' + escapeHtml(section.title) + '</h2>';
    var items = section.items || [];
    if (items.length > 0) {
      html += '<div class="stats-section__grid">';
      for (var i = 0; i < items.length; i++) {
        html += '<div class="stats-section__item"><span class="stats-section__value">' + escapeHtml(items[i].value || '0') + '</span><span class="stats-section__label">' + escapeHtml(items[i].label || 'Label') + '</span></div>';
      }
      html += '</div>';
    } else {
      html += '<div class="stats-section__empty">[Add stats items]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderDownloads(section) {
    var html = '<section class="downloads-section"><div class="downloads-section__container">';
    if (section.title) html += '<h2 class="downloads-section__title">' + escapeHtml(section.title) + '</h2>';
    var files = section.files || [];
    var iconMap = { 'document': '📄', 'image': '🖼️', 'archive': '📦', 'video': '🎬', 'folder': '📁' };
    if (files.length > 0) {
      html += '<ul class="downloads-section__list">';
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        html += '<li class="downloads-section__item"><span class="downloads-section__icon">' + (iconMap[file.icon] || '📄') + '</span>';
        html += '<a href="' + escapeHtml(file.file || '#') + '" class="downloads-section__link" target="_blank">' + escapeHtml(file.label || 'Download') + '</a></li>';
      }
      html += '</ul>';
    } else {
      html += '<div class="downloads-section__empty">[Add downloadable files]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderSpacer(section) {
    var heights = { 'small': '2rem', 'medium': '4rem', 'large': '8rem' };
    return '<div class="spacer spacer--' + (section.size || 'medium') + '" style="height: ' + (heights[section.size] || '4rem') + ';"></div>';
  }

  function renderDivider(section) {
    var style = section.style || 'line';
    var html = '<div class="divider divider--' + style + ' divider--width-' + (section.width || 'medium') + ' divider--spacing-' + (section.spacing || 'medium') + '">';
    if (style === 'dots') html += '<span class="divider__dot"></span><span class="divider__dot"></span><span class="divider__dot"></span>';
    else html += '<hr class="divider__line">';
    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PHASE 4: ADVANCED SECTION RENDERERS (10 sections)
  // ─────────────────────────────────────────────────────────────────────────

  function renderTwoColumn(section) {
    var layout = section.layout || 'equal';
    var background = section.background || 'default';
    var html = '<section class="two-column two-column--' + layout + ' two-column--' + background + '"><div class="two-column__container">';
    if (section.title) html += '<h2 class="two-column__title">' + escapeHtml(section.title) + '</h2>';
    html += '<div class="two-column__grid">';
    var left = section.left || {};
    html += '<div class="two-column__col two-column__col--left">';
    if (left.type === 'image' && left.image) {
      html += '<img src="' + escapeHtml(left.image) + '" alt="' + escapeHtml(left.image_alt || '') + '" class="two-column__image">';
    } else if (left.text) {
      html += '<div class="two-column__text">' + markdownToHtml(left.text) + '</div>';
    }
    html += '</div>';
    var right = section.right || {};
    html += '<div class="two-column__col two-column__col--right">';
    if (right.type === 'image' && right.image) {
      html += '<img src="' + escapeHtml(right.image) + '" alt="' + escapeHtml(right.image_alt || '') + '" class="two-column__image">';
    } else if (right.text) {
      html += '<div class="two-column__text">' + markdownToHtml(right.text) + '</div>';
    }
    html += '</div>';
    html += '</div></div></section>';
    return html;
  }

  function renderFeatureGrid(section) {
    var columns = section.columns || '3';
    var background = section.background || 'default';
    var html = '<section class="feature-grid feature-grid--cols-' + columns + ' feature-grid--' + background + '"><div class="feature-grid__container">';
    if (section.title) html += '<h2 class="feature-grid__title">' + escapeHtml(section.title) + '</h2>';
    if (section.subtitle) html += '<p class="feature-grid__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    var features = section.features || [];
    if (features.length > 0) {
      html += '<div class="feature-grid__grid">';
      for (var i = 0; i < features.length; i++) {
        var f = features[i];
        html += '<div class="feature-grid__item">';
        if (f.icon) html += '<span class="feature-grid__icon">' + escapeHtml(f.icon) + '</span>';
        html += '<h3 class="feature-grid__item-title">' + escapeHtml(f.title || '') + '</h3>';
        html += '<p class="feature-grid__item-desc">' + escapeHtml(f.description || '') + '</p>';
        if (f.link) html += '<a href="' + escapeHtml(f.link) + '" class="feature-grid__item-link">Learn more →</a>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="feature-grid__empty">[Add features]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderTimeline(section) {
    var layout = section.layout || 'vertical';
    var html = '<section class="timeline-section timeline--' + layout + '"><div class="timeline-section__container">';
    if (section.title) html += '<h2 class="timeline-section__title">' + escapeHtml(section.title) + '</h2>';
    var events = section.events || [];
    if (events.length > 0) {
      html += '<div class="timeline__track">';
      for (var i = 0; i < events.length; i++) {
        var e = events[i];
        html += '<div class="timeline__event">';
        html += '<div class="timeline__marker">' + (i + 1) + '</div>';
        html += '<div class="timeline__content">';
        if (e.date) html += '<span class="timeline__date">' + escapeHtml(e.date) + '</span>';
        html += '<h3 class="timeline__event-title">' + escapeHtml(e.title || '') + '</h3>';
        if (e.description) html += '<p class="timeline__event-desc">' + escapeHtml(e.description) + '</p>';
        if (e.image) html += '<img src="' + escapeHtml(e.image) + '" alt="" class="timeline__event-image">';
        html += '</div></div>';
      }
      html += '</div>';
    } else {
      html += '<div class="timeline__empty">[Add timeline events]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderTeam(section) {
    var columns = section.columns || '3';
    var html = '<section class="team-section team-section--cols-' + columns + '"><div class="team-section__container">';
    if (section.title) html += '<h2 class="team-section__title">' + escapeHtml(section.title) + '</h2>';
    if (section.subtitle) html += '<p class="team-section__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    var people = section.people || [];
    if (people.length > 0) {
      html += '<div class="team-section__grid">';
      for (var i = 0; i < people.length; i++) {
        var p = people[i];
        html += '<div class="team-section__member">';
        if (p.photo) html += '<img src="' + escapeHtml(p.photo) + '" alt="' + escapeHtml(p.name || '') + '" class="team-section__photo">';
        else html += '<div class="team-section__photo-placeholder"></div>';
        html += '<h3 class="team-section__name">' + escapeHtml(p.name || '') + '</h3>';
        if (p.role) html += '<p class="team-section__role">' + escapeHtml(p.role) + '</p>';
        if (p.bio) html += '<p class="team-section__bio">' + escapeHtml(p.bio) + '</p>';
        var links = '';
        if (p.website) links += '<a href="' + escapeHtml(p.website) + '" target="_blank">🌐</a> ';
        if (p.linkedin) links += '<a href="' + escapeHtml(p.linkedin) + '" target="_blank">💼</a>';
        if (links) html += '<div class="team-section__links">' + links + '</div>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="team-section__empty">[Add team members]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderLogoGrid(section) {
    var columns = section.columns || '4';
    var grayscale = section.grayscale !== false;
    var html = '<section class="logo-grid logo-grid--cols-' + columns + (grayscale ? ' logo-grid--grayscale' : '') + '"><div class="logo-grid__container">';
    if (section.title) html += '<h2 class="logo-grid__title">' + escapeHtml(section.title) + '</h2>';
    if (section.subtitle) html += '<p class="logo-grid__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    var logos = section.logos || [];
    if (logos.length > 0) {
      html += '<div class="logo-grid__grid">';
      for (var i = 0; i < logos.length; i++) {
        var l = logos[i];
        html += '<div class="logo-grid__item">';
        if (l.link) html += '<a href="' + escapeHtml(l.link) + '" target="_blank" title="' + escapeHtml(l.name || '') + '">';
        html += '<img src="' + escapeHtml(l.logo || '') + '" alt="' + escapeHtml(l.name || '') + '">';
        if (l.link) html += '</a>';
        html += '</div>';
      }
      html += '</div>';
    } else {
      html += '<div class="logo-grid__empty">[Add logos]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderMap(section) {
    var html = '<section class="map-section"><div class="map-section__container">';
    if (section.title) html += '<h2 class="map-section__title">' + escapeHtml(section.title) + '</h2>';
    html += '<div class="map-section__content">';
    html += '<div class="map-section__embed">';
    if (section.embed_url) {
      html += '<iframe src="' + escapeHtml(section.embed_url) + '" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
    } else {
      html += '<div class="map-section__placeholder">[Enter Google Maps embed URL]</div>';
    }
    html += '</div>';
    html += '<div class="map-section__info">';
    if (section.venue) html += '<h3 class="map-section__venue">' + escapeHtml(section.venue) + '</h3>';
    if (section.address) html += '<p class="map-section__address">' + escapeHtml(section.address).replace(/\n/g, '<br>') + '</p>';
    if (section.directions_link) html += '<a href="' + escapeHtml(section.directions_link) + '" target="_blank" class="map-section__directions">Get Directions →</a>';
    if (section.info) html += '<div class="map-section__additional">' + markdownToHtml(section.info) + '</div>';
    html += '</div></div></div></section>';
    return html;
  }

  function renderImageText(section) {
    var position = section.text_position || 'overlay';
    var align = section.text_align || 'left';
    var html = '<section class="image-text image-text--' + position + ' image-text--align-' + align + '"><div class="image-text__container">';
    if (section.image) {
      html += '<div class="image-text__image-wrapper">';
      html += '<img src="' + escapeHtml(section.image) + '" alt="' + escapeHtml(section.image_alt || '') + '" class="image-text__image">';
      if (position === 'overlay') {
        html += '<div class="image-text__overlay">';
        html += '<div class="image-text__content">';
        if (section.title) html += '<h2 class="image-text__title">' + escapeHtml(section.title) + '</h2>';
        if (section.text) html += '<div class="image-text__text">' + markdownToHtml(section.text) + '</div>';
        if (section.cta_text) html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary">' + escapeHtml(section.cta_text) + '</a>';
        html += '</div></div>';
      }
      html += '</div>';
    }
    if (position !== 'overlay') {
      html += '<div class="image-text__content">';
      if (section.title) html += '<h2 class="image-text__title">' + escapeHtml(section.title) + '</h2>';
      if (section.text) html += '<div class="image-text__text">' + markdownToHtml(section.text) + '</div>';
      if (section.cta_text) html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary">' + escapeHtml(section.cta_text) + '</a>';
      html += '</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderCustomHtml(section) {
    var id = section.id || generateId();
    var html = '<section class="custom-html-section" id="' + escapeHtml(id) + '">';
    if (section.css) {
      html += '<style>' + section.css + '</style>';
    }
    if (section.html) {
      html += section.html;
    } else {
      html += '<div class="custom-html__placeholder">[Add custom HTML content]</div>';
    }
    html += '</section>';
    return html;
  }

  function renderAccordion(section) {
    var accordionId = generateId();
    var expandFirst = section.expand_first !== false;
    var html = '<section class="accordion-section"><div class="accordion-section__container">';
    if (section.title) html += '<h2 class="accordion-section__title">' + escapeHtml(section.title) + '</h2>';
    if (section.subtitle) html += '<p class="accordion-section__subtitle">' + escapeHtml(section.subtitle) + '</p>';
    var items = section.items || [];
    if (items.length > 0) {
      html += '<div class="accordion" id="' + accordionId + '">';
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var isOpen = expandFirst && i === 0;
        var itemId = accordionId + '-item-' + i;
        html += '<div class="accordion__item' + (isOpen ? ' accordion__item--open' : '') + '" data-accordion-item>';
        html += '<button class="accordion__header" data-accordion-toggle="' + itemId + '">';
        html += '<span class="accordion__question">' + escapeHtml(item.question || 'Question') + '</span>';
        html += '<span class="accordion__icon">' + (isOpen ? '−' : '+') + '</span>';
        html += '</button>';
        html += '<div class="accordion__content" id="' + itemId + '" style="' + (isOpen ? '' : 'display: none;') + '">';
        html += '<div class="accordion__answer">' + markdownToHtml(item.answer || '') + '</div>';
        html += '</div></div>';
      }
      html += '</div>';
      html += '<script>(function(){var acc=document.getElementById("' + accordionId + '");if(!acc)return;acc.addEventListener("click",function(e){var toggle=e.target.closest("[data-accordion-toggle]");if(!toggle)return;var item=toggle.closest("[data-accordion-item]");var content=item.querySelector(".accordion__content");var icon=toggle.querySelector(".accordion__icon");var isOpen=item.classList.contains("accordion__item--open");if(isOpen){item.classList.remove("accordion__item--open");content.style.display="none";icon.textContent="+";}else{item.classList.add("accordion__item--open");content.style.display="block";icon.textContent="−";}});})();</script>';
    } else {
      html += '<div class="accordion__empty">[Add FAQ items]</div>';
    }
    html += '</div></section>';
    return html;
  }

  function renderCountdown(section) {
    var countdownId = generateId();
    var style = section.style || 'default';
    var targetDate = section.target_date || '';
    var expiredMsg = section.expired_message || 'Event has started!';
    var html = '<section class="countdown-section countdown-section--' + style + '"><div class="countdown-section__container">';
    if (section.title) html += '<h2 class="countdown-section__title">' + escapeHtml(section.title) + '</h2>';
    html += '<div class="countdown" id="' + countdownId + '" data-target="' + escapeHtml(targetDate) + '" data-expired="' + escapeHtml(expiredMsg) + '">';
    html += '<div class="countdown__unit"><span class="countdown__value" data-days>--</span><span class="countdown__label">Days</span></div>';
    html += '<div class="countdown__unit"><span class="countdown__value" data-hours>--</span><span class="countdown__label">Hours</span></div>';
    html += '<div class="countdown__unit"><span class="countdown__value" data-minutes>--</span><span class="countdown__label">Minutes</span></div>';
    html += '<div class="countdown__unit"><span class="countdown__value" data-seconds>--</span><span class="countdown__label">Seconds</span></div>';
    html += '</div>';
    html += '<div class="countdown__expired" id="' + countdownId + '-expired" style="display: none;">' + escapeHtml(expiredMsg) + '</div>';
    if (section.cta_text) {
      html += '<div class="countdown__cta"><a href="' + escapeHtml(section.cta_link || '#') + '" class="btn btn--primary">' + escapeHtml(section.cta_text) + '</a></div>';
    }
    html += '<script>(function(){var el=document.getElementById("' + countdownId + '");if(!el)return;var target=new Date(el.getAttribute("data-target")).getTime();var expiredEl=document.getElementById("' + countdownId + '-expired");function update(){var now=new Date().getTime();var diff=target-now;if(diff<=0){el.style.display="none";if(expiredEl)expiredEl.style.display="block";return;}var days=Math.floor(diff/(1000*60*60*24));var hours=Math.floor((diff%(1000*60*60*24))/(1000*60*60));var mins=Math.floor((diff%(1000*60*60))/(1000*60));var secs=Math.floor((diff%(1000*60))/1000);var dEl=el.querySelector("[data-days]");var hEl=el.querySelector("[data-hours]");var mEl=el.querySelector("[data-minutes]");var sEl=el.querySelector("[data-seconds]");if(dEl)dEl.textContent=days;if(hEl)hEl.textContent=hours<10?"0"+hours:hours;if(mEl)mEl.textContent=mins<10?"0"+mins:mins;if(sEl)sEl.textContent=secs<10?"0"+secs:secs;}update();setInterval(update,1000);})();</script>';
    html += '</div></section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION ROUTER (All 26 types)
  // ─────────────────────────────────────────────────────────────────────────

  function renderSection(section) {
    if (!section || !section.type) {
      return '<div class="preview-error">Unknown section (no type)</div>';
    }
    switch (section.type) {
      case 'hero': return renderHero(section);
      case 'curator': return renderCurator(section);
      case 'artwork': return renderArtwork(section);
      case 'auction': return renderAuction(section);
      case 'email_capture': return renderEmailCapture(section);
      case 'charity': return renderCharity(section);
      case 'thanks': return renderThanks(section);
      case 'text_block': return renderTextBlock(section);
      case 'gallery': return renderGallery(section);
      case 'cta': return renderCta(section);
      case 'video': return renderVideo(section);
      case 'quote': return renderQuote(section);
      case 'stats': return renderStats(section);
      case 'downloads': return renderDownloads(section);
      case 'spacer': return renderSpacer(section);
      case 'divider': return renderDivider(section);
      case 'two_column': return renderTwoColumn(section);
      case 'feature_grid': return renderFeatureGrid(section);
      case 'timeline': return renderTimeline(section);
      case 'team': return renderTeam(section);
      case 'logo_grid': return renderLogoGrid(section);
      case 'map': return renderMap(section);
      case 'image_text': return renderImageText(section);
      case 'custom_html': return renderCustomHtml(section);
      case 'accordion': return renderAccordion(section);
      case 'countdown': return renderCountdown(section);
      default:
        return '<div class="preview-error" style="padding: 1rem; background: #ff4444; color: white; text-align: center;">Unknown section type: ' + escapeHtml(section.type) + '</div>';
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE WRAPPER
  // ─────────────────────────────────────────────────────────────────────────

  function PageWrapper(content, options) {
    options = options || {};
    var showHeader = options.showHeader !== false;
    var showFooter = options.showFooter !== false;
    var pageClass = options.pageClass || '';
    
    var html = '<div class="preview-page ' + pageClass + '">';
    
    if (showHeader) {
      html += '<header class="preview-header">';
      html += '<div class="preview-header__inner">';
      html += '<a href="/" class="preview-header__logo">';
      html += '<img src="/images/logo.png" alt="ZYBORN" style="height: 32px; width: auto;">';
      html += '</a>';
      html += '<nav class="preview-header__nav">';
      html += '<a href="#artwork">Artwork</a>';
      html += '<a href="#curator">Curator</a>';
      html += '<a href="#auction">Auction</a>';
      html += '<a href="#charity">Charity</a>';
      html += '<a href="https://auction.zyborn.com" class="preview-header__auction-btn">ENTER AUCTION →</a>';
      html += '</nav>';
      html += '</div>';
      html += '</header>';
    }
    
    html += '<main class="preview-main">' + content + '</main>';
    
    if (showFooter) {
      html += '<footer class="preview-footer">';
      html += '<div class="preview-footer__inner">';
      html += '<div class="preview-footer__divider"></div>';
      html += '<div class="preview-footer__grid">';
      html += '<div class="preview-footer__col"><h4>ZYBORN ART</h4><ul><li><a href="#">About</a></li><li><a href="#">Future charity</a></li></ul></div>';
      html += '<div class="preview-footer__col"><h4>Visit</h4><ul><li><a href="#">Map & directions</a></li></ul></div>';
      html += '<div class="preview-footer__col"><h4>Connect</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">X</a></li></ul></div>';
      html += '</div>';
      html += '<div class="preview-footer__bottom">';
      html += '<p>© 2009 ZYBORN ART. All rights reserved.</p>';
      html += '<div class="preview-footer__legal"><a href="#">Privacy</a> / <a href="#">Terms</a> / <span>No Cookies</span></div>';
      html += '</div>';
      html += '</div>';
      html += '</footer>';
    }
    
    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PAGE PREVIEW TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────

  var HomePreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var sectionsData = entry.getIn(['data', 'sections']);
      var sections = toArray(sectionsData);
      var sectionsHtml = '';
      if (sections && sections.length > 0) {
        for (var i = 0; i < sections.length; i++) {
          sectionsHtml += renderSection(sections[i]);
        }
      } else {
        sectionsHtml = '<div class="preview-empty">No sections added yet. Add sections using the editor.</div>';
      }
      var content = PageWrapper(sectionsHtml, { pageClass: 'preview-page--home' });
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  var CuratorialPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var widgetFor = this.props.widgetFor;
      var title = get(entry, 'title', 'Curatorial Essay');
      var curator_name = get(entry, 'curator_name', '');
      var curator_title = get(entry, 'curator_title', '');
      var curator_bio = get(entry, 'curator_bio', '');
      var curator_image = get(entry, 'curator_image', '');
      var curator_website = get(entry, 'curator_website', '');
      var essay_title = get(entry, 'essay_title', title);
      var essay_date = get(entry, 'essay_date', '');
      var featured_image = get(entry, 'featured_image', '');
      var featured_image_caption = get(entry, 'featured_image_caption', '');
      
      var essayContent = '';
      essayContent += '<section class="curatorial-hero"><div class="curatorial-hero__inner">';
      essayContent += '<p class="curatorial-hero__label">Curatorial Essay</p>';
      essayContent += '<h1 class="curatorial-hero__title">' + escapeHtml(essay_title) + '</h1>';
      if (curator_name) essayContent += '<p class="curatorial-hero__author">by ' + escapeHtml(curator_name) + '</p>';
      if (essay_date) essayContent += '<p class="curatorial-hero__date">' + escapeHtml(essay_date) + '</p>';
      essayContent += '</div></section>';
      
      if (featured_image) {
        essayContent += '<div class="curatorial-featured-image">';
        essayContent += '<img src="' + escapeHtml(featured_image) + '" alt="' + escapeHtml(featured_image_caption || essay_title) + '">';
        if (featured_image_caption) essayContent += '<p class="curatorial-featured-image__caption">' + escapeHtml(featured_image_caption) + '</p>';
        essayContent += '</div>';
      }
      
      essayContent += '<article class="curatorial-body"><div class="curatorial-body__content">';
      var bodyWidget = widgetFor('body');
      if (bodyWidget) {
        essayContent += '<div class="curatorial-body__text" id="essay-body-placeholder"></div>';
      } else {
        essayContent += '<div class="curatorial-body__text"><p>Essay content will appear here...</p></div>';
      }
      essayContent += '</div></article>';
      
      if (curator_name) {
        essayContent += '<aside class="curatorial-author"><div class="curatorial-author__inner">';
        if (curator_image) essayContent += '<img src="' + escapeHtml(curator_image) + '" alt="' + escapeHtml(curator_name) + '" class="curatorial-author__image">';
        essayContent += '<div class="curatorial-author__info">';
        essayContent += '<h3 class="curatorial-author__name">' + escapeHtml(curator_name) + '</h3>';
        if (curator_title) essayContent += '<p class="curatorial-author__title">' + escapeHtml(curator_title) + '</p>';
        if (curator_bio) essayContent += '<p class="curatorial-author__bio">' + escapeHtml(curator_bio) + '</p>';
        if (curator_website) essayContent += '<a href="' + escapeHtml(curator_website) + '" class="curatorial-author__link" target="_blank">Visit Website →</a>';
        essayContent += '</div></div></aside>';
      }
      
      var content = PageWrapper(essayContent, { pageClass: 'preview-page--curatorial' });
      if (bodyWidget) {
        return h('div', { className: 'preview-container' },
          h('div', { dangerouslySetInnerHTML: { __html: content } }),
          h('div', { style: { display: 'none' } }, bodyWidget)
        );
      }
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  var PressPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var widgetFor = this.props.widgetFor;
      var hero_label = get(entry, 'hero_label', 'PRESS & MEDIA');
      var hero_title = get(entry, 'hero_title', 'Media Resources');
      var hero_subtitle = get(entry, 'hero_subtitle', '');
      var contact_email = get(entry, 'contact_email', 'press@zyborn.com');
      var downloadsData = entry.getIn(['data', 'downloads']);
      var downloads = toArray(downloadsData);
      
      var pressContent = '';
      pressContent += '<section class="press-hero"><div class="press-hero__inner">';
      pressContent += '<p class="press-hero__label">' + escapeHtml(hero_label) + '</p>';
      pressContent += '<h1 class="press-hero__title">' + escapeHtml(hero_title) + '</h1>';
      if (hero_subtitle) pressContent += '<p class="press-hero__subtitle">' + escapeHtml(hero_subtitle) + '</p>';
      pressContent += '</div></section>';
      
      if (downloads && downloads.length > 0) {
        var iconMap = { 'document': '📄', 'folder': '📁', 'image': '🖼️', 'archive': '📦', 'video': '🎬' };
        pressContent += '<section class="press-downloads"><div class="press-downloads__inner">';
        pressContent += '<h2 class="press-downloads__title">Quick Downloads</h2>';
        pressContent += '<div class="press-downloads__grid">';
        for (var i = 0; i < downloads.length; i++) {
          var dl = downloads[i];
          var icon = iconMap[dl.icon] || '📄';
          pressContent += '<div class="press-downloads__card">';
          pressContent += '<span class="press-downloads__icon">' + icon + '</span>';
          pressContent += '<span class="press-downloads__label">' + escapeHtml(dl.label || 'Download') + '</span>';
          if (dl.format) pressContent += '<span class="press-downloads__format">' + escapeHtml(dl.format) + '</span>';
          pressContent += '<a href="' + escapeHtml(dl.file || '#') + '" class="btn btn--primary" download>DOWNLOAD</a>';
          pressContent += '</div>';
        }
        pressContent += '</div></div></section>';
      }
      
      var bodyWidget = widgetFor('body');
      if (bodyWidget) {
        pressContent += '<section class="press-content"><div class="press-content__inner" id="press-body-placeholder"></div></section>';
      }
      
      pressContent += '<section class="press-contact"><div class="press-contact__inner">';
      pressContent += '<h2 class="press-contact__title">Press Inquiries</h2>';
      pressContent += '<p class="press-contact__text">For interviews, image requests, or media inquiries:</p>';
      pressContent += '<a href="mailto:' + escapeHtml(contact_email) + '" class="press-contact__email">' + escapeHtml(contact_email) + '</a>';
      pressContent += '</div></section>';
      
      var content = PageWrapper(pressContent, { pageClass: 'preview-page--press' });
      if (bodyWidget) {
        return h('div', { className: 'preview-container' },
          h('div', { dangerouslySetInnerHTML: { __html: content } }),
          h('div', { style: { display: 'none' } }, bodyWidget)
        );
      }
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  var CustomPagePreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var widgetFor = this.props.widgetFor;
      var title = get(entry, 'title', 'Custom Page');
      var show_header = entry.getIn(['data', 'show_header']);
      var show_footer = entry.getIn(['data', 'show_footer']);
      var layout = get(entry, 'layout', 'default');
      show_header = show_header !== false;
      show_footer = show_footer !== false;
      var sectionsData = entry.getIn(['data', 'sections']);
      var sections = toArray(sectionsData);
      
      var pageContent = '';
      if (sections && sections.length > 0) {
        for (var i = 0; i < sections.length; i++) {
          pageContent += renderSection(sections[i]);
        }
      } else {
        var bodyWidget = widgetFor('body');
        if (bodyWidget) {
          pageContent += '<article class="custom-page-content"><div class="custom-page-content__inner">';
          pageContent += '<h1 class="custom-page-content__title">' + escapeHtml(title) + '</h1>';
          pageContent += '<div class="custom-page-content__body" id="custom-body-placeholder"></div>';
          pageContent += '</div></article>';
          var content = PageWrapper(pageContent, { showHeader: show_header, showFooter: show_footer, pageClass: 'preview-page--custom preview-page--layout-' + layout });
          return h('div', { className: 'preview-container' },
            h('div', { dangerouslySetInnerHTML: { __html: content } }),
            h('div', { style: { display: 'none' } }, bodyWidget)
          );
        }
        pageContent += '<div class="preview-empty"><h1>' + escapeHtml(title) + '</h1><p>Add sections or body content using the editor.</p></div>';
      }
      
      var content = PageWrapper(pageContent, { showHeader: show_header, showFooter: show_footer, pageClass: 'preview-page--custom preview-page--layout-' + layout });
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // REGISTER PREVIEW TEMPLATES
  // ─────────────────────────────────────────────────────────────────────────

  CMS.registerPreviewTemplate('home', HomePreview);
  CMS.registerPreviewTemplate('curatorial', CuratorialPreview);
  CMS.registerPreviewTemplate('press', PressPreview);
  CMS.registerPreviewTemplate('custom_pages', CustomPagePreview);

  // ─────────────────────────────────────────────────────────────────────────
  // EXPORT TO WINDOW
  // ─────────────────────────────────────────────────────────────────────────
  
  window.ZybornPreview = {
    get: get,
    toArray: toArray,
    markdownToHtml: markdownToHtml,
    escapeHtml: escapeHtml,
    generateId: generateId,
    getVideoEmbedUrl: getVideoEmbedUrl,
    renderSection: renderSection,
    PageWrapper: PageWrapper,
    HomePreview: HomePreview,
    CuratorialPreview: CuratorialPreview,
    PressPreview: PressPreview,
    CustomPagePreview: CustomPagePreview
  };

  console.log('[ZYBORN Preview] Loaded with external CSS');
  console.log('[ZYBORN Preview] Templates: home, curatorial, press, custom_pages');

})();
