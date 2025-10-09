import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, Zap, Crown, Package, Users, Calendar } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

// Типы скважин и их характеристики
const WELL_TYPES = {
  'Мини-скважина': { dailyIncome: 20, cost: 100, level1Income: 20 },
  'Стартовая скважина': { dailyIncome: 220, cost: 1100, level1Income: 220 },
  'Супер-скважина': { dailyIncome: 224, cost: 1500, level1Income: 224 },
  'Средняя скважина': { dailyIncome: 450, cost: 2000, level1Income: 450 },
  'Премиум-скважина': { dailyIncome: 1800, cost: 6000, level1Income: 1800 },
  'Элитная скважина': { dailyIncome: 1560, cost: 8000, level1Income: 1560 },
  'Индустриальная скважина': { dailyIncome: 2000, cost: 10000, level1Income: 2000 },
  'Легендарная скважина': { dailyIncome: 4590, cost: 15000, level1Income: 4590 },
  'Космическая скважина': { dailyIncome: 7500, cost: 25000, level1Income: 7500 },
};

// Бустеры и их множители
const BOOSTERS = {
  'Турбо ускорение': { multiplier: 1.5, duration: 24 },
  'Геологическая разведка': { multiplier: 1.3, duration: 48 },
  'Продвинутое оборудование': { multiplier: 2.0, duration: 12 },
  'Бригада рабочих': { multiplier: 1.2, duration: 72 },
  'Автоматизация': { multiplier: 1.8, duration: 36 },
};

interface CalculatorProps {
  compact?: boolean;
}

