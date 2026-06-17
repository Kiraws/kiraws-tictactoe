"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import xImg from "../../public/assets/icons/x.svg";
import oImg from "../../public/assets/icons/o.svg";
import { UsersGroupRounded, Planet, AltArrowLeft, AltArrowRight, GamepadMinimalistic, CloseCircle } from "@solar-icons/react";
import { useUser } from "../context/UserContext";

// step 0 = mode, step 1 = joueur X, step 2 = joueur O (local only), step 3 = pseudo (online)
export default function NameModal({ onClose }) {
  const [step, setStep]   = useState(0);
  const [mode, setMode]   = useState(null); // "local" | "online"
  const [nameX, setNameX] = useState("");
  const [nameO, setNameO] = useState("");
  const [pseudo, setPseudo] = useState("");
  const { setPlayerX, setPlayerO, setReplayPath } = useUser();
  const router = useRouter();

  const selectMode = (m) => {
    setMode(m);
    setStep(1);
  };

  const handleStartLocal = () => {
    setPlayerX(nameX.trim() || "Joueur X");
    setPlayerO(nameO.trim() || "Joueur O");
    setReplayPath("/play");
    router.push("/play");
  };

  const handleGoOnline = () => {
    router.push("/online");
  };

  // Progress dots
  const totalSteps = mode === "local" ? 2 : 1;
  const currentStep = step; // step 1 or 2

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4">
      <div className="bg-white dark:bg-[#13131f] border border-black/10 dark:border-white/10 rounded-3xl p-7 md:p-10 w-full max-w-[460px] text-center shadow-2xl relative transition-colors duration-300">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/30 dark:text-white/30 hover:text-black/70 dark:hover:text-white/70 transition-colors"
        >
          <CloseCircle size={22} color="currentColor" />
        </button>

        {/* ── Step 0 : choix du mode ── */}
        {step === 0 && (
          <>
            <h2 className="font-orbitron font-bold text-lg md:text-xl text-[#0d0d14] dark:text-white mb-2">
              CHOISIR UN MODE
            </h2>
            <p className="font-rajdhani text-black/40 dark:text-white/40 text-sm mb-8">
              Comment veux-tu jouer ?
            </p>

            <div className="flex gap-4">
              {/* Local */}
              <button
                onClick={() => selectMode("local")}
                className="flex-1 group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#4FC3F7]/30 bg-[#4FC3F7]/5 hover:border-[#4FC3F7] hover:bg-[#4FC3F7]/15 active:scale-95 transition-all duration-200"
              >
                <div className="text-[#4FC3F7] group-hover:[filter:drop-shadow(0_0_12px_#4FC3F7)] transition-all">
                  <UsersGroupRounded size={44} color="#4FC3F7" />
                </div>
                <div>
                  <p className="font-orbitron font-bold text-sm text-[#0d0d14] dark:text-white leading-tight">EN LOCAL</p>
                  <p className="font-rajdhani text-black/40 dark:text-white/40 text-xs mt-1">Même appareil</p>
                </div>
              </button>

              {/* Online */}
              <button
                onClick={() => selectMode("online")}
                className="flex-1 group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-[#FFC107]/30 bg-[#FFC107]/5 hover:border-[#FFC107] hover:bg-[#FFC107]/15 active:scale-95 transition-all duration-200"
              >
                <div className="text-[#FFC107] group-hover:[filter:drop-shadow(0_0_12px_#FFC107)] transition-all">
                  <Planet size={44} color="#FFC107" />
                </div>
                <div>
                  <p className="font-orbitron font-bold text-sm text-[#0d0d14] dark:text-white leading-tight">EN LIGNE</p>
                  <p className="font-rajdhani text-black/40 dark:text-white/40 text-xs mt-1">À distance</p>
                </div>
              </button>
            </div>
          </>
        )}

        {/* ── Steps 1-2 : local ── */}
        {step >= 1 && mode === "local" && (
          <>
            {/* Progress */}
            <div className="flex justify-center gap-3 mb-6 md:mb-8">
              {Array.from({ length: totalSteps }).map((_, i) => {
                const active = currentStep === i + 1;
                const color  = i === 0 ? "#4FC3F7" : "#FFC107";
                return (
                  <div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{
                      width: active ? 40 : 20,
                      background: active ? color : "rgba(128,128,128,0.2)",
                    }}
                  />
                );
              })}
            </div>

            {step === 1 && (
              <>
                <div className="[filter:drop-shadow(0_0_20px_#4FC3F7)] mx-auto w-fit mb-4 md:mb-5">
                  <Image className="w-12 md:w-16" src={xImg} alt="X" />
                </div>
                <h2 className="font-orbitron font-bold text-xl md:text-2xl text-[#4FC3F7] mb-1">JOUEUR X</h2>
                <p className="text-black/40 dark:text-white/40 font-rajdhani text-sm md:text-base mb-5 md:mb-6">Entrez votre pseudo</p>
                <input
                  autoFocus
                  type="text"
                  value={nameX}
                  onChange={(e) => setNameX(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setStep(2)}
                  placeholder="Joueur X"
                  maxLength={16}
                  className="w-full p-3 rounded-xl border-2 border-[#4FC3F7]/40 bg-black/5 dark:bg-white/5 text-[#0d0d14] dark:text-white outline-none focus:border-[#4FC3F7] text-center font-rajdhani font-semibold text-lg mb-5 md:mb-6 placeholder:text-black/20 dark:placeholder:text-white/20 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(0)}
                    className="w-1/2 flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <AltArrowLeft size={15} color="currentColor" /> RETOUR
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/2 flex items-center justify-center gap-2 bg-[#4FC3F7] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    SUIVANT <AltArrowRight size={15} color="currentColor" />
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="[filter:drop-shadow(0_0_20px_#FFC107)] mx-auto w-fit mb-4 md:mb-5">
                  <Image className="w-12 md:w-16" src={oImg} alt="O" />
                </div>
                <h2 className="font-orbitron font-bold text-xl md:text-2xl text-[#FFC107] mb-1">JOUEUR O</h2>
                <p className="text-black/40 dark:text-white/40 font-rajdhani text-sm md:text-base mb-5 md:mb-6">Entrez votre pseudo</p>
                <input
                  autoFocus
                  type="text"
                  value={nameO}
                  onChange={(e) => setNameO(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleStartLocal()}
                  placeholder="Joueur O"
                  maxLength={16}
                  className="w-full p-3 rounded-xl border-2 border-[#FFC107]/40 bg-black/5 dark:bg-white/5 text-[#0d0d14] dark:text-white outline-none focus:border-[#FFC107] text-center font-rajdhani font-semibold text-lg mb-5 md:mb-6 placeholder:text-black/20 dark:placeholder:text-white/20 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="w-1/2 flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
                  >
                    <AltArrowLeft size={15} color="currentColor" /> RETOUR
                  </button>
                  <button
                    onClick={handleStartLocal}
                    className="w-1/2 flex items-center justify-center gap-2 bg-[#FFC107] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all"
                  >
                    <GamepadMinimalistic size={16} color="currentColor" /> JOUER !
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Step 1 : online → redirection vers /online ── */}
        {step === 1 && mode === "online" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="[filter:drop-shadow(0_0_20px_#FFC107)]">
                <Planet size={52} color="#FFC107" />
              </div>
            </div>
            <h2 className="font-orbitron font-bold text-xl text-[#FFC107] mb-1">EN LIGNE</h2>
            <p className="font-rajdhani text-black/40 dark:text-white/40 text-sm mb-6">
              Crée ou rejoins une salle pour jouer à distance
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="w-1/2 flex items-center justify-center gap-2 bg-black/5 dark:bg-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
              >
                <AltArrowLeft size={15} color="currentColor" /> RETOUR
              </button>
              <button
                onClick={handleGoOnline}
                className="w-1/2 flex items-center justify-center gap-2 bg-[#FFC107] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                CONTINUER <AltArrowRight size={15} color="currentColor" />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
