import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // Estado para controlar la visibilidad de las secciones
  const [showSections, setShowSections] = useState<boolean>(false);

  // Función para alternar la visibilidad
  const toggleSections = (): void => {
    setShowSections(!showSections);
  };

  return (
    <div className="p-3">
      <button
        onClick={toggleSections}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showSections ? 'Ocultar Secciones' : 'Mostrar Secciones'}
      </button>

      {/* Animación de las secciones */}
      <AnimatePresence>
        {showSections && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} // Estado inicial (invisible y ligeramente arriba)
            animate={{ opacity: 1, y: 0 }}   // Estado animado (visible y en su posición)
            exit={{ opacity: 0, y: -20 }}    // Estado al desaparecer (invisible y ligeramente arriba)
            className="mb-5"
          >
            <section className="mb-5 p-3 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold">Sección 1</h2>
              <p>Contenido de la sección 1.</p>
            </section>
            <section className="mb-5 p-3 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold">Sección 2</h2>
              <p>Contenido de la sección 2.</p>
            </section>
            <section className="mb-5 p-3 bg-gray-100 rounded">
              <h2 className="text-xl font-semibold">Sección 3</h2>
              <p>Contenido de la sección 3.</p>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}