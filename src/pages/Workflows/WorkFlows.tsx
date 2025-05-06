// src/pages/Workflows/WorkFlows copy.tsx
import InfoCard from './InfoCard'; // Asegúrate de que la ruta sea correcta

// Ejemplo de un icono SVG que podrías pasar como prop
const CustomUserIcon = ({ className = "w-10 h-10 text-blue-500" }: { className?: string }) => ( // Añadido tipo para props
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
);

const BellIcon = ({ className = "w-10 h-10 text-red-500" }: { className?: string }) => ( // Añadido tipo para props
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
    </svg>
);


export default function WorkFlowsCopy() { // Asumiendo que el nombre del componente es WorkFlowsCopy basado en el nombre del archivo
  // Corrección: Especificar el tipo del parámetro cardTitle como 'string'
  const handleCardClick = (cardTitle: string) => {
    alert(`Botón de '${cardTitle}' clickeado!`);
    // Aquí puedes añadir lógica de navegación o cualquier otra acción.
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <InfoCard
          icon={<CustomUserIcon />}
          title="Gestión de Usuarios"
          description="Administra fácilmente los perfiles de usuario, permisos y roles dentro de la aplicación."
          buttonText="Ir a Usuarios"
          onButtonClick={() => handleCardClick("Gestión de Usuarios")}
        />
        <InfoCard
          icon={<BellIcon />}
          title="Notificaciones"
          description="Configura y revisa las notificaciones del sistema para mantenerte informado sobre eventos importantes."
          buttonText="Ver Alertas"
          onButtonClick={() => handleCardClick("Notificaciones")}
        />
        <InfoCard
          title="Configuración General"
          description="Ajusta las configuraciones globales de la plataforma, como el tema, idioma y preferencias."
          buttonText="Ajustes"
          onButtonClick={() => handleCardClick("Configuración General")}
        />
        
      </div>
    </div>
  );
}