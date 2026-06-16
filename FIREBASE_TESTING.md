# 🌸 Neko Othello - Firebase Testing & Deployment Guide 🐱

**Complete guide to deploy, test, and monitor your game on Firebase.**

---

## 🚀 **Quick Deploy (5 minutes)**

### **1. Ensure Firebase Keys Are Set**

Edit `src/firebase.js` and add your keys:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxXnhwFzwB8p_YOUR_ACTUAL_KEY",  // ← From Firebase Console
  authDomain: "othella-flutter.firebaseapp.com",
  projectId: "othella-flutter",
  storageBucket: "othella-flutter.firebasestorage.app",
  messagingSenderId: "868703065049",
  appId: "1:868703065049:web:YOUR_ACTUAL_APP_ID",  // ← From Firebase Console
};
```

### **2. Build & Deploy**

```bash
npm run build
firebase deploy
```

**Your game is live at:**
```
🎮 https://othella-flutter.web.app
```

---

## 🧪 **Testing Strategies**

### **Strategy 1: Local Dev Server (Talks to Live Firebase)**

```bash
npm run dev
```

Opens at `http://localhost:3000`

**Benefits:**
- ✅ Hot reload on code changes
- ✅ Talks to **live** Firestore/Auth (real testing!)
- ✅ Fast iteration
- ✅ Full dev tools access

**Test:**
1. Window 1: Click 🌐 Play Online → Creates lobby
2. Window 2: Click 🌐 Play Online → Joins lobby
3. Both sync in real-time ⚡

---

### **Strategy 2: Local Emulator (No Firebase Costs)**

Test locally without touching live Firebase:

```bash
firebase emulators:start
```

Opens at `http://localhost:4000`

**Benefits:**
- ✅ No costs (completely free)
- ✅ Offline testing
- ✅ Reset data instantly
- ✅ Test security rules before deploying

**Setup:**
1. Start emulator: `firebase emulators:start`
2. Update `src/firebase.js`:
```javascript
import { connectAuthEmulator } from "firebase/auth";
import { connectFirestoreEmulator } from "firebase/firestore";

if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
  connectFirestoreEmulator(db, "localhost", 8080);
}
```
3. Run dev server: `npm run dev`
4. Test locally against emulated backend

---

### **Strategy 3: Deployed (Production Testing)**

Test on the live Firebase URL:

```
https://othella-flutter.web.app
```

**Benefits:**
- ✅ Real-world testing
- ✅ Test on any device/network
- ✅ Share with friends
- ✅ Monitor real-time activity

**Test:**
1. Open in 2 browser windows/devices
2. Both click 🌐 Play Online
3. Watch real-time sync work globally! 🌍

---

## 📊 **Firebase Console URLs**

### **Your Project Dashboards**

**Project Overview:**
```
https://console.firebase.google.com/project/othella-flutter/overview
```
Check project settings, billing, integrations.

**Firestore Database Console:**
```
https://console.firebase.google.com/project/othella-flutter/firestore/data
```
View live games as they're created:
- Click **games** collection
- See each game document
- Monitor real-time updates

**Authentication Console:**
```
https://console.firebase.google.com/project/othella-flutter/authentication/users
```
View anonymous users signing in from your game.

**Realtime Database Console:**
```
https://console.firebase.google.com/project/othella-flutter/database/data
```
(Not used in this version, but available for future features)

**Hosting Console:**
```
https://console.firebase.google.com/project/othella-flutter/hosting/sites
```
View deployment history, analytics, traffic.

**Analytics Console:**
```
https://console.firebase.google.com/project/othella-flutter/analytics/overview
```
(Optional: track game events)

---

## ✅ **Complete Testing Checklist**

### **Local Testing (Dev Server)**

```bash
npm run dev
```

- [ ] **Pass & Play Mode**
  - [ ] Black plays first
  - [ ] Click glowing petals to place cats
  - [ ] Opponent cats flip automatically
  - [ ] Score updates
  - [ ] Auto-pass works
  - [ ] Game ends correctly
  - [ ] Play Again resets board

