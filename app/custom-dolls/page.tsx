"use client";
import "@/app/globals.css";
import { useState, ChangeEvent } from "react";
import ImagesPerso from "@/components/ImagesPerso";
import DescriptionInput from "@/components/DescriptionInput";
import Carrousel from "@/components/Carrousel";
import { motion, AnimatePresence } from "framer-motion";
import AccesoriosForm from "@/components/AccesoriosForm";

export default function PersonalizarFunko() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [imagenSeleccionada, setImagenSeleccionada] = useState<string>("/images/funko-base.png");
  const [showModal, setShowModal] = useState(true);


  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Imágenes para el carrusel
  const imagenesFunko = [
    { src: "/images/funko-base.png", alt: "Funko Base" },
    { src: "/images/funko-base-female.png", alt: "Funko Individual" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" },
  ];

  const sectionImages: { [key: string]: string } = {
    "Accesorios": "/images/accesorio-ball.jpg",
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

  const handleWhatsApp = () => {
    // Redirige a WhatsApp con el número y mensaje que desees
    window.location.href = "https://api.whatsapp.com/send?phone=11111111111&text=Hola,%20quiero%20personalizar%20mi%20Funko";
  };

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-1 flex items-start justify-center bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)} // Cierra el modal si se hace clic en el overlay
          >
            <motion.div
              className="mt-52 bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md sm:max-w-lg"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-4 text-black">Bienvenido a la Experiencia de Personalización de Funko</h3>
              <p className="mb-4 text-black">
                En esta plataforma, cada detalle cuenta para crear un Funko único y totalmente a tu medida.
                Cada elección, por pequeña que parezca, es clave para reflejar tu estilo y personalidad en el Funko.
              </p>
              <p className="text-xl mb-4 text-black">Tómate tu tiempo para revisar todas las opciones y
                asegúrate de que cada detalle sea perfecto.
                ¡Estamos aquí para ayudarte a transformar tu idea
                en una figura inolvidable!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">

                <button
                  onClick={() => setShowModal(false)}
                  className="bg-red-800 text-white px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <section
        className="
        bg-gray-100
        text-black
        min-h-screen
        pt-[80px]
        pb-4
        overflow-auto
      "
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-emerald-500">
            Personaliza tu Funko
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-center">
            {/* Carrusel de imágenes */}
            <Carrousel
              images={imagenesFunko}
              selectedImage={imagenSeleccionada}
              onSelectImage={setImagenSeleccionada}
            />

            {/* Formulario de personalización */}
            <div className="space-y-6 bg-white rounded-xl shadow-2xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-col space-y-6">
                <button
                  onClick={handleWhatsApp}
                  className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors">
                  Comentanos tu personalizacion por Whatsapp
                </button>
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
                <DescriptionInput placeholderText="Detalla más el funko, ropa favorita, etc." value={""} onChange={function (event: ChangeEvent<HTMLTextAreaElement>): void {
                  throw new Error("Function not implemented.");
                } } />
              </div>

              <div className="w-full space-y-4">
                {["Accesorios"].map((section, index) => (
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
                        <h2 className="text-lg font-semibold ">
                          ¿Cuantos accesorios queres agregar?
                        </h2>
                        <div className="mb-4 flex flex-row gap-6" >
                          <AccesoriosForm/>
                        </div>              
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
    </>
  );
}
