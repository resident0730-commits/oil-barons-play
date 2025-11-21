import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Coins, Zap, TrendingUp, Trophy, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  unlocked: boolean;
  iconName: string;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  effect: number;
  iconName: string;
}

export default function Clicker() {
  const { toast } = useToast();
  const [coins, setCoins] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickRate, setAutoClickRate] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const iconMap: Record<string, any> = {
    Zap,
    TrendingUp,
    Coins,
    Star,
    Trophy,
    Sparkles,
  };

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: "click_power",
      name: "Усиленный клик",
      description: "Увеличивает количество монет за клик",
      cost: 50,
      level: 0,
      maxLevel: 10,
      effect: 1,
      iconName: "Zap",
    },
    {
      id: "auto_clicker",
      name: "Автокликер",
      description: "Автоматически собирает монеты каждую секунду",
      cost: 100,
      level: 0,
      maxLevel: 5,
      effect: 0.5,
      iconName: "TrendingUp",
    },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: "first_click", name: "Первый клик", description: "Сделай свой первый клик", requirement: 1, unlocked: false, iconName: "Coins" },
    { id: "beginner", name: "Новичок", description: "Собери 100 монет", requirement: 100, unlocked: false, iconName: "Star" },
    { id: "collector", name: "Коллекционер", description: "Собери 500 монет", requirement: 500, unlocked: false, iconName: "Trophy" },
    { id: "master", name: "Мастер кликов", description: "Сделай 1000 кликов", requirement: 1000, unlocked: false, iconName: "Sparkles" },
    { id: "rich", name: "Богач", description: "Собери 5000 монет", requirement: 5000, unlocked: false, iconName: "Coins" },
  ]);

  // Загрузка прогресса
  useEffect(() => {
    const savedProgress = localStorage.getItem("clickerProgress");
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCoins(progress.coins || 0);
      setTotalClicks(progress.totalClicks || 0);
      setClickPower(progress.clickPower || 1);
      setAutoClickRate(progress.autoClickRate || 0);
      setUpgrades(progress.upgrades || upgrades);
      setAchievements(progress.achievements || achievements);
    }
  }, []);

  // Сохранение прогресса
  useEffect(() => {
    const progress = {
      coins,
      totalClicks,
      clickPower,
      autoClickRate,
      upgrades,
      achievements,
    };
    localStorage.setItem("clickerProgress", JSON.stringify(progress));
  }, [coins, totalClicks, clickPower, autoClickRate, upgrades, achievements]);

  // Автоклик
  useEffect(() => {
    if (autoClickRate > 0) {
      const interval = setInterval(() => {
        setCoins((prev) => prev + autoClickRate);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [autoClickRate]);

  // Проверка достижений
  useEffect(() => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (!achievement.unlocked) {
          const isUnlocked =
            (achievement.id.includes("click") && totalClicks >= achievement.requirement) ||
            (achievement.id !== "master" && coins >= achievement.requirement);
          
          if (isUnlocked) {
            toast({
              title: "🏆 Достижение разблокировано!",
              description: `${achievement.name}: ${achievement.description}`,
            });
          }
          
          return { ...achievement, unlocked: isUnlocked };
        }
        return achievement;
      })
    );
  }, [coins, totalClicks, toast]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newParticle = { id: Date.now(), x, y };
    setParticles((prev) => [...prev, newParticle]);
    
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
    }, 1000);

    setCoins((prev) => prev + clickPower);
    setTotalClicks((prev) => prev + 1);
  };

  const handleUpgrade = (upgradeId: string) => {
    setUpgrades((prev) =>
      prev.map((upgrade) => {
        if (upgrade.id === upgradeId && coins >= upgrade.cost && upgrade.level < upgrade.maxLevel) {
          setCoins((c) => c - upgrade.cost);
          
          if (upgradeId === "click_power") {
            setClickPower((p) => p + upgrade.effect);
          } else if (upgradeId === "auto_clicker") {
            setAutoClickRate((r) => r + upgrade.effect);
          }
          
          return {
            ...upgrade,
            level: upgrade.level + 1,
            cost: Math.floor(upgrade.cost * 1.5),
          };
        }
        return upgrade;
      })
    );
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Назад
            </Button>
          </Link>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            💰 Кликер Монет
          </h1>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm gap-1">
              <Trophy className="h-3 w-3" />
              {unlockedCount}/{achievements.length}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-6xl">
        {/* Основная игровая зона */}
        <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold flex items-center justify-center gap-3">
              <Coins className="h-10 w-10 text-yellow-500 animate-pulse" />
              {Math.floor(coins).toLocaleString()}
              <span className="text-2xl text-muted-foreground">монет</span>
            </CardTitle>
            <CardDescription className="text-lg">
              Клики: {totalClicks.toLocaleString()} | Сила клика: {clickPower} | Автодоход: {autoClickRate}/сек
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative">
              <Button
                onClick={handleClick}
                size="lg"
                className="w-64 h-64 rounded-full text-6xl gradient-primary hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-primary/50 relative overflow-hidden"
              >
                💰
                {particles.map((particle) => (
                  <span
                    key={particle.id}
                    className="absolute text-2xl font-bold text-yellow-300 pointer-events-none animate-fade-out"
                    style={{
                      left: particle.x,
                      top: particle.y,
                      animation: "fade-out 1s ease-out forwards, float 1s ease-out",
                    }}
                  >
                    +{clickPower}
                  </span>
                ))}
              </Button>
            </div>
            <p className="text-muted-foreground animate-pulse">Кликни на монету!</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Улучшения */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Улучшения
              </CardTitle>
              <CardDescription>Улучшай свою игру для большего дохода</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upgrades.map((upgrade) => {
                const Icon = iconMap[upgrade.iconName];
                const canAfford = coins >= upgrade.cost;
                const isMaxLevel = upgrade.level >= upgrade.maxLevel;
                
                return (
                  <div key={upgrade.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <Icon className="h-8 w-8 text-primary" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{upgrade.name}</h3>
                          <Badge variant="outline">{upgrade.level}/{upgrade.maxLevel}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{upgrade.description}</p>
                        <Progress value={(upgrade.level / upgrade.maxLevel) * 100} className="mt-2 h-1" />
                      </div>
                    </div>
                    <Button
                      onClick={() => handleUpgrade(upgrade.id)}
                      disabled={!canAfford || isMaxLevel}
                      variant={canAfford && !isMaxLevel ? "default" : "outline"}
                      className="ml-4 gap-1"
                    >
                      <Coins className="h-4 w-4" />
                      {isMaxLevel ? "MAX" : upgrade.cost}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Достижения
              </CardTitle>
              <CardDescription>
                Разблокировано: {unlockedCount} из {achievements.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement) => {
                const Icon = iconMap[achievement.iconName];
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                      achievement.unlocked
                        ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
                        : "bg-muted/30 opacity-60"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${achievement.unlocked ? "bg-primary/20" : "bg-muted"}`}>
                      <Icon className={`h-6 w-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{achievement.name}</h3>
                        {achievement.unlocked && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
