import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Zap, Sparkles, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { UserWell, UserProfile, WellType, UserBooster } from "@/hooks/useGameData";

interface WellInfoModalProps {
  well: UserWell;
  wellType: WellType;
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (wellId: string) => void;
  profile: UserProfile;
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

export const WellInfoModal = ({
  well,
  wellType,
  isOpen,
  onClose,
  onUpgrade,
  profile,
  getWellIcon,
  getRarityColor,
  calculateProfitMetrics,
  formatProfitPercent,
  boosters,
  getActiveBoosterMultiplier
}: WellInfoModalProps) => {
  const boosterMultiplier = getActiveBoosterMultiplier();
  const hasActiveBoosters = boosters.some(booster => 
    !booster.expires_at || new Date(booster.expires_at) > new Date()
  );

  const upgradeCost = Math.round((wellType.price * 0.3 * well.level));
  const canUpgrade = well.level < wellType.maxLevel && profile.balance >= upgradeCost;
  const isMaxLevel = well.level >= wellType.maxLevel;
  const upgradeProgress = (well.level / wellType.maxLevel) * 100;
  
  // Calculate upgrade benefits
  const nextLevelIncome = Math.round(well.daily_income * 1.15);
  const incomeIncrease = nextLevelIncome - well.daily_income;
  const nextLevelIncomeWithBoosters = Math.round(nextLevelIncome * boosterMultiplier);
  const currentIncomeWithBoosters = Math.round(well.daily_income * boosterMultiplier);
  const boostIncomeIncrease = nextLevelIncomeWithBoosters - currentIncomeWithBoosters;
  
  const metrics = calculateProfitMetrics(well.daily_income, wellType.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            {getWellIcon(well.well_type)}
            <div>
              <div className="text-xl">{wellType.name}</div>
              <div className="flex items-center space-x-2 mt-1">
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
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Daily Income Section */}
          <div className="text-center p-4 gradient-gold rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-primary-foreground" />
              <span className="text-lg font-bold text-primary-foreground">
                {Math.round(well.daily_income * boosterMultiplier).toLocaleString()} OC/день
              </span>
            </div>
            {hasActiveBoosters && (
              <p className="text-sm text-primary-foreground/80">
                Базовая: {well.daily_income.toLocaleString()} OC/день (+{Math.round((boosterMultiplier - 1) * 100)}% от бустеров)
              </p>
            )}
          </div>

          {/* Income Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
              </div>
              <p className="font-bold text-lg">{Math.round(well.daily_income * boosterMultiplier * 30).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">OC/месяц</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground mr-1" />
              </div>
              <p className="font-bold text-lg">{Math.round(well.daily_income * boosterMultiplier * 365).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">OC/год</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Sparkles className="h-4 w-4 text-primary mr-1" />
              </div>
              <p className="font-bold text-lg text-primary">{formatProfitPercent(metrics.yearlyPercent)}</p>
              <p className="text-xs text-muted-foreground">ROI/год</p>
            </div>
          </div>

          {/* Upgrade Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Прогресс улучшения</span>
              <span className="text-sm text-muted-foreground">{well.level}/{wellType.maxLevel}</span>
            </div>
            <Progress value={upgradeProgress} className="h-3" />
          </div>

          {/* Active Boosters Info */}
          {hasActiveBoosters && (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                <span className="font-medium text-purple-300">Активные усиления</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {boosters
                  .filter(booster => !booster.expires_at || new Date(booster.expires_at) > new Date())
                  .map((booster, index) => (
                    <div key={index} className="text-purple-300">
                      • {booster.booster_type} (Ур. {booster.level})
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Upgrade Section */}
          <div className="space-y-4 pt-4 border-t">
            {isMaxLevel ? (
              <div className="text-center">
                <Badge className="gradient-gold text-primary-foreground text-sm px-4 py-2">
                  <Zap className="h-4 w-4 mr-2" />
                  Максимальный уровень достигнут
                </Badge>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">Стоимость улучшения:</span>
                  <span className="font-bold text-lg">{upgradeCost.toLocaleString()} OC</span>
                </div>
                
                <div className="space-y-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="font-medium text-green-400 mb-2">Улучшение даст:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>📈 Доход:</span>
                      <span className="text-green-400">+{incomeIncrease.toLocaleString()} → {nextLevelIncome.toLocaleString()}</span>
                    </div>
                    {hasActiveBoosters && (
                      <div className="flex justify-between">
                        <span>⚡ С бустерами:</span>
                        <span className="text-green-400">+{boostIncomeIncrease.toLocaleString()} → {nextLevelIncomeWithBoosters.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>💰 Прирост:</span>
                      <span className="text-green-400">+15% доходности</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => onUpgrade(well.id)}
                  disabled={!canUpgrade}
                  className="w-full gradient-gold text-primary-foreground"
                  size="lg"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  {canUpgrade ? 'Улучшить скважину' : 'Недостаточно средств'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};