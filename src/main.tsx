// src/main.tsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom"; // <-- 1. Importa BrowserRouter aquí
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx"; // Asumo que no usa contexto de auth
import { ThemeProvider } from "./context/ThemeContext.tsx";   // Asumo que no usa contexto de auth
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from "./components/login/AuthContext.tsx"; // <-- 2. Importa tu AuthProvider

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error(
    "FATAL ERROR: VITE_GOOGLE_CLIENT_ID no está definido en tus variables de entorno. " +
    "La autenticación de Google no funcionará. Por favor, revisa tu archivo .env."
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("No se pudo encontrar el elemento 'root' en el DOM.");
}

createRoot(rootElement).render(
  <StrictMode>
    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router> {/* <--- 3. Router envuelve a AuthProvider y al resto */}
          <AuthProvider> {/* <--- 4. AuthProvider envuelve a tus otros providers y App */}
            <ThemeProvider>
              <AppWrapper>
                <App />
              </AppWrapper>
            </ThemeProvider>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    ) : (
      <div>
        Error de configuración: El ID de cliente de Google no está disponible.
        La aplicación no puede iniciarse correctamente.
      </div>
    )}
  </StrictMode>
);