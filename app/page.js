import Image from "next/image";
import x from "../public/assets/icons/x.svg"
import o from "../public/assets/icons/o.svg"
import { Inter } from "next/font/google";
import Button from "./components/Button.js";
import Link from "next/link";

const inter = Inter({ subsets: ['latin'] });
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-36 ">
        <div className="flex ">
          <Image
          className="-ml-6"
          src={x}
          alt="x img"
          />
          <Image
          className="-mr-6"
          src={o}
          alt="0 img"
          />
        </div>
        <p className= {`font-[900] text-[88px] ${inter.className}`} >Tic Tac Toe</p>
        <p className= {`font-semibold text-[25px]  text-center items-center justify-center flex-wrap ${inter.className}`} >Dive into the excitement now and experience <br/>
        the timeless joy of this classic game!</p>
        <Button className="bg-[#4FC3F7] " href="./play"> New game</Button>
        
      
    </main>
  );
}
