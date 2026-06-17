import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";
import ClientProvider from "./components/ClientProvider";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Tic Tac Toe",
  description: "Jeu de morpion",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Script synchrone : applique dark/light AVANT le premier rendu pour éviter le flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme') || 'dark';
              document.documentElement.classList.toggle('dark', t === 'dark');
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className={`${orbitron.variable} ${rajdhani.variable} font-rajdhani antialiased`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
