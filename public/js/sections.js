/**
 * ZYBORN Section Interactions
 * Run 2 - Phase 2: Accordion + Countdown + Timeline
 * Created: January 20, 2026
 */

(function() {
  'use strict';

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initAccordions();
    initCountdowns();
    initTimelines();
  });

  /**
   * ============================================
   * ACCORDION / FAQ FUNCTIONALITY
   * ============================================
   */
  function initAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
      const headers = accordion.querySelectorAll('.accordion-header');
      
      headers.forEach(header => {
        header.addEventListener('click', function() {
          const item = this.closest('.accordion-item');
          const isOpen = item.classList.contains('is-open');
          const content = item.querySelector('.accordion-content');
          
          // Close all items in this accordion
          accordion.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('is-open');
            i.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            const c = i.querySelector('.accordion-content');
            c.style.maxHeight = null;
          });
          
          // Open clicked item (if it was closed)
          if (!isOpen) {
            item.classList.add('is-open');
            this.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });

      // Initialize first item if expand_first is true
      const expandFirst = accordion.dataset.expandFirst === 'true';
      if (expandFirst) {
        const firstItem = accordion.querySelector('.accordion-item');
        if (firstItem) {
          const firstContent = firstItem.querySelector('.accordion-content');
          if (firstContent) {
            firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
          }
        }
      }
    });
  }

  /**
   * ============================================
   * COUNTDOWN TIMER FUNCTIONALITY
   * ============================================
   */
  function initCountdowns() {
    const countdowns = document.querySelectorAll('.section-countdown');
    
    countdowns.forEach(countdown => {
      const targetDateStr = countdown.dataset.target;
      if (!targetDateStr) return;
      
      const targetDate = new Date(targetDateStr).getTime();
      const timer = countdown.querySelector('.countdown-timer');
      if (!timer) return;
      
      const expiredMessage = timer.dataset.expiredMessage || 'Event has started!';
      
      function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // If countdown expired
        if (distance < 0) {
          timer.innerHTML = '<p class="countdown-expired">' + expiredMessage + '</p>';
          return false; // Stop the interval
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update DOM elements
        const daysEl = timer.querySelector('[data-days]');
        const hoursEl = timer.querySelector('[data-hours]');
        const minutesEl = timer.querySelector('[data-minutes]');
        const secondsEl = timer.querySelector('[data-seconds]');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        return true; // Continue the interval
      }
      
      // Update immediately
      const shouldContinue = updateCountdown();
      
      // Then update every second if not expired
      if (shouldContinue) {
        const intervalId = setInterval(function() {
          if (!updateCountdown()) {
            clearInterval(intervalId);
          }
        }, 1000);
      }
    });
  }

  /**
   * ============================================
   * TIMELINE ENHANCEMENTS
   * ============================================
   */
  function initTimelines() {
    const timelines = document.querySelectorAll('.section-timeline');
    
    timelines.forEach(timeline => {
      const items = timeline.querySelectorAll('.timeline-item');
      
      // Add intersection observer for scroll animations
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function(entries) {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        });
        
        items.forEach(item => {
          observer.observe(item);
        });
      } else {
        // Fallback: make all items visible immediately
        items.forEach(item => {
          item.classList.add('is-visible');
        });
      }
    });
  }

  /**
   * ============================================
   * UTILITY: Expose functions globally if needed
   * ============================================
   */
  window.ZYBORNSections = {
    initAccordions: initAccordions,
    initCountdowns: initCountdowns,
    initTimelines: initTimelines
  };

})();
