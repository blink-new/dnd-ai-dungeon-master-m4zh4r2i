import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sword } from 'lucide-react';
import type { Entity } from './types';

const GRID_SIZE = 10;

const initialEntities: Entity[] = [
  { id: 'player', type: 'player', x: 1, y: 1, hp: 20, maxHp: 20, initiative: 15 },
  { id: 'enemy1', type: 'enemy', x: 5, y: 5, hp: 10, maxHp: 10, initiative: 12 },
  { id: 'enemy2', type: 'enemy', x: 8, y: 2, hp: 10, maxHp: 10, initiative: 8 },
];

function App() {
  const [entities, setEntities] = useState(initialEntities);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  useEffect(() => {
    const sortedEntities = [...entities].sort((a, b) => b.initiative - a.initiative);
    setTurnOrder(sortedEntities.map(e => e.id));
  }, []);

  const selectedEntity = entities.find(e => e.id === 'player');

  function handleCellClick(x: number, y: number) {
    if (!selectedEntity || selectedEntity.type !== 'player') return;

    const targetEntity = entities.find(e => e.x === x && e.y === y);

    if (targetEntity && targetEntity.type === 'enemy') {
      // Attack
      const damage = Math.floor(Math.random() * 6) + 1; // 1d6 damage
      setEntities(prev =>
        prev.map(e => (e.id === targetEntity.id ? { ...e, hp: Math.max(0, e.hp - damage) } : e))
      );
    } else {
      // Move
      setEntities(prev =>
        prev.map(e => (e.id === selectedEntity.id ? { ...e, x, y } : e))
      );
    }
    nextTurn();
  }

  function nextTurn() {
    setCurrentTurnIndex(prev => (prev + 1) % turnOrder.length);
  }

  const currentTurnEntityId = turnOrder[currentTurnIndex];

  return (
    <div className="w-screen h-screen bg-background flex flex-col items-center justify-center p-8 font-sans">
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 4rem)`, gridTemplateRows: `repeat(${GRID_SIZE}, 4rem)` }}>
        {[...Array(GRID_SIZE * GRID_SIZE)].map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const entity = entities.find(e => e.x === x && e.y === y);
          return (
            <motion.div
              key={`${x}-${y}`}
              onClick={() => handleCellClick(x, y)}
              className="bg-card border border-border rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-secondary"
              style={{ width: '4rem', height: '4rem' }}
            >
              <AnimatePresence>
                {entity && (
                  <motion.div
                    layoutId={entity.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${entity.type === 'player' ? 'bg-blue-500' : 'bg-red-500'}`}
                  >
                    {entity.type === 'player' ? <User /> : <Sword />}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg p-4 flex items-center space-x-8 shadow-2xl">
        <div>Turn: {entities.find(e => e.id === currentTurnEntityId)?.id}</div>
        {selectedEntity && (
          <div className="flex items-center space-x-4">
            <div>{selectedEntity.id}</div>
            <div>HP: {selectedEntity.hp} / {selectedEntity.maxHp}</div>
          </div>
        )}
        <button onClick={nextTurn} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Next Turn</button>
      </div>
    </div>
  );
}

export default App;