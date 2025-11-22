import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Calculator, TrendingUp, Fuel, Package, Calendar, ArrowRight, Check, Coins } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';

// Типы скважин и их характеристики (данные из useGameData.tsx)
// ВАЖНО: dailyIncome указан в БАРРЕЛЯХ, а cost в OILCOINS
const WELL_TYPES = [
  { name: 'Космическая скважина', dailyIncome: 1440000, cost: 40000, efficiency: 0.036 },
  { name: 'Легендарная скважина', dailyIncome: 918000, cost: 27000, efficiency: 0.034 },
  { name: 'Элитная скважина', dailyIncome: 576000, cost: 18000, efficiency: 0.032 },
  { name: 'Премиум-скважина', dailyIncome: 360000, cost: 12000, efficiency: 0.03 },
  { name: 'Супер-скважина', dailyIncome: 224000, cost: 8000, efficiency: 0.028 },
  { name: 'Промышленная скважина', dailyIncome: 130000, cost: 5000, efficiency: 0.026 },
  { name: 'Средняя скважина', dailyIncome: 72000, cost: 3000, efficiency: 0.024 },
  { name: 'Стартовая скважина', dailyIncome: 44000, cost: 2000, efficiency: 0.022 },
  { name: 'Мини-скважина', dailyIncome: 20000, cost: 1000, efficiency: 0.02 },
];

// Пакеты скважин (данные из useGameData.tsx - wellPackages)
// ВАЖНО: totalIncome и dailyIncome в БАРРЕЛЯХ, cost в OILCOINS
const WELL_PACKAGES = [
  { 
    name: 'Стартовый пакет', 
    wells: [
      { type: 'Мини-скважина', count: 3, dailyIncome: 20000 },
      { type: 'Стартовая скважина', count: 1, dailyIncome: 44000 }
    ],
    cost: 3800, 
    totalIncome: 104000,
    discount: '24%'
  },
  { 
    name: 'Пакет роста', 
    wells: [
      { type: 'Стартовая скважина', count: 2, dailyIncome: 44000 },
      { type: 'Средняя скважина', count: 2, dailyIncome: 72000 },
      { type: 'Промышленная скважина', count: 1, dailyIncome: 130000 }
    ],
    cost: 12500, 
    totalIncome: 290000,
    discount: '22%'
  },
  { 
    name: 'Бизнес пакет', 
    wells: [
      { type: 'Промышленная скважина', count: 3, dailyIncome: 130000 },
      { type: 'Супер-скважина', count: 2, dailyIncome: 224000 },
      { type: 'Премиум-скважина', count: 1, dailyIncome: 360000 }
    ],
    cost: 42000, 
    totalIncome: 1208000,
    discount: '24%'
  },
  { 
    name: 'Империя пакет', 
    wells: [
      { type: 'Премиум-скважина', count: 2, dailyIncome: 360000 },
      { type: 'Элитная скважина', count: 2, dailyIncome: 576000 },
      { type: 'Легендарная скважина', count: 1, dailyIncome: 918000 }
    ],
    cost: 72000, 
    totalIncome: 2790000,
    discount: '25%'
  }
];

// Бустеры и их множители (постоянные улучшения, 1 уровень)
// Данные из BoosterShop.tsx - bonusPerLevel
const BOOSTERS = [
  { name: 'Современное оборудование', multiplier: 1.25, cost: 20000, bonusPercent: 25 }, // +25% за 1 уровень
  { name: 'Автоматизация', multiplier: 1.2, cost: 15000, bonusPercent: 20 }, // +20% за 1 уровень
  { name: 'Геологические исследования', multiplier: 1.15, cost: 8000, bonusPercent: 15 }, // +15% за 1 уровень
  { name: 'Квалифицированная бригада', multiplier: 1.1, cost: 5000, bonusPercent: 10 }, // +10% за 1 уровень
  // Турбо режим - временный (+50%), не включаем в калькулятор
];

interface CalculatorProps {
  compact?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  // ВАЖНО: Курс обмена 1 OilCoin = 1000 Barrels
  const BARREL_TO_OILCOIN = 1000;
  
  let bestSolution = {
    wells: [] as WellPurchase[],
    packages: [] as PackagePurchase[],
    booster: null as typeof BOOSTERS[0] | null,
    totalCost: Infinity,
    actualIncome: 0,
    paybackDays: Infinity,
  };

  // Пробуем без бустера и с каждым бустером
  const boosterOptions = [null, ...BOOSTERS];
  
