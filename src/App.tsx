import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SnakeGame from './components/SnakeGame';

function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (currentScore > highScore) {
      setHighScore(currentScore);
      localStorage.setItem('snakeHighScore', currentScore.toString());
    }
  }, [currentScore, highScore]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      <Header currentScore={currentScore} highScore={highScore} />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl">
          <SnakeGame onScoreChange={setCurrentScore} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
