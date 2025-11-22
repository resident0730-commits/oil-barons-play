import { useState, useEffect } from 'react';
import { TrendingUp, Users, Lightbulb, Fuel, Crown, Sparkles } from 'lucide-react';
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
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/50 shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
          <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
          
          <CardContent className="relative z-10 pt-8 pb-8 space-y-6">
            {/* Logo and Title */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="relative group animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative p-3 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full border border-primary/30">
                    <Crown className="h-8 w-8 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
                  Oil Tycoon
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 text-accent/70" />
                  <p className="text-lg font-medium text-foreground/90">
                    {!user ? 'Проверка авторизации...' : 
                     user && !profile ? 'Загрузка профиля...' : 
                     'Подготовка игры...'}
                  </p>
                  <Sparkles className="h-4 w-4 text-accent/70" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-3 bg-secondary/50 shadow-inner border border-primary/20"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-sm opacity-50"></div>
              </div>
              <p className="text-center text-sm text-muted-foreground font-semibold">
                {Math.min(Math.round(progress), 95)}%
              </p>
            </div>

            {/* Loading Tip */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-lg p-4 border border-primary/20 min-h-[70px] flex items-center justify-center">
              <div className="absolute top-0 left-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent/10 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex items-center gap-3">
                <Lightbulb className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-center text-foreground/90 font-medium animate-fade-in">
                  {loadingTips[currentTip]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        {!limitLoading && !statsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {/* Active Players */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/40 hover:border-emerald-400 transition-all shadow-lg hover:shadow-emerald-500/20 animate-fade-in">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 rounded-full blur-2xl -translate-y-10 translate-x-10 animate-pulse"></div>
              <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
              <CardContent className="relative z-10 pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/30 to-green-500/30 border border-emerald-400/30">
                    <Users className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-emerald-100/70 font-medium">Игроков онлайн</p>
                    <p className="text-xl font-bold text-emerald-200">
                      <AnimatedCounter end={currentPlayers} duration={1500} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Wells */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary transition-all shadow-lg hover:shadow-primary/20 animate-fade-in">
              <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 rounded-full blur-2xl -translate-y-10 translate-x-10 animate-pulse"></div>
              <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
              <CardContent className="relative z-10 pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30">
                    <Fuel className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-primary/70 font-medium">Всего скважин</p>
                    <p className="text-xl font-bold text-foreground">
                      <AnimatedCounter end={totalWells} duration={1500} />
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Average Profit */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/40 hover:border-amber-400 transition-all shadow-lg hover:shadow-amber-500/20 animate-fade-in">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/20 rounded-full blur-2xl -translate-y-10 translate-x-10 animate-pulse"></div>
              <div className="absolute inset-0 border border-white/5 rounded-lg"></div>
              <CardContent className="relative z-10 pt-6 pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border border-amber-400/30">
                    <TrendingUp className="h-5 w-5 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-amber-100/70 font-medium">Средняя прибыль</p>
                    <p className="text-xl font-bold text-amber-200">
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
