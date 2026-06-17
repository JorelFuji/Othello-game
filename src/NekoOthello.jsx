import React, { useEffect, useState } from "react";
import { useOthelloMultiplayer } from "./useOthelloMultiplayer.js";
import { useAuth } from "./useAuth.js";
import SignIn from "./SignIn.jsx";
import { sound } from "./sound.js";

const THEMES = {
  matcha: {
    id: "matcha",
    name: "🌸 Matcha & Sakura",
    paper: "#FBF4E9",
    paperDeep: "#F3E7D3",
    boardBg: "#A7C293",
    boardBorder: "#8FAE7A",
    boardLine: "#6F9460",
    accent: "#F2A9BC",
    accentDeep: "#E58AA2",
    player1Color: "#3B3540", // Charcoal cat
    player2Color: "#FFFCF6", // Cream cat
    textColor: "#3B3540",
    subTextColor: "#6F9460",
    cardBgActive: "#FFFCF6",
    cardBorderActive: "#F2A9BC",
    cardShadowActive: "#E58AA2",
    btnBg: "#F2A9BC",
    btnShadow: "#E58AA2",
    particleType: "sakura",
  },
  tsukimi: {
    id: "tsukimi",
    name: "🌙 Tsukimi Night",
    paper: "#111625",
    paperDeep: "#1B223C",
    boardBg: "#2A3D66", // Indigo board
    boardBorder: "#1D2B4F",
    boardLine: "#151F3C",
    accent: "#FBD46D", // Moon Gold
    accentDeep: "#E7B85C",
    player1Color: "#1D1A27", // Dark violet-black cat
    player2Color: "#FFFDEB", // Soft moon-glow white cat
    textColor: "#F1F2F6",
    subTextColor: "#A1A9C3",
    cardBgActive: "#1B223C",
    cardBorderActive: "#FBD46D",
    cardShadowActive: "#E7B85C",
    btnBg: "#FBD46D",
    btnShadow: "#E7B85C",
    particleType: "leaf", // Falling maple leaves (momiji)
  },
  taiyaki: {
    id: "taiyaki",
    name: "🍵 Taiyaki Cafe",
    paper: "#FAF3E0", // Cozy cream
    paperDeep: "#E6D5B8", // Toast beige
    boardBg: "#B68973", // Sweet milk tea
    boardBorder: "#8E5F47", // Baked taiyaki brown
    boardLine: "#5C3D2E", // Chocolate line
    accent: "#D9604C", // Red-bean pink/red
    accentDeep: "#B5412F",
    player1Color: "#4E3629", // Choco-cat
    player2Color: "#FFFDF9", // Creamy vanilla-cat
    textColor: "#4E3629",
    subTextColor: "#8E5F47",
    cardBgActive: "#FFFDF9",
    cardBorderActive: "#D9604C",
    cardShadowActive: "#B5412F",
    btnBg: "#D9604C",
    btnShadow: "#B5412F",
    particleType: "steam", // Floating steam bubbles
  }
};

