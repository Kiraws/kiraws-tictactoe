import React from "react";
import Image from "next/image";
import xImg from "../../public/assets/icons/x.svg";
import oImg from "../../public/assets/icons/o.svg";
import { Restart, Flag, ClockCircle } from "@solar-icons/react";
import { useUser } from "../context/UserContext";

const Modal = ({ show, winner, onRetry, onQuit, onDecline, playerXName, playerOName, myPiece, rematchState, opponentName, winnerRealName }) => {
  const { playerX, playerO } = useUser();
  if (!show) return null;

  const xName = playerXName ?? playerX;
  const oName = playerOName ?? playerO;
  const winnerName      = winner === "x" ? xName : oName;
  const winnerNameReal  = winnerRealName ?? winnerName; // toujours le vrai nom
  const winnerColor     = winner === "x" ? "#4FC3F7" : "#FFC107";
  const winnerIcon      = winner === "x" ? xImg : oImg;

  const isOnline = myPiece != null;
  const iWon     = isOnline && winner === myPiece;
  const iLost    = isOnline && winner != null && winner !== myPiece;

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md flex justify-center items-center z-50 px-4">
      <div className="bg-white dark:bg-[#13131f] border border-black/10 dark:border-white/10 rounded-3xl p-7 md:p-10 w-full max-w-[480px] text-center shadow-2xl transition-colors">

        {winner ? (
          <>
            <div
              className="mx-auto w-fit mb-4 md:mb-5"
              style={{ filter: `drop-shadow(0 0 28px ${winnerColor})` }}
            >
              <Image className="w-16 md:w-24" src={winnerIcon} alt={winner} />
            </div>

            {/* Mode en ligne — affichage selon perspective */}
            {iWon && (
              <>
                <p className="font-orbitron font-black text-2xl md:text-3xl tracking-tight mb-1" style={{ color: winnerColor }}>
                  VOUS AVEZ GAGNÉ !
                </p>
                <p className="font-rajdhani font-semibold text-black/40 dark:text-white/40 text-sm md:text-base mb-6 md:mb-8">
                  Bien joué, {winnerNameReal} !
                </p>
              </>
            )}

            {iLost && (
              <>
                <p className="font-rajdhani font-semibold text-black/40 dark:text-white/40 text-sm md:text-base mb-1">
                  {winnerNameReal} a gagné ce round
                </p>
                <p className="font-orbitron font-black text-2xl md:text-3xl tracking-tight text-red-400 mb-6 md:mb-8">
                  VOUS AVEZ PERDU !
                </p>
              </>
            )}

            {/* Mode local — affichage neutre */}
            {!isOnline && (
              <>
                <p className="font-orbitron font-black text-2xl md:text-3xl tracking-tight mb-1" style={{ color: winnerColor }}>
                  {winnerName.toUpperCase()}
                </p>
                <p className="font-rajdhani font-semibold text-black/40 dark:text-white/50 text-base md:text-lg mb-6 md:mb-8">
                  A REMPORTÉ CE ROUND !
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <p className="font-orbitron font-black text-3xl md:text-4xl text-[#0d0d14] dark:text-white mb-2 mt-4">
              MATCH NUL
            </p>
            <p className="font-rajdhani font-semibold text-black/40 dark:text-white/50 text-base md:text-lg mb-6 md:mb-8">
              Personne ne gagne ce round.
            </p>
          </>
        )}

        {/* Boutons — comportement différent en ligne */}
        {isOnline ? (
          <>
            {rematchState === "waiting" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 font-orbitron font-bold text-xs md:text-sm">
                  <ClockCircle size={16} color="currentColor" />
                  EN ATTENTE DE {(opponentName ?? "").toUpperCase()}…
                </div>
                <button
                  onClick={onQuit}
                  className="flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold text-sm md:text-base hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
                >
                  <Flag size={16} color="currentColor" /> ANNULER
                </button>
              </div>
            )}

            {rematchState === "requested" && (
              <div className="flex flex-col gap-3">
                <p className="font-rajdhani font-semibold text-black/50 dark:text-white/50 text-sm md:text-base text-center">
                  <span className="font-bold text-[#4FC3F7]">{opponentName}</span> veut rejouer !
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onDecline}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold text-sm md:text-base hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <Flag size={15} color="currentColor" /> REFUSER
                  </button>
                  <button
                    onClick={onRetry}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-[#4FC3F7] text-black font-orbitron font-bold text-sm md:text-base hover:brightness-110 active:scale-95 transition-all"
                  >
                    <Restart size={15} color="currentColor" /> ACCEPTER
                  </button>
                </div>
              </div>
            )}

            {!rematchState && (
              <div className="flex gap-3">
                <button
                  onClick={onRetry}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold text-sm md:text-base hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
                >
                  <Restart size={16} color="currentColor" /> REJOUER
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-[#4FC3F7] text-black font-orbitron font-bold text-sm md:text-base hover:brightness-110 active:scale-95 transition-all"
                >
                  <Flag size={16} color="currentColor" /> TERMINER
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold text-sm md:text-base hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
            >
              <Restart size={16} color="currentColor" /> REJOUER
            </button>
            <button
              onClick={onQuit}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 md:py-4 rounded-xl bg-[#4FC3F7] text-black font-orbitron font-bold text-sm md:text-base hover:brightness-110 active:scale-95 transition-all"
            >
              <Flag size={16} color="currentColor" /> TERMINER
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Modal;
