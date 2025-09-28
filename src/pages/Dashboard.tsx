import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Fuel, 
  BarChart3,
  ShoppingCart, 
  Zap,
  Sparkles,
  Gift,
  Calendar,
  History,
  Trophy,
  Wallet
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData, wellTypes, wellPackages } from "@/hooks/useGameData";
import { useAchievements } from "@/hooks/useAchievements";
import { useReferrals } from "@/hooks/useReferrals";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { useCurrency } from "@/hooks/useCurrency";
import { supabase } from "@/integrations/supabase/client";
import { BoosterShop } from "@/components/BoosterShop";
import { CaseSystem } from "@/components/CaseSystem";
import DailyChest from "@/components/DailyChest";
import { DailyBonus } from "@/components/DailyBonus";
import { GameSection } from "@/components/GameSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { WellsSection } from "@/components/dashboard/WellsSection";
import { ShopSection } from "@/components/dashboard/ShopSection";
import { TopUpModal } from "@/components/dashboard/TopUpModal";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { BalanceSection } from "@/components/dashboard/BalanceSection";
import PremiumGiveaway from "@/components/PremiumGiveaway";

// Import hero images
import boostersHero from '@/assets/sections/boosters-hero.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile, wells, loading, buyWell, buyPackage, buyWellPackage, upgradeWell, addIncome, boosters, getActiveBoosterMultiplier, cancelBooster, reload } = useGameData();
  const { getPlayerRank, loading: leaderboardLoading } = useLeaderboard();
  const { checkAchievements } = useAchievements();
  const { referralMultiplier, updateReferralEarnings } = useReferrals();
  const { formatGameCurrency, formatGameCurrencyWithName } = useCurrency();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const sounds = useSound();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isBoosterShopOpen, setIsBoosterShopOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'wells' | 'shop' | 'boosters' | 'cases' | 'daily' | 'giveaway' | 'balance'>('overview');

  // Обработка результата платежа
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const outSum = searchParams.get('OutSum');
    const invoiceId = searchParams.get('InvId');
    
    if (paymentStatus && user) {
      if (paymentStatus === 'success') {
        handlePaymentSuccess(outSum, invoiceId);
      } else if (paymentStatus === 'fail') {
        handlePaymentFailure();
      }
      
      // Очищаем URL параметры
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      newParams.delete('OutSum');
      newParams.delete('InvId');
      newParams.delete('SignatureValue');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, user]);

  // Обработка параметра section для навигации
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const validSections = ['overview', 'wells', 'shop', 'boosters', 'cases', 'daily', 'giveaway', 'balance'];
      if (validSections.includes(section)) {
        setActiveSection(section as any);
        // Очищаем параметр section из URL
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('section');
        setSearchParams(newParams, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  const handlePaymentSuccess = async (outSum: string | null, invoiceId: string | null) => {
    try {
      if (!user || !outSum) return;
      
      const amount = parseFloat(outSum);
      if (amount <= 0) return;

      // Перезагружаем профиль для обновления баланса
      await reload();
      
      toast({
        title: "Платеж успешен!",
        description: `Ваш баланс пополнен на ${amount} ₽`,
        duration: 5000,
      });
      
      sounds.success();
    } catch (error) {
      console.error('Ошибка при обработке успешного платежа:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обработке платежа",
        variant: "destructive",
      });
    }
  };

  const handlePaymentFailure = () => {
    toast({
      title: "Платеж отменен",
      description: "Платеж был отменен или произошла ошибка",
      variant: "destructive",
    });
    sounds.error();
  };

  // Если нет профиля, но есть пользователь - создаем базовый профиль для отображения
  const currentProfile = profile || {
    id: '',
    user_id: user?.id || '',
    nickname: user?.user_metadata?.nickname || 'Игрок',
    balance: 1000,
    daily_income: 0,
    last_login: new Date().toISOString(),
    created_at: new Date().toISOString()
  };

  // Memoized utility functions for performance
  const getWellIcon = useCallback((wellTypeName: string) => {
    const wellType = wellTypes.find(wt => wt.name === wellTypeName);
    if (!wellType) return <Fuel className="h-5 w-5" />;
    
    return (
      <div className="relative">
        <img 
          src={wellType.image} 
          alt={wellType.name}
          className="w-24 h-24 rounded-lg object-cover border-2 border-primary/20"
        />
        <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRarityColor(wellType.rarity)}`}>
          {wellType.icon}
        </div>
      </div>
    );
  }, []);

  const getRarityColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500 text-white';
      case 'uncommon': return 'bg-green-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-orange-500 text-white';
      case 'mythic': return 'bg-red-500 text-white glow-gold';
      default: return 'bg-gray-500 text-white';
    }
  }, []);

  const getRarityBadgeColor = useCallback((rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'mythic': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }, []);

  const calculateProfitMetrics = useCallback((dailyIncome: number, price: number) => {
    const monthlyIncome = dailyIncome * 30;
    const yearlyIncome = dailyIncome * 365;
    const yearlyPercent = (yearlyIncome / price) * 100;
    
    return { monthlyIncome, yearlyIncome, yearlyPercent };
  }, []);

  const formatProfitPercent = useCallback((percent: number) => {
    if (percent > 1000) return `${Math.round(percent / 100) * 100}%+`;
    return `${Math.round(percent)}%`;
  }, []);

  // Check for offline income and show notification
  useEffect(() => {
    if (!currentProfile || !currentProfile.last_login) return;
    
    const now = new Date();
    const lastLogin = new Date(currentProfile.last_login);
    const offlineTimeMs = now.getTime() - lastLogin.getTime();
    
    // If user was offline for more than 1 minute and has daily income
    if (offlineTimeMs > 60000 && currentProfile.daily_income > 0) {
      const offlineHours = Math.min(offlineTimeMs / (1000 * 60 * 60), 24);
      const hourlyIncome = Math.floor(currentProfile.daily_income / 24);
      const offlineIncome = hourlyIncome * Math.floor(offlineHours);
      
      if (offlineIncome > 0) {
        toast({
          title: "Добро пожаловать!",
          description: `Вы получили ${formatGameCurrency(offlineIncome)} за ${offlineHours.toFixed(1)} часов оффлайн дохода!`,
          duration: 5000,
        });
      }
    }
  }, [currentProfile?.last_login, toast]);

  // Проверка достижений при изменении профиля, скважин или бустеров
  useEffect(() => {
    if (currentProfile && wells.length >= 0 && boosters) {
      const timeoutId = setTimeout(() => {
        checkAchievements();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [currentProfile?.balance, wells.length, boosters?.length, checkAchievements]);

  // Инициализация стартового баланса для новых игроков
  useEffect(() => {
    if (currentProfile && currentProfile.balance === 0 && wells.length === 0) {
      addIncome(1000);
    }
  }, [currentProfile?.balance, wells.length, addIncome]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Simulate income generation every 10 seconds
  useEffect(() => {
    if (!currentProfile?.daily_income) return;

    const interval = setInterval(() => {
      // Исправленная формула: дневной доход / (24 часа * 60 минут * 6 интервалов по 10 сек в минуте)
      // Но используем более точную формулу: дневной доход за 10 секунд = daily_income / (24 * 60 * 6)
      const incomePerInterval = currentProfile.daily_income / 8640; // 24*60*6 = 8640
      
      if (incomePerInterval >= 0.01) { // Начисляем если доход хотя бы 0.01
        const totalIncome = incomePerInterval * referralMultiplier;
        const earnedAmount = totalIncome - incomePerInterval;
        
        addIncome(totalIncome);
        
        if (earnedAmount > 0) {
          updateReferralEarnings(earnedAmount);
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentProfile?.daily_income, referralMultiplier, addIncome, updateReferralEarnings]);

  const handleBuyWell = async (wellType: typeof wellTypes[0]) => {
    if (currentProfile.balance < wellType.price) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для покупки "${wellType.name}" нужно ${formatGameCurrency(wellType.price)}. У вас ${formatGameCurrency(currentProfile.balance)}`,
        variant: "destructive"
      });
      return;
    }

    const result = await buyWell(wellType);
    if (result.success) {
      toast({
        title: "Скважина куплена!",
        description: `${wellType.name} добавлена к вашему бизнесу`,
      });
    } else {
      toast({
        title: "Ошибка покупки",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleBuyPackage = async (wellPackage: typeof wellPackages[0]) => {
    if (currentProfile.balance < wellPackage.discountedPrice) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для покупки пакета "${wellPackage.name}" нужно ${formatGameCurrency(wellPackage.discountedPrice)}. У вас ${formatGameCurrency(currentProfile.balance)}`,
        variant: "destructive"
      });
      return;
    }

    const result = await buyWellPackage(wellPackage);
    if (result.success) {
      toast({
        title: "Пакет куплен!",
        description: `${wellPackage.name} добавлен к вашему бизнесу`,
      });
    } else {
      toast({
        title: "Ошибка покупки",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleUpgradeWell = async (wellId: string) => {
    const well = wells.find(w => w.id === wellId);
    const wellType = wellTypes.find(wt => wt.name === well?.well_type);
    const upgradeCost = Math.round((wellType?.price || 1000) * 0.5 * Math.pow(1.2, (well?.level || 1) - 1));
    
    if (currentProfile.balance < upgradeCost) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для улучшения нужно ${formatGameCurrency(upgradeCost)}. У вас ${formatGameCurrency(currentProfile.balance)}`,
        variant: "destructive"
      });
      return;
    }

    const result = await upgradeWell(wellId);
    if (result.success) {
      toast({
        title: "Скважина улучшена!",
        description: "Доходность скважин в день увеличена!",
      });
    } else {
      toast({
        title: "Ошибка улучшения",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleTopUp = async (customAmount?: number, packageData?: any, paymentMethod = 'yookassa') => {
    let rubAmount = 0;
    let ocAmount = 0;
    
    if (packageData) {
      rubAmount = packageData.rubAmount;
      ocAmount = packageData.totalOC;
    } else if (customAmount) {
      if (customAmount < 20) {
        toast({ variant: "destructive", title: "Минимальная сумма", description: "Минимальная сумма пополнения 20 ₽" });
        return;
      }
      rubAmount = customAmount;
      ocAmount = customAmount;
    } else {
      toast({ variant: "destructive", title: "Укажите сумму", description: "Выберите пакет или введите сумму" });
      return;
    }

    try {
      console.log('Payment method:', paymentMethod);
      
      // For Robokassa, the widget handles the payment directly
      if (paymentMethod === 'robokassa') {
        console.log('Robokassa payment initiated via widget');
        // Виджет Robokassa обрабатывает платеж самостоятельно
        // После успешной оплаты пользователь будет перенаправлен обратно
        setIsTopUpOpen(false);
        return;
      }
      
      // Choose function based on payment method for other methods
      const functionName = paymentMethod === 'tbank' ? 'create-tbank-payment' : 'create-payment';
      console.log('Using function:', functionName);
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          amount: rubAmount,
          currency: 'RUB',
          oil_coins: ocAmount
        }
      });

      if (error) throw error;
      
      // Handle test mode response
      if (data?.test_mode) {
        toast({
          title: "Тестовый режим",
          description: `Платеж на ${rubAmount}₽ создан в тестовом режиме. В реальном режиме вы получите ${ocAmount.toLocaleString()} OC через ${paymentMethod === 'tbank' ? 'Т-Банк' : 'YooKassa'}!`,
        });
        setIsTopUpOpen(false);
        return;
      }
      
      const paymentUrl = data?.url || data?.confirmation_url;
      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
        toast({
          title: "Переход к оплате",
          description: `После успешной оплаты ${rubAmount}₽ вы получите ${formatGameCurrency(ocAmount)} через ${paymentMethod === 'tbank' ? 'Т-Банк' : 'YooKassa'}!`,
        });
        setIsTopUpOpen(false);
      }
    } catch (error: any) {
      console.error("Payment error details:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка создания платежа",
        description: error.message || error.error?.message || "Неизвестная ошибка"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Fuel className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <div className="space-y-2">
            <p className="text-lg font-medium">Загрузка игры...</p>
            {!user && <p className="text-sm text-muted-foreground">Проверка авторизации</p>}
            {user && !profile && <p className="text-sm text-muted-foreground">Загрузка профиля</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-light-bg">
      <DashboardHeader 
        profile={currentProfile} 
        isAdmin={isAdmin} 
        onBalanceClick={() => setActiveSection('balance')}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Section Navigation */}
        <div className="flex items-center justify-center">
          <div className="section-toolbar w-full max-w-full overflow-x-auto">
            {/* Таймер розыгрыша */}
            <div className="text-center mb-2">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 px-3 py-1 rounded-full animate-glow-pulse">
                  <Trophy className="h-3 w-3 text-primary animate-glow-pulse" />
                <span className="text-xs font-bold text-primary">
                  {(() => {
                    const endDate = new Date('2025-10-18T23:59:59');
                    const now = new Date();
                    const timeLeft = endDate.getTime() - now.getTime();
                    const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
                    const getDaysText = (days: number) => {
                      if (days % 10 === 1 && days % 100 !== 11) return 'день';
                      if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
                      return 'дней';
                    };
                    return `${daysLeft} ${getDaysText(daysLeft)} до розыгрыша!`;
                  })()}
                </span>
                <Trophy className="h-3 w-3 text-primary animate-glow-pulse" />
              </div>
            </div>
            
            <div className="flex space-x-1 bg-card/50 p-1 rounded-lg min-w-max">
              {[
                { id: 'giveaway', label: 'Розыгрыш', icon: Trophy, shortLabel: 'Розыгрыш', special: true },
                { id: 'overview', label: 'Обзор', icon: BarChart3, shortLabel: 'Обзор' },
                { id: 'balance', label: 'Баланс', icon: Wallet, shortLabel: 'Баланс' },
                { id: 'wells', label: 'Скважины', icon: Fuel, shortLabel: 'Скважины' },
                { id: 'shop', label: 'Магазин', icon: ShoppingCart, shortLabel: 'Магазин' },
                { id: 'boosters', label: 'Бустеры', icon: Zap, shortLabel: 'Бустеры' },
                { id: 'cases', label: 'Кейсы', icon: Gift, shortLabel: 'Кейсы' },
                { id: 'daily', label: 'Ежедневно', icon: Calendar, shortLabel: 'Награды' }
              ].map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection(section.id as any)}
                  className={`${
                    activeSection === section.id 
                      ? 'gradient-primary text-primary-foreground shadow-primary' 
                      : section.special 
                        ? 'bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 border border-primary/40 text-primary font-bold animate-glow-pulse hover:from-primary/30 hover:via-accent/40 hover:to-primary/30'
                        : ''
                  } whitespace-nowrap flex-shrink-0 ${section.special ? 'relative' : ''}`}
                >
                  {section.special && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  )}
                  <section.icon className={`h-4 w-4 sm:mr-2 ${section.special ? 'animate-glow-pulse' : ''}`} />
                  <span className="hidden sm:inline">{section.label}</span>
                  <span className="inline sm:hidden ml-1 text-xs">{section.shortLabel}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Content */}
        {activeSection === 'overview' && (
          <OverviewSection 
            profile={currentProfile} 
            wells={wells} 
            playerRank={getPlayerRank(currentProfile.nickname)}
            onTopUpClick={() => setActiveSection('balance')}
          />
        )}

        {activeSection === 'balance' && (
          <BalanceSection 
            onTopUp={handleTopUp}
            topUpLoading={false}
          />
        )}

        {activeSection === 'wells' && (
          <WellsSection
            wells={wells}
            profile={currentProfile}
            onUpgradeWell={handleUpgradeWell}
            getWellIcon={getWellIcon}
            getRarityColor={getRarityColor}
            calculateProfitMetrics={calculateProfitMetrics}
            formatProfitPercent={formatProfitPercent}
            boosters={boosters}
            getActiveBoosterMultiplier={getActiveBoosterMultiplier}
          />
        )}

        {activeSection === 'shop' && (
          <ShopSection
            profile={currentProfile}
            onBuyWell={handleBuyWell}
            onBuyPackage={handleBuyPackage}
            getWellIcon={getWellIcon}
            getRarityColor={getRarityColor}
            getRarityBadgeColor={getRarityBadgeColor}
            calculateProfitMetrics={calculateProfitMetrics}
            formatProfitPercent={formatProfitPercent}
          />
        )}


        {activeSection === 'boosters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold heading-contrast">Бустеры и улучшения</h2>
                <p className="text-muted-foreground subtitle-contrast">Временные и постоянные бонусы для увеличения дохода</p>
              </div>
            </div>
            <BoosterShop />
          </div>
        )}

        {activeSection === 'cases' && (
          <CaseSystem />
        )}

        {activeSection === 'daily' && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="text-center space-y-4 mb-8">
              <div className="relative">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
                  ✨ Ежедневные награды ✨
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-sm rounded-lg opacity-50 animate-pulse"></div>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Заходите каждый день и получайте щедрые награды! Чем дольше ваша серия, тем больше бонусов
              </p>
            </div>

            {/* Main Content - Centered Layout */}
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Daily Chest - Main Feature */}
              <div className="w-full">
              <DailyChest 
                userId={user?.id} 
                userIncome={currentProfile?.daily_income || 0}
                devMode={isAdmin} // Админы имеют неограниченные попытки для тестирования
              />
              </div>

              {/* Secondary Features Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Bonus */}
                <div className="lg:col-span-1">
                  <DailyBonus />
                </div>
                
                {/* Statistics Cards */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center animate-fade-in hover:scale-105 transition-transform duration-200">
                    <div className="text-2xl font-bold text-primary mb-1">{profile?.total_daily_chests_opened || 0}</div>
                    <div className="text-sm text-muted-foreground">Сундуков открыто</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 text-center animate-fade-in hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.1s' }}>
                    <div className="text-2xl font-bold text-accent mb-1">{profile?.daily_chest_streak || 0}</div>
                    <div className="text-sm text-muted-foreground">Текущая серия</div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-4 text-center animate-fade-in hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.2s' }}>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {Math.max(profile?.daily_chest_streak || 0, profile?.total_daily_chests_opened || 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Лучшая серия</div>
                  </div>
                  <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4 text-center animate-fade-in hover:scale-105 transition-transform duration-200" style={{ animationDelay: '0.3s' }}>
                    <div className="text-2xl font-bold text-accent mb-1">
                      {((profile?.total_daily_chests_opened || 0) * 650).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Всего получено OC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'giveaway' && (
          <PremiumGiveaway 
            profile={currentProfile}
            wells={wells}
          />
        )}
      </main>

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
      />
    </div>
  );
};

export default Dashboard;