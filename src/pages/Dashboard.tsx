import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Fuel, 
  BarChart3,
  ShoppingCart, 
  Zap,
  Sparkles,
  Gift,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData, wellTypes, wellPackages } from "@/hooks/useGameData";
import { useAchievements } from "@/hooks/useAchievements";
import { useReferrals } from "@/hooks/useReferrals";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { supabase } from "@/integrations/supabase/client";
import { BoosterShop } from "@/components/BoosterShop";
import { CaseSystem } from "@/components/CaseSystem";
import { DailyChest } from "@/components/DailyChest";
import { GameSection } from "@/components/GameSection";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { WellsSection } from "@/components/dashboard/WellsSection";
import { ShopSection } from "@/components/dashboard/ShopSection";
import { TopUpModal } from "@/components/dashboard/TopUpModal";

// Import hero images
import boostersHero from '@/assets/sections/boosters-hero.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile, wells, loading, buyWell, buyPackage, upgradeWell, addIncome, boosters, getActiveBoosterMultiplier, cancelBooster } = useGameData();
  const { getPlayerRank, loading: leaderboardLoading } = useLeaderboard();
  const { checkAchievements } = useAchievements();
  const { referralMultiplier, updateReferralEarnings } = useReferrals();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const sounds = useSound();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isBoosterShopOpen, setIsBoosterShopOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'wells' | 'shop' | 'boosters' | 'cases' | 'daily'>('overview');

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
    if (!profile || !profile.last_login) return;
    
    const now = new Date();
    const lastLogin = new Date(profile.last_login);
    const offlineTimeMs = now.getTime() - lastLogin.getTime();
    
    // If user was offline for more than 1 minute and has daily income
    if (offlineTimeMs > 60000 && profile.daily_income > 0) {
      const offlineHours = Math.min(offlineTimeMs / (1000 * 60 * 60), 24);
      const hourlyIncome = Math.floor(profile.daily_income / 24);
      const offlineIncome = hourlyIncome * Math.floor(offlineHours);
      
      if (offlineIncome > 0) {
        toast({
          title: "Добро пожаловать!",
          description: `Вы получили ${offlineIncome.toLocaleString()} OC за ${offlineHours.toFixed(1)} часов оффлайн дохода!`,
          duration: 5000,
        });
      }
    }
  }, [profile?.last_login, toast]);

  // Проверка достижений при изменении профиля, скважин или бустеров
  useEffect(() => {
    if (profile && wells.length >= 0 && boosters) {
      const timeoutId = setTimeout(() => {
        checkAchievements();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [profile?.balance, wells.length, boosters?.length, checkAchievements]);

  // Инициализация стартового баланса для новых игроков
  useEffect(() => {
    if (profile && profile.balance === 0 && wells.length === 0) {
      addIncome(1000);
    }
  }, [profile?.balance, wells.length, addIncome]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Simulate income generation every 10 seconds
  useEffect(() => {
    if (!profile?.daily_income) return;

    const interval = setInterval(() => {
      // Исправленная формула: дневной доход / (24 часа * 60 минут * 6 интервалов по 10 сек в минуте)
      // Но используем более точную формулу: дневной доход за 10 секунд = daily_income / (24 * 60 * 6)
      const incomePerInterval = profile.daily_income / 8640; // 24*60*6 = 8640
      
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
  }, [profile?.daily_income, referralMultiplier, addIncome, updateReferralEarnings]);

  const handleBuyWell = async (wellType: typeof wellTypes[0]) => {
    if (profile.balance < wellType.price) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для покупки "${wellType.name}" нужно ${wellType.price.toLocaleString()} OC. У вас ${profile.balance.toLocaleString()} OC`,
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
    if (profile.balance < wellPackage.discountedPrice) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для покупки пакета "${wellPackage.name}" нужно ${wellPackage.discountedPrice.toLocaleString()} OC. У вас ${profile.balance.toLocaleString()} OC`,
        variant: "destructive"
      });
      return;
    }

    const result = await buyPackage(wellPackage);
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
    
    if (profile.balance < upgradeCost) {
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для улучшения нужно ${upgradeCost.toLocaleString()} OC. У вас ${profile.balance.toLocaleString()} OC`,
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
      if (customAmount < 100) {
        toast({ variant: "destructive", title: "Минимальная сумма", description: "Минимальная сумма пополнения 100 ₽" });
        return;
      }
      rubAmount = customAmount;
      ocAmount = customAmount;
    } else {
      toast({ variant: "destructive", title: "Укажите сумму", description: "Выберите пакет или введите сумму" });
      return;
    }

    try {
      // Choose function based on payment method
      const functionName = paymentMethod === 'tbank' ? 'create-tbank-payment' : 'create-payment';
      
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: {
          amount: rubAmount,
          currency: 'RUB',
          oil_coins: ocAmount
        }
      });

      if (error) throw error;
      
      const paymentUrl = data?.url || data?.confirmation_url;
      if (paymentUrl) {
        window.open(paymentUrl, '_blank');
        toast({
          title: "Переход к оплате",
          description: `После успешной оплаты ${rubAmount}₽ вы получите ${ocAmount.toLocaleString()} OC через ${paymentMethod === 'tbank' ? 'Т-Банк' : 'YooKassa'}!`,
        });
        setIsTopUpOpen(false);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Ошибка создания платежа" });
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

  if (loading || !user || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Fuel className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p>Загрузка игры...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dashboard-light-bg">
      <DashboardHeader 
        profile={profile} 
        isAdmin={isAdmin} 
        onTopUpClick={() => setIsTopUpOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Section Navigation */}
        <div className="flex items-center justify-center">
          <div className="section-toolbar w-full max-w-full overflow-x-auto">
            <div className="flex space-x-1 bg-card/50 p-1 rounded-lg min-w-max">
              {[
                { id: 'overview', label: 'Обзор', icon: BarChart3, shortLabel: 'Обзор' },
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
                  className={`${activeSection === section.id ? 'gradient-gold text-primary-foreground shadow-gold' : ''} whitespace-nowrap flex-shrink-0`}
                >
                  <section.icon className="h-4 w-4 sm:mr-2" />
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
            profile={profile} 
            wells={wells} 
            playerRank={getPlayerRank(profile.nickname)} 
          />
        )}

        {activeSection === 'wells' && (
          <WellsSection
            wells={wells}
            profile={profile}
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
            profile={profile}
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
          <DailyChest />
        )}
      </main>

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
        topUpLoading={false}
      />
    </div>
  );
};

export default Dashboard;