'use client';
import { useState, useCallback, useMemo } from "react";
import Carrousel from "@/components/Carrousel";
import AccesoriosForm from "@/components/AccesoriosForm";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FunkoType = 'individual' | 'mascota' | 'pareja';
type GenderType = 'hombre' | 'mujer';
type PetType = 'perro' | 'gato';

interface CoupleData {
  person1: GenderType | null;
  person2: GenderType | null;
}

interface DesignData {
  funkoType: FunkoType;
  variant: GenderType | PetType | CoupleData | null;
  description: string;
  userName: string;
  userPhone: string;
  photoUrl: string;
  accesorios: {
    images: Record<string, string>;
    descriptions: Record<string, string>;
  };
  createdAt: Date;
  status: string;
}

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function PersonalizarFunko() {
  // Estados principales
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [funkoType, setFunkoType] = useState<FunkoType | null>(null);
  const [gender, setGender] = useState<GenderType | null>(null);
  const [petType, setPetType] = useState<PetType | null>(null);
  const [coupleData, setCoupleData] = useState<CoupleData>({ person1: null, person2: null });
  const [description, setDescription] = useState("");
  const [accesorios, setAccesorios] = useState<{
    images: Record<string, File>;
    descriptions: Record<string, string>;
  }>({ images: {}, descriptions: {} });
  const [imagenSeleccionada, setImagenSeleccionada] = useState("/images/funko-base.png");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Estados para el popup de contacto
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [tempDesignData, setTempDesignData] = useState<Omit<DesignData, 'userName' | 'userPhone' | 'createdAt' | 'status'> | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Validar formulario
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!funkoType) {
      errors.funkoType = "Selecciona un tipo de Funko";
    }

    if (!fotoPreview) {
      errors.foto = "Sube una foto de referencia";
    }

    if (funkoType === 'individual' && !gender) {
      errors.gender = "Selecciona un género";
    }

    if (funkoType === 'mascota' && !petType) {
      errors.petType = "Selecciona un tipo de mascota";
    }

    if (funkoType === 'pareja' && (!coupleData.person1 || !coupleData.person2)) {
      errors.couple = "Selecciona géneros para ambas personas";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [funkoType, fotoPreview, gender, petType, coupleData]);

  // Convertir DataURL a File
  const dataURLtoFile = useCallback((dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }, []);

  // Subir imagen a ImgBB
  const uploadToImgBB = useCallback(async (file: File, retries = 3): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error("Error al subir la imagen");
      }

      return data.data.url;
    } catch (error) {
      if (retries > 0) {
        console.log(`Reintentando subida... (${retries} intentos restantes)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return uploadToImgBB(file, retries - 1);
      }

      console.error("Error uploading image after retries:", error);
      toast.error("Error al subir la imagen. Inténtalo de nuevo.");
      throw error;
    }
  }, []);
  // Generar contenido del email
  const generateEmailContent = useCallback((designData: DesignData): string => {
    const getVariantText = () => {
      if (!designData.variant) return '';

      if (designData.funkoType === 'individual') {
        return `Género: ${designData.variant === 'hombre' ? 'Hombre' : 'Mujer'}`;
      }

      if (designData.funkoType === 'mascota') {
        return `Tipo de mascota: ${designData.variant === 'perro' ? 'Perro' : 'Gato'}`;
      }

      if (designData.funkoType === 'pareja') {
        const couple = designData.variant as CoupleData;
        return `Pareja: ${couple.person1 === 'hombre' ? 'Hombre' : 'Mujer'} y ${couple.person2 === 'hombre' ? 'Hombre' : 'Mujer'}`;
      }

      return '';
    };

    const renderAccessories = () => {
      if (!designData.accesorios || Object.keys(designData.accesorios.images).length === 0) {
        return '';
      }

      let accessoriesHtml = `
      <div style="margin-top: 20px;">
        <h2 style="color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Accesorios</h2>
    `;

      // Agrupar accesorios por tipo
      const groupedAccessories: Record<string, Array<{ image: string, description: string }>> = {};

      Object.entries(designData.accesorios.images).forEach(([key, imageUrl]) => {
        const [type, index] = key.split('_');
        const descriptionKey = `${type}_${index}_description`;
        const description = designData.accesorios.descriptions[descriptionKey] || 'Sin descripción';

        if (!groupedAccessories[type]) {
          groupedAccessories[type] = [];
        }

        groupedAccessories[type].push({
          image: imageUrl,
          description
        });
      });

      // Renderizar por tipo
      Object.entries(groupedAccessories).forEach(([type, items]) => {
        const typeName = type === 'Accesorios' ? 'Accesorios' :
          type === 'Mascotas' ? 'Mascotas' : 'Extras';

        accessoriesHtml += `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #1a202c; margin-bottom: 10px;">${typeName}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
      `;

        items.forEach((item, idx) => {
          accessoriesHtml += `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; background: #f8fafc;">
            <img 
              src="${item.image}" 
              alt="Accesorio ${typeName} ${idx + 1}" 
              style="max-width: 100%; height: auto; border-radius: 4px; margin-bottom: 8px;"
            />
            <p style="margin: 0; font-size: 14px; color: #4a5568;"><strong>Descripción:</strong> ${item.description}</p>
          </div>
        `;
        });

        accessoriesHtml += `
          </div>
        </div>
      `;
      });

      accessoriesHtml += `</div>`;
      return accessoriesHtml;
    };

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #4a5568;">
      <h1 style="color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 12px; margin-bottom: 20px;">
        ¡Nuevo pedido de Funko Personalizado!
      </h1>
      
      <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <h2 style="margin-top: 0; color: #1a202c; font-size: 18px;">Datos de contacto</h2>
        <p style="margin: 8px 0;"><strong>Nombre:</strong> ${designData.userName}</p>
        <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${designData.userPhone}</p>
      </div>

      <div style="background: #f8fafc; padding: 15px; border-radius: 5px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
        <h2 style="margin-top: 0; color: #1a202c; font-size: 18px;">Detalles del diseño</h2>
        <p style="margin: 8px 0;"><strong>Tipo:</strong> ${designData.funkoType === 'individual' ? 'Individual' :
        designData.funkoType === 'mascota' ? 'Mascota' : 'Pareja'}</p>
        ${getVariantText() ? `<p style="margin: 8px 0;">${getVariantText()}</p>` : ''}
        <p style="margin: 8px 0;"><strong>Descripción:</strong> ${designData.description || 'No especificada'}</p>
      </div>

      ${designData.photoUrl ? `
        <div style="margin-bottom: 20px;">
          <h2 style="color: #1a202c; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Foto de referencia</h2>
          <img 
            src="${designData.photoUrl}" 
            alt="Diseño de Funko" 
            style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;"
          />
        </div>
      ` : ''}

      ${renderAccessories()}

      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #718096;">
        <p>Fecha de solicitud: ${new Date(designData.createdAt).toLocaleString()}</p>
      </div>
    </div>
  `;
  }, []);

  // Función para enviar email de forma asíncrona
  const sendDesignEmail = useCallback(async (designData: DesignData) => {
    const MAX_RETRIES = 2;
    const RETRY_DELAY = 1000; // 1 segundo

    const sendWithRetry = async (retryCount = 0): Promise<void> => {
      try {
        const emailContent = generateEmailContent(designData);

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: designData.userName,
            userPhone: designData.userPhone,
            emailContent,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log('Email enviado exitosamente');

      } catch (error) {
        if (retryCount < MAX_RETRIES) {
          console.log(`Reintentando envío (${retryCount + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
          return sendWithRetry(retryCount + 1);
        } else {
          console.error('Error enviando email después de reintentos:', error);
        }
      }
    };

    // Iniciar el envío sin esperar (fire and forget)
    sendWithRetry().catch(error => {
      console.error('Error inesperado en envío asíncrono:', error);
    });
  }, [generateEmailContent]);

  const imagenesFunko = useMemo(() => [
    { src: "/images/funko-base.png", alt: "Funko Base" },
    { src: "/images/funko-base-female.png", alt: "Funko Mujer" },
    { src: "/images/funko-pet.png", alt: "Funko Mascota" },
    { src: "/images/funko-couple.png", alt: "Funko Pareja" }
  ], []);

  // Manejar clic en el botón "Enviar pedido"
  const handleSubmitClick = async () => {
    if (!validateForm()) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.info("Procesando tu diseño...");

      // 1. Convertir la foto preview (Base64) a File
      const photoFile = dataURLtoFile(fotoPreview!, "funko-photo.jpg");

      // 2. Subir la imagen principal a ImgBB
      const photoUrl = await uploadToImgBB(photoFile);

      // 3. Subir accesorios de forma ASÍNCRONA (no esperamos)
      const accesoriosUrls: Record<string, string> = {};

      // Iniciar subida de accesorios en segundo plano
      uploadAccessoriesAsync(accesorios.images, accesoriosUrls)
        .then(() => {
          console.log('Todos los accesorios se subieron exitosamente');
        })
        .catch(error => {
          console.error('Error subiendo algunos accesorios:', error);
          // Esto no afecta el flujo principal
        });

      // Guardar datos temporales inmediatamente (no esperamos accesorios)
      setTempDesignData({
        funkoType: funkoType!,
        variant: funkoType === 'individual' ? gender :
          funkoType === 'mascota' ? petType : coupleData,
        description,
        photoUrl,
        accesorios: {
          images: accesoriosUrls, // Este objeto se llenará async
          descriptions: accesorios.descriptions
        }
      });

      setShowContactPopup(true);
      toast.dismiss();

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar el diseño. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Función para subir accesorios de forma asíncrona
  const uploadAccessoriesAsync = async (images: Record<string, File>, resultUrls: Record<string, string>): Promise<void> => {
    const uploadPromises = Object.entries(images).map(
      async ([key, file]) => {
        try {
          const url = await uploadToImgBB(file);
          resultUrls[key] = url;
          console.log(`Accesorio ${key} subido exitosamente`);
        } catch (error) {
          console.error(`Error subiendo accesorio ${key}:`, error);
          // Podrías optar por reintentar o simplemente continuar
        }
      }
    );

    await Promise.all(uploadPromises);
  };

  // Manejar envío final con datos de contacto
  const handleFinalSubmit = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      toast.error("Por favor ingresa tu nombre y teléfono");
      return;
    }

    // Verificar si todavía se están subiendo accesorios
    const accesoriosPendientes = Object.keys(accesorios.images).length > 0 &&
      Object.keys(tempDesignData?.accesorios.images || {}).length <
      Object.keys(accesorios.images).length;

    if (accesoriosPendientes) {
      toast.info("Todavía se están procesando algunos accesorios. Por favor espera un momento...");
      return;
    }


    setIsSubmitting(true);
    toast.info("Enviando tu pedido...");

    try {
      if (!tempDesignData) {
        throw new Error("Datos del diseño no encontrados");
      }

      // 1. Crear objeto completo de diseño
      const designData: DesignData = {
        ...tempDesignData,
        userName,
        userPhone,
        createdAt: new Date(),
        status: "pending"
      };

      // 2. Guardar en Firestore (esto sí necesita await)
      await addDoc(collection(db, "funkoDesigns"), designData);

      // 3. Enviar email (asíncrono)
      sendDesignEmail(designData);

      // 4. Mostrar confirmación inmediatamente
      setSubmitSuccess(true);
      resetForm();
      toast.success("¡Pedido enviado con éxito!");

    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al guardar el pedido. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
      toast.dismiss();
    }
  };

  const resetForm = () => {
    setFunkoType(null);
    setGender(null);
    setPetType(null);
    setCoupleData({ person1: null, person2: null });
    setDescription("");
    setUserName("");
    setUserPhone("");
    setFotoPreview(null);
    setAccesorios({ images: {}, descriptions: {} });
    setShowContactPopup(false);
    setTempDesignData(null);
    setFormErrors({});
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-3">¡Diseño Enviado con Éxito!</h2>
          <p className="text-gray-800 mb-6">
            Hemos recibido tu diseño personalizado y nos pondremos en contacto contigo pronto.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Crear otro diseño
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pt-20 pb-10">
      {/* Popup de contacto */}
      {showContactPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full animate-fade-in mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Datos de contacto</h2>

            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-800 mb-1">Tu nombre *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-950"
                  required
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-800 mb-1">Tu teléfono *</label>
                <input
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-950"
                  required
                  placeholder="Ej: +34 123 456 789"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowContactPopup(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSubmitting ? 'Enviando...' : 'Confirmar pedido'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Personaliza tu Funko</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Carrusel de imágenes */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <Carrousel
              images={imagenesFunko}
              selectedImage={imagenSeleccionada}
              onSelectImage={setImagenSeleccionada}
            />
          </div>

          {/* Formulario */}
          <div className="space-y-6">
            {/* Tipo de Funko */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Tipo de Funko *</h2>
              {formErrors.funkoType && (
                <p className="text-red-500 text-sm mb-2">{formErrors.funkoType}</p>
              )}
              <div className="grid grid-cols-3 gap-4">
                {['individual', 'mascota', 'pareja'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setFunkoType(type as FunkoType);
                      setFormErrors(prev => ({ ...prev, funkoType: '' }));
                    }}
                    className={`p-4 border rounded-lg transition-colors text-gray-800 ${funkoType === type
                      ? 'border-blue-500 bg-blue-50 font-medium'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {type === 'individual' && 'Individual'}
                    {type === 'mascota' && 'Mascota'}
                    {type === 'pareja' && 'Pareja'}
                  </button>
                ))}
              </div>
            </div>

            {/* Opciones específicas */}
            {funkoType === 'individual' && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Género *</h2>
                {formErrors.gender && (
                  <p className="text-red-500 text-sm mb-2">{formErrors.gender}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {['hombre', 'mujer'].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGender(g as GenderType);
                        setFormErrors(prev => ({ ...prev, gender: '' }));
                      }}
                      className={`p-4 border rounded-lg transition-colors text-gray-800 ${gender === g
                        ? 'border-blue-500 bg-blue-50 font-medium'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {g === 'hombre' ? 'Hombre' : 'Mujer'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {funkoType === 'mascota' && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Tipo de mascota *</h2>
                {formErrors.petType && (
                  <p className="text-red-500 text-sm mb-2">{formErrors.petType}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  {['perro', 'gato'].map((pet) => (
                    <button
                      key={pet}
                      onClick={() => {
                        setPetType(pet as PetType);
                        setFormErrors(prev => ({ ...prev, petType: '' }));
                      }}
                      className={`p-4 border rounded-lg transition-colors text-gray-800 ${petType === pet
                        ? 'border-blue-500 bg-blue-50 font-medium'
                        : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      {pet === 'perro' ? 'Perro' : 'Gato'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {funkoType === 'pareja' && (
              <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Pareja *</h2>
                {formErrors.couple && (
                  <p className="text-red-500 text-sm mb-2">{formErrors.couple}</p>
                )}
                {['person1', 'person2'].map((person) => (
                  <div key={person} className="space-y-2">
                    <h3 className="font-medium text-gray-800">
                      {person === 'person1' ? 'Persona 1' : 'Persona 2'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {['hombre', 'mujer'].map((g) => (
                        <button
                          key={g}
                          onClick={() => {
                            setCoupleData(prev => ({
                              ...prev,
                              [person]: g as GenderType
                            }));
                            setFormErrors(prev => ({ ...prev, couple: '' }));
                          }}
                          className={`p-4 border rounded-lg transition-colors text-gray-800 ${coupleData[person as keyof CoupleData] === g
                            ? 'border-blue-500 bg-blue-50 font-medium'
                            : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {g === 'hombre' ? 'Hombre' : 'Mujer'}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Foto y datos personales */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Foto de referencia *</h2>
              {formErrors.foto && (
                <p className="text-red-500 text-sm mb-2">{formErrors.foto}</p>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setFotoPreview(reader.result as string);
                      setFormErrors(prev => ({ ...prev, foto: '' }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {fotoPreview && (
                <div className="mt-2 relative">
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  />
                  <button
                    onClick={() => setFotoPreview(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Descripción adicional</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles importantes como ropa, peinado, accesorios especiales, etc."
                className="w-full p-3 border border-gray-300 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              />
            </div>

            {/* Accesorios */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <AccesoriosForm
                onChange={(images, descriptions) => setAccesorios({ images, descriptions })}
              />
            </div>

            {/* Botón de envío */}
            <button
              onClick={handleSubmitClick}
              disabled={isSubmitting}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                } flex items-center justify-center`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Enviar pedido'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}