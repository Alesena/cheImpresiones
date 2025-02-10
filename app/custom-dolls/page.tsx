"use client";
import ImagesPerso from "@/components/ImagesPerso";
import "@/app/globals.css";
import Image from "next/image";
import { useState, ChangeEvent } from "react";
import DescriptionInput from "@/components/DescriptionInput";
import ButtonAccess from "@/components/ButtonAccess";
import Carrousel from "@/components/Carrousel"; // Importa el componente Carrousel

export default function PersonalizarFunko() {
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("/images/funko-base.png"); // Imagen principal inicial

  // Imágenes para el carrusel
  const imagenesFunko = [
    { src: "/images/funko-base.png", alt: "Funko Base" },
    { src: "/images/funko-base-female.png", alt: "Funko Individual" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
  ];

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100 text-black pt-16 pb-4 overflow-auto">
      <div className="max-h-1xl max-w-7xl px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-emerald-500">Personaliza tu Funko</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Usar el componente Carrousel */}
          <Carrousel
            images={imagenesFunko}
            selectedImage={imagenSeleccionada}
            onSelectImage={setImagenSeleccionada}
          />

          {/* Formulario de personalización */}
          <div className="space-y-6 bg-white rounded-xl shadow-2xl p-4">
            <div className="flex flex-col space-y-4 justify-between">
              <label htmlFor="nombre" className="block mb-2 font-medium text-emerald-500">.1 Elegí el tipo de funko:</label>
              <div className="grid grid-cols-3 items-center place-items-center">
                <div className="">
                  <ImagesPerso src="/images/funko-base.png" width={100} height={100} />
                  <p className="mt-2">Individual</p>
                </div>
                <div className="">
                  <ImagesPerso src="/images/funko-pet.png" width={100} height={100} />
                  <p className="mt-2">Mascota</p>
                </div>
                <div className="">
                  <ImagesPerso src="/images/funko-couple.png" width={100} height={100} />
                  <p className="mt-2">Pareja</p>
                </div>
              </div>
              <div>
                <div className="flex flex-col space-y-4 justify-between">
                  <label htmlFor="nombre" className="block mb-2 font-medium text-emerald-500">.2 Tipo de funko:</label>
                  <div className="grid grid-cols-3 items-center place-items-center">
                    <div>
                      <ImagesPerso src="/images/funko-base-female.png" width={100} height={100} />
                    </div>
                    <div>
                      <ImagesPerso src="/images/funko-base.png" width={100} height={100} />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="foto" className="block mb-2 font-medium text-emerald-500">
                  .3 Subir foto
                </label>
                <p className="text-gray-600 mb-3">Subi una foto de la/las personas que queres personalizar, mientras mas fotos mejor para mas detalles!</p>
                <input
                  type="file"
                  id="foto"
                  className="w-full p-2 border border-gray-300 rounded-lg text-emerald-500 hover:text-emerald-600 transition-colors"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Vista previa"
                    className="mt-4 w-40 h-40 object-cover rounded-lg shadow-md border-2 border-emerald-500"
                  />
                )}
              </div>

              <DescriptionInput placeholderText="Detalla mas el funko, ropa favorita, etc." />
            </div>

            <div className="">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-emerald-500 mb-2">Accesorios</h3>
                <p className="text-gray-600">Elige los accesorios que quieres agregar al Funko</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-rows-3 gap-4">
                <div className="flex justify-between bg-white rounded-lg shadow-md p-4">
                  <ImagesPerso src="/images/anteojos.png" width={50} height={50} />
                  <div className="flex flex-col">
                    <p>Accesorios</p>
                    <label>Por Ej: Anteojos, Celular, etc</label>
                  </div>
                  <div className="flex justify-start text-left">
                    <ButtonAccess />
                  </div>
                </div>
                <div className="flex justify-between bg-white rounded-lg shadow-md p-4">
                  <ImagesPerso src="/images/anteojos.png" width={50} height={50} />
                  <div className="flex flex-col">
                    <p>Mascotas</p>
                    <label>Funkos de menor tamaño</label>
                  </div>
                  <div className="flex justify-start text-left">
                    <ButtonAccess />
                  </div>
                </div>
                <div className="flex justify-between bg-white rounded-lg shadow-md p-4">
                  <ImagesPerso src="/images/anteojos.png" width={50} height={50} />
                  <div className="flex flex-col">
                    <p>Accesorios</p>
                    <label>Por Ej: Anteojos, Celular, etc</label>
                  </div>
                  <div className="flex justify-start text-left">
                    <ButtonAccess />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition ease-in-out duration-200 text-white hover:text-emerald-100"
            >
              Enviar personalización
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}