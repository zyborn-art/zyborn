// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN Preview - Page Wrapper
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
    
    // Header
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
    
    // Main content
    html += '<main class="preview-main">' + content + '</main>';
    
    // Footer
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

  // Export
  Z.PageWrapper = PageWrapper;

  console.log('[ZYBORN Preview] PageWrapper loaded');
})();
