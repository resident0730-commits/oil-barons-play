import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Clock, Coins, Star, Flame, Calendar, Gem, Trophy, Crown, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AnimatedCounter } from '@/components/AnimatedCounter';

// Система прогрессии бонусов от 100 до 1400 OC за 7 дней
const DAILY_REWARDS = [
  { day: 1, amount: 100, icon: Coins, color: 'text-yellow-400', bgColor: 'from-yellow-500/30 to-yellow-400/20' },
  { day: 2, amount: 200, icon: Gem, color: 'text-cyan-400', bgColor: 'from-cyan-500/30 to-cyan-400/20' },
  { day: 3, amount: 400, icon: Gift, color: 'text-pink-400', bgColor: 'from-pink-500/30 to-pink-400/20' },
  { day: 4, amount: 600, icon: Trophy, color: 'text-amber-400', bgColor: 'from-amber-500/30 to-amber-400/20' },
  { day: 5, amount: 800, icon: Sparkles, color: 'text-purple-400', bgColor: 'from-purple-500/30 to-purple-400/20' },
  { day: 6, amount: 1000, icon: Zap, color: 'text-orange-400', bgColor: 'from-orange-500/30 to-orange-400/20' },
  { day: 7, amount: 1400, icon: Crown, color: 'text-yellow-300', bgColor: 'from-yellow-500/40 to-amber-500/30' }
];

