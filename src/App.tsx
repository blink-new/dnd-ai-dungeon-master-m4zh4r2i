import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import GameBoard from './GameBoard'
import './App.css'

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <Router>
        <div className="min-h-screen relative overflow-hidden">
          <div className="parallax-bg"></div>
          <div className="perspective-container">
            <Navbar />
            <main className="scene-3d">
              <GameBoard />
            </main>
          </div>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App