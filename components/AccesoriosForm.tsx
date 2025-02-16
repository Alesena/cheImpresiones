import { useState } from "react";

interface Accesorio {
  image: File | null;
  description: string;
}

export default function FormularioAccesorios() {
  // Definimos los tipos de accesorios
  const accessoryTypes = ["Accesorios", "Mascotas", "Extra"];

  // Mapeo de cada tipo a su imagen representativa
  const accessoryImages: { [key: string]: string } = {
    Accesorios: "/images/accesorios-logo.webp",
    Mascotas: "/images/funko-pet.png",
    Extra: "/images/accesorio-auto.jpg"
  };

  // Estado para el tipo de accesorio actualmente seleccionado
  const [selectedType, setSelectedType] = useState<string>("Accesorios");

  // Estado para la cantidad de items a mostrar por cada tipo
  const [selectedOption, setSelectedOption] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    accessoryTypes.forEach((type) => {
      initial[type] = 0;
    });
    return initial;
  });

  // Estado para almacenar la información de cada accesorio por tipo
  const [accessoryData, setAccessoryData] = useState<{ [key: string]: Accesorio[] }>(() => {
    const initial: { [key: string]: Accesorio[] } = {};
    accessoryTypes.forEach((type) => {
      initial[type] = Array.from({ length: 5 }, () => ({ image: null, description: "" }));
    });
    return initial;
  });

  // Función para actualizar la cantidad de items para el tipo seleccionado
  const updateSelectedOption = (type: string, option: number) => {
    setSelectedOption((prev) => ({ ...prev, [type]: option }));
  };

  // Actualiza la imagen de un accesorio para el tipo y posición dados
  const handleImageChange = (type: string, index: number, file: File | null) => {
    setAccessoryData((prev) => ({
      ...prev,
      [type]: prev[type].map((acc, i) => (i === index ? { ...acc, image: file } : acc))
    }));
  };

  // Actualiza la descripción de un accesorio para el tipo y posición dados
  const handleDescriptionChange = (type: string, index: number, value: string) => {
    setAccessoryData((prev) => ({
      ...prev,
      [type]: prev[type].map((acc, i) => (i === index ? { ...acc, description: value } : acc))
    }));
  };

  // Datos y cantidad para el tipo actualmente seleccionado
  const currentSelectedOption = selectedOption[selectedType];
  const currentAccessoryData = accessoryData[selectedType];

  return (
    <div className="mt-2 w-full bg-gray-50 rounded-lg shadow-md p-4 transition-all duration-300">
      {/* Pestañas para cambiar entre tipos, con imágenes de fondo */}
      <div className="mb-4 flex flex-row gap-4">
        {accessoryTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{ backgroundImage: `url(${accessoryImages[type]})` }}
            className={`w-32 h-32 bg-cover bg-center rounded flex items-center justify-center text-white font-bold transition-colors ${
              selectedType === type ? "ring-4 ring-blue-500" : "ring-0"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Botones para seleccionar la cantidad de items a mostrar */}
      <div className="mb-4 flex flex-row gap-6">
        {[1, 2, 3, 4, 5].map((option) => (
          <button
            key={option}
            onClick={() => updateSelectedOption(selectedType, option)}
            className={`flex flex-col w-20 h-14 rounded-md border-2 justify-center items-center transition-colors ${
              currentSelectedOption === option ? "border-blue-500" : "border-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Se renderizan los 5 conjuntos de inputs pero solo se muestran los necesarios */}
      <div className="space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={index < currentSelectedOption ? "block" : "hidden"}>
            <label className="text-sm font-medium text-black">
              {selectedType} {index + 1}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                handleImageChange(selectedType, index, file);
              }}
              className="border p-2 rounded w-full"
            />
            {/* Preview de la imagen cargada */}
            {currentAccessoryData[index].image && (
              <img
                src={URL.createObjectURL(currentAccessoryData[index].image!)}
                alt={`Preview ${selectedType} ${index + 1}`}
                className="w-16 h-16 object-cover rounded mt-2"
              />
            )}
            <input
              type="text"
              placeholder={`Descripción para ${selectedType} ${index + 1}`}
              value={currentAccessoryData[index].description}
              onChange={(e) =>
                handleDescriptionChange(selectedType, index, e.target.value)
              }
              className="border p-2 rounded w-full mt-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
