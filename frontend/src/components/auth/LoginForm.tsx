import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../lib/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/chat')
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        👋 ¡Bienvenido de nuevo!
      </h2>
      
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
        <p className="text-red-600 text-sm text-center">{error}</p>
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
