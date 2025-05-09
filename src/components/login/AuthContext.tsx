import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { googleLogout, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom'; // Para la redirección

// 1. Define la interfaz para la información del usuario que quieres almacenar
export interface User {
  email?: string;
  name?: string;
  picture?: string;
  // El 'sub' es el ID único de Google para el usuario, muy útil para tu backend
  sub?: string;
  // Agrega aquí otros campos que esperes del token decodificado
  [key: string]: any;
}

// 2. Define la interfaz para el valor del contexto
interface AuthContextType {
  user: User | null;
  idToken: string | null; // El JWT crudo de Google
  login: (credentialResponse: CredentialResponse) => void;
  logout: () => void;
  isLoading: boolean; // Para manejar el estado de carga inicial
}

// 3. Crea el Contexto
// El 'as AuthContextType' es una aserción de tipo, útil si estás seguro de la estructura inicial
// o si el valor por defecto es complejo de tipar directamente.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Crea el AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Para la carga inicial del token
  const navigate = useNavigate();

  // Efecto para intentar cargar el token del localStorage al iniciar la app
  useEffect(() => {
    const storedToken = localStorage.getItem('googleIdToken');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode<User>(storedToken);
        // Verifica la expiración del token (exp está en segundos)
        if (decodedUser.exp && decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setIdToken(storedToken);
          console.log("Usuario restaurado desde localStorage:", decodedUser);
        } else {
          // Token expirado
          localStorage.removeItem('googleIdToken');
          console.log("Token de localStorage expirado y eliminado.");
        }
      } catch (error) {
        console.error("Error decodificando token de localStorage:", error);
        localStorage.removeItem('googleIdToken');
      }
    }
    setIsLoading(false); // Termina la carga inicial
  }, []);

  const login = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const decodedUser = jwtDecode<User>(credentialResponse.credential);
      setUser(decodedUser);
      setIdToken(credentialResponse.credential);
      localStorage.setItem('googleIdToken', credentialResponse.credential); // Persiste el token
      console.log("Usuario logueado (Context):", decodedUser);
      // (IMPORTANTE) Aquí es donde enviarías el credentialResponse.credential a tu backend para verificación
      // fetch('/api/auth/google', { method: 'POST', body: JSON.stringify({ token: credentialResponse.credential })})
      //   .then(res => res.json())
      //   .then(backendResponse => { /* Manejar respuesta del backend */ });

      navigate('/'); // Redirige al home o dashboard después del login
    } else {
      console.error("Respuesta de credenciales de Google no contiene 'credential'.");
    }
  };

  const logout = () => {
    googleLogout(); // Limpia la sesión de Google en el cliente
    setUser(null);
    setIdToken(null);
    localStorage.removeItem('googleIdToken');
    console.log("Usuario deslogueado (Context)");
    navigate('/signin'); // Redirige a la página de login
  };

  // No renderizar hijos hasta que se complete la carga inicial del estado de autenticación
  if (isLoading) {
    return <div>Cargando aplicación...</div>; // O un spinner/loader más elegante
  }

  return (
    <AuthContext.Provider value={{ user, idToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Hook personalizado para usar el AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};