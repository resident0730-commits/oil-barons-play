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
  Wrench
} from "lucide-react";
import { UserProfile, UserWell, wellTypes, useGameData } from "@/hooks/useGameData";
import { StatusDisplay } from "@/components/StatusDisplay";
import { DailyBonus } from "@/components/DailyBonus";
import { useCurrency } from "@/hooks/useCurrency";
import { useStatusBonuses } from "@/hooks/useStatusBonuses";

interface OverviewSectionProps {
  profile: UserProfile;
  wells: UserWell[];
  playerRank: number;
}

export const OverviewSection = ({ profile, wells, playerRank }: OverviewSectionProps) => {
  const { formatGameCurrency, formatGameCurrencyWithName } = useCurrency();
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
          <CardContent>
            <div className="text-2xl font-bold">{profile.balance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{formatGameCurrencyWithName(0).split(' ')[1]}</p>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ежедневный доход</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{profile.daily_income.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{formatGameCurrency(0).split(' ')[1]} в день</p>
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

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Производительность</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Средний доход на скважину:</span>
              <span className="font-medium">{formatGameCurrency(averageDailyPerWell)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Общая стоимость активов:</span>
              <span className="font-medium">{formatGameCurrency(totalWellsValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Рыночная стоимость:</span>
              <span className="font-medium text-green-600">{formatGameCurrency(Math.round(totalWellsValue * 0.8))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">ROI в месяц:</span>
              <span className="font-medium text-primary">
                {totalWellsValue > 0 ? `${Math.round((profile.daily_income * 30 / totalWellsValue) * 100)}%` : '0%'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Окупаемость:</span>
              <span className="font-medium text-blue-600">
                {profile.daily_income > 0 ? `${Math.ceil(totalWellsValue / profile.daily_income)} дней` : '∞'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Активность</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DailyBonus />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5" />
              <span>Бонусы доходности</span>
            </CardTitle>
            <CardDescription>
              Общий доходный мультипликатор: <span className="font-bold text-primary">+{totalIncomeBonus}%</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Status Bonuses */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Crown className="h-3 w-3 text-accent" />
                  Статусные бонусы:
                </span>
                <span className="font-bold text-accent">+{statusBonus}%</span>
              </div>
              {statusBonus > 0 ? (
                <div className="text-xs text-muted-foreground space-y-1">
                  {getStatusDisplayNames().map((title, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{title}</span>
                      <span>
                        {userTitles[index] === 'oil_king' && '+5%'}
                        {userTitles[index] === 'leader' && '+3%'}
                        {userTitles[index] === 'industrialist' && '+2%'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Нет активных статусных титулов
                </div>
              )}
            </div>

            {/* Booster Bonuses */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Wrench className="h-3 w-3 text-primary" />
                  Бонусы от бустеров:
                </span>
                <span className="font-bold text-primary">+{totalBoosterBonus}%</span>
              </div>
              {activeBoosters.length > 0 ? (
                <div className="text-xs text-muted-foreground space-y-1">
                  {activeBoosters.map((booster, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{booster.name} (ур. {booster.level})</span>
                      <span>+{booster.bonus}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Нет активных бустеров
                </div>
              )}
            </div>

            {totalIncomeBonus > 0 && (
              <div className="pt-2 border-t border-border">
                <div className="text-xs text-muted-foreground">
                  Ваши скважины приносят на <span className="font-bold text-primary">{totalIncomeBonus}%</span> больше дохода
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Социальные достижения</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">Скоро</div>
              <p className="text-xs text-muted-foreground">Реферальная статистика</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};