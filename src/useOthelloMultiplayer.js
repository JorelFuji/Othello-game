// The bridge hook. The UI consumes ONLY this — it never knows about Firestore.
// mode "local"  -> pass-and-play on one device (free, no network)
// mode "online" -> anonymous matchmaking + real-time sync via game-service
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  startBoard, legalMoves, applyMove, countDiscs, hasMove, isGameOver, winnerOf, opp,
} from "./engine.js";
import { firebaseEnabled } from "./firebase.js";
import { findOrCreateGame, watchGame, sendMove, sendPass } from "./game-service.js";

export function useOthelloMultiplayer() {
  const [mode, setMode] = useState("local");          // "local" | "online"
  const [error, setError] = useState("");

  // --- local state ---
  const [lBoard, setLBoard] = useState(startBoard);
  const [lTurn, setLTurn] = useState(1);

  // --- online state ---
  const [game, setGame] = useState(null);             // Firestore doc
  const [you, setYou] = useState(null);               // 1 | 2
  const unsub = useRef(null);

  // shared transient (for animations)
  const [lastFlipped, setLastFlipped] = useState(new Set());
  const [lastPlaced, setLastPlaced] = useState(null);
  const [passNote, setPassNote] = useState("");

  // derive the "live" board/turn from whichever mode is active
  const online = mode === "online";
  const board = online ? (game?.board ?? startBoard()) : lBoard;
  const turn = online ? (game?.turn ?? 1) : lTurn;
  const status = online ? (game?.status ?? "connecting") : "local";

  const scores = useMemo(() => countDiscs(board), [board]);
  const gameOver = useMemo(() => (online ? status === "finished" : isGameOver(board)), [online, status, board]);
  const winner = useMemo(() => (gameOver ? winnerOf(board) : null), [gameOver, board]);

  // moves THIS client may click right now
  const actableMoves = useMemo(() => {
    if (gameOver) return {};
    if (online) {
      if (status !== "active" || turn !== you) return {};
      return legalMoves(board, you);
    }
    return legalMoves(board, turn);
  }, [online, status, turn, you, board, gameOver]);

  // ---- local auto-pass ----
  useEffect(() => {
    if (online || gameOver) return;
    if (!hasMove(board, turn) && hasMove(board, opp(turn))) {
      setPassNote(`${turn === 1 ? "Black" : "White"} has no move — passing 🐾`);
      const t = setTimeout(() => { setLTurn((p) => opp(p)); setPassNote(""); }, 1100);
      return () => clearTimeout(t);
    }
  }, [online, board, turn, gameOver]);

  // ---- online auto-pass (only the player on turn may write it) ----
  useEffect(() => {
    if (!online || !game || status !== "active") return;
    if (turn === you && !hasMove(board, you) && hasMove(board, opp(you))) {
      setPassNote("You have no move — passing 🐾");
      const t = setTimeout(() => { sendPass(game, you).catch(() => {}); setPassNote(""); }, 1100);
      return () => clearTimeout(t);
    }
  }, [online, game, status, turn, you, board]);

  const playMove = useCallback((idx) => {
    const flips = actableMoves[idx];
    if (!flips) return;
    const me = online ? you : turn;
    const res = applyMove(board, idx, me);
    if (!res) return;
    setLastFlipped(new Set(res.flips));
    setLastPlaced(idx);
    setPassNote("");
    if (online) {
      const finished = isGameOver(res.board);
      sendMove(game, res.board, me, finished).catch((e) => setError(e.message));
    } else {
      setLBoard(res.board);
      setLTurn(opp(me));
    }
  }, [actableMoves, online, you, turn, board, game]);

  const newLocalGame = useCallback(() => {
    setMode("local"); setLBoard(startBoard()); setLTurn(1);
    setLastFlipped(new Set()); setLastPlaced(null); setPassNote(""); setError("");
    if (unsub.current) { unsub.current(); unsub.current = null; }
    setGame(null); setYou(null);
  }, []);

  const startOnline = useCallback(async () => {
    if (!firebaseEnabled) { setError("Add your Firebase keys to .env to play online."); return; }
    setError(""); setMode("online"); setGame(null); setYou(null);
    try {
      const { id, you: seat } = await findOrCreateGame();
      setYou(seat);
      unsub.current = watchGame(id, setGame);
    } catch (e) { setError(e.message); setMode("local"); }
  }, []);

  useEffect(() => () => unsub.current && unsub.current(), []);

  return {
    mode, status, online, error,
    board, turn, you, scores, gameOver, winner,
    actableMoves, lastFlipped, lastPlaced, passNote,
    playMove, newLocalGame, startOnline,
    firebaseEnabled,
  };
}
