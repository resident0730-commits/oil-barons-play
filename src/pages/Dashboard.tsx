import { useState, useEffect } from "react";
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
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [balance, setBalance] = useState(1000);
  const [dailyIncome, setDailyIncome] = useState(0);
  const [wells, setWells] = useState<Array<{id: number, name: string, level: number, income: number, price: number}>>([]);
  const { toast } = useToast();

  const wellTypes = [
    { name: "Стартовая скважина", baseIncome: 50, price: 500, maxLevel: 5 },
    { name: "Средняя скважина", baseIncome: 150, price: 1500, maxLevel: 10 },
    { name: "Промышленная скважина", baseIncome: 500, price: 5000, maxLevel: 15 },
    { name: "Супер скважина", baseIncome: 1500, price: 15000, maxLevel: 20 }
  ];

  const buyWell = (wellType: typeof wellTypes[0]) => {
    if (balance >= wellType.price) {
      const newWell = {
        id: Date.now(),
        name: wellType.name,
        level: 1,
        income: wellType.baseIncome,
        price: wellType.price
      };
      
      setBalance(prev => prev - wellType.price);
      setWells(prev => [...prev, newWell]);
      setDailyIncome(prev => prev + wellType.baseIncome);
      
      toast({
        title: "Скважина куплена!",
        description: `${wellType.name} добавлена к вашему бизнесу`,
      });
    } else {
      toast({
        title: "Недостаточно средств",
        description: "Накопите больше денег для покупки",
        variant: "destructive"
      });
    }
  };

  const upgradeWell = (wellId: number) => {
    setWells(prev => prev.map(well => {
      if (well.id === wellId && well.level < 20) {
        const upgradeCost = well.price * 0.5 * well.level;
        if (balance >= upgradeCost) {
          setBalance(prevBalance => prevBalance - upgradeCost);
          setDailyIncome(prevIncome => prevIncome + well.income * 0.3);
          
          toast({
            title: "Скважина улучшена!",
            description: `${well.name} теперь уровень ${well.level + 1}`,
          });
          
          return {
            ...well,
            level: well.level + 1,
            income: Math.round(well.income * 1.3)
          };
        } else {
          toast({
            title: "Недостаточно средств",
            description: "Накопите больше денег для улучшения",
            variant: "destructive"
          });
        }
      }
      return well;
    }));
  };

  // Симуляция ежедневного дохода каждые 10 секунд (для демо)
  useEffect(() => {
    const interval = setInterval(() => {
      if (dailyIncome > 0) {
        const income = Math.round(dailyIncome / 8640); // Доход каждые 10 секунд
        setBalance(prev => prev + income);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [dailyIncome]);

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
                <span className="font-semibold">₽{balance.toLocaleString()}</span>
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
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
              <div className="text-2xl font-bold">₽{balance.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ежедневный доход</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{dailyIncome.toLocaleString()}</div>
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
                    {wellType.name}
                    <Badge variant={balance >= wellType.price ? "default" : "secondary"}>
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
                    onClick={() => buyWell(wellType)}
                    disabled={balance < wellType.price}
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
                const upgradeCost = Math.round(well.price * 0.5 * well.level);
                const canUpgrade = well.level < 20 && balance >= upgradeCost;
                
                return (
                  <Card key={well.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {well.name}
                        <Badge variant="outline">Ур. {well.level}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Доход в день:</p>
                        <p className="text-lg font-semibold text-primary">₽{well.income}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Прогресс уровня:</p>
                        <Progress value={(well.level / 20) * 100} className="h-2" />
                      </div>
                      {well.level < 20 && (
                        <Button 
                          variant="outline"
                          className="w-full" 
                          onClick={() => upgradeWell(well.id)}
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