export function DailyBonus() {
  const { user } = useAuth();
  const { formatOilCoins } = useCurrency();
  const { toast } = useToast();
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoursUntilReset, setHoursUntilReset] = useState(24);
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);
  const [claimedAmount, setClaimedAmount] = useState(0);

  useEffect(() => {
    if (user) {
      checkBonusAvailability();
      const interval = setInterval(updateTimeUntilNext, 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Проверяем, нужно ли показать предупреждение о сбросе
  useEffect(() => {
    if (!canClaim && currentStreak > 0 && hoursUntilReset <= 3 && !hasShownWarning) {
      toast({
        title: "Внимание! Серия под угрозой!",
        description: `Осталось ${hoursUntilReset}ч до сброса серии. Не забудь забрать награду!`,
        variant: "destructive",
        duration: 10000,
      });
      setHasShownWarning(true);
    }
  }, [canClaim, currentStreak, hoursUntilReset, hasShownWarning]);

  const updateTimeUntilNext = () => {
    if (canClaim) return;
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    setHoursUntilReset(hours);
    setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const checkBonusAvailability = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('last_bonus_claim, daily_chest_streak')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const lastClaim = profile.last_bonus_claim ? new Date(profile.last_bonus_claim) : null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        let streak = profile.daily_chest_streak || 0;
        
        if (lastClaim) {
          const lastClaimDate = new Date(lastClaim.getFullYear(), lastClaim.getMonth(), lastClaim.getDate());
          const daysDiff = Math.floor((today.getTime() - lastClaimDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff === 0) {
            // Уже забрали сегодня
            setCanClaim(false);
            setCurrentStreak(streak);
          } else if (daysDiff === 1) {
            // Прошел ровно один день - можно забрать
            setCanClaim(true);
            setCurrentStreak(streak);
          } else {
            // Пропустили дни - streak сбрасывается
            streak = 0;
            setCanClaim(true);
            setCurrentStreak(0);
            
            // Обновляем streak в базе
            await supabase
              .from('profiles')
              .update({ daily_chest_streak: 0 })
              .eq('user_id', user.id);
          }
        } else {
          // Первый раз забираем бонус
          setCanClaim(true);
          setCurrentStreak(0);
        }
      }
    } catch (error) {
      console.error('Ошибка проверки бонуса:', error);
    } finally {
      setLoading(false);
    }
  };

  const claimBonus = async () => {
    if (!user || !canClaim) return;

    try {
      // Получаем текущий профиль
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('balance, daily_chest_streak')
        .eq('user_id', user.id)
        .single();

      if (!currentProfile) return;

      // Рассчитываем новый streak (1-7 циклично)
      const newStreak = ((currentProfile.daily_chest_streak || 0) % 7) + 1;
      const reward = DAILY_REWARDS[newStreak - 1];

      // Обновляем баланс, streak и время последнего получения
      const { error } = await supabase
        .from('profiles')
        .update({
          balance: currentProfile.balance + reward.amount,
          daily_chest_streak: newStreak,
          last_bonus_claim: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setClaimedAmount(reward.amount);
      setJustClaimed(true);
      
      // Убираем анимацию через 3 секунды
      setTimeout(() => {
        setJustClaimed(false);
      }, 3000);

      toast({
        title: `День ${newStreak}! Бонус получен!`,
        description: `+${formatOilCoins(reward.amount)} добавлено на баланс`,
      });

      setCanClaim(false);
      setCurrentStreak(newStreak);
      setHasShownWarning(false); // Сбрасываем флаг предупреждения после получения бонуса
      checkBonusAvailability();
    } catch (error) {
      console.error('Ошибка получения бонуса:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить бонус",
        variant: "destructive",
      });
    }
  };

  if (!user || loading) {
    return (
      <Card className="border-primary/30 shadow-luxury">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3 mx-auto"></div>
            <div className="h-12 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Рассчитываем следующий бонус
  const nextDay = (currentStreak % 7) + 1;
  const nextReward = DAILY_REWARDS[nextDay - 1];
  const currentReward = DAILY_REWARDS[currentStreak > 0 ? currentStreak - 1 : 0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-2">
      {/* Основная карточка с улучшенными эффектами */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/95 border-primary/40 shadow-2xl">
        {/* Animated background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-accent/10 animate-pulse"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-radial from-primary/30 via-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-radial from-accent/20 via-accent/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <CardHeader className="relative z-10 text-center pb-6 pt-8">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3">
            Ежедневные награды
          </CardTitle>
          <p className="text-base text-muted-foreground font-medium">
            Заходи каждый день и получай всё больше монет!
          </p>
          {currentStreak > 0 && (
            <div className="flex flex-col items-center gap-3 mt-4">
              <div className="relative">
                <Badge variant="outline" className="text-lg px-6 py-2 border-2 border-orange-500/60 bg-gradient-to-r from-orange-500/20 via-orange-400/15 to-orange-500/20 text-orange-300 font-bold shadow-lg">
                  <Flame className="h-5 w-5 mr-2 animate-pulse" />
                  Серия: {currentStreak} {currentStreak === 7 && <Crown className="h-4 w-4 ml-1 inline" />} дней
                </Badge>
                <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"></div>
              </div>
              
              {/* Предупреждение о скором сбросе серии */}
              {!canClaim && hoursUntilReset <= 3 && (
                <div className="relative">
                  <Badge 
                    variant="outline" 
                    className="text-base px-5 py-2 border-2 border-red-500/70 bg-gradient-to-r from-red-500/30 via-red-400/20 to-red-500/30 text-red-300 font-bold animate-pulse shadow-lg shadow-red-500/30"
                  >
                    <Clock className="h-4 w-4 mr-2 inline" />
                    Серия сбросится через {hoursUntilReset}ч! Забери награду!
                  </Badge>
                  <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full"></div>
                </div>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="relative z-10 space-y-8 pb-8">
          {/* Календарь наград с улучшенными эффектами */}
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3 sm:gap-4">
            {DAILY_REWARDS.map((reward) => {
              const isCompleted = currentStreak >= reward.day;
              const isCurrent = !canClaim && currentStreak === reward.day;
              const isNext = canClaim && nextDay === reward.day;
              
              return (
                <div
                  key={reward.day}
                  className={`
                    relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-500 transform
                    ${isCompleted ? 'bg-gradient-to-br from-green-500/30 via-emerald-500/20 to-green-400/20 border-green-400/70 shadow-lg shadow-green-500/30 scale-105' : ''}
                    ${isCurrent ? 'bg-gradient-to-br from-primary/30 via-accent/20 to-primary/20 border-primary/70 ring-4 ring-primary/40 shadow-xl shadow-primary/40 scale-110' : ''}
                    ${isNext ? 'bg-gradient-to-br from-yellow-500/30 via-orange-500/20 to-yellow-400/20 border-yellow-400/70 ring-4 ring-yellow-400/50 animate-pulse shadow-xl shadow-yellow-500/40 scale-110' : ''}
                    ${!isCompleted && !isCurrent && !isNext ? 'bg-gradient-to-br from-muted/40 to-muted/20 border-muted/60 hover:border-muted hover:scale-105' : ''}
                    backdrop-blur-sm hover:shadow-xl cursor-pointer
                  `}
                >
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full p-1.5 shadow-lg shadow-amber-500/50 animate-bounce">
                      <Star className="h-4 w-4 text-white fill-white" />
                    </div>
                  )}
                  {isNext && (
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl blur-md animate-pulse"></div>
                  )}
                  <div className="relative text-center space-y-2">
                    <div className={`${reward.color} drop-shadow-lg transition-all duration-300`}>
                      <reward.icon className="h-8 sm:h-10 w-8 sm:w-10 mx-auto" strokeWidth={2.5} />
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">День {reward.day}</div>
                    <div className={`text-sm sm:text-lg font-bold ${isNext ? 'text-yellow-300' : isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {reward.amount} OC
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Кнопка получения или таймер */}
          <div className="flex flex-col items-center gap-6">
            {canClaim ? (
              <div className="text-center space-y-6 w-full max-w-md mx-auto">
                <div className={`relative p-6 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 rounded-2xl border-2 border-primary/40 shadow-xl backdrop-blur-sm transition-all duration-500 ${
                  justClaimed ? 'scale-110 shadow-2xl shadow-primary/60' : ''
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl"></div>
                  {justClaimed && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40 rounded-2xl animate-ping"></div>
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce">
                        <Sparkles className="h-8 w-8 text-primary-foreground" />
                      </div>
                      <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <Star className="h-8 w-8 text-accent-foreground" />
                      </div>
                    </>
                  )}
                  <div className="relative">
                    <div className="text-sm text-muted-foreground/80 mb-3 uppercase tracking-wider font-semibold">Награда дня {nextDay}</div>
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <nextReward.icon className={`h-12 w-12 ${nextReward.color} drop-shadow-lg transition-transform duration-500 ${
                        justClaimed ? 'scale-125 rotate-12' : ''
                      }`} strokeWidth={2.5} />
                      <div className={`text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent transition-transform duration-500 ${
                        justClaimed ? 'scale-125' : ''
                      }`}>
                        {justClaimed ? (
                          <>+<AnimatedCounter end={claimedAmount} duration={1500} /></>
                        ) : (
                          `+${nextReward.amount}`
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground/70 uppercase tracking-wide font-medium">Oil Coins</div>
                  </div>
                </div>
                
                <Button 
                  onClick={claimBonus} 
                  className="relative w-full sm:w-auto group overflow-hidden gradient-primary text-primary-foreground font-bold px-16 py-7 rounded-2xl text-xl shadow-2xl hover:shadow-primary/60 transition-all duration-300 hover:scale-105 active:scale-95"
                  size="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <Gift className="h-7 w-7 mr-3 relative z-10" />
                  <span className="relative z-10">Забрать награду</span>
                </Button>
              </div>
            ) : (
              <div className={`text-center space-y-4 p-8 rounded-2xl border-2 w-full max-w-md mx-auto transition-all backdrop-blur-sm shadow-xl ${
                hoursUntilReset <= 3 && currentStreak > 0
                  ? 'bg-gradient-to-br from-red-500/30 via-orange-500/20 to-red-500/30 border-red-500/60 ring-4 ring-red-500/30'
                  : 'bg-gradient-to-br from-muted/50 via-secondary/30 to-muted/50 border-primary/30'
              }`}>
                <div className="relative inline-block">
                  <Clock className={`h-12 w-12 mx-auto ${
                    hoursUntilReset <= 3 && currentStreak > 0 
                      ? 'text-red-400 animate-pulse' 
                      : 'text-primary animate-pulse'
                  }`} />
                  {hoursUntilReset <= 3 && currentStreak > 0 && (
                    <div className="absolute inset-0 bg-red-500/30 blur-xl rounded-full"></div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className={`text-base font-bold uppercase tracking-wide ${
                    hoursUntilReset <= 3 && currentStreak > 0 
                      ? 'text-red-300' 
                      : 'text-muted-foreground'
                  }`}>
                    {hoursUntilReset <= 3 && currentStreak > 0 
                      ? 'Срочно! Серия скоро сбросится!' 
                      : 'Следующая награда через'}
                  </div>
                  <div className={`text-4xl font-black font-mono tracking-wider ${
                    hoursUntilReset <= 3 && currentStreak > 0 
                      ? 'text-red-400' 
                      : 'bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent'
                  }`}>
                    {timeUntilNext}
                  </div>
                </div>
                {currentStreak > 0 && (
                  <div className="text-sm pt-4 border-t-2 border-muted/40">
                    <div className={hoursUntilReset <= 3 ? 'text-red-200 font-bold flex items-center justify-center gap-2' : 'text-muted-foreground/80 flex items-center justify-center gap-2'}>
                      {hoursUntilReset <= 3 ? (
                        <>
                          <Flame className="h-4 w-4" />
                          Если не заберёшь награду, серия из {currentStreak} дней будет потеряна!
                        </>
                      ) : (
                        <>
                          <Star className="h-4 w-4" />
                          Ты уже получил награду за день {currentStreak}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Информационный блок с улучшенным дизайном */}
          <div className="relative bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-purple-500/20 rounded-2xl p-6 border-2 border-blue-400/40 shadow-lg backdrop-blur-sm">
            <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-radial from-blue-500/30 to-transparent rounded-full blur-2xl"></div>
            <div className="flex items-start gap-4 relative">
              <div className="relative">
                <Star className="h-6 w-6 text-blue-300 mt-1 flex-shrink-0 animate-pulse" />
                <div className="absolute inset-0 bg-blue-400/30 blur-lg rounded-full"></div>
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-base font-bold text-blue-200 flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Как получить максимум?
                </p>
                <ul className="text-sm text-blue-100/90 space-y-2 font-medium">
                  <li className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span>Заходи каждый день, чтобы не сбросить серию</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span>С каждым днём награда становится больше</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Crown className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="font-bold text-yellow-300">На 7-й день получишь максимум — 1400 OC!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Trophy className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                    <span>После 7 дней цикл начинается заново</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}