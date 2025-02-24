import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase'
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [needsVerification, setNeedsVerification] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNeedsVerification(false)

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      
      if (!user.emailVerified) {
        // Reenviar email de verificación
        // Primero configuramos el idioma del usuario
        auth.languageCode = 'es'
        await sendEmailVerification(user, {
          url: window.location.origin + '/login',
          handleCodeInApp: true
        })
        await auth.signOut()
        setNeedsVerification(true)
        return
      }

      navigate('/chat')
    } catch (err: any) {
      switch (err.code) {
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido')
          break
        case 'auth/user-disabled':
          setError('Esta cuenta ha sido deshabilitada')
          break
        case 'auth/user-not-found':
          setError('No existe una cuenta con este correo electrónico')
          break
        case 'auth/wrong-password':
          setError('Contraseña incorrecta')
          break
        default:
          setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        👋 ¡Bienvenido de nuevo!
      </h2>
      
      {needsVerification && (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            ¡Necesitas verificar tu correo! 📧
          </h3>
          <p className="text-yellow-700">
            Te hemos enviado un nuevo correo de verificación. Por favor:
          </p>
          <ol className="list-decimal list-inside text-left space-y-2 mt-2 text-yellow-700">
            <li>Revisa tu bandeja de entrada (y la carpeta de spam)</li>
            <li>Busca un correo de Happy Bendis</li>
            <li>Haz clic en el enlace de verificación</li>
            <li>Vuelve a intentar iniciar sesión</li>
          </ol>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
          ✉️ Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
          🔑 Contraseña
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm text-center font-medium bg-red-50 p-2 rounded-md">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-gradient-to-r from-[#3CB371] to-[#9370DB] text-white font-medium rounded-md shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3CB371] transform transition-all duration-200 hover:scale-[1.02]"
      >
        Iniciar sesión ✨
      </button>
    </form>
  )
}

export default LoginForm
