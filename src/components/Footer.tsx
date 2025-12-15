import { Mail, Github, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-cyan-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-light text-cyan-400 mb-3">About</h3>
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              A modern take on the classic Snake game. Built with React and TypeScript for a smooth gaming experience.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-light text-cyan-400 mb-3">How to Play</h3>
            <ul className="text-gray-400 text-sm font-light space-y-2">
              <li>• Use arrow keys to control the snake</li>
              <li>• Eat food to grow and earn points</li>
              <li>• Avoid walls and your own tail</li>
              <li>• Press Space to pause/resume</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-light text-cyan-400 mb-3">Connect</h3>
            <div className="flex gap-4">
              <a
                href="mailto:contact@snakegame.com"
                className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 group"
              >
                <Mail className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-cyan-500/20">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm font-light">
              © {currentYear} Snake Game. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm font-light flex items-center gap-2">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using React
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
