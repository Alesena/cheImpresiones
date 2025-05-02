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
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [customerData, setCustomerData] = useState({
    email: '',
    name: ''
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validar solo tamaño máximo (2.4GB)
      if (files[0].size > 2.4 * 1024 * 1024 * 1024) {
        setError('El archivo es demasiado grande (máximo 2.4GB)');
        return;
      }
      setError('');
      setSelectedFile(files[0]);
    }
  };

  const handleNextClick = () => {
    if (!selectedFile) {
      setError('Por favor selecciona un archivo primero');
      return;
    }
    setShowModal(true);
  };

  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerData.email) {
      setError('Por favor ingresa tu email');
      return;
    }
  
    setIsSubmitting(true);
    setError('');
  
    const formData = new FormData();
    formData.append('file', selectedFile!);
    formData.append('material', selectedMaterial);
    formData.append('color', selectedColor);
    formData.append('userEmail', customerData.email);
    if (customerData.name) formData.append('userName', customerData.name);
  
    try {
      const response = await fetch('/api/3d-orders', {
        method: 'POST',
        body: formData,
        // No incluir headers['Content-Type'] - FormData lo establece automáticamente
      });
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Respuesta no JSON del servidor');
      }
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el pedido');
      }
  
      setSubmitSuccess(true);
      setShowModal(false);
    } catch (err) {
      console.error('Error en la solicitud:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al enviar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">¡Pedido Enviado con Éxito!</h2>
          <p className="text-gray-700 mb-6">
            Hemos recibido tu archivo 3D y nos pondremos en contacto contigo pronto.
          </p>
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setSelectedFile(null);
              setCustomerData({ email: '', name: '' });
            }}
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
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

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
                    Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                )}

                <div className="text-xs text-gray-500">
                  <p className="font-medium mb-1">Formatos aceptables:</p>
                  <p>STL, OBJ, <span className="italic">3MF, AMF</span></p>
                  <p className="mt-2">El tamaño máximo del archivo es 2.4GB</p>
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
                          title={color}
                        />
                      ))}
                    </div>
                  </div>

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
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
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
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleNextClick}
                disabled={!selectedFile}
                className={`w-full text-white font-medium py-3 px-4 rounded-md text-sm mt-6 ${
                  !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                SIGUIENTE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal/Popup para datos del cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Completa tus datos</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerData.email}
                    onChange={handleCustomerDataChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre (opcional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerData.name}
                    onChange={handleCustomerDataChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Pedido'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}