function CatDisc({ player, popKey, theme }) {
  const isBlack = player === 1;
  const face = isBlack ? theme.player1Color : theme.player2Color;
  const feat = isBlack ? theme.player2Color : theme.player1Color;
  return (
    <div key={popKey} className="neko-pop" style={{ position: "relative", width: "calc(var(--cell) * 0.8)", height: "calc(var(--cell) * 0.8)" }}>
      {[-1, 1].map((side) => (
        <div key={side} style={{
          position: "absolute", top: "calc(var(--cell) * -0.04)",
          left: side === -1 ? "12%" : "auto", right: side === 1 ? "12%" : "auto",
          width: 0, height: 0,
          borderLeft: "calc(var(--cell) * 0.1) solid transparent",
          borderRight: "calc(var(--cell) * 0.1) solid transparent",
          borderBottom: `calc(var(--cell) * 0.16) solid ${face}`,
          transform: side === -1 ? "rotate(-18deg)" : "rotate(18deg)",
        }}>
          <div style={{
            position: "absolute", top: "calc(var(--cell) * 0.05)", left: "calc(var(--cell) * -0.045)",
            width: 0, height: 0,
            borderLeft: "calc(var(--cell) * 0.045) solid transparent",
            borderRight: "calc(var(--cell) * 0.045) solid transparent",
            borderBottom: `calc(var(--cell) * 0.085) solid ${theme.accent}`,
          }} />
        </div>
      ))}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%", background: face,
        border: isBlack ? "none" : `2px solid ${theme.paperDeep}`,
        boxShadow: "inset 0 calc(var(--cell) * -0.06) calc(var(--cell) * 0.1) rgba(0,0,0,0.12)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ display: "flex", gap: "calc(var(--cell) * 0.16)", marginBottom: "calc(var(--cell) * 0.04)" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: "calc(var(--cell) * 0.13)", height: "calc(var(--cell) * 0.13)", borderTop: `calc(var(--cell) * 0.035) solid ${feat}`, borderRadius: "50% 50% 0 0" }} />
          ))}
        </div>
        <div style={{ width: 0, height: 0, borderLeft: "calc(var(--cell) * 0.035) solid transparent", borderRight: "calc(var(--cell) * 0.035) solid transparent", borderTop: `calc(var(--cell) * 0.05) solid ${theme.accentDeep}` }} />
        <div style={{ display: "flex", gap: "calc(var(--cell) * 0.02)", marginTop: "calc(var(--cell) * 0.005)" }}>
          {[0, 1].map((i) => (
            <div key={i} style={{ width: "calc(var(--cell) * 0.07)", height: "calc(var(--cell) * 0.05)", borderBottom: `calc(var(--cell) * 0.03) solid ${feat}`, borderRadius: "0 0 50% 50%" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ player, count, active, label, theme }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: active ? theme.cardBgActive : "transparent",
      border: `2px solid ${active ? theme.cardBorderActive : "rgba(0,0,0,0.08)"}`,
      borderRadius: 18, padding: "8px 14px",
      boxShadow: active ? `0 4px 0 ${theme.cardShadowActive}` : "none",
      transition: "all .2s ease", minWidth: 116,
    }}>
      <div style={{ ["--cell"]: "34px", width: 34, height: 34, flexShrink: 0 }}>
        <CatDisc player={player} theme={theme} popKey="card" />
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontFamily: "'Zen Maru Gothic', sans-serif", fontSize: 11, color: theme.subTextColor, fontWeight: 700 }}>{label}</div>
        <div style={{ fontFamily: "'Mochiy Pop One', sans-serif", fontSize: 24, color: theme.textColor }}>{count}</div>
      </div>
    </div>
  );
}

function btn(theme, bg, shadow, color = "#fff") {
  return {
    fontFamily: "'Zen Maru Gothic', sans-serif",
    fontWeight: 700,
    fontSize: 14,
    color,
    background: bg,
    border: "none",
    borderRadius: 14,
    padding: "10px 18px",
    cursor: "pointer",
    boxShadow: `0 4px 0 ${shadow}`,
    transition: "transform 0.1s, background-color 0.2s"
  };
}

