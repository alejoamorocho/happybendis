import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../lib/firebase'
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: any
}

const Chat = () => {
  const [user] = useAuthState(auth)
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsLoading(true)
    try {
      await addDoc(collection(db, 'chats', user!.uid, 'messages'), {
        text: newMessage,
        sender: 'user',
        timestamp: new Date()
      })
      
      // Aquí iría la llamada a la API de Gemini
      // Por ahora simulamos una respuesta
      setTimeout(async () => {
        await addDoc(collection(db, 'chats', user!.uid, 'messages'), {
          text: '¡Hola! Soy Happy Bendis, tu asistente virtual. ¿En qué puedo ayudarte hoy? 🌟',
          sender: 'assistant',
          timestamp: new Date()
        })
        setIsLoading(false)
      }, 1000)

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
      <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-[#98FB98]/20 text-gray-800'
                  : 'bg-[#E6E6FA]/20 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#98FB98]"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#98FB98] text-white rounded-full hover:bg-[#98FB98]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#98FB98] disabled:opacity-50"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat
