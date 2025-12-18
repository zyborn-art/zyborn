# ZYBORN Development Workflow

> **Version**: 1.0  
> **Purpose**: Standardized process for making changes to ZYBORN web properties using SPEC files

---

## OVERVIEW

This workflow ensures consistent, traceable changes across all ZYBORN web properties. Every change starts with a SPEC file update and ends with an automated deployment.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        CHANGE WORKFLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│   │  1. SPEC │───▶│ 2. CODE  │───▶│ 3. PUSH  │───▶│ 4. LIVE  │         │
│   │  UPDATE  │    │ GENERATE │    │ TO GIT   │    │ ON SITE  │         │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘         │
│        │                │               │               │                │
│   Edit the         Generate       Push to         Vercel auto           │
│   markdown         HTML/CSS       GitHub          deploys               │
│   SPEC file        via Claude     repository      (< 30 sec)            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## SPEC FILE REGISTRY

| Site | SPEC File | Deployed URL |
|------|-----------|--------------|
| Main Landing | `ZYBORN_LANDING_PAGE_SPEC.md` | `zyborn.com/` |
| Curatorial | `ZYBORN_CURATORIAL_SUBPAGE_SPEC.md` | `zyborn.com/curatorial` |
| Press Kit | `ZYBORN_PRESS_SUBPAGE_SPEC.md` | `zyborn.com/press` |
| Auction | `ZYBORN_AUCTION_SPEC.md` | `auction.zyborn.com/` |

---

## STEP-BY-STEP WORKFLOW

### STEP 1: Update the SPEC File

Open the relevant SPEC file in your local editor or directly in GitHub.

**Example: Moving a CTA button in the Hero section**

```markdown
## SECTION 2: HERO

### Email Capture Form

**Layout**: 
- Desktop: BELOW subheadline (changed from: right-aligned)    ← YOUR CHANGE
- Mobile: Full width, stacked

**CTA Button**:
- Text: `NOTIFY ME`
- Position: LEFT aligned (changed from: centered)              ← YOUR CHANGE
```

**SPEC File Best Practices:**

1. **Mark all changes** with `← YOUR CHANGE` or a similar comment
2. **Date your changes** in a changelog section at the bottom
3. **Be explicit** — don't use vague language like "move it somewhere else"
4. **Include reasoning** when helpful for future reference

---

### STEP 2: Generate Code via Claude

Open a new Claude conversation with this prompt template:

```
You are my senior frontend developer. I need you to regenerate the 
[PAGE NAME] based on the updated specification.

CONTEXT:
- Site: zyborn.com
- Page: [zyborn.com/ | zyborn.com/curatorial | zyborn.com/press | auction.zyborn.com]
- Change type: [Text update | Layout change | New section | Style change]

SPEC FILE: [Paste your updated SPEC content here]

BRAND KIT: [Reference the ZYBORN_BRAND_KIT.md if design changes]

DELIVERABLE:
Generate a complete, production-ready HTML file with embedded CSS and JS.
Follow the exact specifications. Do not deviate from the SPEC.

OUTPUT FORMAT:
Single HTML file ready for Vercel deployment.
```

**Key Points:**
- Always paste the **complete SPEC file**, not just the changed section
- Reference the Brand Kit for any visual changes
- Request a **single file with embedded CSS/JS** for simplicity

---

### STEP 3: Review Generated Code

Before pushing to GitHub:

1. **Visual Check**: Open the HTML file locally in your browser
2. **Mobile Test**: Use browser DevTools to test responsive behavior
3. **Link Check**: Verify all navigation links work
4. **Form Check**: Ensure forms are correctly structured

**Quick Local Preview:**
```bash
# Option 1: Python (if installed)
cd /path/to/your/html
python -m http.server 8000
# Open http://localhost:8000

# Option 2: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"

# Option 3: Just double-click the HTML file
```

---

### STEP 4: Push to GitHub

**Using GitHub Desktop (Easiest):**
1. Open GitHub Desktop
2. Select your `zyborn` repository
3. You'll see changed files listed
4. Write a commit message: `Update hero CTA position per SPEC v2.1`
5. Click "Commit to main"
6. Click "Push origin"