export default function NekoOthello() {
  const g = useOthelloMultiplayer();
  const auth = useAuth();
  const [onlineTab, setOnlineTab] = useState(false);
  const moveIdxs = new Set(Object.keys(g.actableMoves).map(Number));

  // --- Theme State ---
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("neko-othello-theme") || "matcha";
  });
  const theme = THEMES[themeId] || THEMES.matcha;

  // --- Sound Mute State ---
  const [muted, setMuted] = useState(() => {
    const stored = localStorage.getItem("neko-othello-muted");
    const initMute = stored ? stored === "true" : false;
    sound.setMuteState(initMute);
    return initMute;
  });

  // --- Burst Animation State ---
  const [burstCell, setBurstCell] = useState(null);

  useEffect(() => {
    localStorage.setItem("neko-othello-theme", themeId);
  }, [themeId]);

  useEffect(() => {
    const id = "neko-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id; link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Zen+Maru+Gothic:wght@500;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  // --- Sound Triggers ---
  useEffect(() => {
    if (g.lastFlipped.size > 0) {
      Array.from(g.lastFlipped).forEach((_, idx) => {
        sound.playFlip(idx);
      });
    }
  }, [g.lastFlipped]);

  useEffect(() => {
    if (g.passNote) {
      sound.playPass();
    }
  }, [g.passNote]);

  useEffect(() => {
    if (g.gameOver) {
      sound.playWin();
    }
  }, [g.gameOver]);

  const toggleMute = () => {
    const nextMuted = sound.toggleMute();
    setMuted(nextMuted);
    localStorage.setItem("neko-othello-muted", String(nextMuted));
  };

  const handleCellClick = (idx) => {
    if (moveIdxs.has(idx)) {
      sound.playPlace();
      setBurstCell(idx);
      setTimeout(() => setBurstCell(null), 500);
      g.playMove(idx);
    } else {
      sound.playClick();
    }
  };

  const goLocal = () => {
    sound.playClick();
    setOnlineTab(false);
    g.newLocalGame();
  };

  const goOnline = () => {
    sound.playClick();
    setOnlineTab(true);
  };

  const handleSignOut = () => {
    sound.playClick();
    g.newLocalGame();
    auth.signOut();
  };

  const handleNewGameBtn = () => {
    sound.playClick();
    if (g.online) {
      g.startOnline();
    } else {
      g.newLocalGame();
    }
  };

  const inGame = !onlineTab || (auth.user && g.online);
  const waiting = g.online && g.status === "waiting";

  const turnName = g.online
    ? (g.status === "active" ? (g.turn === g.you ? "Your turn 🐾" : "Opponent's turn…") : "")
    : (g.turn === 1 ? "Black cat's turn" : "White cat's turn");
  let status = "";
  if (g.gameOver) status = g.winner === 0 ? "It's a tie! 🍡" : `${g.winner === 1 ? "Black" : "White"} cat wins! 🎉`;
  else if (waiting) status = "Waiting for another cat to join… 🐾";
  else status = g.passNote || turnName;

  const userName = auth.user ? (auth.user.displayName || auth.user.email) : "";

  // Dynamic particle styling
  const getParticleStyle = (i) => {
    if (theme.particleType === "sakura") {
      return {
        background: i % 2 ? theme.accent : theme.accentDeep,
        borderRadius: "50% 0 50% 50%",
        width: 12,
        height: 10,
      };
    } else if (theme.particleType === "leaf") {
      const colors = ["#E97D42", "#FF6B6B", "#FFB347", "#D44343"];
      return {
        background: colors[i % colors.length],
        borderRadius: "50% 50% 0 50%",
        width: 14,
        height: 12,
      };
    } else {
      // steam bubbles
      return {
        background: "transparent",
        border: `2px solid ${i % 2 ? "rgba(219, 96, 76, 0.5)" : "rgba(142, 95, 71, 0.4)"}`,
        borderRadius: "50%",
        width: i % 2 ? 8 : 12,
        height: i % 2 ? 8 : 12,
      };
    }
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100%", boxSizing: "border-box",
      background: `radial-gradient(120% 80% at 50% -10%, ${theme.paper} 0%, ${theme.paperDeep} 100%)`,
      padding: "16px 12px 28px", display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Zen Maru Gothic', sans-serif", position: "relative", overflow: "hidden",
      transition: "background 0.3s ease",
    }}>
      <style>{`
        @keyframes nekoPop { 0%{transform:scale(0) rotate(-25deg);} 70%{transform:scale(1.12) rotate(6deg);} 100%{transform:scale(1) rotate(0);} }
        @keyframes nekoFlip { 0%{transform:rotateY(0);} 50%{transform:rotateY(90deg);} 100%{transform:rotateY(0);} }
        @keyframes particleFall { 
          0% { transform: translateY(-10vh) rotate(0) scale(0.8); opacity: 0; } 
          10% { opacity: 0.8; } 
          90% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(50px) rotate(360deg) scale(1); opacity: 0; } 
        }
        @keyframes nekoBounce { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
        @keyframes particleBurst {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.2); opacity: 0; }
        }
        .neko-pop { animation: nekoPop .32s cubic-bezier(.34,1.56,.64,1); }
        .neko-flip { animation: nekoFlip .4s ease; }
        .neko-cell:focus-visible { outline: 3px solid ${theme.accentDeep}; outline-offset: 2px; }
        button:active { transform: translateY(2px); }
        .falling-particle { animation: particleFall 9s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .neko-pop,.neko-flip,.falling-particle { animation: none !important; } }
      `}</style>

      {/* Floating control bar */}
      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 440, padding: "0 8px", marginBottom: 10, zIndex: 2 }}>
        {/* Theme select buttons */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: theme.subTextColor }}>Theme:</span>
          {Object.keys(THEMES).map((tId) => (
            <button key={tId} onClick={() => { sound.playClick(); setThemeId(tId); }} style={{
              background: themeId === tId ? theme.btnBg : theme.paperDeep,
              color: themeId === tId ? "#fff" : theme.textColor,
              border: `2px solid ${themeId === tId ? theme.btnShadow : "rgba(0,0,0,0.08)"}`,
              borderRadius: "50%", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 12, padding: 0, transition: "all 0.2s",
              boxShadow: themeId === tId ? `0 2px 0 ${theme.btnShadow}` : "none",
            }} title={THEMES[tId].name}>
              {tId === "matcha" ? "🌸" : tId === "tsukimi" ? "🌙" : "🍵"}
            </button>
          ))}
        </div>

        {/* Audio Mute toggle button */}
        <button onClick={toggleMute} style={{
          background: theme.paperDeep, border: "2px solid rgba(0,0,0,0.08)", borderRadius: 10,
          color: theme.textColor, cursor: "pointer", padding: "4px 8px", fontSize: 12,
          display: "flex", alignItems: "center", gap: 5, fontWeight: 700, transition: "all 0.2s"
        }}>
          <span>{muted ? "🔇 Muted" : "🔊 Sound"}</span>
        </button>
      </div>

      {/* Background Particles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const pStyle = getParticleStyle(i);
        return (
          <div key={i} className="falling-particle" aria-hidden style={{
            position: "absolute",
            top: 0,
            left: `${6 + i * 12}%`,
            opacity: 0,
            animation: `particleFall ${8 + i * 2}s linear ${i * 1.8}s infinite`,
            zIndex: 0,
            pointerEvents: "none",
            ...pStyle
          }} />
        );
      })}

      <h1 style={{ fontFamily: "'Mochiy Pop One', sans-serif", color: theme.textColor, fontSize: 30, margin: "2px 0 0", letterSpacing: 1, zIndex: 1, textAlign: "center" }}>ねこオセロ</h1>
      <p style={{ margin: "2px 0 14px", color: theme.subTextColor, fontWeight: 700, fontSize: 13, zIndex: 1 }}>Neko Othello</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, zIndex: 1 }}>
        <button onClick={goLocal} style={btn(theme, !onlineTab ? theme.btnBg : theme.paperDeep, !onlineTab ? theme.btnShadow : "rgba(0,0,0,0.12)", !onlineTab ? "#fff" : theme.textColor)}>Pass &amp; Play</button>
        <button onClick={goOnline} style={btn(theme, onlineTab ? theme.btnBg : theme.paperDeep, onlineTab ? theme.btnShadow : "rgba(0,0,0,0.12)", onlineTab ? "#fff" : theme.textColor)}>Play Online</button>
      </div>

      {/* signed-in bar */}
      {onlineTab && auth.user && (
        <div style={{ zIndex: 1, marginBottom: 10, fontSize: 12, color: theme.subTextColor, fontWeight: 700 }}>
          Signed in as {userName} ·{" "}
          <button onClick={handleSignOut} style={{ background: "none", border: "none", color: theme.accentDeep, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Sign out</button>
        </div>
      )}

      {/* ---- ONLINE GATE ---- */}
      {onlineTab && !g.firebaseEnabled && (
        <div style={{ zIndex: 1, background: theme.paperDeep, padding: 16, borderRadius: 16, maxWidth: 320, textAlign: "center", color: theme.textColor, fontSize: 13, boxShadow: `0 4px 0 rgba(0,0,0,0.1)`, border: `2px solid ${theme.boardBorder}` }}>
          Paste your Web <strong>apiKey</strong> and <strong>appId</strong> into <code>src/firebase.js</code> to play online. Pass &amp; Play works without it.
        </div>
      )}
      {onlineTab && g.firebaseEnabled && auth.loading && (
        <div style={{ zIndex: 1, color: theme.subTextColor, fontWeight: 700 }}>Loading… 🌸</div>
      )}
      {onlineTab && g.firebaseEnabled && !auth.loading && !auth.user && (
        <div style={{ zIndex: 1 }}><SignIn auth={auth} /></div>
      )}
      {onlineTab && g.firebaseEnabled && auth.user && !g.online && (
        <div style={{ zIndex: 1, textAlign: "center" }}>
          <button onClick={g.startOnline} style={{ ...btn(theme, theme.btnBg, theme.btnShadow), padding: "14px 26px", fontSize: 16 }}>Find a match 🐾</button>
          {g.error && <div style={{ color: theme.accentDeep, fontSize: 12, marginTop: 10, fontWeight: 700 }}>{g.error}</div>}
        </div>
      )}

      {/* ---- BOARD (local always; online once matched) ---- */}
      {inGame && (
        <>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, zIndex: 1 }}>
            <ScoreCard player={1} count={g.scores.black} active={!g.gameOver && g.turn === 1} label={g.online && g.you === 1 ? "BLACK (YOU)" : "BLACK"} theme={theme} />
            <ScoreCard player={2} count={g.scores.white} active={!g.gameOver && g.turn === 2} label={g.online && g.you === 2 ? "WHITE (YOU)" : "WHITE"} theme={theme} />
          </div>

          <div style={{ minHeight: 26, marginBottom: 10, zIndex: 1, textAlign: "center", fontWeight: 700, color: theme.textColor, fontSize: 14 }}>{status}</div>
          {g.error && <div style={{ color: theme.accentDeep, fontSize: 12, marginBottom: 8, zIndex: 1, fontWeight: 700 }}>{g.error}</div>}

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              ["--cell"]: "min(10.6vw, 52px)", display: "grid",
              gridTemplateColumns: "repeat(8, var(--cell))", gridTemplateRows: "repeat(8, var(--cell))",
              background: theme.boardBg, padding: "calc(var(--cell) * 0.16)", borderRadius: 20,
              border: `4px solid ${theme.boardBorder}`, boxShadow: `0 10px 0 ${theme.boardBorder}, 0 16px 30px rgba(0,0,0,0.15)`,
              filter: waiting ? "blur(2px) saturate(.6)" : "none", transition: "filter .3s, background-color 0.3s, border-color 0.3s",
            }}>
              {g.board.map((v, idx) => {
                const isHint = moveIdxs.has(idx);
                const flipped = g.lastFlipped.has(idx);
                return (
                  <button key={idx} className="neko-cell" onClick={() => handleCellClick(idx)}
                    aria-label={`Row ${Math.floor(idx/8)+1}, column ${idx%8+1}${v===1?", black cat":v===2?", white cat":isHint?", available move":", empty"}`}
                    style={{ width: "var(--cell)", height: "var(--cell)", padding: 0, border: `1px solid ${theme.boardLine}`, background: theme.boardBg, display: "flex", alignItems: "center", justifyContent: "center", cursor: isHint ? "pointer" : "default", position: "relative", transition: "background-color 0.3s, border-color 0.3s" }}>
                    {v !== 0 && <div className={flipped ? "neko-flip" : ""}><CatDisc player={v} theme={theme} popKey={`${idx}-${v}-${idx === g.lastPlaced ? "p" : ""}`} /></div>}
                    {isHint && <span style={{ position: "absolute", width: "calc(var(--cell) * 0.22)", height: "calc(var(--cell) * 0.22)", borderRadius: "50%", background: g.turn === 1 ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.45)", border: `2px solid ${theme.accentDeep}` }} />}

                    {/* Placed Sparkle burst particles */}
                    {idx === burstCell && [...Array(8)].map((_, i) => {
                      const angle = (i / 8) * 2 * Math.PI;
                      const dist = 32; // Distance of burst
                      const tx = `${Math.cos(angle) * dist}px`;
                      const ty = `${Math.sin(angle) * dist}px`;
                      return (
                        <span key={i} style={{
                          position: "absolute",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: theme.accent,
                          left: "50%",
                          top: "50%",
                          marginLeft: -3,
                          marginTop: -3,
                          animation: "particleBurst 0.5s ease-out forwards",
                          ["--tx"]: tx,
                          ["--ty"]: ty,
                          zIndex: 10,
                          pointerEvents: "none"
                        }} />
                      );
                    })}
                  </button>
                );
              })}
            </div>
            {waiting && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ ["--cell"]: "44px", width: 44, height: 44, animation: "nekoBounce 1s ease-in-out infinite" }}><CatDisc player={1} theme={theme} popKey="wait" /></div>
                <div style={{ background: theme.paperDeep, padding: "6px 14px", borderRadius: 12, fontWeight: 700, color: theme.textColor, fontSize: 13, boxShadow: `0 3px 0 rgba(0,0,0,0.1)`, border: `1px solid ${theme.boardBorder}` }}>
                  Waiting for another cat to join…
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18, zIndex: 1, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={handleNewGameBtn} style={btn(theme, theme.btnBg, theme.btnShadow)}>
              {g.gameOver ? "もう一回 · Play again" : g.online ? "New match" : "New game"}
            </button>
          </div>
        </>
      )}

      <p style={{ marginTop: 16, color: theme.subTextColor, fontSize: 11, opacity: 0.85, zIndex: 1, textAlign: "center", maxWidth: 320 }}>
        Trap the other cat's pieces between yours in a straight line to flip them. Most cats wins. Black goes first. 🐾
      </p>
    </div>
  );
}
