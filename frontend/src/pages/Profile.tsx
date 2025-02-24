import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

interface UserProfile {
  name: string
  email: string
  gender: string
  child: {
    name: string
    birthdate: string
    gender: 'niño' | 'niña'
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
        const data = docSnap.data()
        // Asegurarse de que el género del bebé sea 'niño' o 'niña'
        const childGender = data.child?.gender === 'niña' ? 'niña' : 'niño'
        setProfile({
          ...data,
          child: {
            ...data.child,
            gender: childGender
          }
        } as UserProfile)
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
        gender: profile.gender,
        child: {
          name: profile.child.name,
          birthdate: profile.child.birthdate,
          gender: profile.child.gender
        }
      })
      setIsEditing(false)
    } catch (err) {
      setError('Error al guardar los cambios. Por favor, intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return dateString
  }

  const getGenderEmoji = (gender: string) => {
    switch (gender) {
      case 'female':
        return '👩'
      case 'male':
        return '👨'
      default:
        return '👤'
    }
  }

  const getChildGenderEmoji = (gender: 'niño' | 'niña') => {
    return gender === 'niña' ? '👧' : '👦'
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-8">
        {/* Encabezado del perfil */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-3xl font-['Bubblegum_Sans'] bg-clip-text text-transparent bg-gradient-to-r from-[#3CB371] to-[#9370DB]">
            Mi Perfil Happy Bendis
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#3CB371] to-[#9370DB] text-white rounded-md hover:opacity-90 transition-all duration-200"
            >
              ✏️ Editar Perfil
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="submit"
                form="profile-form"
                disabled={isSaving}
                className="px-4 py-2 bg-gradient-to-r from-[#3CB371] to-[#9370DB] text-white rounded-md hover:opacity-90 transition-all duration-200 disabled:opacity-50"
              >
                {isSaving ? '⏳' : '💾'} Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-all duration-200 disabled:opacity-50"
              >
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>

        <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Sección de información personal */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {getGenderEmoji(profile.gender)} Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
                  👤 Tu nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={profile.name}
                  onChange={(e) => isEditing && setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                  ✉️ Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-gray-100 text-gray-900 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Sección de información del Bendi */}
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {getChildGenderEmoji(profile.child.gender)} Información de tu Bendi
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-800 mb-1">
                  👶 Nombre
                </label>
                <input
                  type="text"
                  id="childName"
                  value={profile.child.name}
                  onChange={(e) => isEditing && setProfile({
                    ...profile,
                    child: { ...profile.child, name: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] disabled:bg-gray-100"
                />
              </div>

              <div>
                <label htmlFor="childBirthdate" className="block text-sm font-medium text-gray-800 mb-1">
                  🎂 Fecha de nacimiento
                </label>
                <input
                  type="text"
                  id="childBirthdate"
                  value={formatDate(profile.child.birthdate)}
                  onChange={(e) => isEditing && setProfile({
                    ...profile,
                    child: { ...profile.child, birthdate: e.target.value }
                  })}
                  disabled={!isEditing}
                  className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-[#3CB371] disabled:bg-gray-100"
                  placeholder="dd/mm/yyyy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  👶 Género
                </label>
                <div className="flex gap-4 mt-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="niño"
                      checked={profile.child.gender === 'niño'}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        child: { ...profile.child, gender: 'niño' }
                      })}
                      disabled={!isEditing}
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#3CB371] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#3CB371] before:opacity-0 before:transition-opacity hover:before:opacity-10 checked:border-[#3CB371] checked:before:bg-[#3CB371] checked:bg-[#3CB371] disabled:cursor-not-allowed disabled:border-gray-300 disabled:checked:bg-gray-300"
                    />
                    <span className={`ml-2 ${!isEditing ? 'cursor-not-allowed text-gray-500' : ''}`}>👦 Niño</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="niña"
                      checked={profile.child.gender === 'niña'}
                      onChange={(e) => isEditing && setProfile({
                        ...profile,
                        child: { ...profile.child, gender: 'niña' }
                      })}
                      disabled={!isEditing}
                      className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-[#3CB371] transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-[#3CB371] before:opacity-0 before:transition-opacity hover:before:opacity-10 checked:border-[#3CB371] checked:before:bg-[#3CB371] checked:bg-[#3CB371] disabled:cursor-not-allowed disabled:border-gray-300 disabled:checked:bg-gray-300"
                    />
                    <span className={`ml-2 ${!isEditing ? 'cursor-not-allowed text-gray-500' : ''}`}>👧 Niña</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md">
              ⚠️ {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
