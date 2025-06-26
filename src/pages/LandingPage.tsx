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
      color: 'card-medieval hover:scale-105 transition-all duration-300 h-full cursor-pointer p-6'
    },
    {
      icon: Dice6,
      title: 'Digital Dice Roller',
      description: 'Complete set of D&D dice (D4, D6, D8, D10, D12, D20, D00) with animated rolls and history tracking.',
      link: '/dice-roller',
      color: 'card-medieval hover:scale-105 transition-all duration-300 h-full cursor-pointer p-6'
    },
    {
      icon: Sword,
      title: 'AI Dungeon Master',
      description: 'Experience immersive storytelling with an AI DM that adapts to your choices and manages complex campaigns.',
      link: '/game-session',
      color: 'card-medieval hover:scale-105 transition-all duration-300 h-full cursor-pointer p-6'
    }
  ]

  const diceTypes = [
    { sides: 4, name: 'D4', use: 'Minor spells, small weapons' },
    { sides: 6, name: 'D6', use: 'Damage, stats, sneak attacks' },
    { sides: 8, name: 'D8', use: 'Medium weapons, spells' },
    { sides: 10, name: 'D10', use: 'Heavy damage, percentiles' },
    { sides: 12, name: 'D12', use: 'Great weapons, hit points' },
    { sides: 20, name: 'D20', use: 'Attacks, saves, skill checks' },
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
            <Sparkles className="h-16 w-16 text-yellow-700 mr-4" />
            <h1 className="text-6xl font-bold fantasy-title">
              D&D AI Master
            </h1>
          </div>
          
          <p className="text-xl text-yellow-900 mb-8 max-w-2xl mx-auto">
            Experience the magic of Dungeons & Dragons with our comprehensive AI-powered platform. 
            Create characters, roll dice, and embark on epic adventures guided by an intelligent Dungeon Master.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/character-creator">
              <button className="btn-medieval text-lg px-8 py-3">
                <Users className="mr-2 h-5 w-5 text-yellow-700" />
                Create Character
              </button>
            </Link>
            <Link to="/game-session">
              <button className="btn-medieval text-lg px-8 py-3 bg-[#8b2f2f] border-[#8b2f2f] hover:bg-[#a94444] ml-0 sm:ml-2">
                <Sword className="mr-2 h-5 w-5 text-yellow-700" />
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
            <h2 className="text-4xl font-bold text-yellow-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Everything You Need for D&D
            </h2>
            <p className="text-yellow-900 text-lg max-w-2xl mx-auto">
              Our platform combines traditional D&D mechanics with modern AI technology to create 
              the ultimate tabletop RPG experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Link to={feature.link}>
                    <div className="card-medieval hover:scale-105 transition-all duration-300 h-full cursor-pointer p-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="h-8 w-8 text-yellow-700" />
                        <span className="text-xl font-bold text-yellow-900" style={{ fontFamily: 'Cinzel, serif' }}>{feature.title}</span>
                      </div>
                      <div className="text-yellow-900 text-base mb-2">
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
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Book className="h-12 w-12 text-yellow-700 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-yellow-900 mb-4" style={{ fontFamily: 'Cinzel, serif' }}>
              Master the Dice
            </h2>
            <p className="text-yellow-900 text-lg max-w-2xl mx-auto">
              Understand each die's role in your D&D adventures. From skill checks to damage rolls, 
              every die has its purpose.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {diceTypes.map((die, index) => (
              <motion.div
                key={die.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-xl p-6 mb-4 hover:scale-110 transition-transform duration-300 border-2 border-yellow-700">
                  <div className="text-3xl font-bold text-yellow-900 mb-2">{die.name}</div>
                  <div className="text-sm text-yellow-800">{die.sides} sides</div>
                </div>
                <p className="text-xs text-yellow-900">{die.use}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/dice-roller">
              <button className="btn-medieval px-12 py-4 text-lg">
                <Dice6 className="mr-2 h-5 w-5 text-yellow-700" />
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
          <Shield className="h-16 w-16 text-yellow-700 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-yellow-900 mb-6" style={{ fontFamily: 'Cinzel, serif' }}>
            Ready to Begin Your Quest?
          </h2>
          <p className="text-xl text-yellow-900 mb-8">
            Join thousands of adventurers who have discovered the future of tabletop gaming. 
            Create your character and let the AI guide your destiny.
          </p>
          <Link to="/character-creator">
            <button className="btn-medieval px-12 py-4 text-lg">
              Start Your Adventure
            </button>
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage