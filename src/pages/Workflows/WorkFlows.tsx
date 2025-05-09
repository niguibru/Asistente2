import { useState } from 'react';
import InfoCard from './InfoCard'; // Asegúrate de que la ruta sea correcta
import DocumentRequestForm, { DocumentRequestFormData } from './DocumentRequestForm';
import OnBoardingForm from './OnBoardingForm';
import './WorkFlows.css'
import listDocsIcon from '../../icons/list_icon.png';
import DataExtractForm, { DataExtractFormData } from './DataExtractForm';

// Ejemplo de un icono SVG que podrías pasar como prop

const ListDocsIcon = ({ className = "w-8 h-10 object-contain" }: { className?: string }) => (
  <img
    src={listDocsIcon}
    alt="Pedido de Documentos" // Texto alternativo descriptivo
    className={className}
  />
);

const MailIcon = ({ className = "w-12 h-10 text-blue-500" }: { className?: string }) => ( // Añadido tipo para props
  <svg className={className} fill="#847AD5" stroke="#847AD5" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3.0415 7.06206V14.375C3.0415 14.6511 3.26536 14.875 3.5415 14.875H16.4582C16.7343 14.875 16.9582 14.6511 16.9582 14.375V7.06245L11.1441 11.1168C10.4568 11.5961 9.54348 11.5961 8.85614 11.1168L3.0415 7.06206ZM16.9582 5.19262C16.9582 5.19341 16.9582 5.1942 16.9582 5.19498V5.20026C16.957 5.22216 16.9458 5.24239 16.9277 5.25501L10.2861 9.88638C10.1143 10.0062 9.88596 10.0062 9.71412 9.88638L3.0723 5.25485C3.05318 5.24151 3.04178 5.21967 3.04177 5.19636C3.04176 5.15695 3.0737 5.125 3.1131 5.125H16.8869C16.925 5.125 16.9562 5.15494 16.9582 5.19262ZM18.4582 5.21428V14.375C18.4582 15.4796 17.5627 16.375 16.4582 16.375H3.5415C2.43693 16.375 1.5415 15.4796 1.5415 14.375V5.19498C1.5415 5.1852 1.54169 5.17546 1.54206 5.16577C1.55834 4.31209 2.25546 3.625 3.1131 3.625H16.8869C17.7546 3.625 18.4582 4.32843 18.4583 5.19622C18.4583 5.20225 18.4582 5.20826 18.4582 5.21428Z"></path>
  </svg>
);

const DataExtractIcon = ({ className = "w-10 h-10 text-blue-500" }: { className?: string }) => ( // Añadido tipo para props
  <svg className={className} fill="#847AD5" stroke="#847AD5" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z"></path>
  </svg>
);

const HandShakeIcon = ({ className = "w-14 h-10 text-blue-500" }: { className?: string }) => ( // Añadido tipo para props
  <svg className={className} fill="#847AD5" stroke="#847AD5" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M323.4 85.2l-96.8 78.4c-16.1 13-19.2 36.4-7 53.1c12.9 17.8 38 21.3 55.3 7.8l99.3-77.2c7-5.4 17-4.2 22.5 2.8s4.2 17-2.8 22.5l-20.9 16.2L512 316.8 512 128l-.7 0-3.9-2.5L434.8 79c-15.3-9.8-33.2-15-51.4-15c-21.8 0-43 7.5-60 21.2zm22.8 124.4l-51.7 40.2C263 274.4 217.3 268 193.7 235.6c-22.2-30.5-16.6-73.1 12.7-96.8l83.2-67.3c-11.6-4.9-24.1-7.4-36.8-7.4C234 64 215.7 69.6 200 80l-72 48 0 224 28.2 0 91.4 83.4c19.6 17.9 49.9 16.5 67.8-3.1c5.5-6.1 9.2-13.2 11.1-20.6l17 15.6c19.5 17.9 49.9 16.6 67.8-2.9c4.5-4.9 7.8-10.6 9.9-16.5c19.4 13 45.8 10.3 62.1-7.5c17.9-19.5 16.6-49.9-2.9-67.8l-134.2-123zM16 128c-8.8 0-16 7.2-16 16L0 352c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-224-80 0zM48 320a16 16 0 1 1 0 32 16 16 0 1 1 0-32zM544 128l0 224c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-208c0-8.8-7.2-16-16-16l-80 0zm32 208a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"></path>
  </svg>
);


//<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 128-168 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l168 0 0 112c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM384 336l0-48 110.1 0-39-39c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l80 80c9.4 9.4 9.4 24.6 0 33.9l-80 80c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l39-39L384 336zm0-208l-128 0L256 0 384 128z"/></svg>

