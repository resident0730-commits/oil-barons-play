import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Calculator, TrendingUp, Fuel, Package, Calendar, ArrowRight, Check } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';

// Типы скважин и их характеристики (данные из useGameData.tsx)
const WELL_TYPES = [
  { name: 'Космическая скважина', dailyIncome: 1440, cost: 40000, efficiency: 0.036 },
  { name: 'Легендарная скважина', dailyIncome: 918, cost: 27000, efficiency: 0.034 },
  { name: 'Элитная скважина', dailyIncome: 576, cost: 18000, efficiency: 0.032 },
  { name: 'Премиум-скважина', dailyIncome: 360, cost: 12000, efficiency: 0.03 },
  { name: 'Супер-скважина', dailyIncome: 224, cost: 8000, efficiency: 0.028 },
  { name: 'Промышленная скважина', dailyIncome: 130, cost: 5000, efficiency: 0.026 },
  { name: 'Средняя скважина', dailyIncome: 72, cost: 3000, efficiency: 0.024 },
  { name: 'Стартовая скважина', dailyIncome: 44, cost: 2000, efficiency: 0.022 },
  { name: 'Мини-скважина', dailyIncome: 20, cost: 1000, efficiency: 0.02 },
];

// Пакеты скважин (данные из useGameData.tsx - wellPackages)
const WELL_PACKAGES = [
  { 
    name: 'Стартовый пакет', 
    wells: [
      { type: 'Мини-скважина', count: 3, dailyIncome: 20 },
      { type: 'Стартовая скважина', count: 1, dailyIncome: 44 }
    ],
    cost: 3800, 
    totalIncome: 104,
    discount: '24%'
  },
  { 
    name: 'Пакет роста', 
    wells: [
      { type: 'Стартовая скважина', count: 2, dailyIncome: 44 },
      { type: 'Средняя скважина', count: 2, dailyIncome: 72 },
      { type: 'Промышленная скважина', count: 1, dailyIncome: 130 }
    ],
    cost: 12500, 
    totalIncome: 290,
    discount: '22%'
  },
  { 
    name: 'Бизнес пакет', 
    wells: [
      { type: 'Промышленная скважина', count: 3, dailyIncome: 130 },
      { type: 'Супер-скважина', count: 2, dailyIncome: 224 },
      { type: 'Премиум-скважина', count: 1, dailyIncome: 360 }
    ],
    cost: 42000, 
    totalIncome: 1208,
    discount: '24%'
  },
  { 
    name: 'Империя пакет', 
    wells: [
      { type: 'Премиум-скважина', count: 2, dailyIncome: 360 },
      { type: 'Элитная скважина', count: 2, dailyIncome: 576 },
      { type: 'Легендарная скважина', count: 1, dailyIncome: 918 }
    ],
    cost: 72000, 
    totalIncome: 2790,
    discount: '25%'
  }
];

// Бустеры и их множители (постоянные улучшения, 1 уровень)
// Данные из useGameData.tsx - calculateBoosterMultiplier()
const BOOSTERS = [
  { name: 'Современное оборудование', multiplier: 1.35, cost: 20000, bonusPercent: 35 }, // +35% за 1 уровень
  { name: 'Геологические исследования', multiplier: 1.25, cost: 8000, bonusPercent: 25 }, // +25% за 1 уровень
  { name: 'Автоматизация', multiplier: 1.2, cost: 15000, bonusPercent: 20 }, // +20% за 1 уровень
  { name: 'Квалифицированная бригада', multiplier: 1.15, cost: 5000, bonusPercent: 15 }, // +15% за 1 уровень
  // Турбо режим - временный, не включаем в калькулятор
];

interface CalculatorProps {
  compact?: boolean;
}

interface WellPurchase {
  well: typeof WELL_TYPES[0];
  count: number;
}

interface PackagePurchase {
  package: typeof WELL_PACKAGES[0];
  count: number;
}

interface BoosterPurchase {
  booster: typeof BOOSTERS[0];
  apply: boolean;
}

// Функция для расчета оптимального набора скважин и пакетов
const calculateOptimalPurchases = (targetIncome: number): {
  wells: WellPurchase[];
  packages: PackagePurchase[];
  booster: typeof BOOSTERS[0] | null;
  totalCost: number;
  actualIncome: number;
  paybackDays: number;
} => {
  let bestSolution = {
    wells: [] as WellPurchase[],
    packages: [] as PackagePurchase[],
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

    // Вариант 1: Покупка только пакетов
    let packageSolution = calculatePackagesSolution(requiredBaseIncome, currentBooster);
    
    // Вариант 2: Покупка только отдельных скважин
    let individualSolution = calculateIndividualWellsSolution(requiredBaseIncome, currentBooster);
    
    // Вариант 3: Комбинация пакетов и отдельных скважин
    let combinedSolution = calculateCombinedSolution(requiredBaseIncome, currentBooster);

    // Выбираем лучшее решение
    const solutions = [packageSolution, individualSolution, combinedSolution];
    const bestCurrent = solutions.reduce((best, current) => 
      current.totalCost < best.totalCost ? current : best
    );

    if (bestCurrent.actualIncome >= targetIncome && bestCurrent.totalCost < bestSolution.totalCost) {
      bestSolution = bestCurrent;
    }
  }

  return bestSolution;
};

