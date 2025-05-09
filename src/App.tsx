// src/App.tsx
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // <-- 1. Importa ProtectedRoute
import './app.css'

// ... (resto de tus imports de componentes de página)
import WorkFlows from "./pages/Workflows/WorkFlows";
import ClientDisplay from "./pages/Portfolio/ClientDisplay";
// ...

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Rutas Públicas (Autenticación) */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas Protegidas */}
        {/* Todas las rutas que necesitan autenticación irán dentro de este ProtectedRoute */}
        <Route element={<ProtectedRoute />}> {/* <--- 2. Usa ProtectedRoute */}
          <Route element={<AppLayout />}> {/* AppLayout ahora es un hijo de ProtectedRoute */}
            <Route index path="/" element={<Home />} />
            {/* Others Page */}
            <Route path="/workflows" element={<WorkFlows />} />
            <Route path="/your-portfolio" element={<ClientDisplay />} /> {/* Asumo que ClientDisplay está importado */}
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}