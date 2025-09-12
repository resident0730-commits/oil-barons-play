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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Fuel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Oil Tycoon</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTopUpOpen(true)}
                aria-label="Пополнить баланс"
                className="flex items-center space-x-2"
              >
                <Wallet className="h-5 w-5 text-primary" />
                <span className="font-semibold">₽{profile.balance.toLocaleString()}</span>
              </Button>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{profile.nickname}</span>
              </div>
              <Link to="/profile">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/statistics">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm">
                  <Trophy className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/rules">
                <Button variant="ghost" size="sm">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Shield className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        <DailyBonus />
        
        {activeSection === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow group bg-gradient-to-br from-primary/5 to-accent/5"
                onClick={() => setIsTopUpOpen(true)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Баланс</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <Plus className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₽{profile.balance.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Нажмите для пополнения</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Доходность в день</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">₽{profile.daily_income.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Скважины</CardTitle>
                  <Fuel className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{wells.length}</div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-500/5 to-pink-500/5"
                onClick={() => navigate('/leaderboard')}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
                  <Trophy className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {leaderboardLoading ? "..." : profile?.nickname ? `#${getPlayerRank(profile.nickname) || "?"}` : "#?"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Нажмите для просмотра</p>
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
              <Button variant="ghost" onClick={() => setActiveSection('overview')} className="text-primary">← Назад</Button>
              <h2 className="text-3xl font-bold">Мои скважины</h2>
              <div></div>
            </div>
            <BoosterShop />
          </div>
        )}

        {/* Shop Section */}
        {activeSection === 'shop' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveSection('overview')} className="text-primary">← Назад</Button>
              <h2 className="text-3xl font-bold">Магазин скважин</h2>
              <div></div>
            </div>
          </div>
        )}

        {/* Boosters Section */}
        {activeSection === 'boosters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setActiveSection('overview')} className="text-primary">← Назад</Button>
              <h2 className="text-3xl font-bold">Бустеры</h2>
              <div></div>
            </div>
            <BoosterShop />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
