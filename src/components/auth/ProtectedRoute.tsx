// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../login/AuthContext'; // Ajusta la ruta

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Muestra un loader mientras se verifica el estado de autenticación
    // Esto es importante para evitar un parpadeo a la página de login
    // si el usuario ya está autenticado pero el contexto aún no se ha cargado.
    return <div>Verificando autenticación...</div>; // O un spinner más elegante
  }

  if (!user) {
    // Si no hay usuario, redirige a la página de signin.
    // Guardamos la ubicación actual para que podamos redirigir de nuevo
    // a esta página después de un inicio de sesión exitoso.
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Si el usuario está autenticado, renderiza el contenido de la ruta (Outlet)
  // o los children si se pasaran directamente.
  return <Outlet />;
};

export default ProtectedRoute;