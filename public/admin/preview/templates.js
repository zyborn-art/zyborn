// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Page Templates
// Aligned with live site Eleventy/Nunjucks templates
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;
  var get = Z.get;
  var toArray = Z.toArray;
  var escapeHtml = Z.escapeHtml;
  var markdownToHtml = Z.markdownToHtml;
  var renderSection = Z.renderSection;
  var PageWrapper = Z.PageWrapper;

  // ─────────────────────────────────────────────────────────────────────────
  // HOME PAGE PREVIEW
  // ─────────────────────────────────────────────────────────────────────────

  var HomePreview = createClass({
    render: function() {
      var entry = this.props.entry;
      
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Home page preview...')
        );
      }
      
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

  // ─────────────────────────────────────────────────────────────────────────
  // CURATORIAL PAGE PREVIEW
  // Matches: src/curatorial.njk structure
  // ─────────────────────────────────────────────────────────────────────────

  var CuratorialPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var widgetFor = this.props.widgetFor;
      
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Curatorial page preview...')
        );
      }
      
      // Get all fields from CMS config
      var article_type = get(entry, 'article_type', 'CURATORIAL RECOMMENDATION');
      var article_title = get(entry, 'article_title', 'Essay Title');
      var author = get(entry, 'author', '');
      var read_time = get(entry, 'read_time', '');
      var publish_date = get(entry, 'publish_date', '');
      
      // Curator info
      var curator = entry.getIn(['data', 'curator']);
      var curator_name = curator ? get({ getIn: function(path) { return curator.get ? curator.get(path[1]) : curator[path[1]]; } }, 'name', '') : '';
      var curator_title = curator ? get({ getIn: function(path) { return curator.get ? curator.get(path[1]) : curator[path[1]]; } }, 'title', '') : '';
      var curator_website = curator ? get({ getIn: function(path) { return curator.get ? curator.get(path[1]) : curator[path[1]]; } }, 'website', '') : '';
      var curator_linkedin = curator ? get({ getIn: function(path) { return curator.get ? curator.get(path[1]) : curator[path[1]]; } }, 'linkedin', '') : '';
      
      // Featured image
      var featured_image = entry.getIn(['data', 'featured_image']);
      var fi_src = featured_image ? (featured_image.get ? featured_image.get('src') : featured_image.src) : '';
      var fi_alt = featured_image ? (featured_image.get ? featured_image.get('alt') : featured_image.alt) : '';
      var fi_caption = featured_image ? (featured_image.get ? featured_image.get('caption') : featured_image.caption) : '';
      
      // Pull quote
      var pull_quote = get(entry, 'pull_quote', '');
      
      var essayContent = '';
      
      // ─────────────────────────────────────────────────────────────────────
      // ARTICLE HEADER (matches live site)
      // ─────────────────────────────────────────────────────────────────────
      essayContent += '<header class="article-header">';
      essayContent += '<div class="article-header-content">';
      
      // Breadcrumb
      essayContent += '<a href="/" class="breadcrumb">';
      essayContent += '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 12L6 8L10 4"/></svg>';
      essayContent += ' Back to Artwork</a>';
      
      // Article meta
      essayContent += '<div class="article-label">' + escapeHtml(article_type) + '</div>';
      essayContent += '<h1 class="article-title">' + escapeHtml(article_title) + '</h1>';
      
      if (author) {
        essayContent += '<p class="article-byline">By ' + escapeHtml(author) + '</p>';
      }
      
      essayContent += '<div class="article-meta">';
      if (read_time) essayContent += '<span>' + escapeHtml(read_time) + '</span>';
      if (read_time && publish_date) essayContent += '<span>•</span>';
      if (publish_date) essayContent += '<span>' + escapeHtml(publish_date) + '</span>';
      essayContent += '</div>';
      
      essayContent += '</div>';
      essayContent += '</header>';
      
      // ─────────────────────────────────────────────────────────────────────
      // ARTICLE BODY
      // ─────────────────────────────────────────────────────────────────────
      essayContent += '<article class="article-body">';
      essayContent += '<div class="article-content">';
      
      // Featured image
      if (fi_src) {
        essayContent += '<figure class="article-image">';
        essayContent += '<img src="' + escapeHtml(fi_src) + '" alt="' + escapeHtml(fi_alt || article_title) + '">';
        if (fi_caption) {
          essayContent += '<figcaption class="article-image-caption">' + escapeHtml(fi_caption) + '</figcaption>';
        }
        essayContent += '</figure>';
      }
      
      // Pull quote (orange styled)
      if (pull_quote) {
        essayContent += '<blockquote class="pull-quote">"' + escapeHtml(pull_quote) + '"</blockquote>';
      }
      
      // Body content placeholder - will be replaced by React
      essayContent += '<div class="article-text" id="curatorial-body-content"></div>';
      
      essayContent += '</div>';
      essayContent += '</article>';
      
      // ─────────────────────────────────────────────────────────────────────
      // CURATOR PROFILE
      // ─────────────────────────────────────────────────────────────────────
      if (curator_name) {
        essayContent += '<section class="curator-profile">';
        essayContent += '<div class="curator-card">';
        essayContent += '<div class="curator-label">ABOUT THE CURATOR</div>';
        essayContent += '<h3 class="curator-name">' + escapeHtml(curator_name) + '</h3>';
        if (curator_title) {
          essayContent += '<p class="curator-title">' + escapeHtml(curator_title) + '</p>';
        }
        essayContent += '<div class="curator-divider"></div>';
        
        // Links
        essayContent += '<div class="curator-links">';
        if (curator_website) {
          var displayUrl = curator_website.replace(/^https?:\/\//, '').replace(/\/$/, '');
          essayContent += '<a href="' + escapeHtml(curator_website) + '" target="_blank" rel="noopener noreferrer" class="curator-link">';
          essayContent += '<span class="curator-link-icon">🌐</span> ' + escapeHtml(displayUrl);
          essayContent += '</a>';
        }
        if (curator_linkedin) {
          essayContent += '<a href="' + escapeHtml(curator_linkedin) + '" target="_blank" rel="noopener noreferrer" class="curator-link">';
          essayContent += '<span class="curator-link-icon">💼</span> LinkedIn';
          essayContent += '</a>';
        }
        essayContent += '</div>';
        
        essayContent += '</div>';
        essayContent += '</section>';
      }
      
      // ─────────────────────────────────────────────────────────────────────
      // BACK TO ARTWORK CTA
      // ─────────────────────────────────────────────────────────────────────
      essayContent += '<section class="back-cta">';
      essayContent += '<div class="back-cta-content">';
      essayContent += '<h2>Experience the Artwork</h2>';
      essayContent += '<p>View full specifications, auction details, and exhibition information.</p>';
      essayContent += '<a href="/" class="btn btn--primary">VIEW ARTWORK →</a>';
      essayContent += '</div>';
      essayContent += '</section>';
      
      var content = PageWrapper(essayContent, { pageClass: 'preview-page--curatorial' });
      
      // Get the body widget for markdown content
      var bodyWidget = (typeof widgetFor === 'function') ? widgetFor('body') : null;
      
      // Return with body widget rendered separately
      return h('div', { className: 'preview-container' },
        h('div', { dangerouslySetInnerHTML: { __html: content } }),
        // Render body widget in a visible container that CSS will position
        bodyWidget ? h('div', { 
          className: 'curatorial-body-widget',
          style: { 
            maxWidth: '720px',
            margin: '-200px auto 0',
            padding: '0 40px 4rem',
            position: 'relative',
            zIndex: 1,
            background: 'var(--color-steel-100, #F2F2F2)',
            fontSize: '1.125rem',
            lineHeight: '1.8',
            color: 'var(--color-steel-900, #2A2A2A)'
          }
        }, bodyWidget) : null
      );
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // PRESS PAGE PREVIEW
  // Matches: src/_includes/press.njk structure
  // ─────────────────────────────────────────────────────────────────────────

  var PressPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Press page preview...')
        );
      }
      
      // Hero
      var hero_label = get(entry, 'hero.label', 'PRESS & MEDIA');
      var hero_title = get(entry, 'hero.title', 'Media Resources');
      var hero_subtitle = get(entry, 'hero.subtitle', '');
      
      // Downloads
      var downloadsData = entry.getIn(['data', 'downloads']);
      var downloads = toArray(downloadsData);
      
      // Overview
      var overview = entry.getIn(['data', 'overview']);
      var overview_title = overview ? (overview.get ? overview.get('about_title') : overview.about_title) : '';
      var overview_text = overview ? toArray(overview.get ? overview.get('about_text') : overview.about_text) : [];
      
      // Key Facts
      var keyFactsData = entry.getIn(['data', 'key_facts']);
      var key_facts = toArray(keyFactsData);
      
      // Gallery
      var gallery = entry.getIn(['data', 'gallery']);
      var gallery_title = gallery ? (gallery.get ? gallery.get('title') : gallery.title) : '';
      var gallery_subtitle = gallery ? (gallery.get ? gallery.get('subtitle') : gallery.subtitle) : '';
      var gallery_images = gallery ? toArray(gallery.get ? gallery.get('images') : gallery.images) : [];
      
      // Curatorial Quote
      var quote = entry.getIn(['data', 'curatorial_quote']);
      var quote_text = quote ? (quote.get ? quote.get('text') : quote.text) : '';
      var quote_attribution = quote ? (quote.get ? quote.get('attribution') : quote.attribution) : '';
      var quote_link = quote ? (quote.get ? quote.get('link') : quote.link) : '';
      var quote_link_text = quote ? (quote.get ? quote.get('link_text') : quote.link_text) : '';
      
      // Contact
      var contact = entry.getIn(['data', 'contact']);
      var contact_title = contact ? (contact.get ? contact.get('title') : contact.title) : 'Press Contact';
      var contact_email = contact ? (contact.get ? contact.get('email') : contact.email) : 'press@zyborn.com';
      var contact_response = contact ? (contact.get ? contact.get('response_promise') : contact.response_promise) : '';
      var contact_urgent = contact ? (contact.get ? contact.get('urgent_label') : contact.urgent_label) : '';
      var contact_phone = contact ? (contact.get ? contact.get('phone') : contact.phone) : '';
      
      var pressContent = '';
      
      // ─────────────────────────────────────────────────────────────────────
      // PRESS HERO
      // ─────────────────────────────────────────────────────────────────────
      pressContent += '<header class="press-hero">';
      pressContent += '<div class="container">';
      pressContent += '<p class="meta press-label">' + escapeHtml(hero_label) + '</p>';
      pressContent += '<h1 class="press-title">' + escapeHtml(hero_title) + '</h1>';
      if (hero_subtitle) {
        pressContent += '<p class="press-subtitle">' + escapeHtml(hero_subtitle) + '</p>';
      }
      pressContent += '</div>';
      pressContent += '</header>';
      
      // ─────────────────────────────────────────────────────────────────────
      // DOWNLOADS SECTION
      // ─────────────────────────────────────────────────────────────────────
      if (downloads && downloads.length > 0) {
        pressContent += '<section class="section-downloads">';
        pressContent += '<div class="container">';
        pressContent += '<h2 class="section-title">Quick Downloads</h2>';
        pressContent += '<div class="download-grid">';
        
        for (var i = 0; i < downloads.length; i++) {
          var dl = downloads[i];
          if (!dl) continue;
          
          var icon = dl.icon || 'document';
          pressContent += '<div class="download-card">';
          pressContent += '<div class="download-icon" data-icon="' + escapeHtml(icon) + '">';
          pressContent += Z.getIconSvg ? Z.getIconSvg(icon) : escapeHtml(icon);
          pressContent += '</div>';
          pressContent += '<span class="download-label">' + escapeHtml(dl.label || 'Download') + '</span>';
          if (dl.format) {
            pressContent += '<span class="download-format">' + escapeHtml(dl.format) + '</span>';
          }
          pressContent += '<a href="' + escapeHtml(dl.file || '#') + '" class="btn btn--primary" download>DOWNLOAD</a>';
          pressContent += '</div>';
        }
        
        pressContent += '</div>';
        pressContent += '</div>';
        pressContent += '</section>';
      }
      
      // ─────────────────────────────────────────────────────────────────────
      // ABOUT / OVERVIEW + KEY FACTS (side by side on live site)
      // ─────────────────────────────────────────────────────────────────────
      if ((overview_title && overview_text.length > 0) || key_facts.length > 0) {
        pressContent += '<section class="section-about-facts">';
        pressContent += '<div class="container">';
        pressContent += '<div class="about-facts-grid">';
        
        // About column
        if (overview_title || overview_text.length > 0) {
          pressContent += '<div class="about-column">';
          if (overview_title) {
            pressContent += '<h2 class="section-title">' + escapeHtml(overview_title) + '</h2>';
          }
          pressContent += '<div class="about-text">';
          for (var j = 0; j < overview_text.length; j++) {
            if (overview_text[j]) {
              pressContent += '<p>' + escapeHtml(overview_text[j]) + '</p>';
            }
          }
          pressContent += '</div>';
          pressContent += '</div>';
        }
        
        // Key Facts column
        if (key_facts.length > 0) {
          pressContent += '<div class="facts-column">';
          pressContent += '<div class="facts-card">';
          pressContent += '<h3 class="facts-title">Key Facts</h3>';
          pressContent += '<dl class="facts-list">';
          for (var k = 0; k < key_facts.length; k++) {
            var fact = key_facts[k];
            if (fact && fact.label) {
              pressContent += '<div class="fact-item">';
              pressContent += '<dt class="fact-label">' + escapeHtml(fact.label) + '</dt>';
              pressContent += '<dd class="fact-value">' + escapeHtml(fact.value || '') + '</dd>';
              pressContent += '</div>';
            }
          }
          pressContent += '</dl>';
          pressContent += '</div>';
          pressContent += '</div>';
        }
        
        pressContent += '</div>';
        pressContent += '</div>';
        pressContent += '</section>';
      }
      
      // ─────────────────────────────────────────────────────────────────────
      // PRESS IMAGES GALLERY
      // ─────────────────────────────────────────────────────────────────────
      if (gallery_images.length > 0) {
        pressContent += '<section class="section-gallery">';
        pressContent += '<div class="container">';
        if (gallery_title) {
          pressContent += '<h2 class="section-title">' + escapeHtml(gallery_title) + '</h2>';
        }
        if (gallery_subtitle) {
          pressContent += '<p class="section-subtitle">' + escapeHtml(gallery_subtitle) + '</p>';
        }
        pressContent += '<div class="gallery-grid columns-3">';
        
        for (var g = 0; g < gallery_images.length; g++) {
          var img = gallery_images[g];
          if (!img || !img.src) continue;
          
          pressContent += '<figure class="gallery-item">';
          pressContent += '<img src="' + escapeHtml(img.src) + '" alt="' + escapeHtml(img.alt || '') + '" loading="lazy">';
          pressContent += '<figcaption>';
          if (img.label) pressContent += '<span class="gallery-label">' + escapeHtml(img.label) + '</span>';
          if (img.dimensions) pressContent += '<span class="gallery-caption">' + escapeHtml(img.dimensions) + '</span>';
          pressContent += '</figcaption>';
          pressContent += '</figure>';
        }
        
        pressContent += '</div>';
        pressContent += '</div>';
        pressContent += '</section>';
      }
      
      // ─────────────────────────────────────────────────────────────────────
      // CURATORIAL QUOTE
      // ─────────────────────────────────────────────────────────────────────
      if (quote_text) {
        pressContent += '<section class="section-quote">';
        pressContent += '<div class="container">';
        pressContent += '<blockquote class="quote-block">';
        pressContent += '<p class="quote-text">"' + escapeHtml(quote_text) + '"</p>';
        if (quote_attribution) {
          pressContent += '<footer class="quote-footer">';
          pressContent += '<cite class="quote-attribution">— ' + escapeHtml(quote_attribution) + '</cite>';
          pressContent += '</footer>';
        }
        if (quote_link && quote_link_text) {
          pressContent += '<a href="' + escapeHtml(quote_link) + '" class="quote-link">' + escapeHtml(quote_link_text) + '</a>';
        }
        pressContent += '</blockquote>';
        pressContent += '</div>';
        pressContent += '</section>';
      }
      
      // ─────────────────────────────────────────────────────────────────────
      // CONTACT SECTION
      // ─────────────────────────────────────────────────────────────────────
      pressContent += '<section class="section-contact">';
      pressContent += '<div class="container">';
      pressContent += '<h2 class="section-title">' + escapeHtml(contact_title) + '</h2>';
      pressContent += '<div class="contact-grid">';
      
      // Left: Email info
      pressContent += '<div class="contact-info">';
      if (contact_email) {
        pressContent += '<a href="mailto:' + escapeHtml(contact_email) + '" class="contact-email">' + escapeHtml(contact_email) + '</a>';
      }
      if (contact_response) {
        pressContent += '<p class="contact-note">' + escapeHtml(contact_response) + '</p>';
      }
      if (contact_phone) {
        pressContent += '<div class="contact-urgent">';
        if (contact_urgent) pressContent += '<span class="urgent-label">' + escapeHtml(contact_urgent) + '</span>';
        pressContent += '<a href="tel:' + escapeHtml(contact_phone.replace(/\s/g, '')) + '" class="contact-phone">' + escapeHtml(contact_phone) + '</a>';
        pressContent += '</div>';
      }
      pressContent += '</div>';
      
      // Right: Contact form placeholder
      pressContent += '<div class="contact-form-wrapper">';
      pressContent += '<div class="contact-form-preview">';
      pressContent += '<h3>Send a Press Inquiry</h3>';
      pressContent += '<div class="form-row"><input type="text" placeholder="Your name" disabled><input type="email" placeholder="Email address" disabled></div>';
      pressContent += '<div class="form-row"><input type="text" placeholder="Publication / Media outlet" disabled><select disabled><option>Select inquiry type...</option></select></div>';
      pressContent += '<textarea placeholder="How can we help?" disabled></textarea>';
      pressContent += '<button class="btn btn--primary" disabled>SEND INQUIRY</button>';
      pressContent += '</div>';
      pressContent += '</div>';
      
      pressContent += '</div>';
      pressContent += '</div>';
      pressContent += '</section>';
      
      var content = PageWrapper(pressContent, { pageClass: 'preview-page--press' });
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // CUSTOM PAGE PREVIEW
  // ─────────────────────────────────────────────────────────────────────────

  var CustomPagePreview = createClass({
    render: function() {
      var entry = this.props.entry;
      
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Custom page preview...')
        );
      }
      
      var title = get(entry, 'title', 'Custom Page');
      var show_header = get(entry, 'show_header', true);
      var show_footer = get(entry, 'show_footer', true);
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
        pageContent += '<div class="preview-empty"><h1>' + escapeHtml(title) + '</h1><p>Add sections using the editor.</p></div>';
      }
      
      var content = PageWrapper(pageContent, { 
        showHeader: show_header, 
        showFooter: show_footer, 
        pageClass: 'preview-page--custom preview-page--layout-' + layout 
      });
      
      return h('div', { className: 'preview-container', dangerouslySetInnerHTML: { __html: content } });
    }
  });

  // Export templates
  Z.HomePreview = HomePreview;
  Z.CuratorialPreview = CuratorialPreview;
  Z.PressPreview = PressPreview;
  Z.CustomPagePreview = CustomPagePreview;

  console.log('[ZYBORN Preview] Templates loaded (home, curatorial, press, custom_pages)');
})();
