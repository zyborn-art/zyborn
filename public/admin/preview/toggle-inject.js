// ═══════════════════════════════════════════════════════════════════════════
// ZYBORN CMS - Publish Toggle Injection
// Injects publish/unpublish toggles into Decap CMS list view
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────
  // CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  
  // Pages that should have publish toggles (by their display name in CMS)
  var TOGGLEABLE_PAGES = {
    'Curatorial Essay': {
      collection: 'pages',
      file: 'curatorial',
      field: 'published'
    },
    'Press Page': {
      collection: 'pages',
      file: 'press',
      field: 'published'
    }
  };

  // Custom pages collection name
  var CUSTOM_PAGES_COLLECTION = 'custom_pages';

  // ─────────────────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────
  
  var injectedToggles = new Set();
  var observer = null;

  // ─────────────────────────────────────────────────────────────────────────
  // TOGGLE CREATION
  // ─────────────────────────────────────────────────────────────────────────
  
  function createToggle(pageKey, isPublished, onChange) {
    var wrapper = document.createElement('div');
    wrapper.className = 'zyborn-publish-toggle';
    wrapper.setAttribute('data-page-key', pageKey);
    
    var label = document.createElement('label');
    label.className = 'zyborn-toggle-switch';
    
    var input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = isPublished;
    input.addEventListener('change', function(e) {
      onChange(e.target.checked);
      updateToggleStatus(wrapper, e.target.checked);
    });
    
    var slider = document.createElement('span');
    slider.className = 'zyborn-toggle-slider';
    
    var status = document.createElement('span');
    status.className = 'zyborn-toggle-status';
    status.textContent = isPublished ? 'Live' : 'Hidden';
    status.setAttribute('data-status', isPublished ? 'live' : 'hidden');
    
    label.appendChild(input);
    label.appendChild(slider);
    wrapper.appendChild(label);
    wrapper.appendChild(status);
    
    return wrapper;
  }

  function updateToggleStatus(wrapper, isPublished) {
    var status = wrapper.querySelector('.zyborn-toggle-status');
    if (status) {
      status.textContent = isPublished ? 'Live' : 'Hidden';
      status.setAttribute('data-status', isPublished ? 'live' : 'hidden');
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // CMS INTEGRATION
  // ─────────────────────────────────────────────────────────────────────────
  
  // Get current published state from CMS
  function getPublishedState(collection, slug) {
    // Try to get state from CMS internal state
    // This is a fallback - the actual state will be read when user clicks edit
    var storageKey = 'zyborn_published_' + collection + '_' + slug;
    var stored = localStorage.getItem(storageKey);
    
    if (stored !== null) {
      return stored === 'true';
    }
    
    // Default to published
    return true;
  }

  // Save published state (triggers CMS update)
  function setPublishedState(collection, slug, isPublished) {
    var storageKey = 'zyborn_published_' + collection + '_' + slug;
    localStorage.setItem(storageKey, isPublished.toString());
    
    console.log('[ZYBORN Toggle] ' + (isPublished ? 'Publishing' : 'Unpublishing') + ': ' + collection + '/' + slug);
    
    // Show notification to user
    showNotification(
      isPublished 
        ? 'Page will be visible after saving and deploying' 
        : 'Page will be hidden after saving and deploying',
      isPublished ? 'success' : 'warning'
    );
    
    // Try to trigger CMS field update
    triggerCMSUpdate(collection, slug, isPublished);
  }

  // Attempt to update CMS field directly
  function triggerCMSUpdate(collection, slug, isPublished) {
    // Decap CMS uses Redux internally - we'll use a workaround
    // by dispatching a custom event that our preview system can listen to
    var event = new CustomEvent('zyborn:publish-toggle', {
      detail: {
        collection: collection,
        slug: slug,
        published: isPublished
      }
    });
    window.dispatchEvent(event);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // NOTIFICATION SYSTEM
  // ─────────────────────────────────────────────────────────────────────────
  
  function showNotification(message, type) {
    // Remove existing notification
    var existing = document.querySelector('.zyborn-notification');
    if (existing) {
      existing.remove();
    }
    
    var notification = document.createElement('div');
    notification.className = 'zyborn-notification zyborn-notification-' + type;
    notification.innerHTML = '<span class="zyborn-notification-icon">' + 
      (type === 'success' ? '✓' : '⚠') + 
      '</span>' + message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(function() {
      notification.classList.add('zyborn-notification-visible');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(function() {
      notification.classList.remove('zyborn-notification-visible');
      setTimeout(function() {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DOM INJECTION
  // ─────────────────────────────────────────────────────────────────────────
  
  function injectToggles() {
    // Find the Pages list view
    var listCards = document.querySelectorAll('[class*="ListCard"]');
    
    listCards.forEach(function(card) {
      // Get the page title from the card
      var titleEl = card.querySelector('[class*="ListCardTitle"], h2, [class*="title"]');
      if (!titleEl) return;
      
      var pageTitle = titleEl.textContent.trim();
      var pageKey = pageTitle.replace(/[^a-zA-Z0-9]/g, '_');
      
      // Skip if already injected
      if (injectedToggles.has(pageKey)) return;
      if (card.querySelector('.zyborn-publish-toggle')) return;
      
      // Check if this is a toggleable page
      var pageConfig = TOGGLEABLE_PAGES[pageTitle];
      var isCustomPage = isInCustomPagesView();
      
      if (!pageConfig && !isCustomPage) return;
      
      // Determine collection and slug
      var collection, slug;
      if (pageConfig) {
        collection = pageConfig.collection;
        slug = pageConfig.file;
      } else if (isCustomPage) {
        collection = CUSTOM_PAGES_COLLECTION;
        // Extract slug from the card (usually shown as "title — /slug")
        slug = extractSlugFromCard(card, pageTitle);
      }
      
      if (!slug) return;
      
      // Get current state
      var isPublished = getPublishedState(collection, slug);
      
      // Create and inject toggle
      var toggle = createToggle(pageKey, isPublished, function(newState) {
        setPublishedState(collection, slug, newState);
      });
      
      // Find a good place to inject the toggle
      var cardContent = card.querySelector('[class*="CardContent"]') || card;
      
      // Position toggle on the right side
      toggle.style.position = 'absolute';
      toggle.style.right = '16px';
      toggle.style.top = '50%';
      toggle.style.transform = 'translateY(-50%)';
      
      // Make card position relative if needed
      if (getComputedStyle(card).position === 'static') {
        card.style.position = 'relative';
      }
      
      card.appendChild(toggle);
      injectedToggles.add(pageKey);
      
      console.log('[ZYBORN Toggle] Injected toggle for: ' + pageTitle);
    });
  }

  function isInCustomPagesView() {
    // Check URL hash or sidebar selection for custom pages
    var hash = window.location.hash;
    if (hash.includes('custom_pages')) return true;
    
    // Check sidebar for active selection
    var activeNav = document.querySelector('[class*="Sidebar"] [class*="active"], [class*="CollectionNav"] [class*="active"]');
    if (activeNav && activeNav.textContent.includes('Custom Pages')) return true;
    
    return false;
  }

  function extractSlugFromCard(card, title) {
    // Try to find slug from card content
    // Cards often show "Title — /slug" format
    var fullText = card.textContent;
    var slugMatch = fullText.match(/—\s*\/([a-z0-9-]+)/i);
    if (slugMatch) return slugMatch[1];
    
    // Fall back to slugifying the title
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MUTATION OBSERVER
  // ─────────────────────────────────────────────────────────────────────────
  
  function startObserver() {
    if (observer) return;
    
    observer = new MutationObserver(function(mutations) {
      // Debounce injection
      clearTimeout(window.zybornInjectTimeout);
      window.zybornInjectTimeout = setTimeout(function() {
        injectToggles();
      }, 100);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('[ZYBORN Toggle] Observer started');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SYNC WITH CMS FIELD
  // ─────────────────────────────────────────────────────────────────────────
  
  // When entering edit mode, sync toggle state with actual field value
  function syncWithCMSField() {
    // Watch for editor opening
    var editorObserver = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            // Look for the Published checkbox field
            var publishedField = node.querySelector('[id*="published"], [data-field="published"]');
            if (publishedField) {
              var checkbox = publishedField.querySelector('input[type="checkbox"]');
              if (checkbox) {
                // Get collection and slug from URL
                var hashParts = window.location.hash.split('/');
                var collection = hashParts[2];
                var slug = hashParts[3];
                
                if (collection && slug) {
                  // Sync our localStorage with actual field value
                  var storageKey = 'zyborn_published_' + collection + '_' + slug;
                  localStorage.setItem(storageKey, checkbox.checked.toString());
                  
                  console.log('[ZYBORN Toggle] Synced with CMS field:', collection, slug, checkbox.checked);
                }
              }
            }
          }
        });
      });
    });
    
    editorObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // INITIALIZATION
  // ─────────────────────────────────────────────────────────────────────────
  
  function init() {
    console.log('[ZYBORN Toggle] Initializing publish toggle injection...');
    
    // Wait for CMS to be ready
    if (typeof CMS === 'undefined') {
      console.log('[ZYBORN Toggle] Waiting for CMS...');
      setTimeout(init, 500);
      return;
    }
    
    // Start observing DOM changes
    startObserver();
    
    // Sync with CMS fields
    syncWithCMSField();
    
    // Initial injection attempt
    setTimeout(injectToggles, 1000);
    
    // Re-inject when hash changes (navigation)
    window.addEventListener('hashchange', function() {
      injectedToggles.clear();
      setTimeout(injectToggles, 300);
    });
    
    console.log('[ZYBORN Toggle] ✓ Publish toggle system initialized');
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