export default function WorkFlows() { 
  const [isDocumentFormOpen, setIsDocumentFormOpen] = useState(false);
  const [isOnboardingFormOpen, setIsOnboardingFormOpen] = useState(false);
  const [isDataExtractOpen, setIsDataExtractFormOpen] = useState(false);
  const [selectedCardTitle, setSelectedCardTitle] = useState<string | null>(null);

  const handleOpenOnboardingForm = (cardTitle: string) => {
    setSelectedCardTitle(cardTitle);
    setIsOnboardingFormOpen(true);
  };
  const handleOpenDocumentForm = (cardTitle: string) => {
    setSelectedCardTitle(cardTitle);
    setIsDocumentFormOpen(true);
  };
  const handleOpenDataExtractForm = (cardTitle: string) => {
    setSelectedCardTitle(cardTitle);
    setIsDataExtractFormOpen(true);
  };

  const handleCloseOnboardingForm = () => {
    setIsOnboardingFormOpen(false);
    setSelectedCardTitle(null);
  };

  const handleCloseDocumentForm = () => {
    setIsDocumentFormOpen(false);
    setSelectedCardTitle(null);
  };

  const handleCloseDataExtractForm = () => {
    setIsDataExtractFormOpen(false);
    setSelectedCardTitle(null);
  };


  const handleMinimizeForm = () => {
    // Por ahora, "minimizar" simplemente cerrará el formulario.
    // Podrías implementar una lógica diferente si "minimizar" significa otra cosa (ej. ocultar temporalmente).
    // todo: refactor this
    setIsOnboardingFormOpen(false);
    setIsDocumentFormOpen(false)
    console.log("Formulario minimizado (acción actual: cerrar)");
  };

  const handleSubmitForm = (formData: { [key: string]: string }) => {
    console.log(`Formulario enviado desde: ${selectedCardTitle}`, formData);
    // Aquí procesarías los datos del formulario
    setIsOnboardingFormOpen(false);
    setIsDocumentFormOpen(false)
    setSelectedCardTitle(null);
  };


  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
        <InfoCard
          icon={<HandShakeIcon />}
          title="Onboarding de Cliente"
          description="Seleccione el tipo de cliente y le enviaremos un formulario para que lo rellene. Te avisaremos en cuanto lo haya completado."
          buttonText="Iniciar"
          onButtonClick={() => handleOpenOnboardingForm("Enviar al Cliente")}
        />
        <InfoCard
          icon={<ListDocsIcon />}
          title="Pedido de Documentos"
          description="Elige el documento que deseas solicitar y se enviará una petición al cliente. Serás notificado en cuanto lo envíe."
          buttonText="Inciar"
          onButtonClick={() => handleOpenDocumentForm("Pedido de Documentos")}
        />
        <InfoCard
          icon={<DataExtractIcon />}
          title="Extracción de Datos"
          description="Carga un documento y el sistema identificará y extraerá automáticamente la información más relevante. Recibirás un resumen una vez finalizado el proceso."
          buttonText="Iniciar"
          onButtonClick={() => handleOpenDataExtractForm("Extracción de Datos")}
        />
        <InfoCard
          icon={<MailIcon />}
          title="Borrador de Email - WIP"
          description="Crea un borrador de email personalizado, adjunta los archivos necesarios y prepáralo para su envío al cliente."
          buttonText="Iniciar"
          onButtonClick={() => { }} //handleOpenForm("Borrador de Email")}
        />

        <DocumentRequestForm
          isOpen={isDocumentFormOpen}
          onClose={handleCloseDocumentForm}
          onMinimize={handleMinimizeForm}
          onSubmit={function (formData: DocumentRequestFormData): void {
            setIsDocumentFormOpen(false);
            setSelectedCardTitle(null);
            console.log(formData); //todo: remove this line
          }}
          formTitle={selectedCardTitle || "Formulario Interactivo"} // Pasa un título por defecto si no hay uno seleccionado
        />
        <OnBoardingForm
          isOpen={isOnboardingFormOpen}
          onClose={handleCloseOnboardingForm}
          onMinimize={handleMinimizeForm}
          onSubmit={handleSubmitForm}
          formTitle={selectedCardTitle || "Formulario Interactivo"} // Pasa un título por defecto si no hay uno seleccionado
        />
        <DataExtractForm
          isOpen={isDataExtractOpen}
          onClose={handleCloseDataExtractForm}
          onMinimize={handleMinimizeForm}
          onSubmit={function (formData: DataExtractFormData): void {
            setIsDataExtractFormOpen(false);
            setSelectedCardTitle(null);
            console.log(formData); //todo: remove this line
          }}
          formTitle={selectedCardTitle || "Formulario Interactivo"} // Pasa un título por defecto si no hay uno seleccionado
        />
      </div>
    </div>
  );
}