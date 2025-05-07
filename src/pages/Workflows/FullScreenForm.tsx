// src/components/FullScreenForm.tsx (o donde lo tengas)
import React, { useState, useEffect, FormEvent } from 'react';

interface FullScreenFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void; // Asumimos que "minimizar" sigue cerrando el modal por ahora
  onSubmit: (formData: { [key: string]: string }) => void;
  formTitle?: string;
}

const FullScreenForm: React.FC<FullScreenFormProps> = ({
  isOpen,
  onClose,
  onMinimize,
  onSubmit,
  formTitle = "Formulario"
}) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});
  const [clientType, setClientType] = useState<string>('');
  const [clientData, setClientData] = useState<{ id: number; name: string }[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  // Limpia el formulario cuando se cierra o se envía
  useEffect(() => {
    if (!isOpen) {
      setFormData({});
    }
  }, [isOpen]);

  // 1. Traer clientes
  const fetchClientData = async (): Promise<void> => {
    const url = 'https://data-hub-production.up.railway.app/companies_all';
    const token = '4321';
    setLoadingClients(true);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json() as { id: number; name: string }[];
      setClientData(data.map(client => ({
        id: client.id || 0,
        name: client.name || 'N/A',
      })));
    } catch (err) {
      setClientData([]);
    } finally {
      setLoadingClients(false);
    }
  };

  // 2. Llamar a fetchClientData cuando el modal se abre
  useEffect(() => {
    if (isOpen) fetchClientData();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Opcional: podrías dejar el formulario con los datos o limpiarlo aquí también.
    // onClose(); // A menudo se cierra el modal después de enviar. El padre ya lo hace.
  };

  // 2. Opciones de tipo de cliente
  const clientTypeOptions = [
    { value: '', label: 'Selecciona tipo de cliente' },
    { value: 'Persona Física - Nueva Actividad', label: 'Persona Física - Nueva Actividad' },
    { value: 'Persona Fisica - Actividad en Marcha', label: 'Persona Fisica - Actividad en Marcha' },
    { value: 'Persona Jurídica - Nueva Actividad', label: 'Persona Jurídica - Nueva Actividad' },
    { value: 'Persona Jurídica - Actividad en Marcha', label: 'Persona Jurídica - Actividad en Marcha' },
  ];

  return (
    <div
      // Contenedor de fondo (Overlay): maneja el click para cerrar y la opacidad
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
                  transition-opacity duration-300 ease-out
                  ${isOpen ? 'opacity-100 bg-black/60' : 'opacity-0 pointer-events-none'}`} // Un poco más oscuro el fondo
      onClick={(e) => {
        // Cierra solo si se hace click directamente en el fondo
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Panel del Modal/Formulario */}
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                    flex flex-col transform transition-all duration-300 ease-out
                    w-11/12 max-w-3xl  /* TAMAÑO: Ancho responsivo con un máximo. Puedes ajustar max-w-xl, max-w-3xl, etc. */
                    max-h-[70vh]       /* ALTURA: Máxima altura, evita que sea más alto que la pantalla */
                    ${isOpen
                        ? 'opacity-100 scale-100 translate-y-0' // Estado visible y animado
                        : 'opacity-0 scale-95 -translate-y-6'   // Estado oculto y para animación de entrada/salida
                    }`}
        onClick={(e) => e.stopPropagation()} // Evita que el click dentro cierre el modal
      >
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600 shrink-0">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{formTitle}</h3>
          <div>
            <button
              onClick={onMinimize}
              title="Minimizar"
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 mr-2 text-gray-600 dark:text-gray-300"
              aria-label="Minimizar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
              </svg>
            </button>
            <button
              onClick={onClose}
              title="Cerrar"
              className="p-2 rounded-md hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 dark:hover:bg-red-600"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal / Contenido del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow">
          {/* Campos del formulario (igual que antes) */}
          {/* <div>
            <label htmlFor="fullName" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div> */}

          {/* <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Mensaje (Opcional)</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={formData.message || ''}
              onChange={handleChange}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            ></textarea>
          </div> */}

          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            {/* Dropdown de clientes */}
            <select 
              onChange={(e) => handleChange(e as any)}
              value={formData.clientId || ''}
              name="clientId"
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '17px',
                borderRadius: '6px',
                border: '1px solid #bbb',
                background: '#fafbfc',
                boxShadow: '0 1px 2px #0001',
                marginBottom: 16
              }}
              disabled={loadingClients}
            >
              <option value="">{loadingClients ? 'Cargando clientes...' : 'Selecciona un cliente'}</option>
              {clientData.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            {/* Dropdown de tipo de cliente */}
            <select
              onChange={e => setClientType(e.target.value)}
              value={clientType}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '17px',
                borderRadius: '6px',
                border: '1px solid #bbb',
                background: '#fafbfc',
                boxShadow: '0 1px 2px #0001'
              }}
            >
              {clientTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              style={{
                background: '#847AD5',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '16px',
                boxShadow: '0 1px 2px #0001',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#6c47b6')}
              onMouseOut={e => (e.currentTarget.style.background = '#847AD5')}
            >
              Enviar Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FullScreenForm;