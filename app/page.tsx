"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
      {/* Hero Section con video de fondo */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        {/* Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/videos/fondo.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Contenido superpuesto */}
        <div className="relative z-10 bg-black/50 p-8 rounded-lg">
          <h1 className="text-5xl font-bold mb-4">Funkos personalizados</h1>
          <Link href="/custom-dolls">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              ¡Pedi el tuyo!
            </button>
          </Link>
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
