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
    <div className="space-y-6 sm:space-y-8">
      <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        <CardHeader className="relative p-6 sm:p-8">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-purple-100 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            <Users className="h-6 w-6 sm:h-7 sm:w-7 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            Ваш реферальный код
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            Приглашайте друзей и получайте 10% с их доходов навсегда
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 p-6 sm:p-8 pt-0">
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

      <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3">
        {/* Приглашенных */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          <CardContent className="relative p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-cyan-500/30 rounded-2xl backdrop-blur-sm">
                <Users className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-cyan-100 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Приглашенных</h3>
            <div className="text-5xl sm:text-6xl font-bold text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%)]">
              {referrals.length}
            </div>
          </CardContent>
        </Card>

        {/* Заработано бонусов */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent backdrop-blur-xl border-2 border-green-500/50 hover:border-green-400 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-green-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-green-400/40 transition-all duration-500"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          <CardContent className="relative p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-green-500/30 rounded-2xl backdrop-blur-sm">
                <Gift className="h-10 w-10 sm:h-12 sm:w-12 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-green-100 mb-4 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Заработано бонусов</h3>
            <div className="text-3xl sm:text-4xl font-bold text-green-400 drop-shadow-[0_0_30px_rgba(34,197,94,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%)]">
              {totalBonus.toLocaleString()} ₽
            </div>
          </CardContent>
        </Card>

        {/* Активных рефералов */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-pink-400/40 transition-all duration-500"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          <CardContent className="relative p-8 sm:p-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-pink-500/30 rounded-2xl backdrop-blur-sm">
                <TrendingUp className="h-10 w-10 sm:h-12 sm:w-12 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-pink-100 mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Активных</h3>
            <div className="text-5xl sm:text-6xl font-bold text-pink-400 drop-shadow-[0_0_30px_rgba(236,72,153,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%)]">
              {referrals.filter(ref => ref.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 hover:border-blue-400 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-blue-400/40 transition-all duration-500"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        <CardHeader className="relative p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl text-blue-100 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            Ваши рефералы
          </CardTitle>
        </CardHeader>
        <CardContent className="relative p-6 sm:p-8 pt-0">
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