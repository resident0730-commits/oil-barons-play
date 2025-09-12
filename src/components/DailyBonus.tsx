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
  const [bonusAmount] = useState(100); // Ежедневный бонус

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
        .select('last_bonus_claim')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const lastClaim = profile.last_bonus_claim ? new Date(profile.last_bonus_claim) : null;
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
      // Обновляем баланс и время последнего бонуса
      const { error } = await supabase
        .from('profiles')
        .update({
          balance: supabase.sql`balance + ${bonusAmount}`,
          last_bonus_claim: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Ежедневный бонус получен!",
        description: `+${bonusAmount} монет добавлено на баланс`,
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
    <Card className="gradient-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Gift className="h-4 w-4" />
          Ежедневный бонус
        </CardTitle>
        <Coins className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{bonusAmount}</div>
            <p className="text-xs text-muted-foreground">
              Игровых монет каждый день
            </p>
          </div>
          <div className="text-right">
            {canClaim ? (
              <Button onClick={claimBonus} variant="gold" size="sm">
                Получить
              </Button>
            ) : (
              <div className="text-center">
                <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                <div className="text-xs text-muted-foreground">
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