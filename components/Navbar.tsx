"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react"; // Importamos useRef
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaRegTimesCircle
} from "react-icons/fa";
import { FiMenu, FiSearch, FiShoppingCart } from "react-icons/fi";

interface NavbarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export default function Navbar({ toggleMenu, isMenuOpen }: NavbarProps) {
  // Referencia al menú lateral
  const menuRef = useRef<HTMLDivElement>(null);
  const NAVBAR_HEIGHT = "4rem"; // 64px

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el menú está abierto y el clic fue fuera del menú
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu();
      }
    };

    // Agregar el listener al documento
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, toggleMenu]);
  return (
    <>
      <nav 
        className="fixed top-0 left-0 w-full z-20 flex items-center justify-between p-2 bg-black/30 backdrop-blur-sm text-white"
        style={{ height: NAVBAR_HEIGHT }}
      >

<div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={80} 
              height={80}
              className="w-12 h-12 md:w-16 md:h-16"
            />
          </Link>

          {/* Renderiza los links sólo si el menú está cerrado */}
          {!isMenuOpen && (
            <div className="hidden md:flex space-x-6">
              <Link href="/custom-dolls" className="nav-link">Funkos</Link>
              <Link href="/tienda3D" className="nav-link">Tienda 3D</Link>
              <Link href="/blog" className="nav-link">Imprimi 3D</Link>
              <Link href="/contacto" className="nav-link">Contacto</Link>
            </div>
          )}

          {/* Íconos de búsqueda, carrito y botón de menú */}
         <div className="flex items-center space-x-4 md:space-x-6">
            <button aria-label="Buscar">
              <FiSearch className="icon" />
            </button>
            <button aria-label="Carrito">
              <FiShoppingCart className="icon" />
            </button>
            <button 
              onClick={toggleMenu} 
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="text-2xl focus:outline-none"
            >
              {isMenuOpen ? <FaRegTimesCircle className="icon-lg" /> : <FiMenu className="icon-lg" />}
            </button>
          </div>
        </div>
      </nav>
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden="true" />

      {/* Menú Lateral Derecho */}
       <div
        ref={menuRef}
        className={`fixed top-0 right-0 w-3/4 md:w-1/2 h-full bg-black/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-10 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ marginTop: NAVBAR_HEIGHT }}
      >
        {/* Contenido del Menú (Centrado Verticalmente) */}
        <div className="p-6 h-full flex flex-col justify-center mt-16">
          {/* Secciones Principales */}
          <div className="space-y-4">
            <Link href="/" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              Funkos
            </Link>
            <Link href="/servicios" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              Tienda 3D
            </Link>
            <Link href="/blog" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              Imprimi 3D
            </Link>
            <Link href="/contacto" className="block py-3 hover:text-blue-400 transition-colors" onClick={toggleMenu}>
              Contacto
            </Link>
          </div>

          {/* Redes Sociales */}
          <div className="border-t border-gray-700 pt-6 mt-6">
            <p className="text-gray-400 mb-4">Síguenos en redes</p>
            <div className="flex justify-around text-2xl">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">
                <FaInstagram />
              </a>

              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                <FaLinkedin />
              </a>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}