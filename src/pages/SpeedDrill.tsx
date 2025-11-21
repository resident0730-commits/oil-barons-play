import { useState, useEffect, useCallback, useRef } from 'react';
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
  Play, 
  Heart,
  Zap,
  TrendingDown,
  Trophy,
  Target,
  Flame
} from "lucide-react";

type LayerType = 'safe' | 'rock' | 'water' | 'gas' | 'gold';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

interface Layer {
  type: LayerType;
  depth: number;
  width: number;
  position: number; // 0-100 процент позиции индикатора для успешного бурения
  perfectZone: { start: number; end: number }; // Зона для идеального тайминга
}

interface GameStats {
  depth: number;
  score: number;
  lives: number;
  perfectHits: number;
  combo: number;
  maxCombo: number;
}

export default function SpeedDrill() {
  const { user } = useAuth();
  const { addIncome } = useGameData();
  const sounds = useSound();
  const { toast } = useToast();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [currentLayer, setCurrentLayer] = useState(0);
  const [indicator, setIndicator] = useState(50);
  const [indicatorDirection, setIndicatorDirection] = useState(1);
  const [drillAnimation, setDrillAnimation] = useState(false);
  const [hitFeedback, setHitFeedback] = useState<'perfect' | 'good' | 'bad' | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [shake, setShake] = useState(false);
  
  const [stats, setStats] = useState<GameStats>({
    depth: 0,
    score: 0,
    lives: 3,
    perfectHits: 0,
    combo: 0,
    maxCombo: 0
  });
  
  const indicatorSpeed = useRef(1.5);
  const animationFrame = useRef<number>();
  const particleId = useRef(0);

  // Создание частиц
  const createParticles = (count: number, color: string, x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleId.current++,
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 2,
        color,
        size: Math.random() * 8 + 4,
        life: 1
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // Анимация частиц
  useEffect(() => {
    if (particles.length === 0) return;

    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.3,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    };

    const interval = setInterval(animate, 16);
    return () => clearInterval(interval);
  }, [particles.length]);

  // Генерация слоя
  const generateLayer = (depth: number): Layer => {
    const random = Math.random();
    let type: LayerType = 'safe';
    
    // Сложность растет с глубиной
    const difficultyFactor = Math.min(depth / 50, 1);
    
    if (depth % 10 === 0 && depth > 0) {
      type = 'gold'; // Бонусный слой каждые 10 метров
    } else if (random < 0.15 + difficultyFactor * 0.15) {
      type = 'rock';
    } else if (random < 0.25 + difficultyFactor * 0.1) {
      type = 'water';
    } else if (random < 0.35 + difficultyFactor * 0.05) {
      type = 'gas';
    }
    
    const position = 20 + Math.random() * 60; // Позиция целевой зоны
    const zoneSize = type === 'gold' ? 15 : Math.max(15 - difficultyFactor * 5, 8);
    
    return {
      type,
      depth,
      width: 100,
      position,
      perfectZone: {
        start: position - zoneSize / 2,
        end: position + zoneSize / 2
      }
    };
  };

  // Инициализация игры
  const startGame = () => {
    const newLayers: Layer[] = [];
    for (let i = 0; i < 100; i++) {
      newLayers.push(generateLayer(i));
    }
    
    setLayers(newLayers);
    setCurrentLayer(0);
    setIndicator(50);
    setIndicatorDirection(1);
    setIsPlaying(true);
    setGameOver(false);
    setStats({
      depth: 0,
      score: 0,
      lives: 3,
      perfectHits: 0,
      combo: 0,
      maxCombo: 0
    });
    indicatorSpeed.current = 1.5;
  };

  // Анимация индикатора
  useEffect(() => {
    if (!isPlaying || gameOver) {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      return;
    }

    const animate = () => {
      setIndicator(prev => {
        let next = prev + indicatorDirection * indicatorSpeed.current;
        
        if (next >= 95) {
          next = 95;
          setIndicatorDirection(-1);
        } else if (next <= 5) {
          next = 5;
          setIndicatorDirection(1);
        }
        
        return next;
      });
      
      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isPlaying, gameOver, indicatorDirection]);

  // Обработка бурения
  const handleDrill = useCallback(() => {
    if (!isPlaying || gameOver || drillAnimation) return;

    const layer = layers[currentLayer];
    if (!layer) return;

    setDrillAnimation(true);
    setShake(true);
    setTimeout(() => setShake(false), 200);
    sounds.coin();

    // Проверка попадания
    const isInPerfectZone = indicator >= layer.perfectZone.start && indicator <= layer.perfectZone.end;
    const isInGoodZone = indicator >= layer.perfectZone.start - 10 && indicator <= layer.perfectZone.end + 10;

    let pointsEarned = 0;
    let feedback: 'perfect' | 'good' | 'bad' = 'bad';
    let lostLife = false;

    if (layer.type === 'rock' || layer.type === 'water' || layer.type === 'gas') {
      // Опасный слой
      if (isInPerfectZone) {
        // Успешно пробурили опасный слой
        feedback = 'perfect';
        pointsEarned = layer.type === 'rock' ? 50 : layer.type === 'water' ? 30 : 40;
        sounds.success();
        createParticles(20, '#22c55e', 50, 30);
      } else if (isInGoodZone) {
        // Частично успешно
        feedback = 'good';
        pointsEarned = 10;
      } else {
        // Промах - теряем жизнь
        feedback = 'bad';
        lostLife = true;
        sounds.error();
        createParticles(30, '#ef4444', 50, 30);
      }
    } else if (layer.type === 'gold') {
      // Золотой слой - всегда успех, но бонус за точность
      if (isInPerfectZone) {
        feedback = 'perfect';
        pointsEarned = 200;
        sounds.upgrade();
        createParticles(40, '#fbbf24', 50, 30);
      } else if (isInGoodZone) {
        feedback = 'good';
        pointsEarned = 100;
        sounds.success();
      } else {
        feedback = 'good';
        pointsEarned = 50;
      }
    } else {
      // Обычный слой
      if (isInPerfectZone) {
        feedback = 'perfect';
        pointsEarned = 20;
        createParticles(15, '#3b82f6', 50, 30);
      } else if (isInGoodZone) {
        feedback = 'good';
        pointsEarned = 10;
      } else {
        feedback = 'bad';
        pointsEarned = 5;
      }
    }

    setHitFeedback(feedback);

    setStats(prev => {
      const newCombo = feedback === 'perfect' ? prev.combo + 1 : 0;
      const comboMultiplier = Math.floor(newCombo / 3) + 1;
      const finalPoints = pointsEarned * comboMultiplier;
      
      return {
        ...prev,
        depth: prev.depth + 1,
        score: prev.score + finalPoints,
        lives: lostLife ? Math.max(0, prev.lives - 1) : prev.lives,
        perfectHits: feedback === 'perfect' ? prev.perfectHits + 1 : prev.perfectHits,
        combo: newCombo,
        maxCombo: Math.max(prev.maxCombo, newCombo)
      };
    });

    // Увеличиваем сложность
    if ((currentLayer + 1) % 5 === 0) {
      indicatorSpeed.current = Math.min(indicatorSpeed.current + 0.2, 4);
    }

    setTimeout(() => {
      setDrillAnimation(false);
      setHitFeedback(null);
      
      // Проверка конца игры
      if (lostLife && stats.lives <= 1) {
        endGame();
      } else if (currentLayer >= layers.length - 1) {
        endGame(true);
      } else {
        setCurrentLayer(prev => prev + 1);
      }
    }, 500);
  }, [isPlaying, gameOver, drillAnimation, indicator, currentLayer, layers, stats.lives]);

  // Конец игры
  const endGame = async (completed = false) => {
    setIsPlaying(false);
    setGameOver(true);
    
    const finalReward = Math.floor(stats.score * (stats.perfectHits / Math.max(stats.depth, 1)));
    
    if (user && finalReward > 0) {
      try {
        await addIncome(finalReward);
        toast({
          title: completed ? "🎉 Месторождение исчерпано!" : "💥 Игра окончена!",
          description: `Глубина: ${stats.depth}м | Награда: ${finalReward.toLocaleString()} бочек\nМакс комбо: x${stats.maxCombo + 1}`,
          duration: 5000,
        });
      } catch (error) {
        console.error('Error adding reward:', error);
      }
    } else if (finalReward > 0) {
      toast({
        title: completed ? "🎉 Месторождение исчерпано!" : "💥 Игра окончена!",
        description: `Глубина: ${stats.depth}м | Войдите для получения ${finalReward.toLocaleString()} бочек`,
        duration: 5000,
      });
    }
  };

  // Обработка клавиши пробел
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying && !gameOver) {
        e.preventDefault();
        handleDrill();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, handleDrill]);

  const layer = layers[currentLayer];
  const comboMultiplier = Math.floor(stats.combo / 3) + 1;

  // Получить цвет и иконку слоя
  const getLayerInfo = (type: LayerType) => {
    switch (type) {
      case 'rock':
        return { color: 'from-gray-600 to-gray-800', icon: '🪨', name: 'Камень', danger: true };
      case 'water':
        return { color: 'from-blue-500 to-blue-700', icon: '💧', name: 'Вода', danger: true };
      case 'gas':
        return { color: 'from-yellow-500 to-orange-600', icon: '💨', name: 'Газ', danger: true };
      case 'gold':
        return { color: 'from-yellow-400 to-amber-600', icon: '💎', name: 'Золото!', danger: false };
      default:
        return { color: 'from-amber-800 to-amber-950', icon: '⛏️', name: 'Земля', danger: false };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950/20 to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse animation-delay-500" />
      </div>
      
      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.8)] animate-pulse">
            ⚡ БУРЕНИЕ НА СКОРОСТЬ ⚡
          </h1>
          <div className="w-20" />
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/50 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-orange-500/30 rounded-xl">
                <TrendingDown className="h-8 w-8 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
              </div>
              <div>
                <p className="text-xs text-orange-200/70 uppercase tracking-wide">Глубина</p>
                <p className="text-2xl font-bold text-orange-100 drop-shadow-lg">{stats.depth}м</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/20 to-amber-600/10 border-yellow-500/50 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-yellow-500/30 rounded-xl">
                <Trophy className="h-8 w-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
              </div>
              <div>
                <p className="text-xs text-yellow-200/70 uppercase tracking-wide">Очки</p>
                <p className="text-2xl font-bold text-yellow-100 drop-shadow-lg">{stats.score}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/20 to-pink-600/10 border-red-500/50 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-red-500/30 rounded-xl">
                <Heart className="h-8 w-8 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              </div>
              <div>
                <p className="text-xs text-red-200/70 uppercase tracking-wide">Жизни</p>
                <div className="flex gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`h-6 w-6 transition-all ${
                        i < stats.lives 
                          ? 'fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-110' 
                          : 'text-red-900/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-emerald-600/10 border-green-500/50 backdrop-blur-xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-green-500/30 rounded-xl">
                <Target className="h-8 w-8 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
              </div>
              <div>
                <p className="text-xs text-green-200/70 uppercase tracking-wide">Точность</p>
                <p className="text-2xl font-bold text-green-100 drop-shadow-lg">{stats.perfectHits}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-purple-500/20 to-fuchsia-600/10 border-purple-500/50 backdrop-blur-xl ${stats.combo >= 3 ? 'animate-pulse ring-2 ring-purple-400' : ''}`}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-3 bg-purple-500/30 rounded-xl">
                <Flame className="h-8 w-8 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
              </div>
              <div>
                <p className="text-xs text-purple-200/70 uppercase tracking-wide">Комбо</p>
                <p className="text-2xl font-bold text-purple-100 drop-shadow-lg">
                  {stats.combo > 0 ? `x${comboMultiplier} 🔥` : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border-2 border-orange-500/30 shadow-2xl shadow-orange-500/20">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                {!isPlaying && !gameOver && "Нажмите 'Начать' для старта"}
                {isPlaying && layer && (
                  <div className="flex items-center justify-center gap-3 animate-fade-in">
                    <span className="text-4xl drop-shadow-lg">{getLayerInfo(layer.type).icon}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 drop-shadow-lg">
                      {getLayerInfo(layer.type).name}
                    </span>
                    {getLayerInfo(layer.type).danger && (
                      <Badge variant="destructive" className="animate-pulse text-sm px-3 py-1">
                        ⚠️ ОПАСНО!
                      </Badge>
                    )}
                  </div>
                )}
                {gameOver && "Игра окончена!"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isPlaying && !gameOver ? (
                <div className="text-center space-y-4 py-12">
                  <div className="text-6xl mb-4">⛏️</div>
                  <Button onClick={startGame} size="lg" className="px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Начать бурение
                  </Button>
                  
                  <div className="mt-8 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 text-left max-w-md mx-auto">
                    <h3 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Как играть:
                    </h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <span className="text-green-400">✓</span>
                        <span>Нажимай пробел или кнопку когда индикатор в зеленой зоне</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400">⚠️</span>
                        <span>Избегай камни 🪨, воду 💧 и газ 💨</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-400">💎</span>
                        <span>Золотые слои дают бонусные очки</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-purple-400">🔥</span>
                        <span>Комбо точных попаданий = множитель очков</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-400">❤️</span>
                        <span>3 жизни - промах по опасному слою = -1 жизнь</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : gameOver ? (
                <div className="text-center space-y-4 py-12">
                  <div className="text-6xl mb-4">🏁</div>
                  <h2 className="text-3xl font-bold mb-4">Бурение завершено!</h2>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Глубина</p>
                        <p className="text-2xl font-bold">{stats.depth}м</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Очки</p>
                        <p className="text-2xl font-bold">{stats.score}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Точных попаданий</p>
                        <p className="text-2xl font-bold">{stats.perfectHits}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Макс комбо</p>
                        <p className="text-2xl font-bold">x{stats.maxCombo + 1}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Button onClick={startGame} size="lg" className="mt-6">
                    Играть снова
                  </Button>
                </div>
              ) : (
                <>
                  {/* Drill Area */}
                  <div className={`relative ${shake ? 'animate-shake' : ''}`}>
                    {/* Particles */}
                    <div className="absolute inset-0 pointer-events-none z-30">
                      {particles.map(particle => (
                        <div
                          key={particle.id}
                          className="absolute rounded-full"
                          style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            opacity: particle.life,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                      ))}
                    </div>

                    {/* Layer Display */}
                    {layer && (
                      <div className={`h-40 rounded-xl bg-gradient-to-b ${getLayerInfo(layer.type).color} p-6 flex items-center justify-center text-7xl relative overflow-hidden shadow-2xl border-2 ${
                        getLayerInfo(layer.type).danger ? 'border-red-500/50' : 'border-emerald-500/30'
                      }`}>
                        {/* Animated background layers */}
                        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/40"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)]"></div>
                        
                        {/* Animated scan lines */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-white to-transparent animate-scan-line" />
                        </div>
                        
                        {/* Icon */}
                        <div className={`relative z-10 ${drillAnimation ? 'animate-drill-impact' : 'animate-float'} drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]`}>
                          {getLayerInfo(layer.type).icon}
                        </div>
                        
                        {/* Glow effect */}
                        {getLayerInfo(layer.type).danger && (
                          <div className="absolute inset-0 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                          </div>
                        )}
                        
                        {/* Target Zone Visualization */}
                        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-red-600/40 via-red-500/40 to-red-600/40 shadow-inner">
                          <div
                            className="absolute h-full bg-gradient-to-r from-yellow-500/60 to-yellow-400/60 shadow-lg"
                            style={{
                              left: `${layer.perfectZone.start - 10}%`,
                              width: '20%'
                            }}
                          />
                          <div
                            className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-400 shadow-[0_0_15px_rgba(34,197,94,0.8)] animate-pulse"
                            style={{
                              left: `${layer.perfectZone.start}%`,
                              width: `${layer.perfectZone.end - layer.perfectZone.start}%`
                            }}
                          />
                          <div
                            className="absolute h-full bg-gradient-to-r from-yellow-400/60 to-yellow-500/60 shadow-lg"
                            style={{
                              left: `${layer.perfectZone.end}%`,
                              width: '10%'
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Timing Indicator */}
                    <div className="mt-6 relative h-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border-2 border-cyan-500/30 overflow-hidden shadow-2xl shadow-cyan-500/20">
                      {/* Grid pattern background */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px)',
                          backgroundSize: '20px 20px'
                        }} />
                      </div>

                      {/* Speed zones visualization */}
                      <div className="absolute inset-0 flex">
                        <div className="flex-1 bg-gradient-to-r from-red-500/10 to-transparent" />
                        <div className="flex-1 bg-gradient-to-r from-transparent via-green-500/10 to-transparent" />
                        <div className="flex-1 bg-gradient-to-r from-transparent to-red-500/10" />
                      </div>
                      
                      {/* Moving indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-1 transition-all duration-75"
                        style={{ left: `${indicator}%`, transform: 'translateX(-50%)' }}
                      >
                        {/* Glow trail effect */}
                        <div className="absolute top-0 bottom-0 -left-2 w-5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent blur-xl" />
                        
                        {/* Main indicator line */}
                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-cyan-300 via-cyan-400 to-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                        
                        {/* Top arrow */}
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <div className="relative">
                            <div className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-l-transparent border-r-transparent border-b-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full blur-sm" />
                          </div>
                        </div>

                        {/* Bottom arrow */}
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                          <div className="relative">
                            <div className="w-0 h-0 border-l-6 border-r-6 border-t-10 border-l-transparent border-r-transparent border-t-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-cyan-400 rounded-full blur-sm" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Speed indicator badge */}
                      <div className="absolute top-2 left-3">
                        <Badge className="bg-slate-800/90 text-cyan-400 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 text-xs px-3 py-1">
                          <Zap className="h-3 w-3 mr-1" />
                          {indicatorSpeed.current.toFixed(1)}x
                        </Badge>
                      </div>

                      {/* Depth indicator badge */}
                      <div className="absolute top-2 right-3">
                        <Badge className="bg-slate-800/90 text-orange-400 border border-orange-500/50 shadow-lg shadow-orange-500/20 text-xs px-3 py-1">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {stats.depth}м
                        </Badge>
                      </div>
                    </div>

                    {/* Hit Feedback */}
                    {hitFeedback && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 animate-scale-in">
                        <div className={`text-6xl font-black ${
                          hitFeedback === 'perfect' ? 'text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,1)]' :
                          hitFeedback === 'good' ? 'text-yellow-400 drop-shadow-[0_0_30px_rgba(234,179,8,1)]' :
                          'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)]'
                        } animate-bounce`}>
                          {hitFeedback === 'perfect' ? '🎯 ИДЕАЛЬНО!' :
                           hitFeedback === 'good' ? '👍 ХОРОШО!' :
                           '💥 ПРОМАХ!'}
                        </div>
                        {hitFeedback === 'perfect' && (
                          <div className="absolute inset-0 animate-ping">
                            <div className="w-full h-full rounded-full bg-green-400/30" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Drill Button */}
                  <Button
                    onClick={handleDrill}
                    disabled={drillAnimation}
                    size="lg"
                    className="w-full h-20 text-2xl font-black relative overflow-hidden group bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 border-2 border-orange-400/50 shadow-2xl shadow-orange-500/50 transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 drop-shadow-lg">
                      {drillAnimation ? '⚙️ БУРЕНИЕ...' : '⚡ БУРИТЬ (ПРОБЕЛ) ⚡'}
                    </span>
                  </Button>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Глубина: {stats.depth}м / 100м</span>
                      <span>{Math.round((stats.depth / 100) * 100)}%</span>
                    </div>
                    <Progress value={(stats.depth / 100) * 100} className="h-2" />
                  </div>

                  {/* Combo Display */}
                  {stats.combo >= 3 && (
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 animate-pulse blur-xl" />
                      <div className="relative text-center p-6 bg-gradient-to-r from-purple-600/20 via-fuchsia-600/20 to-pink-600/20 rounded-xl border-2 border-purple-400 shadow-2xl shadow-purple-500/50 backdrop-blur-xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.2),transparent)]" />
                        <p className="relative text-4xl font-black bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse">
                          🔥 КОМБО x{comboMultiplier}! 🔥
                        </p>
                        <p className="relative text-sm text-purple-200 mt-2 font-semibold">
                          {stats.combo} точных попаданий подряд
                        </p>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <div className="w-16 h-16 bg-purple-500/30 rounded-full blur-2xl animate-ping" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}