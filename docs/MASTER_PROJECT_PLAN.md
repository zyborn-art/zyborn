# ZYBORN MASTER PROJECT PLAN
## December 2025 - January 2026 Roadmap

> **Version**: 3.0  
> **Last Updated**: December 22, 2025  
> **Status**: Active Development

---

## EXECUTIVE SUMMARY

This document outlines the complete project scope for ZYBORN's digital infrastructure:

| Domain | Purpose | Status |
|--------|---------|--------|
| `zyborn.com` | Main landing + Press + Curatorial | ✅ LIVE |
| `auction.zyborn.com` | Online bidding platform | 🔧 IN PROGRESS |
| `live.zyborn.com` | YouTube Live embed for Jan 3 | 📋 PLANNED |

**Critical Dates:**
- **Dec 24, 2025**: Auction opens (bidding starts)
- **Jan 3, 2026**: London exhibition + Live performance
- **Jan 3, 2026**: Auction closes

---

## PROJECT PHASES OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ZYBORN PROJECT TIMELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 0 (TODAY)          PHASE 1                PHASE 2                    │
│  ════════════════         ════════               ════════                   │
│  ┌──────────────┐        ┌────────────┐        ┌────────────┐              │
│  │ Claude Stack │───────▶│  AUCTION   │───────▶│   LIVE     │              │
│  │   Setup      │        │  SYSTEM    │        │  STREAM    │              │
│  │ + File Org   │        │  Deploy    │        │  Setup     │              │
│  └──────────────┘        └────────────┘        └────────────┘              │
│      Dec 22                Dec 22-23             Dec 24-30                  │
│                                                                              │
│  PHASE 3                   PHASE 4              PHASE 5                     │
│  ════════                  ════════             ════════                    │
│  ┌────────────┐           ┌────────────┐      ┌────────────┐               │
│  │  TESTING   │──────────▶│  GO LIVE   │─────▶│  JAN 3     │               │
│  │  & QA      │           │  AUCTION   │      │  EVENT     │               │
│  └────────────┘           └────────────┘      └────────────┘               │
│     Dec 23                   Dec 24              Jan 3                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# PHASE 0: DEVELOPMENT ENVIRONMENT SETUP (TODAY)
## Priority: 🔴 CRITICAL | Duration: 2-3 hours

### MAIN TASK 0.1: Claude Stack Configuration

**Objective**: Establish efficient development workflow using Claude Code, Chrome Extension, and Desktop

#### Subtask 0.1.1: VS Code + Claude Code Setup
- Open VS Code
- Verify Claude Code extension is installed
- Configure workspace for `C:\GitHub\zyborn`
- Test inline assistance with `Ctrl+L`

#### Subtask 0.1.2: Claude Desktop MCP Configuration
- Verify filesystem access to `C:\GitHub`
- Test file reading capability

#### Subtask 0.1.3: Chrome Extension Verification
- Test with webpage analysis
- Verify Vercel dashboard access

---

### MAIN TASK 0.2: Repository Structure Cleanup

**Current verified structure:**
```
C:\GitHub\zyborn\
├── public/              # Main site (KEEP)
├── api/                 # Serverless functions (KEEP)
├── docs/                # All specs (KEEP)
├── shared/              # Brand kit (KEEP)
├── apps/                # Empty placeholder (REMOVE)
├── auctions/            # Old placeholder (REMOVE)
└── vercel.json
```

---

# PHASE 1: AUCTION SYSTEM DEPLOYMENT
## Priority: 🔴 CRITICAL | Duration: 4-6 hours

### MAIN TASK 1.1: Fork & Clone Auction Repository
1. Fork https://github.com/hmellor/auction-website
2. Clone to `C:\GitHub\zyborn-auction`
3. Run `npm install`

### MAIN TASK 1.2: Firebase Setup
1. Create Firebase project
2. Add web app
3. Enable Anonymous auth
4. Create Firestore database
5. Configure security rules

### MAIN TASK 1.3: Configure Application
1. Update Firebase config
2. Configure auction item (items.yml)
3. Add ZYBORN branding
4. Disable demo mode

### MAIN TASK 1.4: Deploy to Vercel
1. Push to GitHub
2. Create Vercel project (Vite framework)
3. Add custom domain (auction.zyborn.com)
4. Configure DNS in GoDaddy

### MAIN TASK 1.5: Admin Setup
1. Create user account
2. Grant admin privileges in Firestore
3. Initialize auction items

---

# PHASE 2: LIVE STREAMING SETUP
## Priority: 🟡 MEDIUM | Duration: 2-3 hours

### MAIN TASK 2.1: Create Live Subdomain
1. Create simple YouTube Live embed page
2. Deploy to Vercel
3. Configure DNS for live.zyborn.com

---

## QUICK TASK TRACKER

### TODAY (Dec 22) - Must Complete
| # | Task | Est. Time | Status |
|---|------|-----------|--------|
| 1 | Review & save project docs | 15 min | ⏳ |
| 2 | Fork auction repository | 5 min | 🔜 |
| 3 | Clone & npm install | 10 min | 🔜 |
| 4 | Create Firebase project | 15 min | 🔜 |
| 5 | Configure Firebase auth/db | 20 min | 🔜 |

### TOMORROW (Dec 23) - Should Complete
| # | Task | Est. Time | Status |
|---|------|-----------|--------|
| 1 | Customize auction branding | 1 hr | 🔜 |
| 2 | Deploy to Vercel | 20 min | 🔜 |
| 3 | Add DNS record | 10 min | 🔜 |
| 4 | Create admin account | 15 min | 🔜 |
| 5 | Full testing | 30 min | 🔜 |

---

## RESOURCES & LINKS

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com/ |
| Vercel Dashboard | https://vercel.com/dashboard |
| GoDaddy DNS | https://dcc.godaddy.com/manage/zyborn.com/dns |
| Auction Source | https://github.com/hmellor/auction-website |

---

## DOCUMENT CONTROL

| Version | Date | Changes |
|---------|------|---------|
| 3.0 | Dec 22, 2025 | Complete project roadmap |
