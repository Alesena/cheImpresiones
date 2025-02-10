// app/layout.tsx
"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <html lang="es">
      <body className="bg-black text-white overflow-x-hidden">
        <Navbar toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} />
        <main
          className={`transform transition-all duration-300 ease-in-out ${
            isMenuOpen 
              ? "scale-90 -translate-x-[16.666%] opacity-50 delay-300 origin-right" 
              : "scale-100 translate-x-0 opacity-100 delay-0"
          }`}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}