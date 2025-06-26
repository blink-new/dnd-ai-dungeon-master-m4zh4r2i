import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword, Send, Dice6, User, Bot, Scroll, Shield, Heart, Zap } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { ScrollArea } from '../components/ui/scroll-area'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { toast } from 'sonner'

interface GameMessage {
  id: number
  type: 'dm' | 'player' | 'system' | 'dice'
  content: string
  timestamp: Date
  diceRoll?: {
    dice: string
    result: number
    description: string
  }
}

interface CharacterStats {
  name: string
  level: number
  hitPoints: { current: number; max: number }
  armorClass: number
  initiative: number
  stats: {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
  }
}

const GameSession = () => {
  const [messages, setMessages] = useState<GameMessage[]>([
    {
      id: 1,
      type: 'dm',
      content: 'Welcome, brave adventurer! You find yourself standing at the entrance of a mysterious dungeon. The ancient stone archway is covered in glowing runes, and you can hear the faint sound of water dripping in the distance. What would you like to do?',
      timestamp: new Date()
    }
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  const [character] = useState<CharacterStats>({
    name: 'Adventurer',
    level: 1,
    hitPoints: { current: 12, max: 12 },
    armorClass: 14,
    initiative: 2,
    stats: {
      strength: 14,
      dexterity: 16,
      constitution: 13,
      intelligence: 12,
      wisdom: 15,
      charisma: 10
    }
  })

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const rollDice = (sides: number) => {
    return Math.floor(Math.random() * sides) + 1
  }

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2)
  }

  const generateDMResponse = async (playerAction: string) => {
    setIsThinking(true)
    
    // Simulate AI thinking time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000))
    
    // Simple AI responses based on keywords
    const responses = {
      enter: [
        "You step through the archway and enter a dimly lit corridor. The walls are lined with ancient torches that flicker with an eerie blue flame. You notice several passages branching off from this main hallway.",
        "As you cross the threshold, you feel a chill run down your spine. The dungeon seems to whisper secrets of ages past. To your left, you see a wooden door slightly ajar. To your right, stairs descend into darkness."
      ],
      look: [
        "You carefully examine your surroundings. The stone walls show signs of great age, with moss and strange fungi growing in the cracks. You notice fresh scratches on the floor - something large has passed through here recently.",
        "Your keen eyes spot something glinting in the shadows. Upon closer inspection, you find a rusty key half-buried under some debris. It might be useful later."
      ],
      attack: [
        "Roll a d20 for your attack roll! You draw your weapon and prepare to strike.",
        "You swing your weapon with determination. Roll for initiative to see who acts first in combat!"
      ],
      search: [
        "You search the area thoroughly. Make a Perception check (Wisdom + d20) to see what you might find.",
        "Your search reveals something interesting. Roll a d20 to determine what you discover in the shadows."
      ],
      door: [
        "You approach the wooden door. It appears to be unlocked, but you can hear strange sounds coming from the other side. Do you wish to open it?",
        "The door creaks ominously as you examine it. Make a Perception check to listen for what might be beyond."
      ],
      default: [
        "Interesting choice! The dungeon responds to your actions in unexpected ways. What happens next depends on the roll of the dice...",
        "Your action echoes through the ancient halls. The very stones seem to watch your every move.",
        "The dungeon master considers your bold action. Roll a d20 to see how fate responds to your decision!"
      ]
    }
    
    // Determine response type
    let responseType = 'default'
    const action = playerAction.toLowerCase()
    
    if (action.includes('enter') || action.includes('go')) responseType = 'enter'
    else if (action.includes('look') || action.includes('examine')) responseType = 'look'
    else if (action.includes('attack') || action.includes('fight')) responseType = 'attack'
    else if (action.includes('search') || action.includes('find')) responseType = 'search'
    else if (action.includes('door') || action.includes('open')) responseType = 'door'
    
    const possibleResponses = responses[responseType as keyof typeof responses]
    const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)]
    
    setIsThinking(false)
    return response
  }

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return
    
    const playerMessage: GameMessage = {
      id: Date.now(),
      type: 'player',
      content: currentInput,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, playerMessage])
    const playerAction = currentInput
    setCurrentInput('')
    
    // Generate DM response
    const dmResponse = await generateDMResponse(playerAction)
    
    const dmMessage: GameMessage = {
      id: Date.now() + 1,
      type: 'dm',
      content: dmResponse,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, dmMessage])
  }

  const handleDiceRoll = (sides: number, description: string) => {
    const result = rollDice(sides)
    const diceMessage: GameMessage = {
      id: Date.now(),
      type: 'dice',
      content: `Rolled a d${sides} for ${description}`,
      timestamp: new Date(),
      diceRoll: {
        dice: `d${sides}`,
        result,
        description
      }
    }
    
    setMessages(prev => [...prev, diceMessage])
    toast.success(`${description}: ${result}`)
    
    // Generate DM response to dice roll
    setTimeout(async () => {
      let response = ''
      if (sides === 20) {
        if (result >= 18) response = `Excellent! Your ${description} is a great success with a roll of ${result}!`
        else if (result >= 12) response = `Your ${description} succeeds with a roll of ${result}.`
        else if (result >= 8) response = `Your ${description} partially succeeds with a roll of ${result}.`
        else response = `Unfortunately, your ${description} fails with a roll of ${result}. But the adventure continues...`
      } else {
        response = `You rolled ${result} on the d${sides} for ${description}. The outcome shapes your story...`
      }
      
      const dmMessage: GameMessage = {
        id: Date.now(),
        type: 'dm',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, dmMessage])
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Sword className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Game Session</h1>
          <p className="text-gray-400 text-lg">
            Embark on epic adventures guided by your AI Dungeon Master
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Character Panel */}
          <div className="space-y-4">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {character.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Level {character.level} Adventurer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 flex items-center">
                      <Heart className="mr-1 h-4 w-4 text-red-400" />
                      Hit Points
                    </span>
                    <span className="text-white text-sm">
                      {character.hitPoints.current}/{character.hitPoints.max}
                    </span>
                  </div>
                  <Progress 
                    value={(character.hitPoints.current / character.hitPoints.max) * 100} 
                    className="h-2"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Shield className="mr-1 h-4 w-4 text-blue-400" />
                    Armor Class
                  </span>
                  <Badge variant="secondary">{character.armorClass}</Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center">
                    <Zap className="mr-1 h-4 w-4 text-yellow-400" />
                    Initiative
                  </span>
                  <Badge variant="secondary">+{character.initiative}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDiceRoll(20, 'Attack Roll')}
                  className="w-full border-red-500/30 text-red-300 hover:bg-red-600/20"
                >
                  <Dice6 className="mr-2 h-4 w-4" />
                  Attack (d20)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDiceRoll(20, 'Saving Throw')}
                  className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-600/20"
                >
                  <Dice6 className="mr-2 h-4 w-4" />
                  Save (d20)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDiceRoll(20, 'Skill Check')}
                  className="w-full border-green-500/30 text-green-300 hover:bg-green-600/20"
                >
                  <Dice6 className="mr-2 h-4 w-4" />
                  Skill (d20)
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDiceRoll(6, 'Damage Roll')}
                  className="w-full border-orange-500/30 text-orange-300 hover:bg-orange-600/20"
                >
                  <Dice6 className="mr-2 h-4 w-4" />
                  Damage (d6)
                </Button>
              </CardContent>
            </Card>

            {/* Ability Scores */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white text-sm">Ability Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <div key={stat} className="flex justify-between">
                      <span className="text-gray-400 capitalize">{stat.slice(0, 3)}</span>
                      <span className="text-white">
                        {value} ({getModifier(value) >= 0 ? '+' : ''}{getModifier(value)})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-purple-500/30 h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Scroll className="mr-2 h-5 w-5" />
                  Adventure Log
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.type === 'player' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'dm' ? 'bg-purple-900/50 border border-purple-500/30' :
                          message.type === 'player' ? 'bg-blue-900/50 border border-blue-500/30' :
                          message.type === 'dice' ? 'bg-green-900/50 border border-green-500/30' :
                          'bg-gray-900/50 border border-gray-500/30'
                        }`}>
                          <div className="flex items-center mb-2">
                            {message.type === 'dm' && <Bot className="mr-2 h-4 w-4 text-purple-400" />}
                            {message.type === 'player' && <User className="mr-2 h-4 w-4 text-blue-400" />}
                            {message.type === 'dice' && <Dice6 className="mr-2 h-4 w-4 text-green-400" />}
                            <span className="text-sm font-medium text-white">
                              {message.type === 'dm' ? 'Dungeon Master' :
                               message.type === 'player' ? character.name :
                               message.type === 'dice' ? 'Dice Roll' : 'System'}
                            </span>
                            <span className="ml-auto text-xs text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-gray-200 text-sm leading-relaxed">
                            {message.content}
                          </p>
                          
                          {message.diceRoll && (
                            <div className="mt-3 p-3 bg-black/30 rounded-lg">
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                                  {message.diceRoll.dice}
                                </Badge>
                                <span className="text-2xl font-bold text-white">
                                  {message.diceRoll.result}
                                </span>
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {message.diceRoll.description}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                    
                    {/* Thinking indicator */}
                    <AnimatePresence>
                      {isThinking && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex justify-start"
                        >
                          <div className="bg-purple-900/50 border border-purple-500/30 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Bot className="mr-2 h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium text-white">Dungeon Master</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-400">The DM is thinking...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="border-t border-purple-500/20 p-4">
                  <div className="flex space-x-2">
                    <Input
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                      placeholder="Describe your action..."
                      className="bg-black/30 border-purple-500/30 text-white"
                      disabled={isThinking}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!currentInput.trim() || isThinking}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Press Enter to send, or try typing "enter dungeon", "look around", "attack", or "search room"
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameSession