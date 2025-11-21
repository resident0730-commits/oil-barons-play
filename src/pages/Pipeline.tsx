import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameData } from "@/hooks/useGameData";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  RotateCw, 
  Trophy, 
  Clock, 
  Coins,
  Zap,
  Star,
  Lightbulb,
  Volume2,
  VolumeX
} from "lucide-react";

type PipeType = 'straight' | 'corner' | 't-shape' | 'cross' | 'start' | 'end' | 'empty' | 'blocked';
type Direction = 0 | 90 | 180 | 270;

interface Pipe {
  type: PipeType;
  rotation: Direction;
  isConnected: boolean;
  hasOilFlow: boolean;
  row: number;
  col: number;
}

interface Level {
  id: number;
  name: string;
  gridSize: number;
  timeLimit: number;
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

const LEVELS: Level[] = [
  { id: 1, name: "Новичок", gridSize: 4, timeLimit: 90, reward: 100, difficulty: 'easy' },
  { id: 2, name: "Любитель", gridSize: 5, timeLimit: 120, reward: 250, difficulty: 'easy' },
  { id: 3, name: "Опытный", gridSize: 6, timeLimit: 150, reward: 500, difficulty: 'medium' },
  { id: 4, name: "Эксперт", gridSize: 7, timeLimit: 180, reward: 1000, difficulty: 'medium' },
  { id: 5, name: "Мастер", gridSize: 8, timeLimit: 210, reward: 2500, difficulty: 'hard' },
];

export default function Pipeline() {
  const { user } = useAuth();
  const { addIncome } = useGameData();
  const sounds = useSound();
  const { toast } = useToast();
  
  const [currentLevel, setCurrentLevel] = useState<Level>(LEVELS[0]);
  const [grid, setGrid] = useState<Pipe[][]>([]);
  const [timeLeft, setTimeLeft] = useState(currentLevel.timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [startPos, setStartPos] = useState({ row: 0, col: 0 });
  const [endPos, setEndPos] = useState({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [showHint, setShowHint] = useState(false);

  // Генерация случайной трубы
  const generateRandomPipe = (row: number, col: number): Pipe => {
    // На сложных уровнях добавляем заблокированные клетки
    if (currentLevel.difficulty === 'hard' && Math.random() < 0.15) {
      return {
        type: 'blocked',
        rotation: 0,
        isConnected: false,
        hasOilFlow: false,
        row,
        col
      };
    }
    
    const types: PipeType[] = ['straight', 'corner', 't-shape', 'cross'];
    const type = types[Math.floor(Math.random() * types.length)];
    const rotations: Direction[] = [0, 90, 180, 270];
    const rotation = rotations[Math.floor(Math.random() * rotations.length)];
    
    return {
      type,
      rotation,
      isConnected: false,
      hasOilFlow: false,
      row,
      col
    };
  };

  // Инициализация уровня
  const initializeLevel = useCallback(() => {
    const size = currentLevel.gridSize;
    const newGrid: Pipe[][] = [];
    
    // Определяем позиции старта и финиша
    const startRow = Math.floor(size / 2);
    const endRow = Math.floor(size / 2);
    const startCol = 0;
    const endCol = size - 1;
    
    setStartPos({ row: startRow, col: startCol });
    setEndPos({ row: endRow, col: endCol });
    
    // Создаем сетку
    for (let row = 0; row < size; row++) {
      const gridRow: Pipe[] = [];
      for (let col = 0; col < size; col++) {
        if (row === startRow && col === startCol) {
          gridRow.push({ type: 'start', rotation: 0, isConnected: true, hasOilFlow: false, row, col });
        } else if (row === endRow && col === endCol) {
          gridRow.push({ type: 'end', rotation: 0, isConnected: false, hasOilFlow: false, row, col });
        } else {
          gridRow.push(generateRandomPipe(row, col));
        }
      }
      newGrid.push(gridRow);
    }
    
    setGrid(newGrid);
    setTimeLeft(currentLevel.timeLimit);
    setIsCompleted(false);
    setIsPaused(false);
    setMoves(0);
    setHintsLeft(3);
    setShowHint(false);
  }, [currentLevel]);

  // Проверка соединения труб
  const checkConnection = useCallback((fromRow: number, fromCol: number, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    const toRow = direction === 'up' ? fromRow - 1 : direction === 'down' ? fromRow + 1 : fromRow;
    const toCol = direction === 'left' ? fromCol - 1 : direction === 'right' ? fromCol + 1 : fromCol;
    
    if (toRow < 0 || toRow >= grid.length || toCol < 0 || toCol >= grid[0].length) {
      return false;
    }
    
    const fromPipe = grid[fromRow][fromCol];
    const toPipe = grid[toRow][toCol];
    
    // Проверяем, имеет ли текущая труба выход в данном направлении
    const hasOutput = checkPipeOutput(fromPipe, direction);
    if (!hasOutput) return false;
    
    // Проверяем, имеет ли следующая труба вход с противоположной стороны
    const oppositeDirection = direction === 'up' ? 'down' : direction === 'down' ? 'up' : 
                             direction === 'left' ? 'right' : 'left';
    const hasInput = checkPipeOutput(toPipe, oppositeDirection);
    
    return hasInput;
  }, [grid]);

  // Проверка выхода трубы в определенном направлении
  const checkPipeOutput = (pipe: Pipe, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    const { type, rotation } = pipe;
    
    if (type === 'blocked') return false;
    if (type === 'start') return direction === 'right';
    if (type === 'end') return direction === 'left';
    
    const directionDegrees = { up: 0, right: 90, down: 180, left: 270 };
    const adjustedDirection = (directionDegrees[direction] - rotation + 360) % 360;
    
    switch (type) {
      case 'straight':
        return adjustedDirection === 0 || adjustedDirection === 180;
      case 'corner':
        return adjustedDirection === 0 || adjustedDirection === 90;
      case 't-shape':
        return adjustedDirection === 0 || adjustedDirection === 90 || adjustedDirection === 270;
      case 'cross':
        return true;
      default:
        return false;
    }
  };

  // Алгоритм поиска пути от старта до финиша с анимацией потока
  const findPath = useCallback(() => {
    const visited = new Set<string>();
    const queue: Array<{ row: number; col: number }> = [startPos];
    const connectedPipes: Array<{ row: number; col: number }> = [];
    
    // Сначала сбрасываем все флаги соединения и потока
    const resetGrid = grid.map(row => 
      row.map(pipe => ({ ...pipe, isConnected: false, hasOilFlow: false }))
    );
    setGrid(resetGrid);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const key = `${current.row},${current.col}`;
      
      if (visited.has(key)) continue;
      visited.add(key);
      
      connectedPipes.push(current);
      
      // Проверяем, достигли ли финиша
      if (current.row === endPos.row && current.col === endPos.col) {
        // Анимируем поток нефти по найденному пути
        animateOilFlow(connectedPipes);
        return true;
      }
      
      // Проверяем все направления
      const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];
      for (const direction of directions) {
        if (checkConnection(current.row, current.col, direction)) {
          const nextRow = direction === 'up' ? current.row - 1 : direction === 'down' ? current.row + 1 : current.row;
          const nextCol = direction === 'left' ? current.col - 1 : direction === 'right' ? current.col + 1 : current.col;
          queue.push({ row: nextRow, col: nextCol });
        }
      }
    }
    
    // Обновляем сетку с найденными соединениями
    const newGrid = [...grid];
    connectedPipes.forEach(pos => {
      newGrid[pos.row][pos.col] = { ...newGrid[pos.row][pos.col], isConnected: true };
    });
    setGrid(newGrid);
    
    return false;
  }, [grid, startPos, endPos, checkConnection]);

  // Анимация потока нефти
  const animateOilFlow = (path: Array<{ row: number; col: number }>) => {
    path.forEach((pos, index) => {
      setTimeout(() => {
        setGrid(prevGrid => {
          const newGrid = [...prevGrid];
          newGrid[pos.row][pos.col] = { 
            ...newGrid[pos.row][pos.col], 
            isConnected: true,
            hasOilFlow: true 
          };
          return newGrid;
        });
        
        if (isSoundEnabled && index % 3 === 0) {
          sounds.coin();
        }
      }, index * 100);
    });
  };

  // Поворот трубы
  const rotatePipe = (row: number, col: number) => {
    if (!isPlaying || isPaused || isCompleted) return;
    
    const pipe = grid[row][col];
    if (pipe.type === 'start' || pipe.type === 'end' || pipe.type === 'blocked') return;
    
    if (isSoundEnabled) sounds.coin();
    
    setMoves(prev => prev + 1);
    
    const newGrid = [...grid];
    const rotations: Direction[] = [0, 90, 180, 270];
    const currentIndex = rotations.indexOf(pipe.rotation);
    const nextRotation = rotations[(currentIndex + 1) % rotations.length];
    
    newGrid[row][col] = { ...pipe, rotation: nextRotation };
    setGrid(newGrid);
    
    // Проверяем соединение после небольшой задержки
    setTimeout(() => {
      const isConnected = findPath();
      if (isConnected) {
        completeLevel();
      }
    }, 100);
  };

  // Показать подсказку
  const showHintPipe = () => {
    if (hintsLeft <= 0 || !isPlaying || isCompleted) return;
    
    setHintsLeft(prev => prev - 1);
    setShowHint(true);
    
    if (isSoundEnabled) sounds.notify();
    
    toast({
      title: "💡 Подсказка",
      description: "Попробуйте соединить трубы ближе к старту или финишу",
      duration: 3000,
    });
    
    setTimeout(() => setShowHint(false), 3000);
  };

  // Завершение уровня
  const completeLevel = async () => {
    setIsCompleted(true);
    setIsPlaying(false);
    if (isSoundEnabled) sounds.success();
    
    // Бонус за оставшееся время и эффективность ходов
    const timeBonus = Math.floor(timeLeft * 5);
    const movesBonus = Math.max(0, 50 - moves) * 10;
    const totalReward = currentLevel.reward + timeBonus + movesBonus;
    
    if (user) {
      try {
        await addIncome(totalReward);
        toast({
          title: "🎉 Уровень пройден!",
          description: `Награда: ${totalReward.toLocaleString()} бочек\n⏱️ +${timeBonus} за время\n🎯 +${movesBonus} за ${moves} ходов`,
          duration: 5000,
        });
      } catch (error) {
        console.error('Error adding reward:', error);
      }
    } else {
      toast({
        title: "🎉 Уровень пройден!",
        description: `Войдите, чтобы получить ${totalReward.toLocaleString()} бочек\nХодов: ${moves} | Время: ${timeLeft}с`,
        duration: 5000,
      });
    }
  };

  // Старт игры
  const startGame = () => {
    initializeLevel();
    setIsPlaying(true);
    setIsPaused(false);
  };

  // Таймер
  useEffect(() => {
    if (!isPlaying || isPaused || isCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          if (isSoundEnabled) sounds.error();
          toast({
            variant: "destructive",
            title: "⏰ Время вышло!",
            description: `Попробуйте еще раз. Ходов сделано: ${moves}`,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, isPaused, isCompleted]);

  // Инициализация при загрузке
  useEffect(() => {
    initializeLevel();
  }, [initializeLevel]);

  // Рендер трубы
  const renderPipe = (pipe: Pipe) => {
    const isHinted = showHint && Math.abs(pipe.row - startPos.row) + Math.abs(pipe.col - startPos.col) <= 2;
    const baseClasses = "w-full h-full flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 relative overflow-hidden";
    
    let bgClasses = "bg-slate-700/50 border-slate-600";
    if (pipe.type === 'blocked') {
      bgClasses = "bg-red-900/30 border-red-700";
    } else if (pipe.hasOilFlow) {
      bgClasses = "bg-gradient-to-br from-amber-600/40 to-yellow-500/40 border-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.5)]";
    } else if (pipe.isConnected) {
      bgClasses = "bg-emerald-600/20 border-emerald-500";
    }
    
    if (isHinted) {
      bgClasses += " animate-pulse ring-2 ring-yellow-400";
    }
    
    let pipeShape = null;
    
    switch (pipe.type) {
      case 'start':
        pipeShape = (
          <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50 animate-pulse">
            <Zap className="h-6 w-6 text-white drop-shadow-lg" />
          </div>
        );
        break;
      case 'end':
        pipeShape = (
          <div className={`w-full h-full bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg ${pipe.hasOilFlow ? 'shadow-red-500/80 animate-pulse' : 'shadow-red-500/50'}`}>
            <Trophy className="h-6 w-6 text-white drop-shadow-lg" />
          </div>
        );
        break;
      case 'blocked':
        pipeShape = (
          <div className="w-full h-full bg-gradient-to-br from-red-900 to-red-950 rounded-lg flex items-center justify-center">
            <div className="text-4xl">❌</div>
          </div>
        );
        break;
      case 'straight':
        pipeShape = (
          <div className="relative w-full h-full flex items-center justify-center" style={{ transform: `rotate(${pipe.rotation}deg)` }}>
            <div className={`w-3 h-full rounded-full ${pipe.hasOilFlow ? 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-400' : 'bg-gradient-to-b from-slate-400 to-slate-500'} shadow-inner`}>
              {pipe.hasOilFlow && (
                <div className="w-full h-full bg-gradient-to-b from-transparent via-yellow-300/50 to-transparent animate-pulse" />
              )}
            </div>
          </div>
        );
        break;
      case 'corner':
        pipeShape = (
          <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${pipe.rotation}deg)` }} className="drop-shadow-md">
            <defs>
              <linearGradient id={`pipeGrad-${pipe.row}-${pipe.col}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={pipe.hasOilFlow ? "#fbbf24" : "#94a3b8"} />
                <stop offset="100%" stopColor={pipe.hasOilFlow ? "#f59e0b" : "#64748b"} />
              </linearGradient>
            </defs>
            <path 
              d="M 50 5 L 50 50 L 95 50" 
              stroke={`url(#pipeGrad-${pipe.row}-${pipe.col})`} 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              className={pipe.hasOilFlow ? "animate-pulse" : ""}
            />
          </svg>
        );
        break;
      case 't-shape':
        pipeShape = (
          <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: `rotate(${pipe.rotation}deg)` }} className="drop-shadow-md">
            <defs>
              <linearGradient id={`pipeGradT-${pipe.row}-${pipe.col}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={pipe.hasOilFlow ? "#fbbf24" : "#94a3b8"} />
                <stop offset="100%" stopColor={pipe.hasOilFlow ? "#f59e0b" : "#64748b"} />
              </linearGradient>
            </defs>
            <path 
              d="M 50 5 L 50 50 M 5 50 L 95 50" 
              stroke={`url(#pipeGradT-${pipe.row}-${pipe.col})`} 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              className={pipe.hasOilFlow ? "animate-pulse" : ""}
            />
          </svg>
        );
        break;
      case 'cross':
        pipeShape = (
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="drop-shadow-md">
            <defs>
              <linearGradient id={`pipeGradX-${pipe.row}-${pipe.col}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={pipe.hasOilFlow ? "#fbbf24" : "#94a3b8"} />
                <stop offset="100%" stopColor={pipe.hasOilFlow ? "#f59e0b" : "#64748b"} />
              </linearGradient>
            </defs>
            <path 
              d="M 50 5 L 50 95 M 5 50 L 95 50" 
              stroke={`url(#pipeGradX-${pipe.row}-${pipe.col})`} 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              className={pipe.hasOilFlow ? "animate-pulse" : ""}
            />
          </svg>
        );
        break;
    }
    
    return (
      <div className={`${baseClasses} ${bgClasses} border-2 rounded-lg`}>
        {pipeShape}
      </div>
    );
  };

  const timeProgress = (timeLeft / currentLevel.timeLimit) * 100;
  const timeColor = timeProgress > 50 ? 'bg-green-500' : timeProgress > 25 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            🔧 Нефтепровод
          </h1>
          <div className="w-20" />
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Уровень</p>
                <p className="text-xl font-bold">{currentLevel.name}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Время</p>
                <p className="text-xl font-bold">{timeLeft}с</p>
                <Progress value={timeProgress} className={`h-1 mt-1 ${timeColor}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Coins className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Награда</p>
                <p className="text-xl font-bold">{currentLevel.reward.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Ходов</p>
                <p className="text-xl font-bold">{moves}</p>
                <p className="text-xs text-muted-foreground mt-1">Бонус за скорость!</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Подсказки</p>
                <p className="text-xl font-bold">{hintsLeft}/3</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Grid */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                <span>Соедините трубы от старта до финиша</span>
                <div className="flex gap-2">
                  {isPlaying && !isCompleted && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={showHintPipe}
                        disabled={hintsLeft <= 0}
                      >
                        <Lightbulb className="mr-1 h-4 w-4" />
                        Подсказка ({hintsLeft})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPaused(!isPaused)}
                      >
                        {isPaused ? 'Продолжить' : 'Пауза'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                      >
                        {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      </Button>
                    </>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <div 
                className="grid gap-2 p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-xl shadow-2xl border-2 border-slate-700/50"
                style={{ 
                  gridTemplateColumns: `repeat(${currentLevel.gridSize}, minmax(0, 1fr))`,
                  maxWidth: '600px',
                  aspectRatio: '1/1'
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((pipe, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => rotatePipe(rowIndex, colIndex)}
                      className="aspect-square"
                    >
                      {renderPipe(pipe)}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controls & Levels */}
          <div className="lg:w-80 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {!isPlaying ? (
                  <Button 
                    onClick={startGame} 
                    className="w-full"
                    size="lg"
                  >
                    {isCompleted ? 'Играть снова' : 'Начать игру'}
                  </Button>
                ) : (
                  <Button 
                    onClick={initializeLevel} 
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCw className="mr-2 h-4 w-4" />
                    Перезапустить
                  </Button>
                )}
                
                <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg space-y-2 text-sm border border-slate-700">
                  <p className="font-semibold text-cyan-400 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Как играть:
                  </p>
                  <ul className="list-none space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">⚡</span>
                      <span>Нажимайте на трубы для поворота</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400">🔧</span>
                      <span>Соедините старт с финишем</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400">⏱️</span>
                      <span>Бонус за скорость и мало ходов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-400">💡</span>
                      <span>Используйте подсказки при затруднении</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">❌</span>
                      <span>Избегайте заблокированных клеток</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Уровни</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {LEVELS.map((level) => (
                  <Button
                    key={level.id}
                    variant={currentLevel.id === level.id ? "default" : "outline"}
                    className="w-full justify-between"
                    onClick={() => {
                      setCurrentLevel(level);
                      setIsPlaying(false);
                      setIsCompleted(false);
                    }}
                    disabled={isPlaying}
                  >
                    <span>{level.name}</span>
                    <Badge variant="secondary">
                      {level.reward.toLocaleString()} 🛢️
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}