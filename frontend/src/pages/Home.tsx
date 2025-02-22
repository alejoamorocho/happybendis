import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebase'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

const Home = () => {
  const [user] = useAuthState(auth)
  const [isLogin, setIsLogin] = useState(true)

  if (user) {
    return <Navigate to="/chat" replace />
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-7xl font-['Bubblegum_Sans'] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3CB371] to-[#9370DB] mb-8 animate-pulse hover:scale-105 transition-transform duration-200">
        Happy Bendis
      </h1>
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#3CB371] hover:text-[#9370DB] font-medium transition-colors"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate 🌟' : '¿Ya tienes cuenta? Inicia sesión 👋'}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center text-white max-w-xl">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#3CB371] to-[#9370DB] animate-pulse">
          👶 Tu Asistente Virtual en el Desarrollo Infantil
        </h2>
        <p className="text-lg leading-relaxed font-medium">
          Únete a Happy Bendis y recibe orientación personalizada para el desarrollo de tu pequeño.
          Respuestas adaptadas a la edad de tu hijo y recomendaciones específicas para cada etapa.
        </p>
      </div>
    </div>
  )
}

export default Home
