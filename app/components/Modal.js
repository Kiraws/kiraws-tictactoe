import React from "react";
import Image from "next/image";
import xImg from "../../public/assets/icons/x.svg"; // Path to X image
import oImg from "../../public/assets/icons/o.svg"; // Path to O image
import Button from "./Button";

const Modal = ({ show, winner, onRetry, onQuit }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-[#0000003e] bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-[#6E6E6E] p-8  w-full text-center">
        <h2 className="text-2xl font-medium mb-4 text-white">
            {winner ? (
                <>
                {winner === "x" ? (
                    <p className="mt-2">OH NO, YOU LOST...</p>
                ) : (
                    <p className="mt-2">YOU WON...</p>
                )}
                </>
            ) : (
                "NOBODY WINS"
            )}
        </h2>
        <h1 className="text-6xl flex items-center justify-center font-black ">
            {winner ? (
                <>
                {winner === "x" ? (
                    <Image className="inline-block w-28 mt-5" src={xImg} alt="X wins" /> 
                ) : (
                    <Image className="inline-block w-28 mt-5" src={oImg} alt="O wins" />
                )
                }
                { winner==="x" ? (
                    <p className="text-[#4FC3F7]">WON THIS ROUND</p>
                ) : (
                    <p className="text-[#FFC107] ">WON THIS ROUND</p>

                )
                
                }

                </>
            ) : (
                <p className="text-white" >THIS GAME IS A TIE</p>
            )}
        </h1>
        <div className="flex justify-center gap-4 ">
            <button
            onClick={onRetry}
            className=" mt-10 p-3   rounded-full bg-[#C5C5C5] text-black font-semibold w-56"
            >
            Retry
            </button>
            <button
            onClick={onQuit}
            className="mt-10 p-3   rounded-full bg-[#4FC3F7] text-black font-semibold w-56"
            >
            Quit
            </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
