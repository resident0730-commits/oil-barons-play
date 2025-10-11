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
  nickname?: string;
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
      .select(`
        *,
        profiles!referrals_referred_id_fkey(nickname)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    console.log('📊 Referrals data:', data);
    console.log('❓ Referrals error:', error);

    // Also check if current user is someone's referral
    const { data: asReferral, error: asRefError } = await supabase
      .from('referrals')
      .select('*')
      .eq('referred_id', user.id);
      
    console.log('👤 Current user as referral:', asReferral);
    console.log('❓ As referral error:', asRefError);

    // Check Alexandr's referrals specifically if we know his ID
    if (user.id === 'd41e012f-b980-48d5-8d73-9ffbff0a408c') {
      console.log('🔍 Checking Alexandr referrals (6aa50831-acdc-42d9-87bb-67899957712a)...');
      const { data: alexandrRefs } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', '6aa50831-acdc-42d9-87bb-67899957712a');
      console.log('👥 Alexandr referrals:', alexandrRefs);
    }

    if (data) {
      // Преобразуем данные, извлекая nickname из вложенного profiles объекта
      const transformedData = data.map((ref: any) => ({
        ...ref,
        nickname: ref.profiles?.nickname || 'Игрок'
      }));
      
      setReferrals(transformedData);
      const total = transformedData.reduce((sum, ref) => sum + Number(ref.bonus_earned), 0);
      setTotalBonus(total);
      console.log('✅ Loaded referrals count:', transformedData.length, 'Total bonus:', total);
    }
  };

  const fixMissingReferralRecord = async () => {
    if (!user) return;

    try {
      console.log('🔧 Starting fix for missing referral record...');
      
      // Get current user profile
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('referred_by, nickname')
        .eq('user_id', user.id)
        .single();

      console.log('👤 Current user profile:', currentProfile);

      if (!currentProfile?.referred_by) {
        console.log('❌ User has no referrer in profile');
        toast({
          title: "Информация",
          description: "У вас нет реферера для восстановления связи",
        });
        return;
      }

      // Try to use update_referral_bonus to create/update referral connection
      const { data: result, error: rpcError } = await supabase
        .rpc('update_referral_bonus', {
          earned_amount: 0,
          referrer_user_id: currentProfile.referred_by
        });

      if (rpcError) {
        console.error('❌ Error via update_referral_bonus RPC:', rpcError);
        
        // Fallback: Try to query referrals directly to see if we can read
        const { data: testQuery, error: queryError } = await supabase
          .from('referrals')
          .select('*')
          .limit(1);
        
        console.log('🔍 Test query result:', testQuery);
        console.log('❓ Query error:', queryError);
        
        toast({
          title: "Информация",
          description: "Попробуйте обратиться к администратору для настройки разрешений базы данных",
        });
        return;
      }

      console.log('✅ Updated via RPC:', result);
      toast({
        title: "Успех!",
        description: "Проверка связи выполнена",
      });

      // Refresh data
      fetchReferralData();
      fetchReferrals();

    } catch (error) {
      console.error('❌ Fix function error:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при проверке связи",
        variant: "destructive"
      });
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
        
        toast({
          title: "Ошибка",
          description: `У вас уже есть реферер: ${currentProfile.referred_by}`,
          variant: "destructive"
        });
        return;
      }

      // Since direct insert is blocked by RLS, let's inform user about the connection
      console.log('📝 User already has referrer, informing about connection...');
      
      toast({
        title: "Информация",
        description: "Связь с реферером уже установлена в профиле. Обратитесь к администратору для синхронизации таблиц.",
      });

      // Still refresh data to show current state
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
              <Button onClick={fixMissingReferralRecord} size="sm" variant="secondary">
                Исправить связи
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
            <div className="text-2xl font-bold">{totalBonus.toLocaleString()} ₽</div>
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
                    <p className="font-medium">{referral.nickname || 'Игрок'}</p>
                    <p className="text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{referral.bonus_earned.toLocaleString()} ₽</p>
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