# 🌸 Neko Othello - Quick Start Guide 🐱

**A cute Japanese-themed Othello game with Firebase real-time multiplayer.**

---

## ⚡ **Quick Start (2 minutes)**

### **1. Clone & Install**
```bash
git clone https://github.com/JorelFuji/othello-game.git
cd othello-game
npm install
```

### **2. Play Locally (No Firebase Setup Needed!)**
```bash
npm run dev
```

Opens at `http://localhost:3000` — **Pass & Play works immediately** 🎮

### **3. Enable Online Multiplayer (Optional, 15 min)**

See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for step-by-step Firebase setup.

---

## 🎮 **How to Play**

| Rule | Action |
|------|--------|
| **Black moves first** | Player 1 (🖤) |
| **Place your cat** | Click a glowing sakura petal (💗) |
| **Capture opponent** | Sandwich opponent cats between your pieces |
| **Opponent cats flip** | They change color automatically 🔄 |
| **Auto-pass** | No valid moves? Turn skips automatically ⏸️ |
| **Game ends** | When neither player can move 🎊 |
| **Winner** | Most cats on the board 👑 |

---

## 🏗️ **Architecture**

### **Local Mode** (Pass & Play)
- Pure React state management
- No network requests
- Works offline ✅

### **Online Mode** (Firebase)
- Real-time Firestore sync
- Anonymous authentication
- Secure game rules
- Deploy anywhere 🚀

---

## 📚 **Documentation**

| File | Purpose |
|------|---------|
| **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** | Complete Firebase setup guide |
| **[README_DETAILED.md](./README_DETAILED.md)** | Architecture & deployment |
| `src/othello-engine.js` | Game logic (flips, move validation) |
| `src/game-service.js` | Firestore API |
| `firestore.rules` | Security rules |

---

## 🚀 **Deploy to Production**

### **Build**
```bash
npm run build
```

### **Deploy to Firebase Hosting**
```bash
firebase deploy
```

Live at: `https://othella-flutter.web.app` 🌐

---

## 📱 **Play with Friends**

1. **Pass & Play**: Two players on one device (no setup)
2. **Online**: 
   - First player creates game (waits in lobby)
   - Second player joins with lobby ID
   - Real-time sync via Firestore ⚡

---

## 🛠️ **Stack**

- **React 18** — UI framework
- **Vite** — Fast bundler
- **Firebase** — Backend (Auth + Firestore + Hosting)
- **CSS3** — Beautiful animations

---

## ✨ **Features**

- ✅ Adorable cat pieces (🐈‍⬛ 🐈)
- ✅ Sakura animations 🌸
- ✅ Real-time multiplayer
- ✅ Move hints (glowing petals)
- ✅ Auto-pass logic
- ✅ Responsive design
- ✅ Free tier friendly
- ✅ Secure (Firestore rules)

---

## 🐛 **Troubleshooting**

**Game doesn't load?**
→ Delete `node_modules`, run `npm install` again

**Port 3000 in use?**
→ `npm run dev -- --port 3001`

**Firebase won't connect?**
→ See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

---

## 📖 **Next Steps**

1. ✅ Play locally (`npm run dev`)
2. 📖 Read [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
3. 🔑 Paste Firebase keys
4. 🌐 Enable online play
5. 🚀 Deploy to Firebase Hosting

---

## 💡 **Customization Ideas**

- Add AI opponent (Minimax)
- Leaderboards & rankings
- Game replay history
- Custom board themes
- Sound effects 🔊
- Mobile app (React Native)

---

**Made with ❤️ for cute games & Firebase**

🌸 Enjoy! 🐱