  for (const currentBooster of boosterOptions) {
    const boosterMultiplier = currentBooster ? currentBooster.multiplier : 1.0;
    const requiredBaseIncome = targetIncome / boosterMultiplier;
    const boosterCost = currentBooster ? currentBooster.cost : 0;

    // Перебираем все возможные комбинации
    
    // 1. Только одна скважина нужного типа
    for (const well of WELL_TYPES) {
      // Конвертируем доход из баррелей в OilCoins для расчета окупаемости
      const wellDailyIncomeInOC = well.dailyIncome / BARREL_TO_OILCOIN;
      const count = Math.ceil(requiredBaseIncome / wellDailyIncomeInOC);
      const totalCost = well.cost * count + boosterCost;
      const actualIncome = wellDailyIncomeInOC * count * boosterMultiplier;
      
      if (actualIncome >= targetIncome && totalCost < bestSolution.totalCost) {
        bestSolution = {
          wells: [{ well, count }],
          packages: [],
          booster: currentBooster,
          totalCost,
          actualIncome,
          paybackDays: totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0,
        };
      }
    }

    // 2. Только один пакет
    for (const pkg of WELL_PACKAGES) {
      // Конвертируем доход пакета из баррелей в OilCoins
      const pkgDailyIncomeInOC = pkg.totalIncome / BARREL_TO_OILCOIN;
      const count = Math.ceil(requiredBaseIncome / pkgDailyIncomeInOC);
      const totalCost = pkg.cost * count + boosterCost;
      const actualIncome = pkgDailyIncomeInOC * count * boosterMultiplier;
      
      if (actualIncome >= targetIncome && totalCost < bestSolution.totalCost) {
        bestSolution = {
          wells: [],
          packages: [{ package: pkg, count }],
          booster: currentBooster,
          totalCost,
          actualIncome,
          paybackDays: totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0,
        };
      }
    }

    // 3. Комбинация: пакет + скважины для добора
    for (const pkg of WELL_PACKAGES) {
      const pkgDailyIncomeInOC = pkg.totalIncome / BARREL_TO_OILCOIN;
      const maxPackages = Math.floor(requiredBaseIncome / pkgDailyIncomeInOC);
      
      for (let packageCount = 1; packageCount <= Math.min(maxPackages + 1, 3); packageCount++) {
        const incomeFromPackages = pkgDailyIncomeInOC * packageCount;
        const remainingIncome = requiredBaseIncome - incomeFromPackages;
        
        if (remainingIncome <= 0) continue;
        
        // Добираем одним типом скважин
        for (const well of WELL_TYPES) {
          const wellDailyIncomeInOC = well.dailyIncome / BARREL_TO_OILCOIN;
          const wellCount = Math.ceil(remainingIncome / wellDailyIncomeInOC);
          const totalCost = pkg.cost * packageCount + well.cost * wellCount + boosterCost;
          const actualIncome = (incomeFromPackages + wellDailyIncomeInOC * wellCount) * boosterMultiplier;
          
          if (actualIncome >= targetIncome && totalCost < bestSolution.totalCost) {
            bestSolution = {
              wells: [{ well, count: wellCount }],
              packages: [{ package: pkg, count: packageCount }],
              booster: currentBooster,
              totalCost,
              actualIncome,
              paybackDays: totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0,
            };
          }
        }
      }
    }

    // 4. Комбинация нескольких типов скважин (2-3 типа максимум для простоты)
    for (let i = 0; i < WELL_TYPES.length; i++) {
      for (let j = i + 1; j < WELL_TYPES.length; j++) {
        const well1 = WELL_TYPES[i];
        const well2 = WELL_TYPES[j];
        const well1IncomeInOC = well1.dailyIncome / BARREL_TO_OILCOIN;
        const well2IncomeInOC = well2.dailyIncome / BARREL_TO_OILCOIN;
        
        // Пробуем разные соотношения
        for (let count1 = 1; count1 <= 5; count1++) {
          const income1 = well1IncomeInOC * count1;
          const remaining = requiredBaseIncome - income1;
          
          if (remaining > 0) {
            const count2 = Math.ceil(remaining / well2IncomeInOC);
            const totalCost = well1.cost * count1 + well2.cost * count2 + boosterCost;
            const actualIncome = (income1 + well2IncomeInOC * count2) * boosterMultiplier;
            
            if (actualIncome >= targetIncome && totalCost < bestSolution.totalCost) {
              bestSolution = {
                wells: [
                  { well: well1, count: count1 },
                  { well: well2, count: count2 }
                ],
                packages: [],
                booster: currentBooster,
                totalCost,
                actualIncome,
                paybackDays: totalCost > 0 ? Math.ceil(totalCost / actualIncome) : 0,
              };
            }
          }
        }
      }
    }
  }

  return bestSolution;
};

export const ProfitabilityCalculator = ({ compact = false, isOpen: externalIsOpen, onOpenChange: externalOnOpenChange }: CalculatorProps) => {
  const { formatOilCoins, formatBarrels, formatRubles, currencyConfig } = useCurrency();
  const [targetIncome, setTargetIncome] = useState(1000);
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<'OILCOIN' | 'BARREL' | 'RUBLE'>('OILCOIN');

  const isDialogOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsDialogOpen = externalOnOpenChange || setInternalIsOpen;

  // Exchange rates (based on ExchangeWidget)
  const BARREL_TO_OILCOIN = 0.001; // 1000 BBL = 1 OC
  const OILCOIN_TO_RUBLE = 1; // 1 OC = 1 RUB

  const MIN_INCOME = 1000;
  const MAX_INCOME = 50000;
  const STEP = 500;

  // Currency conversion functions
  const convertToOilCoins = (amount: number, currency: string): number => {
    if (currency === 'BARREL') return amount * BARREL_TO_OILCOIN;
    if (currency === 'RUBLE') return amount / OILCOIN_TO_RUBLE;
    return amount;
  };

  const convertFromOilCoins = (amount: number, currency: string): number => {
    if (currency === 'BARREL') return amount / BARREL_TO_OILCOIN;
    if (currency === 'RUBLE') return amount * OILCOIN_TO_RUBLE;
    return amount;
  };

  const formatCurrency = (amount: number, currency?: string): string => {
    const curr = currency || selectedCurrency;
    const convertedAmount = convertFromOilCoins(amount, curr);
    
    if (curr === 'BARREL') return formatBarrels(convertedAmount);
    if (curr === 'RUBLE') return formatRubles(convertedAmount);
    return formatOilCoins(convertedAmount);
  };

  // Рассчитываем оптимальную покупку
  const solution = useMemo(() => {
    return calculateOptimalPurchases(targetIncome);
  }, [targetIncome]);

  // Генерируем данные для графика на год (365 дней)
  const chartData = useMemo(() => {
    const data = [];
    const dailyIncome = solution.actualIncome;
    const totalCost = solution.totalCost;
    
    for (let day = 0; day <= 365; day++) {
      const cumulativeIncome = dailyIncome * day;
      const netProfit = cumulativeIncome - totalCost;
      
      data.push({
        day,
        investment: totalCost,
        income: cumulativeIncome,
        profit: netProfit,
        breakEven: netProfit >= 0 ? netProfit : null  // Показываем чистую прибыль только после окупаемости
      });
    }
    
    return data;
  }, [solution]);

  if (compact) {
    return (
      <>
        <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 shadow-xl font-inter">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </div>
          <CardHeader className="relative pb-3 sm:pb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-2 sm:p-3 bg-cyan-500/30 rounded-xl backdrop-blur-sm shadow-lg animate-bounce-in">
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,1)]" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] [text-shadow:_3px_3px_8px_rgb(0_0_0_/_100%)]">
                  Калькулятор доходности
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
                  Рассчитайте свой потенциальный доход
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-3 sm:space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-purple-500/20 backdrop-blur-sm rounded-xl border border-purple-400/60 shadow-sm">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-purple-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Цель в день</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                  {formatCurrency(targetIncome)}
                </p>
              </div>
              <div className="text-center p-3 sm:p-4 bg-pink-500/20 backdrop-blur-sm rounded-xl border border-pink-400/60 shadow-sm">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.6)] mx-auto mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-pink-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бюджет</p>
                <p className="text-lg sm:text-2xl font-bold text-pink-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                  {formatCurrency(solution.totalCost)}
                </p>
              </div>
            </div>
            <Button 
              className="w-full gradient-primary shadow-primary hover-scale relative overflow-hidden group text-sm sm:text-base" 
              size="lg"
              onClick={() => setIsDialogOpen(true)}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                Открыть полный калькулятор
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </CardContent>
        </Card>

        {/* Full Calculator Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-7xl max-h-[90vh] overflow-y-auto p-3 sm:p-6 bg-gradient-to-br from-background/98 to-background/95 backdrop-blur-xl border-2 border-cyan-500/50">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-3xl flex items-center gap-2 sm:gap-3 text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                Калькулятор доходности
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-lg text-cyan-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Узнайте, что нужно купить для достижения желаемого дохода
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 sm:space-y-8 py-2 sm:py-4">
              {/* Выбор желаемого дохода */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col gap-3 mb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <Label className="text-base sm:text-lg font-semibold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Желаемый доход в день</Label>
                    <Badge className="text-lg sm:text-xl px-3 sm:px-4 py-1 sm:py-2 bg-cyan-500/30 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                      {formatCurrency(targetIncome)}
                    </Badge>
                  </div>
                  
                  {/* Currency Selector */}
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium whitespace-nowrap text-cyan-100">Валюта расчета:</Label>
                    <Select value={selectedCurrency} onValueChange={(value: 'OILCOIN' | 'BARREL' | 'RUBLE') => setSelectedCurrency(value)}>
                      <SelectTrigger className="w-[180px] bg-cyan-500/10 border-cyan-400/60 text-cyan-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="OILCOIN">
                          <div className="flex items-center gap-2">
                            <Coins className="h-4 w-4" />
                            {currencyConfig.oilcoin_name} ({currencyConfig.oilcoin_symbol})
                          </div>
                        </SelectItem>
                        <SelectItem value="BARREL">
                          <div className="flex items-center gap-2">
                            <Fuel className="h-4 w-4" />
                            {currencyConfig.barrel_name} ({currencyConfig.barrel_symbol})
                          </div>
                        </SelectItem>
                        <SelectItem value="RUBLE">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            {currencyConfig.ruble_name} ({currencyConfig.ruble_symbol})
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Exchange rate info */}
                  <div className="text-xs text-cyan-50/90 bg-cyan-500/20 border border-cyan-400/60 rounded-lg p-2 backdrop-blur-sm [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <strong className="text-cyan-300">Важно:</strong> Скважины производят баррели (BBL). Курс обмена: 1000 BBL = 1 OC = 1 ₽
                  </div>
                </div>
                <Slider
                  value={[targetIncome]}
                  onValueChange={(value) => setTargetIncome(value[0])}
                  min={MIN_INCOME}
                  max={MAX_INCOME}
                  step={STEP}
                  className="w-full"
                />
                <div className="flex justify-between text-xs sm:text-sm text-cyan-300">
                  <span>{formatCurrency(MIN_INCOME)}</span>
                  <span>{formatCurrency(MAX_INCOME)}</span>
                </div>
              </div>

              {/* Результаты расчета */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-purple-400/40 transition-all duration-300"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-purple-50/80 mb-1 sm:mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Необходимый бюджет</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                      {formatCurrency(solution.totalCost)}
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-300">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-pink-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-pink-400/40 transition-all duration-300"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-pink-50/80 mb-1 sm:mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Реальный доход в день</p>
                    <p className="text-2xl sm:text-3xl font-bold text-pink-300 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                      {formatCurrency(Math.floor(solution.actualIncome))}
                    </p>
                  </CardContent>
                </Card>

                <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300">
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-emerald-400/40 transition-all duration-300"></div>
                  <CardContent className="relative p-4 sm:p-6 text-center">
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] mx-auto mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-emerald-50/80 mb-1 sm:mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Срок окупаемости</p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                      {solution.paybackDays} дней
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* План покупок */}
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                  <h3 className="text-xl sm:text-2xl font-bold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">План покупок</h3>
                </div>

                {/* Бустер */}
                {solution.booster && (
                  <Card className="bg-gradient-to-r from-purple-500/10 to-purple-500/5 border-purple-500/30">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                        <div className="flex items-start gap-3 sm:gap-4 w-full">
                          <div className="p-2 sm:p-3 bg-purple-500/30 rounded-xl flex-shrink-0">
                            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                              <h4 className="text-base sm:text-xl font-bold text-purple-100">{solution.booster.name}</h4>
                              <Badge className="bg-purple-500/30 text-purple-100 border-purple-400 text-xs sm:text-sm">
                                x{solution.booster.multiplier} множитель
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-blue-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                              Увеличивает доход от всех скважин в {solution.booster.multiplier} раз
                            </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-100 border-purple-400 text-xs sm:text-sm">
                          {formatCurrency(solution.booster.cost, 'OILCOIN')}
                        </Badge>
                      </div>
                          </div>
                        </div>
                        <Check className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 flex-shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Пакеты скважин */}
                {solution.packages.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    {solution.packages.map((purchase, index) => (
                      <Card key={`pkg-${index}`} className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 border-blue-500/30">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="flex items-start gap-3 sm:gap-4 w-full">
                              <div className="p-2 sm:p-3 bg-blue-500/30 rounded-xl flex-shrink-0">
                                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                  <h4 className="text-base sm:text-xl font-bold text-blue-100">{purchase.package.name}</h4>
                                  <Badge className="bg-blue-500/30 text-blue-100 border-blue-400 text-xs sm:text-sm">
                                    x{purchase.count} шт
                                  </Badge>
                                  <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-400 text-xs sm:text-sm">
                                    {purchase.package.discount} скидка
                                  </Badge>
                                </div>
                        <p className="text-xs sm:text-sm text-blue-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          Доход: {formatCurrency(purchase.package.totalIncome / 1000, 'OILCOIN')}/день за пакет (в баррелях: {purchase.package.totalIncome.toLocaleString()} BBL)
                        </p>
                        <div className="text-xs sm:text-sm text-blue-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          Включает: {purchase.package.wells.map(w => `${w.type} x${w.count}`).join(', ')}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <Badge variant="outline" className="text-blue-100 border-blue-400 text-xs sm:text-sm">
                            Цена за 1: {formatCurrency(purchase.package.cost, 'OILCOIN')}
                          </Badge>
                          <Badge className="bg-blue-500/30 text-blue-100 border-blue-400 text-xs sm:text-sm">
                            Итого: {formatCurrency(purchase.package.cost * purchase.count, 'OILCOIN')}
                          </Badge>
                        </div>
                              </div>
                            </div>
                            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Скважины */}
                {solution.wells.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                    {solution.wells.map((purchase, index) => (
                      <Card key={index} className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                            <div className="flex items-start gap-3 sm:gap-4 w-full">
                              <div className="p-2 sm:p-3 bg-primary/20 rounded-xl flex-shrink-0">
                                <Fuel className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                                   <h4 className="text-base sm:text-xl font-bold text-amber-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{purchase.well.name}</h4>
                                   <Badge className="bg-primary/30 text-amber-100 border-primary/60 text-xs sm:text-sm">
                                     x{purchase.count} шт
                                   </Badge>
                                 </div>
                        <p className="text-xs sm:text-sm text-amber-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          Доход: {formatCurrency(purchase.well.dailyIncome / 1000, 'OILCOIN')}/день за 1 шт (в баррелях: {purchase.well.dailyIncome.toLocaleString()} BBL)
                        </p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <Badge variant="outline" className="text-amber-100 border-primary/60 text-xs sm:text-sm">
                            Цена за 1: {formatCurrency(purchase.well.cost, 'OILCOIN')}
                          </Badge>
                          <Badge className="bg-primary/30 text-amber-100 border-primary/60 text-xs sm:text-sm">
                            Итого: {formatCurrency(purchase.well.cost * purchase.count, 'OILCOIN')}
                          </Badge>
                        </div>
                              </div>
                            </div>
                            <Check className="h-5 w-5 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Прогноз доходности */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl"></div>
                <CardContent className="relative p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
                    Прогноз доходности
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-emerald-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за неделю</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                        {formatCurrency(Math.floor(solution.actualIncome * 7))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-emerald-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за месяц</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                        {formatCurrency(Math.floor(solution.actualIncome * 30))}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-emerald-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль после окупаемости</p>
                      <p className="text-xl sm:text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                        {formatCurrency(Math.floor(solution.actualIncome * 30 - solution.totalCost))}
                      </p>
                      <p className="text-xs text-emerald-50/70 mt-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">За первый месяц</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* График роста инвестиций */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
                <CardContent className="relative p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                    График роста инвестиций
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Ключевые метрики */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-blue-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Инвестиция</p>
                        <p className="text-lg sm:text-xl font-bold text-blue-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          {formatCurrency(Math.floor(solution.totalCost))}
                        </p>
                      </div>
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-emerald-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость</p>
                        <p className="text-lg sm:text-xl font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          ~{solution.paybackDays} дней
                        </p>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-xs text-purple-50/80 mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль за год</p>
                        <p className="text-lg sm:text-xl font-bold text-purple-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          {formatCurrency(Math.floor(solution.actualIncome * 365 - solution.totalCost))}
                        </p>
                      </div>
                    </div>

                    {/* График */}
                    <div className="bg-background/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-500/20">
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={chartData}>
                          <defs>
                            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                          <XAxis 
                            dataKey="day" 
                            stroke="#ffffff80"
                            tick={{ fill: '#ffffff80', fontSize: 12 }}
                            label={{ value: 'Дни', position: 'insideBottom', offset: -5, fill: '#ffffff80' }}
                          />
                          <YAxis 
                            stroke="#ffffff80"
                            tick={{ fill: '#ffffff80', fontSize: 12 }}
                            label={{ value: 'OilCoins', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                              border: '1px solid rgba(59, 130, 246, 0.5)',
                              borderRadius: '8px',
                              backdropFilter: 'blur(10px)'
                            }}
                            labelStyle={{ color: '#ffffff' }}
                            itemStyle={{ color: '#ffffff' }}
                            formatter={(value: any) => formatCurrency(Math.floor(value))}
                            labelFormatter={(label) => `День ${label}`}
                          />
                          <Legend 
                            wrapperStyle={{ paddingTop: '10px' }}
                            iconType="line"
                          />
                          
                          {/* Линия инвестиций (красная) */}
                          <Line 
                            type="monotone" 
                            dataKey="investment" 
                            stroke="#ef4444" 
                            strokeWidth={2}
                            dot={false}
                            name="Инвестиция"
                            strokeDasharray="5 5"
                          />
                          
                          {/* Область накопленного дохода (зеленая) */}
                          <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#incomeGradient)"
                            name="Накопленный доход"
                          />
                          
                          {/* Линия прибыли (синяя, начинается с момента окупаемости) */}
                          <Line 
                            type="monotone" 
                            dataKey="breakEven" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            dot={false}
                            name="Прибыль после окупаемости"
                          />
                          
                          {/* Вертикальная линия точки окупаемости */}
                          <ReferenceLine 
                            x={solution.paybackDays} 
                            stroke="#fbbf24" 
                            strokeWidth={2}
                            strokeDasharray="3 3"
                            label={{ 
                              value: `Окупаемость (${solution.paybackDays} д.)`, 
                              position: 'top',
                              fill: '#fbbf24',
                              fontSize: 12,
                              fontWeight: 'bold'
                            }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Пояснение к графику */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-red-500"></div>
                          <span className="text-red-300 font-medium">Инвестиция</span>
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— начальные затраты на покупку</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-emerald-500"></div>
                          <span className="text-emerald-300 font-medium">Накопленный доход</span>
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— суммарный доход за период</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-blue-500"></div>
                          <span className="text-blue-300 font-medium">Чистая прибыль</span>
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— доход после окупаемости инвестиций</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-amber-500 opacity-50"></div>
                          <span className="text-amber-300 font-medium">Точка окупаемости</span>
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— когда доход = инвестициям</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Механика расчёта и примеры */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
                <CardContent className="relative p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <Coins className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                    Механика расчёта
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Курс обмена */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                      <h4 className="font-bold text-purple-100 mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Курс обмена валют</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1,000 Barrel (BBL)</span>
                          <span className="text-purple-300">=</span>
                          <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 OilCoin (OC)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 OilCoin (OC)</span>
                          <span className="text-purple-300">=</span>
                          <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 Рубль (₽)</span>
                        </div>
                      </div>
                    </div>

                    {/* Пример расчёта - динамический на основе текущего targetIncome */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                      <h4 className="font-bold text-blue-100 mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Расчёт для вашей цели</h4>
                      <div className="space-y-2 text-sm">
                        {solution.packages.length > 0 && solution.packages.map((pkg, idx) => (
                          <div key={idx} className="space-y-2 mb-3">
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Пакет:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.package.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Количество:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.count} шт</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Цена за пакет:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.package.cost.toLocaleString()} OC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость пакетов:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{(pkg.package.cost * pkg.count).toLocaleString()} OC</span>
                            </div>
                          </div>
                        ))}
                        {solution.wells.length > 0 && solution.wells.map((well, idx) => (
                          <div key={idx} className="space-y-2 mb-3">
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Скважина:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.well.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Количество:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.count} шт</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Цена за скважину:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.well.cost.toLocaleString()} OC</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость скважин:</span>
                              <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{(well.well.cost * well.count).toLocaleString()} OC</span>
                            </div>
                          </div>
                        ))}
                        {solution.booster && (
                          <div className="space-y-2 mb-3 bg-purple-500/10 rounded p-2">
                            <div className="flex justify-between">
                              <span className="text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бустер:</span>
                              <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{solution.booster.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-100/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бонус к доходу:</span>
                              <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">+{solution.booster.bonusPercent}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-purple-100/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость бустера:</span>
                              <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{solution.booster.cost.toLocaleString()} OC</span>
                            </div>
                          </div>
                        )}
                        <Separator className="bg-blue-500/20" />
                        <div className="flex justify-between">
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Общая стоимость:</span>
                          <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.totalCost).toLocaleString()} OC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход в день:</span>
                          <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome).toLocaleString()} OC</span>
                        </div>
                        <Separator className="bg-blue-500/20" />
                        <div className="flex justify-between items-center bg-emerald-500/20 border border-emerald-500/30 rounded p-2">
                          <span className="font-bold text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость:</span>
                          <span className="font-bold text-emerald-100 text-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">~{solution.paybackDays} дней</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за месяц:</span>
                          <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome * 30).toLocaleString()} OC</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Чистая прибыль/месяц:</span>
                          <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome * 30 - solution.totalCost).toLocaleString()} OC</span>
                        </div>
                      </div>
                    </div>

                    {/* Формула расчёта */}
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 sm:p-4 backdrop-blur-sm">
                      <h4 className="font-bold text-orange-100 mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Формула расчёта</h4>
                      <div className="space-y-1 text-xs sm:text-sm font-mono">
                        <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход в OC = (Доход в BBL) ÷ 1000</p>
                        <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость = (Общие затраты) ÷ (Доход в день в OC)</p>
                        <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль = (Доход за период) - (Затраты)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Подсказка */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
                <CardContent className="relative p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-center text-blue-50/90 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <strong className="text-blue-300">Совет:</strong> Для достижения дохода {formatCurrency(targetIncome)} в день вам понадобится бюджет {formatCurrency(solution.totalCost)}. 
                    Инвестиция окупится за {solution.paybackDays} дней!
                  </p>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 shadow-xl font-inter">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </div>
      <CardHeader className="relative pb-3 sm:pb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="p-2 sm:p-3 bg-cyan-500/30 rounded-xl backdrop-blur-sm shadow-lg animate-bounce-in">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,1)]" />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-bold text-white drop-shadow-[0_0_25px_rgba(251,191,36,0.9)] [text-shadow:_3px_3px_8px_rgb(0_0_0_/_100%)]">
              Калькулятор доходности
            </CardTitle>
            <CardDescription className="text-base sm:text-lg text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)] [text-shadow:_2px_2px_6px_rgb(0_0_0_/_100%)]">
              Узнайте, что нужно купить для достижения желаемого дохода
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative space-y-8">
        {/* Выбор желаемого дохода */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Желаемый доход в день</Label>
            <Badge className="text-xl px-4 py-2 bg-cyan-500/30 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
              {formatCurrency(targetIncome)}
            </Badge>
          </div>
          
          {/* Currency Selector */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium whitespace-nowrap text-cyan-100">Валюта расчета:</Label>
            <Select value={selectedCurrency} onValueChange={(value: 'OILCOIN' | 'BARREL' | 'RUBLE') => setSelectedCurrency(value)}>
              <SelectTrigger className="w-[200px] bg-cyan-500/10 border-cyan-400/60 text-cyan-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OILCOIN">
                  <div className="flex items-center gap-2">
                    <Coins className="h-4 w-4" />
                    {currencyConfig.oilcoin_name} ({currencyConfig.oilcoin_symbol})
                  </div>
                </SelectItem>
                <SelectItem value="BARREL">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4" />
                    {currencyConfig.barrel_name} ({currencyConfig.barrel_symbol})
                  </div>
                </SelectItem>
                <SelectItem value="RUBLE">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {currencyConfig.ruble_name} ({currencyConfig.ruble_symbol})
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Exchange rate info */}
          <div className="text-sm text-cyan-50/90 bg-cyan-500/20 border border-cyan-400/60 rounded-xl p-3 backdrop-blur-sm [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            <strong className="text-cyan-300">Важно:</strong> Скважины производят баррели (BBL). Курс обмена: 1000 BBL = 1 OC = 1 ₽
          </div>
          
          <Slider
            value={[targetIncome]}
            onValueChange={(value) => setTargetIncome(value[0])}
            min={MIN_INCOME}
            max={MAX_INCOME}
            step={STEP}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-cyan-300">
            <span>{formatCurrency(MIN_INCOME)}</span>
            <span>{formatCurrency(MAX_INCOME)}</span>
          </div>
        </div>

        {/* Результаты расчета */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-purple-400/40 transition-all duration-300"></div>
            <CardContent className="relative p-6 text-center">
              <Package className="h-8 w-8 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)] mx-auto mb-3" />
              <p className="text-sm text-purple-50/80 mb-2 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Необходимый бюджет</p>
              <p className="text-3xl font-bold text-purple-300 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                {formatCurrency(solution.totalCost)}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-pink-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-pink-400/40 transition-all duration-300"></div>
            <CardContent className="relative p-6 text-center">
              <TrendingUp className="h-8 w-8 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] mx-auto mb-3" />
              <p className="text-sm text-pink-50/80 mb-2 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Реальный доход в день</p>
              <p className="text-3xl font-bold text-pink-300 drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                {formatCurrency(Math.floor(solution.actualIncome))}
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl group-hover:blur-xl group-hover:bg-emerald-400/40 transition-all duration-300"></div>
            <CardContent className="relative p-6 text-center">
              <Calendar className="h-8 w-8 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.8)] mx-auto mb-3" />
              <p className="text-sm text-emerald-50/80 mb-2 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Срок окупаемости</p>
              <p className="text-3xl font-bold text-emerald-300 drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]">
                {solution.paybackDays} дней
              </p>
            </CardContent>
          </Card>
        </div>

        {/* План покупок */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ArrowRight className="h-6 w-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            <h3 className="text-2xl font-bold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">План покупок</h3>
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
                        <h4 className="text-xl font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{solution.booster.name}</h4>
                        <Badge className="bg-purple-500/30 text-purple-100 border-purple-400">
                          x{solution.booster.multiplier} множитель
                        </Badge>
                      </div>
                      <p className="text-purple-50/80 mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                        Увеличивает доход от всех скважин в {solution.booster.multiplier} раз
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-purple-100 border-purple-400">
                          {formatCurrency(solution.booster.cost, 'OILCOIN')}
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
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 sm:gap-4 min-w-0 flex-1">
                        <div className="p-2 sm:p-3 bg-blue-500/30 rounded-xl flex-shrink-0">
                          <Package className="h-5 w-5 sm:h-8 sm:w-8 text-blue-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2">
                             <h4 className="text-sm sm:text-xl font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] break-words">{purchase.package.name}</h4>
                             <Badge className="bg-blue-500/30 text-blue-100 border-blue-400 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                               x{purchase.count} шт
                             </Badge>
                             <Badge variant="outline" className="bg-green-500/20 text-green-100 border-green-400 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                               {purchase.package.discount} скидка
                             </Badge>
                           </div>
                           <p className="text-xs sm:text-base text-blue-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] break-words">
                             Доход: {formatCurrency(purchase.package.totalIncome / 1000, 'OILCOIN')}/день за пакет (в баррелях: {purchase.package.totalIncome.toLocaleString()} BBL)
                           </p>
                           <div className="text-[10px] sm:text-sm text-blue-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] break-words">
                             Включает: {purchase.package.wells.map(w => `${w.type} x${w.count}`).join(', ')}
                           </div>
                           <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                             <Badge variant="outline" className="text-blue-100 border-blue-400 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 whitespace-nowrap">
                               Цена за 1: {formatCurrency(purchase.package.cost, 'OILCOIN')}
                             </Badge>
                             <Badge className="bg-blue-500/30 text-blue-100 border-blue-400 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 whitespace-nowrap">
                               Итого: {formatCurrency(purchase.package.cost * purchase.count, 'OILCOIN')}
                             </Badge>
                           </div>
                        </div>
                      </div>
                      <Check className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0" />
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
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 sm:gap-4 min-w-0 flex-1">
                      <div className="p-2 sm:p-3 bg-primary/20 rounded-xl flex-shrink-0">
                        <Fuel className="h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                      </div>
                       <div className="min-w-0 flex-1">
                         <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-2">
                           <h4 className="text-sm sm:text-xl font-bold text-amber-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] break-words">{purchase.well.name}</h4>
                           <Badge className="bg-primary/30 text-amber-100 border-primary/60 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 whitespace-nowrap">
                             x{purchase.count} шт
                           </Badge>
                         </div>
                         <p className="text-xs sm:text-base text-amber-50/80 mb-2 sm:mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] break-words">
                           Доход: {formatCurrency(purchase.well.dailyIncome / 1000, 'OILCOIN')}/день за 1 шт (в баррелях: {purchase.well.dailyIncome.toLocaleString()} BBL)
                         </p>
                         <div className="flex flex-wrap items-center gap-1.5 sm:gap-3">
                           <Badge variant="outline" className="text-amber-100 border-primary/60 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 whitespace-nowrap">
                             Цена за 1: {formatCurrency(purchase.well.cost, 'OILCOIN')}
                           </Badge>
                           <Badge className="bg-primary/30 text-amber-100 border-primary/60 text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-0.5 whitespace-nowrap">
                             Итого: {formatCurrency(purchase.well.cost * purchase.count, 'OILCOIN')}
                           </Badge>
                         </div>
                       </div>
                    </div>
                    <Check className="h-4 w-4 sm:h-6 sm:w-6 text-primary flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Расчет окупаемости */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/30 rounded-full blur-2xl"></div>
          <CardContent className="relative p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <Calendar className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
              Прогноз доходности
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-emerald-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за неделю</p>
                <p className="text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  {formatCurrency(Math.floor(solution.actualIncome * 7))}
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за месяц</p>
                <p className="text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  {formatCurrency(Math.floor(solution.actualIncome * 30))}
                </p>
              </div>
              <div>
                <p className="text-sm text-emerald-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль после окупаемости</p>
                <p className="text-2xl font-bold text-emerald-300 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  {formatCurrency(Math.floor(solution.actualIncome * 30 - solution.totalCost))}
                </p>
                <p className="text-xs text-emerald-50/70 mt-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">За первый месяц</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* График роста инвестиций */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
          <CardContent className="relative p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <TrendingUp className="h-6 w-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
              График роста инвестиций
            </h3>
            
            <div className="space-y-4">
              {/* Ключевые метрики */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-blue-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Инвестиция</p>
                  <p className="text-2xl font-bold text-blue-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {formatCurrency(Math.floor(solution.totalCost))}
                  </p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-emerald-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость</p>
                  <p className="text-2xl font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    ~{solution.paybackDays} дней
                  </p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm text-purple-50/80 mb-1 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль за год</p>
                  <p className="text-2xl font-bold text-purple-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {formatCurrency(Math.floor(solution.actualIncome * 365 - solution.totalCost))}
                  </p>
                </div>
              </div>

              {/* График */}
              <div className="bg-background/30 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="incomeGradientFull" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis 
                      dataKey="day" 
                      stroke="#ffffff80"
                      tick={{ fill: '#ffffff80', fontSize: 12 }}
                      label={{ value: 'Дни', position: 'insideBottom', offset: -5, fill: '#ffffff80' }}
                    />
                    <YAxis 
                      stroke="#ffffff80"
                      tick={{ fill: '#ffffff80', fontSize: 12 }}
                      label={{ value: 'OilCoins', angle: -90, position: 'insideLeft', fill: '#ffffff80' }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                        border: '1px solid rgba(59, 130, 246, 0.5)',
                        borderRadius: '8px',
                        backdropFilter: 'blur(10px)'
                      }}
                      labelStyle={{ color: '#ffffff' }}
                      itemStyle={{ color: '#ffffff' }}
                      formatter={(value: any) => formatCurrency(Math.floor(value))}
                      labelFormatter={(label) => `День ${label}`}
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px' }}
                      iconType="line"
                    />
                    
                    {/* Линия инвестиций (красная) */}
                    <Line 
                      type="monotone" 
                      dataKey="investment" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                      name="Инвестиция"
                      strokeDasharray="5 5"
                    />
                    
                    {/* Область накопленного дохода (зеленая) */}
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#10b981"
                      strokeWidth={3}
                      fill="url(#incomeGradientFull)"
                      name="Накопленный доход"
                    />
                    
                    {/* Линия прибыли (синяя, начинается с момента окупаемости) */}
                    <Line 
                      type="monotone" 
                      dataKey="breakEven" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={false}
                      name="Прибыль после окупаемости"
                    />
                    
                    {/* Вертикальная линия точки окупаемости */}
                    <ReferenceLine 
                      x={solution.paybackDays} 
                      stroke="#fbbf24" 
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      label={{ 
                        value: `Окупаемость (${solution.paybackDays} д.)`, 
                        position: 'top',
                        fill: '#fbbf24',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Пояснение к графику */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-red-500"></div>
                    <span className="text-red-300 font-medium">Инвестиция</span>
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— начальные затраты на покупку</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-emerald-500"></div>
                    <span className="text-emerald-300 font-medium">Накопленный доход</span>
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— суммарный доход за период</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-500"></div>
                    <span className="text-blue-300 font-medium">Чистая прибыль</span>
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— доход после окупаемости инвестиций</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-amber-500 opacity-50"></div>
                    <span className="text-amber-300 font-medium">Точка окупаемости</span>
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">— когда доход = инвестициям</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Механика расчёта и примеры */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
          <CardContent className="relative p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <Coins className="h-6 w-6 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
              Механика расчёта
            </h3>
            
            <div className="space-y-4">
              {/* Курс обмена */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm shadow-sm">
                <h4 className="font-bold text-purple-100 mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Курс обмена валют</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1,000 Barrel (BBL)</span>
                    <span className="text-purple-300">=</span>
                    <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 OilCoin (OC)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-purple-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 OilCoin (OC)</span>
                    <span className="text-purple-300">=</span>
                    <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">1 Рубль (₽)</span>
                  </div>
                </div>
              </div>

              {/* Пример расчёта - динамический на основе текущего targetIncome */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm shadow-sm">
                <h4 className="font-bold text-blue-100 mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Расчёт для вашей цели</h4>
                <div className="space-y-2 text-sm">
                  {solution.packages.length > 0 && solution.packages.map((pkg, idx) => (
                    <div key={idx} className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Пакет:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.package.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Количество:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.count} шт</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Цена за пакет:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{pkg.package.cost.toLocaleString()} OC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость пакетов:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{(pkg.package.cost * pkg.count).toLocaleString()} OC</span>
                      </div>
                    </div>
                  ))}
                  {solution.wells.length > 0 && solution.wells.map((well, idx) => (
                    <div key={idx} className="space-y-2 mb-3">
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Скважина:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.well.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Количество:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.count} шт</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Цена за скважину:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.well.cost.toLocaleString()} OC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость скважин:</span>
                        <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{(well.well.cost * well.count).toLocaleString()} OC</span>
                      </div>
                    </div>
                  ))}
                  {solution.booster && (
                    <div className="space-y-2 mb-3 bg-purple-500/10 rounded p-2">
                      <div className="flex justify-between">
                        <span className="text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бустер:</span>
                        <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{solution.booster.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-100/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бонус к доходу:</span>
                        <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">+{solution.booster.bonusPercent}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-100/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость бустера:</span>
                        <span className="font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{solution.booster.cost.toLocaleString()} OC</span>
                      </div>
                    </div>
                  )}
                  <Separator className="bg-blue-500/20" />
                  <div className="flex justify-between">
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Общая стоимость:</span>
                    <span className="font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.totalCost).toLocaleString()} OC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход в день:</span>
                    <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome).toLocaleString()} OC</span>
                  </div>
                  <Separator className="bg-blue-500/20" />
                  <div className="flex justify-between items-center bg-emerald-500/20 border border-emerald-500/30 rounded p-2">
                    <span className="font-bold text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость:</span>
                    <span className="font-bold text-emerald-100 text-lg [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">~{solution.paybackDays} дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход за месяц:</span>
                    <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome * 30).toLocaleString()} OC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Чистая прибыль/месяц:</span>
                    <span className="font-bold text-emerald-300 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{Math.floor(solution.actualIncome * 30 - solution.totalCost).toLocaleString()} OC</span>
                  </div>
                </div>
              </div>

              {/* Формула расчёта */}
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 backdrop-blur-sm shadow-sm">
                <h4 className="font-bold text-orange-100 mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Формула расчёта</h4>
                <div className="space-y-1 text-sm font-mono">
                  <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Доход в OC = (Доход в BBL) ÷ 1000</p>
                  <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупаемость = (Общие затраты) ÷ (Доход в день в OC)</p>
                  <p className="text-orange-50/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прибыль = (Доход за период) - (Затраты)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Подсказка */}
        <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 shadow-xl">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
          <CardContent className="relative p-4">
            <p className="text-sm text-center text-blue-50/90 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              <strong className="text-blue-300">Совет:</strong> Для достижения дохода {formatCurrency(targetIncome)} в день вам понадобится бюджет {formatCurrency(solution.totalCost)}. 
              Инвестиция окупится за {solution.paybackDays} дней!
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
