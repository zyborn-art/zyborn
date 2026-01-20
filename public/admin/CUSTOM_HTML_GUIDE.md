# Custom HTML Section Guide

> **For**: ZYBORN Content Editors  
> **Version**: 1.0  
> **Updated**: January 20, 2026

---

## What is Custom HTML?

The Custom HTML section lets you add any HTML code to your pages. This gives you complete creative control when the preset section types don't fit your needs.

**Perfect for:**
- Unique promotional banners
- Custom countdown timers
- Embedded widgets
- Special event announcements
- Interactive elements

---

## How to Use with ChatGPT/Claude

### Step 1: Describe What You Want

Open ChatGPT or Claude and use this template:

```
I need an HTML section for the ZYBORN art auction website.

BRAND GUIDELINES:
- Background: Black (#000000) or Dark (#0a0a0a)
- Accent color: Bitcoin Orange (#F6931B)
- Primary font: Space Grotesk (headings, body)
- Monospace font: IBM Plex Mono (numbers, code)
- Style: Minimal, high-end art gallery aesthetic

SECTION REQUIREMENTS:
[Describe what you want here - be specific!]

TECHNICAL NOTES:
- Use inline styles (style="...") for reliability
- Use vanilla JavaScript if interactive (no frameworks)
- Make it mobile responsive
- Keep the code self-contained

OUTPUT:
Provide clean HTML code I can paste directly into my CMS.
```

### Step 2: Copy the Generated Code

The AI will give you HTML code. Copy everything.

### Step 3: Add to CMS

1. Go to **zyborn.com/admin**
2. Edit your page (or create new Custom Page)
3. Click **"Add section"**
4. Select **"🧩 Custom HTML"**
5. Fill in:
   - **Section ID**: Unique identifier (e.g., `promo-banner-1`)
   - **HTML Content**: Paste your code here
   - **Custom CSS**: Optional extra styles
   - **Notes**: Internal notes for yourself
6. Click **Publish**

### Step 4: Preview and Iterate

After publishing, check the live page. If something doesn't look right:
- Go back to ChatGPT/Claude
- Describe what needs to change
- Get updated code
- Replace in CMS

---

## Example Prompts

### Countdown Banner
```
Create a countdown timer to January 3, 2026 at 6:00 PM GMT.
Show days, hours, minutes, seconds in large Bitcoin Orange numbers.
Add text "Auction Closes In" above the timer.
Add a "Place Your Bid" button below that links to https://auction.zyborn.com
```

### Testimonial Carousel
```
Create a testimonial section with 3 collector quotes.
Display one quote at a time with fade transitions.
Include quotation marks, the quote text, and collector name.
Add left/right arrows to navigate between quotes.
Auto-advance every 5 seconds.
```

### Video Feature
```
Create a section with a YouTube video embed (ID: YOUR_VIDEO_ID).
Put the video on the left (60% width) and text description on the right.
Add a headline "The Making of Canned BTC"
Add a "Watch Full Documentary" button below the text.
Stack vertically on mobile.
```

### Email Signup Banner
```
Create a slim banner with an email signup form.
One line: icon, "Get auction updates" text, email input, submit button.
Bitcoin Orange submit button.
Show "Thanks!" message after submission (JavaScript).
```

---

## Ready-to-Use Snippets

We've created example snippets you can use immediately:

| Snippet | File | Use Case |
|---------|------|----------|
| Announcement Banner | `/snippets/announcement-banner.html` | Auction status, events |
| Social Proof | `/snippets/social-proof.html` | Stats, numbers |
| Press Mention | `/snippets/press-mention.html` | Quotes, testimonials |

### How to Use Snippets:

1. Visit `zyborn.com/snippets/announcement-banner.html`
2. View page source (Ctrl+U / Cmd+U)
3. Copy the HTML code
4. Paste into Custom HTML section
5. Modify text/links as needed

---

## Brand Quick Reference

### Colors
```
Black:          #000000
Dark Gray:      #0a0a0a
Bitcoin Orange: #F6931B
Orange Hover:   #FF6B00
White:          #FFFFFF
Light Gray:     rgba(255,255,255,0.7)
Border:         rgba(255,255,255,0.1)
```

### Fonts
```css
/* Headings and body text */
font-family: 'Space Grotesk', sans-serif;

/* Numbers and monospace */
font-family: 'IBM Plex Mono', monospace;
```

### Common Styles
```css
/* Card/box style */
background: rgba(255,255,255,0.02);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 4px;
padding: 2rem;

/* Button style */
background: #F6931B;
color: #000;
padding: 0.75rem 1.5rem;
border: none;
font-weight: 600;
cursor: pointer;

/* Button hover */
background: #FF6B00;
```

---

## Tips & Best Practices

### ✅ Do:
- **Test on mobile** — Always check how your section looks on phones
- **Use inline styles** — More reliable than external CSS in CMS
- **Keep it simple** — Complex JavaScript may not work as expected
- **Save backups** — Keep your code somewhere before modifying
- **Use semantic HTML** — `<section>`, `<article>`, `<button>` etc.

### ❌ Don't:
- Don't use `<script src="...">` to load external libraries
- Don't use CSS frameworks (Bootstrap, Tailwind classes)
- Don't create forms that submit to external servers
- Don't embed content from untrusted sources

### Mobile Responsiveness

Add this to any grid/flex container for mobile support:
```css
/* Stack on mobile */
@media (max-width: 768px) {
  flex-direction: column;
}
```

Or use inline responsive approach:
```css
display: flex;
flex-wrap: wrap;
gap: 2rem;
```

---

## Troubleshooting

### Section not showing?
1. Check Section ID is unique (no spaces, lowercase)
2. Make sure HTML is valid (all tags closed)
3. Clear browser cache and refresh

### Styles not applying?
1. Use inline styles (`style="..."`) instead of `<style>` tags
2. Check for typos in CSS properties
3. Some styles may be overridden by main site CSS

### JavaScript not working?
1. Check browser console for errors (F12 → Console)
2. Make sure code is wrapped in `<script>` tags
3. Use `document.addEventListener('DOMContentLoaded', ...)` for DOM manipulation

### Need help?
1. Ask ChatGPT/Claude to debug the code
2. Share the code and describe the issue
3. Try a simpler version first, then add complexity

---

## Quick Start Checklist

- [ ] Describe what you want to AI (ChatGPT/Claude)
- [ ] Copy the generated HTML
- [ ] Create Custom HTML section in CMS
- [ ] Add unique Section ID
- [ ] Paste HTML content
- [ ] Publish and preview
- [ ] Test on mobile device
- [ ] Iterate if needed

---

*Last updated: January 20, 2026*
