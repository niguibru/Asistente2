// src/components/FullScreenForm.tsx (o donde lo tengas)
import React, { useState, useEffect, FormEvent } from 'react';
import ClientSelector from './ClientSelector'; // Ajusta la ruta si es necesario
import StaticOptionsSelector, { SelectOption as StaticSelectOption } from './StaticOptionsSelector'; // Ajusta la ruta

interface FullScreenFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onSubmit: (formData: { [key: string]: string }) => void;
  formTitle?: string;
}

const OnBoardingForm: React.FC<FullScreenFormProps> = ({
  isOpen,
  onClose,
  onMinimize,
  onSubmit,
  formTitle = "Formulario de Onboarding" // Título más específico
}) => {
  // Centralizar todos los campos del formulario en el estado formData
  const initialFormData = {
    clientId: '',
    clientType: '',
    // ...otros campos que puedas tener
  };
  const [formData, setFormData] = useState<{ [key: string]: string }>(initialFormData);

  // Limpia el formulario cuando se cierra
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
    }
  }, [isOpen]);

  // Manejador de cambios genérico para los selectores y otros inputs
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Validaciones básicas (puedes expandirlas)
    if (!formData.clientId) {
        alert("Por favor, selecciona un cliente.");
        return;
    }
    if (!formData.clientType) {
        alert("Por favor, selecciona un tipo de cliente.");
        return;
    }
    onSubmit(formData);
  };

  // Opciones para el selector de tipo de cliente (estáticas)
  const clientTypeOptions: StaticSelectOption[] = [
    { value: '', label: 'Selecciona tipo de cliente' },
    { value: 'Persona Física - Nueva Actividad', label: 'Persona Física - Nueva Actividad' },
    { value: 'Persona Fisica - Actividad en Marcha', label: 'Persona Fisica - Actividad en Marcha' },
    { value: 'Persona Jurídica - Nueva Actividad', label: 'Persona Jurídica - Nueva Actividad' },
    { value: 'Persona Jurídica - Actividad en Marcha', label: 'Persona Jurídica - Actividad en Marcha' },
  ];
  
  // URLs y Tokens para APIs (Considera mover a variables de entorno)
  const CLIENT_API_URL = 'https://data-hub-production.up.railway.app/companies_all';
  const API_TOKEN = '4321'; // Este token se usaría para todas las llamadas API si fuera el caso

  return (
    <div
      className={`fixed inset-0 z-9999999 flex items-center justify-center p-4
                  transition-opacity duration-300 ease-out
                  ${isOpen ? 'opacity-100 bg-black/60' : 'opacity-0 pointer-events-none'}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                    flex flex-col transform transition-all duration-300 ease-out
                    w-11/12 max-w-3xl max-h-[70vh]
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-6'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal (sin cambios) */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600 shrink-0">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{formTitle}</h3>
          <div>
            <button onClick={onMinimize} title="Minimizar" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 mr-2 text-gray-600 dark:text-gray-300" aria-label="Minimizar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" /></svg>
            </button>
            <button onClick={onClose} title="Cerrar" className="p-2 rounded-md hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 dark:hover:bg-red-600" aria-label="Cerrar">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Cuerpo del Modal / Contenido del Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-grow"> {/* Usar space-y para espaciado entre elementos del form */}
          
          {/* Contenedor original de los selects, ahora sin estilos de margen específicos */}
          <div>
            {/* Dropdown de clientes usando ClientSelector */}
            <div className="mb-4"> {/* Añadir margen inferior si es necesario o usar space-y en el div padre */}
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente
              </label>
              <ClientSelector
                name="clientId"
                apiUrl={CLIENT_API_URL}
                apiToken={API_TOKEN} // Usar el token definido
                selectedValue={formData.clientId || ''}
                onChange={handleFieldChange}
                triggerFetch={isOpen} // Cargar clientes solo cuando el modal está abierto
                defaultOptionLabel="Selecciona un cliente"
                // style={{ marginBottom: 16 }} // Eliminado, controlar espaciado con Tailwind o div padre
              />
            </div>

            {/* Dropdown de tipo de cliente usando StaticOptionsSelector */}
            <div> {/* El mb-4 anterior o el space-y del form se encarga del espaciado */}
              <label htmlFor="clientType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Cliente
              </label>
              <StaticOptionsSelector
                name="clientType"
                options={clientTypeOptions}
                selectedValue={formData.clientType || ''}
                onChange={handleFieldChange}
                // No necesita defaultOptionLabel porque la primera opción de clientTypeOptions ya lo es
              />
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-[#847AD5] hover:bg-[#6c47b6] text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-150 ease-in-out"
            >
              Enviar Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OnBoardingForm;