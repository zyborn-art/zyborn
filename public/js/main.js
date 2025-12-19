/**
 * ZYBORN ART - Main JavaScript
 * Version: 3.0
 * Last Updated: December 2025
 * 
 * Integrates with:
 * - Supabase (database)
 * - Resend (email delivery)
 * - Vercel Edge Functions (/api/subscribe)
 */

document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // Mobile Menu
    // ============================================
    const navHamburger = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    if (navHamburger && mobileMenu) {
        navHamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                navHamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ============================================
    // Navigation Scroll Effect
    // ============================================
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;

    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScrollY = window.scrollY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll(); // Initial check

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    const navHeight = nav ? nav.offsetHeight : 0;
                    const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }
            }
        });
    });

    // ============================================
    // Scroll Reveal Animation
    // ============================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15, 
        rootMargin: '0px 0px -40px 0px' 
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ============================================
    // Form Handling - Supabase + Resend Integration
    // ============================================
    
    /**
     * Submit form data to the API endpoint
     * @param {Object} data - Form data object
     * @returns {Promise<Object>} - API response
     */
    async function submitToAPI(data) {
        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Subscription failed');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Handle form submission
     * @param {Event} e - Form submit event
     * @param {HTMLFormElement} form - The form element
     */
    async function handleFormSubmit(e, form) {
        e.preventDefault();
        
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        const emailInput = form.querySelector('input[type="email"]');
        
        // Validate email
        const email = emailInput ? emailInput.value.trim() : '';
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.classList.add('form-error');
            setTimeout(() => emailInput.classList.remove('form-error'), 2000);
            return;
        }

        // Build data object
        const data = {
            email: email,
            timestamp: new Date().toISOString(),
            source: form.dataset.source || 'landing_page'
        };

        // Optional fields
        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput && nameInput.value.trim()) {
            data.name = nameInput.value.trim();
        }

        const roleSelect = form.querySelector('select[name="role"]');
        if (roleSelect && roleSelect.value) {
            data.role = roleSelect.value;
        }

        const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
        if (checkboxes.length > 0) {
            data.interests = Array.from(checkboxes).map(cb => cb.value);
        }

        // Show loading state
        btn.textContent = 'SENDING...';
        btn.disabled = true;

        try {
            await submitToAPI(data);
            
            // Success state
            btn.textContent = '✓ SUBSCRIBED';
            btn.classList.add('form-success');
            form.reset();
            
            // Track conversion (if analytics available)
            if (typeof gtag === 'function') {
                gtag('event', 'sign_up', {
                    method: 'email',
                    source: data.source
                });
            }

            // Reset button after delay
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('form-success');
                btn.disabled = false;
            }, 3000);

        } catch (error) {
            // Error state
            btn.textContent = 'ERROR - TRY AGAIN';
            btn.style.background = '#ff4444';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    }

    // Attach handlers to all forms
    const forms = document.querySelectorAll('#heroForm, #captureForm, #footerForm');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => handleFormSubmit(e, form));
    });

    // ============================================
    // Modal Functions
    // ============================================
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // Keyboard Navigation
    // ============================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes menus and modals
        if (e.key === 'Escape') {
            // Close mobile menu
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                navHamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Close any open modals
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // ============================================
    // Lazy Loading Images (Native)
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }

    // ============================================
    // Console Branding
    // ============================================
    console.log('%c ZYBORN ART ', 'background: #F6931B; color: #000; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c WORLD\'s FIRST CANNED BTC ', 'color: #F6931B; font-size: 12px;');
});
