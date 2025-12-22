# ZYBORN QUICK REFERENCE CARD
## Print This and Keep at Your Desk

---

## 🎯 TOOL DECISION TREE

```
What are you doing?
       │
       ├─→ Small text/code edit? ──────→ CLAUDE CODE (VS Code)
       │
       ├─→ Generate full HTML page? ───→ CLAUDE DESKTOP
       │
       ├─→ Debug live site? ───────────→ CHROME EXTENSION
       │
       ├─→ Research/documentation? ────→ CLAUDE DESKTOP
       │
       └─→ Push to production? ────────→ GITHUB DESKTOP
```

---

## ⌨️ KEYBOARD SHORTCUTS

### VS Code + Claude Code
| Action | Shortcut |
|--------|----------|
| Open Claude panel | `Ctrl+L` |
| Ask about selection | `Ctrl+K` |
| Open terminal | `Ctrl+\`` |
| Save file | `Ctrl+S` |

### Browser
| Action | Shortcut |
|--------|----------|
| Hard refresh | `Ctrl+Shift+R` |
| Open DevTools | `F12` |

---

## 📁 FILE LOCATIONS

### Main Site
```
C:\GitHub\zyborn\public\
├── index.html
├── curatorial\index.html
├── press\index.html
├── css\styles.css    🔒
└── js\main.js        🔒
```

### Auction Site
```
C:\GitHub\zyborn-auction\
├── src\App.jsx
├── src\firebase\config.jsx
└── public\items.yml
```

---

## 🚀 QUICK COMMANDS

```bash
# Main site preview
cd C:\GitHub\zyborn\public
python -m http.server 8000

# Auction dev
cd C:\GitHub\zyborn-auction
npm run dev
```

---

## ✅ CHECKLISTS

### Before Push
□ Only expected files changed
□ No CSS/JS modified
□ Local preview OK

### After Push
□ Vercel build OK
□ Hard refresh site
□ Forms work

---

## 🔗 URLS

| Service | URL |
|---------|-----|
| Main Site | zyborn.com |
| Auction | auction.zyborn.com |
| Vercel | vercel.com/dashboard |
| Firebase | console.firebase.google.com |

---

## 📅 KEY DATES

| Date | Event |
|------|-------|
| Dec 24 | Auction opens |
| Jan 3 | Exhibition + Auction closes |

---

## 🆘 EMERGENCY: Rollback

```
Vercel → Deployments → Previous → "..." → Promote to Production
```

---

**v3.0 | December 2025**
