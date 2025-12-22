# ZYBORN DAILY DEPLOYMENT WORKFLOW v3.0
## Claude Stack Edition: Claude Code + Desktop + Chrome Extension

> **Version**: 3.0  
> **Updated**: December 22, 2025  
> **Purpose**: Streamlined daily development using full Claude toolchain

---

## YOUR CLAUDE STACK OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ZYBORN CLAUDE STACK                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │  CLAUDE CODE    │   │ CLAUDE DESKTOP  │   │ CLAUDE CHROME   │           │
│  │  (VS Code)      │   │ (Desktop App)   │   │ (Extension)     │           │
│  ├─────────────────┤   ├─────────────────┤   ├─────────────────┤           │
│  │ ✓ Code edits    │   │ ✓ Full projects │   │ ✓ Page analysis │           │
│  │ ✓ Terminal cmds │   │ ✓ File creation │   │ ✓ Live debugging│           │
│  │ ✓ Git staging   │   │ ✓ Research      │   │ ✓ Quick fixes   │           │
│  │ ✓ Inline help   │   │ ✓ Long context  │   │ ✓ Vercel checks │           │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘           │
│         ↓                     ↓                     ↓                       │
│    Quick Edits          Major Changes          Live Testing                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## TOOL SELECTION GUIDE

| Task | Use This Tool | Why |
|------|---------------|-----|
| **Edit a specific file** | Claude Code (VS) | Direct file access, inline changes |
| **Generate new HTML page** | Claude Desktop | Full SPEC context, file output |
| **Fix a bug in JS** | Claude Code (VS) | Terminal for testing, Git for versioning |
| **Check why deploy failed** | Chrome Extension + Desktop | Analyze Vercel dashboard |
| **Create new component** | Claude Desktop | Multi-file context needed |
| **Quick text change** | Claude Code (VS) | Fastest for small edits |
| **Debug form submission** | Chrome Extension | Network inspection |
| **Write documentation** | Claude Desktop | Long-form output |
| **Git commit/push** | GitHub Desktop | Visual diffs, safe commits |

---

## DAILY WORKFLOW DIAGRAM

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                          DAILY WORKFLOW                                    ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                            ║
║   STEP 1: PLAN                    STEP 2: EDIT                            ║
║   ══════════════                  ════════════                            ║
║   ┌──────────────┐               ┌──────────────┐                         ║
║   │ Review SPEC  │               │ Claude Code  │  ← Small changes        ║
║   │ file for     │───────────────│    (VS)      │                         ║
║   │ what to do   │      OR       ├──────────────┤                         ║
║   └──────────────┘               │ Claude       │  ← Major changes        ║
║         │                        │ Desktop      │    (Full HTML gen)      ║
║         │                        └──────────────┘                         ║
║         ▼                               │                                  ║
║   Open relevant                         │                                  ║
║   SPEC file                             ▼                                  ║
║                                                                            ║
║   STEP 3: TEST                    STEP 4: DEPLOY                          ║
║   ═══════════════                 ══════════════                          ║
║   ┌──────────────┐               ┌──────────────┐                         ║
║   │ Local Server │               │ GitHub       │                         ║
║   │ OR Chrome    │───────────────│ Desktop      │                         ║
║   │ Extension    │               │ Push         │                         ║
║   └──────────────┘               └──────────────┘                         ║
║         │                               │                                  ║
║         ▼                               ▼                                  ║
║   Preview changes                Live on Vercel                            ║
║   locally                        in ~60 seconds                            ║
║                                                                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## WORKFLOW A: QUICK EDITS (Most Common)

**Use Case**: Text changes, minor HTML updates, CSS tweaks

### Step 1: Open VS Code with Claude Code

```
1. Launch VS Code
2. Open folder: C:\GitHub\zyborn
3. Navigate to the file you need to edit
4. Press Ctrl+L to open Claude Code sidebar
```

### Step 2: Make Your Edit

**Method A: Inline Selection**
```
1. Highlight the code/text you want to change
2. Press Ctrl+K (or right-click → "Ask Claude")
3. Type your request
4. Review the suggestion
5. Click "Apply" to accept
```

**Method B: Chat Panel**
```
1. Open Claude Code panel (sidebar)
2. Describe what you need
3. Claude will show the diff
4. Click "Apply" to make the change
```

