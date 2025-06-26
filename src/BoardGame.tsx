import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Sword } from 'lucide-react'

const GRID_SIZE = 10

const initialPlayer = { x: 1, y: 1, hp: 20, ac: 15, name: 'Player' }
const initialEnemies = [
  { x: 7, y: 3, hp: 12, ac: 13, name: 'Goblin' },
  { x: 4, y: 6, hp: 12, ac: 13, name: 'Goblin' },
]

export default function BoardGame() {
  const [player, setPlayer] = useState(initialPlayer)
  const [enemies, setEnemies] = useState(initialEnemies)
  const [turn, setTurn] = useState('player')
  const [selected, setSelected] = useState(player)
  const [log, setLog] = useState(['Welcome to the Dungeon! It is your turn.'])

  function handleMove(x: number, y: number) {
    if (turn !== 'player') return
    setPlayer(p => ({ ...p, x, y }))
    setLog(l => [...l, `Player moves to (${x}, ${y}).`])
    endTurn()
  }

  function handleAttack(target: typeof player | typeof enemies[0]) {
    if (turn !== 'player') return
    const roll = Math.ceil(Math.random() * 20)
    const hit = roll >= target.ac
    setLog(l => [...l, `Player attacks ${target.name} with a roll of ${roll}... ${hit ? 'HIT!' : 'MISS!'}`])
    if (hit) {
      const damage = Math.ceil(Math.random() * 8)
      setEnemies(e => e.map(en => en === target ? { ...en, hp: en.hp - damage } : en).filter(en => en.hp > 0))
      setLog(l => [...l, `Deals ${damage} damage!`])
    }
    endTurn()
  }

  function endTurn() {
    setTurn('enemy')
    setTimeout(() => {
      // Simple AI: move towards player and attack if adjacent
      setEnemies(e => e.map(en => {
        const dx = player.x - en.x
        const dy = player.y - en.y
        if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
          // Attack
          const roll = Math.ceil(Math.random() * 20)
          const hit = roll >= player.ac
          setLog(l => [...l, `${en.name} attacks Player with a roll of ${roll}... ${hit ? 'HIT!' : 'MISS!'}`])
          if (hit) {
            const damage = Math.ceil(Math.random() * 6)
            setPlayer(p => ({ ...p, hp: p.hp - damage }))
            setLog(l => [...l, `Deals ${damage} damage!`])
          }
        } else {
          // Move
          const moveX = en.x + Math.sign(dx)
          const moveY = en.y + Math.sign(dy)
          setLog(l => [...l, `${en.name} moves to (${moveX}, ${moveY}).`])
          return { ...en, x: moveX, y: moveY }
        }
        return en
      }))
      setTurn('player')
      setLog(l => [...l, 'Your turn.'])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col md:flex-row p-4 gap-4 font-mono">
      {/* Board */}
      <div className="flex-1 grid gap-1 bg-gray-700 p-2 rounded-lg" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
          const x = i % GRID_SIZE
          const y = Math.floor(i / GRID_SIZE)
          const isPlayer = player.x === x && player.y === y
          const enemy = enemies.find(e => e.x === x && e.y === y)
          return (
            <motion.div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center cursor-pointer transition-all ${isPlayer || enemy ? 'bg-gray-600' : 'bg-gray-500 hover:bg-gray-400'}`}
              onClick={() => handleMove(x, y)}
              whileHover={{ scale: 1.05 }}
            >
              {isPlayer && <User className="text-blue-400 w-8 h-8" />}
              {enemy && <Sword className="text-red-400 w-8 h-8" />}
            </motion.div>
          )
        })}
      </div>
      {/* UI Panel */}
      <div className="w-full md:w-96 bg-gray-700 rounded-lg p-4 flex flex-col gap-4">
        <h2 className="text-2xl font-bold border-b-2 border-gray-600 pb-2">Dungeon Crawler</h2>
        <div className="flex-1 overflow-y-auto bg-gray-800 rounded p-2" style={{ maxHeight: 200 }}>
          {log.map((l, i) => <div key={i} className="text-sm">{l}</div>)}
        </div>
        <div>
          <h3 className="font-bold text-lg">Selected</h3>
          <div className="bg-gray-800 p-2 rounded mt-1">
            <p>Name: {selected.name}</p>
            <p>HP: {selected.hp}</p>
            <p>AC: {selected.ac}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">Actions</h3>
          <div className="flex gap-2 mt-1">
            <button className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded" onClick={() => handleMove(player.x, player.y)}>Move</button>
            <button className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded" onClick={() => handleAttack(enemies[0])}>Attack</button>
          </div>
        </div>
        <div className="text-center font-bold text-xl mt-auto">
          {turn === 'player' ? 'Your Turn' : 'Enemy Turn'}
        </div>
      </div>
    </div>
  )
}