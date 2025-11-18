import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ArrowUpDown, TrendingDown, TrendingUp, Calendar, CalendarDays, Droplet } from "lucide-react";
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

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
  onBarrelsClaimed?: () => void;
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
  getActiveBoosterMultiplier,
  onBarrelsClaimed
}: WellsSectionProps) => {
  const { formatBarrels, formatOilCoins } = useCurrency();
  const formatGameCurrency = formatOilCoins;
  const [selectedWell, setSelectedWell] = useState<UserWell | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [sortType, setSortType] = useState<'default' | 'income-desc' | 'income-asc' | 'level-desc' | 'level-asc'>('default');
  const [claimingBarrels, setClaimingBarrels] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

  // Update current time every second for real-time barrel calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate accumulated barrels based on daily income and time since last claim in real-time
  const calculateAccumulatedBarrels = () => {
    if (!profile.daily_income || profile.daily_income === 0) return 0;
    
    const lastClaim = profile.last_barrel_claim ? new Date(profile.last_barrel_claim) : new Date();
    const hoursPassed = (currentTime.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);
    
    if (hoursPassed < 0) return 0;
    
    const barrelsPerHour = profile.daily_income / 24;
    const accumulated = barrelsPerHour * hoursPassed;
    
    return Math.floor(accumulated);
  };

  const accumulatedBarrels = calculateAccumulatedBarrels();

  const handleClaimBarrels = async () => {
    if (!user) return;
    
    setClaimingBarrels(true);
    try {
      const { data, error } = await supabase.rpc('claim_accumulated_barrels', {
        p_user_id: user.id
      });

      if (error) throw error;

      const result = data as { success: boolean; barrels_earned: number; hours_passed: number; error?: string };

      if (result.success) {
        toast({
          title: "Баррели собраны!",
          description: `Вы получили ${formatBarrels(Math.round(result.barrels_earned))} за ${result.hours_passed.toFixed(1)} часов`,
        });
        
        // Trigger reload callback to update data without full page reload
        if (onBarrelsClaimed) {
          onBarrelsClaimed();
        }
      } else {
        toast({
          title: "Ошибка",
          description: result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error claiming barrels:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось собрать баррели",
        variant: "destructive"
      });
    } finally {
      setClaimingBarrels(false);
    }
  };
  
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
      {/* Barrel Collection Banner */}
      {accumulatedBarrels > 0 && (
        <Card className="bg-gradient-to-r from-oil-amber/10 to-oil-bronze/10 border-oil-amber/30 hover:border-oil-amber/50 transition-all overflow-hidden">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-full bg-oil-amber/20 animate-pulse">
                  <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-oil-amber" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Добыто баррелей</p>
                  <p className="text-2xl sm:text-3xl font-bold text-oil-amber">
                    {formatBarrels(accumulatedBarrels)}
                  </p>
                </div>
              </div>

              {/* Animated Loading Bar */}
              <div className="hidden sm:flex flex-1 items-center justify-center px-4">
                <div className="relative w-full max-w-xs h-2 bg-oil-bronze/20 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oil-amber to-transparent animate-shine opacity-60"></div>
                  <div className="absolute inset-0 flex gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-oil-amber/40 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleClaimBarrels}
                disabled={claimingBarrels}
                className="w-full sm:w-auto bg-gradient-to-r from-oil-amber to-oil-bronze hover:from-oil-amber/90 hover:to-oil-bronze/90 text-primary-foreground shadow-lg hover:shadow-oil-amber/50 transition-all"
                size="lg"
              >
                {claimingBarrels ? "Собираем..." : "Собрать"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  {formatBarrels(profile.daily_income)}/день
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
      />
    </div>
  );
};