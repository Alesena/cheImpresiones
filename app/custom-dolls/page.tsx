"use client";
import "@/app/globals.css";
import { useState, ChangeEvent } from "react";
import ImagesPerso from "@/components/ImagesPerso";
import DescriptionInput from "@/components/DescriptionInput";
import Carrousel from "@/components/Carrousel";

export default function PersonalizarFunko() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("/images/funko-base.png");



  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Imágenes para el carrusel
  const imagenesFunko = [
    { src: "/images/funko-base.png", alt: "Funko Base" },
    { src: "/images/funko-base-female.png", alt: "Funko Individual" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
  ];

  const sectionImages: { [key: string]: string } = {
    "Accesorios": "/images/accesorios-logo.webp",
    "Mascotas": "/images/funko-pet.png",
    "Accesorios Extra": "/images/logo.png",
  };

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
    <section
      className="
        bg-gray-100
        text-black
        min-h-screen
        pt-[80px]  /* Espacio para que no se superponga el navbar fijo */
        pb-4
        overflow-auto
      "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-emerald-500">
          Personaliza tu Funko
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Carrusel de imágenes */}
          <Carrousel
            images={imagenesFunko}
            selectedImage={imagenSeleccionada}
            onSelectImage={setImagenSeleccionada}
          />

          {/* Formulario de personalización */}
          <div className="space-y-6 bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
            <div className="flex flex-col space-y-6">
              {/* Selección del tipo de funko */}
              <label htmlFor="nombre" className="block mb-2 font-medium text-emerald-500">
                1. Elegí el tipo de funko:
              </label>
              <div className="grid grid-cols-3 items-center place-items-center gap-2 sm:gap-4">
                <div>
                  <ImagesPerso src="/images/funko-base.png" width={80} height={80} />
                  <p className="mt-1 text-sm">Individual</p>
                </div>
                <div>
                  <ImagesPerso src="/images/funko-pet.png" width={80} height={80} />
                  <p className="mt-1 text-sm">Mascota</p>
                </div>
                <div>
                  <ImagesPerso src="/images/funko-couple.png" width={80} height={80} />
                  <p className="mt-1 text-sm">Pareja</p>
                </div>
              </div>

              {/* Variante del funko */}
              <div>
                <label htmlFor="nombre" className="block mb-2 font-medium text-emerald-500">
                  2. Tipo de funko (Variante):
                </label>
                <div className="grid grid-cols-2 items-center place-items-center gap-2 sm:gap-4">
                  <div>
                    <ImagesPerso src="/images/funko-base-female.png" width={80} height={80} />
                  </div>
                  <div>
                    <ImagesPerso src="/images/funko-base.png" width={80} height={80} />
                  </div>
                </div>
              </div>

              {/* Subir foto */}
              <div>
                <label htmlFor="foto" className="block mb-2 font-medium text-emerald-500">
                  3. Subir foto
                </label>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">
                  Subí una foto de la(s) persona(s) a personalizar. ¡Mientras más fotos, mejor para los detalles!
                </p>
                <input
                  type="file"
                  id="foto"
                  className="w-full p-2 border border-gray-300 rounded-lg text-emerald-500 hover:text-emerald-600 transition-colors text-sm sm:text-base"
                  accept="image/*"
                  onChange={handleFotoChange}
                />
                {fotoPreview && (
                  <img
                    src={fotoPreview}
                    alt="Vista previa"
                    className="mt-4 w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-lg shadow-md border-2 border-emerald-500"
                  />
                )}
              </div>

              {/* Componente para ingresar detalles adicionales */}
              <DescriptionInput placeholderText="Detalla más el funko, ropa favorita, etc." />
            </div>

            <div className="w-full space-y-4">
              {["Accesorios", "Mascotas", "Accesorios Extra"].map((section, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center gap-2">
                      <ImagesPerso 
                      src={sectionImages[section]}
                      width={40} 
                      height={40} 
                      />
                      <div className="flex flex-col text-sm sm:text-base">
                        <p className="font-semibold">{section}</p>
                        <label>
                          {section === "Accesorios"
                            ? "Por Ej: Anteojos, Celular, etc"
                            : section === "Mascotas"
                              ? "Funkos de menor tamaño"
                              : "Por Ej: Adornos, etc"}
                        </label>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:self-center">
                      <button
                        onClick={() => toggleSection(section)}
                        className="bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition-colors"
                      >
                        {activeSection === section ? "Ocultar opciones" : "Agregar opciones"}
                      </button>
                    </div>
                  </div>

                  {activeSection === section && (
                    <div className="mt-2 w-full bg-gray-50 rounded-lg shadow-md p-4 transition-all duration-300">
                      <label className="block text-sm font-medium text-gray-700">
                        Detalles:
                      </label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                        placeholder={`Describe ${section.toLowerCase()}...`}
                      ></textarea>
                      <label className="block text-sm font-medium text-gray-700 mt-2">
                        Subir imagen:
                      </label>
                      <input
                        type="file"
                        className="mt-1 block w-full text-sm text-gray-500"
                        accept="image/*"
                      />
                    </div>
                  )}
                </div>
              ))}
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
