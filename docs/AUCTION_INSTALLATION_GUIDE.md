# ZYBORN AUCTION SYSTEM - INSTALLATION GUIDE
## Complete Step-by-Step Deployment for auction.zyborn.com

> **Version**: 1.0  
> **Date**: December 22, 2025  
> **Estimated Time**: 2-3 hours total

---

## PREREQUISITES

- Node.js v22 LTS ([download](https://nodejs.org/))
- Git
- GitHub account
- Vercel account
- Google account (for Firebase)
- GoDaddy access

Verify Node.js: `node --version` → Should show v22.x.x

---

## SECTION 1: REPOSITORY SETUP (~10 min)

### 1.1 Fork Repository
1. Go to: https://github.com/hmellor/auction-website
2. Click "Fork" → Name: `zyborn-auction` → Create fork

### 1.2 Clone Locally
```bash
cd C:\GitHub
git clone https://github.com/YOUR_USERNAME/zyborn-auction.git
cd zyborn-auction
npm install
```

### 1.3 Test Local Dev
```bash
npm run dev
# Opens http://localhost:5173
```

---

## SECTION 2: FIREBASE SETUP (~20 min)

### 2.1 Create Project
1. Go to: https://console.firebase.google.com/
2. Add project → Name: `zyborn-auction`
3. Disable Analytics → Create

### 2.2 Add Web App
1. Click Web icon `</>`
2. Name: `zyborn-auction-web`
3. DON'T enable Firebase Hosting
4. Copy the `firebaseConfig` object

### 2.3 Enable Auth
1. Authentication → Get started
2. Sign-in method → Anonymous → Enable

### 2.4 Create Firestore
1. Firestore Database → Create database
2. Production mode → Location: `europe-west2`

### 2.5 Security Rules
1. Firestore → Rules tab
2. Paste rules from hmellor/auction-website README
3. Generate MD5 admin password
4. Replace `"insert long random secret string"` with MD5 hash
5. Publish

---

## SECTION 3: CONFIGURE APP (~15 min)

### 3.1 Firebase Config
Edit: `src/firebase/config.jsx`
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 3.2 Auction Item
Edit: `public/items.yml`
```yaml
- id: 1
  primaryImage: /images/canned_btc.jpg
  title: "WORLD's FIRST CANNED BTC"
  subtitle: "SINCE 2009.01.03 — Limited Edition 1/21"
  detail: |
    Bitcoin as Survival Rations...
  secondaryImage: /images/canned_btc.jpg
  currency: "$"
  amount: 1000000
  endTime: "2026-01-03T16:00:00.000Z"
```

### 3.3 Disable Demo
Edit: `src/App.jsx` → Change `demo = true` to `demo = false`

---

## SECTION 4: DEPLOY TO VERCEL (~15 min)

### 4.1 Push to GitHub
```bash
git add .
git commit -m "Configure ZYBORN auction"
git push origin main
```

### 4.2 Create Vercel Project
1. vercel.com → Add New → Project
2. Import `zyborn-auction`
3. Framework: **Vite**
4. Build: `npm run build`
5. Output: `dist`
6. Deploy

### 4.3 Add Custom Domain
1. Vercel → Settings → Domains
2. Add: `auction.zyborn.com`

### 4.4 DNS (GoDaddy)
Add CNAME record:
| Name | Value |
|------|-------|
| auction | cname.vercel-dns.com |

---

## SECTION 5: ADMIN SETUP (~10 min)

### 5.1 Create User
1. Visit auction.zyborn.com
2. Sign up with username

### 5.2 Grant Admin
1. Firebase Console → Firestore
2. Find your user in `users` collection
3. Edit `admin` field → Paste MD5 password

### 5.3 Initialize Auction
1. auction.zyborn.com → Admin button
2. Click "Update all items"

---

## TESTING CHECKLIST

- [ ] User registration works
- [ ] Can place bid
- [ ] Real-time updates work
- [ ] Admin panel accessible
- [ ] Mobile responsive

---

## TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| Firebase auth error | Check config.jsx values |
| Permission denied | Check Firestore rules |
| Build fails | Verify Node v22+ |
| Domain not working | Wait 10 min for DNS |

---

## QUICK COMMANDS

```bash
npm run dev      # Development
npm run build    # Production build
npm run preview  # Preview build
```

---

**Document Version**: 1.0 | December 22, 2025
