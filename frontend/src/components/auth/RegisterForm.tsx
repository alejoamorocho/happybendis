import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../lib/firebase'
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const RegisterForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [childName, setChildName] = useState('')
  const [childGender, setChildGender] = useState('')
  const [childBirthdate, setChildBirthdate] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validar contraseña
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Guardar información adicional en Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        gender,
        child: {
          name: childName,
          gender: childGender,
          birthdate: childBirthdate
        },
        createdAt: new Date().toISOString()
      })

      navigate('/chat')
    } catch (err) {
      const firebaseError = err as AuthError
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          setError('Este correo electrónico ya está registrado')
          break
        case 'auth/invalid-email':
          setError('El correo electrónico no es válido')
          break
        case 'auth/operation-not-allowed':
          setError('El registro con correo y contraseña no está habilitado')
          break
        case 'auth/weak-password':
          setError('La contraseña es demasiado débil')
          break
        default:
          setError('Error al crear la cuenta. Por favor, intenta de nuevo.')
      }
      console.error('Error de registro:', firebaseError)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        ✨ Crear nueva cuenta
      </h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
          👤 Tu nombre
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        />
      </div>

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
          minLength={6}
          placeholder="Mínimo 6 caracteres"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800 mb-1">
          🔐 Confirmar contraseña
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
          minLength={6}
          placeholder="Repite tu contraseña"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-800 mb-1">
          🧑 Tu género
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        >
          <option value="">Selecciona tu género</option>
          <option value="female">Femenino</option>
          <option value="male">Masculino</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div>
        <label htmlFor="childName" className="block text-sm font-medium text-gray-800 mb-1">
          👶 Nombre de tu Bendi
        </label>
        <input
          type="text"
          id="childName"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        />
      </div>

      <div>
        <label htmlFor="childBirthdate" className="block text-sm font-medium text-gray-800 mb-1">
          📅 Fecha de nacimiento de tu Bendi
        </label>
        <input
          type="text"
          id="childBirthdate"
          value={childBirthdate}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '')
            if (value.length <= 8) {
              let formattedDate = value
              if (value.length > 4) {
                formattedDate = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4)
              } else if (value.length > 2) {
                formattedDate = value.slice(0, 2) + '/' + value.slice(2)
              }
              setChildBirthdate(formattedDate)
            }
          }}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
          placeholder="dd/mm/yyyy"
          maxLength={10}
        />
      </div>

      <div>
        <label htmlFor="childGender" className="block text-sm font-medium text-gray-800 mb-1">
          👶 Tu Bendi es
        </label>
        <select
          id="childGender"
          value={childGender}
          onChange={(e) => setChildGender(e.target.value)}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371]"
          required
        >
          <option value="">Selecciona el género</option>
          <option value="female">Niña</option>
          <option value="male">Niño</option>
        </select>
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
        Crear cuenta ✨
      </button>
    </form>
  )
}

export default RegisterForm
