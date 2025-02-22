import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

interface UserProfile {
  name: string
  email: string
  child: {
    name: string
    birthdate: string
  }
}

const Profile = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const fetchProfile = async () => {
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile)
      }
    }

    fetchProfile()
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    setIsSaving(true)
    setError('')

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        child: {
          name: profile.child.name,
          birthdate: profile.child.birthdate
        }
      })
      setIsEditing(false)
    } catch (err) {
      setError('Error al guardar los cambios. Por favor, intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">👤 Tu Perfil</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-[#98FB98] hover:text-[#98FB98]/80"
            >
              ✏️ Editar
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              ✉️ Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="parentName" className="block text-sm font-medium text-gray-700">
              👤 Tu nombre
            </label>
            <input
              type="text"
              id="parentName"
              name="parentName"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              👶 Información de tu pequeño
            </h3>

            <div className="space-y-4">
              <div className="mb-4">
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="childName"
                  name="childName"
                  value={profile.child.name}
                  onChange={(e) => setProfile({
                    ...profile,
                    child: { ...profile.child, name: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="childBirthdate" className="block text-sm font-medium text-gray-700">
                  🎂 Fecha de nacimiento
                </label>
                <input
                  type="date"
                  id="childBirthdate"
                  name="childBirthdate"
                  value={profile.child.birthdate}
                  onChange={(e) => setProfile({
                    ...profile,
                    child: { ...profile.child, birthdate: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {isEditing && (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#98FB98] text-white rounded-md hover:bg-[#98FB98]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#98FB98] disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? '⏳ Guardando...' : '💾 Guardar cambios'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
