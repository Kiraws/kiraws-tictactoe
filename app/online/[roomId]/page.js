"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import xImg from "../../../public/assets/icons/x.svg";
import oImg from "../../../public/assets/icons/o.svg";
import Modal from "../../components/Modal";
import {
  listenToRoom, makeMove, requestRematch, declineRematch, deleteRoom,
  getPlayerId, parseBoard, parseWinPattern,
} from "../../lib/gameService";
import { useUser } from "../../context/UserContext";
import { Logout } from "@solar-icons/react";

export default function OnlineGame() {
  const { roomId } = useParams();
  const router     = useRouter();
  const { setPlayerX, setPlayerO, setFinalXscore, setFinalOscore, setReplayPath } = useUser();
  const [room, setRoom]         = useState(null);
  const [myPiece, setMyPiece]   = useState(null); // "x" | "o" | null (spectator)
  const [showModal, setShowModal] = useState(false);
  const [roomClosed, setRoomClosed]   = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const isQuittingRef          = useRef(false);
  const rematchDeclinedHandled = useRef(false);
  const roomEverExisted        = useRef(false);
  const modalTimerRef          = useRef(null);

  // Subscribe to room
  useEffect(() => {
    if (!roomId) return;
    const unsub = listenToRoom(
      roomId,
      (data) => { roomEverExisted.current = true; setRoom(data); },
      () => {
        if (isQuittingRef.current) return;
        if (roomEverExisted.current) setRoomClosed(true);
        else setRoomNotFound(true);
      },
    );
    return () => unsub();
  }, [roomId]);

  // Determine my piece from localStorage id
  useEffect(() => {
    if (!room) return;
    const myId = getPlayerId();
    if (room.playerX?.id === myId) setMyPiece("x");
    else if (room.playerO?.id === myId) setMyPiece("o");
    else setMyPiece(null);
  }, [room]);

  // Show modal when game finishes
  useEffect(() => {
    if (room?.status === "finished") {
      modalTimerRef.current = setTimeout(() => setShowModal(true), 1200);
    } else {
      setShowModal(false);
    }
    return () => { if (modalTimerRef.current) clearTimeout(modalTimerRef.current); };
  }, [room?.status]);

  const handleClick = useCallback(async (cellIndex) => {
    if (!room || !myPiece) return;
    if (room.status !== "playing") return;
    if (room.currentTurn !== myPiece) return;
    const board = parseBoard(room.board);
    if (board[cellIndex] !== "") return;
    await makeMove(roomId, cellIndex, myPiece);
  }, [room, myPiece, roomId]);

  const handleRetry = async () => {
    if (myPiece) await requestRematch(roomId, myPiece);
  };

  const handleDecline = async () => {
    await declineRematch(roomId);
  };

  // Quand l'adversaire refuse → les deux naviguent vers /info
  useEffect(() => {
    if (!room?.rematchDeclined || rematchDeclinedHandled.current) return;
    rematchDeclinedHandled.current = true;
    setPlayerX(room.playerX?.name ?? "Joueur X");
    setPlayerO(room.playerO?.name ?? "Joueur O");
    setFinalXscore(room.xscore ?? 0);
    setFinalOscore(room.oscore ?? 0);
    setReplayPath("/online");
    isQuittingRef.current = true;
    router.push("/info");
    deleteRoom(roomId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room?.rematchDeclined]);

  const handleQuit = (toHome = false) => {
    isQuittingRef.current = true;
    if (room) {
      setPlayerX(room.playerX?.name ?? "Joueur X");
      setPlayerO(room.playerO?.name ?? "Joueur O");
      setFinalXscore(room.xscore ?? 0);
      setFinalOscore(room.oscore ?? 0);
      setReplayPath("/online");
    }
    router.push(toHome ? "/" : "/info");
    deleteRoom(roomId); // fire and forget — après la navigation
  };

  // ─── Loading / waiting / closed states ──────────────────────────────────
  if (roomNotFound) {
    return (
      <Centered>
        <div className="text-center space-y-4">
          <p className="font-orbitron font-bold text-[#0d0d14] dark:text-white text-sm">SALLE INTROUVABLE</p>
          <p className="font-rajdhani text-black/40 dark:text-white/40 text-sm">
            Le code <span className="font-bold text-[#FFC107]">{roomId}</span> ne correspond à aucune salle active.
          </p>
          <button
            onClick={() => router.push("/online")}
            className="mt-2 font-orbitron font-bold text-sm text-[#4FC3F7] hover:brightness-110 transition-colors"
          >
            REJOINDRE UNE SALLE
          </button>
        </div>
      </Centered>
    );
  }

  if (roomClosed) {
    return (
      <Centered>
        <div className="text-center space-y-4">
          <p className="font-orbitron font-bold text-[#0d0d14] dark:text-white text-sm">PARTIE TERMINÉE</p>
          <p className="font-rajdhani text-black/40 dark:text-white/40 text-sm">L&apos;adversaire a fermé la salle.</p>
          <button
            onClick={() => router.push("/")}
            className="mt-2 font-orbitron font-bold text-sm text-[#4FC3F7] hover:brightness-110 transition-colors"
          >
            RETOUR À L&apos;ACCUEIL
          </button>
        </div>
      </Centered>
    );
  }

  if (!room) {
    return (
      <Centered>
        <p className="font-orbitron text-black/40 dark:text-white/50 text-sm animate-pulse">Connexion…</p>
      </Centered>
    );
  }

  if (room.status === "waiting") {
    return (
      <Centered>
        <div className="text-center space-y-5">
          <p className="font-orbitron font-bold text-[#0d0d14] dark:text-white text-sm">EN ATTENTE D&apos;UN ADVERSAIRE</p>
          <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl px-8 py-5 inline-block">
            <p className="font-rajdhani text-black/40 dark:text-white/50 text-xs mb-1">CODE DE LA SALLE</p>
            <p className="font-orbitron font-black text-3xl tracking-widest text-[#4FC3F7]">{roomId}</p>
          </div>
          <p className="font-rajdhani text-black/40 dark:text-white/40 text-sm">Partage ce code avec ton adversaire</p>
          <button
            onClick={() => handleQuit(true)}
            className="block mx-auto mt-4 font-orbitron text-xs text-black/20 dark:text-white/20 hover:text-black/50 dark:hover:text-white/50 transition-colors"
          >
            ANNULER
          </button>
        </div>
      </Centered>
    );
  }

  // ─── In-game ─────────────────────────────────────────────────────────────
  const board      = parseBoard(room.board);
  const winPattern = parseWinPattern(room.winPattern);
  const isMyTurn   = room.currentTurn === myPiece && room.status === "playing";
  const currentColor = room.currentTurn === "x" ? "#4FC3F7" : "#FFC107";
  const currentIcon  = room.currentTurn === "x" ? xImg : oImg;

  const winner = room.winner && room.winner !== "draw" ? room.winner : null;
  const winningPiece = winPattern.length > 0 ? board[winPattern[0]] : null;

  const getCellClass = (idx) => {
    const isWin = winPattern.includes(idx);
    const winGlow = winningPiece === "x"
      ? "bg-[#4FC3F7]/20 [box-shadow:0_0_20px_#4FC3F780] ring-2 ring-[#4FC3F7]"
      : "bg-[#FFC107]/20 [box-shadow:0_0_20px_#FFC10780] ring-2 ring-[#FFC107]";
    const hoverClass = isMyTurn && board[idx] === "" && room.status === "playing"
      ? (myPiece === "x" ? "hover:bg-[#4FC3F7]/15 cursor-pointer active:scale-95" : "hover:bg-[#FFC107]/15 cursor-pointer active:scale-95")
      : "cursor-default";
    return [
      "w-4/5 aspect-square rounded-xl md:rounded-2xl transition-all duration-200",
      isWin ? winGlow : "",
      hoverClass,
    ].filter(Boolean).join(" ");
  };

  const playerXName    = room.playerX?.name ?? "Joueur X";
  const playerOName    = room.playerO?.name ?? "Joueur O";
  const opponentName   = myPiece === "x" ? playerOName : playerXName;
  const winnerRealName = winner === "x" ? playerXName : playerOName;

  // Noms affichés selon perspective : soi-même = "Vous", adversaire = vrai nom
  const myDisplayName  = "Vous";
  const myScoreName    = myPiece === "x" ? myDisplayName : playerXName;
  const oppScoreName   = myPiece === "x" ? playerOName   : myDisplayName;

  // État du rematch
  const opponentPiece  = myPiece === "x" ? "o" : "x";
  const myVote         = room.rematchVotes?.[myPiece]       ?? false;
  const opponentVote   = room.rematchVotes?.[opponentPiece] ?? false;
  const rematchState   = myVote && !opponentVote ? "waiting"
                       : !myVote && opponentVote ? "requested"
                       : null;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 md:justify-between md:gap-0 py-6 md:py-8 px-4 bg-[#f5f5fa] dark:bg-[#0d0d14] transition-colors duration-300">

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[520px] mb-5 md:mb-6">
        <button
          onClick={() => handleQuit()}
          className="flex items-center gap-1.5 font-orbitron font-bold text-xs md:text-sm text-black/30 dark:text-white/30 hover:text-black/70 dark:hover:text-white/70 transition-colors"
        >
          <Logout size={15} color="currentColor" /> QUITTER
        </button>

        <div
          className="h-14 md:h-16 px-3 md:px-5 flex items-center gap-2 md:gap-3 rounded-2xl border bg-white dark:bg-white/5 border-black/10 dark:border-white/10 transition-colors"
          style={{ boxShadow: `0 0 20px ${currentColor}25` }}
        >
          <div style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}>
            <Image className="w-7 md:w-9" src={currentIcon} alt="tour" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <p className="font-rajdhani font-semibold text-[10px] text-black/40 dark:text-white/40 uppercase tracking-widest">
              {isMyTurn ? "À toi de jouer" : "En attente..."}
            </p>
            <p className="font-orbitron font-bold text-xs md:text-sm text-[#0d0d14] dark:text-white truncate max-w-[100px] md:max-w-[130px]">
              {isMyTurn
                ? "TON TOUR"
                : (myPiece === "x" ? playerOName : playerXName).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="bg-white dark:bg-[#13131f] border border-black/10 dark:border-white/10 w-full max-w-[520px] aspect-square rounded-2xl p-3 md:p-5 md:mb-6 shadow-sm dark:[box-shadow:0_0_40px_rgba(0,0,0,0.6)] transition-colors duration-300">
        <div className="grid grid-cols-3 w-full h-full">
          {board.map((cell, idx) => {
            const row = Math.floor(idx / 3);
            const col = idx % 3;
            return (
              <div
                key={idx}
                className={[
                  "flex items-center justify-center",
                  col < 2 ? "border-r border-black/[0.08] dark:border-white/[0.08]" : "",
                  row < 2 ? "border-b border-black/[0.08] dark:border-white/[0.08]" : "",
                ].join(" ")}
              >
                <div className={getCellClass(idx)} onClick={() => handleClick(idx)}>
                  {cell === "x" && <Image className="w-full h-full p-[20%]" src={xImg} alt="X" />}
                  {cell === "o" && <Image className="w-full h-full p-[20%]" src={oImg} alt="O" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scores */}
      <div className="flex justify-center items-center w-full max-w-[520px] gap-3 md:gap-6">
        <div className="text-center p-3 bg-[#4FC3F7]/15 border border-[#4FC3F7]/40 flex-1 h-16 rounded-2xl">
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide truncate text-[#0d0d14] dark:text-[#4FC3F7]">
            {myPiece === "x" ? myDisplayName : playerXName}
          </p>
          <p className="font-orbitron font-black text-xl md:text-2xl text-[#0d0d14] dark:text-white leading-tight">{room.xscore ?? 0}</p>
        </div>
        <div className="text-center p-3 bg-[#FFC107]/15 border border-[#FFC107]/40 flex-1 h-16 rounded-2xl">
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide truncate text-[#0d0d14] dark:text-[#FFC107]">
            {myPiece === "o" ? myDisplayName : playerOName}
          </p>
          <p className="font-orbitron font-black text-xl md:text-2xl text-[#0d0d14] dark:text-white leading-tight">{room.oscore ?? 0}</p>
        </div>
      </div>

      <Modal
        show={showModal}
        winner={room.winner === "draw" ? null : room.winner}
        onRetry={handleRetry}
        onQuit={handleQuit}
        onDecline={handleDecline}
        playerXName={myPiece === "x" ? myDisplayName : playerXName}
        playerOName={myPiece === "o" ? myDisplayName : playerOName}
        myPiece={myPiece}
        rematchState={rematchState}
        opponentName={opponentName}
        winnerRealName={winnerRealName}
      />
    </main>
  );
}

function Centered({ children }) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#f5f5fa] dark:bg-[#0d0d14] transition-colors duration-300">
      {children}
    </main>
  );
}
