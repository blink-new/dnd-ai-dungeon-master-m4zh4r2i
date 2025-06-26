import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    <nav className="glassmorphism border-b border-yellow-600/30 shadow-2xl backdrop-blur-md sticky top-0 z-50" style={{ fontFamily: 'Cinzel, serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.1, rotateY: 15 }}
                transition={{ duration: 0.3 }}
              >
                <Dice6 className="h-8 w-8 text-yellow-400 glow-text floating" />
              </motion.div>
              <span className="text-2xl font-bold text-yellow-300 fantasy-title glow-text">D&D AI Master</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.button
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden ${
                        isActive 
                          ? 'btn-3d text-black' 
                          : 'glassmorphism border border-yellow-600/30 text-yellow-300 hover:border-yellow-500/50 hover:text-yellow-200'
                      }`}
                      style={{ fontFamily: 'Cinzel, serif' }}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? '' : 'glow-text'}`} />
                      <span className={isActive ? '' : 'glow-text'}>{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-xl"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="glassmorphism border border-yellow-600/30 text-yellow-300 p-2 rounded-lg"
            >
              <Dice6 className="h-6 w-6 glow-text" />
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar