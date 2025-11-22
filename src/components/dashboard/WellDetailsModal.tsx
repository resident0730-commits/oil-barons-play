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
  formatProfitPercent
}: WellDetailsModalProps) => {
  const { formatBarrels, formatOilCoins } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  
  if (!well) return null;

  const wellType = wellTypes.find(wt => wt.name === well.well_type);
  if (!wellType) return null;

  const upgradeCost = Math.round(wellType.price * 0.5 * Math.pow(1.2, well.level - 1));
  const canUpgrade = well.level < wellType.maxLevel && profile.oilcoin_balance >= upgradeCost;
  const isMaxLevel = well.level >= wellType.maxLevel;
  const upgradeProgress = (well.level / wellType.maxLevel) * 100;
  
  const nextLevelIncome = Math.round(well.daily_income * 1.15);
  const incomeIncrease = nextLevelIncome - well.daily_income;
  
  const metrics = calculateProfitMetrics(well.daily_income, wellType.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto animate-scale-in p-4 sm:p-6">
        <DialogHeader className="text-center space-y-3 sm:space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-pulse opacity-20 absolute inset-0 bg-primary/30 rounded-full blur-xl scale-150"></div>
              <div className="relative z-10 transform scale-90 sm:scale-110">
                {getWellIcon(well.well_type)}
              </div>
            </div>
          </div>
          
          <div>
            <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {wellType.name}
            </DialogTitle>
            <DialogDescription className="flex flex-wrap justify-center gap-2 mt-2">
              <Badge className={getRarityColor(wellType.rarity)} variant="secondary">
                Уровень {well.level}
              </Badge>
              <Badge variant="outline">{wellType.rarity}</Badge>
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Income Overview */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Coins className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Доход скважины</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {formatBarrels(well.daily_income)}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">в день</div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Metrics */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Card className="text-center">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                  <span className="text-xs sm:text-sm text-muted-foreground">В месяц</span>
                </div>
                <div className="font-bold text-base sm:text-lg text-blue-500">
                  {formatBarrels(well.daily_income * 30)}
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                  <span className="text-xs sm:text-sm text-muted-foreground">В год</span>
                </div>
                <div className="font-bold text-base sm:text-lg text-green-500">
                  {formatBarrels(well.daily_income * 365)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrade Section */}
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base font-medium">Прогресс улучшения</span>
                <span className="text-xs sm:text-sm text-muted-foreground">{well.level}/{wellType.maxLevel}</span>
              </div>
              <Progress value={upgradeProgress} className="h-2 sm:h-3" />

              {isMaxLevel ? (
                <div className="text-center py-3 sm:py-4">
                  <Badge className="gradient-gold text-primary-foreground text-sm sm:text-lg px-3 sm:px-4 py-1.5 sm:py-2">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Максимальный уровень!
                  </Badge>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-muted-foreground">Стоимость:</span>
                      <div className="font-bold text-base sm:text-lg">{formatGameCurrency(upgradeCost)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Доход:</span>
                      <div className="font-bold text-base sm:text-lg text-green-400">+15%</div>
                    </div>
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 sm:p-4 space-y-2">
                    <div className="text-xs sm:text-sm font-medium text-green-400">После улучшения:</div>
                    <div className="text-xs space-y-1">
                      <div>📈 Доход: {formatBarrels(well.daily_income)} → {formatBarrels(nextLevelIncome)} (+{formatBarrels(incomeIncrease)})</div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      onUpgradeWell(well.id);
                      onClose();
                    }}
                    disabled={!canUpgrade}
                    className="w-full gradient-gold text-primary-foreground h-11 sm:h-12 text-sm sm:text-base"
                    size="lg"
                  >
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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