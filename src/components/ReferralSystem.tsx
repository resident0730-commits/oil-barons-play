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
      .select('*')
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

    if (data && data.length > 0) {
      // Получаем nicknames для всех referred_id
      const referredIds = data.map(ref => ref.referred_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname')
        .in('user_id', referredIds);
      
      // Создаем map для быстрого доступа к nickname
      const nicknameMap = new Map(profiles?.map(p => [p.user_id, p.nickname]) || []);
      
      // Добавляем nickname к каждому рефералу
      const transformedData = data.map(ref => ({
        ...ref,
        nickname: nicknameMap.get(ref.referred_id) || 'Игрок'
      }));
      
      setReferrals(transformedData);
      const total = transformedData.reduce((sum, ref) => sum + Number(ref.bonus_earned), 0);
      setTotalBonus(total);
      console.log('✅ Loaded referrals count:', transformedData.length, 'Total bonus:', total);
    } else {
      setReferrals([]);
      setTotalBonus(0);
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
        toast({
          title: "Ошибка",
          description: "У вас уже есть реферер. Нельзя изменить реферера после регистрации.",
          variant: "destructive"
        });
        return;
      }

      // Apply referral code - update profile with referrer
      console.log('✅ Applying referral code, updating profile...');
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ referred_by: referrer.user_id })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('❌ Error updating profile with referrer:', updateError);
        toast({
          title: "Ошибка",
          description: "Не удалось применить реферальный код",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Referral code applied successfully');
      toast({
        title: "Успех!",
        description: "Реферальный код успешно применен",
      });

      // Refresh data to show updated state
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
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            Реферальная система
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Приглашайте друзей и получайте 10% с их доходов навсегда
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <div>
            <label className="text-xs sm:text-sm font-medium">Ваш реферальный код:</label>
            <div className="flex flex-wrap gap-2 mt-1">
              <Input 
                value={referralCode} 
                readOnly 
                placeholder="Генерируется автоматически..." 
                className="h-10 sm:h-11 text-sm sm:text-base flex-1 min-w-[200px]"
              />
              <Button 
                onClick={copyReferralCode} 
                size="sm" 
                disabled={!referralCode}
                className="h-10 sm:h-11 px-3 sm:px-4"
              >
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="ml-2 hidden sm:inline">Копировать</span>
              </Button>
              {!referralCode && (
                <Button 
                  onClick={generateReferralCodeForUser} 
                  size="sm" 
                  variant="outline"
                  className="h-10 sm:h-11"
                >
                  Создать
                </Button>
              )}
              <Button 
                onClick={fixMissingReferralRecord} 
                size="sm" 
                variant="secondary"
                className="h-10 sm:h-11 hidden sm:inline-flex"
              >
                Исправить связи
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium">Применить реферальный код:</label>
            <div className="flex gap-2 mt-1">
              <Input 
                placeholder="Введите код друга"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
              <Button 
                onClick={applyReferralCode} 
                size="sm"
                className="h-10 sm:h-11 px-3 sm:px-4 whitespace-nowrap"
              >
                Применить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Приглашенных</CardTitle>
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{referrals.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Заработано бонусов</CardTitle>
            <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{totalBonus.toLocaleString()} ₽</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 sm:p-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Активных рефералов</CardTitle>
            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">
              {referrals.filter(ref => ref.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Ваши рефералы</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-xs sm:text-sm">
              У вас пока нет приглашенных друзей
            </p>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{referral.nickname || 'Игрок'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:text-right gap-2">
                    <p className="font-medium text-sm sm:text-base">{referral.bonus_earned.toLocaleString()} ₽</p>
                    <Badge variant={referral.is_active ? "default" : "secondary"} className="text-xs">
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
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Реферальные награды</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Награды выдаются только за рефералов, которые пополнили счет
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0 p-2 sm:p-3 border rounded">
              <span className="text-xs sm:text-sm">5 рефералов с пополнением</span>
              <Badge className="self-start sm:self-auto text-xs">5,000 ₽</Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0 p-2 sm:p-3 border rounded">
              <span className="text-xs sm:text-sm">15 рефералов с пополнением</span>
              <Badge className="self-start sm:self-auto text-xs">15,000 ₽</Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0 p-2 sm:p-3 border rounded">
              <span className="text-xs sm:text-sm">50 рефералов с пополнением</span>
              <Badge className="self-start sm:self-auto text-xs">50,000 ₽</Badge>
            </div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0 p-2 sm:p-3 border rounded">
              <span className="text-xs sm:text-sm">100 рефералов</span>
              <Badge variant="secondary" className="self-start sm:self-auto text-xs">VIP статус</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};