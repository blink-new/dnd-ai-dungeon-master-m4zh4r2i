import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dice6, User, Bot } from 'lucide-react'

const GRID_SIZE = 7
const INITIAL_POS = { x: 3, y: 3 }

const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
}

export default function GameBoard() {
  const [player, setPlayer] = useState(INITIAL_POS)
  const [log, setLog] = useState([
    { type: 'dm', text: 'Welcome, adventurer! Use arrow keys or click to move your token. Try rolling a die or ask the AI DM for a quest.' }
  ])
  const [diceResult, setDiceResult] = useState<number | null>(null)
  const [input, setInput] = useState('')
  
  // Keyboard movement
  function handleKeyDown(e: React.KeyboardEvent) {
    if (directions[e.key as keyof typeof directions]) {
      movePlayer(directions[e.key as keyof typeof directions])
    }
  }
  function movePlayer(dir: { x: number, y: number }) {
    setPlayer(pos => {
      const nx = Math.max(0, Math.min(GRID_SIZE - 1, pos.x + dir.x))
      const ny = Math.max(0, Math.min(GRID_SIZE - 1, pos.y + dir.y))
      if (nx !== pos.x || ny !== pos.y) {
        setLog(l => [...l, { type: 'system', text: `You move to (${nx + 1}, ${ny + 1})` }])
      }
      return { x: nx, y: ny }
    })
  }
  function handleCellClick(x: number, y: number) {
    setPlayer({ x, y })
    setLog(l => [...l, { type: 'system', text: `You move to (${x + 1}, ${y + 1})` }])
  }
  function rollD20() {
    const result = Math.ceil(Math.random() * 20)
    setDiceResult(result)
    setLog(l => [...l, { type: 'dice', text: `You rolled a d20: ${result}` }])
  }
  function sendToDM() {
    if (!input.trim()) return
    setLog(l => [...l, { type: 'player', text: input }])
    // Simulate AI DM response
    setTimeout(() => {
      setLog(l => [...l, { type: 'dm', text: `The DM says: "${input}" (imagine a real AI here!)` }])
    }, 800)
    setInput('')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-100 font-serif">
      {/* Map */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2.5rem)`, gridTemplateRows: `repeat(${GRID_SIZE}, 2.5rem)` }}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
            const x = i % GRID_SIZE, y = Math.floor(i / GRID_SIZE)
            const isPlayer = player.x === x && player.y === y
            return (
              <motion.div
                key={i}
                className={`rounded-lg border-2 border-yellow-700 bg-yellow-50 flex items-center justify-center cursor-pointer transition-all ${isPlayer ? 'shadow-2xl scale-110 z-10 bg-yellow-300' : 'hover:bg-yellow-200'}`}
                style={{ width: '2.5rem', height: '2.5rem', position: 'relative' }}
                onClick={() => handleCellClick(x, y)}
                whileHover={{ scale: isPlayer ? 1.12 : 1.04 }}
              >
                {isPlayer && <User className="text-yellow-900 w-6 h-6" />}
              </motion.div>
            )
          })}
        </div>
      </div>
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-yellow-50/80 border-l-2 border-yellow-700 flex flex-col p-4 gap-4 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Bot className="text-yellow-700" />
          <span className="font-bold text-yellow-900 text-lg">AI Dungeon Master</span>
        </div>
        <div className="flex-1 overflow-y-auto bg-yellow-100 rounded-lg p-2 mb-2" style={{ maxHeight: 320 }}>
          {log.map((entry, i) => (
            <div key={i} className={`mb-1 text-sm ${entry.type === 'dm' ? 'text-yellow-900' : entry.type === 'player' ? 'text-yellow-700' : entry.type === 'dice' ? 'text-green-700' : 'text-gray-700'}`}>
              {entry.type === 'dm' && <span className="font-bold">DM: </span>}
              {entry.type === 'player' && <span className="font-bold">You: </span>}
              {entry.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded-lg border-2 border-yellow-700 px-2 py-1 bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600"
            placeholder="Say something to the DM..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendToDM() }}
          />
          <button className="btn-3d px-4 py-1" onClick={sendToDM}>Send</button>
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn-3d flex items-center gap-1 px-4 py-2" onClick={rollD20}>
            <Dice6 className="w-5 h-5" /> Roll d20
          </button>
          {diceResult && <span className="text-yellow-900 font-bold text-lg">{diceResult}</span>}
        </div>
        <div className="text-xs text-yellow-700 mt-2">Use arrow keys or click the map to move. Type to talk to the DM. Roll dice for actions!</div>
      </div>
    </div>
  )
}
