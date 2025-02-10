
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
    <div className="flex flex-col items-center space-y-4 bg-white rounded-xl shadow-2xl p-4">
      {/* Imagen principal */}
      <div className="relative max-[768px]:w-3/4 min-[768px]:w-3/4 rounded-lg shadow-lg border-2 border-emerald-500 overflow-hidden">
        <img
          src={selectedImage}
          alt="Funko seleccionado"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Previsualizaciones de imágenes */}
      <div className="flex space-x-4">
        {images.map((imagen, index) => (
          <div
            key={index}
            className={`w-32 h-32 rounded-lg shadow-md border-2 cursor-pointer ${
              selectedImage === imagen.src ? "border-emerald-500" : "border-gray-300"
            }`}
            onClick={() => onSelectImage(imagen.src)}
          >
            <img
              src={imagen.src}
              alt={imagen.alt}
              className="object-cover rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}