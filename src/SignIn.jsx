import React, { useState } from "react";

const C = { paper: "#FBF4E9", paperDeep: "#F3E7D3", matchaDeep: "#8FAE7A", line: "#6F9460",
  sakura: "#F2A9BC", sakuraDeep: "#E58AA2", charcoal: "#3B3540", cream: "#FFFCF6" };

const input = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px", marginTop: 8,
  borderRadius: 12, border: `2px solid ${C.paperDeep}`, fontSize: 14,
  fontFamily: "'Zen Maru Gothic', sans-serif", background: C.cream, color: C.charcoal,
};
const btn = (bg, shadow, color = "#fff") => ({
  fontFamily: "'Zen Maru Gothic', sans-serif", fontWeight: 700, fontSize: 14, color,
  background: bg, border: "none", borderRadius: 14, padding: "11px 16px", cursor: "pointer",
  boxShadow: `0 4px 0 ${shadow}`, width: "100%",
});

export default function SignIn({ auth }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = () => (mode === "signin" ? auth.signInEmail(email, pw) : auth.signUpEmail(email, pw));

  return (
    <div style={{
      width: "min(92vw, 340px)", background: C.cream, borderRadius: 20, padding: 20,
      boxShadow: `0 10px 0 ${C.matchaDeep}`, border: `3px solid ${C.paperDeep}`,
    }}>
      <div style={{ textAlign: "center", fontFamily: "'Mochiy Pop One', sans-serif", color: C.charcoal, fontSize: 18, marginBottom: 4 }}>
        {mode === "signin" ? "Welcome back 🐾" : "Make an account 🌸"}
      </div>
      <p style={{ textAlign: "center", color: C.line, fontSize: 12, fontWeight: 700, margin: "0 0 12px" }}>
        Sign in to play online
      </p>

      <button onClick={auth.signInGoogle} style={btn(C.cream, C.matchaDeep, C.charcoal)}>
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0", color: C.line, fontSize: 11 }}>
        <div style={{ flex: 1, height: 2, background: C.paperDeep }} /> or <div style={{ flex: 1, height: 2, background: C.paperDeep }} />
      </div>

      <input style={input} type="email" placeholder="email" value={email}
        onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      <input style={input} type="password" placeholder="password" value={pw}
        onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()}
        autoComplete={mode === "signin" ? "current-password" : "new-password"} />

      <div style={{ marginTop: 12 }}>
        <button onClick={submit} style={btn(C.sakura, C.sakuraDeep)}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </div>

      {auth.error && <div style={{ color: C.sakuraDeep, fontSize: 12, fontWeight: 700, marginTop: 10, textAlign: "center" }}>{auth.error}</div>}

      <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: C.line }}>
        {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          style={{ background: "none", border: "none", color: C.sakuraDeep, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>
          {mode === "signin" ? "Create one" : "Sign in"}
        </button>
      </div>
    </div>
  );
}
