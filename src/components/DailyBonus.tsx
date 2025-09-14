import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Clock, Coins } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function DailyBonus() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [canClaim, setCanClaim] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');
  const [bonusAmount, setBonusAmount] = useState(100); // Базовый ежедневный бонус
  
  // Динамический расчет бонуса на основе дохода игрока
  const calculateDailyBonus = (dailyIncome: number) => {
    const baseBonus = 100;
    const incomeBonus = Math.floor(dailyIncome * 0.1); // 10% от дневного дохода
    return Math.max(baseBonus, Math.min(incomeBonus, 10000)); // минимум 100, максимум 10000
  };

  useEffect(() => {
    if (user) {
      checkBonusAvailability();
      const interval = setInterval(checkBonusAvailability, 60000); // Проверяем каждую минуту
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkBonusAvailability = async () => {
    if (!user) return;

    try {
      // Получаем профиль пользователя
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const dynamicBonus = calculateDailyBonus(profile.daily_income || 0);
        setBonusAmount(dynamicBonus);
        
        const lastClaim = (profile as any).last_bonus_claim ? new Date((profile as any).last_bonus_claim) : null;
        const now = new Date();
        const tomorrow = new Date();
        
        if (lastClaim) {
          tomorrow.setTime(lastClaim.getTime() + 24 * 60 * 60 * 1000); // 24 часа
        } else {
          tomorrow.setTime(now.getTime() - 1); // Можно забрать сразу
        }

        if (now >= tomorrow) {
          setCanClaim(true);
          setTimeUntilNext('');
        } else {
          setCanClaim(false);
          const diff = tomorrow.getTime() - now.getTime();
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeUntilNext(`${hours}ч ${minutes}м`);
        }
      }
    } catch (error) {
      console.error('Ошибка проверки бонуса:', error);
    }
  };

  const claimBonus = async () => {
    if (!user || !canClaim) return;

    try {
      // Сначала получаем текущий баланс
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('balance')
        .eq('user_id', user.id)
        .single();

      if (!currentProfile) return;

      // Обновляем баланс и время последнего бонуса
      const { error } = await supabase
        .from('profiles')
        .update({
          balance: currentProfile.balance + bonusAmount,
          last_bonus_claim: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Ежедневный бонус получен!",
        description: `+${bonusAmount} оилкоинов добавлено на баланс`,
      });

      setCanClaim(false);
      checkBonusAvailability();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить бонус",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 via-card/95 to-card/90 border-primary/30 shadow-luxury animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/3"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      
      <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-playfair font-semibold flex items-center gap-3 text-foreground">
          <div className="relative">
            <Gift className="h-6 w-6 text-primary drop-shadow-sm" />
            <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full"></div>
          </div>
          Ежедневный бонус
        </CardTitle>
        <div className="relative">
          <Coins className="h-6 w-6 text-accent animate-gold-glow" />
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              +{bonusAmount}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Оилкоинов каждый день
            </p>
          </div>
          
          <div className="text-right">
            {canClaim ? (
              <Button 
                onClick={claimBonus} 
                className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-primary/25 hover:shadow-lg hover-scale"
                size="lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">Получить</span>
              </Button>
            ) : (
              <div className="text-center space-y-2 px-4 py-3 bg-gradient-to-br from-muted/50 to-secondary/30 rounded-lg border border-primary/20">
                <div className="relative">
                  <Clock className="h-5 w-5 mx-auto text-muted-foreground animate-pulse" />
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {timeUntilNext || 'Загрузка...'}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}