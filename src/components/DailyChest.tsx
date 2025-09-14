import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Calendar, Flame, Crown, Star, Coins, Zap } from "lucide-react";
import { useGameData } from '@/hooks/useGameData';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/useSound';
import { supabase } from '@/integrations/supabase/client';

export interface DailyReward {
  day: number;
  type: 'money' | 'booster' | 'multiplier';
  amount: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const dailyRewards: DailyReward[] = [
  // День 1-7 (Первая неделя)
  { day: 1, type: 'money', amount: 5000, name: 'Стартовый бонус', description: '5,000 OC', icon: <Coins className="h-6 w-6" />, rarity: 'common' },
  { day: 2, type: 'money', amount: 7500, name: 'Ежедневная награда', description: '7,500 OC', icon: <Coins className="h-6 w-6" />, rarity: 'common' },
  { day: 3, type: 'money', amount: 10000, name: 'Тройной бонус', description: '10,000 OC', icon: <Coins className="h-6 w-6" />, rarity: 'rare' },
  { day: 4, type: 'money', amount: 15000, name: 'Четвертый день', description: '15,000 OC', icon: <Coins className="h-6 w-6" />, rarity: 'rare' },
  { day: 5, type: 'money', amount: 20000, name: 'Пятничный бонус', description: '20,000 OC', icon: <Coins className="h-6 w-6" />, rarity: 'epic' },
  { day: 6, type: 'money', amount: 30000, name: 'Выходной бонус', description: '30,000 OC', icon: <Coins className="h-6 w-6" />, rarity: 'epic' },
  { day: 7, type: 'money', amount: 50000, name: 'Недельный джекпот!', description: '50,000 OC', icon: <Crown className="h-6 w-6" />, rarity: 'legendary' },
  
  // День 8-14 (Вторая неделя - увеличенные награды)
  { day: 8, type: 'money', amount: 60000, name: 'Второй круг', description: '60,000 OC', icon: <Star className="h-6 w-6" />, rarity: 'epic' },
  { day: 9, type: 'money', amount: 70000, name: 'Верный игрок', description: '70,000 OC', icon: <Star className="h-6 w-6" />, rarity: 'epic' },
  { day: 10, type: 'money', amount: 90000, name: 'Десятый день', description: '90,000 OC', icon: <Star className="h-6 w-6" />, rarity: 'legendary' },
  { day: 11, type: 'money', amount: 110000, name: 'Одиннадцать дней', description: '110,000 OC', icon: <Star className="h-6 w-6" />, rarity: 'legendary' },
  { day: 12, type: 'money', amount: 130000, name: 'Дюжина дней', description: '130,000 OC', icon: <Crown className="h-6 w-6" />, rarity: 'legendary' },
  { day: 13, type: 'money', amount: 150000, name: 'Тринадцать дней', description: '150,000 OC', icon: <Crown className="h-6 w-6" />, rarity: 'legendary' },
  { day: 14, type: 'money', amount: 200000, name: 'Двойная неделя!', description: '200,000 OC + Особый бонус!', icon: <Crown className="h-6 w-6" />, rarity: 'legendary' },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'shadow-lg shadow-yellow-500/30 animate-glow-pulse';
    case 'epic': return 'shadow-lg shadow-purple-500/20';
    case 'rare': return 'shadow-md shadow-blue-500/20';
    default: return '';
  }
};