// Расчет решения только с пакетами
const calculatePackagesSolution = (requiredBaseIncome: number, booster: typeof BOOSTERS[0] | null) => {
  const packages: PackagePurchase[] = [];
  let currentIncome = 0;
  let totalCost = booster ? booster.cost : 0;
  const boosterMultiplier = booster ? booster.multiplier : 1.0;

  // Сортируем пакеты по эффективности (доход/стоимость)
  const sortedPackages = [...WELL_PACKAGES].sort((a, b) => 
    (b.totalIncome / b.cost) - (a.totalIncome / a.cost)
  );

  for (const pkg of sortedPackages) {
    if (currentIncome >= requiredBaseIncome) break;

    const neededIncome = requiredBaseIncome - currentIncome;
    const count = Math.ceil(neededIncome / pkg.totalIncome);

    if (count > 0) {
      packages.push({ package: pkg, count });
      currentIncome += pkg.totalIncome * count;
      totalCost += pkg.cost * count;
    }
  }

  const actualIncome = currentIncome * boosterMultiplier;
  const paybackDays = totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0;

  return {
    wells: [] as WellPurchase[],
    packages,
    booster,
    totalCost,
    actualIncome,
    paybackDays,
  };
};

// Расчет решения только с отдельными скважинами
const calculateIndividualWellsSolution = (requiredBaseIncome: number, booster: typeof BOOSTERS[0] | null) => {
  const wells: WellPurchase[] = [];
  let currentIncome = 0;
  let totalCost = booster ? booster.cost : 0;
  const boosterMultiplier = booster ? booster.multiplier : 1.0;

  // Сортируем по эффективности
  const sortedWells = [...WELL_TYPES].sort((a, b) => b.efficiency - a.efficiency);

  for (const well of sortedWells) {
    if (currentIncome >= requiredBaseIncome) break;

    const neededIncome = requiredBaseIncome - currentIncome;
    const count = Math.ceil(neededIncome / well.dailyIncome);

    if (count > 0) {
      wells.push({ well, count });
      currentIncome += well.dailyIncome * count;
      totalCost += well.cost * count;
    }
  }

  const actualIncome = currentIncome * boosterMultiplier;
  const paybackDays = totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0;

  return {
    wells,
    packages: [] as PackagePurchase[],
    booster,
    totalCost,
    actualIncome,
    paybackDays,
  };
};

// Расчет комбинированного решения (пакеты + отдельные скважины)
const calculateCombinedSolution = (requiredBaseIncome: number, booster: typeof BOOSTERS[0] | null) => {
  const packages: PackagePurchase[] = [];
  const wells: WellPurchase[] = [];
  let currentIncome = 0;
  let totalCost = booster ? booster.cost : 0;
  const boosterMultiplier = booster ? booster.multiplier : 1.0;

  // Сначала используем самый выгодный пакет
  const bestPackage = [...WELL_PACKAGES].sort((a, b) => 
    (b.totalIncome / b.cost) - (a.totalIncome / a.cost)
  )[0];

  if (bestPackage && currentIncome < requiredBaseIncome) {
    const neededIncome = requiredBaseIncome - currentIncome;
    const count = Math.floor(neededIncome / bestPackage.totalIncome);
    
    if (count > 0) {
      packages.push({ package: bestPackage, count });
      currentIncome += bestPackage.totalIncome * count;
      totalCost += bestPackage.cost * count;
    }
  }

  // Добираем отдельными скважинами
  if (currentIncome < requiredBaseIncome) {
    const sortedWells = [...WELL_TYPES].sort((a, b) => b.efficiency - a.efficiency);
    
    for (const well of sortedWells) {
      if (currentIncome >= requiredBaseIncome) break;

      const neededIncome = requiredBaseIncome - currentIncome;
      const count = Math.ceil(neededIncome / well.dailyIncome);

      if (count > 0) {
        wells.push({ well, count });
        currentIncome += well.dailyIncome * count;
        totalCost += well.cost * count;
        break; // Берем только один тип скважин для добора
      }
    }
  }

  const actualIncome = currentIncome * boosterMultiplier;
  const paybackDays = totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0;

  return {
    wells,
    packages,
    booster,
    totalCost,
    actualIncome,
    paybackDays,
  };
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

          {/* Пакеты скважин */}
          {solution.packages.length > 0 && (
            <div className="space-y-3">
              {solution.packages.map((purchase, index) => (
                <Card key={`pkg-${index}`} className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/30 rounded-xl">
                          <Package className="h-8 w-8 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-xl font-bold text-blue-100">{purchase.package.name}</h4>
                            <Badge className="bg-blue-500/30 text-blue-100 border-blue-400">
                              x{purchase.count} шт
                            </Badge>
                            <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-400">
                              {purchase.package.discount} скидка
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">
                            Доход: {formatGameCurrency(purchase.package.totalIncome)}/день за пакет
                          </p>
                          <div className="text-sm text-muted-foreground mb-3">
                            Включает: {purchase.package.wells.map(w => `${w.type} x${w.count}`).join(', ')}
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-blue-100 border-blue-400">
                              Цена за 1: {formatGameCurrency(purchase.package.cost)}
                            </Badge>
                            <Badge variant="secondary">
                              Итого: {formatGameCurrency(purchase.package.cost * purchase.count)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Check className="h-6 w-6 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
