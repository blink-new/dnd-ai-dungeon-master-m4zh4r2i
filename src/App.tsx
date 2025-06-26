import { useState } from 'react'
import { motion } from 'framer-motion'
import './index.css'

interface Player {
  x: number
  y: number
  hp: number
  maxHp: number
  level: number
  exp: number
}

interface Enemy {
  x: number
  y: number
  hp: number
  maxHp: number
  name: string
  id: string
}

interface GameLog {
  text: string
  type: 'combat' | 'movement' | 'dm' | 'dice'
}

const GRID_SIZE = 8
const INITIAL_PLAYER: Player = { x: 1, y: 1, hp: 20, maxHp: 20, level: 1, exp: 0 }

function App() {
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER)
  const [enemies, setEnemies] = useState<Enemy[]>([
    { x: 6, y: 3, hp: 8, maxHp: 8, name: 'Goblin', id: 'goblin1' },
    { x: 4, y: 6, hp: 12, maxHp: 12, name: 'Orc', id: 'orc1' }
  ])
  const [gameLog, setGameLog] = useState<GameLog[]>([
    { text: 'You enter a dark dungeon. Move with WASD or arrow keys. Get close to enemies to attack!', type: 'dm' }
  ])
  const [combatMode, setCombatMode] = useState(false)
  const [selectedEnemy, setSelectedEnemy] = useState<Enemy | null>(null)

  const addLog = (text: string, type: GameLog['type']) => {
    setGameLog(prev => [...prev, { text, type }])
  }

  const rollDice = (sides: number): number => {
    return Math.floor(Math.random() * sides) + 1
  }

  const movePlayer = (dx: number, dy: number) => {
    const newX = Math.max(0, Math.min(GRID_SIZE - 1, player.x + dx))
    const newY = Math.max(0, Math.min(GRID_SIZE - 1, player.y + dy))
    
    if (newX === player.x && newY === player.y) return

    // Check if moving into enemy
    const enemyAtPos = enemies.find(e => e.x === newX && e.y === newY && e.hp > 0)
    if (enemyAtPos) {
      setCombatMode(true)
      setSelectedEnemy(enemyAtPos)
      addLog(`You engage the ${enemyAtPos.name} in combat!`, 'combat')
      return
    }

    setPlayer(prev => ({ ...prev, x: newX, y: newY }))
    addLog(`You move to (${newX + 1}, ${newY + 1})`, 'movement')

    // Check if adjacent to enemy after moving
    const adjacentEnemy = enemies.find(e => 
      e.hp > 0 && 
      Math.abs(e.x - newX) <= 1 && 
      Math.abs(e.y - newY) <= 1 &&
      !(e.x === newX && e.y === newY)
    )
    if (adjacentEnemy) {
      addLog(`A ${adjacentEnemy.name} is nearby! Move into it to attack.`, 'dm')
    }
  }

  const attackEnemy = (enemy: Enemy) => {
    const attackRoll = rollDice(20)
    const damage = rollDice(6)
    
    addLog(`You roll d20 to attack: ${attackRoll}`, 'dice')
    
    if (attackRoll >= 12) { // Hit
      addLog(`Hit! You deal ${damage} damage to the ${enemy.name}!`, 'combat')
      
      const updatedEnemies = enemies.map(e => 
        e.id === enemy.id 
          ? { ...e, hp: Math.max(0, e.hp - damage) }
          : e
      )
      setEnemies(updatedEnemies)
      
      const updatedEnemy = updatedEnemies.find(e => e.id === enemy.id)!
      if (updatedEnemy.hp <= 0) {
        addLog(`The ${enemy.name} is defeated! You gain 50 XP.`, 'combat')
        setPlayer(prev => ({ ...prev, exp: prev.exp + 50 }))
        setCombatMode(false)
        setSelectedEnemy(null)
      } else {
        // Enemy attacks back
        setTimeout(() => enemyAttack(updatedEnemy), 1000)
      }
    } else {
      addLog(`Miss! The ${enemy.name} dodges your attack.`, 'combat')
      setTimeout(() => enemyAttack(enemy), 1000)
    }
  }

  const enemyAttack = (enemy: Enemy) => {
    if (enemy.hp <= 0) return
    
    const attackRoll = rollDice(20)
    const damage = rollDice(4)
    
    addLog(`${enemy.name} rolls d20 to attack: ${attackRoll}`, 'dice')
    
    if (attackRoll >= 10) {
      addLog(`${enemy.name} hits you for ${damage} damage!`, 'combat')
      setPlayer(prev => ({ 
        ...prev, 
        hp: Math.max(0, prev.hp - damage) 
      }))
    } else {
      addLog(`${enemy.name} misses!`, 'combat')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (combatMode) return
    
    switch(e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movePlayer(0, -1)
        break
      case 'ArrowDown':
      case 's':
      case 'S':
        movePlayer(0, 1)
        break
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movePlayer(-1, 0)
        break
      case 'ArrowRight':
      case 'd':
      case 'D':
        movePlayer(1, 0)
        break
    }
  }

  const renderCell = (x: number, y: number) => {
    const isPlayer = player.x === x && player.y === y
    const enemy = enemies.find(e => e.x === x && e.y === y && e.hp > 0)
    const isEmpty = !isPlayer && !enemy

    return (
      <div
        key={`${x}-${y}`}
        className={`w-12 h-12 border border-yellow-600 flex items-center justify-center text-2xl font-bold relative
          ${isEmpty ? 'bg-yellow-50 hover:bg-yellow-100' : ''}
          ${isPlayer ? 'bg-blue-200' : ''}
          ${enemy ? 'bg-red-200' : ''}
        `}
      >
        {isPlayer && '🧙‍♂️'}
        {enemy && (enemy.name === 'Goblin' ? '👹' : '👺')}
        {enemy && (
          <div className="absolute -top-6 left-0 right-0 text-xs text-center bg-red-500 text-white rounded px-1">
            {enemy.hp}/{enemy.maxHp}
          </div>
        )}
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-4 flex gap-4"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
            const x = i % GRID_SIZE
            const y = Math.floor(i / GRID_SIZE)
            return renderCell(x, y)
          })}
        </div>
      </div>

      {/* UI Panel */}
      <div className="w-80 bg-white/90 rounded-lg p-4 shadow-lg">
        {/* Player Stats */}
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <h3 className="font-bold text-lg mb-2">Player</h3>
          <div>HP: {player.hp}/{player.maxHp}</div>
          <div>Level: {player.level}</div>
          <div>XP: {player.exp}</div>
        </div>

        {/* Combat Panel */}
        {combatMode && selectedEnemy && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 rounded border-2 border-red-300"
          >
            <h3 className="font-bold text-lg mb-2">Combat!</h3>
            <div className="mb-2">
              {selectedEnemy.name}: {selectedEnemy.hp}/{selectedEnemy.maxHp} HP
            </div>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => attackEnemy(selectedEnemy)}
            >
              Attack with Sword (d6)
            </button>
            <button 
              className="ml-2 bg-gray-500 text-white px-2 py-2 rounded hover:bg-gray-600"
              onClick={() => {
                setCombatMode(false)
                setSelectedEnemy(null)
                addLog('You back away from combat.', 'movement')
              }}
            >
              Retreat
            </button>
          </motion.div>
        )}

        {/* Game Log */}
        <div className="h-64 overflow-y-auto bg-gray-50 p-2 rounded text-sm">
          {gameLog.map((log, i) => (
            <div key={i} className={`mb-1 ${
              log.type === 'combat' ? 'text-red-700 font-bold' :
              log.type === 'dice' ? 'text-purple-700' :
              log.type === 'movement' ? 'text-blue-700' :
              'text-gray-700'
            }`}>
              {log.text}
            </div>
          ))}
        </div>

        <div className="mt-2 text-xs text-gray-600">
          Use WASD or arrow keys to move. Click buttons to fight!
        </div>
      </div>
    </div>
  )
}

export default App