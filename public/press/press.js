/**
 * ZYBORN ART - Press Page JavaScript
 * Version: 1.0
 * 
 * Integrates with:
 * - Supabase (database storage)
 * - Resend (email delivery)
 * - Vercel Edge Functions (/api/press-inquiry)
 */

document.addEventListener('DOMContentLoaded', function() {
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
                    const navHeight = document.getElementById('nav')?.offsetHeight || 64;
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
    // Download Tracking
    // ============================================
    const downloadButtons = document.querySelectorAll('.download-btn');
    
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const fileName = this.getAttribute('data-file') || 'unknown';
            
            // Track download (if analytics available)
            if (typeof gtag === 'function') {
                gtag('event', 'download', {
                    event_category: 'Press Assets',
                    event_label: fileName
                });
            }
            
            console.log('Download tracked:', fileName);
        });
    });

    // ============================================
    // Press Inquiry Form Handling
    // ============================================
    const pressForm = document.getElementById('pressForm');
    
    if (pressForm) {
        pressForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const btn = pressForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Get form data
            const formData = new FormData(pressForm);
            const data = {
                name: formData.get('name')?.trim(),
                email: formData.get('email')?.trim(),
                outlet: formData.get('outlet')?.trim(),
                inquiry_type: formData.get('inquiry_type'),
                message: formData.get('message')?.trim(),
                source: 'press_page',
                timestamp: new Date().toISOString()
            };

            // Validate required fields
            if (!data.name || !data.email || !data.outlet || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate email
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                const emailInput = pressForm.querySelector('input[name="email"]');
                emailInput.classList.add('form-error');
                setTimeout(() => emailInput.classList.remove('form-error'), 2000);
                return;
            }

            // Show loading state
            btn.textContent = 'SENDING...';
            btn.disabled = true;

            try {
                const response = await fetch('/api/press-inquiry', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Submission failed');
                }

                // Success state
                btn.textContent = '✓ SENT';
                btn.classList.add('form-success');
                pressForm.reset();
                
                // Track conversion
                if (typeof gtag === 'function') {
                    gtag('event', 'press_inquiry', {
                        event_category: 'Press',
                        event_label: data.inquiry_type
                    });
                }

                // Reset button after delay
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.classList.remove('form-success');
                    btn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('Form submission error:', error);
                
                // Error state
                btn.textContent = 'ERROR - TRY AGAIN';
                btn.style.background = '#ff4444';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }

    // ============================================
    // Console Branding
    // ============================================
    console.log('%c ZYBORN ART ', 'background: #F6931B; color: #000; font-size: 16px; font-weight: bold; padding: 8px;');
    console.log('%c Press & Media Page ', 'color: #F6931B; font-size: 11px;');
});
