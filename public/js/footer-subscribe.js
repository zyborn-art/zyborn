/**
 * ZYBORN ART - Subscribe Form Handler
 * Handles form submission with Cloudflare Turnstile verification
 * Supports multiple subscribe forms on a page
 * 
 * Created: 2025-01-23
 * Updated: 2025-01-23
 */

(function() {
    'use strict';

    // Turnstile token storage (shared across forms)
    let turnstileToken = null;

    // Turnstile callback functions (global scope)
    window.onTurnstileSuccess = function(token) {
        turnstileToken = token;
    };

    window.onTurnstileExpired = function() {
        turnstileToken = null;
        // Reset all Turnstile widgets
        if (window.turnstile) {
            document.querySelectorAll('.subscribe-turnstile').forEach(function(widget) {
                turnstile.reset(widget);
            });
        }
    };

    // Initialize all subscribe forms on the page
    function initSubscribeForms() {
        const forms = document.querySelectorAll('.subscribe-form');
        
        forms.forEach(function(form, index) {
            // Set timestamp on each form
            const timestampInput = form.querySelector('.subscribe-timestamp');
            if (timestampInput) {
                timestampInput.value = Date.now().toString();
            }

            // Form submission handler
            form.addEventListener('submit', async function(e) {
                e.preventDefault();
                await handleFormSubmit(form);
            });

            // Clear error state on input
            const emailInput = form.querySelector('.subscribe-email');
            if (emailInput) {
                emailInput.addEventListener('input', function() {
                    emailInput.classList.remove('error');
                    hideError(form);
                });
            }
        });
    }

    // Handle form submission
    async function handleFormSubmit(form) {
        const emailInput = form.querySelector('.subscribe-email');
        const honeypotInput = form.querySelector('.subscribe-honeypot');
        const timestampInput = form.querySelector('.subscribe-timestamp');
        const submitBtn = form.querySelector('.subscribe-submit');
        const btnText = submitBtn?.querySelector('.footer-subscribe__button-text');
        const btnLoading = submitBtn?.querySelector('.footer-subscribe__button-loading');
        
        // Find error and success elements (siblings of form or within same container)
        const container = form.closest('.footer-subscribe__container') || form.parentElement;
        const errorEl = container.querySelector('.subscribe-error');
        const successEl = container.querySelector('.subscribe-success');

        // Reset states
        hideError(form);
        
        // Get form data
        const email = emailInput?.value.trim() || '';
        const website = honeypotInput?.value || '';

        // Client-side validation
        if (!email) {
            showError(form, 'Please enter your email address');
            return;
        }

        if (!isValidEmail(email)) {
            showError(form, 'Please enter a valid email address');
            emailInput.classList.add('error');
            return;
        }

        // Check Turnstile token
        if (!turnstileToken) {
            showError(form, 'Please wait for verification to complete');
            // Try to trigger Turnstile
            if (window.turnstile) {
                const widget = form.querySelector('.subscribe-turnstile');
                if (widget) {
                    turnstile.execute(widget);
                }
            }
            return;
        }

        // Show loading state
        setLoading(form, true);

        try {
            const response = await fetch('/api/subscribe-footer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    website: website,
                    turnstileToken: turnstileToken,
                    timestamp: timestampInput?.value || ''
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success - show success state
                showSuccess(form);
            } else {
                // Error from server
                showError(form, data.error || 'Something went wrong. Please try again.');
                
                // Reset Turnstile for retry
                resetTurnstile(form);
            }

        } catch (error) {
            console.error('Subscription error:', error);
            showError(form, 'Network error. Please try again.');
            
            // Reset Turnstile for retry
            resetTurnstile(form);
        } finally {
            setLoading(form, false);
        }
    }

    // Utility functions
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function setLoading(form, isLoading) {
        const submitBtn = form.querySelector('.subscribe-submit');
        const btnText = submitBtn?.querySelector('.footer-subscribe__button-text');
        const btnLoading = submitBtn?.querySelector('.footer-subscribe__button-loading');
        const emailInput = form.querySelector('.subscribe-email');

        if (submitBtn) {
            submitBtn.disabled = isLoading;
            submitBtn.classList.toggle('footer-subscribe__button--loading', isLoading);
        }
        if (btnText) {
            btnText.style.display = isLoading ? 'none' : 'inline';
        }
        if (btnLoading) {
            btnLoading.style.display = isLoading ? 'inline' : 'none';
        }
        if (emailInput) {
            emailInput.disabled = isLoading;
        }
    }

    function showError(form, message) {
        const container = form.closest('.footer-subscribe__container') || form.parentElement;
        const errorEl = container.querySelector('.subscribe-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function hideError(form) {
        const container = form.closest('.footer-subscribe__container') || form.parentElement;
        const errorEl = container.querySelector('.subscribe-error');
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
    }

    function showSuccess(form) {
        const container = form.closest('.footer-subscribe__container') || form.parentElement;
        const successEl = container.querySelector('.subscribe-success');
        
        // Hide form
        form.style.display = 'none';
        
        // Show success message
        if (successEl) {
            successEl.style.display = 'block';
            successEl.style.animation = 'fadeInUp 0.3s ease forwards';
        }
    }

    function resetTurnstile(form) {
        if (window.turnstile) {
            const widget = form.querySelector('.subscribe-turnstile');
            if (widget) {
                turnstile.reset(widget);
            }
            turnstileToken = null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSubscribeForms);
    } else {
        initSubscribeForms();
    }

})();
