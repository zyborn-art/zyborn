/**
 * ZYBORN Content Loader
 * Reads content from /data/content.json and updates DOM elements
 * Elements are mapped via data-content="path.to.value" attributes
 * 
 * Usage in HTML:
 *   <h1 data-content="hero.headline">Fallback Text</h1>
 *   <a data-content-href="auction.cta_url" data-content="auction.cta_text">Button</a>
 */

(function() {
  'use strict';

  // Fetch and apply content on DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/data/content.json?v=' + Date.now());
      
      if (!response.ok) {
        console.log('Content loader: Using static fallback (JSON not found)');
        return;
      }
      
      const content = await response.json();
      applyContent(content);
      
    } catch (error) {
      console.log('Content loader: Using static fallback', error.message);
    }
  });

  /**
   * Apply content to all elements with data-content attributes
   */
  function applyContent(content) {
    // Update text content
    document.querySelectorAll('[data-content]').forEach(el => {
      const path = el.dataset.content;
      const value = getValueByPath(content, path);
      
      if (value !== undefined && value !== null) {
        // Handle different element types
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = value;
        } else if (el.tagName === 'IMG') {
          el.src = value;
        } else {
          el.textContent = value;
        }
      }
    });

    // Update href attributes
    document.querySelectorAll('[data-content-href]').forEach(el => {
      const path = el.dataset.contentHref;
      const value = getValueByPath(content, path);
      
      if (value !== undefined && value !== null) {
        el.href = value;
      }
    });

    // Update src attributes (for images)
    document.querySelectorAll('[data-content-src]').forEach(el => {
      const path = el.dataset.contentSrc;
      const value = getValueByPath(content, path);
      
      if (value !== undefined && value !== null) {
        el.src = value;
      }
    });

    // Update alt attributes
    document.querySelectorAll('[data-content-alt]').forEach(el => {
      const path = el.dataset.contentAlt;
      const value = getValueByPath(content, path);
      
      if (value !== undefined && value !== null) {
        el.alt = value;
      }
    });

    // Handle conditional visibility based on auction status
    const auctionStatus = getValueByPath(content, 'auction.status');
    if (auctionStatus) {
      document.querySelectorAll('[data-show-if-auction]').forEach(el => {
        const showIf = el.dataset.showIfAuction;
        el.style.display = (showIf === auctionStatus) ? '' : 'none';
      });
    }

    console.log('Content loader: Applied successfully');
  }

  /**
   * Get nested value from object using dot notation path
   * e.g., getValueByPath(obj, "hero.headline") returns obj.hero.headline
   */
  function getValueByPath(obj, path) {
    if (!path) return undefined;
    
    const keys = path.split('.');
    let value = obj;
    
    for (const key of keys) {
      if (value === undefined || value === null) return undefined;
      value = value[key];
    }
    
    return value;
  }

})();
