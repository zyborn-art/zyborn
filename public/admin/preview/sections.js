// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Section Renderers (26 types)
// HTML structure matches live site Nunjucks templates exactly
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;
  var escapeHtml = Z.escapeHtml;
  var markdownToHtml = Z.markdownToHtml;
  var generateId = Z.generateId;
  var getVideoEmbedUrl = Z.getVideoEmbedUrl;
  var getIconSvg = Z.getIconSvg;
  var getDownloadIcon = Z.getDownloadIcon;

  // SVG Icons used in sections
  var ICONS = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
  };

  // ─────────────────────────────────────────────────────────────────────────
  // HERO SECTION - Matches src/_includes/sections/hero.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderHero(section) {
    var html = '<section class="hero" id="hero">';
    html += '<div class="container hero-inner">';
    
    // Hero content (left column)
    html += '<div class="hero-content">';
    
    // Pre-headline / Label
    if (section.pre_headline) {
      html += '<p class="meta hero-label">' + escapeHtml(section.pre_headline) + '</p>';
    }
    
    // Title
    html += '<h1 class="hero-title">' + escapeHtml(section.headline || 'Headline') + '</h1>';
    
    // Subtitle
    if (section.subheadline) {
      html += '<p class="hero-subtitle">' + escapeHtml(section.subheadline) + '</p>';
    }
    
    // Email form
    var emailForm = section.email_form || {};
    var showForm = emailForm.show !== false && section.show_form !== false;
    if (showForm) {
      html += '<div class="hero-form">';
      html += '<form>';
      html += '<input type="email" class="form-input" placeholder="' + escapeHtml(emailForm.placeholder || 'Enter your email') + '" disabled>';
      
      // Interests dropdown
      var showInterests = emailForm.show_interests !== false;
      var interests = emailForm.interests || section.interests || [];
      if (showInterests && (interests.length > 0 || emailForm.interests_label)) {
        html += '<select class="form-select" disabled>';
        html += '<option value="">' + escapeHtml(emailForm.interests_label || 'I am interested as...') + '</option>';
        for (var i = 0; i < interests.length; i++) {
          if (interests[i] && (interests[i].option || typeof interests[i] === 'string')) {
            var opt = typeof interests[i] === 'object' ? interests[i].option : interests[i];
            if (opt) {
              html += '<option value="' + escapeHtml(opt) + '">' + escapeHtml(opt) + '</option>';
            }
          }
        }
        html += '</select>';
      }
      
      html += '<button type="button" class="btn-primary" disabled>' + escapeHtml(emailForm.button_text || 'Notify Me') + '</button>';
      html += '</form>';
      
      // Microcopy
      if (section.microcopy) {
        html += '<p class="meta hero-microcopy">' + escapeHtml(section.microcopy) + '</p>';
      }
      
      html += '</div>';
    }
    
    // CTA button
    var cta = section.cta || {};
    var showCta = cta.show !== false;
    var ctaText = cta.text || section.cta_text;
    var ctaLink = cta.link || section.cta_link;
    if (showCta && ctaText) {
      html += '<div style="margin-top: 24px;">';
      html += '<a href="' + escapeHtml(ctaLink || '#') + '" class="btn-primary" style="font-size: 16px; padding: 18px 36px;">' + escapeHtml(ctaText) + ' →</a>';
      html += '</div>';
    }
    
    // Social links
    if (section.show_social === true) {
      html += '<div class="hero-social">';
      html += '<a href="#" aria-label="Instagram">' + ICONS.instagram + '</a>';
      html += '<a href="#" aria-label="X (Twitter)">' + ICONS.twitter + '</a>';
      html += '<a href="#" aria-label="TikTok">' + ICONS.tiktok + '</a>';
      html += '<a href="#" aria-label="YouTube">' + ICONS.youtube + '</a>';
      html += '</div>';
    }
    
    html += '</div>'; // End hero-content
    
    // Hero image (right column)
    if (section.hero_image) {
      html += '<div class="hero-image">';
      html += '<img src="' + escapeHtml(section.hero_image) + '" alt="' + escapeHtml(section.hero_image_alt || '') + '">';
      html += '</div>';
    }
    
    html += '</div>'; // End hero-inner
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CURATOR SECTION - Matches src/_includes/sections/curator.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderCurator(section) {
    var html = '<section class="curator" id="curator">';
    html += '<div class="container">';
    html += '<div class="curator-card">';
    
    if (section.label) {
      html += '<p class="meta curator-label">' + escapeHtml(section.label) + '</p>';
    }
    if (section.name) {
      html += '<h3 class="curator-name">' + escapeHtml(section.name) + '</h3>';
    }
    if (section.essay_title) {
      html += '<h2 class="curator-title">' + escapeHtml(section.essay_title) + '</h2>';
    }
    if (section.excerpt) {
      html += '<p class="curator-text">' + escapeHtml(section.excerpt) + '</p>';
    }
    if (section.excerpt_2) {
      html += '<p class="curator-text">' + escapeHtml(section.excerpt_2) + '</p>';
    }
    if (section.read_more_link) {
      html += '<a href="' + escapeHtml(section.read_more_link) + '" class="btn-secondary btn-dark">' + escapeHtml(section.read_more_text || 'Read More') + '</a>';
    }
    
    html += '</div>'; // End curator-card
    html += '</div>'; // End container
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ARTWORK SECTION - Matches src/_includes/sections/artwork.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderArtwork(section) {
    var html = '<section class="artwork" id="artwork">';
    html += '<div class="container">';
    
    // Header
    html += '<div class="artwork-header">';
    html += '<p class="meta artwork-label">Artwork Details</p>';
    html += '<h2 class="artwork-title">Technical Specifications</h2>';
    html += '</div>';
    
    // Grid
    html += '<div class="artwork-grid">';
    
    // Specs column
    html += '<div class="artwork-specs">';
    if (section.title) {
      html += '<div class="spec-row"><span class="meta spec-label">Title</span><span class="spec-value">' + escapeHtml(section.title) + '</span></div>';
    }
    if (section.artist) {
      html += '<div class="spec-row"><span class="meta spec-label">Artist</span><span class="spec-value">' + escapeHtml(section.artist) + '</span></div>';
    }
    if (section.medium) {
      html += '<div class="spec-row"><span class="meta spec-label">Medium</span><span class="spec-value">' + escapeHtml(section.medium) + '</span></div>';
    }
    if (section.dimensions) {
      html += '<div class="spec-row"><span class="meta spec-label">Dimensions</span><span class="spec-value">' + escapeHtml(section.dimensions) + '</span></div>';
    }
    if (section.edition) {
      html += '<div class="spec-row"><span class="meta spec-label">Edition</span><span class="spec-value">' + escapeHtml(section.edition) + '</span></div>';
    }
    if (section.framing) {
      html += '<div class="spec-row"><span class="meta spec-label">Framing</span><span class="spec-value">' + escapeHtml(section.framing) + '</span></div>';
    }
    html += '</div>'; // End artwork-specs
    
    // Inclusions column
    var inclusions = section.inclusions || [];
    if (inclusions.length > 0) {
      html += '<div class="artwork-inclusions">';
      html += '<h3>Included with purchase</h3>';
      html += '<ul class="inclusion-list">';
      for (var i = 0; i < inclusions.length; i++) {
        if (inclusions[i]) {
          var item = typeof inclusions[i] === 'object' ? inclusions[i].item : inclusions[i];
          if (item) {
            html += '<li>' + ICONS.check + '<span>' + escapeHtml(item) + '</span></li>';
          }
        }
      }
      html += '</ul>';
      html += '</div>'; // End artwork-inclusions
    }
    
    html += '</div>'; // End artwork-grid
    html += '</div>'; // End container
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // AUCTION SECTION - Matches src/_includes/sections/auction.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderAuction(section) {
    var html = '<section class="auction" id="auction">';
    html += '<div class="container">';
    html += '<div class="auction-inner">';
    
    if (section.label) {
      html += '<p class="meta auction-label">' + escapeHtml(section.label) + '</p>';
    }
    html += '<h2 class="auction-title">' + escapeHtml(section.title || 'Auction') + '</h2>';
    if (section.description) {
      html += '<p class="auction-desc">' + escapeHtml(section.description) + '</p>';
    }
    
    html += '<div class="auction-info">';
    if (section.date) {
      html += '<div class="auction-item">';
      html += '<p class="meta auction-item-label">Date</p>';
      html += '<p class="auction-item-value">' + escapeHtml(section.date) + '</p>';
      if (section.date_sub) html += '<p class="auction-item-sub">' + escapeHtml(section.date_sub) + '</p>';
      html += '</div>';
    }
    if (section.estimate) {
      html += '<div class="auction-item">';
      html += '<p class="meta auction-item-label">Estimate</p>';
      html += '<p class="auction-item-value">' + escapeHtml(section.estimate) + '</p>';
      if (section.estimate_sub) html += '<p class="auction-item-sub">' + escapeHtml(section.estimate_sub) + '</p>';
      html += '</div>';
    }
    if (section.format) {
      html += '<div class="auction-item">';
      html += '<p class="meta auction-item-label">Format</p>';
      html += '<p class="auction-item-value">' + escapeHtml(section.format) + '</p>';
      html += '</div>';
    }
    html += '</div>'; // End auction-info
    
    if (section.cta_text) {
      html += '<div class="auction-cta">';
      html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn-primary">' + escapeHtml(section.cta_text) + '</a>';
      html += '</div>';
    }
    if (section.note) {
      html += '<p class="auction-note">' + escapeHtml(section.note) + '</p>';
    }
    
    html += '</div>'; // End auction-inner
    html += '</div>'; // End container
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // EMAIL CAPTURE SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderEmailCapture(section) {
    var html = '<section class="email-capture">';
    html += '<div class="container">';
    html += '<div class="email-capture-card">';
    
    html += '<div class="email-left">';
    if (section.headline) html += '<h2 class="email-left-headline">' + escapeHtml(section.headline) + '</h2>';
    if (section.text) html += '<p class="email-left-text">' + escapeHtml(section.text) + '</p>';
    html += '</div>';
    
    html += '<div class="email-right">';
    if (section.form_title) html += '<h2>' + escapeHtml(section.form_title) + '</h2>';
    if (section.form_subtitle) html += '<p class="email-right-subtitle">' + escapeHtml(section.form_subtitle) + '</p>';
    html += '<div class="email-form">';
    html += '<input type="email" class="form-input" placeholder="Enter your email" disabled>';
    html += '<button type="button" class="btn-primary" disabled>' + escapeHtml(section.button_text || 'Subscribe') + '</button>';
    html += '</div>';
    html += '</div>';
    
    html += '</div>'; // End email-capture-card
    html += '</div>'; // End container
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CHARITY SECTION - Matches src/_includes/sections/charity.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderCharity(section) {
    var html = '<section class="charity" id="charity">';
    html += '<div class="container">';
    html += '<div class="charity-inner">';
    
    if (section.label) {
      html += '<p class="meta charity-label">' + escapeHtml(section.label) + '</p>';
    }
    html += '<h2 class="charity-title">' + escapeHtml(section.title || 'Impact') + '</h2>';
    if (section.text) {
      html += '<div class="charity-text">' + markdownToHtml(section.text) + '</div>';
    }
    
    html += '</div>'; // End charity-inner
    html += '</div>'; // End container
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THANKS SECTION - Matches src/_includes/sections/thanks.njk
  // ─────────────────────────────────────────────────────────────────────────

  function renderThanks(section) {
    var html = '<section class="thanks">';
    html += '<div class="container">';
    if (section.text) {
      html += '<p>' + escapeHtml(section.text) + '</p>';
    }
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TEXT BLOCK SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderTextBlock(section) {
    var background = section.background || 'default';
    var html = '<section class="section-text-block text-block--' + background + '">';
    html += '<div class="container">';
    
    if (section.label) {
      html += '<p class="meta section-label">' + escapeHtml(section.label) + '</p>';
    }
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.content) {
      html += '<div class="text-content">' + markdownToHtml(section.content) + '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GALLERY SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderGallery(section) {
    var columns = section.columns || '3';
    var html = '<section class="section-gallery">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.subtitle) {
      html += '<p class="section-subtitle">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var images = section.images || [];
    if (images.length > 0) {
      html += '<div class="gallery-grid columns-' + columns + '">';
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
        if (img && img.src) {
          html += '<figure class="gallery-item">';
          html += '<img src="' + escapeHtml(img.src) + '" alt="' + escapeHtml(img.alt || '') + '">';
          if (img.caption) {
            html += '<figcaption><span class="gallery-caption">' + escapeHtml(img.caption) + '</span></figcaption>';
          }
          html += '</figure>';
        }
      }
      html += '</div>';
    } else {
      html += '<div style="padding: 2rem; text-align: center; color: #666;">[Add images to gallery]</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CTA SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderCta(section) {
    var html = '<section class="section-cta" style="background: var(--color-black); padding: 80px 0; text-align: center;">';
    html += '<div class="container">';
    
    if (section.headline) {
      html += '<h2 class="section-title" style="color: var(--color-white);">' + escapeHtml(section.headline) + '</h2>';
    }
    if (section.text) {
      html += '<p style="color: var(--color-steel-300); margin-bottom: 2rem;">' + escapeHtml(section.text) + '</p>';
    }
    if (section.button_text) {
      html += '<a href="' + escapeHtml(section.button_link || '#') + '" class="btn-primary">' + escapeHtml(section.button_text) + '</a>';
    }
    if (section.note) {
      html += '<p style="color: var(--color-steel-600); margin-top: 1rem; font-size: 14px;">' + escapeHtml(section.note) + '</p>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // VIDEO SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderVideo(section) {
    var embedUrl = getVideoEmbedUrl(section.video_url);
    var html = '<section class="section-video">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title" style="color: var(--color-white); text-align: center;">' + escapeHtml(section.title) + '</h2>';
    }
    
    html += '<div class="video-wrapper aspect-16-9">';
    if (embedUrl) {
      html += '<iframe src="' + escapeHtml(embedUrl) + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else {
      html += '<div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666;">[Enter a YouTube or Vimeo URL]</div>';
    }
    html += '</div>';
    
    if (section.caption) {
      html += '<p class="video-caption">' + escapeHtml(section.caption) + '</p>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // QUOTE SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderQuote(section) {
    var html = '<section class="section-quote">';
    html += '<div class="container">';
    html += '<div class="quote-block">';
    
    html += '<p class="quote-text">"' + escapeHtml(section.text || 'Quote text here...') + '"</p>';
    
    html += '<div class="quote-footer">';
    if (section.attribution) {
      html += '<cite class="quote-attribution">' + escapeHtml(section.attribution) + '</cite>';
    }
    if (section.attribution_title) {
      html += '<span class="quote-title">' + escapeHtml(section.attribution_title) + '</span>';
    }
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // STATS SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderStats(section) {
    var style = section.style || 'default';
    var columns = section.columns || '3';
    var html = '<section class="section-stats stats--' + style + '">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title" style="text-align: center;">' + escapeHtml(section.title) + '</h2>';
    }
    
    var items = section.items || [];
    if (items.length > 0) {
      html += '<div class="stats-grid columns-' + columns + '">';
      for (var i = 0; i < items.length; i++) {
        if (items[i]) {
          html += '<div class="stat-item">';
          html += '<span class="stat-value">' + escapeHtml(items[i].value || '0') + '</span>';
          html += '<span class="meta stat-label">' + escapeHtml(items[i].label || 'Label') + '</span>';
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DOWNLOADS SECTION
  // ─────────────────────────────────────────────────────────────────────────

  function renderDownloads(section) {
    var html = '<section class="section-downloads">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    
    var files = section.files || [];
    if (files.length > 0) {
      html += '<ul class="download-list">';
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file && file.label) {
          html += '<li class="download-item">';
          html += '<div class="download-icon">' + getDownloadIcon(file.icon || 'document') + '</div>';
          html += '<div class="download-info">';
          html += '<a href="' + escapeHtml(file.file || '#') + '" class="download-label" target="_blank">' + escapeHtml(file.label) + '</a>';
          if (file.description) html += '<span class="download-description">' + escapeHtml(file.description) + '</span>';
          if (file.format) html += '<span class="download-format">' + escapeHtml(file.format) + '</span>';
          html += '</div>';
          html += '</li>';
        }
      }
      html += '</ul>';
    } else {
      html += '<div style="padding: 2rem; text-align: center; color: #666;">[Add downloadable files]</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SPACER
  // ─────────────────────────────────────────────────────────────────────────

  function renderSpacer(section) {
    var size = section.size || 'medium';
    return '<div class="spacer spacer--' + size + '"></div>';
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DIVIDER
  // ─────────────────────────────────────────────────────────────────────────

  function renderDivider(section) {
    var style = section.style || 'line';
    var width = section.width || 'medium';
    var spacing = section.spacing || 'medium';
    var html = '<div class="section-divider style-' + style + ' width-' + width + ' spacing-' + spacing + '">';
    html += '<hr class="divider-line">';
    html += '</div>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TWO COLUMN
  // ─────────────────────────────────────────────────────────────────────────

  function renderTwoColumn(section) {
    var layout = section.layout || 'equal';
    var background = section.background || 'default';
    var html = '<section class="section-split" style="background: var(--color-' + (background === 'light' ? 'steel-100' : 'black') + '); padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title" style="margin-bottom: 2rem;">' + escapeHtml(section.title) + '</h2>';
    }
    
    html += '<div class="split-container">';
    
    var left = section.left || {};
    html += '<div class="split-left">';
    if (left.type === 'image' && left.image) {
      html += '<img src="' + escapeHtml(left.image) + '" alt="' + escapeHtml(left.image_alt || '') + '" class="split-image">';
    } else if (left.text) {
      html += '<div class="split-content">' + markdownToHtml(left.text) + '</div>';
    }
    html += '</div>';
    
    var right = section.right || {};
    html += '<div class="split-right">';
    if (right.type === 'image' && right.image) {
      html += '<img src="' + escapeHtml(right.image) + '" alt="' + escapeHtml(right.image_alt || '') + '" class="split-image">';
    } else if (right.text) {
      html += '<div class="split-content">' + markdownToHtml(right.text) + '</div>';
    }
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FEATURE GRID
  // ─────────────────────────────────────────────────────────────────────────

  function renderFeatureGrid(section) {
    var columns = section.columns || '3';
    var html = '<section class="section-feature-grid" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.subtitle) {
      html += '<p class="section-subtitle">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var features = section.features || [];
    if (features.length > 0) {
      html += '<div class="feature-grid columns-' + columns + '">';
      for (var i = 0; i < features.length; i++) {
        var f = features[i];
        if (f) {
          html += '<div class="feature-card">';
          if (f.icon) html += '<span class="feature-icon">' + escapeHtml(f.icon) + '</span>';
          html += '<h3 class="feature-title">' + escapeHtml(f.title || '') + '</h3>';
          html += '<p class="feature-description">' + escapeHtml(f.description || '') + '</p>';
          if (f.link) html += '<a href="' + escapeHtml(f.link) + '" class="feature-link">Learn more →</a>';
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TIMELINE
  // ─────────────────────────────────────────────────────────────────────────

  function renderTimeline(section) {
    var layout = section.layout || 'vertical';
    var html = '<section class="section-timeline layout-' + layout + '" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    
    var events = section.events || [];
    if (events.length > 0) {
      html += '<div class="timeline">';
      for (var i = 0; i < events.length; i++) {
        var e = events[i];
        if (e) {
          html += '<div class="timeline-item is-visible">';
          html += '<div class="timeline-marker"></div>';
          html += '<div class="timeline-content">';
          if (e.date) html += '<span class="timeline-date">' + escapeHtml(e.date) + '</span>';
          html += '<h3 class="timeline-title">' + escapeHtml(e.title || '') + '</h3>';
          if (e.description) html += '<p class="timeline-description">' + escapeHtml(e.description) + '</p>';
          if (e.image) html += '<img src="' + escapeHtml(e.image) + '" alt="">';
          html += '</div>';
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // TEAM
  // ─────────────────────────────────────────────────────────────────────────

  function renderTeam(section) {
    var columns = section.columns || '3';
    var html = '<section class="section-team" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.subtitle) {
      html += '<p class="section-subtitle">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var people = section.people || [];
    if (people.length > 0) {
      html += '<div class="team-grid columns-' + columns + '">';
      for (var i = 0; i < people.length; i++) {
        var p = people[i];
        if (p) {
          html += '<div class="team-card">';
          if (p.photo) {
            html += '<img src="' + escapeHtml(p.photo) + '" alt="' + escapeHtml(p.name || '') + '" class="team-photo">';
          } else {
            html += '<div class="team-photo-placeholder"></div>';
          }
          html += '<h3 class="team-name">' + escapeHtml(p.name || '') + '</h3>';
          if (p.role) html += '<p class="team-role">' + escapeHtml(p.role) + '</p>';
          if (p.bio) html += '<p class="team-bio">' + escapeHtml(p.bio) + '</p>';
          if (p.website || p.linkedin) {
            html += '<div class="team-links">';
            if (p.website) html += '<a href="' + escapeHtml(p.website) + '" target="_blank">Website</a>';
            if (p.linkedin) html += '<a href="' + escapeHtml(p.linkedin) + '" target="_blank">LinkedIn</a>';
            html += '</div>';
          }
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // LOGO GRID
  // ─────────────────────────────────────────────────────────────────────────

  function renderLogoGrid(section) {
    var columns = section.columns || '4';
    var grayscale = section.grayscale !== false;
    var html = '<section class="section-logo-grid' + (grayscale ? ' grayscale' : '') + '" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title" style="text-align: center;">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.subtitle) {
      html += '<p class="section-subtitle" style="text-align: center;">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var logos = section.logos || [];
    if (logos.length > 0) {
      html += '<div class="logo-grid columns-' + columns + '">';
      for (var i = 0; i < logos.length; i++) {
        var l = logos[i];
        if (l) {
          html += '<div class="logo-item">';
          if (l.link) html += '<a href="' + escapeHtml(l.link) + '" target="_blank" title="' + escapeHtml(l.name || '') + '">';
          html += '<img src="' + escapeHtml(l.logo || '') + '" alt="' + escapeHtml(l.name || '') + '">';
          if (l.link) html += '</a>';
          html += '</div>';
        }
      }
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MAP
  // ─────────────────────────────────────────────────────────────────────────

  function renderMap(section) {
    var html = '<section class="section-map" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    
    html += '<div class="map-wrapper">';
    html += '<div class="map-embed">';
    if (section.embed_url) {
      html += '<iframe src="' + escapeHtml(section.embed_url) + '" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>';
    } else {
      html += '<div style="height: 400px; background: #333; display: flex; align-items: center; justify-content: center; color: #666;">[Enter Google Maps embed URL]</div>';
    }
    html += '</div>';
    
    html += '<div class="map-info">';
    if (section.venue) html += '<h3 class="venue-name">' + escapeHtml(section.venue) + '</h3>';
    if (section.address) html += '<p class="venue-address">' + escapeHtml(section.address).replace(/\n/g, '<br>') + '</p>';
    if (section.directions_link) html += '<a href="' + escapeHtml(section.directions_link) + '" target="_blank" class="directions-link">Get Directions →</a>';
    if (section.info) html += '<div class="venue-info">' + markdownToHtml(section.info) + '</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // IMAGE TEXT
  // ─────────────────────────────────────────────────────────────────────────

  function renderImageText(section) {
    var position = section.text_position || 'overlay';
    var align = section.text_align || 'left';
    var html = '<section class="section-image-text position-' + position + ' align-' + align + '">';
    
    if (section.image) {
      html += '<img src="' + escapeHtml(section.image) + '" alt="' + escapeHtml(section.image_alt || '') + '" class="section-image">';
    }
    
    html += '<div class="text-content" style="' + (position === 'overlay' ? 'position: absolute; bottom: 0; left: 0; right: 0; padding: 3rem; background: linear-gradient(transparent, rgba(0,0,0,0.9));' : 'padding: 2rem 0;') + '">';
    if (section.title) html += '<h2>' + escapeHtml(section.title) + '</h2>';
    if (section.text) html += '<div>' + markdownToHtml(section.text) + '</div>';
    if (section.cta_text) html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn-primary">' + escapeHtml(section.cta_text) + '</a>';
    html += '</div>';
    
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CUSTOM HTML
  // ─────────────────────────────────────────────────────────────────────────

  function renderCustomHtml(section) {
    var html = '<section class="section-custom">';
    if (section.css) html += '<style>' + section.css + '</style>';
    html += '<div class="container">';
    if (section.html) html += section.html;
    else html += '<div style="padding: 2rem; text-align: center; color: #666;">[Add custom HTML content]</div>';
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // ACCORDION
  // ─────────────────────────────────────────────────────────────────────────

  function renderAccordion(section) {
    var html = '<section class="section-accordion" style="padding: 80px 0;">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>';
    }
    if (section.subtitle) {
      html += '<p class="section-subtitle">' + escapeHtml(section.subtitle) + '</p>';
    }
    
    var items = section.items || [];
    if (items.length > 0) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item) {
          var isOpen = i === 0;
          html += '<div class="accordion-item' + (isOpen ? ' is-open' : '') + '">';
          html += '<button class="accordion-header">';
          html += '<span>' + escapeHtml(item.question || 'Question') + '</span>';
          html += '<span class="accordion-icon">+</span>';
          html += '</button>';
          html += '<div class="accordion-content"' + (isOpen ? '' : ' style="max-height: 0; overflow: hidden;"') + '>';
          html += '<div>' + markdownToHtml(item.answer || '') + '</div>';
          html += '</div>';
          html += '</div>';
        }
      }
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // COUNTDOWN
  // ─────────────────────────────────────────────────────────────────────────

  function renderCountdown(section) {
    var style = section.style || 'default';
    var html = '<section class="section-countdown style-' + style + '">';
    html += '<div class="container">';
    
    if (section.title) {
      html += '<h2 class="section-title" style="text-align: center;">' + escapeHtml(section.title) + '</h2>';
    }
    
    html += '<div class="countdown-timer">';
    html += '<div class="countdown-unit"><span class="countdown-value">--</span><span class="countdown-label">Days</span></div>';
    html += '<div class="countdown-unit"><span class="countdown-value">--</span><span class="countdown-label">Hours</span></div>';
    html += '<div class="countdown-unit"><span class="countdown-value">--</span><span class="countdown-label">Minutes</span></div>';
    html += '<div class="countdown-unit"><span class="countdown-value">--</span><span class="countdown-label">Seconds</span></div>';
    html += '</div>';
    
    if (section.cta_text) {
      html += '<div class="countdown-cta" style="text-align: center; margin-top: 2rem;">';
      html += '<a href="' + escapeHtml(section.cta_link || '#') + '" class="btn-primary">' + escapeHtml(section.cta_text) + '</a>';
      html += '</div>';
    }
    
    html += '</div>';
    html += '</section>';
    return html;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SECTION ROUTER
  // ─────────────────────────────────────────────────────────────────────────

  function renderSection(section) {
    if (!section || !section.type) {
      return '<div style="padding: 1rem; background: #ff4444; color: white; text-align: center;">Unknown section (no type)</div>';
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
        return '<div style="padding: 1rem; background: #ff4444; color: white; text-align: center;">Unknown section type: ' + escapeHtml(section.type) + '</div>';
    }
  }

  // Export
  Z.renderSection = renderSection;

  console.log('[ZYBORN Preview] Sections loaded (26 types - matching live site HTML)');
})();
