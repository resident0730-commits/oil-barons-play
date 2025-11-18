import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Sparkles, TrendingUp, Calendar, Coins } from "lucide-react";
import { UserWell, UserProfile, wellTypes, UserBooster } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

interface WellDetailsModalProps {
  well: UserWell | null;
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
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

export const WellDetailsModal = ({
  well,
  profile,
  isOpen,
  onClose,
  onUpgradeWell,
  getWellIcon,
  getRarityColor,
  calculateProfitMetrics,
  formatProfitPercent,
  boosters,
  getActiveBoosterMultiplier
}: WellDetailsModalProps) => {
  const { formatBarrels, formatOilCoins } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  
  if (!well) return null;

  const wellType = wellTypes.find(wt => wt.name === well.well_type);
  if (!wellType) return null;

  const boosterMultiplier = getActiveBoosterMultiplier();
  const hasActiveBoosters = boosters.some(booster => 
    !booster.expires_at || new Date(booster.expires_at) > new Date()
  );

  const upgradeCost = Math.round(wellType.price * 0.5 * Math.pow(1.2, well.level - 1));
  const canUpgrade = well.level < wellType.maxLevel && profile.balance >= upgradeCost;
  const isMaxLevel = well.level >= wellType.maxLevel;
  const upgradeProgress = (well.level / wellType.maxLevel) * 100;
  
  const nextLevelIncome = Math.round(well.daily_income * 1.15);
  const incomeIncrease = nextLevelIncome - well.daily_income;
  const nextLevelIncomeWithBoosters = Math.round(nextLevelIncome * boosterMultiplier);
  const currentIncomeWithBoosters = Math.round(well.daily_income * boosterMultiplier);
  const boostIncomeIncrease = nextLevelIncomeWithBoosters - currentIncomeWithBoosters;
  
  const metrics = calculateProfitMetrics(well.daily_income, wellType.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-pulse opacity-20 absolute inset-0 bg-primary/30 rounded-full blur-xl scale-150"></div>
              <div className="relative z-10 transform scale-110">
                {getWellIcon(well.well_type)}
              </div>
            </div>
          </div>
          
          <div>
            <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {wellType.name}
            </DialogTitle>
            <DialogDescription className="flex justify-center space-x-2 mt-2">
              <Badge className={getRarityColor(wellType.rarity)} variant="secondary">
                Уровень {well.level}
              </Badge>
              <Badge variant="outline">{wellType.rarity}</Badge>
              {hasActiveBoosters && (
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Усилено
                </Badge>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 animate-fade-in">
          {/* Income Overview */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Текущий доход</span>
                </div>
                <div className="text-3xl font-bold text-amber-400">
                  {formatBarrels(Math.round(well.daily_income * boosterMultiplier))}
                </div>
                <div className="text-sm text-muted-foreground">в день</div>
                {hasActiveBoosters && (
                  <div className="text-xs text-purple-300">
                    Базовая: {formatBarrels(well.daily_income)} (+{Math.round((boosterMultiplier - 1) * 100)}% бустер)
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profit Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">В месяц</span>
                </div>
                <div className="font-bold text-lg text-blue-500">
                  {formatBarrels(Math.round(well.daily_income * boosterMultiplier * 30))}
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">В год</span>
                </div>
                <div className="font-bold text-lg text-green-500">
                  {formatBarrels(Math.round(well.daily_income * boosterMultiplier * 365))}
                </div>
              </CardContent>
            </Card>

            <Card className="text-center bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm text-muted-foreground">ROI/год</span>
                </div>
                <div className="font-bold text-lg text-primary">
                  {formatProfitPercent(metrics.yearlyPercent)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Section */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Прогресс улучшения</span>
                <span className="text-sm text-muted-foreground">{well.level}/{wellType.maxLevel}</span>
              </div>
              <Progress value={upgradeProgress} className="h-3" />

              {isMaxLevel ? (
                <div className="text-center py-4">
                  <Badge className="gradient-gold text-primary-foreground text-lg px-4 py-2">
                    <Zap className="h-4 w-4 mr-2" />
                    Максимальный уровень достигнут!
                  </Badge>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Стоимость улучшения:</span>
                      <div className="font-bold text-lg">{formatGameCurrency(upgradeCost)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Увеличение дохода:</span>
                      <div className="font-bold text-lg text-green-400">+15%</div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <div className="text-sm font-medium text-green-400">После улучшения:</div>
                    <div className="text-xs space-y-1">
                      <div>📈 Доход: {formatBarrels(well.daily_income)} → {formatBarrels(nextLevelIncome)} (+{formatBarrels(incomeIncrease)})</div>
                      {hasActiveBoosters && (
                        <div>⚡ С бустерами: {formatBarrels(currentIncomeWithBoosters)} → {formatBarrels(nextLevelIncomeWithBoosters)} (+{formatBarrels(boostIncomeIncrease)})</div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      onUpgradeWell(well.id);
                      onClose();
                    }}
                    disabled={!canUpgrade}
                    className="w-full gradient-gold text-primary-foreground"
                    size="lg"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    {canUpgrade ? 'Улучшить скважину' : 'Недостаточно средств'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};