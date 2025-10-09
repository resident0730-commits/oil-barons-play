import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp, Fuel, Package, Calendar, ArrowRight, Check } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

// Типы скважин и их характеристики (отсортированы по эффективности - доход/стоимость)
const WELL_TYPES = [
  { name: 'Премиум-скважина', dailyIncome: 1800, cost: 6000, efficiency: 0.3 },
  { name: 'Легендарная скважина', dailyIncome: 4590, cost: 15000, efficiency: 0.306 },
  { name: 'Космическая скважина', dailyIncome: 7500, cost: 25000, efficiency: 0.3 },
  { name: 'Средняя скважина', dailyIncome: 450, cost: 2000, efficiency: 0.225 },
  { name: 'Стартовая скважина', dailyIncome: 220, cost: 1100, efficiency: 0.2 },
  { name: 'Мини-скважина', dailyIncome: 20, cost: 100, efficiency: 0.2 },
  { name: 'Индустриальная скважина', dailyIncome: 2000, cost: 10000, efficiency: 0.2 },
  { name: 'Элитная скважина', dailyIncome: 1560, cost: 8000, efficiency: 0.195 },
  { name: 'Супер-скважина', dailyIncome: 224, cost: 1500, efficiency: 0.149 },
];

// Бустеры и их множители (постоянные)
const BOOSTERS = [
  { name: 'Продвинутое оборудование', multiplier: 2.0, cost: 8000 },
  { name: 'Автоматизация', multiplier: 1.8, cost: 6000 },
  { name: 'Турбо ускорение', multiplier: 1.5, cost: 5000 },
  { name: 'Геологическая разведка', multiplier: 1.3, cost: 3000 },
  { name: 'Бригада рабочих', multiplier: 1.2, cost: 2000 },
];

interface CalculatorProps {
  compact?: boolean;
}

interface WellPurchase {
  well: typeof WELL_TYPES[0];
  count: number;
}

interface BoosterPurchase {
  booster: typeof BOOSTERS[0];
  apply: boolean;
}

// Функция для расчета оптимального набора скважин
const calculateOptimalPurchases = (targetIncome: number): {
  wells: WellPurchase[];
  booster: typeof BOOSTERS[0] | null;
  totalCost: number;
  actualIncome: number;
  paybackDays: number;
} => {
  let bestSolution = {
    wells: [] as WellPurchase[],
    booster: null as typeof BOOSTERS[0] | null,
    totalCost: Infinity,
    actualIncome: 0,
    paybackDays: Infinity,
  };

  // Пробуем с бустером и без
  for (let useBooster = 0; useBooster <= 1; useBooster++) {
    const currentBooster = useBooster ? BOOSTERS[0] : null; // Берем лучший бустер
    const boosterMultiplier = currentBooster ? currentBooster.multiplier : 1.0;
    const requiredBaseIncome = targetIncome / boosterMultiplier;

    // Жадный алгоритм: покупаем самые эффективные скважины
    const purchases: WellPurchase[] = [];
    let currentIncome = 0;
    let totalCost = currentBooster ? currentBooster.cost : 0;

    // Сортируем по эффективности
    const sortedWells = [...WELL_TYPES].sort((a, b) => b.efficiency - a.efficiency);

    for (const well of sortedWells) {
      if (currentIncome >= requiredBaseIncome) break;

      const neededIncome = requiredBaseIncome - currentIncome;
      const count = Math.ceil(neededIncome / well.dailyIncome);

      if (count > 0) {
        purchases.push({ well, count });
        currentIncome += well.dailyIncome * count;
        totalCost += well.cost * count;
      }
    }

    const actualIncome = currentIncome * boosterMultiplier;
    const paybackDays = totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0;

    // Сохраняем решение, если оно лучше
    if (actualIncome >= targetIncome && totalCost < bestSolution.totalCost) {
      bestSolution = {
        wells: purchases,
        booster: currentBooster,
        totalCost,
        actualIncome,
        paybackDays,
      };
    }
  }

  return bestSolution;
};

