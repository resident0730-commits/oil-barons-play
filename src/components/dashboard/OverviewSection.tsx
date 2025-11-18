import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  TrendingUp, 
  Wallet, 
  Trophy,
  Zap,
  Target,
  Users,
  Crown,
  Star,
  Wrench,
  CreditCard,
  Gift,
  ArrowRight
} from "lucide-react";
import { UserProfile, UserWell, wellTypes, useGameData } from "@/hooks/useGameData";
import { StatusDisplay } from "@/components/StatusDisplay";
import { DailyBonus } from "@/components/DailyBonus";
import { PaymentHistory } from "@/components/dashboard/PaymentHistory";
import { useCurrency } from "@/hooks/useCurrency";
import { useStatusBonuses } from "@/hooks/useStatusBonuses";

interface OverviewSectionProps {
  profile: UserProfile;
  wells: UserWell[];
  playerRank: number;
  onTopUpClick?: () => void;
}

export const OverviewSection = ({ profile, wells, playerRank, onTopUpClick }: OverviewSectionProps) => {
  const { formatBarrels, formatOilCoins, formatOilCoinsWithName } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  const formatGameCurrencyWithName = formatOilCoinsWithName;
  const { boosters, getActiveBoosterMultiplier } = useGameData();
  const { statusMultiplier, userTitles, getStatusDisplayNames } = useStatusBonuses();
  
  // Правильный расчет общей стоимости активов
  const totalWellsValue = wells.reduce((total, well) => {
    const wellType = wellTypes.find(wt => wt.name === well.well_type);
    if (!wellType) return total;
    
    // Базовая стоимость скважины
    let wellValue = wellType.price;
    
    // Добавляем стоимость улучшений (каждый уровень стоит по формуле)
    for (let level = 1; level < well.level; level++) {
      const upgradeCost = Math.round(wellType.price * 0.5 * Math.pow(1.2, level - 1));
      wellValue += upgradeCost;
    }
    
    return total + wellValue;
  }, 0);

  const averageDailyPerWell = wells.length > 0 ? Math.round(profile.daily_income / wells.length) : 0;

  // Calculate detailed booster information
  const getDetailedBoosterInfo = () => {
    const activeBoosters = [];
    let totalBoosterBonus = 0;

    boosters.forEach(booster => {
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      if (isActive) {
        let bonus = 0;
        let name = '';
        
        switch (booster.booster_type) {
          case 'worker_crew':
            bonus = booster.level * 10;
            name = 'Бригада рабочих';
            break;
          case 'geological_survey':
            bonus = booster.level * 15;
            name = 'Геологическая разведка';
            break;
          case 'advanced_equipment':
            bonus = booster.level * 25;  
            name = 'Продвинутое оборудование';
            break;
          case 'turbo_boost':
            bonus = 50;
            name = 'Турбо-буст';
            break;
          case 'automation':
            bonus = booster.level * 20;
            name = 'Автоматизация';
            break;
        }
        
        if (bonus > 0) {
          activeBoosters.push({ name, bonus, level: booster.level, expiresAt: booster.expires_at });
          totalBoosterBonus += bonus;
        }
      }
    });

    return { activeBoosters, totalBoosterBonus };
  };

  const { activeBoosters, totalBoosterBonus } = getDetailedBoosterInfo();
  const statusBonus = Math.round((statusMultiplier - 1) * 100);
  const totalIncomeBonus = totalBoosterBonus + statusBonus;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold heading-contrast">Обзор империи</h2>
          <p className="text-muted-foreground subtitle-contrast">Ваши достижения и статистика</p>
        </div>
        <div className="section-toolbar">
          <div className="flex items-center space-x-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Рейтинг:</span>
            <Badge className="gradient-gold text-primary-foreground">#{playerRank}</Badge>
          </div>
        </div>
      </div>

      {/* Status Display */}
      <StatusDisplay />

      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Баланс</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Рубли:</span>
                <span className="text-lg font-bold">{profile.ruble_balance.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">OilCoins:</span>
                <span className="text-lg font-bold text-amber-500">{profile.oilcoin_balance.toLocaleString()} OC</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Баррели:</span>
                <span className="text-lg font-bold text-blue-400">{profile.barrel_balance.toLocaleString()} BBL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ежедневный доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{formatBarrels(profile.daily_income)}</div>
            <p className="text-xs text-muted-foreground">в день</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Нефтяные скважины</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wells.length}</div>
            <p className="text-xs text-muted-foreground">Активных скважин</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Рейтинг</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">#{playerRank}</div>
            <p className="text-xs text-muted-foreground">В топ-списке</p>
          </CardContent>
        </Card>
      </div>

      {/* Special Top-Up Offer */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20 hover-scale cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/25" onClick={onTopUpClick}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
        
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  🔥 Специальное предложение!
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Удвойте свои вложения прямо сейчас
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg animate-pulse">
              x2 БОНУС
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-4">
          <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Пополните на</span>
              </div>
              <div className="text-2xl font-bold text-primary">10,000 ₽</div>
            </div>
            
            <ArrowRight className="h-6 w-6 text-accent animate-bounce" />
            
            <div className="space-y-1 text-right">
              <div className="flex items-center space-x-2 justify-end">
                <Wallet className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">Получите</span>
              </div>
              <div className="text-2xl font-bold text-accent">20,000 OC</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ⚡ Мгновенное зачисление • 🎯 Удвоение баланса • 🚀 Ускорьте развитие
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-primary font-medium">
              <Zap className="h-3 w-3" />
              <span>Нажмите, чтобы воспользоваться предложением</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Performance Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 hover-scale transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-bold text-sm">Эффективность</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Средний доход на скважину:</span>
                <Badge variant="secondary" className="text-xs">{formatGameCurrency(averageDailyPerWell)}</Badge>
              </div>
            </div>
            
            <div className="p-3 bg-accent/5 rounded-lg border border-accent/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Общая стоимость активов:</span>
                <Badge variant="secondary" className="text-xs">{formatGameCurrency(totalWellsValue)}</Badge>
              </div>
            </div>

            <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted-foreground">Рыночная стоимость:</span>
                <Badge className="text-xs bg-green-500/20 text-green-600 border-green-500/20">{formatGameCurrency(Math.round(totalWellsValue * 0.8))}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 border-accent/20 hover-scale transition-all duration-300 hover:shadow-xl hover:shadow-accent/10">
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-accent/30 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-lg shadow-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent font-bold">Активность</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
              <DailyBonus />
            </div>
          </CardContent>
        </Card>

        {/* Income Bonuses Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-green-500/5 border-green-500/20 hover-scale transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Star className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-bold">Бонусы доходности</span>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <span>Общий мультипликатор:</span>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">+{totalIncomeBonus}%</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            {/* Status Bonuses */}
            <div className="p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Crown className="h-4 w-4 text-accent" />
                  Статусные бонусы
                </span>
                <Badge className="bg-accent/20 text-accent border-accent/20">+{statusBonus}%</Badge>
              </div>
              {statusBonus > 0 ? (
                <div className="text-xs text-muted-foreground space-y-2">
                  {getStatusDisplayNames().map((title, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-accent/5 rounded border border-accent/10">
                      <span className="flex items-center gap-1">
                        <Crown className="h-3 w-3 text-accent" />
                        {title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {userTitles[index] === 'oil_king' && '+5%'}
                        {userTitles[index] === 'leader' && '+3%'}
                        {userTitles[index] === 'industrialist' && '+2%'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Нет активных статусных титулов
                </div>
              )}
            </div>

            {/* Booster Bonuses */}
            <div className="p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-primary" />
                  Бонусы от бустеров
                </span>
                <Badge className="bg-primary/20 text-primary border-primary/20">+{totalBoosterBonus}%</Badge>
              </div>
              {activeBoosters.length > 0 ? (
                <div className="text-xs text-muted-foreground space-y-2">
                  {activeBoosters.map((booster, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-primary/5 rounded border border-primary/10">
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3 text-primary" />
                        {booster.name} (ур. {booster.level})
                      </span>
                      <Badge variant="outline" className="text-xs">+{booster.bonus}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Нет активных бустеров
                </div>
              )}
            </div>

            {totalIncomeBonus > 0 && (
              <div className="p-3 bg-gradient-to-r from-green-500/10 to-green-500/5 rounded-lg border border-green-500/20">
                <div className="text-center text-sm">
                  <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
                    <TrendingUp className="h-4 w-4" />
                    <span>Ваши скважины приносят на <span className="font-bold">+{totalIncomeBonus}%</span> больше дохода</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Achievements Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-purple-500/5 border-purple-500/20 hover-scale transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full -translate-y-10 translate-x-10"></div>
          <CardHeader className="relative z-10 pb-3">
            <CardTitle className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-bold">Социальные достижения</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl border border-purple-500/20">
              <div className="mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent">Скоро</div>
                <p className="text-xs text-muted-foreground mt-1">Реферальная статистика</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Trophy className="h-3 w-3" />
                  <span>Лидерборды</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Star className="h-3 w-3" />
                  <span>Достижения</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Gift className="h-3 w-3" />
                  <span>Награды</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Section */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-xl font-bold heading-contrast flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            История платежей
          </h3>
          <p className="text-muted-foreground subtitle-contrast">Все ваши пополнения баланса</p>
        </div>
        <PaymentHistory />
      </div>
    </div>
  );
};