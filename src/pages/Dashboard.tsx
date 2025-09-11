import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  CreditCard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGameData, wellTypes, wellPackages } from "@/hooks/useGameData";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, wells, loading, buyWell, buyPackage, upgradeWell, addIncome } = useGameData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

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
      const income = Math.round(profile.daily_income / 8640); // Income every 10 seconds
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
        description: "Доходность увеличена!",
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
      // Имитация успешного пополнения (в реальном приложении здесь будет платежная система)
      setTimeout(() => {
        addIncome(value);
        toast({
          title: "Баланс пополнен!",
          description: `Добавлено ${value} ₽ к вашему балансу`,
        });
        setTopUpAmount("");
        setIsTopUpOpen(false);
        setTopUpLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка пополнения",
        description: "Попробуйте позже"
      });
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
    <div className="min-h-screen bg-transparent">
      {/* Header */}
      <header className="border-b border-border">
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
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-lg transition-shadow group"
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

          <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-primary" />
                  Пополнение баланса
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
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
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ежедневный доход</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{profile.daily_income.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Скважины</CardTitle>
              <Fuel className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{wells.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#42</div>
            </CardContent>
          </Card>
        </div>

        {/* My Wells */}
        {wells.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Мои скважины</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wells.map((well) => {
                const wellType = wellTypes.find(wt => wt.name === well.well_type);
                const upgradeCost = Math.round((wellType?.price || 1000) * 0.3 * well.level);
                const canUpgrade = well.level < (wellType?.maxLevel || 20) && profile.balance >= upgradeCost;
                const { monthlyIncome, yearlyIncome, yearlyPercent } = calculateProfitMetrics(well.daily_income, wellType?.price || 1000);
                
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
                        <Badge variant="outline">Ур. {well.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">День:</span>
                          <span className="font-semibold text-primary">₽{well.daily_income.toLocaleString()}</span>
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
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Уровень {well.level}/{wellType?.maxLevel || 20}
                        </div>
                        <Progress 
                          value={(well.level / (wellType?.maxLevel || 20)) * 100} 
                          className="w-20"
                        />
                      </div>
                      
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
          </div>
        )}

        {/* Marketplace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Магазин скважин</h2>
            <Badge variant="secondary">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Доступно для покупки
            </Badge>
          </div>

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
        </div>

        {/* Package Deals */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Выгодные пакеты</h2>
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

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between text-sm line-through text-muted-foreground">
                        <span>Обычная цена:</span>
                        <span>₽{wellPackage.originalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Цена пакета:</span>
                        <Badge 
                          variant={profile.balance >= wellPackage.discountedPrice ? "default" : "destructive"}
                          className={`text-sm ${profile.balance >= wellPackage.discountedPrice ? "" : "animate-pulse"}`}
                        >
                          ₽{wellPackage.discountedPrice.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="text-center text-sm font-semibold text-green-600">
                        Экономия: ₽{(wellPackage.originalPrice - wellPackage.discountedPrice).toLocaleString()}
                      </div>
                    </div>

                    <Button
                      onClick={() => handleBuyPackage(wellPackage)}
                      disabled={profile.balance < wellPackage.discountedPrice}
                      className={`w-full ${profile.balance >= wellPackage.discountedPrice 
                        ? `bg-gradient-to-r ${getPackageRarityColor(wellPackage.rarity)} hover:opacity-90` 
                        : 'opacity-50'
                      }`}
                    >
                      {profile.balance >= wellPackage.discountedPrice ? "Купить пакет" : "Недостаточно средств"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Marketplace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Магазин скважин</h2>
            <Badge variant="secondary">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Доступно для покупки
            </Badge>
          </div>

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
        </div>

      </div>
    </div>
  );
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Мои скважины</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wells.map((well) => {
                const wellType = wellTypes.find(wt => wt.name === well.well_type);
                const upgradeCost = Math.round((wellType?.price || 1000) * 0.3 * well.level);
                const canUpgrade = well.level < (wellType?.maxLevel || 20) && profile.balance >= upgradeCost;
                const { monthlyIncome, yearlyIncome, yearlyPercent } = calculateProfitMetrics(well.daily_income, wellType?.price || 1000);
                
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
                        <Badge variant="outline">Ур. {well.level}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                      <div className="bg-secondary/20 rounded-lg p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">День:</span>
                          <span className="font-semibold text-primary">₽{well.daily_income.toLocaleString()}</span>
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
                              yearlyPercent >= 200 ? 'bg-green-100 text-green-800' : 
                              yearlyPercent >= 100 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {formatProfitPercent(yearlyPercent)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Прогресс уровня:</p>
                        <Progress value={(well.level / (wellType?.maxLevel || 20)) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {well.level}/{wellType?.maxLevel || 20}
                        </p>
                      </div>
                      {well.level < (wellType?.maxLevel || 20) && (
                        <Button 
                          variant="outline"
                          className={`w-full hover-gold ${
                            profile.balance >= upgradeCost 
                              ? '' 
                              : 'border-orange-400 text-orange-600'
                          }`}
                          onClick={() => handleUpgradeWell(well.id)}
                        >
                          {profile.balance >= upgradeCost 
                            ? `Улучшить за ₽${upgradeCost.toLocaleString()}` 
                            : `Пополнить (₽${upgradeCost.toLocaleString()})`
                          }
                        </Button>
                      )}
                      {well.level >= (wellType?.maxLevel || 20) && (
                        <Badge variant="secondary" className="w-full justify-center">
                          Максимальный уровень
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;