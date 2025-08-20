export default function Footer() {
  return (
    <footer className="relative bg-[#800020] text-white py-10">
      {/* Contenedor principal */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Columna 1 */}
        <div>
          <h2 className="text-2xl font-bold mb-4">CHE!</h2>

          {/* Sección: Funkos */}
          <h3 className="text-lg font-semibold mb-2">Funkos</h3>
          <ul className="space-y-1 mb-6">
            <li>
              <a href="#" className="hover:underline">Reseñas</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Formulario</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Ejemplos</a>
            </li>
          </ul>

          {/* Sección: Contacto */}
          <h3 className="text-lg font-semibold mb-2">Contacto</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">Whatsapp</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Instagram</a>
            </li>
          </ul>
        </div>

        {/* Columna 2 */}
        <div>
          <h3 className="text-xl font-bold mb-4">Tienda 3D</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">Souvenirs</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Macetas</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Floreros</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Otros diseños</a>
            </li>
          </ul>
        </div>

        {/* Columna 3 */}
        <div>
          <h3 className="text-xl font-bold mb-4">Impresión 3D</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="hover:underline">Subir STL</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Elegir material</a>
            </li>
            <li>
              <a href="#" className="hover:underline">Elegir tamaño</a>
            </li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div>
          <h3 className="text-xl font-bold mb-4">Subscribe a nuestro newsletter</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-stretch">
            <input
              type="email"
              placeholder="Ingresa tu email"
              className="px-3 py-2 mb-2 sm:mb-0 sm:mr-2 rounded-md focus:outline-none text-black"
            />
            <button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      {/* Patrón o SVG decorativo (ondas) en la esquina inferior derecha */}
      <div className="absolute bottom-0 right-0 opacity-30 pointer-events-none">
        {/* Reemplaza este SVG por tu imagen o diseño personalizado */}
        
        <svg
          width="250"
          height="250"
          viewBox="0 0 250 250"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 200 C 100 150, 150 250, 250 200"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
          />
          <path
            d="M10 220 C 100 170, 150 270, 250 220"
            stroke="white"
            strokeWidth="2"
            fill="transparent"
          />
        </svg>
      </div>
    </footer>
  );
}
