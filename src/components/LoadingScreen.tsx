import { useState, useEffect } from 'react';
import { Fuel, TrendingUp, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { usePlayerLimit } from '@/hooks/usePlayerLimit';
import { useGameStatistics } from '@/hooks/useGameStatistics';
import { OilParticles } from '@/components/OilParticles';

interface LoadingScreenProps {
  user?: any;
  profile?: any;
}

const loadingTips = [
  "Модернизируйте скважины для увеличения прибыли",
  "Используйте бустеры в правильный момент",
  "Приглашайте друзей и получайте бонусы",
  "Собирайте ежедневные награды",
  "Следите за рейтингом лидеров",
  "Покупайте пакеты для быстрого старта",
  "Развивайте свою нефтяную империю",
];

export const LoadingScreen = ({ user, profile }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const { currentPlayers, progressPercentage, loading: limitLoading } = usePlayerLimit();
  const { statistics, loading: statsLoading } = useGameStatistics();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % loadingTips.length);
    }, 3000);

    return () => clearInterval(tipTimer);
  }, []);

  const totalWells = statistics.total_wells ?? 0;
  const averageProfit = statistics.average_profit ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95 flex items-center justify-center relative overflow-hidden">
      <OilParticles />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
      
      <div className="relative z-10 w-full max-w-2xl px-6 space-y-8 animate-fade-in">
        {/* Main Loading Card */}
        <Card className="bg-card/80 backdrop-blur-xl border-primary/20 shadow-2xl">
          <CardContent className="pt-8 pb-8 space-y-6">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <Fuel className="h-20 w-20 text-primary mx-auto animate-pulse drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]" />
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent">
                  Oil Tycoon
                </h2>
                <p className="text-lg font-medium text-foreground/90">
                  {!user ? 'Проверка авторизации...' : 
                   user && !profile ? 'Загрузка профиля...' : 
                   'Подготовка игры...'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <Progress 
                value={progress} 
                className="h-3 bg-secondary/50 shadow-inner"
              />
              <p className="text-center text-sm text-muted-foreground">
                {Math.min(Math.round(progress), 95)}%
              </p>
            </div>

            {/* Loading Tip */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 min-h-[60px] flex items-center justify-center">
              <p className="text-sm text-center text-foreground/80 animate-fade-in">
                💡 {loadingTips[currentTip]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {!limitLoading && !statsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {/* Active Players */}
            <Card className="bg-card/60 backdrop-blur-lg border-primary/10 hover:border-primary/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Игроков онлайн</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedCounter end={currentPlayers} duration={1500} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Wells */}
            <Card className="bg-card/60 backdrop-blur-lg border-primary/10 hover:border-primary/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Всего скважин</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedCounter end={totalWells} duration={1500} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Profit */}
            <Card className="bg-card/60 backdrop-blur-lg border-primary/10 hover:border-primary/30 transition-all">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Средняя прибыль</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedCounter end={Math.round(averageProfit)} duration={1500} suffix="₽" />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
