import { db } from './firebase';
import { ref, set, get, update, remove, onValue } from 'firebase/database';

const WIN_PATTERNS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6],
];

// Firebase stores arrays as objects — convert back safely
export const parseBoard = (raw) => {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === 'object') {
    return Array.from({ length: 9 }, (_, i) => raw[i] ?? '');
  }
  return Array(9).fill('');
};

export const parseWinPattern = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'object') {
    return Array.from({ length: 3 }, (_, i) => raw[i] ?? 0);
  }
  return [];
};

export const generateRoomId = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

export const getPlayerId = () => {
  if (typeof window === 'undefined') return null;
  let id = localStorage.getItem('ttt_playerId');
  if (!id) {
    id = Math.random().toString(36).substring(2, 18);
    localStorage.setItem('ttt_playerId', id);
  }
  return id;
};

export const createRoom = async (roomId, playerName) => {
  const playerId = getPlayerId();
  await set(ref(db, `rooms/${roomId}`), {
    board: Array(9).fill(''),
    currentTurn: 'x',
    playerX: { name: playerName, id: playerId },
    playerO: null,
    xscore: 0,
    oscore: 0,
    status: 'waiting',
    winner: null,
    winPattern: [],
    rematchVotes: { x: false, o: false },
    rematchDeclined: false,
    createdAt: Date.now(),
  });
};

export const joinRoom = async (roomId, playerName) => {
  const playerId = getPlayerId();
  const snap = await get(ref(db, `rooms/${roomId}`));

  if (!snap.exists())           throw new Error('Salle introuvable.');
  const room = snap.val();
  if (room.status !== 'waiting') throw new Error('Partie déjà commencée.');
  if (room.playerX?.id === playerId) throw new Error('Vous êtes déjà dans cette salle.');

  await update(ref(db, `rooms/${roomId}`), {
    playerO: { name: playerName, id: playerId },
    status: 'playing',
  });
};

export const makeMove = async (roomId, cellIndex, piece) => {
  const snap = await get(ref(db, `rooms/${roomId}`));
  const room = snap.val();
  const board = parseBoard(room.board);

  if (board[cellIndex] !== '') return;
  board[cellIndex] = piece;

  let winner = null;
  let winPattern = [];

  for (const pattern of WIN_PATTERNS) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      winner = board[a];
      winPattern = pattern;
      break;
    }
  }

  const isDraw = !winner && !board.includes('');
  const updates = {
    board,
    currentTurn: piece === 'x' ? 'o' : 'x',
    status: winner || isDraw ? 'finished' : 'playing',
    winner: winner ?? (isDraw ? 'draw' : null),
    winPattern: winPattern,
  };

  if (winner === 'x') updates.xscore = (room.xscore || 0) + 1;
  if (winner === 'o') updates.oscore = (room.oscore || 0) + 1;

  await update(ref(db, `rooms/${roomId}`), updates);
};

export const requestRematch = async (roomId, piece) => {
  const snap = await get(ref(db, `rooms/${roomId}`));
  if (!snap.exists()) return;
  const room = snap.val();
  const votes = room.rematchVotes || { x: false, o: false };
  const newVotes = { ...votes, [piece]: true };

  if (newVotes.x && newVotes.o) {
    // Les deux ont accepté → reset immédiat
    await update(ref(db, `rooms/${roomId}`), {
      board: Array(9).fill(''),
      currentTurn: 'x',
      winner: null,
      winPattern: [],
      status: 'playing',
      rematchVotes: { x: false, o: false },
      rematchDeclined: false,
    });
  } else {
    await update(ref(db, `rooms/${roomId}`), { rematchVotes: newVotes });
  }
};

export const declineRematch = async (roomId) => {
  await update(ref(db, `rooms/${roomId}`), { rematchDeclined: true });
};

export const listenToRoom = (roomId, callback, onDeleted) => {
  const roomRef = ref(db, `rooms/${roomId}`);
  return onValue(roomRef, (snap) => {
    if (snap.exists()) callback(snap.val());
    else if (onDeleted) onDeleted();
  });
};

export const deleteRoom = async (roomId) => {
  await remove(ref(db, `rooms/${roomId}`));
};
