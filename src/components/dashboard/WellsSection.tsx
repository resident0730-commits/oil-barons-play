import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Zap, Sparkles } from "lucide-react";
import { UserWell, UserProfile, wellTypes, UserBooster } from "@/hooks/useGameData";

interface WellsSectionProps {
  wells: UserWell[];
  profile: UserProfile;
  onUpgradeWell: (wellId: string) => void;
  getWellIcon: (wellType: string) => JSX.Element;
  getRarityColor: (rarity: string) => string;
  calculateProfitMetrics: (dailyIncome: number, price: number) => { 
    monthlyIncome: number; 
    yearlyIncome: number; 
    yearlyPercent: number; 
  };
  formatProfitPercent: (percent: number) => string;
  boosters: UserBooster[];
  getActiveBoosterMultiplier: () => number;
}

export const WellsSection = ({ 
  wells, 
  profile, 
  onUpgradeWell, 
  getWellIcon, 
  getRarityColor, 
  calculateProfitMetrics, 
  formatProfitPercent,
  boosters,
  getActiveBoosterMultiplier
}: WellsSectionProps) => {
  const boosterMultiplier = getActiveBoosterMultiplier();
  const hasActiveBoosters = boosters.some(booster => 
    !booster.expires_at || new Date(booster.expires_at) > new Date()
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold heading-contrast">Ваши скважины</h2>
          <p className="text-muted-foreground subtitle-contrast">Управляйте своими нефтяными активами</p>
        </div>
        <div className="section-toolbar">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Общий доход:</span>
              <Badge className="gradient-gold text-primary-foreground">
                {profile.daily_income.toLocaleString()} OC/день
              </Badge>
              {hasActiveBoosters && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  +{Math.round((boosterMultiplier - 1) * 100)}%
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Скважин:</span>
              <Badge variant="outline">{wells.length}</Badge>
            </div>
          </div>
        </div>
      </div>

      {wells.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-muted/50 rounded-full mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">У вас пока нет скважин</h3>
            <p className="text-muted-foreground mb-4">Купите свою первую скважину в магазине</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {wells.map((well) => {
            const wellType = wellTypes.find(wt => wt.name === well.well_type);
            if (!wellType) return null;

            const upgradeCost = Math.round((wellType.price * 0.3 * well.level));
            const canUpgrade = well.level < wellType.maxLevel && profile.balance >= upgradeCost;
            const isMaxLevel = well.level >= wellType.maxLevel;
            const upgradeProgress = (well.level / wellType.maxLevel) * 100;
            
            const metrics = calculateProfitMetrics(well.daily_income, wellType.price);

            return (
              <Card key={well.id} className="relative overflow-hidden group hover:shadow-luxury transition-all duration-300">
                <div className="absolute top-0 left-0 w-full h-1 gradient-gold"></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getWellIcon(well.well_type)}
                      <div>
                        <CardTitle className="text-lg">{wellType.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRarityColor(wellType.rarity)} variant="secondary">
                            Уровень {well.level}
                          </Badge>
                          <Badge variant="outline">{wellType.rarity}</Badge>
                          {hasActiveBoosters && (
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Усилено
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{Math.round(well.daily_income * boosterMultiplier).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">OC/день</p>
                      {hasActiveBoosters && (
                        <p className="text-xs text-purple-300">
                          Базовая: {well.daily_income.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <p className="font-medium">{Math.round(well.daily_income * boosterMultiplier * 30).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">в месяц</p>
                    </div>
                    <div className="text-center p-2 bg-primary/10 rounded">
                      <p className="font-medium text-primary">{formatProfitPercent(metrics.yearlyPercent)}</p>
                      <p className="text-xs text-muted-foreground">ROI/год</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Прогресс улучшения</span>
                      <span className="text-sm font-medium">{well.level}/{wellType.maxLevel}</span>
                    </div>
                    <Progress value={upgradeProgress} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center">
                    {isMaxLevel ? (
                      <Badge className="gradient-gold text-primary-foreground">
                        <Zap className="h-3 w-3 mr-1" />
                        Максимальный уровень
                      </Badge>
                    ) : (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Улучшение: </span>
                        <span className="font-medium">{upgradeCost.toLocaleString()} OC</span>
                      </div>
                    )}
                    
                    {!isMaxLevel && (
                      <Button
                        size="sm"
                        onClick={() => onUpgradeWell(well.id)}
                        disabled={!canUpgrade}
                        className="gradient-gold text-primary-foreground"
                      >
                        <Zap className="h-4 w-4 mr-1" />
                        Улучшить
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};