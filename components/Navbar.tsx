"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react"; // Importamos useRef
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaRegTimesCircle
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";

interface NavbarProps {
  toggleMenu: () => void;
  isMenuOpen: boolean;
}

export default function Navbar({ toggleMenu, isMenuOpen }: NavbarProps) {
  // Referencia al menú lateral
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Si el menú está abierto y el clic fue fuera del menú
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        toggleMenu(); // Cierra el menú
      }
    };

    // Agregar el listener al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, toggleMenu]);

  return (
    <>
      {/* Navbar Superior (tu código existente) */}
      <nav className="fixed top-0 left-0 w-full z-20 flex items-center justify-between p-2 bg-black/30 backdrop-blur-sm text-white">
        {/* Logo + título */}

        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="Logo" width={50} height={50} />
          </Link>

        </div>


        {/* Botón hamburguesa */}
        <button onClick={toggleMenu} className="text-2xl focus:outline-none">
          {isMenuOpen ? <FaRegTimesCircle className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
        </button>
      </nav>

      {/* Menú Lateral Derecho */}
      <div
        ref={menuRef} // Asignamos la referencia al menú
        className={`menu-sidebar fixed top-0 right-0 w-1/2 h-full bg-black/90 backdrop-blur-sm transform transition-transform duration-300 ease-in-out z-10 ${isMenuOpen ? "translate-x-0 delay-300" : "translate-x-full delay-0"
          }`}
      >
        {/* Contenido del Menú (Centrado Verticalmente) */}
        <div className="p-6 h-full flex flex-col justify-center mt-16">
          {/* Secciones Principales */}
          <div className="space-y-4">
            <Link href="/" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              Inicio
            </Link>
            <Link href="/servicios" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              Servicios
            </Link>
            <Link href="/blog" className="block py-3 hover:text-blue-400 transition-colors border-b border-gray-700" onClick={toggleMenu}>
              ¡Dedicanos una reseña de tu pedido!
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
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                <FaLinkedin />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}