**Using Command Line:**
```bash
cd /path/to/zyborn-repo
git add .
git commit -m "Update hero CTA position per SPEC v2.1"
git push origin main
```

---

### STEP 5: Verify Deployment

1. **Vercel Dashboard**: Check deployment status at `vercel.com/dashboard`
2. **Live Site**: Visit your URL within 30-60 seconds
3. **Clear Cache**: If changes don't appear, hard refresh (Ctrl+Shift+R)

---

## CHANGE TYPES & EXAMPLES

### Type 1: Text Content Changes

**SPEC Change:**
```markdown
**Headline** (H1):
```
WORLD's FIRST CANNED BTC SINCE 2009.01.03
```
↓ CHANGED TO ↓
```
THE ORIGINAL CANNED BITCOIN — SINCE 2009.01.03
```
```

**Claude Prompt:**
> "Update the H1 headline text from 'WORLD's FIRST...' to 'THE ORIGINAL CANNED BITCOIN...' as specified in Section 2."

---

### Type 2: Layout Changes

**SPEC Change:**
```markdown
### Email Capture Form

**Layout**: 
- Desktop: Two columns (form left, social right)    ← CHANGED
- Mobile: Stacked (form above social)
```

**Claude Prompt:**
> "Restructure the hero email form to use a two-column layout on desktop with form fields on the left and social links on the right."

---

### Type 3: Adding New Sections

**SPEC Change:**
```markdown
## SECTION 7A: TESTIMONIALS (NEW)

**ID**: `#testimonials`

### Layout
- Background: `var(--color-black)`
- Card grid: 3 columns desktop, 1 column mobile

### Content
- Testimonial 1: "..." — Collector Name
- Testimonial 2: "..." — Curator Name
```

**Claude Prompt:**
> "Add a new Testimonials section between Email Capture and Mission, following the new SECTION 7A specification."

---

### Type 4: Style/Design Changes

**SPEC Change:**
```markdown
### CTA Button
- Style: `.btn-primary`
- Border-radius: 8px (changed from: 2px)           ← CHANGED
- Font-size: 16px (changed from: 14px)             ← CHANGED
```

**Claude Prompt:**
> "Update all primary CTA buttons to use 8px border-radius and 16px font size as per the updated button specification."

---

## SPEC FILE CHANGELOG TEMPLATE

Add this section at the bottom of each SPEC file:

```markdown
---

## CHANGELOG

| Version | Date | Change | Deployed |
|---------|------|--------|----------|
| 1.0 | Dec 15, 2025 | Initial release | ✅ |
| 1.1 | Dec 18, 2025 | Updated hero headline text | ✅ |
| 1.2 | Dec 20, 2025 | Moved CTA button below form | ⏳ |
```

---

## TROUBLESHOOTING

### Changes Not Appearing

1. **Hard refresh**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Check Vercel**: Ensure deployment completed successfully
3. **Check file path**: Verify you edited the correct file

### Deployment Failed

1. **Check Vercel logs**: Dashboard → Your Project → Deployments → Click failed deployment
2. **Common issues**: 
   - Invalid JSON in vercel.json
   - Missing closing tags in HTML
   - File encoding issues

### Claude Generated Incorrect Code

1. **Be more explicit**: Paste the full SPEC, not summaries
2. **Reference Brand Kit**: Include design constraints
3. **Request specific output**: "Single HTML file with embedded CSS/JS"

---

## AUTOMATION OPPORTUNITIES (FUTURE)

### Phase 2: GitHub Actions CI/CD

```yaml
# .github/workflows/validate.yml
name: Validate HTML
on: push
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: HTML Validator
        run: npx html-validate "**/*.html"
```

### Phase 3: SPEC-to-Code Automation

Future enhancement: Create a GitHub Action that:
1. Detects SPEC file changes
2. Calls Claude API to generate code
3. Creates a PR with the generated code
4. Auto-merges after visual review

---

## QUICK REFERENCE

| Action | Where | How Long |
|--------|-------|----------|
| Edit SPEC | Local/GitHub | 5-15 min |
| Generate Code | Claude | 2-5 min |
| Push to GitHub | GitHub Desktop/CLI | 1 min |
| Vercel Deploy | Automatic | 30-60 sec |
| **Total** | — | **~10-25 min** |

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2025 | ZYBORN | Initial workflow |
