import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameData } from "@/hooks/useGameData";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Play,
  Trophy,
  Coins,
  RotateCcw,
  Zap
} from "lucide-react";

interface Tower {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  passed: boolean;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  size: number;
  isJumping: boolean;
}

export default function TowerJumper() {
  const { user } = useAuth();
  const { profile, addIncome } = useGameData();
  const sounds = useSound();
  const { toast } = useToast();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [reward, setReward] = useState(0);
  
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 300,
    velocityY: 0,
    size: 30,
    isJumping: false
  });
  
  const [towers, setTowers] = useState<Tower[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTowerXRef = useRef(300);
  const gameSpeedRef = useRef(3);

  // Загрузка лучшего результата
  useEffect(() => {
    const saved = localStorage.getItem('towerJumperBest');
    if (saved) setBestScore(parseInt(saved));
  }, []);

  // Инициализация игры
  const initGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setReward(0);
    gameSpeedRef.current = 3;
    
    setPlayer({
      x: 100,
      y: 300,
      velocityY: 0,
      size: 30,
      isJumping: false
    });
    
    // Начальные вышки
    const initialTowers: Tower[] = [];
    for (let i = 0; i < 5; i++) {
      initialTowers.push({
        id: i,
        x: 300 + i * 250,
        y: 400 - Math.random() * 100,
        width: 80,
        height: Math.random() * 200 + 300,
        passed: false
      });
    }
    setTowers(initialTowers);
    lastTowerXRef.current = initialTowers[initialTowers.length - 1].x;
  };

  // Прыжок
  const jump = () => {
    if (!gameStarted || gameOver) return;
    
    setPlayer(prev => ({
      ...prev,
      velocityY: -12,
      isJumping: true
    }));
    
    sounds.coin();
  };

  // Игровой цикл
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      // Физика игрока
      setPlayer(prev => {
        const newVelocityY = prev.velocityY + 0.6; // гравитация
        const newY = prev.y + newVelocityY;
        
        // Проверка столкновения с вышками
        let onTower = false;
        towers.forEach(tower => {
          if (
            prev.x + prev.size > tower.x &&
            prev.x < tower.x + tower.width &&
            newY + prev.size >= tower.y &&
            newY + prev.size <= tower.y + 20 &&
            newVelocityY > 0
          ) {
            onTower = true;
          }
        });

        if (onTower && newVelocityY > 0) {
          return {
            ...prev,
            velocityY: 0,
            isJumping: false
          };
        }

        // Проверка падения
        if (newY > 600) {
          handleGameOver();
          return prev;
        }

        return {
          ...prev,
          y: newY,
          velocityY: newVelocityY
        };
      });

      // Движение вышек
      setTowers(prev => {
        const newTowers = prev.map(tower => ({
          ...tower,
          x: tower.x - gameSpeedRef.current
        })).filter(tower => tower.x > -tower.width);

        // Проверка пройденных вышек
        newTowers.forEach(tower => {
          if (!tower.passed && tower.x + tower.width < player.x) {
            tower.passed = true;
            setScore(s => {
              const newScore = s + 1;
              // Увеличение скорости каждые 5 очков
              if (newScore % 5 === 0) {
                gameSpeedRef.current += 0.5;
              }
              return newScore;
            });
            sounds.success();
          }
        });

        // Генерация новых вышек
        if (newTowers.length < 6) {
          const lastTower = newTowers[newTowers.length - 1];
          if (lastTower && lastTower.x < 900) {
            const gap = 180 + Math.random() * 120;
            newTowers.push({
              id: Date.now(),
              x: lastTower.x + gap,
              y: 350 - Math.random() * 150,
              width: 70 + Math.random() * 30,
              height: Math.random() * 200 + 300,
              passed: false
            });
          }
        }

        return newTowers;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, player.x, player.size, towers]);

  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    
    // Расчет награды
    const earnedReward = Math.floor(score * 10);
    setReward(earnedReward);
    
    // Обновление рекорда
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('towerJumperBest', score.toString());
      toast({
        title: "🏆 Новый рекорд!",
        description: `Вы побили свой рекорд: ${score} прыжков!`,
        duration: 5000,
      });
    }
    
    // Начисление награды
    if (user && earnedReward > 0) {
      addIncome(earnedReward);
      toast({
        title: "💰 Награда получена!",
        description: `+${earnedReward} бочек за ${score} прыжков`,
        duration: 5000,
      });
    }
    
    sounds.error();
  };

  // Рендер игры на canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Очистка
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Фон - сетка
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    if (gameStarted && !gameOver) {
      // Рисуем вышки
      towers.forEach((tower, index) => {
        // Тень
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(tower.x + 5, tower.y + 5, tower.width, canvas.height - tower.y);
        
        // Градиент вышки
        const gradient = ctx.createLinearGradient(tower.x, 0, tower.x + tower.width, 0);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(0.5, '#8b5cf6');
        gradient.addColorStop(1, '#a855f7');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(tower.x, tower.y, tower.width, canvas.height - tower.y);
        
        // Блики
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(tower.x, tower.y, 10, canvas.height - tower.y);
        
        // Полосы
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 5; i++) {
          ctx.fillRect(tower.x, tower.y + i * 80, tower.width, 3);
        }
      });

      // Рисуем игрока
      const playerGradient = ctx.createRadialGradient(
        player.x + player.size / 2,
        player.y + player.size / 2,
        0,
        player.x + player.size / 2,
        player.y + player.size / 2,
        player.size
      );
      playerGradient.addColorStop(0, '#fbbf24');
      playerGradient.addColorStop(1, '#f59e0b');
      
      // Тень игрока
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(player.x + player.size / 2 + 3, player.y + player.size / 2 + 3, player.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Игрок
      ctx.fillStyle = playerGradient;
      ctx.beginPath();
      ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Блик на игроке
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(player.x + player.size / 2 - 5, player.y + player.size / 2 - 5, player.size / 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [player, towers, gameStarted, gameOver]);

  // Обработка клика по canvas
  const handleCanvasClick = () => {
    if (!gameStarted && !gameOver) {
      initGame();
    } else if (gameStarted && !gameOver) {
      jump();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/20 via-indigo-500/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-purple-500/15 via-violet-500/15 to-transparent rounded-full blur-3xl animate-float animation-delay-1000" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2 tracking-tight">
              Прыжки по Вышкам
            </h1>
            <p className="text-white/50 text-sm font-medium tracking-wider uppercase">Аркадный Челлендж</p>
          </div>
          <div className="w-20" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Счёт</p>
                  <p className="text-2xl font-bold text-white">{score}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Рекорд</p>
                  <p className="text-2xl font-bold text-white">{bestScore}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Баланс</p>
                  <p className="text-2xl font-bold text-white">{profile?.balance.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="max-w-5xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-2xl opacity-50" />
            <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 overflow-hidden">
              <canvas
                ref={canvasRef}
                width={1000}
                height={600}
                onClick={handleCanvasClick}
                className="w-full rounded-2xl cursor-pointer border-2 border-white/10 bg-[#0a0a0f]"
              />

              {/* Start Screen */}
              {!gameStarted && !gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-3xl">
                  <div className="text-center space-y-6 p-8">
                    <h2 className="text-5xl font-black text-white mb-4">Готовы прыгать?</h2>
                    <p className="text-xl text-white/70 mb-8">Кликайте для прыжка<br/>Не упадите с вышек!</p>
                    <Button
                      onClick={initGame}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-2xl"
                    >
                      <Play className="mr-3 h-6 w-6" />
                      Начать игру
                    </Button>
                  </div>
                </div>
              )}

              {/* Game Over Screen */}
              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md rounded-3xl animate-scale-in">
                  <div className="text-center space-y-6 p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <h2 className="text-6xl font-black text-white mb-2">Игра окончена!</h2>
                    
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                        <p className="text-white/60 text-sm uppercase tracking-wider mb-2">Ваш счёт</p>
                        <p className="text-7xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {score}
                        </p>
                      </div>

                      {score === bestScore && score > 0 && (
                        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
                          <p className="text-yellow-400 font-bold flex items-center justify-center gap-2">
                            <Trophy className="h-5 w-5" />
                            Новый рекорд!
                          </p>
                        </div>
                      )}

                      {reward > 0 && (
                        <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                          <p className="text-white/60 text-sm uppercase tracking-wider mb-1">Награда</p>
                          <p className="text-3xl font-bold text-yellow-400">+{reward} бочек</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={initGame}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold text-lg px-10 py-6 rounded-xl"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Играть снова
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl opacity-50" />
              <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Как играть</h3>
                </div>
                
                <div className="space-y-3">
                  {[
                    'Кликайте по экрану или нажимайте пробел для прыжка',
                    'Прыгайте с вышки на вышку, не падайте вниз',
                    'Каждый успешный прыжок приносит 1 очко',
                    'Зарабатывайте 10 бочек за каждое очко',
                    'Игра ускоряется каждые 5 прыжков - будьте внимательны!'
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm text-white/70">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
