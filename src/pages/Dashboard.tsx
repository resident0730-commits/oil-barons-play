import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Gem
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGameData, wellTypes } from "@/hooks/useGameData";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, wells, loading, buyWell, upgradeWell, addIncome } = useGameData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getWellIcon = (wellTypeName: string) => {
    switch (wellTypeName) {
      case "Стартовая скважина":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "Средняя скважина":
        return <Fuel className="h-5 w-5 text-orange-500" />;
      case "Промышленная скважина":
        return <Factory className="h-5 w-5 text-blue-500" />;
      case "Супер скважина":
        return <Gem className="h-5 w-5 text-purple-500" />;
      default:
        return <Fuel className="h-5 w-5" />;
    }
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Fuel className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Oil Tycoon</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="font-semibold">₽{profile.balance.toLocaleString()}</span>
              </div>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Баланс</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{profile.balance.toLocaleString()}</div>
            </CardContent>
          </Card>
          
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

        {/* Marketplace */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Магазин скважин</h2>
            <Badge variant="secondary">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Доступно для покупки
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellTypes.map((wellType, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getWellIcon(wellType.name)}
                      <span className="text-sm">{wellType.name}</span>
                    </div>
                    <Badge variant={profile.balance >= wellType.price ? "default" : "secondary"}>
                      ₽{wellType.price.toLocaleString()}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Доход в день:</p>
                    <p className="text-lg font-semibold text-primary">₽{wellType.baseIncome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Макс. уровень:</p>
                    <p className="text-sm">{wellType.maxLevel}</p>
                  </div>
                  <Button 
                    className="w-full gradient-gold shadow-gold" 
                    onClick={() => handleBuyWell(wellType)}
                    disabled={profile.balance < wellType.price}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Купить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Wells */}
        {wells.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">Мои скважины</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wells.map((well) => {
                const upgradeCost = Math.round((wellTypes.find(wt => wt.name === well.well_type)?.price || 1000) * 0.5 * well.level);
                const canUpgrade = well.level < 20 && profile.balance >= upgradeCost;
                
                return (
                  <Card key={well.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getWellIcon(well.well_type)}
                          <span className="text-sm">{well.well_type}</span>
                        </div>
                        <Badge variant="outline">Ур. {well.level}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Доход в день:</p>
                        <p className="text-lg font-semibold text-primary">₽{well.daily_income}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Прогресс уровня:</p>
                        <Progress value={(well.level / 20) * 100} className="h-2" />
                      </div>
                      {well.level < 20 && (
                        <Button 
                          variant="outline"
                          className="w-full" 
                          onClick={() => handleUpgradeWell(well.id)}
                          disabled={!canUpgrade}
                        >
                          Улучшить за ₽{upgradeCost.toLocaleString()}
                        </Button>
                      )}
                      {well.level >= 20 && (
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