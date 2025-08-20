// app/tienda3D/page.tsx
'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function Tienda3DPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState('PLA');
  const [selectedColor, setSelectedColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleNext = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo primero');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('material', selectedMaterial);
      formData.append('color', selectedColor);

      const response = await fetch('/api/submit-3d-order', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setSelectedFile(null);
        setSelectedMaterial('PLA');
        setSelectedColor('');
      } else {
        throw new Error('Error al enviar el pedido');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Ocurrió un error al enviar tu pedido. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pedido Enviado con Éxito!</h2>
          <p className="text-gray-700 mb-6">Hemos recibido tu archivo 3D y nos pondremos en contacto contigo pronto.</p>
          <button 
            onClick={() => setSubmitSuccess(false)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Tienda 3D - Impresiones en plástico</title>
        <meta name="description" content="Sube tus archivos 3D y elige el material para imprimir" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">1 MATERIAL - PLÁSTICO</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Columna Izquierda - Subida de archivos */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Arrastra los archivos para subirlos</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <span className="text-gray-600 mb-1">o selecciona un archivo</span>
                    <span className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded inline-block">
                      Elegir archivo
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept=".stl,.obj,.3mf,.amf" 
                      />
                    </span>
                  </label>
                </div>

                {selectedFile && (
                  <p className="text-sm text-green-600 mb-4">
                    Archivo seleccionado: {selectedFile.name}
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Formatos aceptables:</p>
                  <p>STL, OBJ, <span className="italic">3MF, AMF</span></p>
                  <p className="mt-2">El tamaño máximo del archivo es 2.4GB y el tamaño mínimo es 20MB</p>
                </div>
              </div>
            </div>

            {/* Columna Derecha - Selección de materiales */}
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Selecciona tu material</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">PLA</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Blanco', 'Negro', 'Rojo', 'Azul', 'Verde', 'Amarillo'].map(color => (
                        <div 
                          key={`PLA-${color}`}
                          className={`w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 ${
                            selectedMaterial === 'PLA' && selectedColor === color ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ 
                            backgroundColor: color === 'Blanco' ? '#fff' : 
                                            color === 'Negro' ? '#000' : 
                                            color === 'Rojo' ? '#f00' : 
                                            color === 'Azul' ? '#00f' : 
                                            color === 'Verde' ? '#0f0' : '#ff0' 
                          }}
                          onClick={() => {
                            setSelectedMaterial('PLA');
                            setSelectedColor(color);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">PETG</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Transparente', 'Negro', 'Azul', 'Rojo'].map(color => (
                        <div 
                          key={`PETG-${color}`}
                          className={`w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 ${
                            selectedMaterial === 'PETG' && selectedColor === color ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ 
                            backgroundColor: color === 'Transparente' ? 'transparent' : 
                                            color === 'Negro' ? '#333' : 
                                            color === 'Azul' ? '#0066cc' : '#cc0000' 
                          }}
                          onClick={() => {
                            setSelectedMaterial('PETG');
                            setSelectedColor(color);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-700 mb-2">ABS</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Negro', 'Blanco', 'Rojo', 'Amarillo'].map(color => (
                        <div 
                          key={`ABS-${color}`}
                          className={`w-8 h-8 rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-blue-300 ${
                            selectedMaterial === 'ABS' && selectedColor === color ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ 
                            backgroundColor: color === 'Negro' ? '#222' : 
                                            color === 'Blanco' ? '#eee' : 
                                            color === 'Rojo' ? '#c00' : '#ffcc00' 
                          }}
                          onClick={() => {
                            setSelectedMaterial('ABS');
                            setSelectedColor(color);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNext}
                disabled={isSubmitting || !selectedFile}
                className={`w-full text-white font-medium py-3 px-4 rounded-md text-sm mt-6 ${
                  isSubmitting || !selectedFile
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'SIGUIENTE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}