### Step 3: Test Locally (Optional)

```bash
cd C:\GitHub\zyborn\public
python -m http.server 8000
# Open http://localhost:8000
```

### Step 4: Commit & Push

```
1. Save all files (Ctrl+S)
2. Open GitHub Desktop
3. Write commit message
4. Click "Commit to main"
5. Click "Push origin"
```

---

## WORKFLOW B: MAJOR CHANGES (Full Page Generation)

**Use Case**: New sections, layout changes, full page rewrites

### Step 1: Update SPEC File
Edit the relevant SPEC file in `docs/`

### Step 2: Generate HTML with Claude Desktop

Use this prompt template:

```
═══════════════════════════════════════════════════════════════
ZYBORN HTML GENERATION REQUEST
═══════════════════════════════════════════════════════════════

CONTEXT:
- Site: zyborn.com
- Page: [Main Landing / Curatorial / Press]
- Repository: C:\GitHub\zyborn

TASK:
Regenerate the complete HTML file based on my updated SPEC.

CRITICAL RULES:
1. Generate ONLY the HTML file
2. Link to external CSS: <link rel="stylesheet" href="/css/styles.css">
3. Link to external JS: <script src="/js/main.js"></script>
4. DO NOT embed any <style> tags
5. DO NOT embed any <script> tags with code

SPEC FILE:
[Paste your complete updated SPEC here]
═══════════════════════════════════════════════════════════════
```

### Step 3: Review, Test & Deploy
Same as Workflow A steps 3-4

---

## WORKFLOW C: DEBUGGING

**Use Case**: Forms not working, styles broken, deployment failed

### Step 1: Identify the Problem

**Using Chrome Extension:**
1. Go to the broken page
2. Click Claude Chrome Extension
3. Ask: "Analyze this page and identify the issue"

**Using DevTools:**
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network for failed requests

### Step 2: Fix with Claude Code

1. Open VS Code
2. Open Claude Code panel
3. Paste the error message
4. Apply the fix

---

## WORKFLOW D: AUCTION SYSTEM

### Development
```bash
cd C:\GitHub\zyborn-auction
npm run dev
# Opens at http://localhost:5173
```

### Deploy
```bash
npm run build
git add .
git commit -m "Your change"
git push origin main
# Vercel auto-deploys
```

---

## FILE LOCATION REFERENCE

### Main Site (zyborn.com)
```
C:\GitHub\zyborn\
├── public/
│   ├── index.html          ← Main landing page
│   ├── curatorial/index.html
│   ├── press/index.html
│   ├── css/styles.css      ← 🔒 LOCKED
│   └── js/main.js          ← 🔒 LOCKED
├── api/
│   ├── subscribe.js
│   └── press-inquiry.js
└── docs/
    └── ZYBORN_*.md         ← SPEC files
```

### Auction Site (auction.zyborn.com)
```
C:\GitHub\zyborn-auction\
├── src/
│   ├── App.jsx
│   └── firebase/config.jsx  ← 🔐 Firebase
├── public/
│   └── items.yml            ← Auction config
└── index.html
```

---

## QUICK REFERENCE COMMANDS

### VS Code Shortcuts
| Action | Shortcut |
|--------|----------|
| Open Claude Code | `Ctrl+L` |
| Ask Claude about selection | `Ctrl+K` |
| Open terminal | `` Ctrl+` `` |
| Save file | `Ctrl+S` |

### Terminal Commands
```bash
# Main site local server
cd C:\GitHub\zyborn\public
python -m http.server 8000

# Auction site dev server
cd C:\GitHub\zyborn-auction
npm run dev
```

---

## VERIFICATION CHECKLIST

### Before pushing:
- [ ] Only expected files changed
- [ ] No CSS/JS modified unintentionally
- [ ] Local preview works
- [ ] Commit message is clear

### After pushing:
- [ ] Vercel build succeeded
- [ ] Site loads correctly (hard refresh)
- [ ] Forms still work
- [ ] No console errors

---

## DOCUMENT CONTROL

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Dec 2025 | Original |
| 2.0 | Dec 2025 | Separated CSS/JS |
| 3.0 | Dec 22, 2025 | Claude Stack integration |
