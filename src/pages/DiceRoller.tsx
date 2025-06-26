import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice6, History, Trash2, Download } from 'lucide-react'
import { Button } from '../components/ui/button'

import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Badge } from '../components/ui/badge'
import { ScrollArea } from '../components/ui/scroll-area'
import { toast } from 'sonner'

interface RollResult {
  id: number
  timestamp: Date
  dice: string
  rolls: number[]
  total: number
  modifier: number
  description?: string
}

const DiceRoller = () => {
  const [rollHistory, setRollHistory] = useState<RollResult[]>([])
  const [currentRoll, setCurrentRoll] = useState<RollResult | null>(null)
  const [modifier, setModifier] = useState(0)
  const [description, setDescription] = useState('')
  const [isRolling, setIsRolling] = useState(false)

  const diceTypes = [
    { sides: 4, name: 'D4', color: '#10B981', bgClass: 'dice-3d', description: 'Minor spells, dagger damage' },
    { sides: 6, name: 'D6', color: '#3B82F6', bgClass: 'dice-3d', description: 'Shortsword, sneak attack' },
    { sides: 8, name: 'D8', color: '#8B5CF6', bgClass: 'dice-3d', description: 'Longsword, rapier damage' },
    { sides: 10, name: 'D10', color: '#F59E0B', bgClass: 'dice-3d', description: 'Heavy crossbow, glaive' },
    { sides: 12, name: 'D12', color: '#EF4444', bgClass: 'dice-3d', description: 'Greataxe, barbarian hit die' },
    { sides: 20, name: 'D20', color: '#DAA520', bgClass: 'dice-3d', description: 'Attack rolls, saving throws' },
    { sides: 100, name: 'D100', color: '#EC4899', bgClass: 'dice-3d', description: 'Percentile rolls' }
  ]

  const rollDice = (sides: number, count: number = 1) => {
    setIsRolling(true)
    
    // Simulate rolling animation delay
    setTimeout(() => {
      const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1)
      const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier
      
      const result: RollResult = {
        id: Date.now(),
        timestamp: new Date(),
        dice: count > 1 ? `${count}d${sides}` : `d${sides}`,
        rolls,
        total,
        modifier,
        description: description || undefined
      }
      
      setCurrentRoll(result)
      setRollHistory(prev => [result, ...prev])
      setIsRolling(false)
      
      // Show result toast
      const rollText = rolls.length > 1 ? `[${rolls.join(', ')}]` : rolls[0].toString()
      const modText = modifier !== 0 ? ` ${modifier >= 0 ? '+' : ''}${modifier}` : ''
      toast.success(`${result.dice}: ${rollText}${modText} = ${total}`)
    }, 1000)
  }

  const rollMultiple = (diceString: string) => {
    // Parse dice notation like "2d6+3" or "1d20"
    const match = diceString.match(/(\\d+)?d(\\d+)([+-]\\d+)?/)
    if (!match) {
      toast.error('Invalid dice format! Use format like "2d6" or "1d20+3"')
      return
    }
    
    const count = parseInt(match[1] || '1')
    const sides = parseInt(match[2])
    const mod = parseInt(match[3] || '0')
    
    setModifier(mod)
    rollDice(sides, count)
  }

  const clearHistory = () => {
    setRollHistory([])
    setCurrentRoll(null)
    toast.success('Roll history cleared')
  }

  const exportHistory = () => {
    const data = JSON.stringify(rollHistory, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dice-roll-history.json'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Roll history exported')
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getDiceColor = (sides: number) => {
    const dice = diceTypes.find(d => d.sides === sides)
    return dice?.color || '#8B5CF6'
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div
            className="floating"
            whileHover={{ scale: 1.1 }}
          >
            <Dice6 className="h-16 w-16 text-yellow-400 mx-auto mb-4 glow-text" />
          </motion.div>
          <h1 className="text-4xl font-bold text-yellow-300 mb-4 glow-text">Digital Dice Roller</h1>
          <p className="text-yellow-200 text-lg">
            Roll all your D&D dice with realistic animations and automatic calculations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dice Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Dice */}
            <div className="card-3d">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight text-yellow-300 glow-text">Quick Roll</h3>
                <p className="text-sm text-yellow-200">
                  Click any die to roll it instantly
                </p>
              </div>
              <div className="p-6 pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {diceTypes.map((die) => (
                    <motion.button
                      key={die.sides}
                      whileHover={{ scale: 1.05, rotateY: 15 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => rollDice(die.sides)}
                      disabled={isRolling}
                      className="dice-3d p-4 text-white font-bold text-lg disabled:opacity-50 cursor-pointer"
                      style={{
                        '--dice-color': die.color,
                        '--dice-color-dark': die.color + 'CC'
                      } as React.CSSProperties}
                    >
                      <div className="text-2xl mb-1 glow-text">{die.name}</div>
                      <div className="text-xs opacity-80">{die.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Rolling */}
            <div className="card-3d">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="font-semibold leading-none tracking-tight text-yellow-300 glow-text">Advanced Rolling</h3>
                <p className="text-sm text-yellow-200">
                  Roll multiple dice with modifiers and descriptions
                </p>
              </div>
              <div className="p-6 pt-0 space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dice-notation" className="text-yellow-300">Dice Notation</Label>
                    <Input
                      id="dice-notation"
                      placeholder="e.g., 2d6+3, 1d20"
                      className="glassmorphism border-yellow-600/30 text-yellow-100 placeholder:text-yellow-300/50"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          rollMultiple(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modifier" className="text-yellow-300">Modifier</Label>
                    <Input
                      id="modifier"
                      type="number"
                      value={modifier}
                      onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                      className="glassmorphism border-yellow-600/30 text-yellow-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-yellow-300">Description</Label>
                    <Input
                      id="description"
                      placeholder="Attack roll, save, etc."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="glassmorphism border-yellow-600/30 text-yellow-100 placeholder:text-yellow-300/50"
                    />
                  </div>
                </div>

                {/* Common Rolls */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('1d20')}
                    className="glassmorphism border-yellow-600/30 text-yellow-300 hover:bg-yellow-600/10"
                  >
                    Attack Roll (1d20)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('4d6')}
                    className="glassmorphism border-yellow-600/30 text-yellow-300 hover:bg-yellow-600/10"
                  >
                    Ability Score (4d6)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('2d20')}
                    className="glassmorphism border-yellow-600/30 text-yellow-300 hover:bg-yellow-600/10"
                  >
                    Advantage (2d20)
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Roll Display */}
            <AnimatePresence>
              {(currentRoll || isRolling) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, rotateX: -30 }}
                  animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateX: 30 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="card-3d" style={{
                    background: 'linear-gradient(145deg, rgba(218, 165, 32, 0.1) 0%, rgba(139, 69, 19, 0.1) 100%)',
                    borderColor: 'rgba(218, 165, 32, 0.4)'
                  }}>
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="font-semibold leading-none tracking-tight text-yellow-300 text-center glow-text">
                        {isRolling ? 'Rolling...' : 'Last Roll'}
                      </h3>
                    </div>
                    <div className="p-6 pt-0 text-center">
                      {isRolling ? (
                        <motion.div
                          className="mx-auto w-16 h-16 dice-3d dice-rolling flex items-center justify-center"
                          style={{
                            '--dice-color': '#8B5CF6',
                            '--dice-color-dark': '#7C3AED'
                          } as React.CSSProperties}
                        >
                          <Dice6 className="h-8 w-8 text-white glow-text" />
                        </motion.div>
                      ) : currentRoll && (
                        <div>
                          <div className="text-6xl font-bold text-yellow-300 mb-4 glow-text">
                            {currentRoll.total}
                          </div>
                          <div className="space-y-2">
                            <Badge variant="secondary" className="text-lg px-4 py-1 glassmorphism border-yellow-600/30 text-yellow-300">
                              {currentRoll.dice}
                            </Badge>
                            {currentRoll.rolls.length > 1 && (
                              <div className="text-yellow-200">
                                Individual rolls: [{currentRoll.rolls.join(', ')}]
                              </div>
                            )}
                            {currentRoll.modifier !== 0 && (
                              <div className="text-yellow-200">
                                Modifier: {currentRoll.modifier >= 0 ? '+' : ''}{currentRoll.modifier}
                              </div>
                            )}
                            {currentRoll.description && (
                              <div className="text-yellow-400 font-medium glow-text">
                                {currentRoll.description}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Roll History */}
          <div className="space-y-6">
            <div className="card-3d">
              <div className="flex flex-col space-y-1.5 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-yellow-400 glow-text" />
                    <h3 className="font-semibold leading-none tracking-tight text-yellow-300 glow-text">Roll History</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={exportHistory}
                      disabled={rollHistory.length === 0}
                      className="text-yellow-400 hover:bg-yellow-600/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={clearHistory}
                      disabled={rollHistory.length === 0}
                      className="text-red-400 hover:bg-red-600/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-yellow-200">
                  {rollHistory.length} rolls recorded
                </p>
              </div>
              <div className="p-6 pt-0">
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {rollHistory.length === 0 ? (
                      <div className="text-center text-yellow-300/50 py-8">
                        No rolls yet. Roll some dice to see history!
                      </div>
                    ) : (
                      rollHistory.map((roll) => (
                        <motion.div
                          key={roll.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 glassmorphism rounded-lg border border-yellow-600/20"
                        >
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-8 h-8 dice-3d rounded flex items-center justify-center text-white text-xs font-bold"
                              style={{
                                '--dice-color': getDiceColor(parseInt(roll.dice.split('d')[1])),
                                '--dice-color-dark': getDiceColor(parseInt(roll.dice.split('d')[1])) + 'CC'
                              } as React.CSSProperties}
                            >
                              {roll.dice}
                            </div>
                            <div>
                              <div className="text-yellow-300 font-medium glow-text">
                                {roll.total}
                              </div>
                              <div className="text-xs text-yellow-200/70">
                                {formatTime(roll.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {roll.rolls.length > 1 && (
                              <div className="text-xs text-yellow-200/70">
                                [{roll.rolls.join(', ')}]
                              </div>
                            )}
                            {roll.description && (
                              <div className="text-xs text-yellow-400">
                                {roll.description}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiceRoller