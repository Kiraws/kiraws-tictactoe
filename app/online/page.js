"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import xImg from "../../public/assets/icons/x.svg";
import oImg from "../../public/assets/icons/o.svg";
import { createRoom, joinRoom, generateRoomId } from "../lib/gameService";
import { AddCircle, AltArrowRight, AltArrowLeft, Home } from "@solar-icons/react";

export default function OnlineLobby() {
  const router = useRouter();
  const [step, setStep]       = useState(1); // 1=name, 2=mode, 3=join-code
  const [name, setName]       = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleCreate = async () => {
    setLoading(true);
    try {
      const roomId = generateRoomId();
      await createRoom(roomId, name.trim() || "Joueur X");
      router.push(`/online/${roomId}`);
    } catch {
      setError("Impossible de créer la salle. Réessaie.");
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!roomCode.trim()) return;
    setLoading(true);
    setError("");
    try {
      await joinRoom(roomCode.trim().toUpperCase(), name.trim() || "Joueur O");
      router.push(`/online/${roomCode.trim().toUpperCase()}`);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 px-4 bg-[#f5f5fa] dark:bg-[#0d0d14] transition-colors duration-300">

      <div className="flex items-center gap-3">
        <div className="[filter:drop-shadow(0_0_16px_#4FC3F7)]">
          <Image className="w-10" src={xImg} alt="X" />
        </div>
        <p className="font-orbitron font-black text-2xl md:text-3xl text-[#0d0d14] dark:text-white tracking-tight">
          JOUER EN LIGNE
        </p>
        <div className="[filter:drop-shadow(0_0_16px_#FFC107)]">
          <Image className="w-10" src={oImg} alt="O" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#13131f] border border-black/10 dark:border-white/10 rounded-3xl p-7 md:p-10 w-full max-w-[460px] shadow-xl transition-colors">

        {/* Step 1 — Nom */}
        {step === 1 && (
          <>
            <h2 className="font-orbitron font-bold text-lg text-[#4FC3F7] mb-1 text-center">TON PSEUDO</h2>
            <p className="text-black/40 dark:text-white/40 font-rajdhani text-sm text-center mb-6">
              Il sera visible par ton adversaire
            </p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setStep(2)}
              placeholder="Entre ton pseudo"
              maxLength={16}
              className="w-full p-3 rounded-xl border-2 border-[#4FC3F7]/40 bg-black/5 dark:bg-white/5 text-[#0d0d14] dark:text-white outline-none focus:border-[#4FC3F7] text-center font-rajdhani font-semibold text-lg mb-6 placeholder:text-black/20 dark:placeholder:text-white/20 transition-colors"
            />
            <button
              onClick={() => setStep(2)}
              className="w-full bg-[#4FC3F7] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all"
            >
              CONTINUER →
            </button>
          </>
        )}

        {/* Step 2 — Créer ou Rejoindre */}
        {step === 2 && (
          <>
            <p className="font-orbitron font-bold text-base text-[#0d0d14] dark:text-white text-center mb-6">
              Que veux-tu faire ?
            </p>
            {error && (
              <p className="text-red-400 font-rajdhani text-sm text-center mb-2">{error}</p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCreate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#4FC3F7] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                <AddCircle size={18} color="currentColor" /> CRÉER UNE SALLE
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-full flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
              >
                <AltArrowRight size={18} color="currentColor" /> REJOINDRE UNE SALLE
              </button>
            </div>
            <button
              onClick={() => setStep(1)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 text-black/30 dark:text-white/30 font-orbitron text-xs hover:text-black/60 dark:hover:text-white/60 transition-colors"
            >
              <AltArrowLeft size={13} color="currentColor" /> RETOUR
            </button>
          </>
        )}

        {/* Step 3 — Code de salle */}
        {step === 3 && (
          <>
            <h2 className="font-orbitron font-bold text-lg text-[#FFC107] mb-1 text-center">CODE DE SALLE</h2>
            <p className="text-black/40 dark:text-white/40 font-rajdhani text-sm text-center mb-6">
              Demande le code à ton adversaire
            </p>
            <input
              autoFocus
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleJoin()}
              placeholder="XXXXXX"
              maxLength={6}
              className="w-full p-3 rounded-xl border-2 border-[#FFC107]/40 bg-black/5 dark:bg-white/5 text-[#0d0d14] dark:text-white outline-none focus:border-[#FFC107] text-center font-orbitron font-bold text-2xl tracking-widest mb-2 placeholder:text-black/20 dark:placeholder:text-white/20 transition-colors"
            />
            {error && (
              <p className="text-red-400 font-rajdhani text-sm text-center mb-4">{error}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setStep(2); setError(""); }}
                className="w-1/2 flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
              >
                <AltArrowLeft size={15} color="currentColor" /> RETOUR
              </button>
              <button
                onClick={handleJoin}
                disabled={loading || !roomCode.trim()}
                className="w-1/2 flex items-center justify-center gap-2 bg-[#FFC107] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "..." : <><AltArrowRight size={15} color="currentColor" /> REJOINDRE</>}
              </button>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 font-orbitron font-bold text-xs text-black/30 dark:text-white/30 hover:text-black/60 dark:hover:text-white/60 transition-colors"
      >
        <Home size={14} color="currentColor" /> ACCUEIL
      </button>

    </main>
  );
}
