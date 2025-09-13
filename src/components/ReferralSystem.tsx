import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Referral {
  id: string;
  referred_id: string;
  bonus_earned: number;
  created_at: string;
  is_active: boolean;
}

export const ReferralSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralInput, setReferralInput] = useState("");
  const [totalBonus, setTotalBonus] = useState(0);

  useEffect(() => {
    if (user) {
      fetchReferralData();
      fetchReferrals();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('user_id', user.id)
      .single();

    if (profile?.referral_code) {
      setReferralCode(profile.referral_code);
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setReferrals(data);
      const total = data.reduce((sum, ref) => sum + Number(ref.bonus_earned), 0);
      setTotalBonus(total);
    }
  };

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Реферальный код скопирован!",
        description: "Поделитесь им с друзьями",
      });
    }
  };

  const applyReferralCode = async () => {
    if (!user || !referralInput.trim()) return;

    try {
      // Check if referral code exists and is not user's own
      const { data: referrer } = await supabase
        .from('profiles')
        .select('user_id, referral_code')
        .eq('referral_code', referralInput.trim())
        .single();

      if (!referrer) {
        toast({
          title: "Ошибка",
          description: "Реферальный код не найден",
          variant: "destructive"
        });
        return;
      }

      if (referrer.user_id === user.id) {
        toast({
          title: "Ошибка", 
          description: "Нельзя использовать свой собственный код",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has a referrer
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('referred_by')
        .eq('user_id', user.id)
        .single();

      if (currentProfile?.referred_by) {
        toast({
          title: "Ошибка",
          description: "У вас уже есть реферер",
          variant: "destructive"
        });
        return;
      }

      // Apply referral
      await supabase
        .from('profiles')
        .update({
          referred_by: referrer.user_id,
          referral_bonus_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('user_id', user.id);

      // Create referral record
      await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.user_id,
          referred_id: user.id,
          referral_code: referralInput.trim()
        });

      toast({
        title: "Успех!",
        description: "Реферальный код применен. Вы получите +50% к доходу на 7 дней!",
      });

      setReferralInput("");
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось применить реферальный код",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Реферальная система
          </CardTitle>
          <CardDescription>
            Приглашайте друзей и получайте 10% с их доходов навсегда
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Ваш реферальный код:</label>
            <div className="flex gap-2 mt-1">
              <Input value={referralCode} readOnly />
              <Button onClick={copyReferralCode} size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Применить реферальный код:</label>
            <div className="flex gap-2 mt-1">
              <Input 
                placeholder="Введите код друга"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
              />
              <Button onClick={applyReferralCode} size="sm">
                Применить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Приглашенных</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заработано бонусов</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBonus.toLocaleString()} OC</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных рефферралов</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {referrals.filter(ref => ref.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ваши рефферралы</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              У вас пока нет приглашенных друзей
            </p>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Реферрал #{referral.id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{referral.bonus_earned.toLocaleString()} OC</p>
                    <Badge variant={referral.is_active ? "default" : "secondary"}>
                      {referral.is_active ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Реферальные награды</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between p-2 border rounded">
              <span>5 рефферралов</span>
              <Badge>Бесплатная Starter Well</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>15 рефферралов</span>
              <Badge>Turbo Boost на 30 дней</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>50 рефферралов</span>
              <Badge>Premium Well бесплатно</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>100 рефферралов</span>
              <Badge variant="secondary">VIP статус</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};