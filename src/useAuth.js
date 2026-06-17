import { useState, useEffect, useCallback } from "react";
import { firebaseEnabled } from "./firebase.js";
import { watchUser, googleSignIn, emailSignUp, emailSignIn, logOut } from "./auth.js";

function pretty(e) {
  const c = (e && e.code) || "";
  if (c.includes("invalid-credential") || c.includes("wrong-password") || c.includes("user-not-found")) return "Wrong email or password.";
  if (c.includes("email-already-in-use")) return "That email already has an account — sign in instead.";
  if (c.includes("weak-password")) return "Password needs at least 6 characters.";
  if (c.includes("invalid-email")) return "That doesn't look like a valid email.";
  if (c.includes("popup-closed") || c.includes("cancelled-popup")) return "Sign-in window closed.";
  if (c.includes("operation-not-allowed")) return "Enable this sign-in method in the Firebase console first.";
  if (c.includes("unauthorized-domain")) return "Add this domain to Auth > Settings > Authorized domains.";
  return (e && e.message) || "Sign-in failed.";
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(firebaseEnabled);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firebaseEnabled) { setLoading(false); return; }
    const unsub = watchUser((u) => { setUser(u); setLoading(false); });
    return () => unsub();
  }, []);

  const wrap = useCallback((fn) => async (...a) => {
    setError("");
    try { await fn(...a); } catch (e) { setError(pretty(e)); }
  }, []);

  return {
    user, loading, error, firebaseEnabled,
    signInGoogle: wrap(googleSignIn),
    signUpEmail: wrap(emailSignUp),
    signInEmail: wrap(emailSignIn),
    signOut: wrap(logOut),
  };
}
