"use client"
import React, { useState, useEffect } from "react";
import Modal from "../components/Modal"; // Importation du modal
import { Inter } from "next/font/google";
import o from "../../public/assets/icons/o.svg";
import x from "../../public/assets/icons/x.svg";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

const Page = () => {
  const [data, setData] = useState(Array(9).fill(""));
  const [count, setCount] = useState(0);
  const [xscore, setXscore] = useState(0);
  const [oscore, setOscore] = useState(0);
  const [lock, setLock] = useState(false);
  const [clicked, setClicked] = useState(Array(9).fill(false));
  const [hover, setHover] = useState("hover:bg-[#4FC3F7]");
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState(null);

  const toggle = (num) => {
    if (lock || data[num] !== "") {
      return;
    }

    const newData = [...data];
    const newClicked = [...clicked];
    if (count % 2 === 0) {
      newData[num] = "x";
      setHover("hover:bg-[#FFC107]");
    } else {
      newData[num] = "o";
      setHover("hover:bg-[#4FC3F7]");
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
    setHover("hover:bg-[#4FC3F7]");
    setShowModal(false); // Close the modal on reset
    setWinner(null);
  };

  const checkWin = () => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (data[a] && data[a] === data[b] && data[a] === data[c]) {
        setLock(true);
        setTimeout(() => {
          won(data[a]);
        }, 1200);
        return;
      }
    }

    if (count === 8) {
      setTimeout(() => {
        setShowModal(true);
      }, 1200);
    }
  };

  const won = (winner) => {
    setWinner(winner);
    setShowModal(true);
    if (winner === "x") {
      setXscore(xscore + 1);
    } else if (winner === "o") {
      setOscore(oscore + 1);
    }
  };

  const renderImage = (num) => {
    if (data[num] === "x") {
      return <Image className="w-full h-full" src={x} alt="X" />;
    } else if (data[num] === "o") {
      return <Image className="w-full h-full" src={o} alt="O" />;
    }
    return null;
  };
  useEffect(() => {
    checkWin();
  }, [data]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-7 bg-gray-100">

      <div className="flex justify-center items-center w-[500px] h-28 gap-6">
        <div className="flex w-60 h-16 items-center rounded-2xl">
          <Image className="w-16" src={x} alt="X img" />
          <Image className="w-16" src={o} alt="O img" />
        </div>
        <div className="bg-white w-60 h-16 items-center justify-center rounded-2xl flex">
          {count % 2 === 0 ? (
            <Image className="w-12" src={x} alt="X img" />
          ) : (
            <Image className="w-12" src={o} alt="O img" />
          )}
          <p className="font-semibold -mt-2 text-base">TURN</p>
        </div>
      </div>

      <div className="bg-white w-[520px] flex auto h-[520px] px-5 rounded-2xl py-5">
        <div className="row1">
          {[0, 1, 2].map((num) => (
            <div
              key={num}
              className={`flex w-40 items-center justify-items-center h-40 border-solid border-t-0 border-l-0 border-[1.5px] border-[#C5C5C5] ${num === 2 ? 'border-b-0' : ''}`}
            >
              <div
                className={`w-32 m-6 rounded-2xl boxes h-28 ${clicked[num] ? '' : hover}`}
                onClick={() => { toggle(num); }}
                style={{ cursor: clicked[num] ? "default" : "pointer" }}
              >
                {renderImage(num)}
              </div>
            </div>
          ))}
        </div>

        <div className="row2">
          {[3, 4, 5].map((num) => (
            <div
              key={num}
              className={`flex w-40 h-40 border-solid border-[1.5px] border-t-0 border-[#C5C5C5] ${num === 5 ? 'border-b-0' : ''}`}
            >
              <div
                className={`w-32 m-6 rounded-2xl boxes h-28 ${clicked[num] ? '' : hover}`}
                onClick={() => { toggle(num); }}
                style={{ cursor: clicked[num] ? "default" : "pointer" }}
              >
                {renderImage(num)}
              </div>
            </div>
          ))}
        </div>

        <div className="row3">
          {[6, 7, 8].map((num) => (
            <div
              key={num}
              className={`flex w-40 h-40 border-solid border-t-0 border-r-0 border-[1.5px] border-[#C5C5C5] ${num === 8 ? 'border-b-0' : ''}`}
            >
              <div
                className={`w-32 m-6 rounded-2xl boxes h-28 ${clicked[num] ? '' : hover}`}
                onClick={() => { toggle(num); }}
                style={{ cursor: clicked[num] ? "default" : "pointer" }}
              >
                {renderImage(num)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center w-[500px] h-28 gap-6 -mb-10">
        <div className="text-center font-semibold text-base p-3 bg-[#4FC3F7] w-60 h-16 rounded-2xl">
          X (CPU) <br />{xscore}
        </div>
        <div className="text-center font-semibold text-base p-3 bg-[#FFC107] w-60 h-16 rounded-2xl">
          O (YOU) <br />{oscore}
        </div>
      </div>

      <Modal
        show={showModal}
        winner={winner}
        onRetry={resetGame}
        onQuit={() => window.location.href = './info'}
      />


    </main>
  );
};

export default Page;
