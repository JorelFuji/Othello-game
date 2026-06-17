// Thin wrapper over Firebase Auth. Email/password + Google Sign-in.
import {
  onAuthStateChanged, signInWithPopup, signOut,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
} from "firebase/auth";
import { services, googleProvider } from "./firebase.js";

export function watchUser(cb) { const { auth } = services(); return onAuthStateChanged(auth, cb); }
export function googleSignIn() { const { auth } = services(); return signInWithPopup(auth, googleProvider); }
export function emailSignUp(email, pw) { const { auth } = services(); return createUserWithEmailAndPassword(auth, email, pw); }
export function emailSignIn(email, pw) { const { auth } = services(); return signInWithEmailAndPassword(auth, email, pw); }
export function logOut() { const { auth } = services(); return signOut(auth); }
export function currentUid() { const { auth } = services(); return auth.currentUser ? auth.currentUser.uid : null; }
