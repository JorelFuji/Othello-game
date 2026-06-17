// Firebase init for project: othella-flutter (868703065049)
// Lazy init: Pass & Play runs with NO keys. Online + Auth activate once real
// apiKey + appId are present (here or in .env). Web config values are not secrets.
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const cfg = {
  // Paste from Firebase console > Project settings > Your apps (Web app):
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "PASTE_WEB_API_KEY",
  appId:  import.meta.env.VITE_FIREBASE_APP_ID  || "PASTE_WEB_APP_ID",
  // Already correct for your project:
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "othella-flutter.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "othella-flutter",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "othella-flutter.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "868703065049",
};

export const firebaseEnabled = Boolean(cfg.apiKey && !cfg.apiKey.startsWith("PASTE") && cfg.projectId);

let _app, _auth, _db;
export function services() {
  if (!firebaseEnabled) throw new Error("Firebase keys not set yet (apiKey / appId).");
  if (!_app) { _app = initializeApp(cfg); _auth = getAuth(_app); _db = getFirestore(_app); }
  return { auth: _auth, db: _db };
}

export const googleProvider = new GoogleAuthProvider();
