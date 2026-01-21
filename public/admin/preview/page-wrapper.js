// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Page Wrapper
// Provides header and footer matching live site structure
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  var Z = window.ZybornPreview;

  function PageWrapper(content, options) {
    options = options || {};
    var showHeader = options.showHeader !== false;
    var showFooter = options.showFooter !== false;
    var pageClass = options.pageClass || '';
    
    var html = '<div class="preview-page ' + pageClass + '">';
    
    // Header - Matches live site nav structure
    if (showHeader) {
      html += '<nav class="nav">';
      html += '<div class="container nav-inner">';
      html += '<a href="/" class="nav-logo"><img src="/images/logo.png" alt="ZYBORN" style="height: 32px;"></a>';
      html += '<ul class="nav-menu" style="display: flex;">';
      html += '<li><a href="/">HOME</a></li>';
      html += '<li><a href="/curatorial/">CURATORIAL</a></li>';
      html += '</ul>';
      html += '</div>';
      html += '</nav>';
    }
    
    // Main content
    html += '<main>' + content + '</main>';
    
    // Footer - Matches live site footer structure
    if (showFooter) {
      html += '<footer class="footer">';
      html += '<div class="container">';
      html += '<div class="footer-divider"></div>';
      html += '<div class="footer-grid">';
      html += '<div class="footer-col"><h4>ZYBORN ART</h4><ul><li><a href="#">About</a></li><li><a href="#">Future charity</a></li></ul></div>';
      html += '<div class="footer-col"><h4>Visit</h4><ul><li><a href="#">Map & directions</a></li></ul></div>';
      html += '<div class="footer-col"><h4>Connect</h4><ul><li><a href="#">Instagram</a></li><li><a href="#">X</a></li></ul></div>';
      html += '</div>';
      html += '<div class="footer-bottom">';
      html += '<p class="footer-copyright">© 2009 ZYBORN ART. All rights reserved.</p>';
      html += '<div class="footer-legal"><a href="#">Privacy</a> / <a href="#">Terms</a> / <span>No Cookies at the site</span></div>';
      html += '</div>';
      html += '</div>';
      html += '</footer>';
    }
    
    html += '</div>';
    return html;
  }

  // Export
  Z.PageWrapper = PageWrapper;

  console.log('[ZYBORN Preview] PageWrapper loaded');
})();
