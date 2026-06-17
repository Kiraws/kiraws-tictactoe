"use client";
import { useState } from "react";
import Image from "next/image";
import x from "../public/assets/icons/x.svg";
import o from "../public/assets/icons/o.svg";
import NameModal from "./components/NameModal";
import { GamepadMinimalistic } from "@solar-icons/react";

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-10 md:gap-12 px-6 bg-[#f5f5fa] dark:bg-[#0d0d14] transition-colors duration-300">

      <div className="flex items-center gap-3 md:gap-4">
        <div className="[filter:drop-shadow(0_0_20px_#4FC3F7)]">
          <Image className="w-12 md:w-20" src={x} alt="X" />
        </div>
        <h1 className="font-orbitron font-black text-3xl sm:text-4xl md:text-6xl text-[#0d0d14] dark:text-white tracking-tight leading-none select-none text-center">
          TIC TAC TOE
        </h1>
        <div className="[filter:drop-shadow(0_0_20px_#FFC107)]">
          <Image className="w-12 md:w-20" src={o} alt="O" />
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-3 bg-[#4FC3F7] text-black font-orbitron font-bold py-3 md:py-4 px-10 md:px-16 rounded-full text-base md:text-lg tracking-wide hover:brightness-110 active:scale-95 transition-all duration-200"
      >
        <GamepadMinimalistic size={22} color="currentColor" />
        NOUVELLE PARTIE
      </button>

      {showModal && <NameModal onClose={() => setShowModal(false)} />}
    </main>
  );
}