- [ ] **Online Multiplayer Mode**
  - [ ] First window: Click 🌐 Play Online
  - [ ] Lobby ID appears (first 8 chars shown)
  - [ ] Waiting message shows ⏳
  - [ ] Second window: Click 🌐 Play Online
  - [ ] Second window joins immediately ✅
  - [ ] Both show "active" status
  - [ ] Board syncs perfectly
  - [ ] Turn indicator updates both windows
  - [ ] Moves appear instantly (<500ms)
  - [ ] Disconnecting & reconnecting works
  - [ ] Game state persists

### **Firebase Console Verification**

1. Open Firebase Console
2. Go to **Firestore Database** → **games** collection
3. While playing locally:
   - [ ] See new game document created
   - [ ] `status: "waiting"` appears initially
   - [ ] `status: "active"` when player 2 joins
   - [ ] `board` array updates with each move
   - [ ] `turn` switches between 1 and 2
   - [ ] `updatedAt` timestamp updates

### **Production Testing**

```bash
npm run build
firebase deploy
```

Test at: `https://othella-flutter.web.app`

- [ ] Page loads quickly
- [ ] Pass & Play works
- [ ] Online Multiplayer creates lobby
- [ ] Can test on mobile devices
- [ ] Works on different networks
- [ ] Real-time sync works globally

### **Mobile Testing**

```bash
# Find your IP
ifconfig | grep "inet " | grep -v 127.0.0.1
# Or on Windows:
ipconfig | findstr "IPv4"

# Open on phone:
http://YOUR_IP:3000
```

- [ ] Layout is responsive
- [ ] Touch controls work
- [ ] Animations smooth
- [ ] No console errors (F12)

---

## 🔍 **Monitoring Your Game**

### **View Active Games**

Firebase Console → Firestore → **games** collection

You'll see documents like:
```
games/
├── aBcD1234EfGh5678
│   ├── board: [0, 0, ..., 1, 2, ...]
│   ├── status: "active"
│   ├── turn: 1
│   └── updatedAt: 2026-06-16 23:30:45
├── iJkL9012MnOp3456
│   ├── board: [0, 0, ..., 2, 1, ...]
│   ├── status: "waiting"
│   └── ...
└── ...
```

### **View Active Players**

Firebase Console → Authentication → **Users**

You'll see:
- Anonymous user accounts created
- Sign-in dates & times
- Device info
- Last sign-in

### **View API Usage**

Firebase Console → **Usage and Billing**

Monitor:
- Firestore read/write operations
- Authentication calls
- Hosting bandwidth
- Keep within free tier limits ✅

---

## 📈 **Performance Monitoring**

### **What to Monitor**

| Metric | Target | How to Check |
|--------|--------|--------------|
| **Move sync time** | <500ms | Time from click to opponent sees move |
| **Game creation** | <1s | Time to see "waiting for opponent" |
| **Lobby join** | <2s | Time for second player to see board |
| **Page load** | <3s | Time for https://othella-flutter.web.app to render |
| **Firestore reads** | <50K/day | Firebase Console → Usage |
| **Firestore writes** | <20K/day | Firebase Console → Usage |

### **Using Chrome DevTools**

1. Open game at `https://othella-flutter.web.app`
2. Press **F12** → **Network** tab
3. Make a move
4. Look for Firebase API calls:
   - Check latency (should be <500ms)
   - Check payload size (should be <10KB per move)

---

## 🐛 **Debugging**

### **Check Console for Errors**

```bash
npm run dev
# Press F12 → Console tab
```

Look for:
- ✅ No red errors
- ✅ "Firebase initialized successfully" message
- ✅ Move updates in real-time

### **Common Issues**

