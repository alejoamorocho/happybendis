import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../lib/firebase'
import { collection, addDoc, query, orderBy, limit, onSnapshot, doc, getDoc, getDocs, deleteDoc } from 'firebase/firestore'
import { sendMessageToGemini } from '../services/chatService'
import ReactMarkdown from 'react-markdown'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: any
}

interface UserProfile {
  child: {
    name: string
    birthdate: string
    gender: 'niño' | 'niña'
  }
  name?: string
}

const Chat = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    // Obtener el perfil del usuario
    const fetchUserProfile = async () => {
      const userDocRef = doc(db, 'users', user.uid)
      const userDocSnap = await getDoc(userDocRef)
      if (userDocSnap.exists()) {
        setUserProfile(userDocSnap.data() as UserProfile)
      }
    }

    fetchUserProfile()

    // No cargar mensajes anteriores al iniciar sesión
    setMessages([])

    const q = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('timestamp', 'desc'),
      limit(50)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[]
      setMessages(messageList.reverse())
    })

    return () => unsubscribe()
  }, [user, navigate])

  const calculateAgeInMonths = (birthdate: string): string => {
    const [day, month, year] = birthdate.split('/')
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    const today = new Date()
    
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12
    months += today.getMonth() - birthDate.getMonth()
    
    // Ajustar si el día del mes actual es menor que el día de nacimiento
    if (today.getDate() < birthDate.getDate()) {
      months--
    }
    
    return months.toString() + ' meses'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user || !userProfile) return

    setIsLoading(true)
    setError('')

    try {
      // Obtener el nombre del usuario
      const userName = user.displayName || 
                      (await getDoc(doc(db, 'users', user.uid))).data()?.name || 
                      'amigo/a'

      // Guardar mensaje del usuario
      await addDoc(collection(db, 'chats', user.uid, 'messages'), {
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      })

      // Obtener respuesta de Gemini
      const childAge = calculateAgeInMonths(userProfile.child.birthdate)
      const response = await sendMessageToGemini(
        newMessage,
        userProfile.child.name,
        childAge,
        userProfile.child.gender,
        userName
      )

      // Guardar respuesta de Gemini
      await addDoc(collection(db, 'chats', user.uid, 'messages'), {
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      })

      setNewMessage('')
    } catch (error) {
      console.error('Error en el chat:', error)
      setError('Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetChat = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      // Eliminar todos los mensajes actuales
      const messagesRef = collection(db, 'chats', user.uid, 'messages')
      const q = query(messagesRef)
      const snapshot = await getDocs(q)
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
      
      setMessages([])
      setNewMessage('')
    } catch (error) {
      console.error('Error al reiniciar el chat:', error)
      setError('Error al reiniciar el chat. Por favor, intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        {/* Header del chat */}
        <div className="bg-gradient-to-r from-[#3CB371] to-[#9370DB] p-4">
          <h2 className="text-2xl font-['Bubblegum_Sans'] text-white">
            Chat con Happy Bendis 🌟
          </h2>
          {userProfile && (
            <p className="text-white/90 text-sm">
              Ayudándote con el desarrollo de tu Bendi {userProfile.child.name} 👶
            </p>
          )}
        </div>

        {/* Área de mensajes */}
        <div className="h-[60vh] overflow-y-auto p-4 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-[#3CB371]/10 to-[#3CB371]/20 text-gray-800'
                    : 'bg-gradient-to-r from-[#9370DB]/10 to-[#9370DB]/20 text-gray-800'
                } prose prose-sm max-w-none prose-headings:my-2 prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:text-emerald-700`}
              >
                <ReactMarkdown>
                  {message.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de mensajes */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe tu mensaje..."
              disabled={isLoading}
              className="flex-1 p-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CB371] focus:border-transparent"
            />
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className="px-4 py-2 bg-gradient-to-r from-[#3CB371] to-[#9370DB] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? '⏳' : '📨'}
            </button>
            <button
              type="button"
              onClick={handleResetChat}
              disabled={isLoading || messages.length === 0}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 disabled:opacity-50"
              title="Reiniciar chat"
            >
              🔄
            </button>
          </div>
        </form>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Chat
