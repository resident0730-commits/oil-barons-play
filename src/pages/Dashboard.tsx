import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  Fuel, 
  BarChart3,
  ShoppingCart, 
  Calendar,
  Wallet,
  ArrowRightLeft,
  Building2
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
import DailyChest from "@/components/DailyChest";
import { DailyBonus } from "@/components/DailyBonus";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewSection } from "@/components/dashboard/OverviewSection";
import { WellsSection } from "@/components/dashboard/WellsSection";
import { TopUpModal } from "@/components/dashboard/TopUpModal";
import { BalanceSection } from "@/components/dashboard/BalanceSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ExchangeWidget } from "@/components/ExchangeWidget";

import boostersHero from '@/assets/sections/boosters-hero.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile, wells, loading, buyWell, buyWellPackage, upgradeWell, addIncome, boosters, reload } = useGameData();
  const { getPlayerRank } = useLeaderboard();
  const { checkAchievements } = useAchievements();
  const { referralMultiplier, updateReferralEarnings } = useReferrals();
  const { formatOilCoins } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const sounds = useSound();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'exchange' | 'shop' | 'daily'>('overview');
  const [overviewTab, setOverviewTab] = useState<'balance' | 'empire' | 'wells'>('balance');

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
      const validSections = ['overview', 'exchange', 'shop', 'daily'];
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

  useEffect(() => {
    if (!currentProfile?.daily_income || currentProfile.daily_income <= 0) return;

    const interval = setInterval(() => {
      const incomePerInterval = currentProfile.daily_income / 8640;
      
      if (incomePerInterval >= 0.01) {
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
    if (!currentProfile) return;
    
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

  const handleUpgradeWell = async (wellId: string) => {
    if (!currentProfile) return;
    
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
      rubAmount = packageData.price;
      ocAmount = packageData.oilcoins;
    } else if (customAmount && customAmount > 0) {
      rubAmount = customAmount;
      ocAmount = customAmount;
    } else {
      toast({
        title: "Ошибка",
        description: "Укажите сумму пополнения",
        variant: "destructive"
      });
      return;
    }

    if (rubAmount < 1) {
      toast({
        title: "Ошибка",
        description: "Минимальная сумма пополнения: 1₽",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Creating payment:", { rubAmount, ocAmount, paymentMethod });
      
      let data, error;
      
      if (paymentMethod === 'tbank') {
        const { data: tbankData, error: tbankError } = await supabase.functions.invoke('create-tbank-payment', {
          body: { amount: rubAmount }
        });
        data = tbankData;
        error = tbankError;
      } else {
        const { data: yookassaData, error: yookassaError } = await supabase.functions.invoke('create-payment', {
          body: { amount: rubAmount }
        });
        data = yookassaData;
        error = yookassaError;
      }

      if (error) throw error;
      
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

  if (loading || !user || !profile) {
    return <LoadingScreen user={user} profile={profile} />;
  }

  return (
    <div className="min-h-screen dashboard-light-bg">
      <DashboardHeader 
        profile={currentProfile} 
        isAdmin={isAdmin} 
        onTopUpClick={() => setIsTopUpOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="container mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
        <div className="flex items-center justify-center">
          <div className="section-toolbar w-full max-w-full overflow-x-auto">
            <div className="flex space-x-2 bg-card/50 p-2 rounded-lg min-w-max">
              {[
                { id: 'overview', label: 'Обзор', icon: BarChart3 },
                { id: 'exchange', label: 'Биржа', icon: ArrowRightLeft },
                { id: 'shop', label: 'Магазин', icon: ShoppingCart },
                { id: 'daily', label: 'Ежедневно', icon: Calendar }
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
                  } whitespace-nowrap flex-shrink-0 text-base`}
                >
                  <section.icon className="h-5 w-5 sm:mr-2" />
                  <span className="hidden sm:inline">{section.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {activeSection === 'overview' && currentProfile && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="section-toolbar w-full max-w-3xl">
                <div className="flex space-x-2 bg-card/50 p-2 rounded-lg">
                  {[
                    { id: 'balance', label: 'Баланс', icon: Wallet },
                    { id: 'empire', label: 'Обзор империи', icon: Building2 },
                    { id: 'wells', label: 'Мои скважины', icon: Fuel }
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
                      } flex-1 whitespace-nowrap`}
                    >
                      <tab.icon className="h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {overviewTab === 'balance' && (
              <BalanceSection 
                profile={currentProfile}
                onTopUpClick={() => setIsTopUpOpen(true)}
              />
            )}

            {overviewTab === 'empire' && (
              <OverviewSection
                profile={currentProfile} 
                wells={wells} 
                playerRank={getPlayerRank(currentProfile.nickname)}
                onTopUpClick={() => setIsTopUpOpen(true)}
                onBuyWell={handleBuyWell}
                onUpgradeWell={handleUpgradeWell}
                boosters={boosters || []}
                boosterMultiplier={totalMultiplier}
              />
            )}

            {overviewTab === 'wells' && (
              <WellsSection 
                wells={wells}
                profile={currentProfile}
                onUpgradeWell={handleUpgradeWell}
              />
            )}
          </div>
        )}

        {activeSection === 'shop' && (
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
                <BoosterShop profile={currentProfile} boosters={boosters || []} onPurchaseComplete={reload} />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'exchange' && currentProfile && (
          <div className="max-w-4xl mx-auto">
            <ExchangeWidget
              userId={currentProfile.user_id}
              barrelBalance={currentProfile.barrel_balance}
              oilcoinBalance={currentProfile.oilcoin_balance}
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
                Забирайте ежедневные награды и увеличивайте свой доход!
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-6">
              <DailyBonus profile={currentProfile} onClaim={() => reload(true)} />
              <DailyChest profile={currentProfile} onClaim={() => reload(true)} />
            </div>
          </div>
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
