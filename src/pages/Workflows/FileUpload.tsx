// src/components/FileUpload.tsx
import React, { useState, useCallback, DragEvent, ChangeEvent, useRef } from 'react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFileTypes?: string;
  label?: string;
  maxFiles?: number;
  // Podrías añadir una prop para los archivos existentes si el formulario se edita
  // initialFiles?: File[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedFileTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx,.csv,.txt,.xml",
  label = "Arrastra y suelta archivos aquí, o haz clic para seleccionar",
  maxFiles,
  // initialFiles = [] // Descomentar si se implementa edición
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // Considerar inicializar con initialFiles si se usa
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Referencia al input de archivo

  // Efecto para manejar initialFiles si se implementa
  // useEffect(() => {
  //   setSelectedFiles(initialFiles);
  // }, [initialFiles]);

  const addNewFiles = useCallback((newFilesArray: File[]) => {
    setSelectedFiles(prevSelectedFiles => {
      let combinedFiles = [...prevSelectedFiles, ...newFilesArray];

      if (maxFiles && combinedFiles.length > maxFiles) {
        setError(`No puedes seleccionar más de ${maxFiles} archivo(s). Los archivos adicionales no fueron añadidos.`);
        // Tomar solo hasta maxFiles, dando prioridad a los ya existentes
        combinedFiles = combinedFiles.slice(0, maxFiles);
      } else {
        setError(null); // Limpiar error si ahora estamos dentro del límite
      }
      
      onFilesSelected(combinedFiles); // Notificar al padre con la lista final
      return combinedFiles;
    });
  }, [maxFiles, onFilesSelected]);


  const handleFileProcessing = useCallback((incomingFiles: FileList | null) => {
    if (!incomingFiles) return;
    setError(null);

    let filesArray = Array.from(incomingFiles);

    // 1. Filtrar por tipos aceptados
    if (acceptedFileTypes) {
      const acceptedTypesArray = acceptedFileTypes.split(',').map(t => t.trim().toLowerCase());
      const originalLength = filesArray.length;
      filesArray = filesArray.filter(file => {
        const fileName = file.name || ''; // Asegurar que name exista
        const fileExtension = `.${fileName.split('.').pop()?.toLowerCase()}`;
        const fileMimeType = (file.type || '').toLowerCase(); // Asegurar que type exista

        return acceptedTypesArray.some(type =>
          (type.startsWith('.') && fileExtension === type) || 
          (type.includes('/') && fileMimeType === type)
        );
      });
      if (filesArray.length < originalLength) {
           setError(`Algunos archivos no son del tipo permitido (${acceptedFileTypes}). Solo se añadieron los válidos.`);
           // Si setError se usa aquí, y luego addNewFiles también usa setError,
           // el último setError "ganará". Considerar cómo manejar múltiples mensajes de error.
      }
    }
    
    if (filesArray.length > 0) {
        addNewFiles(filesArray);
    }

  }, [acceptedFileTypes, addNewFiles]);


  // Manejadores de Drag & Drop
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Solo quitar el estado de arrastre si el cursor realmente sale del dropzone
    // y no solo de un elemento hijo dentro de él.
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
        return;
    }
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true); // Asegurar que esté activo si se arrastra sobre él
  }, [isDragging]);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcessing(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleFileProcessing]);

  // Manejador para el input de archivo
  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileProcessing(e.target.files);
     // Limpiar el valor del input para permitir seleccionar el mismo archivo de nuevo
    if (e.target) {
      e.target.value = '';
    }
  };

  const removeFile = useCallback((fileNameToRemove: string) => {
    setSelectedFiles(prevSelectedFiles => {
      const updatedFiles = prevSelectedFiles.filter(file => file.name !== fileNameToRemove);
      onFilesSelected(updatedFiles); // Notificar al padre
      if (error && maxFiles && updatedFiles.length <= maxFiles) {
        setError(null); // Limpiar error si la eliminación nos pone dentro del límite
      }
      return updatedFiles;
    });
  }, [onFilesSelected, error, maxFiles]); // Incluir error y maxFiles si afectan la lógica de setError

  // Función para activar el click del input de archivo oculto
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer 
                    transition-colors duration-200 ease-in-out
                    ${isDragging 
                        ? 'border-indigo-600 bg-indigo-100 dark:bg-gray-600 dark:border-indigo-400' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600'
                    }`}
        onClick={triggerFileInput} // Hacer clic en el div activa el input de archivo
      >
        <input
          ref={fileInputRef} // Asignar la referencia
          type="file"
          id="fileInput" // Se puede quitar el id si no se usa document.getElementById
          multiple
          accept={acceptedFileTypes}
          onChange={onFileInputChange}
          className="hidden" // El input está oculto, se activa mediante el div
        />
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center pointer-events-none"> {/* pointer-events-none para que el click pase al div padre */}
          <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {acceptedFileTypes 
                ? `Tipos: ${acceptedFileTypes.split(',').map(t => t.trim().replace(/^\./, '').toUpperCase()).join(', ')}`
                : "Todos los archivos permitidos"
            }
          </p>
          {maxFiles && <p className="text-xs text-gray-500 dark:text-gray-400">Máximo {maxFiles} archivo(s)</p>}
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Archivos seleccionados ({selectedFiles.length}):</h4>
          <ul className="max-h-48 overflow-y-auto space-y-2 pr-2"> {/* Scroll para la lista de archivos */}
            {selectedFiles.map((file) => ( // Quitado el index si el nombre es suficientemente único para la key en este contexto
              <li 
                key={file.name + '-' + file.lastModified} // Clave más robusta
                className="flex justify-between items-center p-2 pl-3 pr-2 bg-gray-100 dark:bg-gray-700 rounded-md text-sm"
              >
                <span className="text-gray-800 dark:text-gray-100 truncate" title={file.name}>
                  {file.name} <span className="text-gray-500 dark:text-gray-400">({ (file.size / 1024).toFixed(2) } KB)</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                      e.stopPropagation(); // Evitar que el click se propague al div del dropzone
                      removeFile(file.name);
                  }}
                  className="ml-2 p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20"
                  title="Eliminar archivo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;