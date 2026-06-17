"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import xImg from "../../public/assets/icons/x.svg";
import oImg from "../../public/assets/icons/o.svg";
import { Restart, Home, CupFirst } from "@solar-icons/react";
import { useUser } from "../context/UserContext";

export default function InfoPage() {
  const router = useRouter();
  const { playerX, playerO, finalXscore, finalOscore, replayPath } = useUser();

  const hasGameData = finalXscore > 0 || finalOscore > 0;
  useEffect(() => {
    if (!hasGameData) router.replace("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!hasGameData) return null;

  const xWins = finalXscore > finalOscore;
  const oWins = finalOscore > finalXscore;
  const draw  = finalXscore === finalOscore;

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-8 md:gap-10 bg-[#f5f5fa] dark:bg-[#0d0d14] px-4 md:px-8 transition-colors duration-300">

      <p className="font-orbitron font-black text-3xl md:text-4xl text-[#0d0d14] dark:text-white tracking-tight">
        RÉSULTATS
      </p>

      <div className="flex gap-3 md:gap-4 w-full max-w-[520px] items-center">

        <div className={`flex-1 rounded-2xl p-4 md:p-6 text-center bg-[#4FC3F7]/10 border transition-all ${
          xWins
            ? "border-[#4FC3F7] [box-shadow:0_0_30px_#4FC3F740]"
            : "border-black/10 dark:border-white/10"
        }`}>
          <div className={`mx-auto w-fit mb-2 md:mb-3 ${xWins ? "[filter:drop-shadow(0_0_16px_#4FC3F7)]" : "opacity-40"}`}>
            <Image className="w-10 md:w-12" src={xImg} alt="X" />
          </div>
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide text-[#0d0d14] dark:text-[#4FC3F7] truncate mb-1">{playerX}</p>
          <p className={`font-orbitron font-black text-4xl md:text-5xl ${xWins ? "text-[#0d0d14] dark:text-white" : "text-black/30 dark:text-white/30"}`}>
            {finalXscore}
          </p>
          {xWins && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <CupFirst size={14} color="#4FC3F7" />
              <p className="font-rajdhani font-bold text-xs md:text-sm text-[#4FC3F7] uppercase tracking-widest">
                Vainqueur
              </p>
            </div>
          )}
        </div>

        <p className="font-orbitron font-black text-lg md:text-xl text-black/20 dark:text-white/20 shrink-0">VS</p>

        <div className={`flex-1 rounded-2xl p-4 md:p-6 text-center bg-[#FFC107]/10 border transition-all ${
          oWins
            ? "border-[#FFC107] [box-shadow:0_0_30px_#FFC10740]"
            : "border-black/10 dark:border-white/10"
        }`}>
          <div className={`mx-auto w-fit mb-2 md:mb-3 ${oWins ? "[filter:drop-shadow(0_0_16px_#FFC107)]" : "opacity-40"}`}>
            <Image className="w-10 md:w-12" src={oImg} alt="O" />
          </div>
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide text-[#0d0d14] dark:text-[#FFC107] truncate mb-1">{playerO}</p>
          <p className={`font-orbitron font-black text-4xl md:text-5xl ${oWins ? "text-[#0d0d14] dark:text-white" : "text-black/30 dark:text-white/30"}`}>
            {finalOscore}
          </p>
          {oWins && (
            <div className="flex items-center justify-center gap-1 mt-2">
              <CupFirst size={14} color="#FFC107" />
              <p className="font-rajdhani font-bold text-xs md:text-sm text-[#FFC107] uppercase tracking-widest">
                Vainqueur
              </p>
            </div>
          )}
        </div>

      </div>

      {draw && (
        <p className="font-orbitron font-bold text-base md:text-lg text-black/30 dark:text-white/30 tracking-widest">
          ÉGALITÉ
        </p>
      )}

      <div className="flex flex-col gap-3 w-full max-w-[520px]">
        <button
          onClick={() => router.push(replayPath ?? "/play")}
          className="w-full flex items-center justify-center gap-2 bg-[#4FC3F7] text-black font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-full hover:brightness-110 active:scale-95 transition-all tracking-wide"
        >
          <Restart size={18} color="currentColor" />
          REJOUER
        </button>
        <button
          onClick={() => router.push("/")}
          className="w-full flex items-center justify-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[#0d0d14] dark:text-white font-orbitron font-bold py-3.5 md:py-4 text-sm md:text-base rounded-full hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all tracking-wide"
        >
          <Home size={18} color="currentColor" />
          NOUVELLE PARTIE
        </button>
      </div>

    </main>
  );
}
