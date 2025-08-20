'use client';
import { useState, useCallback, useEffect } from "react";
import { FcAddImage, FcFullTrash } from "react-icons/fc";
import imageCompression from 'browser-image-compression';
import { toast } from "react-toastify";

type AccessoryType = 'Accesorios' | 'Mascotas' | 'Extra';

interface Accesorio {
  image: File | null;
  description: string;
  previewUrl?: string;
}

interface FormularioAccesoriosProps {
  onChange?: (images: Record<string, File>, descriptions: Record<string, string>) => void;
  maxItems?: number;
}

const DEFAULT_ACCESSORY: Accesorio = {
  image: null,
  description: '',
  previewUrl: undefined
};

export default function FormularioAccesorios({
  onChange,
  maxItems = 5
}: FormularioAccesoriosProps) {
  const accessoryTypes: AccessoryType[] = ['Accesorios', 'Mascotas', 'Extra'];

  const [selectedType, setSelectedType] = useState<AccessoryType>('Accesorios');
  const [itemCounts, setItemCounts] = useState<Record<AccessoryType, number>>(
    () => accessoryTypes.reduce((acc, type) => ({ ...acc, [type]: 1 }), {} as Record<AccessoryType, number>)
  );

  const [accessoryData, setAccessoryData] = useState<Record<AccessoryType, Accesorio[]>>(
    () => accessoryTypes.reduce((acc, type) => ({
      ...acc,
      [type]: Array.from({ length: maxItems }, () => ({ ...DEFAULT_ACCESSORY }))
    }), {} as Record<AccessoryType, Accesorio[]>)
  );

  // Función memoizada para generar datos del backend
  const generateBackendData = useCallback(() => {
    const images: Record<string, File> = {};
    const descriptions: Record<string, string> = {};

    accessoryTypes.forEach(type => {
      accessoryData[type].slice(0, itemCounts[type]).forEach((acc, index) => {
        if (acc.image && acc.description.trim()) {
          const key = `${type}_${index}`;
          images[key] = acc.image; // Cambiamos la clave para simplificar
          descriptions[key] = acc.description;
        }
      });
    });

    return { images, descriptions };
  }, [accessoryData, itemCounts]);

  // Actualizar datos padre solo cuando cambian los datos relevantes
  const updateParent = useCallback(() => {
    if (!onChange) return;
    const { images, descriptions } = generateBackendData();
    onChange(images, descriptions);
  }, [generateBackendData, onChange]);

  // Handler para actualizar datos internos
  const updateAccessoryData = useCallback((type: AccessoryType, index: number, updates: Partial<Accesorio>) => {
    setAccessoryData(prev => {
      const newData = { ...prev };
      newData[type] = [...newData[type]];

      // Limpiar URL previa si existe
      if (updates.image && newData[type][index].previewUrl) {
        URL.revokeObjectURL(newData[type][index].previewUrl!);
      }

      newData[type][index] = {
        ...newData[type][index],
        ...updates,
        previewUrl: updates.image ? URL.createObjectURL(updates.image) : newData[type][index].previewUrl
      };

      return newData;
    });

    // Usamos timeout para evitar múltiples renders sincrónicos
    setTimeout(updateParent, 0);
  }, [updateParent]);

  // Handler para cambio de imagen
  const handleImageChange = useCallback(async (type: AccessoryType, index: number, file: File | null) => {
    if (!file) {
      updateAccessoryData(type, index, { image: null, previewUrl: undefined });
      return;
    }

    // Validar tipo de archivo
    if (!file.type.match('image.*')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true
      });
      updateAccessoryData(type, index, { image: compressedFile });
    } catch (error) {
      console.error("Error comprimiendo imagen:", error);
      toast.error("Error al procesar la imagen");
    }
  }, [updateAccessoryData]);

  // Handler para cambio de descripción
  const handleDescriptionChange = useCallback((type: AccessoryType, index: number, value: string) => {
    updateAccessoryData(type, index, { description: value });
  }, [updateAccessoryData]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      accessoryTypes.forEach(type => {
        accessoryData[type].forEach(acc => {
          if (acc.previewUrl) URL.revokeObjectURL(acc.previewUrl);
        });
      });
    };
  }, [accessoryData]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Configuración de Accesorios</h2>

      {/* Selector de tipo */}
      <div className="flex gap-4 mb-6">
        {accessoryTypes.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg transition-colors ${selectedType === type
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Selector de cantidad */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-700 mb-3">
          Cantidad de {selectedType}:
        </h3>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].slice(0, maxItems).map((count) => (
            <button
              key={count}
              onClick={() => setItemCounts(prev => ({ ...prev, [selectedType]: count }))}
              className={`w-10 h-10 rounded-full transition-colors ${itemCounts[selectedType] === count
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Formularios de accesorios */}
      <div className="space-y-4">
        {Array.from({ length: itemCounts[selectedType] }).map((_, index) => {
          const accesorio = accessoryData[selectedType][index];

          return (
            <div key={index} className="bg-white p-4 rounded-lg border">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Input de imagen */}
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Imagen {index + 1}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition-colors">
                    <label className="flex flex-col items-center gap-2">
                      <FcAddImage size={36} />
                      <span className="text-sm text-gray-600">
                        {accesorio.image ? 'Cambiar imagen' : 'Seleccionar imagen'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(selectedType, index, e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {accesorio.previewUrl && (
                    <div className="mt-3 relative">
                      <img
                        src={accesorio.previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-contain rounded border"
                      />
                      <button
                        onClick={() => handleImageChange(selectedType, index, null)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        <FcFullTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Input de descripción */}
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-black">
                    Descripción
                  </label>
                  <textarea
                    value={accesorio.description}
                    onChange={(e) => handleDescriptionChange(selectedType, index, e.target.value)}
                    placeholder="Describe el accesorio..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors text-neutral-950" 
                    rows={4}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}