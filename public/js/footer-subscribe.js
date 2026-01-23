/**
 * ZYBORN ART - Footer Subscribe Form Handler
 * Handles form submission with Cloudflare Turnstile verification
 * 
 * Created: 2025-01-23
 */

(function() {
    'use strict';

    // DOM Elements
    const form = document.getElementById('footer-subscribe-form');
    const emailInput = document.getElementById('footer-email');
    const timestampInput = document.getElementById('footer-timestamp');
    const submitBtn = document.getElementById('footer-submit');
    const btnText = submitBtn?.querySelector('.footer-subscribe__button-text');
    const btnLoading = submitBtn?.querySelector('.footer-subscribe__button-loading');
    const errorEl = document.getElementById('footer-error');
    const successEl = document.getElementById('footer-success');

    // Turnstile token storage
    let turnstileToken = null;

    // Set timestamp on page load (for time-based bot check)
    if (timestampInput) {
        timestampInput.value = Date.now().toString();
    }

    // Turnstile callback functions (global scope)
    window.onTurnstileSuccess = function(token) {
        turnstileToken = token;
    };

    window.onTurnstileExpired = function() {
        turnstileToken = null;
        // Reset Turnstile widget
        if (window.turnstile) {
            turnstile.reset();
        }
    };

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Reset states
            hideError();
            
            // Get form data
            const email = emailInput.value.trim();
            const website = document.getElementById('footer-website')?.value || '';

            // Client-side validation
            if (!email) {
                showError('Please enter your email address');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                emailInput.classList.add('error');
                return;
            }

            // Check Turnstile token
            if (!turnstileToken) {
                showError('Please wait for verification to complete');
                // Try to trigger Turnstile
                if (window.turnstile) {
                    turnstile.execute();
                }
                return;
            }

            // Show loading state
            setLoading(true);

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
                    showSuccess();
                } else {
                    // Error from server
                    showError(data.error || 'Something went wrong. Please try again.');
                    
                    // Reset Turnstile for retry
                    if (window.turnstile) {
                        turnstile.reset();
                        turnstileToken = null;
                    }
                }

            } catch (error) {
                console.error('Subscription error:', error);
                showError('Network error. Please try again.');
                
                // Reset Turnstile for retry
                if (window.turnstile) {
                    turnstile.reset();
                    turnstileToken = null;
                }
            } finally {
                setLoading(false);
            }
        });

        // Clear error state on input
        emailInput?.addEventListener('input', function() {
            emailInput.classList.remove('error');
            hideError();
        });
    }

    // Utility functions
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function setLoading(isLoading) {
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

    function showError(message) {
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }

    function hideError() {
        if (errorEl) {
            errorEl.style.display = 'none';
            errorEl.textContent = '';
        }
    }

    function showSuccess() {
        // Hide form
        if (form) {
            form.style.display = 'none';
        }
        // Show success message
        if (successEl) {
            successEl.style.display = 'block';
            successEl.style.animation = 'fadeInUp 0.3s ease forwards';
        }
    }

})();
