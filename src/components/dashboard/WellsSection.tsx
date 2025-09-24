import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ArrowUpDown, TrendingDown, TrendingUp, Calendar, CalendarDays } from "lucide-react";
import { useState } from "react";
import { UserWell, UserProfile, UserBooster } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";
import { AnimatedWellCard } from "./AnimatedWellCard";
import { WellDetailsModal } from "./WellDetailsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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
  const { formatGameCurrency } = useCurrency();
  const [selectedWell, setSelectedWell] = useState<UserWell | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortType, setSortType] = useState<'default' | 'income-desc' | 'income-asc' | 'level-desc' | 'level-asc'>('default');
  
  const boosterMultiplier = getActiveBoosterMultiplier();
  const hasActiveBoosters = boosters.some(booster => 
    !booster.expires_at || new Date(booster.expires_at) > new Date()
  );

  const handleShowDetails = (well: UserWell) => {
    setSelectedWell(well);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedWell(null);
  };

  // Функция сортировки скважин
  const sortedWells = [...wells].sort((a, b) => {
    switch (sortType) {
      case 'income-desc':
        return (b.daily_income * boosterMultiplier) - (a.daily_income * boosterMultiplier);
      case 'income-asc':
        return (a.daily_income * boosterMultiplier) - (b.daily_income * boosterMultiplier);
      case 'level-desc':
        return b.level - a.level;
      case 'level-asc':
        return a.level - b.level;
      default:
        return 0; // Оригинальный порядок
    }
  });

  const getSortLabel = () => {
    switch (sortType) {
      case 'income-desc': return 'По доходности ↓';
      case 'income-asc': return 'По доходности ↑';
      case 'level-desc': return 'По уровню ↓';
      case 'level-asc': return 'По уровню ↑';
      default: return 'По умолчанию';
    }
  };
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold heading-contrast bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Ваши скважины
          </h2>
          <p className="text-muted-foreground subtitle-contrast">Живые активы, работающие на вас 24/7</p>
        </div>
        <div className="section-toolbar overflow-x-auto">
          <div className="flex items-center justify-between w-full min-w-max">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Общий доход:</span>
                <Badge className="gradient-gold text-primary-foreground animate-pulse text-xs sm:text-sm">
                  {formatGameCurrency(profile.daily_income)}/день
                </Badge>
                {hasActiveBoosters && (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 animate-fade-in text-xs">
                    <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    +{Math.round((boosterMultiplier - 1) * 100)}%
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Активных:</span>
                <Badge variant="outline" className="animate-fade-in text-xs sm:text-sm">
                  {wells.length}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {wells.length === 0 ? (
        <Card className="border-dashed animate-fade-in">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-6 bg-muted/50 rounded-full mb-6 animate-pulse">
              <Plus className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Ваша нефтяная империя ждет!</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Начните с покупки первой скважины в магазине. Каждая скважина будет работать и приносить доход 24 часа в сутки.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 animate-fade-in animation-delay-100">
            <p className="text-muted-foreground text-xs sm:text-sm">
              Скважины работают в реальном времени. Нажмите для управления.
            </p>
            
            {/* Сортировка */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-xs sm:text-sm w-full sm:w-auto">
                  <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{getSortLabel()}</span>
                  <span className="sm:hidden">Сортировка</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 sm:w-48">
                <DropdownMenuItem onClick={() => setSortType('default')}>
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  По умолчанию
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('income-desc')}>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  По доходности ↓
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('income-asc')}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  По доходности ↑
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('level-desc')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  По уровню ↓
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortType('level-asc')}>
                  <CalendarDays className="h-4 w-4 mr-2" />
                  По уровню ↑
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 justify-items-center">
            {sortedWells.map((well, index) => (
              <div key={well.id} className={`animate-fade-in`} style={{animationDelay: `${index * 100}ms`}}>
                <AnimatedWellCard
                  well={well}
                  onShowDetails={handleShowDetails}
                  getWellIcon={getWellIcon}
                  getRarityColor={getRarityColor}
                  boosters={boosters}
                  getActiveBoosterMultiplier={getActiveBoosterMultiplier}
                />
              </div>
            ))}
          </div>
        </>
      )}

      <WellDetailsModal
        well={selectedWell}
        profile={profile}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        onUpgradeWell={onUpgradeWell}
        getWellIcon={getWellIcon}
        getRarityColor={getRarityColor}
        calculateProfitMetrics={calculateProfitMetrics}
        formatProfitPercent={formatProfitPercent}
        boosters={boosters}
        getActiveBoosterMultiplier={getActiveBoosterMultiplier}
      />
    </div>
  );
};