export const DailyChest = () => {
  const { profile, addIncome } = useGameData();
  const { toast } = useToast();
  const sounds = useSound();
  const [showReward, setShowReward] = useState<DailyReward | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');

  const currentStreak = profile?.daily_chest_streak || 0;
  const totalOpened = profile?.total_daily_chests_opened || 0;

  useEffect(() => {
    checkClaimability();
    const interval = setInterval(checkClaimability, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [profile]);

  const checkClaimability = () => {
    if (!profile?.last_daily_chest_claim) {
      setCanClaim(true);
      setTimeUntilNext('');
      return;
    }

    const lastClaim = new Date(profile.last_daily_chest_claim);
    const now = new Date();
    const tomorrow = new Date(lastClaim);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (now >= tomorrow) {
      setCanClaim(true);
      setTimeUntilNext('');
    } else {
      setCanClaim(false);
      const timeLeft = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      setTimeUntilNext(`${hours}ч ${minutes}м`);
    }
  };

  const claimDailyReward = async () => {
    if (!profile || !canClaim) return;

    setIsOpening(true);
    sounds.caseOpen();

    try {
      const now = new Date();
      const lastClaim = profile.last_daily_chest_claim ? new Date(profile.last_daily_chest_claim) : null;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);

      // Определяем новый streak
      let newStreak = currentStreak;
      if (!lastClaim || lastClaim.toDateString() === yesterday.toDateString()) {
        // Продолжаем серию или начинаем новую
        newStreak = currentStreak + 1;
      } else {
        // Серия прервана, начинаем заново
        newStreak = 1;
      }

      // Получаем награду на основе streak (с циклом каждые 14 дней)
      const rewardDay = ((newStreak - 1) % 14) + 1;
      const reward = dailyRewards.find(r => r.day === rewardDay) || dailyRewards[0];

      // Обновляем профиль
      const { error } = await supabase
        .from('profiles')
        .update({
          last_daily_chest_claim: now.toISOString(),
          daily_chest_streak: newStreak,
          total_daily_chests_opened: totalOpened + 1
        })
        .eq('user_id', profile.user_id);

      if (error) throw error;

      // Даем награду
      await addIncome(reward.amount);

      setTimeout(() => {
        sounds.success();
        setShowReward(reward);
        setIsOpening(false);
        setCanClaim(false);
      }, 2000);

    } catch (error) {
      console.error('Error claiming daily reward:', error);
      sounds.error();
      setIsOpening(false);
      toast({
        title: "Ошибка",
        description: "Не удалось получить награду",
        variant: "destructive"
      });
    }
  };

  const closeDialog = () => {
    setShowReward(null);
    checkClaimability();
  };

  const nextReward = dailyRewards[((currentStreak) % 14)];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold heading-contrast mb-2">🎁 Ежедневный сундук</h2>
        <p className="text-muted-foreground subtitle-contrast">
          Возвращайтесь каждый день за наградами! Серия: <Badge className="gradient-gold text-primary-foreground">{currentStreak} дней</Badge>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Основной сундук */}
        <Card className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${canClaim ? 'animate-glow-pulse' : ''}`}>
          <div className="absolute top-0 left-0 w-full h-1 gradient-gold"></div>
          
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-3">
              <div className={`p-6 rounded-full ${canClaim ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-500/20 text-gray-400'} ${canClaim ? 'animate-bounce' : ''}`}>
                <Gift className="h-12 w-12" />
              </div>
            </div>
            <CardTitle className="text-xl">
              {canClaim ? 'Сундук готов!' : 'Сундук заблокирован'}
            </CardTitle>
            <CardDescription>
              {canClaim ? 
                `День ${currentStreak + 1} - Получите награду!` : 
                `Следующая награда через: ${timeUntilNext}`
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Серия дней: {currentStreak}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <span className="text-sm">Всего сундуков: {totalOpened}</span>
                </div>
              </div>
            </div>

            {nextReward && (
              <div className="text-center space-y-2">
                <div className="text-sm font-medium">Следующая награда:</div>
                <div className={`flex items-center justify-center space-x-2 p-2 rounded ${getRarityColor(nextReward.rarity)}`}>
                  {nextReward.icon}
                  <span className="text-sm">{nextReward.name}</span>
                </div>
              </div>
            )}

            <Button
              className={`w-full ${canClaim ? 'gradient-gold text-primary-foreground hover:scale-105' : 'opacity-50 cursor-not-allowed'} transition-all`}
              onClick={claimDailyReward}
              disabled={!canClaim || isOpening}
            >
              <Gift className="h-4 w-4 mr-2" />
              {canClaim ? (isOpening ? 'Открываем...' : 'Открыть сундук') : 'Недоступно'}
            </Button>
          </CardContent>
        </Card>

        {/* Календарь наград */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Календарь наград
            </CardTitle>
            <CardDescription>Награды за каждый день (цикл 14 дней)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {dailyRewards.slice(0, 14).map((reward) => {
                const dayNum = ((currentStreak - 1) % 14) + 1;
                const isToday = reward.day === dayNum + 1;
                const isPast = reward.day <= dayNum;
                
                return (
                  <div
                    key={reward.day}
                    className={`
                      p-2 rounded text-center transition-all
                      ${isPast ? 'bg-green-500/20 text-green-300' : ''}
                      ${isToday ? 'bg-yellow-500/20 text-yellow-300 animate-glow-pulse' : ''}
                      ${!isPast && !isToday ? 'bg-muted/30 text-muted-foreground' : ''}
                    `}
                  >
                    <div className="font-medium">День {reward.day}</div>
                    <div className="flex justify-center mt-1">
                      {React.cloneElement(reward.icon as React.ReactElement, { className: 'h-3 w-3' })}
                    </div>
                    <div className="mt-1">{reward.amount.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Диалог получения награды */}
      <Dialog open={!!showReward} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              🎉 Ежедневная награда получена!
            </DialogTitle>
            <DialogDescription className="text-center">
              День {currentStreak + 1} завершен
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-6">
            {showReward && (
              <div className="text-center space-y-4 animate-bounce-in">
                <div className={`inline-flex p-6 rounded-full ${getRarityColor(showReward.rarity)} ${getRarityGlow(showReward.rarity)}`}>
                  {showReward.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold animate-fade-in">{showReward.name}</h3>
                  <p className="text-sm text-muted-foreground animate-fade-in">{showReward.description}</p>
                  <Badge className={`${getRarityColor(showReward.rarity)} mt-2 animate-scale-in`}>
                    Награда дня {showReward.day}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <Button onClick={closeDialog} className="w-full gradient-gold text-primary-foreground">
            Продолжить игру
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};