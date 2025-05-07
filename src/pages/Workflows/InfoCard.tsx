// InfoCard.tsx
import React from 'react'; // Asegúrate de que React esté importado

// Un componente de icono de marcador de posición (tipado para props si es necesario)
const PlaceholderIcon = ({ className }: { className?: string }) => (
  <svg className={className || "w-10 h-10 text-gray-400 dark:text-gray-500"} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
  </svg>
);

interface InfoCardProps {
  icon?: React.ReactElement; // Usando React.ReactElement en lugar de JSX.Element
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, description, buttonText, onButtonClick }) => {
  const IconComponent = icon || <PlaceholderIcon />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">
        {IconComponent}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow">
        {description}
      </p>
      <div className="mt-auto flex justify-end ">
        <button
          onClick={onButtonClick}
          className="px-4 py-2 text-sm font-medium text-white bg-[#847AD5] rounded-lg hover:bg-[#847AD5] focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default InfoCard;