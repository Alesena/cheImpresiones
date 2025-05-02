"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/** Props para el componente WordReveal */
type WordRevealProps = {
  word: string;
  index: number; // Para calcular el delay
};

/**
 * Componente que hace aparecer cada palabra con IntersectionObserver,
 * y además aplica un delay escalonado según su índice (index).
 */
function WordReveal({ word, index }: WordRevealProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const wordRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target); // Se deja de observar una vez visible
        }
      },
      {
        threshold: 0.1, // se activa cuando al menos un 10% del elemento es visible
      }
    );

    if (wordRef.current) {
      observer.observe(wordRef.current);
    }

    return () => {
      if (wordRef.current) {
        observer.unobserve(wordRef.current);
      }
    };
  }, []);

  return (
    <span
      ref={wordRef}
      style={{
        // Cada palabra se retrasa 100ms multiplicado por su índice
        transitionDelay: `${index * 100}ms`,
      }}
      className={`
        inline-block
        transition-opacity
        duration-500  /* Duración de 500ms en la opacidad */
        ease-in-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {word}&nbsp;
    </span>
  );
}

export default function HomePage() {
  const textoSobreNosotros = `
    ¿Te imaginas tener un Funko único, con todos los detalles que te representan? En Che!, hacemos realidad tus ideas. Diseñamos funkos personalizados con los accesorios, atuendos y características que tú elijas, para que tu colección sea realmente exclusiva.
  `;
  const textoSobreNosotros2 = `
  Además, contamos con servicios profesionales de impresión 3D. Desde la creación de prototipos hasta piezas decorativas o regalos personalizados, transformamos tus proyectos en objetos tangibles con la más alta calidad. Nuestro equipo combina la pasión por el diseño con la tecnología más avanzada para asegurar resultados excepcionales.
`;


  return (
    <div>
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Imagen de fondo */}
        <div
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{
            backgroundImage: "url('/images/fondo-page.png')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        {/* Capa de opacidad color bordó */}
        <div
          className="absolute top-0 left-0 w-full h-full z-1"
        
        />

        {/* Contenido superpuesto */}
        <div className="relative z-10 p-8 rounded-lg">
          <h1 className="font-titulo text-7xl font-bold mb-2">Che!</h1>
          <div className="flex justify-end">
            <h1 className="font-cuerpo text-4xl font-bold mb-6">Impresiones 3D</h1>
          </div>
          
        </div>

        {/* Separador de zigzag redondeado */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 sm:h-24 text-white fill-current"
          >
            <path
              d="M321.12,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V56.44Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Sección Sobre Nosotros */}
      <section id="seccion-info" className="py-16 bg-white text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Sobre Nosotros</h2>

          <p className="text-2xl leading-relaxed text-center max-w-2xl mx-auto">
            {textoSobreNosotros
              .trim()
              .split(/\s+/)
              .map((word, i) => (
                <WordReveal key={`${word}-${i}`} word={word} index={i} />
              ))}
          </p>
        </div>
      </section>

      {/* Sección Servicios */}
      <section className="py-16 bg-gray-100 text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Nuestros diseños</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center">
              <Image
                src="/images/funko2.jpg"
                alt="Funko 1"
                width={300}
                height={100}
              ></Image>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg flex justify-center items-center ">
              <Image
                src="/images/funko3.jpg"
                alt="Funko 1"
                width={300}
                height={300}
              ></Image>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <Image
                className="mx-auto"
                src="/images/funko4.jpg"
                alt="Funko 1"
                width={300}
                height={300}
              ></Image>
            </div>
          </div>
        </div>
      </section>

      {/* Sección mas diseños */}
      <section id="seccion-info" className="py-16 bg-white text-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Mas diseños</h2>

          <p className="text-2xl leading-relaxed text-center max-w-2xl mx-auto">
            {textoSobreNosotros2
              .trim()
              .split(/\s+/)
              .map((word, i) => (
                <WordReveal key={`${word}-${i}`} word={word} index={i} />
              ))}
          </p>
        </div>
      </section>
    </div>
  );
}