| Issue | Cause | Fix |
|-------|-------|-----|
| **"Firebase not configured"** | Missing API key | Add key to src/firebase.js |
| **Game doesn't sync** | Rules not deployed | Run `firebase deploy --only firestore:rules` |
| **Auth fails** | Anonymous not enabled | Enable in Firebase Console → Authentication |
| **Firestore reads fail** | Database doesn't exist | Create at Firebase Console → Firestore |
| **Can't join game** | Bad rules | Check `firestore.rules` syntax |

### **Enable Debug Logging**

```javascript
// In src/firebase.js, after initialization:
import { enableLogging } from "firebase/firestore";
enableLogging(true);  // Verbose Firestore logging
```

---

## 🚨 **Monitoring for Issues**

### **Set Up Error Alerts**

1. Firebase Console → **Performance** (optional)
2. Or use Google Cloud Monitoring:
   ```
   https://console.cloud.google.com/monitoring
   ```

3. Create alerts for:
   - High Firestore write errors
   - Auth failures
   - Hosting 5xx errors

---

## 📊 **Analytics (Optional)**

Add event tracking to understand gameplay:

```javascript
// In OthelloGame.jsx
import { logEvent } from "firebase/analytics";
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);

function onGameStart(mode) {
  logEvent(analytics, "game_started", {
    mode: mode,  // "pass_and_play" or "online"
    timestamp: new Date().toISOString()
  });
}

function onGameEnd(winner, blackCount, whiteCount) {
  logEvent(analytics, "game_completed", {
    winner: winner,
    black_score: blackCount,
    white_score: whiteCount
  });
}
```

View in Firebase Console → Analytics.

---

## 🔒 **Security Checklist**

- [ ] API keys are environment variables (not in source)
- [ ] Firestore rules deployed and tested
- [ ] Anonymous auth restricted to authenticated users only
- [ ] No sensitive data in game documents
- [ ] Rate limiting configured (if needed)

---

## 🚀 **Deployment Workflow**

### **Development Cycle**

```bash
# 1. Make code changes
# 2. Test locally
npm run dev

# 3. Build
npm run build

# 4. Deploy to Firebase
firebase deploy

# 5. Test on production URL
# https://othella-flutter.web.app
```

### **Rollback If Issues**

```bash
# See deployment history
firebase hosting:channels:list

# Rollback to previous version
firebase hosting:rollback
```

---

## 📱 **Testing on Multiple Devices**

### **Same Network**

```bash
npm run dev

# On phone (connected to same WiFi):
http://YOUR_MACHINE_IP:3000
```

### **Different Networks**

```bash
# Use production URL (works anywhere)
https://othella-flutter.web.app

# Open on any device with internet
```

### **Browser Compatibility**

Test on:
- ✅ Chrome / Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎯 **Test Scenarios**

### **Scenario 1: Happy Path**
1. Open game at https://othella-flutter.web.app
2. Click 🌐 Play Online
3. Copy lobby ID
4. Open new tab, paste URL
5. Click 🌐 Play Online
6. Play a complete game
7. Verify winner screen ✅

### **Scenario 2: Disconnection Recovery**
1. Start online game
2. Close one browser tab mid-game
3. Reopen tab, go back to URL
4. Click 🌐 Play Online
5. Verify game state restored ✅

### **Scenario 3: Multiple Concurrent Games**
1. Start game A (Player 1)
2. Start game B (Player 1) in different tab
3. Have players 2 join both
4. Verify both games sync independently ✅

### **Scenario 4: Mobile vs Desktop**
1. Play on desktop at https://othella-flutter.web.app
2. Have friend play on mobile same URL
3. Verify real-time sync across devices ✅

---

## 📞 **Support**

- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **GitHub Issues**: https://github.com/JorelFuji/othello-game/issues
- **Firebase Support**: https://firebase.google.com/support

---

**Your game is production-ready! 🎉**

Start testing at: **https://othella-flutter.web.app**

---

**Made with ❤️ • Last updated: 2026-06-16**