export const ProfitabilityCalculator = ({ compact = false }: CalculatorProps) => {
  const { formatGameCurrency } = useCurrency();
  const [targetIncome, setTargetIncome] = useState(1000);

  const MIN_INCOME = 1000;
  const MAX_INCOME = 50000;
  const STEP = 500;

  // Рассчитываем оптимальную покупку
  const solution = useMemo(() => {
    return calculateOptimalPurchases(targetIncome);
  }, [targetIncome]);

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
              <p className="text-sm text-emerald-50/70 mb-1">Цель в день</p>
              <p className="text-2xl font-bold text-emerald-100">
                {formatGameCurrency(targetIncome)}
              </p>
            </div>
            <div className="text-center p-4 bg-emerald-500/20 rounded-xl">
              <Package className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-emerald-50/70 mb-1">Бюджет</p>
              <p className="text-2xl font-bold text-emerald-100">
                {formatGameCurrency(solution.totalCost)}
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
              Узнайте, что нужно купить для достижения желаемого дохода
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Выбор желаемого дохода */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Желаемый доход в день</Label>
            <Badge variant="secondary" className="text-xl px-4 py-2">
              {formatGameCurrency(targetIncome)}
            </Badge>
          </div>
          <Slider
            value={[targetIncome]}
            onValueChange={(value) => setTargetIncome(value[0])}
            min={MIN_INCOME}
            max={MAX_INCOME}
            step={STEP}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatGameCurrency(MIN_INCOME)}</span>
            <span>{formatGameCurrency(MAX_INCOME)}</span>
          </div>
        </div>

        {/* Результаты расчета */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Необходимый бюджет</p>
              <p className="text-3xl font-bold text-primary">
                {formatGameCurrency(solution.totalCost)}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Реальный доход в день</p>
              <p className="text-3xl font-bold text-accent">
                {formatGameCurrency(Math.floor(solution.actualIncome))}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-emerald-500/30">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">Срок окупаемости</p>
              <p className="text-3xl font-bold text-emerald-400">
                {solution.paybackDays} дней
              </p>
            </CardContent>
          </Card>
        </div>

        {/* План покупок */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold">План покупок</h3>
          </div>

          {/* Бустер */}
          {solution.booster && (
            <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/30 rounded-xl">
                      <Package className="h-8 w-8 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-purple-100">{solution.booster.name}</h4>
                        <Badge className="bg-purple-500/30 text-purple-100 border-purple-400">
                          x{solution.booster.multiplier} множитель
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">
                        Увеличивает доход от всех скважин в {solution.booster.multiplier} раз
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-100 border-purple-400">
                          {formatGameCurrency(solution.booster.cost)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Check className="h-6 w-6 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Скважины */}
          <div className="space-y-3">
            {solution.wells.map((purchase, index) => (
              <Card key={index} className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <Fuel className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold">{purchase.well.name}</h4>
                          <Badge className="bg-primary/30 text-primary-foreground">
                            x{purchase.count} шт
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">
                          Доход: {formatGameCurrency(purchase.well.dailyIncome)}/день за 1 шт
                        </p>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">
                            Цена за 1: {formatGameCurrency(purchase.well.cost)}
                          </Badge>
                          <Badge variant="secondary">
                            Итого: {formatGameCurrency(purchase.well.cost * purchase.count)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Check className="h-6 w-6 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Расчет окупаемости */}
        <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-400" />
              Прогноз доходности
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Доход за неделю</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatGameCurrency(Math.floor(solution.actualIncome * 7))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Доход за месяц</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatGameCurrency(Math.floor(solution.actualIncome * 30))}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Прибыль после окупаемости</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatGameCurrency(Math.floor(solution.actualIncome * 30 - solution.totalCost))}
                </p>
                <p className="text-xs text-muted-foreground mt-1">За первый месяц</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Подсказка */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <p className="text-sm text-center text-blue-100">
              💡 <strong>Совет:</strong> Для достижения дохода {formatGameCurrency(targetIncome)} в день вам понадобится бюджет {formatGameCurrency(solution.totalCost)}. 
              Инвестиция окупится за {solution.paybackDays} дней!
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
