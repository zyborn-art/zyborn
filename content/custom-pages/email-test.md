---
title: Email test
slug: email
meta_description: email
sections:
  - type: text_block
    background: default
    title: Proba 1
    label: TEst1
    content: |-
      NA mizu test

      * asd
      * asdl,fogaw
  - type: custom_html
    id: email-banner-test
    html: >-
      <section style="background: linear-gradient(90deg, #0a0a0a 0%, #111 100%);
      border-top: 1px solid rgba(246,147,27,0.3); border-bottom: 1px solid
      rgba(246,147,27,0.3); padding: 1rem 1.5rem; font-family: 'Space Grotesk',
      sans-serif;">
        <div id="signup-form-container" style="max-width: 900px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          
          <!-- Icon + Text -->
          <div style="display: flex; align-items: center; gap: 0.75rem; color: #fff;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F6931B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <span style="font-weight: 500; white-space: nowrap;">Get auction updates</span>
          </div>
          
          <!-- Email Input + Button -->
          <div id="email-form" style="display: flex; gap: 0.5rem; flex: 1; min-width: 280px; max-width: 400px;">
            <input 
              type="email" 
              id="banner-email" 
              placeholder="Enter your email" 
              style="flex: 1; padding: 0.625rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 0.9rem; outline: none; transition: border-color 0.2s;"
              onfocus="this.style.borderColor='#F6931B'"
              onblur="this.style.borderColor='rgba(255,255,255,0.2)'"
            >
            <button 
              type="button"
              onclick="handleBannerSignup()"
              style="padding: 0.625rem 1.25rem; background: #F6931B; color: #000; border: none; border-radius: 4px; font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 0.9rem; cursor: pointer; white-space: nowrap; transition: background 0.2s;"
              onmouseover="this.style.background='#FF6B00'"
              onmouseout="this.style.background='#F6931B'"
            >Subscribe</button>
          </div>
          
          <!-- Success Message (hidden by default) -->
          <div id="success-message" style="display: none; align-items: center; gap: 0.5rem; color: #F6931B; font-weight: 500;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F6931B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Thanks! You're on the list.</span>
          </div>
          
        </div>
      </section>


      <script>

      function handleBannerSignup() {
        const emailInput = document.getElementById('banner-email');
        const email = emailInput.value.trim();
        
        // Basic validation
        if (!email || !email.includes('@')) {
          emailInput.style.borderColor = '#ff4444';
          emailInput.focus();
          return;
        }
        
        // Hide form, show success
        document.getElementById('email-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'flex';
        
        // Optional: Log to console (replace with actual API call)
        console.log('Email signup:', email);
        
        // To connect to your Supabase, replace the console.log with:
        // fetch('YOUR_API_ENDPOINT', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: email, source: 'banner-signup' })
        // });
      }

      </script>
    content: |-
      NA mizu test

      * asd
      * asdl,őfogaw
---
