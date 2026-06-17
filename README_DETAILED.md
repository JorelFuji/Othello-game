# ねこオセロ · Neko Othello

A cute, Japanese-themed Othello (Reversi): sleeping-cat discs that flip when captured,
a matcha board, drifting sakura petals. **Pass & Play** on one device needs no account.
**Play Online** uses Firebase Authentication (Email/password + Google) and Firestore.

Firebase project: **othella-flutter** (868703065049)

## Architecture (UI never touches Firebase directly)

```
src/
  engine.js                 Pure Othello rules (no React/Firebase) — unit-tested
  firebase.js               Lazy init + Google provider; off until real keys exist
  auth.js                   Email/password + Google sign-in wrappers
  useAuth.js                Auth state hook -> { user, signInGoogle, signInEmail, signUpEmail, signOut }
  game-service.js           Firestore matchmaking, live sync, move, pass (uses signed-in uid)
  useOthelloMultiplayer.js  Bridge hook: mode "local" or "online" -> same { board, turn, playMove }
  SignIn.jsx                Cute sign-in panel
  NekoOthello.jsx           Board UI; gates online play behind sign-in
firestore.rules             Turn-enforcing security rules
```

## TEST IT — Pass & Play (no Firebase, no account)

```bash
npm install
npm run dev          # open http://localhost:5173 -> "Pass & Play"
```

## TEST IT — Online with accounts

In the **othella-flutter** Firebase console (or via Claude Code + the Firebase agent skills,
which can do these from your authenticated terminal):

1. **Authentication > Sign-in method**: enable **Email/Password** and **Google**.
2. **Authentication > Settings > Authorized domains**: ensure `localhost` is listed (it is by
   default) and add your deploy domain later (e.g. `othella-flutter.web.app`).
3. **Firestore Database**: create the database.
4. **Project settings > Your apps**: register a **Web app** (the project was made for Flutter,
   so add the `</>` Web platform) and copy its `apiKey` + `appId`.
5. Paste those two into `src/firebase.js` (replace the `PASTE_...` values) or a `.env` file.

Then:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
npm run dev          # "Play Online" -> sign in -> "Find a match" in two tabs/devices
```

> Spark (no-cost) plan: moves are validated client-side and locked by the rules (a player can
> only write on their own turn and can't take the other seat). Server-side anti-cheat needs
> Cloud Functions (Blaze) — unnecessary for friendly play.

## Deploy

```bash
npm run build
firebase deploy --only hosting    # -> https://othella-flutter.web.app
```

## Push to GitHub

```bash
git init && git add . && git commit -m "Neko Othello: Firebase auth (email + Google) + Firestore"
git branch -M main
git remote add origin https://github.com/JorelFuji/Othello-game.git
git push -u origin main
```
