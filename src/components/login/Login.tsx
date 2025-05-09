
import React from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
// jwtDecode ya no es estrictamente necesario aquí si el AuthContext lo maneja,
// pero no hace daño tenerlo si quieres inspeccionar el token aquí también por alguna razón.
// import { jwtDecode } from "jwt-decode";
import { useAuth } from './AuthContext'; // <-- 1. Importa useAuth

// (Opcional) Define una interfaz para la estructura esperada de tu token decodificado
// interface DecodedTokenType {
//   email?: string;
//   name?: string;
//   [key: string]: any;
// }

const Login: React.FC = () => {
  const { login } = useAuth(); // <-- 2. Obtén la función login del contexto

  const handleLoginSuccess = (credentialResponse: CredentialResponse): void => {
    console.log('Login Success (componente Login.tsx):', credentialResponse);
    // El AuthContext se encargará de decodificar, guardar y redirigir.
    login(credentialResponse); // <-- 3. Llama a la función login del contexto
  };

  const handleLoginError = (): void => {
    console.log('Login Failed (componente Login.tsx)');
    // Podrías también llamar a una función del contexto para manejar errores globales si es necesario
    // o mostrar un mensaje de error local.
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Estilo para centrar el botón */}
      {/* Puedes quitar el h2 si la página SignIn ya tiene un título adecuado */}
      {/* <h2>Inicia sesión con Google</h2> */}
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          useOneTap
          theme="filled_blue" // Ejemplo de personalización
          size="large"    // Ejemplo de personalización
        />
    </div>
  );
};

export default Login;