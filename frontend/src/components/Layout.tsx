import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../lib/firebase'

const Layout = () => {
  const [user] = useAuthState(auth)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#98FB98]/30 to-[#E6E6FA]/30 text-gray-800">
      {user && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
