import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'

function App() {
  const [started, setStarted] = useState(false)
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100">
      <AnimatePresence>
        {!started && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-8"
          >
            <h1 className="fantasy-title text-5xl md:text-7xl font-bold mb-4 text-center">D&D Adventure</h1>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              className="btn-3d text-2xl px-10 py-4 mt-4"
              onClick={() => setStarted(true)}
            >
              Start Adventure
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {started && (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
          >
            <GameBoard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function GameBoard() {
  // Minimal, beautiful, modern game board
  return (
    <div className="w-full max-w-2xl aspect-square bg-white/80 rounded-3xl shadow-2xl flex items-center justify-center border-4 border-yellow-300 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{background: 'radial-gradient(circle at 60% 40%, #ffe06633 0%, transparent 80%)'}} />
      <div className="z-10 flex flex-col items-center gap-6">
        <motion.div
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 8 }}
          className="rounded-full bg-yellow-200 border-4 border-yellow-500 shadow-lg w-24 h-24 flex items-center justify-center mb-2"
        >
          <span className="fantasy-title text-4xl text-yellow-900">🧙‍♂️</span>
        </motion.div>
        <h2 className="fantasy-title text-2xl text-yellow-900 text-center">Your adventure begins here.</h2>
        <p className="text-yellow-800 text-center max-w-md">Move your hero, roll dice, and let the story unfold. (This is just the beginning—tell me what you want next!)</p>
      </div>
    </div>
  )
}

export default App
