import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import CharacterCreator from './pages/CharacterCreator'
import DiceRoller from './pages/DiceRoller'
import GameSession from './pages/GameSession'
import './App.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-stone-900 to-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/character-creator" element={<CharacterCreator />} />
              <Route path="/dice-roller" element={<DiceRoller />} />
              <Route path="/game-session" element={<GameSession />} />
            </Routes>
          </main>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App