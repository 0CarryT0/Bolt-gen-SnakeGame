import { Gamepad2 } from 'lucide-react';

interface HeaderProps {
  currentScore: number;
  highScore: number;
}

export default function Header({ currentScore, highScore }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl shadow-cyan-500/10 border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg shadow-lg shadow-cyan-500/50">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Snake Game
            </h1>
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-center">
              <p className="text-gray-400 text-sm font-light">Score</p>
              <p className="text-2xl font-light text-cyan-400">{currentScore}</p>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>
            <div className="text-center">
              <p className="text-gray-400 text-sm font-light">High Score</p>
              <p className="text-2xl font-light text-yellow-400">{highScore}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
