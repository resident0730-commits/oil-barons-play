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
  level?: number; // Уровень реферала (1, 2, или 3)
}

export const ReferralSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState("");
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralInput, setReferralInput] = useState("");
  const [totalBonus, setTotalBonus] = useState(0);
  const [level1Referrals, setLevel1Referrals] = useState<Referral[]>([]);
  const [level2Referrals, setLevel2Referrals] = useState<Referral[]>([]);
  const [level3Referrals, setLevel3Referrals] = useState<Referral[]>([]);

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
    
    // Получаем рефералов 1-го уровня (прямые рефералы)
    const { data: level1Data, error: level1Error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    console.log('📊 Level 1 Referrals:', level1Data);

    // Собираем всех рефералов для получения их никнеймов
    let allReferrals: Referral[] = [];
    let level1List: Referral[] = [];
    let level2List: Referral[] = [];
    let level3List: Referral[] = [];

    if (level1Data && level1Data.length > 0) {
      const level1Ids = level1Data.map(ref => ref.referred_id);
      
      // Получаем рефералов 2-го уровня (рефералы моих рефералов)
      const { data: level2Data } = await supabase
        .from('referrals')
        .select('*')
        .in('referrer_id', level1Ids)
        .order('created_at', { ascending: false });

      console.log('📊 Level 2 Referrals:', level2Data);

      if (level2Data && level2Data.length > 0) {
        const level2Ids = level2Data.map(ref => ref.referred_id);
        
        // Получаем рефералов 3-го уровня
        const { data: level3Data } = await supabase
          .from('referrals')
          .select('*')
          .in('referrer_id', level2Ids)
          .order('created_at', { ascending: false });

        console.log('📊 Level 3 Referrals:', level3Data);

        if (level3Data && level3Data.length > 0) {
          level3List = level3Data.map(ref => ({ ...ref, level: 3 }));
        }

        level2List = level2Data.map(ref => ({ ...ref, level: 2 }));
      }

      level1List = level1Data.map(ref => ({ ...ref, level: 1 }));
      allReferrals = [...level1List, ...level2List, ...level3List];

      // Получаем nicknames для всех рефералов
      const allReferredIds = allReferrals.map(ref => ref.referred_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, nickname')
        .in('user_id', allReferredIds);
      
      const nicknameMap = new Map(profiles?.map(p => [p.user_id, p.nickname]) || []);
      
      // Добавляем nickname к каждому рефералу
      level1List = level1List.map(ref => ({
        ...ref,
        nickname: nicknameMap.get(ref.referred_id) || 'Игрок'
      }));
      
      level2List = level2List.map(ref => ({
        ...ref,
        nickname: nicknameMap.get(ref.referred_id) || 'Игрок'
      }));
      
      level3List = level3List.map(ref => ({
        ...ref,
        nickname: nicknameMap.get(ref.referred_id) || 'Игрок'
      }));

      allReferrals = [...level1List, ...level2List, ...level3List];
      
      setLevel1Referrals(level1List);
      setLevel2Referrals(level2List);
      setLevel3Referrals(level3List);
      setReferrals(allReferrals);
      
      const total = allReferrals.reduce((sum, ref) => sum + Number(ref.bonus_earned), 0);
      setTotalBonus(total);
      console.log('✅ Loaded referrals - L1:', level1List.length, 'L2:', level2List.length, 'L3:', level3List.length, 'Total bonus:', total);
    } else {
      setLevel1Referrals([]);
      setLevel2Referrals([]);
      setLevel3Referrals([]);
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

  const getBaseUrl = () => {
    // Проверяем, есть ли настроенный кастомный домен в localStorage
    const customDomain = localStorage.getItem('custom_domain');
    if (customDomain) {
      return customDomain;
    }
    // Иначе используем текущий домен
    return window.location.origin;
  };

  const copyReferralCode = () => {
    if (referralCode) {
      const referralLink = `${getBaseUrl()}/auth?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Реферальная ссылка скопирована!",
        description: "Поделитесь ей с друзьями",
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
            Пригласите друзей
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            Многоуровневая система: 10% от 1-го уровня, 5% от 2-го, 3% от 3-го
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 p-6 sm:p-8 pt-0">
          <div>
            <label className="text-xs sm:text-sm font-medium">Реферальный код:</label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={referralCode || ''} 
                readOnly 
                placeholder="Генерируется автоматически..." 
                className="h-10 sm:h-11 text-sm sm:text-base flex-1"
              />
              <Button 
                onClick={() => {
                  if (referralCode) {
                    navigator.clipboard.writeText(referralCode);
                    toast({
                      title: "Код скопирован!",
                      description: "Реферальный код скопирован в буфер обмена",
                    });
                  }
                }} 
                size="sm" 
                disabled={!referralCode}
                className="h-10 sm:h-11 px-3 sm:px-4"
              >
                <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="ml-2 hidden sm:inline">Копировать</span>
              </Button>
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium">Реферальная ссылка:</label>
            <div className="flex gap-2 mt-1">
              <Input 
                value={referralCode ? `${getBaseUrl()}/auth?ref=${referralCode}` : ''} 
                readOnly 
                placeholder="Генерируется автоматически..." 
                className="h-10 sm:h-11 text-sm sm:text-base flex-1"
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

      {/* Реферальные уровни - Информация */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl"></div>
        <CardHeader className="relative p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl text-amber-100 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            Как работает многоуровневая система
          </CardTitle>
          <CardDescription className="text-amber-200/80 text-sm sm:text-base mt-2 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
            Зарабатывайте пассивный доход с каждого пополнения ваших рефералов — до 3-х уровней глубины!
          </CardDescription>
        </CardHeader>
        <CardContent className="relative p-6 sm:p-8 pt-0 space-y-6">
          {/* Уровни */}
          <div className="space-y-4">
            <div className="p-4 border-2 border-amber-500/30 rounded-xl bg-amber-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500 text-white text-sm px-3 py-1">1-й уровень</Badge>
                  <span className="text-2xl font-bold text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">10%</span>
                </div>
                <div className="text-sm font-medium text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full">
                  Прямые рефералы
                </div>
              </div>
              <p className="text-sm text-amber-100/90 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
                Получайте <span className="font-bold text-amber-300">10%</span> от каждого пополнения друзей, которых вы пригласили лично. 
                <span className="text-amber-200/70"> Пример: друг пополнил 10 000 ₽ → вы получаете <span className="font-bold text-green-400">1 000 ₽</span></span>
              </p>
            </div>
            
            <div className="p-4 border-2 border-orange-500/30 rounded-xl bg-orange-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500 text-white text-sm px-3 py-1">2-й уровень</Badge>
                  <span className="text-2xl font-bold text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">5%</span>
                </div>
                <div className="text-sm font-medium text-orange-300 bg-orange-500/20 px-3 py-1 rounded-full">
                  Рефералы рефералов
                </div>
              </div>
              <p className="text-sm text-orange-100/90 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
                Получайте <span className="font-bold text-orange-300">5%</span> от пополнений тех, кого пригласили ваши рефералы.
                <span className="text-orange-200/70"> Пример: знакомый вашего друга пополнил 10 000 ₽ → вы получаете <span className="font-bold text-green-400">500 ₽</span></span>
              </p>
            </div>
            
            <div className="p-4 border-2 border-red-500/30 rounded-xl bg-red-500/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-red-500 text-white text-sm px-3 py-1">3-й уровень</Badge>
                  <span className="text-2xl font-bold text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">3%</span>
                </div>
                <div className="text-sm font-medium text-red-300 bg-red-500/20 px-3 py-1 rounded-full">
                  Глубина 3 уровня
                </div>
              </div>
              <p className="text-sm text-red-100/90 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
                Получайте <span className="font-bold text-red-300">3%</span> даже от рефералов третьего уровня.
                <span className="text-red-200/70"> Пример: пополнение 10 000 ₽ на 3-м уровне → вы получаете <span className="font-bold text-green-400">300 ₽</span></span>
              </p>
            </div>
          </div>

          {/* Важная информация */}
          <div className="p-5 border-2 border-cyan-500/40 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/10">
            <h4 className="text-lg font-bold text-cyan-300 mb-3 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">Моментальное начисление</h4>
            <p className="text-sm text-cyan-100/90 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
              Реферальные бонусы начисляются <span className="font-bold text-cyan-300">мгновенно</span> на ваш рублёвый баланс после каждого пополнения реферала. 
              Вы можете <span className="font-bold text-green-400">вывести их на карту</span> в любой момент без каких-либо ограничений!
            </p>
          </div>

          {/* Итого */}
          <div className="p-5 border-2 border-purple-500/40 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/10">
            <h4 className="text-lg font-bold text-purple-300 mb-3 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">Максимальный доход</h4>
            <p className="text-sm text-purple-100/90 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_70%)]">
              При активной сети рефералов вы получаете до <span className="font-bold text-purple-300">18%</span> суммарно (10% + 5% + 3%) с каждой цепочки пополнений.
              <span className="text-purple-200/70"> Чем больше ваша сеть — тем выше пассивный доход!</span>
            </p>
          </div>

          {/* Пример расчета */}
          <div className="p-5 border-2 border-green-500/40 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/10">
            <h4 className="text-lg font-bold text-green-300 mb-3 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">Расчёт дохода при пополнении реферала на 10 000 ₽</h4>
            <div className="grid sm:grid-cols-3 gap-3 text-center mb-4">
              <div className="p-3 bg-amber-500/20 rounded-lg border border-amber-400/30">
                <div className="text-xs text-amber-200/80 mb-1">Реферал 1-го уровня</div>
                <div className="text-2xl font-bold text-amber-400">+1 000 ₽</div>
                <div className="text-xs text-amber-300/70 mt-1">10% от суммы</div>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-lg border border-orange-400/30">
                <div className="text-xs text-orange-200/80 mb-1">Реферал 2-го уровня</div>
                <div className="text-2xl font-bold text-orange-400">+500 ₽</div>
                <div className="text-xs text-orange-300/70 mt-1">5% от суммы</div>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg border border-red-400/30">
                <div className="text-xs text-red-200/80 mb-1">Реферал 3-го уровня</div>
                <div className="text-2xl font-bold text-red-400">+300 ₽</div>
                <div className="text-xs text-red-300/70 mt-1">3% от суммы</div>
              </div>
            </div>
            <div className="p-3 bg-green-500/30 rounded-lg border border-green-400/50 text-center">
              <div className="text-sm text-green-200/80">Суммарный доход</div>
              <div className="text-3xl font-bold text-green-400">1 800 ₽</div>
              <div className="text-xs text-green-300/70">при пополнении на 10 000 ₽ по всем уровням</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Рефералы 1-го уровня */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-amber-500/10 to-transparent backdrop-blur-xl border-2 border-amber-500/50 hover:border-amber-400 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="relative p-6 sm:p-8">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-amber-100 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            <Badge className="bg-amber-500 text-white">1-й уровень</Badge>
            Прямые рефералы (10%)
          </CardTitle>
          <CardDescription className="text-sm">
            {level1Referrals.length} {level1Referrals.length === 1 ? 'реферал' : 'рефералов'}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative p-6 sm:p-8 pt-0">
          {level1Referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4 text-xs sm:text-sm">
              Пригласите друзей, чтобы они появились здесь
            </p>
          ) : (
            <div className="space-y-2">
              {level1Referrals.map((referral) => (
                <div key={referral.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 p-3 border border-amber-500/30 rounded-lg bg-amber-500/5">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{referral.nickname || 'Игрок'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:text-right gap-2">
                    <p className="font-medium text-sm sm:text-base text-amber-400">{referral.bonus_earned.toLocaleString()} ₽</p>
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

      {/* Рефералы 2-го уровня */}
      {level2Referrals.length > 0 && (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative p-6 sm:p-8">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-orange-100 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <Badge className="bg-orange-500 text-white">2-й уровень</Badge>
              Рефералы ваших рефералов (5%)
            </CardTitle>
            <CardDescription className="text-sm">
              {level2Referrals.length} {level2Referrals.length === 1 ? 'реферал' : 'рефералов'}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 sm:p-8 pt-0">
            <div className="space-y-2">
              {level2Referrals.map((referral) => (
                <div key={referral.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 p-3 border border-orange-500/30 rounded-lg bg-orange-500/5">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{referral.nickname || 'Игрок'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:text-right gap-2">
                    <p className="font-medium text-sm sm:text-base text-orange-400">{referral.bonus_earned.toLocaleString()} ₽</p>
                    <Badge variant={referral.is_active ? "default" : "secondary"} className="text-xs">
                      {referral.is_active ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Рефералы 3-го уровня */}
      {level3Referrals.length > 0 && (
        <Card className="group relative overflow-hidden bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent backdrop-blur-xl border-2 border-red-500/50 hover:border-red-400 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <CardHeader className="relative p-6 sm:p-8">
            <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl text-red-100 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <Badge className="bg-red-500 text-white">3-й уровень</Badge>
              Рефералы 3-го уровня (3%)
            </CardTitle>
            <CardDescription className="text-sm">
              {level3Referrals.length} {level3Referrals.length === 1 ? 'реферал' : 'рефералов'}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative p-6 sm:p-8 pt-0">
            <div className="space-y-2">
              {level3Referrals.map((referral) => (
                <div key={referral.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 sm:gap-0 p-3 border border-red-500/30 rounded-lg bg-red-500/5">
                  <div>
                    <p className="font-medium text-sm sm:text-base">{referral.nickname || 'Игрок'}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Присоединился {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:text-right gap-2">
                    <p className="font-medium text-sm sm:text-base text-red-400">{referral.bonus_earned.toLocaleString()} ₽</p>
                    <Badge variant={referral.is_active ? "default" : "secondary"} className="text-xs">
                      {referral.is_active ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};