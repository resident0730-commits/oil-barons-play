import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Fuel, 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
  Settings,
  LogOut,
  Plus,
  BarChart3,
  User,
  Zap,
  Factory,
  Gem,
  CreditCard,
  Shield,
  Trophy,
  BookOpen,
  Sparkles,
  Pickaxe,
  Store,
  Rocket
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useGameData, wellTypes, wellPackages } from "@/hooks/useGameData";
import { DailyBonus } from "@/components/DailyBonus";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { BoosterShop } from "@/components/BoosterShop";
import { GameSection } from "@/components/GameSection";

// Import hero images
import myWellsHero from '@/assets/sections/my-wells-hero.jpg';
import shopHero from '@/assets/sections/shop-hero.jpg';
import boostersHero from '@/assets/sections/boosters-hero.jpg';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { profile, wells, loading, buyWell, buyPackage, upgradeWell, addIncome, boosters, getActiveBoosterMultiplier } = useGameData();
  const { getPlayerRank, loading: leaderboardLoading } = useLeaderboard();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isBoosterShopOpen, setIsBoosterShopOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'wells' | 'shop' | 'boosters'>('overview');

  const getWellIcon = (wellTypeName: string) => {
    const wellType = wellTypes.find(wt => wt.name === wellTypeName);
    if (!wellType) return <Fuel className="h-5 w-5" />;
    
    return (
      <div className="relative">
        <img 
          src={wellType.image} 
          alt={wellType.name}
          className="w-12 h-12 rounded-lg object-cover border-2 border-primary/20"
        />
        <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getRarityColor(wellType.rarity)}`}>
          {wellType.icon}
        </div>
      </div>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-500 text-white';
      case 'uncommon': return 'bg-green-500 text-white';
      case 'rare': return 'bg-blue-500 text-white';
      case 'epic': return 'bg-purple-500 text-white';
      case 'legendary': return 'bg-orange-500 text-white';
      case 'mythic': return 'bg-red-500 text-white glow-gold';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'legendary': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'mythic': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const calculateProfitMetrics = (dailyIncome: number, price: number) => {
    const monthlyIncome = dailyIncome * 30;
    const yearlyIncome = dailyIncome * 365;
    const yearlyPercent = (yearlyIncome / price) * 100;
    
    return { monthlyIncome, yearlyIncome, yearlyPercent };
  };

  const formatProfitPercent = (percent: number) => {
    if (percent > 1000) return `${Math.round(percent / 100) * 100}%+`;
    return `${Math.round(percent)}%`;
  };

  // Зачисление тестового баланса (только один раз)
  useEffect(() => {
    if (profile && profile.balance < 5000000) {
      addIncome(5000000 - profile.balance);
    }
  }, [profile]);

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
      // Начисляем доход каждые 10 секунд
      // В дне 86400 секунд, значит 8640 интервалов по 10 секунд
      // Поэтому делим дневной доход на 8640
      const income = Math.round(profile.daily_income / 8640);
      if (income > 0) {
        addIncome(income);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [profile?.daily_income, addIncome]);

  const handleBuyWell = async (wellType: typeof wellTypes[0]) => {
    if (profile.balance < wellType.price) {
      // Если недостаточно средств, открываем диалог пополнения
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для покупки "${wellType.name}" нужно ₽${wellType.price.toLocaleString()}. У вас ₽${profile.balance.toLocaleString()}`,
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
        description: `Для покупки пакета "${wellPackage.name}" нужно ₽${wellPackage.discountedPrice.toLocaleString()}. У вас ₽${profile.balance.toLocaleString()}`,
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
    const upgradeCost = Math.round((wellType?.price || 1000) * 0.3 * (well?.level || 1));
    
    if (profile.balance < upgradeCost) {
      // Если недостаточно средств, открываем диалог пополнения
      setIsTopUpOpen(true);
      toast({
        title: "Недостаточно средств",
        description: `Для улучшения нужно ₽${upgradeCost.toLocaleString()}. У вас ₽${profile.balance.toLocaleString()}`,
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

  const handleTopUp = async () => {
    const value = parseFloat(topUpAmount);
    if (!value || value <= 0) {
      toast({ variant: "destructive", title: "Укажите сумму в ₽", description: "Введите положительное число" });
      return;
    }

    if (value < 100) {
      toast({ variant: "destructive", title: "Минимальная сумма", description: "Минимальная сумма пополнения 100 ₽" });
      return;
    }

    setTopUpLoading(true);

    try {
      // Создаем платеж через YooKassa
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          amount: value,
          currency: 'RUB'
        }
      });

      if (error) {
        throw error;
      }

      if (data?.confirmation_url) {
        // Перенаправляем пользователя на страницу оплаты
        window.open(data.confirmation_url, '_blank');
        
        toast({
          title: "Переход к оплате",
          description: "Откроется новая вкладка для оплаты. После успешной оплаты баланс будет пополнен автоматически.",
        });
        
        setTopUpAmount("");
        setIsTopUpOpen(false);
      } else {
        throw new Error('Не удалось получить ссылку на оплату');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка создания платежа",
        description: "Попробуйте позже или обратитесь в поддержку"
      });
    } finally {
      setTopUpLoading(false);
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
      {/* Elegant Header */}
      <header className="relative border-b border-primary/20 backdrop-blur-md bg-gradient-to-r from-card/95 via-card/90 to-card/95 shadow-luxury">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5"></div>
        <div className="container mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <Link to="/" className="group flex items-center space-x-3 hover-scale">
              <div className="relative">
                <Fuel className="h-10 w-10 text-primary drop-shadow-lg transition-transform duration-300 group-hover:rotate-12" />
                <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-playfair font-bold bg-gradient-to-r from-primary via-oil-gold to-accent bg-clip-text text-transparent">
                  Oil Tycoon
                </h1>
                <p className="text-xs text-muted-foreground font-medium tracking-wide">Нефтяная Империя</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              {/* Balance Display */}
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsTopUpOpen(true)}
                aria-label="Пополнить баланс"
                className="group relative overflow-hidden bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:border-primary/50 hover:shadow-primary/25 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Wallet className="h-5 w-5 text-primary mr-2 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-bold text-lg relative z-10">₽{profile.balance.toLocaleString()}</span>
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              {/* User Info */}
              <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-r from-secondary/30 to-accent/20 border border-primary/20">
                <div className="relative">
                  <User className="h-5 w-5 text-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
                </div>
                <span className="font-playfair font-medium text-foreground">{profile.nickname}</span>
              </div>

              {/* Navigation Icons */}
              <div className="flex items-center space-x-2">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                    <User className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/statistics">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                    <Trophy className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/rules">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10 text-primary hover-scale glow-gold">
                      <Shield className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Link to="/settings">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors duration-200 hover-scale">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 hover-scale"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <DailyBonus />
        
        {activeSection === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in">
              <Card 
                className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-card/90 via-card/95 to-card/90 border-primary/30 shadow-luxury hover:shadow-primary/25 hover:shadow-xl transition-all duration-500 hover-scale"
                onClick={() => setIsTopUpOpen(true)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-primary/3"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/15 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-playfair font-semibold text-foreground">Баланс</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Wallet className="h-5 w-5 text-primary drop-shadow-sm" />
                      <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <Plus className="h-4 w-4 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:rotate-90" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                    ₽{profile.balance.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Нажмите для пополнения
                  </p>
                </CardContent>
              </Card>
              
              <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 via-card/95 to-card/90 border-emerald-500/30 shadow-luxury animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/8 via-green-500/5 to-emerald-500/3"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/15 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-playfair font-semibold text-foreground">Доходность в день</CardTitle>
                  <div className="relative">
                    <TrendingUp className="h-5 w-5 text-emerald-500 drop-shadow-sm animate-pulse" />
                    <div className="absolute -inset-1 bg-emerald-500/20 blur-sm rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-400 bg-clip-text text-transparent">
                    ₽{profile.daily_income.toLocaleString()}
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-gradient-to-br from-card/90 via-card/95 to-card/90 border-blue-500/30 shadow-luxury animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/8 via-cyan-500/5 to-blue-500/3"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/15 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-playfair font-semibold text-foreground">Скважины</CardTitle>
                  <div className="relative">
                    <Fuel className="h-5 w-5 text-blue-500 drop-shadow-sm" />
                    <div className="absolute -inset-1 bg-blue-500/20 blur-sm rounded-full animate-pulse"></div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                    {wells.length}
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-card/90 via-card/95 to-card/90 border-purple-500/30 shadow-luxury hover:shadow-purple-500/25 hover:shadow-xl transition-all duration-500 hover-scale animate-fade-in"
                onClick={() => navigate('/leaderboard')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/8 via-pink-500/5 to-purple-500/3"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-base font-playfair font-semibold text-foreground">Рейтинг</CardTitle>
                  <div className="relative">
                    <Trophy className="h-5 w-5 text-purple-500 drop-shadow-sm animate-gold-glow" />
                    <div className="absolute -inset-1 bg-purple-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent mb-2">
                    {leaderboardLoading ? "..." : profile?.nickname ? `#${getPlayerRank(profile.nickname) || "?"}` : "#?"}
                  </div>
                  <p className="text-sm text-muted-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Нажмите для просмотра
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Game Sections */}
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  Игровые разделы
                </h2>
                <p className="text-muted-foreground">Управляйте своей нефтяной империей</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <GameSection
                  title="Мои скважины"
                  description="Управление и улучшение"
                  backgroundImage={myWellsHero}
                  icon={<Pickaxe className="h-6 w-6 text-white" />}
                  badge={wells.length > 0 ? `${wells.length} скважин` : undefined}
                  badgeVariant="secondary"
                  onClick={() => setActiveSection('wells')}
                  stats={[
                    { label: 'Общий доход', value: `₽${profile.daily_income.toLocaleString()}/день` },
                    { label: 'Скважины', value: wells.length }
                  ]}
                />

                <GameSection
                  title="Магазин скважин"
                  description="Покупка нового оборудования"
                  backgroundImage={shopHero}
                  icon={<Store className="h-6 w-6 text-white" />}
                  badge="Новинки!"
                  badgeVariant="default"
                  onClick={() => setActiveSection('shop')}
                  stats={[
                    { label: 'Доступно', value: `${wellTypes.length} типов` },
                    { label: 'Пакеты', value: `${wellPackages.length} предложений` }
                  ]}
                />

                <GameSection
                  title="Бустеры"
                  description="Усиление производительности"
                  backgroundImage={boostersHero}
                  icon={<Rocket className="h-6 w-6 text-white" />}
                  badge={boosters.length > 0 ? `+${Math.round((getActiveBoosterMultiplier() - 1) * 100)}%` : "Доступны"}
                  badgeVariant="destructive"
                  onClick={() => setActiveSection('boosters')}
                  stats={[
                    { label: 'Активных', value: boosters.filter(b => !b.expires_at || new Date(b.expires_at) > new Date()).length },
                    { label: 'Бонус', value: `+${Math.round((getActiveBoosterMultiplier() - 1) * 100)}%` }
                  ]}
                />
              </div>
            </div>
          </>
        )}

        {/* Wells Section */}
        {activeSection === 'wells' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="text-primary"
              >
                ← Назад к обзору
              </Button>
              <h2 className="text-3xl font-bold">Мои скважины ({wells.length})</h2>
              <div></div>
            </div>
            
            {wells.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wells.map((well) => {
                  const wellType = wellTypes.find(wt => wt.name === well.well_type);
                  const upgradeCost = Math.round((wellType?.price || 1000) * 0.3 * well.level);
                  const canUpgrade = well.level < (wellType?.maxLevel || 20) && profile.balance >= upgradeCost;
                  const { monthlyIncome, yearlyIncome, yearlyPercent } = calculateProfitMetrics(well.daily_income, wellType?.price || 1000);
                  
                  const newDailyIncome = Math.round(well.daily_income * 1.15);
                  const incomeIncrease = newDailyIncome - well.daily_income;
                  
                  // Бустеры уже применены в daily_income скважины, не применяем дважды
                  const boosterMultiplier = getActiveBoosterMultiplier();
                  const isBoostersActive = boosterMultiplier > 1;
                  const boosterPercent = Math.round((boosterMultiplier - 1) * 100);
                  
                  return (
                    <Card key={well.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getWellIcon(well.well_type)}
                            <div>
                              <CardTitle className="text-sm">{well.well_type}</CardTitle>
                              {wellType && (
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs capitalize ${getRarityBadgeColor(wellType.rarity)}`}
                                >
                                  {wellType.rarity}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isBoostersActive && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Бустеры +{boosterPercent}%
                              </Badge>
                            )}
                            <Badge variant="outline">Ур. {well.level}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-0">
                        <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
                          {isBoostersActive ? (
                            <>
                              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                <Sparkles className="h-3 w-3" />
                                Доходность уже включает бонус бустеров (+{boosterPercent}%)
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">День (с бустерами):</span>
                                <span className="font-semibold text-primary">₽{well.daily_income.toLocaleString()}</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">День:</span>
                              <span className="font-semibold text-primary">₽{well.daily_income.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Месяц:</span>
                            <span className="font-semibold text-accent-foreground">₽{monthlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Год:</span>
                            <span className="font-semibold text-accent-foreground">₽{yearlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-border pt-2">
                            <span className="text-muted-foreground font-medium">Годовой %:</span>
                            <Badge 
                              variant="secondary" 
                              className={`font-bold ${
                                yearlyPercent >= 100 ? 'bg-green-100 text-green-800' : 
                                yearlyPercent >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {formatProfitPercent(yearlyPercent)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Уровень {well.level}/{wellType?.maxLevel || 20}
                          </div>
                          <Progress 
                            value={(well.level / (wellType?.maxLevel || 20)) * 100} 
                            className="w-20"
                          />
                        </div>

                        {canUpgrade && (
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                            <div className="text-xs font-medium text-primary mb-2">Предварительный просмотр улучшения:</div>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Новая прибыль/день:</span>
                                <span className="font-semibold text-green-600">₽{newDailyIncome.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Увеличение:</span>
                                <span className="font-bold text-green-600">+₽{incomeIncrease.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs border-t border-primary/20 pt-1">
                                <span className="text-muted-foreground">Стоимость:</span>
                                <span className="font-semibold text-orange-600">₽{upgradeCost.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <Button 
                          onClick={() => handleUpgradeWell(well.id)}
                          disabled={!canUpgrade}
                          className={`w-full ${canUpgrade ? 'gradient-gold hover-gold shadow-gold' : 'opacity-50'}`}
                        >
                          <Zap className="h-4 w-4 mr-2" />
                          {canUpgrade ? `Улучшить (₽${upgradeCost.toLocaleString()})` : 
                            well.level >= (wellType?.maxLevel || 20) ? 'Макс. уровень' : 'Недостаточно средств'}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Fuel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">У вас пока нет скважин</h3>
                <p className="text-muted-foreground mb-4">Перейдите в магазин, чтобы купить первую скважину</p>
                <Button onClick={() => setActiveSection('shop')}>
                  Перейти в магазин
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Shop Section */}
        {activeSection === 'shop' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="text-primary"
              >
                ← Назад к обзору
              </Button>
              <h2 className="text-3xl font-bold">Магазин скважин</h2>
              <Badge variant="secondary">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Доступно для покупки
              </Badge>
            </div>

            {/* Individual Wells */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wellTypes.map((wellType, index) => {
                const { monthlyIncome, yearlyIncome, yearlyPercent } = calculateProfitMetrics(wellType.baseIncome, wellType.price);
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="relative">
                          <img 
                            src={wellType.image} 
                            alt={wellType.name}
                            className="w-20 h-20 rounded-lg object-cover border-3 border-primary/30 shadow-lg"
                          />
                          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRarityColor(wellType.rarity)}`}>
                            {wellType.icon}
                          </div>
                        </div>
                        <div className="text-center">
                          <CardTitle className="text-sm font-medium mb-1">{wellType.name}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`text-xs capitalize ${getRarityBadgeColor(wellType.rarity)}`}
                          >
                            {wellType.rarity}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Цена:</span>
                          <Badge 
                            variant={profile.balance >= wellType.price ? "default" : "destructive"}
                            className={profile.balance >= wellType.price ? "" : "animate-pulse"}
                          >
                            ₽{wellType.price.toLocaleString()}
                          </Badge>
                        </div>
                        
                        <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">День:</span>
                            <span className="font-semibold text-primary">₽{wellType.baseIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Месяц:</span>
                            <span className="font-semibold text-accent-foreground">₽{monthlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Год:</span>
                            <span className="font-semibold text-accent-foreground">₽{yearlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-border pt-2">
                            <span className="text-muted-foreground font-medium">Годовой %:</span>
                            <Badge 
                              variant="secondary" 
                              className={`font-bold ${
                                yearlyPercent >= 100 ? 'bg-green-100 text-green-800' : 
                                yearlyPercent >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {formatProfitPercent(yearlyPercent)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Макс. уровень:</span>
                          <span className="text-muted-foreground">{wellType.maxLevel}</span>
                        </div>
                      </div>
                      <Button 
                        className={`w-full shadow-gold hover-gold ${
                          profile.balance >= wellType.price 
                            ? 'gradient-gold' 
                            : 'gradient-amber border-2 border-orange-400'
                        }`}
                        onClick={() => handleBuyWell(wellType)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {profile.balance >= wellType.price ? 'Купить' : 'Пополнить и купить'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Package Deals */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">Выгодные пакеты</h3>
                <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-300">
                  <Gem className="h-4 w-4 mr-1" />
                  Со скидкой до 31%
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {wellPackages.map((wellPackage, index) => {
                  const { monthlyIncome, yearlyIncome, yearlyPercent } = calculateProfitMetrics(wellPackage.totalDailyIncome, wellPackage.discountedPrice);
                  
                  const getPackageRarityColor = (rarity: string) => {
                    switch (rarity) {
                      case 'starter': return 'from-green-500 to-emerald-600';
                      case 'growth': return 'from-blue-500 to-indigo-600';
                      case 'business': return 'from-purple-500 to-violet-600';
                      case 'empire': return 'from-yellow-500 to-orange-600';
                      default: return 'from-gray-500 to-slate-600';
                    }
                  };

                  return (
                    <Card key={index} className="relative hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border-2">
                      <div className={`absolute top-0 right-0 bg-gradient-to-br ${getPackageRarityColor(wellPackage.rarity)} text-white px-3 py-1 rounded-bl-lg`}>
                        <span className="text-xs font-bold">-{wellPackage.discount}%</span>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="relative">
                            <img 
                              src={wellPackage.image} 
                              alt={wellPackage.name}
                              className="w-20 h-20 rounded-lg object-cover border-3 border-primary/30 shadow-lg"
                            />
                            <div className="absolute -top-2 -right-2 text-2xl">{wellPackage.icon}</div>
                          </div>
                          <div className="text-center">
                            <CardTitle className="text-lg font-bold mb-1">{wellPackage.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{wellPackage.description}</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4 pt-0">
                        <div className="space-y-2">
                          {wellPackage.wells.map((packageWell, wellIndex) => (
                            <div key={wellIndex} className="flex justify-between text-sm bg-secondary/20 rounded px-2 py-1">
                              <span>{packageWell.type}</span>
                              <span className="font-semibold">x{packageWell.count}</span>
                            </div>
                          ))}
                        </div>

                        <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
                          <div className="flex justify-between text-sm font-semibold text-center">
                            <span className="text-muted-foreground">Общая доходность:</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">День:</span>
                            <span className="font-semibold text-primary">₽{wellPackage.totalDailyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Месяц:</span>
                            <span className="font-semibold text-accent-foreground">₽{monthlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Год:</span>
                            <span className="font-semibold text-accent-foreground">₽{yearlyIncome.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm border-t border-border pt-2">
                            <span className="text-muted-foreground font-medium">Годовой %:</span>
                            <Badge 
                              variant="secondary" 
                              className={`font-bold ${
                                yearlyPercent >= 100 ? 'bg-green-100 text-green-800' : 
                                yearlyPercent >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }`}
                            >
                              {formatProfitPercent(yearlyPercent)}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground line-through">₽{wellPackage.originalPrice.toLocaleString()}</span>
                            <Badge 
                              variant={profile.balance >= wellPackage.discountedPrice ? "default" : "destructive"}
                              className={`text-lg font-bold ${profile.balance >= wellPackage.discountedPrice ? "" : "animate-pulse"}`}
                            >
                              ₽{wellPackage.discountedPrice.toLocaleString()}
                            </Badge>
                          </div>
                          <Button 
                            className={`w-full ${
                              profile.balance >= wellPackage.discountedPrice 
                                ? 'gradient-gold hover-gold shadow-gold' 
                                : 'gradient-amber border-2 border-orange-400'
                            }`}
                            onClick={() => handleBuyPackage(wellPackage)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {profile.balance >= wellPackage.discountedPrice ? 'Купить пакет' : 'Пополнить и купить'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Boosters Section */}
        {activeSection === 'boosters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => setActiveSection('overview')}
                className="text-primary"
              >
                ← Назад к обзору
              </Button>
              <h2 className="text-3xl font-bold">Магазин бустеров</h2>
              <div></div>
            </div>
            <BoosterShop />
          </div>
        )}

        {/* Dialogs */}
        <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                Пополнение баланса
              </DialogTitle>
              <DialogDescription>
                Пополните баланс для развития нефтяной империи
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                  💰 Быстрое пополнение реальными деньгами
                </h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Пополните баланс реальными деньгами для мгновенного получения игровой валюты и быстрого развития вашей нефтяной империи!
                </p>
              </div>
              <div>
                <Label htmlFor="amount">Сумма пополнения (₽)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Минимум 100 ₽"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  min="100"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setTopUpAmount("500")}
                  className="flex-1"
                >
                  500 ₽
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTopUpAmount("1000")}
                  className="flex-1"
                >
                  1000 ₽
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setTopUpAmount("5000")}
                  className="flex-1"
                >
                  5000 ₽
                </Button>
              </div>
              <Button
                onClick={handleTopUp}
                disabled={topUpLoading}
                className="w-full gradient-gold shadow-gold"
              >
                {topUpLoading ? "Обработка..." : "Пополнить баланс"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;