export const ProfitabilityCalculator = ({ compact = false }: CalculatorProps) => {
  const { formatGameCurrency } = useCurrency();
  const [selectedWells, setSelectedWells] = useState<Record<string, number>>({});
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);
  const [statusMultiplier, setStatusMultiplier] = useState(1.0);
  const [referralBonus, setReferralBonus] = useState(0);
  const [depositBonus, setDepositBonus] = useState(0);

  // Расчет общего дохода
  const calculations = useMemo(() => {
    // Базовый доход от скважин
    let baseIncome = 0;
    let totalInvestment = 0;
    
    Object.entries(selectedWells).forEach(([wellType, count]) => {
      const well = WELL_TYPES[wellType as keyof typeof WELL_TYPES];
      if (well && count > 0) {
        baseIncome += well.dailyIncome * count;
        totalInvestment += well.cost * count;
      }
    });

    // Множитель от бустеров
    let boosterMultiplier = 1.0;
    selectedBoosters.forEach(boosterName => {
      const booster = BOOSTERS[boosterName as keyof typeof BOOSTERS];
      if (booster) {
        boosterMultiplier *= booster.multiplier;
      }
    });

    // Итоговый доход
    const dailyIncome = baseIncome * boosterMultiplier * statusMultiplier + referralBonus + depositBonus;
    const weeklyIncome = dailyIncome * 7;
    const monthlyIncome = dailyIncome * 30;
    
    // Срок окупаемости (в днях)
    const paybackDays = totalInvestment > 0 ? Math.ceil(totalInvestment / dailyIncome) : 0;

    return {
      baseIncome,
      dailyIncome,
      weeklyIncome,
      monthlyIncome,
      totalInvestment,
      paybackDays,
      boosterMultiplier,
    };
  }, [selectedWells, selectedBoosters, statusMultiplier, referralBonus, depositBonus]);

  const updateWellCount = (wellType: string, count: number) => {
    setSelectedWells(prev => ({
      ...prev,
      [wellType]: Math.max(0, count),
    }));
  };

  const toggleBooster = (boosterName: string) => {
    setSelectedBoosters(prev => 
      prev.includes(boosterName) 
        ? prev.filter(b => b !== boosterName)
        : [...prev, boosterName]
    );
  };

  if (compact) {
    return (
      <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-500">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-emerald-400/40 transition-all duration-500"></div>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-500/30 rounded-xl">
              <Calculator className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-2xl text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Калькулятор доходности
              </CardTitle>
              <CardDescription className="text-emerald-50/70">
                Рассчитайте свой потенциальный доход
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-emerald-500/20 rounded-xl">
              <Calendar className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-emerald-50/70 mb-1">В день</p>
              <p className="text-2xl font-bold text-emerald-100">
                {formatGameCurrency(calculations.dailyIncome)}
              </p>
            </div>
            <div className="text-center p-4 bg-emerald-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-emerald-50/70 mb-1">В месяц</p>
              <p className="text-2xl font-bold text-emerald-100">
                {formatGameCurrency(calculations.monthlyIncome)}
              </p>
            </div>
          </div>
          <Link to="/dashboard?section=calculator">
            <Button className="w-full gradient-primary" size="lg">
              <Calculator className="mr-2 h-5 w-5" />
              Открыть полный калькулятор
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-xl border-2 border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-primary/20 rounded-xl">
            <Calculator className="h-8 w-8 text-primary" />
          </div>
          <div>
            <CardTitle className="text-3xl">Калькулятор доходности</CardTitle>
            <CardDescription className="text-lg">
              Рассчитайте потенциальный доход от вашей нефтяной империи
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="wells" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wells">Скважины</TabsTrigger>
            <TabsTrigger value="boosters">Бустеры</TabsTrigger>
            <TabsTrigger value="bonuses">Бонусы</TabsTrigger>
            <TabsTrigger value="results">Результаты</TabsTrigger>
          </TabsList>

          <TabsContent value="wells" className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(WELL_TYPES).map(([wellType, data]) => (
                <div key={wellType} className="p-4 border border-primary/20 rounded-lg bg-card/50 backdrop-blur-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{wellType}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatGameCurrency(data.dailyIncome)}/день • Цена: {formatGameCurrency(data.cost)}
                      </p>
                    </div>
                    <Badge variant="secondary">{selectedWells[wellType] || 0} шт</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateWellCount(wellType, (selectedWells[wellType] || 0) - 1)}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="0"
                      value={selectedWells[wellType] || 0}
                      onChange={(e) => updateWellCount(wellType, parseInt(e.target.value) || 0)}
                      className="text-center"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateWellCount(wellType, (selectedWells[wellType] || 0) + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="boosters" className="space-y-4">
            <div className="grid gap-3">
              {Object.entries(BOOSTERS).map(([boosterName, data]) => (
                <Button
                  key={boosterName}
                  variant={selectedBoosters.includes(boosterName) ? "default" : "outline"}
                  className="justify-between h-auto p-4"
                  onClick={() => toggleBooster(boosterName)}
                >
                  <div className="text-left">
                    <div className="font-semibold">{boosterName}</div>
                    <div className="text-sm opacity-80">
                      +{((data.multiplier - 1) * 100).toFixed(0)}% на {data.duration}ч
                    </div>
                  </div>
                  <Zap className={`h-5 w-5 ${selectedBoosters.includes(boosterName) ? 'text-yellow-400' : ''}`} />
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bonuses" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Crown className="h-5 w-5 text-primary" />
                  Множитель от статуса: {statusMultiplier.toFixed(2)}x
                </Label>
                <Slider
                  value={[statusMultiplier]}
                  onValueChange={(value) => setStatusMultiplier(value[0])}
                  min={1.0}
                  max={2.0}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Бонус от статусных титулов (Король нефти, Лидер и т.д.)
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-primary" />
                  Доход от рефералов (в день)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={referralBonus}
                  onChange={(e) => setReferralBonus(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Дополнительный доход от реферальной программы
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Package className="h-5 w-5 text-primary" />
                  Бонус за пополнение (в день)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={depositBonus}
                  onChange={(e) => setDepositBonus(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Дополнительные бонусы от пополнения баланса
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Ежедневный доход</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatGameCurrency(calculations.dailyIncome)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Еженедельный доход</p>
                    <p className="text-3xl font-bold text-accent">
                      {formatGameCurrency(calculations.weeklyIncome)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-2">Месячный доход</p>
                    <p className="text-3xl font-bold text-emerald-400">
                      {formatGameCurrency(calculations.monthlyIncome)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-orange-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500/30 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-orange-400" />
                      </div>
                      <h3 className="text-lg font-semibold">Инвестиции</h3>
                    </div>
                    <p className="text-2xl font-bold text-orange-400">
                      {formatGameCurrency(calculations.totalInvestment)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Общая стоимость всех скважин
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-500/30 rounded-lg">
                        <Calendar className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="text-lg font-semibold">Окупаемость</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">
                      {calculations.paybackDays > 0 ? `${calculations.paybackDays} дней` : '—'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Срок возврата инвестиций
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Множители
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Базовый доход:</span>
                      <span className="font-semibold">{formatGameCurrency(calculations.baseIncome)}/день</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Множитель бустеров:</span>
                      <span className="font-semibold text-primary">{calculations.boosterMultiplier.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Множитель статуса:</span>
                      <span className="font-semibold text-accent">{statusMultiplier.toFixed(2)}x</span>
                    </div>
                    {referralBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Бонус рефералов:</span>
                        <span className="font-semibold text-emerald-400">+{formatGameCurrency(referralBonus)}/день</span>
                      </div>
                    )}
                    {depositBonus > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Бонус пополнения:</span>
                        <span className="font-semibold text-purple-400">+{formatGameCurrency(depositBonus)}/день</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};