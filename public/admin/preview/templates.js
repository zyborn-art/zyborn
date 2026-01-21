// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Page Templates
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;
  var get = Z.get;
  var toArray = Z.toArray;
  var escapeHtml = Z.escapeHtml;
  var renderSection = Z.renderSection;
  var PageWrapper = Z.PageWrapper;

  // ─────────────────────────────────────────────────────────────────────────
  // HOME PAGE PREVIEW
  // ─────────────────────────────────────────────────────────────────────────

  var HomePreview = createClass({
    render: function() {
      var entry = this.props.entry;
      
      // Validate entry exists
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
  // ─────────────────────────────────────────────────────────────────────────

  var CuratorialPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      var widgetFor = this.props.widgetFor;
      
      // Validate entry exists
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Curatorial page preview...')
        );
      }
      
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
      
      // Hero
      essayContent += '<section class="curatorial-hero"><div class="curatorial-hero__inner">';
      essayContent += '<p class="curatorial-hero__label">Curatorial Essay</p>';
      essayContent += '<h1 class="curatorial-hero__title">' + escapeHtml(essay_title) + '</h1>';
      if (curator_name) essayContent += '<p class="curatorial-hero__author">by ' + escapeHtml(curator_name) + '</p>';
      if (essay_date) essayContent += '<p class="curatorial-hero__date">' + escapeHtml(essay_date) + '</p>';
      essayContent += '</div></section>';
      
      // Featured image
      if (featured_image) {
        essayContent += '<div class="curatorial-featured-image">';
        essayContent += '<img src="' + escapeHtml(featured_image) + '" alt="' + escapeHtml(featured_image_caption || essay_title) + '">';
        if (featured_image_caption) essayContent += '<p class="curatorial-featured-image__caption">' + escapeHtml(featured_image_caption) + '</p>';
        essayContent += '</div>';
      }
      
      // Body
      essayContent += '<article class="curatorial-body"><div class="curatorial-body__content">';
      var bodyWidget = (typeof widgetFor === 'function') ? widgetFor('body') : null;
      if (bodyWidget) {
        essayContent += '<div class="curatorial-body__text" id="essay-body-placeholder"></div>';
      } else {
        essayContent += '<div class="curatorial-body__text"><p>Essay content will appear here...</p></div>';
      }
      essayContent += '</div></article>';
      
      // Author bio
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

  // ─────────────────────────────────────────────────────────────────────────
  // PRESS PAGE PREVIEW
  // ─────────────────────────────────────────────────────────────────────────

  var PressPreview = createClass({
    render: function() {
      var entry = this.props.entry;
      
      // Validate entry exists
      if (!entry || typeof entry.getIn !== 'function') {
        return h('div', { className: 'preview-container' },
          h('div', { className: 'preview-empty' }, 'Loading Press page preview...')
        );
      }
      
      var hero_label = get(entry, 'hero.label', 'PRESS & MEDIA');
      var hero_title = get(entry, 'hero.title', 'Media Resources');
      var hero_subtitle = get(entry, 'hero.subtitle', '');
      var contact_email = get(entry, 'contact.email', 'press@zyborn.com');
      var downloadsData = entry.getIn(['data', 'downloads']);
      var downloads = toArray(downloadsData);
      
      var pressContent = '';
      
      // Hero
      pressContent += '<section class="press-hero"><div class="press-hero__inner">';
      pressContent += '<p class="press-hero__label">' + escapeHtml(hero_label) + '</p>';
      pressContent += '<h1 class="press-hero__title">' + escapeHtml(hero_title) + '</h1>';
      if (hero_subtitle) pressContent += '<p class="press-hero__subtitle">' + escapeHtml(hero_subtitle) + '</p>';
      pressContent += '</div></section>';
      
      // Downloads
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
      
      // Contact
      pressContent += '<section class="press-contact"><div class="press-contact__inner">';
      pressContent += '<h2 class="press-contact__title">Press Inquiries</h2>';
      pressContent += '<p class="press-contact__text">For interviews, image requests, or media inquiries:</p>';
      pressContent += '<a href="mailto:' + escapeHtml(contact_email) + '" class="press-contact__email">' + escapeHtml(contact_email) + '</a>';
      pressContent += '</div></section>';
      
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
      var widgetFor = this.props.widgetFor;
      
      // Validate entry exists
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
      
      // If page has sections
      if (sections && sections.length > 0) {
        for (var i = 0; i < sections.length; i++) {
          pageContent += renderSection(sections[i]);
        }
      } else {
        // Try markdown body
        var bodyWidget = (typeof widgetFor === 'function') ? widgetFor('body') : null;
        if (bodyWidget) {
          pageContent += '<article class="custom-page-content"><div class="custom-page-content__inner">';
          pageContent += '<h1 class="custom-page-content__title">' + escapeHtml(title) + '</h1>';
          pageContent += '<div class="custom-page-content__body" id="custom-body-placeholder"></div>';
          pageContent += '</div></article>';
          
          var content = PageWrapper(pageContent, { 
            showHeader: show_header, 
            showFooter: show_footer, 
            pageClass: 'preview-page--custom preview-page--layout-' + layout 
          });
          
          return h('div', { className: 'preview-container' },
            h('div', { dangerouslySetInnerHTML: { __html: content } }),
            h('div', { style: { display: 'none' } }, bodyWidget)
          );
        }
        
        // Empty state
        pageContent += '<div class="preview-empty"><h1>' + escapeHtml(title) + '</h1><p>Add sections or body content using the editor.</p></div>';
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
