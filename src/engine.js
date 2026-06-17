// Pure Othello rules engine — no React, no Firebase. Fully unit-testable.
// Board: flat array of 64. 0 = empty, 1 = black, 2 = white. index = row*8 + col.

export const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
export const opp = (p) => (p === 1 ? 2 : 1);

export function startBoard() {
  const b = new Array(64).fill(0);
  b[27] = 2; b[28] = 1; b[35] = 1; b[36] = 2;
  return b;
}

export function getFlips(board, idx, player) {
  if (board[idx] !== 0) return [];
  const row = Math.floor(idx / 8), col = idx % 8, o = opp(player), flips = [];
  for (const [dr, dc] of DIRS) {
    let r = row + dr, c = col + dc; const line = [];
    while (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r * 8 + c] === o) { line.push(r * 8 + c); r += dr; c += dc; }
    if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r * 8 + c] === player && line.length) flips.push(...line);
  }
  return flips;
}

export function legalMoves(board, player) {
  const m = {};
  for (let i = 0; i < 64; i++) { const f = getFlips(board, i, player); if (f.length) m[i] = f; }
  return m;
}

export function hasMove(board, player) {
  for (let i = 0; i < 64; i++) if (getFlips(board, i, player).length) return true;
  return false;
}

export function applyMove(board, idx, player) {
  const flips = getFlips(board, idx, player);
  if (!flips.length) return null;
  const next = board.slice();
  next[idx] = player;
  flips.forEach((i) => (next[i] = player));
  return { board: next, flips };
}

export function countDiscs(board) {
  let black = 0, white = 0;
  for (const v of board) { if (v === 1) black++; else if (v === 2) white++; }
  return { black, white };
}

export function isGameOver(board) {
  return !hasMove(board, 1) && !hasMove(board, 2);
}

export function winnerOf(board) {
  const { black, white } = countDiscs(board);
  return black > white ? 1 : white > black ? 2 : 0; // 0 = tie
}
