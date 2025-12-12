import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Fuel, 
  BarChart3,
  ShoppingCart, 
  Calendar,
  Wallet,
  ArrowRightLeft,
  Building2,
  Zap,
  Box,
  Brain,
  Sparkles,
  Coins
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData, wellTypes, wellPackages, WellType, WellPackage } from "@/hooks/useGameData";
import { useAchievements } from "@/hooks/useAchievements";
import { useReferrals } from "@/hooks/useReferrals";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSound } from "@/hooks/useSound";
import { useCurrency } from "@/hooks/useCurrency";
import { supabase } from "@/integrations/supabase/client";
import { BoosterShop } from "@/components/BoosterShop";
import { DailyBonus } from "@/components/DailyBonus";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { ShopSection } from "@/components/dashboard/ShopSection";
import { WellsSection } from "@/components/dashboard/WellsSection";

import { BalanceSection } from "@/components/dashboard/BalanceSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ExchangeWidget } from "@/components/ExchangeWidget";
import { ProfitabilityCalculator } from "@/components/ProfitabilityCalculator";

import boostersHero from '@/assets/sections/boosters-hero.jpg';
import myWellsHero from '@/assets/sections/my-wells-hero.jpg';
import shopHero from '@/assets/sections/shop-hero.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  
  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const { profile, wells, loading, buyWell, buyWellPackage, upgradeWell, addIncome, boosters, reload } = useGameData();
  const { getPlayerRank } = useLeaderboard();
  const { checkAchievements } = useAchievements();
  const { referralMultiplier, updateReferralEarnings } = useReferrals();
  const { formatOilCoins } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  
  const { toast } = useToast();
  const sounds = useSound();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeSection, setActiveSection] = useState<'overview' | 'exchange' | 'shop' | 'daily' | 'calculator'>('overview');
  const [overviewTab, setOverviewTab] = useState<'balance' | 'empire' | 'wells'>('balance');
  const [shopTab, setShopTab] = useState<'wells' | 'boosters'>('wells');
  const [balanceDefaultTab, setBalanceDefaultTab] = useState<'balance' | 'deposit' | 'withdrawal'>('balance');

  // Show loading while checking auth
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

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
      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      newParams.delete('OutSum');
      newParams.delete('InvId');
      newParams.delete('SignatureValue');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, user]);

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      const validSections = ['overview', 'exchange', 'shop', 'daily', 'calculator'];
      if (validSections.includes(section)) {
        setActiveSection(section as any);
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

  const currentProfile = profile;

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
      case 'common': return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
      case 'uncommon': return 'bg-green-500/10 text-green-300 border-green-500/30';
      case 'rare': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'epic': return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'legendary': return 'gradient-gold text-oil-gold-light border-oil-amber/30';
      case 'mythic': return 'bg-red-500/10 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/10 text-gray-300 border-gray-500/30';
    }
  }, []);

  const getWellIcon = useCallback((wellType: string) => {
    return <Fuel className="h-5 w-5" />;
  }, []);

  const calculateProfitMetrics = useCallback((dailyIncome: number, price: number) => {
    const monthlyIncome = dailyIncome * 30;
    const yearlyIncome = dailyIncome * 365;
    const yearlyPercent = price > 0 ? (yearlyIncome / price) * 100 : 0;
    return { monthlyIncome, yearlyIncome, yearlyPercent };
  }, []);

  const formatProfitPercent = useCallback((percent: number) => {
    return `+${percent.toFixed(0)}%`;
  }, []);

  const getActiveBoosterMultiplier = useCallback(() => {
    if (!boosters) return 1;
    let totalBonus = 0;
    boosters.forEach(booster => {
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      if (isActive) {
        switch (booster.booster_type) {
          case 'worker_crew':
            totalBonus += booster.level * 10;
            break;
          case 'geological_survey':
            totalBonus += booster.level * 15;
            break;
          case 'advanced_equipment':
            totalBonus += booster.level * 20;
            break;
          case 'turbo_boost':
            totalBonus += booster.level * 25;
            break;
          case 'automation':
            totalBonus += booster.level * 30;
            break;
        }
      }
    });
    return 1 + (totalBonus / 100);
  }, [boosters]);

  useEffect(() => {
    if (!currentProfile || !currentProfile.last_login) return;
    
    const now = new Date();
    const lastLogin = new Date(currentProfile.last_login);
    const offlineTimeMs = now.getTime() - lastLogin.getTime();
    
    if (offlineTimeMs > 60000) {
      const offlineHours = Math.floor(offlineTimeMs / (1000 * 60 * 60));
      const maxOfflineHours = 24;
      const actualOfflineHours = Math.min(offlineHours, maxOfflineHours);
      
      if (actualOfflineHours > 0 && currentProfile.daily_income > 0) {
        const offlineIncome = Math.floor((currentProfile.daily_income / 24) * actualOfflineHours);
        
        if (offlineIncome > 0) {
          toast({
            title: "Доход в ваше отсутствие!",
            description: `За ${actualOfflineHours}ч. вы получили ${formatGameCurrency(offlineIncome)}`,
            duration: 7000,
          });
          sounds.success();
        }
      }
    }
  }, [currentProfile?.last_login]);

  const totalMultiplier = useMemo(() => {
    let multiplier = 1;
    
    if (boosters && boosters.length > 0) {
      boosters.forEach(booster => {
        const now = new Date();
        const expiresAt = booster.expires_at ? new Date(booster.expires_at) : null;
        
        if (!expiresAt || now < expiresAt) {
          if (booster.booster_type === 'advanced_equipment') {
            multiplier += 0.20;
          } else if (booster.booster_type === 'geological_survey') {
            multiplier += 0.15;
          } else if (booster.booster_type === 'worker_crew') {
            multiplier += 0.10;
          } else if (booster.booster_type === 'automation') {
            multiplier += 0.25;
          } else if (booster.booster_type === 'turbo_mode') {
            multiplier += 0.50;
          }
        }
      });
    }
    
    return multiplier;
  }, [boosters]);

  // Автоматическое начисление баррелей УБРАНО
  // Баррели теперь накапливаются только виртуально (рассчитываются по времени)
  // и добавляются к балансу только при нажатии кнопки "Собрать" во вкладке "Мои скважины"

  const handleBuyWell = async (wellType: WellType) => {
    if (!currentProfile) return;
    
    if (currentProfile.oilcoin_balance < wellType.price) {
      handleTopUp();
      toast({
        title: "Недостаточно средств",
        description: `Для покупки "${wellType.name}" нужно ${formatGameCurrency(wellType.price)}. У вас ${formatGameCurrency(currentProfile.oilcoin_balance)}`,
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

  const handleBuyPackage = async (wellPackage: WellPackage) => {
    if (!currentProfile) return;
    
    if (currentProfile.oilcoin_balance < wellPackage.discountedPrice) {
      handleTopUp();
      toast({
        title: "Недостаточно средств",
        description: `Для покупки "${wellPackage.name}" нужно ${formatGameCurrency(wellPackage.discountedPrice)}`,
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
    if (!currentProfile) return;
    
    const well = wells.find(w => w.id === wellId);
    const wellType = wellTypes.find(wt => wt.name === well?.well_type);
    const upgradeCost = Math.round((wellType?.price || 1000) * 0.5 * Math.pow(1.2, (well?.level || 1) - 1));
    
    if (currentProfile.balance < upgradeCost) {
      handleTopUp();
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

  const handleTopUp = () => {
    // Просто переключаемся на секцию баланса
    setActiveSection('overview');
    setOverviewTab('balance');
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
    return <LoadingScreen user={user} profile={profile} />;
  }

  return (
    <div className="min-h-screen dashboard-light-bg">
      <DashboardHeader 
        profile={currentProfile} 
        isAdmin={isAdmin} 
        onTopUpClick={handleTopUp}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="flex items-center justify-center px-4">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 bg-card/50 p-3 sm:p-4 rounded-xl">
              {[
                { id: 'overview', label: 'Личный кабинет', icon: BarChart3 },
                { id: 'exchange', label: 'Биржа', icon: ArrowRightLeft },
                { id: 'shop', label: 'Магазин', icon: ShoppingCart },
                { id: 'daily', label: 'Ежедневно', icon: Calendar },
                { id: 'calculator', label: 'Калькулятор', icon: BarChart3 }
              ].map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  size="lg"
                  onClick={() => setActiveSection(section.id as any)}
                  className={`${
                    activeSection === section.id 
                      ? 'gradient-primary text-primary-foreground shadow-primary' 
                      : ''
                  } h-12 sm:h-16 text-xs sm:text-lg font-semibold transition-all hover:scale-105 flex-col sm:flex-row gap-1 sm:gap-2 px-2 sm:px-4`}
                >
                  <section.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                  <span className="text-[10px] sm:text-base leading-tight">{section.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопка мини-игры Кликер */}
        {/* <div className="flex justify-center px-4">
          <Button
            onClick={() => navigate('/clicker')}
            size="lg"
            className="gradient-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 gap-2 text-base px-6 py-6"
          >
            <Coins className="h-5 w-5 animate-pulse" />
            <span>💰 Мини-игра: Кликер Монет</span>
            <Sparkles className="h-4 w-4 animate-pulse" />
          </Button>
        </div> */}

        {activeSection === 'overview' && currentProfile && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="section-toolbar w-full max-w-3xl">
                <div className="flex space-x-2 bg-card/50 p-2 rounded-lg">
                  {[
                    { id: 'balance', label: 'Баланс', icon: Wallet },
                    { id: 'empire', label: 'Империя', icon: Building2 },
                    { id: 'wells', label: 'Скважины', icon: Fuel }
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      variant={overviewTab === tab.id ? "default" : "ghost"}
                      size="default"
                      onClick={() => setOverviewTab(tab.id as any)}
                      className={`${
                        overviewTab === tab.id 
                          ? 'gradient-primary text-primary-foreground shadow-primary' 
                          : ''
                      } flex-1 text-xs sm:text-base px-2 sm:px-4`}
                    >
                      <tab.icon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="truncate">{tab.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {overviewTab === 'balance' && (
              <BalanceSection 
                onTopUp={handleTopUp}
                topUpLoading={false}
                defaultTab={balanceDefaultTab}
              />
            )}

            {overviewTab === 'empire' && (
              <OverviewSection
                profile={currentProfile} 
                wells={wells} 
                playerRank={getPlayerRank(currentProfile.nickname)}
                onTopUpClick={() => {
                  setBalanceDefaultTab('deposit');
                  setOverviewTab('balance');
                }}
              />
            )}

            {overviewTab === 'wells' && (
              <WellsSection 
                wells={wells}
                profile={currentProfile}
                onUpgradeWell={handleUpgradeWell}
                getWellIcon={getWellIcon}
                getRarityColor={getRarityColor}
                calculateProfitMetrics={calculateProfitMetrics}
                formatProfitPercent={formatProfitPercent}
                boosters={boosters || []}
                getActiveBoosterMultiplier={getActiveBoosterMultiplier}
                onBarrelsClaimed={() => reload(true)}
                onNavigateToShop={() => {
                  setActiveSection('shop');
                  setShopTab('wells');
                }}
              />
            )}
          </div>
        )}

        {activeSection === 'shop' && currentProfile && (
          <div className="space-y-6">
            {/* Shop tabs */}
            <div className="flex items-center justify-center">
              <div className="section-toolbar w-full max-w-2xl">
                <div className="flex space-x-2 bg-card/50 p-2 rounded-lg">
                  {[
                    { id: 'wells', label: 'Скважины', icon: Fuel },
                    { id: 'boosters', label: 'Бустеры', icon: Zap }
                  ].map((tab) => (
                    <Button
                      key={tab.id}
                      variant={shopTab === tab.id ? "default" : "ghost"}
                      size="default"
                      onClick={() => setShopTab(tab.id as any)}
                      className={`${
                        shopTab === tab.id 
                          ? 'gradient-primary text-primary-foreground shadow-primary' 
                          : ''
                      } flex-1 text-xs sm:text-base px-2 sm:px-4`}
                    >
                      <tab.icon className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="truncate">{tab.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wells Shop */}
            {shopTab === 'wells' && (
              <div className="relative min-h-[600px] rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${shopHero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-background"></div>
                </div>

                <div className="relative z-10 pt-16 pb-8 px-4">
                  <div className="text-center mb-12">
                    <div className="relative inline-block">
                      <h2 className="text-4xl font-bold text-white animate-fade-in [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_100%),_1px_-1px_2px_rgb(0_0_0_/_100%),_-1px_1px_2px_rgb(0_0_0_/_100%),_1px_1px_2px_rgb(0_0_0_/_100%)]">
                        Магазин скважин
                      </h2>
                      <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-sm rounded-lg opacity-50"></div>
                    </div>
                    <p className="text-lg text-white mt-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Расширяйте свою нефтяную империю мощными скважинами
                    </p>
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <ShopSection
                      profile={currentProfile}
                      onBuyWell={handleBuyWell}
                      onBuyPackage={handleBuyPackage}
                      onTopUpClick={handleTopUp}
                      getWellIcon={getWellIcon}
                      getRarityColor={getRarityColor}
                      getRarityBadgeColor={getRarityBadgeColor}
                      calculateProfitMetrics={calculateProfitMetrics}
                      formatProfitPercent={formatProfitPercent}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Boosters Shop */}
            {shopTab === 'boosters' && (
              <div className="relative min-h-[600px] rounded-2xl overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${boostersHero})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-background"></div>
                </div>

                <div className="relative z-10 pt-16 pb-8 px-4">
                  <div className="text-center mb-12">
                    <div className="relative inline-block">
                      <h2 className="text-4xl font-bold text-white animate-fade-in [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_100%),_1px_-1px_2px_rgb(0_0_0_/_100%),_-1px_1px_2px_rgb(0_0_0_/_100%),_1px_1px_2px_rgb(0_0_0_/_100%)]">
                        Магазин бустеров
                      </h2>
                      <div className="absolute -inset-2 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 blur-sm rounded-lg opacity-50"></div>
                    </div>
                    <p className="text-lg text-muted-foreground mt-2 [text-shadow:_1px_1px_3px_rgb(0_0_0_/_100%)]">
                      Усильте свою империю с помощью мощных бустеров
                    </p>
                  </div>

                  <div className="max-w-7xl mx-auto">
                    <BoosterShop />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'exchange' && currentProfile && (
          <div className="max-w-4xl mx-auto">
            <ExchangeWidget
              userId={currentProfile.user_id}
              barrelBalance={currentProfile.barrel_balance}
              oilcoinBalance={currentProfile.oilcoin_balance}
              purchasedOilcoinBalance={currentProfile.purchased_oilcoin_balance ?? 0}
              rubleBalance={currentProfile.ruble_balance}
              onExchangeComplete={() => setTimeout(() => reload(true), 500)}
            />
          </div>
        )}

        {activeSection === 'daily' && currentProfile && (
          <div className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <div className="relative">
                <h2 className="text-4xl font-bold text-white animate-fade-in [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_100%),_1px_-1px_2px_rgb(0_0_0_/_100%),_-1px_1px_2px_rgb(0_0_0_/_100%),_1px_1px_2px_rgb(0_0_0_/_100%)]">
                  Ежедневные награды
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 blur-sm rounded-lg opacity-50"></div>
              </div>
              <p className="text-lg text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Заходи каждый день подряд и получай награды от 100 до 1400 OC!
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <DailyBonus />
            </div>
          </div>
        )}

        {activeSection === 'calculator' && (
          <div className="space-y-6">
            <div className="text-center space-y-4 mb-8">
              <div className="relative">
                <h2 className="text-4xl font-bold text-white animate-fade-in [text-shadow:_3px_3px_6px_rgb(0_0_0_/_100%),_-1px_-1px_2px_rgb(0_0_0_/_100%),_1px_-1px_2px_rgb(0_0_0_/_100%),_-1px_1px_2px_rgb(0_0_0_/_100%),_1px_1px_2px_rgb(0_0_0_/_100%)]">
                  Калькулятор доходности
                </h2>
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20 blur-sm rounded-lg opacity-50"></div>
              </div>
              <p className="text-lg text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Рассчитайте оптимальную стратегию инвестирования для достижения желаемого дохода
              </p>
            </div>

            <div className="max-w-7xl mx-auto">
              <ProfitabilityCalculator />
            </div>
          </div>
        )}
      </main>

    </div>
  );
};

export default Dashboard;
