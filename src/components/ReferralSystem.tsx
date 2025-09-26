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
      .maybeSingle();

    if (profile?.referral_code) {
      setReferralCode(profile.referral_code);
    } else {
      // Генерируем реферальный код если его нет
      await generateReferralCodeForUser();
    }
  };

  const generateReferralCodeForUser = async () => {
    if (!user) return;

    try {
      console.log('🔧 Generating referral code for user:', user.id);
      
      // Генерируем новый код через RPC функцию
      const { data: newCode, error: codeError } = await supabase
        .rpc('generate_referral_code');

      if (codeError) {
        console.error('❌ Error generating referral code:', codeError);
        return;
      }

      console.log('✅ Generated code:', newCode);

      // Обновляем профиль пользователя
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referral_code: newCode })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('❌ Error updating profile with referral code:', updateError);
        return;
      }

      console.log('✅ Referral code saved to profile');
      setReferralCode(newCode);
      
      toast({
        title: "Реферальный код создан!",
        description: "Теперь вы можете приглашать друзей",
      });
    } catch (error) {
      console.error('❌ Error in generateReferralCodeForUser:', error);
    }
  };

  const fetchReferrals = async () => {
    if (!user) return;

    console.log('🔍 Fetching referrals for user:', user.id);
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    console.log('📊 Referrals data:', data);
    console.log('❓ Referrals error:', error);

    if (data) {
      setReferrals(data);
      const total = data.reduce((sum, ref) => sum + Number(ref.bonus_earned), 0);
      setTotalBonus(total);
      console.log('✅ Loaded referrals count:', data.length, 'Total bonus:', total);
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
    if (!user || !referralInput.trim()) {
      console.log('🚫 Apply referral cancelled: user or input missing');
      return;
    }

    console.log('🎯 Applying referral code:', referralInput.trim());
    console.log('👤 Current user:', user.id);

    try {
      // Check if referral code exists and is not user's own
      console.log('🔍 Looking for referral code...');
      const { data: referrers, error: referrerError } = await supabase
        .rpc('lookup_referral_code', { code: referralInput.trim() });

      if (referrerError) {
        console.error('❌ Error finding referrer:', referrerError);
        toast({
          title: "Ошибка",
          description: "Ошибка поиска реферального кода",
          variant: "destructive"
        });
        return;
      }

      const referrer = referrers && referrers.length > 0 ? referrers[0] : null;

      console.log('👥 Found referrer:', referrer);

      if (!referrer) {
        console.log('❌ Referral code not found');
        toast({
          title: "Ошибка",
          description: "Реферальный код не найден",
          variant: "destructive"
        });
        return;
      }

      if (referrer.user_id === user.id) {
        console.log('❌ User trying to use own code');
        toast({
          title: "Ошибка", 
          description: "Нельзя использовать свой собственный код",
          variant: "destructive"
        });
        return;
      }

      // Check if user already has a referrer
      console.log('🔍 Checking if user already has referrer...');
      const { data: currentProfile, error: profileError } = await supabase
        .from('profiles')
        .select('referred_by, nickname')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Error checking current profile:', profileError);
        toast({
          title: "Ошибка",
          description: "Ошибка проверки профиля",
          variant: "destructive"
        });
        return;
      }

      console.log('👤 Current profile:', currentProfile);
      console.log('👤 Current user referred_by:', currentProfile?.referred_by);

      if (currentProfile?.referred_by) {
        console.log('❌ User already has referrer:', currentProfile.referred_by);
        
        // Check if referral record exists
        const { data: existingReferral, error: refError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referred_id', user.id)
          .eq('referrer_id', currentProfile.referred_by)
          .maybeSingle();
          
      console.log('🔍 Existing referral record:', existingReferral);
        console.log('❓ Referral check error:', refError);
        
        // If no referral record exists but user has referred_by, create the missing record
        if (!existingReferral && !refError) {
          console.log('🔧 Creating missing referral record for existing relationship...');
          const { error: insertError } = await supabase
            .from('referrals')
            .insert({
              referrer_id: currentProfile.referred_by,
              referred_id: user.id,
              referral_code: referralInput.trim(),
              bonus_earned: 0,
              is_active: true
            });

          if (!insertError) {
            console.log('✅ Missing referral record created successfully');
            toast({
              title: "Связь восстановлена",
              description: "Связь с реферером была восстановлена в системе",
            });
            
            // Refresh referral data
            fetchReferralData();
            fetchReferrals();
            setReferralInput("");
            return;
          } else {
            console.error('❌ Error creating missing referral record:', insertError);
          }
        }
        
        toast({
          title: "Ошибка",
          description: `У вас уже есть реферер: ${currentProfile.referred_by}`,
          variant: "destructive"
        });
        return;
      }

      // Create referral record first
      console.log('📝 Creating referral record...');
      const { error: insertError } = await supabase
        .from('referrals')
        .insert({
          referrer_id: referrer.user_id,
          referred_id: user.id,
          referral_code: referralInput.trim()
        });

      if (insertError) {
        console.error('❌ Error creating referral record:', insertError);
        console.error('❌ Full error details:', insertError);
        toast({
          title: "Ошибка",
          description: `Ошибка создания записи реферала: ${insertError.message}`,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Referral record created successfully');

      // Apply referral to profile
      console.log('✅ Applying referral to profile...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          referred_by: referrer.user_id,
          referral_bonus_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
        // Rollback: delete the referral record we just created
        await supabase
          .from('referrals')
          .delete()
          .eq('referrer_id', referrer.user_id)
          .eq('referred_id', user.id);
        
        toast({
          title: "Ошибка",
          description: "Ошибка обновления профиля",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Profile updated successfully');

      toast({
        title: "Успех!",
        description: "Реферальный код применен. Вы получите +50% к доходу на 7 дней!",
      });

      setReferralInput("");
      
      // Refresh referral data
      fetchReferralData();
      fetchReferrals();
    } catch (error) {
      console.error('❌ Referral application failed:', error);
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
              <Input value={referralCode} readOnly placeholder="Генерируется автоматически..." />
              <Button onClick={copyReferralCode} size="sm" disabled={!referralCode}>
                <Copy className="h-4 w-4" />
              </Button>
              {!referralCode && (
                <Button onClick={generateReferralCodeForUser} size="sm" variant="outline">
                  Создать
                </Button>
              )}
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
            <CardTitle className="text-sm font-medium">Активных рефералов</CardTitle>
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
          <CardTitle>Ваши рефералы</CardTitle>
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
                    <p className="font-medium">Реферал #{referral.id.slice(-8)}</p>
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
              <span>5 рефералов</span>
              <Badge>Бесплатная Starter Well</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>15 рефералов</span>
              <Badge>Turbo Boost на 30 дней</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>50 рефералов</span>
              <Badge>Premium Well бесплатно</Badge>
            </div>
            <div className="flex justify-between p-2 border rounded">
              <span>100 рефералов</span>
              <Badge variant="secondary">VIP статус</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};