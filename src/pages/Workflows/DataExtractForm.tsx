// src/components/DataExtractForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import ClientSelector from './ClientSelector';
import StaticOptionsSelector, { SelectOption as StaticSelectOption } from './StaticOptionsSelector';
import FileUpload from './FileUpload'; // Importar el componente de carga de archivos

interface DataExtractFormProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onSubmit: (formData: DataExtractFormData) => void; // onSubmit debe manejar Files
  formTitle?: string;
}

// Interfaz específica para los datos de este formulario

const DataExtractForm: React.FC<DataExtractFormProps> = ({
  isOpen,
  onClose,
  onMinimize,
  onSubmit,
  formTitle = "Carga de Documentos para Extracción",
}) => {
  const initialFormData: DataExtractFormData = {
    clientId: '',
    clientType: '',
    uploadedFiles: [],
    additionalNotes: '',
    extractionPurpose: '', // Inicializar nuevo campo
  };

  const [formData, setFormData] = useState<DataExtractFormData>(initialFormData);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData); 
    }
  }, [isOpen]);

  const handleSelectorChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Un manejador más genérico para inputs de texto o textareas
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFilesUpdate = (files: File[]) => {
    setFormData(prevData => ({
      ...prevData,
      uploadedFiles: files,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert("Por favor, selecciona un cliente.");
      return;
    }
    if (!formData.clientType) { // Opcional, según si este campo es relevante para la extracción
      alert("Por favor, selecciona un tipo de cliente.");
      return;
    }
     if (!formData.extractionPurpose) { 
      alert("Por favor, indica el propósito de la extracción.");
      return;
    }
    if (formData.uploadedFiles.length === 0) {
      alert("Por favor, sube al menos un documento.");
      return;
    }
    onSubmit(formData);
  };

  const clientTypeOptions: StaticSelectOption[] = [
    { value: '', label: 'Selecciona tipo de cliente' },
    { value: 'Persona Física - Nueva Actividad', label: 'Persona Física - Nueva Actividad' },
    { value: 'Persona Fisica - Actividad en Marcha', label: 'Persona Fisica - Actividad en Marcha' },
    { value: 'Persona Jurídica - Nueva Actividad', label: 'Persona Jurídica - Nueva Actividad' },
    { value: 'Persona Jurídica - Actividad en Marcha', label: 'Persona Jurídica - Actividad en Marcha' },
  ];
  
  const extractionPurposeOptions: StaticSelectOption[] = [ // Opciones para el nuevo campo
    { value: '', label: 'Selecciona propósito' },
    { value: 'CONTABILIZACION_AUTOMATICA', label: 'Contabilización Automática' },
    { value: 'ANALISIS_FINANCIERO', label: 'Análisis Financiero' },
    { value: 'CONCILIACION_BANCARIA', label: 'Conciliación Bancaria' },
    { value: 'PREPARACION_IMPUESTOS', label: 'Preparación de Impuestos' },
    { value: 'OTRO', label: 'Otro (detallar en notas)' },
  ];

  const CLIENT_API_URL = 'https://data-hub-production.up.railway.app/companies_all';
  const API_TOKEN = '4321'; // ¡Mover a variables de entorno!
  const ACCEPTED_FILE_EXTENSIONS = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.xml,.jpg,.jpeg,.png";


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
                    w-11/12 max-w-3xl max-h-[90vh] 
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-6'}`}
        onClick={(e) => e.stopPropagation()}
      >
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label htmlFor="def-clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cliente
              </label>
              <ClientSelector
                name="clientId"
                apiUrl={CLIENT_API_URL}
                apiToken={API_TOKEN}
                selectedValue={formData.clientId || ''}
                onChange={handleSelectorChange}
                triggerFetch={isOpen}
                defaultOptionLabel="Selecciona un cliente"
              />
            </div>
            <div>
              <label htmlFor="def-clientType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Cliente
              </label>
              <StaticOptionsSelector
                name="clientType"
                options={clientTypeOptions}
                selectedValue={formData.clientType || ''}
                onChange={handleSelectorChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="def-extractionPurpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Propósito de la Extracción
            </label>
            <StaticOptionsSelector
                name="extractionPurpose"
                options={extractionPurposeOptions}
                selectedValue={formData.extractionPurpose || ''}
                onChange={handleSelectorChange}
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cargar Documentos
            </label>
            <FileUpload
              onFilesSelected={handleFilesUpdate}
              acceptedFileTypes={ACCEPTED_FILE_EXTENSIONS}
              // maxFiles={10} // Opcional: puedes establecer un máximo de archivos
            />
          </div>
          
          <div>
            <label htmlFor="def-additionalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notas Adicionales (Opcional)
            </label>
            <textarea
              id="def-additionalNotes"
              name="additionalNotes"
              rows={2}
              value={formData.additionalNotes || ''}
              onChange={handleInputChange} // Usando el manejador genérico
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
              placeholder="Instrucciones especiales, periodo específico, etc."
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="bg-[#847AD5] hover:bg-[#6c47b6] text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-150 ease-in-out"
              //className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              disabled={formData.uploadedFiles.length === 0} 
            >
              Iniciar Extracción de Datos
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DataExtractForm;