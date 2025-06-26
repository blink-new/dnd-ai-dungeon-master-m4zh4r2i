import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, Dice6, Sword, Sparkles, Shield, Book } from 'lucide-react'

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: 'Custom Character Creator',
      description: 'Build unique D&D characters with full race, class, and background customization. Roll stats or use point-buy system.',
      link: '/character-creator',
      color: 'card-3d hover:scale-105 transition-all duration-500 h-full cursor-pointer p-6'
    },
    {
      icon: Dice6,
      title: 'Digital Dice Roller',
      description: 'Complete set of D&D dice (D4, D6, D8, D10, D12, D20, D00) with animated rolls and history tracking.',
      link: '/dice-roller',
      color: 'card-3d hover:scale-105 transition-all duration-500 h-full cursor-pointer p-6'
    },
    {
      icon: Sword,
      title: 'AI Dungeon Master',
      description: 'Experience immersive storytelling with an AI DM that adapts to your choices and manages complex campaigns.',
      link: '/game-session',
      color: 'card-3d hover:scale-105 transition-all duration-500 h-full cursor-pointer p-6'
    }
  ]

  const diceTypes = [
    { sides: 4, name: 'D4', use: 'Minor spells, small weapons', color: '#10B981' },
    { sides: 6, name: 'D6', use: 'Damage, stats, sneak attacks', color: '#3B82F6' },
    { sides: 8, name: 'D8', use: 'Medium weapons, spells', color: '#8B5CF6' },
    { sides: 10, name: 'D10', use: 'Heavy damage, percentiles', color: '#F59E0B' },
    { sides: 12, name: 'D12', use: 'Great weapons, hit points', color: '#EF4444' },
    { sides: 20, name: 'D20', use: 'Attacks, saves, skill checks', color: '#DAA520' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="floating"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Sparkles className="h-16 w-16 text-yellow-400 mr-4 glow-text" />
            </motion.div>
            <h1 className="text-6xl font-bold fantasy-title glow-text">
              D&D AI Master
            </h1>
          </div>
          
          <p className="text-xl text-yellow-200 mb-8 max-w-2xl mx-auto">
            Experience the magic of Dungeons & Dragons with our comprehensive AI-powered platform. 
            Create characters, roll dice, and embark on epic adventures guided by an intelligent Dungeon Master.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/character-creator">
              <button className="btn-3d text-lg px-8 py-3 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Create Character
              </button>
            </Link>
            <Link to="/game-session">
              <button className="btn-3d text-lg px-8 py-3 flex items-center" style={{
                background: 'linear-gradient(145deg, #8B2F2F 0%, #A94444 50%, #8B2F2F 100%)',
                borderColor: '#8B2F2F',
                color: '#FFE4B5'
              }}>
                <Sword className="mr-2 h-5 w-5" />
                Start Adventure
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-yellow-300 mb-4 glow-text" style={{ fontFamily: 'Cinzel, serif' }}>
              Everything You Need for D&D
            </h2>
            <p className="text-yellow-200 text-lg max-w-2xl mx-auto">
              Our platform combines traditional D&D mechanics with modern AI technology to create 
              the ultimate tabletop RPG experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 perspective-container">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ rotateY: 5 }}
                >
                  <Link to={feature.link}>
                    <div className="card-3d h-full cursor-pointer p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Icon className="h-8 w-8 text-yellow-400 glow-text" />
                        <span className="text-xl font-bold text-yellow-300 glow-text" style={{ fontFamily: 'Cinzel, serif' }}>{feature.title}</span>
                      </div>
                      <div className="text-yellow-200 text-base">
                        {feature.description}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Dice Overview Section */}
      <section className="py-20 px-4">
        <div className="glassmorphism rounded-3xl p-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              className="floating"
              whileHover={{ scale: 1.1 }}
            >
              <Book className="h-12 w-12 text-yellow-400 mx-auto mb-4 glow-text" />
            </motion.div>
            <h2 className="text-4xl font-bold text-yellow-300 mb-4 glow-text" style={{ fontFamily: 'Cinzel, serif' }}>
              Master the Dice
            </h2>
            <p className="text-yellow-200 text-lg max-w-2xl mx-auto">
              Understand each die's role in your D&D adventures. From skill checks to damage rolls, 
              every die has its purpose.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {diceTypes.map((die, index) => (
              <motion.div
                key={die.name}
                initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div 
                  className="dice-3d p-6 mb-4 cursor-pointer floating"
                  style={{
                    '--dice-color': die.color,
                    '--dice-color-dark': die.color + 'CC'
                  } as React.CSSProperties}
                >
                  <div className="text-3xl font-bold text-white mb-2 glow-text">{die.name}</div>
                  <div className="text-sm text-white/80">{die.sides} sides</div>
                </div>
                <p className="text-xs text-yellow-200">{die.use}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/dice-roller">
              <button className="btn-3d px-12 py-4 text-lg flex items-center mx-auto">
                <Dice6 className="mr-2 h-5 w-5" />
                Try the Dice Roller
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            className="floating"
            whileHover={{ scale: 1.1 }}
          >
            <Shield className="h-16 w-16 text-yellow-400 mx-auto mb-6 glow-text" />
          </motion.div>
          <h2 className="text-4xl font-bold text-yellow-300 mb-6 glow-text" style={{ fontFamily: 'Cinzel, serif' }}>
            Ready to Begin Your Quest?
          </h2>
          <p className="text-xl text-yellow-200 mb-8">
            Join thousands of adventurers who have discovered the future of tabletop gaming. 
            Create your character and let the AI guide your destiny.
          </p>
          <Link to="/character-creator">
            <button className="btn-3d px-12 py-4 text-lg">
              Start Your Adventure
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage