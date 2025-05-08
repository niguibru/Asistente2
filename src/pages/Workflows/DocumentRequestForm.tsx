// src/components/DocumentRequestForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import ClientSelector from './ClientSelector'; // Ajusta la ruta
import StaticOptionsSelector, { SelectOption as StaticSelectOption } from './StaticOptionsSelector'; // Ajusta la ruta
//import { documentsForAccountingSpain } from './documentLists'; // Asumiendo que creaste documentLists.ts o similar

interface DocumentRequestFormProps {
    isOpen: boolean;
    onClose: () => void;
    onMinimize: () => void;
    onSubmit: (formData: DocumentRequestFormData) => void;
    formTitle?: string;
    // Podrías pasar la lista de documentos como prop para mayor flexibilidad
    // availableDocuments?: { id: string; label: string }[];
}

export interface DocumentRequestFormData {
    clientId: string;
    clientType: string; // O podría ser 'requestPeriod', 'fiscalYear', etc.
    selectedDocuments: { [key: string]: boolean };
    additionalNotes?: string;
}

export interface DataExtractFormData {
    clientId: string;
    clientType: string;
    uploadedFiles: File[];
    additionalNotes?: string;
    extractionPurpose?: string; // Nuevo campo ejemplo
}
// src/documentLists.ts
const documentsForAccountingSpain = [
    { id: 'MODELO_036_037', label: 'Modelo 036/037 (Declaración Censal)' },
    { id: 'CERTIFICADO_CORRIENTE_AEAT', label: 'Certificado Corriente AEAT' },
    { id: 'CERTIFICADO_CORRIENTE_TGSS', label: 'Certificado Corriente Seg. Social' },
    { id: 'ULTIMAS_DECLARACIONES_IVA', label: 'Últimas Declaraciones IVA (M303/M390)' },
    { id: 'PAGOS_FRACCIONADOS_IRPF', label: 'Pagos Fraccionados IRPF (M130/M131)' },
    { id: 'IMPUESTO_SOCIEDADES', label: 'Impuesto sobre Sociedades (M200/M202)' },
    { id: 'FACTURAS_EMITIDAS_PERIODO', label: 'Facturas Emitidas del Periodo Solicitado' },
    { id: 'FACTURAS_RECIBIDAS_GASTOS_PERIODO', label: 'Facturas Recibidas/Gastos del Periodo Solicitado' },
    { id: 'EXTRACTOS_BANCARIOS_PERIODO', label: 'Extractos Bancarios del Periodo Solicitado' },
    { id: 'NOMINAS_SEGUROS_SOCIALES', label: 'Nóminas y Seguros Sociales (si tiene empleados)' },
    { id: 'ESCRITURAS_CIF_EMPRESA', label: 'Escrituras de Constitución y CIF (Empresas)' },
    { id: 'DNI_NIE_REPRESENTANTE', label: 'DNI/NIE del Titular o Representante Legal' },
];

const DocumentRequestForm: React.FC<DocumentRequestFormProps> = ({
    isOpen,
    onClose,
    onMinimize,
    onSubmit,
    formTitle = "Solicitud de Documentos"
    // availableDocuments = documentsForAccountingSpain // Usar valor por defecto o prop
}) => {
    const initialSelectedDocuments = documentsForAccountingSpain.reduce((acc, doc) => {
        acc[doc.id] = false;
        return acc;
    }, {} as { [key: string]: boolean });

    const initialFormData: DocumentRequestFormData = {
        clientId: '',
        clientType: '', // Ajusta según necesidad; podría ser un campo de texto para "Periodo Fiscal"
        selectedDocuments: { ...initialSelectedDocuments },
        additionalNotes: '',
    };

    const [formData, setFormData] = useState<DocumentRequestFormData>(initialFormData);

    useEffect(() => {
        if (!isOpen) {
            // Resetear selectedDocuments a todos false
            const resetSelectedDocs = Object.keys(formData.selectedDocuments).reduce((acc, key) => {
                acc[key] = false;
                return acc;
            }, {} as { [key: string]: boolean });

            setFormData({
                ...initialFormData,
                selectedDocuments: resetSelectedDocs,
            });
        }
    }, [isOpen]); // formData.selectedDocuments no es necesario como dependencia si siempre reseteamos a initial

    // Manejador de cambios genérico para los selectores y otros inputs
    const handleFieldChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSelectorChange = (name: string, value: string) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prevData => ({
            ...prevData,
            additionalNotes: e.target.value,
        }));
    };

    const handleCheckboxChange = (documentId: string) => {
        setFormData(prevData => ({
            ...prevData,
            selectedDocuments: {
                ...prevData.selectedDocuments,
                [documentId]: !prevData.selectedDocuments[documentId],
            },
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.clientId) {
            alert("Por favor, selecciona un cliente.");
            return;
        }
        const trulySelectedDocuments = Object.entries(formData.selectedDocuments)
            .filter(([_, isSelected]) => isSelected)
            .map(([key, _]) => key);

        if (trulySelectedDocuments.length === 0) {
            alert("Por favor, selecciona al menos un documento.");
            return;
        }
        // Enviar los datos, incluyendo la lista de IDs de documentos seleccionados
        onSubmit({
            ...formData,
            // Opcionalmente, podrías transformar selectedDocuments a un array de IDs aquí
            // selectedDocuments: trulySelectedDocuments (si la firma de onSubmit espera un array de strings)
        });
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
    const API_TOKEN = '4321';

    return (
        <div
            className={`fixed inset-0 z-99999 flex items-center justify-center p-4
                  transition-opacity duration-300 ease-out
                  ${isOpen ? 'opacity-100 bg-black/60' : 'opacity-0 pointer-events-none'}`}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl
                    flex flex-col transform transition-all duration-300 ease-out
                    w-11/12 max-w-3xl max-h-[85vh] /* Aumentada un poco la altura máxima */
                    ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-6'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">{formTitle}</h3>
                    <div> {/* Botones de minimizar y cerrar */}
                        <button onClick={onMinimize} title="Minimizar" className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 mr-2 text-gray-600 dark:text-gray-300" aria-label="Minimizar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" /></svg>
                        </button>
                        <button onClick={onClose} title="Cerrar" className="p-2 rounded-md hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-300 dark:hover:bg-red-600" aria-label="Cerrar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                {/* Cuerpo del Modal / Contenido del Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-grow">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div>
                            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Documentos a Solicitar
                        </label>
                        <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-600 p-3 rounded-md"> {/* Contenedor con scroll para checkboxes */}
                            {documentsForAccountingSpain.map((doc) => (
                                <label key={doc.id} htmlFor={doc.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id={doc.id}
                                        name={doc.id}
                                        checked={formData.selectedDocuments[doc.id] || false}
                                        onChange={() => handleCheckboxChange(doc.id)}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{doc.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notas Adicionales (Opcional)
                        </label>
                        <textarea
                            id="additionalNotes"
                            name="additionalNotes"
                            rows={3}
                            value={formData.additionalNotes}
                            onChange={handleNotesChange}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-200"
                            placeholder="Ej: 'Facturas del primer trimestre de 2024', 'Documentación para la declaración de la renta 2023', etc."
                        />
                    </div>

                    <div className="flex justify-end pt-3">
                        <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Pedir Documentos
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DocumentRequestForm;