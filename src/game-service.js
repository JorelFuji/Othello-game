// All Firestore reads/writes. Online play now uses the signed-in account's uid.
import {
  collection, doc, addDoc, onSnapshot, updateDoc,
  query, where, limit, getDocs, runTransaction, serverTimestamp,
} from "firebase/firestore";
import { services } from "./firebase.js";
import { currentUid } from "./auth.js";
import { startBoard, opp } from "./engine.js";

const STALE_MS = 5 * 60 * 1000; // ignore lobbies older than 5 min (free cleanup, no Cloud Functions)

export async function findOrCreateGame() {
  const uid = currentUid();
  if (!uid) throw new Error("Sign in to play online.");
  const { db } = services();
  const games = collection(db, "games");

  const open = await getDocs(query(games, where("status", "==", "waiting"), limit(8)));
  const joinable = open.docs.find((d) => {
    const g = d.data();
    const fresh = g.updatedAt?.toMillis?.() ? Date.now() - g.updatedAt.toMillis() < STALE_MS : true;
    return g.players["1"] !== uid && fresh;
  });

  if (joinable) {
    await runTransaction(db, async (tx) => {
      const snap = await tx.get(joinable.ref);
      const g = snap.data();
      if (g.status !== "waiting" || g.players["2"]) throw new Error("Lobby just filled");
      tx.update(joinable.ref, { "players.2": uid, status: "active", updatedAt: serverTimestamp() });
    });
    return { id: joinable.id, you: 2 };
  }

  const created = await addDoc(games, {
    board: startBoard(), turn: 1, turnUid: uid,
    players: { "1": uid, "2": null },
    status: "waiting", updatedAt: serverTimestamp(),
  });
  return { id: created.id, you: 1 };
}

export function watchGame(id, cb) {
  const { db } = services();
  return onSnapshot(doc(db, "games", id), (s) => s.exists() && cb({ id: s.id, ...s.data() }));
}

export async function sendMove(game, nextBoard, mover, finished) {
  const { db } = services();
  const next = opp(mover);
  await updateDoc(doc(db, "games", game.id), {
    board: nextBoard,
    turn: finished ? game.turn : next,
    turnUid: finished ? game.turnUid : game.players[String(next)],
    status: finished ? "finished" : "active",
    updatedAt: serverTimestamp(),
  });
}

export async function sendPass(game, mover) {
  const { db } = services();
  const next = opp(mover);
  await updateDoc(doc(db, "games", game.id), {
    turn: next, turnUid: game.players[String(next)], updatedAt: serverTimestamp(),
  });
}
