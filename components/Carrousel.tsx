interface Image {
  src: string;
  alt: string;
}

interface CarrouselProps {
  images: Image[];
  selectedImage: string;
  onSelectImage: (src: string) => void;
}

export default function Carrousel({ images, selectedImage, onSelectImage }: CarrouselProps) {
  return (
    <div className="flex flex-col items-center space-y-4 bg-white rounded-xl shadow-2xl p-4 w-full max-w-4xl mx-auto">
      {/* Imagen principal */}
      <div className="relative w-full max-w-lg rounded-lg shadow-lg border-2 border-emerald-500 overflow-hidden">
        <img
          src={selectedImage}
          alt="Funko seleccionado"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Previsualizaciones de imágenes */}
      <div className="w-full overflow-x-auto flex space-x-2 md:space-x-4 py-2 scrollbar-hide">
        {images.map((imagen, index) => (
          <div
            key={index}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-lg shadow-md border-2 cursor-pointer flex-shrink-0 transition-all duration-300 ease-in-out transform hover:scale-105 ${
              selectedImage === imagen.src ? "border-emerald-500" : "border-gray-300"
            }`}
            onClick={() => onSelectImage(imagen.src)}
          >
            <img
              src={imagen.src}
              alt={imagen.alt}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
