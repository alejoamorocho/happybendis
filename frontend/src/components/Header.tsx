import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/firebase'

const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await auth.signOut()
    navigate('/')
  }

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/chat" className="flex items-center gap-2">
          <h1 className="text-4xl font-['Bubblegum_Sans'] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#3CB371] to-[#9370DB] hover:scale-105 transition-transform duration-200">
            Happy Bendis
          </h1>
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            to="/chat" 
            className="text-gray-800 hover:text-[#3CB371] font-medium transition-colors"
          >
            💭 Chat
          </Link>
          <Link 
            to="/profile" 
            className="text-gray-800 hover:text-[#9370DB] font-medium transition-colors"
          >
            👤 Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-800 hover:text-red-600 font-medium transition-colors"
          >
            🚪 Salir
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Header
