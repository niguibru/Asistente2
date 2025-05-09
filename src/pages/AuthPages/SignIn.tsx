// src/pages/AuthPages/SignIn.tsx
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  // const navigate = useNavigate();
  // const { user } = useAuth(); // Para verificar si el usuario ya está logueado y redirigir

  // Efecto para redirigir si el usuario ya está logueado (opcional aquí, podría estar en AuthContext)
  // useEffect(() => {
  //   if (user) {
  //     navigate('/'); // o a la página de dashboard
  //   }
  // }, [user, navigate]);

  return (
    <>
      <PageMeta
        title="Iniciar Sesión | Zinco Copilot" // Actualiza el título
        description="Página de inicio de sesión para Zinco Copilot" // Actualiza la descripción
      />
      <AuthLayout>
        {/* Renderiza tu formulario de inicio de sesión tradicional */}
        <SignInForm />

        {/* Divisor o texto para separar los métodos de inicio de sesión */}
        {/* <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>O</p>
        </div> */}

        {/* 2. Renderiza tu botón de inicio de sesión con Google */}
        {/* <LoginWithGoogleButton /> */}

        {/* Aquí podrías añadir enlaces a "Crear cuenta" o "¿Olvidaste contraseña?" si no están en SignInForm */}
        
        {/* <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p>¿No tienes una cuenta? <Link to="/signup">Regístrate</Link></p>
        </div> */}
       
      </AuthLayout>
    </>
  );
}