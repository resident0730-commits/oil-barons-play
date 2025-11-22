import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  TrendingUp, 
  Wallet, 
  Trophy,
  Zap,
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
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-sm sm:text-base font-medium">Баланс</CardTitle>
            <Wallet className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs sm:text-xs text-muted-foreground">Рубли:</span>
                <span className="text-lg sm:text-lg font-bold">{profile.ruble_balance.toLocaleString()} ₽</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs sm:text-xs text-muted-foreground">OilCoins:</span>
                <span className="text-lg sm:text-lg font-bold text-amber-500">{profile.oilcoin_balance.toLocaleString()} OC</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs sm:text-xs text-muted-foreground">Баррели:</span>
                <span className="text-lg sm:text-lg font-bold text-blue-400">{profile.barrel_balance.toLocaleString()} BBL</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-sm sm:text-base font-medium">Ежедневный доход</CardTitle>
            <TrendingUp className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-2xl font-bold text-amber-400">{formatBarrels(profile.daily_income)}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1">в день</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-sm sm:text-base font-medium">Нефтяные скважины</CardTitle>
            <Fuel className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-2xl font-bold">{wells.length}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1">Активных скважин</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-sm sm:text-base font-medium">Рейтинг</CardTitle>
            <Trophy className="h-5 w-5 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="text-2xl sm:text-2xl font-bold text-accent">#{playerRank}</div>
            <p className="text-xs sm:text-xs text-muted-foreground mt-1">В топ-списке</p>
          </CardContent>
        </Card>
      </div>

      {/* Special Top-Up Offer */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group" onClick={onTopUpClick}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
        <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
        
        <CardContent className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg shadow-lg flex-shrink-0">
                <Gift className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base sm:text-lg font-bold text-primary-100 drop-shadow truncate">
                  Специальное предложение
                </CardTitle>
                <CardDescription className="text-primary-50/70 text-xs sm:text-sm truncate">
                  Удвойте свои вложения
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-accent to-primary text-white border-0 shadow-lg px-2 sm:px-3 py-1 animate-pulse self-start sm:self-auto whitespace-nowrap">
              x2 БОНУС
            </Badge>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 sm:gap-4 items-center">
            <div className="text-center p-2 sm:p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-primary/20">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary mx-auto mb-1 sm:mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Пополните</div>
              <div className="text-sm sm:text-lg font-bold text-primary">10,000 ₽</div>
            </div>
            
            <div className="flex justify-center">
              <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-accent group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="text-center p-2 sm:p-3 bg-background/50 backdrop-blur-sm rounded-lg border border-accent/20">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-accent mx-auto mb-1 sm:mb-2" />
              <div className="text-xs text-muted-foreground mb-1">Получите</div>
              <div className="text-sm sm:text-lg font-bold text-accent">20,000 OC</div>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 text-center">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs text-primary/80 font-medium">
              <Zap className="h-3 w-3 flex-shrink-0" />
              <span className="text-center">Мгновенное зачисление • Удвоение баланса</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-1">
        {/* Income Bonuses Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-green-500/5 border-green-500/20 hover-scale transition-all duration-300 hover:shadow-xl hover:shadow-green-500/10">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -translate-y-12 translate-x-12"></div>
          <CardHeader className="relative z-10 pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-bold text-sm sm:text-base">Бонусы доходности</span>
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 text-xs sm:text-sm">
              <span>Общий мультипликатор:</span>
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 text-xs">+{totalIncomeBonus}%</Badge>
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3 sm:space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {/* Status Bonuses */}
              <div className="p-3 sm:p-3 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent" />
                    Статусные бонусы
                  </span>
                  <Badge className="bg-accent/20 text-accent border-accent/20 text-xs">+{statusBonus}%</Badge>
                </div>
                {statusBonus > 0 ? (
                  <div className="text-xs text-muted-foreground space-y-2">
                    {getStatusDisplayNames().map((title, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-accent/5 rounded border border-accent/10">
                        <span className="flex items-center gap-1 text-xs">
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
              <div className="p-3 sm:p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Бонусы от бустеров
                  </span>
                  <Badge className="bg-primary/20 text-primary border-primary/20 text-xs">+{totalBoosterBonus}%</Badge>
                </div>
                {activeBoosters.length > 0 ? (
                  <div className="text-xs text-muted-foreground space-y-2">
                    {activeBoosters.map((booster, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-primary/5 rounded border border-primary/10">
                        <span className="flex items-center gap-1 text-xs">
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

      </div>

      {/* Payment History Section */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent backdrop-blur-xl border-2 border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20">
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>
        <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
        
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2 text-green-100 drop-shadow">
            <CreditCard className="h-5 w-5" />
            История платежей
          </CardTitle>
          <CardDescription className="text-green-50/70">
            Все ваши пополнения баланса
          </CardDescription>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <PaymentHistory />
        </CardContent>
      </Card>
    </div>
  );
};