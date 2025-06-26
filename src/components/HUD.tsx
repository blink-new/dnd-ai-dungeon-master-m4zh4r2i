import { Heart, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface HUDProps {
  hp: number
  maxHp: number
  ac: number
  level: number
  initiative: number
}

export default function HUD({ hp, maxHp, ac, level, initiative }: HUDProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-100/90 backdrop-blur-md rounded-xl shadow-lg px-6 py-3 flex space-x-8 z-50 font-serif text-yellow-900"
    >
      <div className="flex items-center space-x-1">
        <Heart className="w-6 h-6 text-red-600" />
        <span className="font-semibold">HP: {hp} / {maxHp}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Shield className="w-6 h-6 text-blue-600" />
        <span className="font-semibold">AC: {ac}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Zap className="w-6 h-6 text-yellow-600" />
        <span className="font-semibold">Init: +{initiative}</span>
      </div>
      <div className="flex items-center space-x-1">
        <span className="font-semibold">Level: {level}</span>
      </div>
    </motion.div>
  )
}