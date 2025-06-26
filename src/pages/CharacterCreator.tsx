import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Dice6, Save, Shuffle } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { toast } from 'sonner'

const CharacterCreator = () => {
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    class: '',
    background: '',
    level: 1,
    stats: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    hitPoints: 8,
    armorClass: 10,
    backstory: ''
  })

  const races = [
    { name: 'Human', bonus: '+1 to all stats', description: 'Versatile and ambitious' },
    { name: 'Elf', bonus: '+2 DEX', description: 'Graceful and magical' },
    { name: 'Dwarf', bonus: '+2 CON', description: 'Hardy and resilient' },
    { name: 'Halfling', bonus: '+2 DEX', description: 'Small but brave' },
    { name: 'Dragonborn', bonus: '+2 STR, +1 CHA', description: 'Draconic heritage' },
    { name: 'Gnome', bonus: '+2 INT', description: 'Small and clever' },
    { name: 'Half-Elf', bonus: '+2 CHA, +1 to two others', description: 'Between two worlds' },
    { name: 'Half-Orc', bonus: '+2 STR, +1 CON', description: 'Fierce and strong' },
    { name: 'Tiefling', bonus: '+2 CHA, +1 INT', description: 'Infernal heritage' }
  ]

  const classes = [
    { name: 'Fighter', hitDie: 10, primary: 'STR/DEX', description: 'Master of weapons and armor' },
    { name: 'Wizard', hitDie: 6, primary: 'INT', description: 'Wielder of arcane magic' },
    { name: 'Rogue', hitDie: 8, primary: 'DEX', description: 'Stealthy and skilled' },
    { name: 'Cleric', hitDie: 8, primary: 'WIS', description: 'Divine spellcaster' },
    { name: 'Ranger', hitDie: 10, primary: 'DEX/WIS', description: 'Nature warrior' },
    { name: 'Paladin', hitDie: 10, primary: 'STR/CHA', description: 'Holy warrior' },
    { name: 'Barbarian', hitDie: 12, primary: 'STR', description: 'Primal warrior' },
    { name: 'Bard', hitDie: 8, primary: 'CHA', description: 'Jack of all trades' },
    { name: 'Sorcerer', hitDie: 6, primary: 'CHA', description: 'Innate magic user' },
    { name: 'Warlock', hitDie: 8, primary: 'CHA', description: 'Pact magic wielder' }
  ]

  const backgrounds = [
    'Acolyte', 'Criminal', 'Folk Hero', 'Noble', 'Sage', 'Soldier', 
    'Charlatan', 'Entertainer', 'Guild Artisan', 'Hermit', 'Outlander', 'Sailor'
  ]

  const rollStat = () => {
    // Roll 4d6, drop lowest
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1)
    rolls.sort((a, b) => b - a)
    return rolls.slice(0, 3).reduce((sum, roll) => sum + roll, 0)
  }

  const rollAllStats = () => {
    const newStats = {
      strength: rollStat(),
      dexterity: rollStat(),
      constitution: rollStat(),
      intelligence: rollStat(),
      wisdom: rollStat(),
      charisma: rollStat()
    }
    setCharacter(prev => ({ ...prev, stats: newStats }))
    toast.success('Stats rolled! Click individual stats to reroll.')
  }

  const rollIndividualStat = (statName: keyof typeof character.stats) => {
    const newValue = rollStat()
    setCharacter(prev => ({
      ...prev,
      stats: { ...prev.stats, [statName]: newValue }
    }))
    toast.success(`${statName.charAt(0).toUpperCase() + statName.slice(1)}: ${newValue}`)
  }

  const getModifier = (score: number) => {
    return Math.floor((score - 10) / 2)
  }

  const saveCharacter = () => {
    if (!character.name || !character.race || !character.class) {
      toast.error('Please fill in name, race, and class!')
      return
    }
    
    const characters = JSON.parse(localStorage.getItem('dnd-characters') || '[]')
    characters.push({ ...character, id: Date.now() })
    localStorage.setItem('dnd-characters', JSON.stringify(characters))
    toast.success(`${character.name} saved successfully!`)
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
          <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Character Creator</h1>
          <p className="text-gray-400 text-lg">
            Build your perfect D&D character with our comprehensive creation tool
          </p>
        </motion.div>

        <Tabs defaultValue="basics" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-black/30">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="stats">Ability Scores</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="basics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Character Name</Label>
                    <Input
                      id="name"
                      value={character.name}
                      onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-black/30 border-purple-500/30 text-white"
                      placeholder="Enter character name..."
                    />
                  </div>
                  
                  <div>
                    <Label className="text-gray-300">Race</Label>
                    <Select value={character.race} onValueChange={(value) => setCharacter(prev => ({ ...prev, race: value }))}>
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select a race" />
                      </SelectTrigger>
                      <SelectContent>
                        {races.map((race) => (
                          <SelectItem key={race.name} value={race.name}>
                            <div>
                              <div className="font-medium">{race.name}</div>
                              <div className="text-sm text-gray-500">{race.bonus}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Class</Label>
                    <Select value={character.class} onValueChange={(value) => setCharacter(prev => ({ ...prev, class: value }))}>
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.name} value={cls.name}>
                            <div>
                              <div className="font-medium">{cls.name}</div>
                              <div className="text-sm text-gray-500">HD: d{cls.hitDie}, Primary: {cls.primary}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-300">Background</Label>
                    <Select value={character.background} onValueChange={(value) => setCharacter(prev => ({ ...prev, background: value }))}>
                      <SelectTrigger className="bg-black/30 border-purple-500/30 text-white">
                        <SelectValue placeholder="Select a background" />
                      </SelectTrigger>
                      <SelectContent>
                        {backgrounds.map((bg) => (
                          <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white">Race & Class Info</CardTitle>
                </CardHeader>
                <CardContent>
                  {character.race && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-purple-400 mb-2">{character.race}</h4>
                      <p className="text-sm text-gray-300">
                        {races.find(r => r.name === character.race)?.description}
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {races.find(r => r.name === character.race)?.bonus}
                      </Badge>
                    </div>
                  )}
                  
                  {character.class && (
                    <div>
                      <h4 className="font-semibold text-purple-400 mb-2">{character.class}</h4>
                      <p className="text-sm text-gray-300">
                        {classes.find(c => c.name === character.class)?.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">
                          Hit Die: d{classes.find(c => c.name === character.class)?.hitDie}
                        </Badge>
                        <Badge variant="secondary">
                          Primary: {classes.find(c => c.name === character.class)?.primary}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Ability Scores</CardTitle>
                    <CardDescription className="text-gray-400">
                      Roll stats using 4d6 drop lowest method
                    </CardDescription>
                  </div>
                  <Button onClick={rollAllStats} className="bg-purple-600 hover:bg-purple-700">
                    <Shuffle className="mr-2 h-4 w-4" />
                    Roll All Stats
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <div key={stat} className="text-center">
                      <div className="bg-gradient-to-b from-purple-600/20 to-purple-800/20 rounded-lg p-4 border border-purple-500/30">
                        <div className="text-sm font-medium text-purple-300 mb-2 capitalize">
                          {stat}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{value}</div>
                        <div className="text-sm text-gray-400">
                          {getModifier(value) >= 0 ? '+' : ''}{getModifier(value)}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => rollIndividualStat(stat as keyof typeof character.stats)}
                          className="mt-2 text-xs hover:bg-purple-600/20"
                        >
                          <Dice6 className="h-3 w-3 mr-1" />
                          Reroll
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Character Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="backstory" className="text-gray-300">Backstory</Label>
                  <Textarea
                    id="backstory"
                    value={character.backstory}
                    onChange={(e) => setCharacter(prev => ({ ...prev, backstory: e.target.value }))}
                    className="bg-black/30 border-purple-500/30 text-white min-h-[120px]"
                    placeholder="Tell your character's story..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Character Summary</CardTitle>
                  <Button onClick={saveCharacter} className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="mr-2 h-4 w-4" />
                    Save Character
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Basic Info</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{character.name || 'Unnamed'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Race:</span>
                        <span className="text-white">{character.race || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Class:</span>
                        <span className="text-white">{character.class || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Background:</span>
                        <span className="text-white">{character.background || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-white">{character.level}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Ability Scores</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(character.stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{stat}:</span>
                          <span className="text-white">
                            {value} ({getModifier(value) >= 0 ? '+' : ''}{getModifier(value)})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {character.backstory && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Backstory</h3>
                    <p className="text-gray-300 text-sm">{character.backstory}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default CharacterCreator