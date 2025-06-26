import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dice6, History, Trash2, Download } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
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
    { sides: 4, name: 'D4', color: 'bg-emerald-500', description: 'Minor spells, dagger damage' },
    { sides: 6, name: 'D6', color: 'bg-blue-500', description: 'Shortsword, sneak attack' },
    { sides: 8, name: 'D8', color: 'bg-purple-500', description: 'Longsword, rapier damage' },
    { sides: 10, name: 'D10', color: 'bg-orange-500', description: 'Heavy crossbow, glaive' },
    { sides: 12, name: 'D12', color: 'bg-red-500', description: 'Greataxe, barbarian hit die' },
    { sides: 20, name: 'D20', color: 'bg-gold-500', description: 'Attack rolls, saving throws' },
    { sides: 100, name: 'D100', color: 'bg-pink-500', description: 'Percentile rolls' }
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
    const match = diceString.match(/(\d+)?d(\d+)([+-]\d+)?/)
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
    return dice?.color || 'bg-gray-500'
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
          <Dice6 className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Digital Dice Roller</h1>
          <p className="text-gray-400 text-lg">
            Roll all your D&D dice with realistic animations and automatic calculations
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Dice Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Dice */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Quick Roll</CardTitle>
                <CardDescription className="text-gray-400">
                  Click any die to roll it instantly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {diceTypes.map((die) => (
                    <motion.button
                      key={die.sides}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => rollDice(die.sides)}
                      disabled={isRolling}
                      className={`${die.color} rounded-xl p-4 text-white font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
                    >
                      <div className="text-2xl mb-1">{die.name}</div>
                      <div className="text-xs opacity-80">{die.description}</div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Advanced Rolling */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Advanced Rolling</CardTitle>
                <CardDescription className="text-gray-400">
                  Roll multiple dice with modifiers and descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="dice-notation" className="text-gray-300">Dice Notation</Label>
                    <Input
                      id="dice-notation"
                      placeholder="e.g., 2d6+3, 1d20"
                      className="bg-black/30 border-purple-500/30 text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          rollMultiple(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="modifier" className="text-gray-300">Modifier</Label>
                    <Input
                      id="modifier"
                      type="number"
                      value={modifier}
                      onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Input
                      id="description"
                      placeholder="Attack roll, save, etc."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="bg-black/30 border-purple-500/30 text-white"
                    />
                  </div>
                </div>

                {/* Common Rolls */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('1d20')}
                    className="border-purple-500/30 text-purple-300"
                  >
                    Attack Roll (1d20)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('4d6')}
                    className="border-purple-500/30 text-purple-300"
                  >
                    Ability Score (4d6)
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => rollMultiple('2d6')}
                    className="border-purple-500/30 text-purple-300"
                  >
                    Advantage (2d20)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Current Roll Display */}
            <AnimatePresence>
              {(currentRoll || isRolling) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-400/50">
                    <CardHeader>
                      <CardTitle className="text-white text-center">
                        {isRolling ? 'Rolling...' : 'Last Roll'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      {isRolling ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mx-auto w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center"
                        >
                          <Dice6 className="h-8 w-8 text-white" />
                        </motion.div>
                      ) : currentRoll && (
                        <div>
                          <div className="text-6xl font-bold text-white mb-4">
                            {currentRoll.total}
                          </div>
                          <div className="space-y-2">
                            <Badge variant="secondary" className="text-lg px-4 py-1">
                              {currentRoll.dice}
                            </Badge>
                            {currentRoll.rolls.length > 1 && (
                              <div className="text-gray-300">
                                Individual rolls: [{currentRoll.rolls.join(', ')}]
                              </div>
                            )}
                            {currentRoll.modifier !== 0 && (
                              <div className="text-gray-300">
                                Modifier: {currentRoll.modifier >= 0 ? '+' : ''}{currentRoll.modifier}
                              </div>
                            )}
                            {currentRoll.description && (
                              <div className="text-purple-300 font-medium">
                                {currentRoll.description}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Roll History */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <History className="h-5 w-5 text-purple-400" />
                    <CardTitle className="text-white">Roll History</CardTitle>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={exportHistory}
                      disabled={rollHistory.length === 0}
                      className="text-purple-400 hover:bg-purple-600/20"
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
                <CardDescription className="text-gray-400">
                  {rollHistory.length} rolls recorded
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-2">
                    {rollHistory.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        No rolls yet. Roll some dice to see history!
                      </div>
                    ) : (
                      rollHistory.map((roll) => (
                        <motion.div
                          key={roll.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/20"
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${getDiceColor(parseInt(roll.dice.split('d')[1]))} rounded flex items-center justify-center text-white text-xs font-bold`}>
                              {roll.dice}
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {roll.total}
                              </div>
                              <div className="text-xs text-gray-400">
                                {formatTime(roll.timestamp)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {roll.rolls.length > 1 && (
                              <div className="text-xs text-gray-400">
                                [{roll.rolls.join(', ')}]
                              </div>
                            )}
                            {roll.description && (
                              <div className="text-xs text-purple-300">
                                {roll.description}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiceRoller