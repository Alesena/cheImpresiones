import { useState, useEffect, useMemo } from "react";
import { FcAddImage, FcFullTrash } from "react-icons/fc";
import imageCompression from 'browser-image-compression';

type AccessoryType = 'Accesorios' | 'Mascotas' | 'Extra';

interface Accesorio {
  image: File | null;
  description: string;
  previewUrl?: string;
}

interface FormularioAccesoriosProps {
  onChange?: (data: Record<AccessoryType, Accesorio[]>) => void;
  initialData?: Record<AccessoryType, Accesorio[]>;
  maxItems?: number;
}

const DEFAULT_ACCESSORY: Accesorio = {
  image: null,
  description: '',
  previewUrl: undefined
};

export default function FormularioAccesorios({ 
  onChange,
  initialData,
  maxItems = 5
}: FormularioAccesoriosProps) {
  const accessoryTypes: AccessoryType[] = ['Accesorios', 'Mascotas', 'Extra'];
  
  const accessoryImages: Record<AccessoryType, string> = {
    Accesorios: "/images/accesorios-logo.webp",
    Mascotas: "/images/funko-pet.png",
    Extra: "/images/accesorio-auto.jpg",
  };

  // Estados
  const [selectedType, setSelectedType] = useState<AccessoryType>('Accesorios');
  const [selectedOption, setSelectedOption] = useState<Record<AccessoryType, number>>(
    () => accessoryTypes.reduce((acc, type) => ({ ...acc, [type]: 1 }), {} as Record<AccessoryType, number>)
  );
  
  const [accessoryData, setAccessoryData] = useState<Record<AccessoryType, Accesorio[]>>(
    () => initialData || accessoryTypes.reduce((acc, type) => ({
      ...acc, 
      [type]: Array.from({ length: maxItems }, () => ({ ...DEFAULT_ACCESSORY }))
    }), {} as Record<AccessoryType, Accesorio[]>)
  );

  // Calcular errores
  const errors = useMemo(() => {
    const newErrors: Record<AccessoryType, string[]> = accessoryTypes.reduce((acc, type) => ({
      ...acc, 
      [type]: []
    }), {} as Record<AccessoryType, string[]>);

    accessoryTypes.forEach(type => {
      accessoryData[type].slice(0, selectedOption[type]).forEach((acc, index) => {
        if (!acc.image) newErrors[type].push(`Imagen ${index + 1} requerida`);
        if (!acc.description.trim()) newErrors[type].push(`Descripción ${index + 1} requerida`);
      });
    });

    return newErrors;
  }, [accessoryData, selectedOption]);

  // Función para actualizar datos
  const updateAccessoryData = (type: AccessoryType, index: number, updates: Partial<Accesorio>) => {
    setAccessoryData(prev => {
      const newData = { ...prev };
      newData[type] = [...newData[type]];
      newData[type][index] = { ...newData[type][index], ...updates };
      
      if (updates.image) {
        if (newData[type][index].previewUrl) {
          URL.revokeObjectURL(newData[type][index].previewUrl!);
        }
        newData[type][index].previewUrl = updates.image ? URL.createObjectURL(updates.image) : undefined;
      }
      
      // Notificar cambios inmediatamente después de actualizar
      if (onChange) {
        const cleanData = getCleanData(newData, selectedOption);
        onChange(cleanData);
      }
      
      return newData;
    });
  };

  // Función para obtener datos limpios
  const getCleanData = (
    data: Record<AccessoryType, Accesorio[]>, 
    options: Record<AccessoryType, number>
  ) => {
    return accessoryTypes.reduce((acc, type) => ({
      ...acc,
      [type]: data[type]
        .slice(0, options[type])
        .filter(acc => acc.image && acc.description.trim())
        .map(({ image, description }) => ({ image, description }))
    }), {} as Record<AccessoryType, Accesorio[]>);
  };

  // Handlers de eventos
  const handleImageChange = async (type: AccessoryType, index: number, file: File | null) => {
    if (!file) {
      updateAccessoryData(type, index, { image: null, previewUrl: undefined });
      return;
    }

    if (!file.type.startsWith('image/')) {
      return;
    }

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };

    try {
      const compressedFile = await imageCompression(file, options);
      updateAccessoryData(type, index, { 
        image: compressedFile,
        description: accessoryData[type][index].description 
      });
    } catch (error) {
      console.error("Error al comprimir imagen:", error);
    }
  };

  const handleDescriptionChange = (type: AccessoryType, index: number, value: string) => {
    updateAccessoryData(type, index, { description: value });
  };

  // Limpieza de URLs
  useEffect(() => {
    return () => {
      Object.values(accessoryData).flat().forEach(acc => {
        if (acc.previewUrl) URL.revokeObjectURL(acc.previewUrl);
      });
    };
  }, [accessoryData]);

  // Datos actuales
  const currentSelectedOption = selectedOption[selectedType];
  const currentAccessoryData = accessoryData[selectedType];
  const currentErrors = errors[selectedType];

  // Componente de input individual memoizado
  const AccessoryInput = useMemo(() => ({ type, index, data, onChange }: {
    type: AccessoryType;
    index: number;
    data: Accesorio;
    onChange: (field: keyof Accesorio, value: any) => void;
  }) => (
    <div className="space-y-2 p-4 border rounded-lg mb-4 bg-white">
      <label className="block text-sm font-medium text-gray-700">
        {type} {index + 1}
      </label>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
            <label htmlFor={`file-input-${type}-${index}`} className="flex flex-col items-center gap-2">
              <FcAddImage size={36} />
              <span className="text-sm text-gray-600">Haz clic para subir una imagen</span>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Seleccionar archivo</span>
            </label>
            <input
              id={`file-input-${type}-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => onChange('image', e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>

          {data.previewUrl && (
            <div className="mt-3 relative">
              <img
                src={data.previewUrl}
                alt={`Preview ${type} ${index + 1}`}
                className="w-full h-32 object-contain rounded border"
              />
              <button
                onClick={() => onChange('image', null)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                aria-label="Eliminar imagen"
              >
                <FcFullTrash size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor={`desc-${type}-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id={`desc-${type}-${index}`}
            placeholder="Ejemplo: Celular en la mano derecha"
            value={data.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
            aria-describedby={`desc-help-${type}-${index}`}
          />
          <p id={`desc-help-${type}-${index}`} className="text-xs text-gray-500 mt-1">
            Describe el accesorio y su ubicación
          </p>
        </div>
      </div>
    </div>
  ), []);

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Configuración de Accesorios</h2>
      
      {/* Pestañas de tipos */}
      <div className="mb-6 flex flex-wrap gap-4">
        {accessoryTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{ backgroundImage: `url(${accessoryImages[type]})` }}
            className={`w-32 h-32 bg-cover bg-center rounded-lg flex items-end justify-center transition-all ${
              selectedType === type 
                ? "ring-4 ring-blue-500 shadow-lg" 
                : "ring-2 ring-gray-200 hover:ring-blue-300"
            }`}
            aria-label={`Seleccionar ${type}`}
          >
            <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full mb-2 text-sm font-medium">
              {type}
            </span>
          </button>
        ))}
      </div>

      {/* Selector de cantidad */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">Cantidad de {selectedType}:</h3>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5].slice(0, maxItems).map((option) => (
            <button
              key={option}
              onClick={() => setSelectedOption(prev => ({ ...prev, [selectedType]: option }))}
              className={`flex items-center justify-center w-12 h-12 rounded-md border-2 transition-colors ${
                currentSelectedOption === option
                  ? "bg-blue-500 text-white border-blue-600"
                  : "bg-white border-gray-300 hover:bg-gray-100"
              }`}
              aria-label={`Mostrar ${option} ${selectedType}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Mensajes de error */}
      {currentErrors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <h3 className="text-red-800 font-medium mb-2">Corrige los siguientes errores:</h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {currentErrors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Inputs dinámicos */}
      <div className="space-y-4">
        {Array.from({ length: maxItems }).map((_, index) => (
          <div 
            key={index} 
            className={index < currentSelectedOption ? "block" : "hidden"}
            aria-hidden={index >= currentSelectedOption}
          >
            <AccessoryInput
              type={selectedType}
              index={index}
              data={currentAccessoryData[index]}
              onChange={(field, value) => {
                if (field === 'image') {
                  handleImageChange(selectedType, index, value);
                } else {
                  handleDescriptionChange(selectedType, index, value as string);
                }
              }}
            />
          </div>
        ))}
      </div>

      {/* Resumen de datos */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-blue-800 font-medium mb-2">Resumen:</h3>
        <p className="text-sm text-gray-700">
          {Object.entries(selectedOption).map(([type, count]) => (
            <span key={type} className="inline-block mr-3">
              {count} {type.toLowerCase()}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}