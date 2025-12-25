import { useEffect, useRef, useState, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const BASE_GAME_SPEED = 120;
const MIN_GAME_SPEED = 50;

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const directionRef = useRef(direction);
  const directionQueueRef = useRef<Position[]>([]);
  const snakeRef = useRef(snake);
  const [gameSpeed, setGameSpeed] = useState(BASE_GAME_SPEED);

  const generateFood = useCallback((currentSnake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    snakeRef.current = INITIAL_SNAKE;
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    directionQueueRef.current = [];
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameSpeed(BASE_GAME_SPEED);
    setGameOver(false);
    setIsPlaying(false);
  }, []);

  const checkCollision = useCallback((head: Position, body: Position[]): boolean => {
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    return body.some((segment) => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      if (directionQueueRef.current.length > 0) {
        const nextDir = directionQueueRef.current.shift();
        if (nextDir) {
          const currentDir = directionRef.current;
          if (nextDir.x !== -currentDir.x || nextDir.y !== -currentDir.y) {
            directionRef.current = nextDir;
          }
        }
      }

      const newHead = {
        x: prevSnake[0].x + directionRef.current.x,
        y: prevSnake[0].y + directionRef.current.y,
      };

      if (checkCollision(newHead, prevSnake)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));

        const newGameSpeed = Math.max(
          MIN_GAME_SPEED,
          BASE_GAME_SPEED - (newSnake.length - 1) * 2
        );
        setGameSpeed(newGameSpeed);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      return newSnake;
    });
  }, [food, checkCollision, generateFood, onScoreChange]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(gameLoop);
  }, [isPlaying, moveSnake, gameSpeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const keyMap: { [key: string]: Position } = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };

      const newDirection = keyMap[e.key];
      if (newDirection && isPlaying) {
        e.preventDefault();
        directionQueueRef.current.push(newDirection);
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        (segment.x + 1) * CELL_SIZE,
        (segment.y + 1) * CELL_SIZE
      );
      gradient.addColorStop(0, '#06b6d4');
      gradient.addColorStop(1, '#3b82f6');

      ctx.fillStyle = gradient;
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );

      if (index === 0) {
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        ctx.fillRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2
        );
        ctx.shadowBlur = 0;
      }
    });

    const foodGradient = ctx.createRadialGradient(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      0,
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2
    );
    foodGradient.addColorStop(0, '#fbbf24');
    foodGradient.addColorStop(1, '#ef4444');

    ctx.fillStyle = foodGradient;
    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const handleDirectionClick = (newDir: Position) => {
    if (!isPlaying) return;
    directionQueueRef.current.push(newDir);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border-4 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/20"
        />
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <p className="text-white text-2xl font-light mb-4">Press Start to Play</p>
              <p className="text-gray-400 text-sm">Use arrow keys to control</p>
            </div>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm rounded-lg">
            <div className="text-center">
              <p className="text-red-400 text-3xl font-light mb-4">Game Over!</p>
              <p className="text-white text-xl mb-6">Score: {score}</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/50"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={gameOver}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed font-light"
        >
          {isPlaying ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetGame}
          className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-light"
        >
          Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 md:hidden">
        <div></div>
        <button
          onClick={() => handleDirectionClick({ x: 0, y: -1 })}
          className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-cyan-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <div></div>
        <button
          onClick={() => handleDirectionClick({ x: -1, y: 0 })}
          className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-cyan-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div></div>
        <button
          onClick={() => handleDirectionClick({ x: 1, y: 0 })}
          className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-cyan-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div></div>
        <button
          onClick={() => handleDirectionClick({ x: 0, y: 1 })}
          className="p-4 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg hover:from-cyan-500/30 hover:to-blue-500/30 transition-all duration-300"
        >
          <svg className="w-6 h-6 text-cyan-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div></div>
      </div>
    </div>
  );
}
