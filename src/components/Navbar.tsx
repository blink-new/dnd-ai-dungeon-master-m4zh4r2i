import { Link, useLocation } from 'react-router-dom'
import { Dice6, Users, Sword, Home } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/character-creator', icon: Users, label: 'Character Creator' },
    { path: '/dice-roller', icon: Dice6, label: 'Dice Roller' },
    { path: '/game-session', icon: Sword, label: 'Game Session' },
  ]

  return (
    <nav className="border-b-4 border-yellow-700 bg-[rgba(239,224,185,0.95)] shadow-md font-serif" style={{ fontFamily: 'Cinzel, serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Dice6 className="h-8 w-8 text-yellow-700" />
              <span className="text-2xl font-bold text-yellow-900 fantasy-title">D&D AI Master</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link key={item.path} to={item.path}>
                    <button
                      className={`btn-medieval flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        isActive 
                          ? 'bg-yellow-700 text-white border-yellow-700' 
                          : 'bg-transparent text-yellow-900 border-yellow-700 hover:bg-[#a67c52] hover:text-white'
                      }`}
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar