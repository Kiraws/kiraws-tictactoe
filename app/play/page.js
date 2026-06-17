"use client"
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";
import o from "../../public/assets/icons/o.svg";
import x from "../../public/assets/icons/x.svg";
import Image from "next/image";
import { useUser } from "../context/UserContext";
import { Logout } from "@solar-icons/react";

const Page = () => {
  const router = useRouter();
  const { playerX, playerO, setFinalXscore, setFinalOscore } = useUser();
  const [data, setData]       = useState(Array(9).fill(""));
  const [count, setCount]     = useState(0);
  const [xscore, setXscore]   = useState(0);
  const [oscore, setOscore]   = useState(0);
  const [lock, setLock]       = useState(false);
  const [clicked, setClicked] = useState(Array(9).fill(false));
  const [hover, setHover]     = useState("hover:bg-[#4FC3F7]/15");
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner]   = useState(null);
  const [winPattern, setWinPattern] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const handleQuit = () => {
    setFinalXscore(xscore);
    setFinalOscore(oscore);
    router.push("/info");
  };

  const toggle = (num) => {
    if (lock || data[num] !== "") return;
    const newData    = [...data];
    const newClicked = [...clicked];
    if (count % 2 === 0) {
      newData[num] = "x";
      setHover("hover:bg-[#FFC107]/15");
    } else {
      newData[num] = "o";
      setHover("hover:bg-[#4FC3F7]/15");
    }
    newClicked[num] = true;
    setData(newData);
    setClicked(newClicked);
    setCount(count + 1);
  };

  const resetGame = () => {
    setData(Array(9).fill(""));
    setCount(0);
    setLock(false);
    setClicked(Array(9).fill(false));
    setHover("hover:bg-[#4FC3F7]/15");
    setShowModal(false);
    setWinner(null);
    setWinPattern([]);
  };

  const checkWin = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (data[a] && data[a] === data[b] && data[a] === data[c]) {
        setLock(true);
        setWinPattern(pattern);
        timerRef.current = setTimeout(() => won(data[a]), 1200);
        return;
      }
    }
    if (!data.includes("")) {
      setLock(true);
      timerRef.current = setTimeout(() => setShowModal(true), 1200);
      return;
    }
    // Si une seule case reste et qu'elle est gagnante, jouer automatiquement
    const emptyCells = data.reduce((acc, v, i) => v === "" ? [...acc, i] : acc, []);
    if (emptyCells.length === 1) {
      const lastIdx   = emptyCells[0];
      const nextPiece = count % 2 === 0 ? "x" : "o";
      const simBoard  = [...data];
      simBoard[lastIdx] = nextPiece;
      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (simBoard[a] && simBoard[a] === simBoard[b] && simBoard[a] === simBoard[c]) {
          timerRef.current = setTimeout(() => toggle(lastIdx), 600);
          return;
        }
      }
    }
  };

  const won = (w) => {
    setWinner(w);
    setShowModal(true);
    if (w === "x") setXscore(prev => prev + 1);
    else setOscore(prev => prev + 1);
  };

  const renderImage = (num) => {
    if (data[num] === "x") return <Image className="w-full h-full p-[20%]" src={x} alt="X" />;
    if (data[num] === "o") return <Image className="w-full h-full p-[20%]" src={o} alt="O" />;
    return null;
  };

  useEffect(() => {
    checkWin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isXTurn      = count % 2 === 0;
  const currentIcon  = isXTurn ? x : o;
  const currentColor = isXTurn ? "#4FC3F7" : "#FFC107";

  const getCellClass = (num) => {
    const isWinner = winPattern.includes(num);
    const winningPiece = winPattern.length > 0 ? data[winPattern[0]] : null;
    const winGlow  = winningPiece === "x"
      ? "bg-[#4FC3F7]/20 [box-shadow:0_0_20px_#4FC3F780] ring-2 ring-[#4FC3F7]"
      : "bg-[#FFC107]/20 [box-shadow:0_0_20px_#FFC10780] ring-2 ring-[#FFC107]";

    return [
      "w-4/5 aspect-square rounded-xl md:rounded-2xl transition-all duration-200",
      isWinner ? winGlow : "",
      !clicked[num] && !lock
        ? `${hover} active:scale-95 cursor-pointer`
        : "cursor-default",
    ].filter(Boolean).join(" ");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-between py-8 px-4 bg-[#f5f5fa] dark:bg-[#0d0d14] transition-colors duration-300">

      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-[520px] mb-4 pr-12 md:pr-0">
        <button
          onClick={handleQuit}
          className="flex items-center gap-1.5 font-orbitron font-bold text-xs md:text-sm text-black/30 dark:text-white/30 hover:text-black/70 dark:hover:text-white/70 transition-colors"
        >
          <Logout size={15} color="currentColor" />
          QUITTER
        </button>

        <div
          className="h-14 md:h-16 px-4 md:px-6 flex items-center gap-2 md:gap-3 rounded-2xl border bg-white dark:bg-white/5 border-black/10 dark:border-white/10 transition-colors"
          style={{ boxShadow: `0 0 20px ${currentColor}25` }}
        >
          <div style={{ filter: `drop-shadow(0 0 8px ${currentColor})` }}>
            <Image className="w-7 md:w-9" src={currentIcon} alt="tour" />
          </div>
          <p className="font-orbitron font-bold text-xs md:text-sm tracking-wider text-[#0d0d14] dark:text-white">TOUR</p>
        </div>
      </div>

      {/* Board */}
      <div className="bg-white dark:bg-[#13131f] border border-black/10 dark:border-white/10 w-full max-w-[520px] aspect-square rounded-2xl p-3 md:p-5 mb-6 shadow-sm dark:[box-shadow:0_0_40px_rgba(0,0,0,0.6)] transition-colors duration-300">
        <div className="grid grid-cols-3 w-full h-full">
          {Array(9).fill(null).map((_, num) => {
            const row = Math.floor(num / 3);
            const col = num % 3;
            return (
              <div
                key={num}
                className={`flex items-center justify-center
                  ${col < 2 ? "border-r border-black/[0.08] dark:border-white/[0.08]" : ""}
                  ${row < 2 ? "border-b border-black/[0.08] dark:border-white/[0.08]" : ""}
                `}
              >
                <div className={getCellClass(num)} onClick={() => toggle(num)}>
                  {renderImage(num)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scores */}
      <div className="flex justify-center items-center w-full max-w-[520px] gap-4 md:gap-6">
        <div className="text-center p-3 bg-[#4FC3F7]/15 border border-[#4FC3F7]/40 flex-1 h-16 rounded-2xl">
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide truncate text-[#0d0d14] dark:text-[#4FC3F7]">{playerX}</p>
          <p className="font-orbitron font-black text-xl md:text-2xl text-[#0d0d14] dark:text-white leading-tight">{xscore}</p>
        </div>
        <div className="text-center p-3 bg-[#FFC107]/15 border border-[#FFC107]/40 flex-1 h-16 rounded-2xl">
          <p className="font-orbitron font-bold text-[10px] md:text-xs tracking-wide truncate text-[#0d0d14] dark:text-[#FFC107]">{playerO}</p>
          <p className="font-orbitron font-black text-xl md:text-2xl text-[#0d0d14] dark:text-white leading-tight">{oscore}</p>
        </div>
      </div>

      <Modal
        show={showModal}
        winner={winner}
        onRetry={resetGame}
        onQuit={handleQuit}
      />
    </main>
  );
};

export default Page;
