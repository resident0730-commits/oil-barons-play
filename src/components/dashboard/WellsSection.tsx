import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Sparkles, ArrowUpDown, TrendingDown, TrendingUp, Calendar, CalendarDays, Droplet, Fuel, Zap, Rocket } from "lucide-react";
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

  // Calculate booster-only multiplier (without status bonuses)
  const calculateBoosterOnlyMultiplier = () => {
    let totalBonus = 0;
    
    boosters.forEach(booster => {
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      
      if (isActive) {
        switch (booster.booster_type) {
          case 'worker_crew':
            totalBonus += booster.level * 10;
            break;
          case 'geological_survey':
            totalBonus += booster.level * 15;
            break;
          case 'advanced_equipment':
            totalBonus += booster.level * 25;
            break;
          case 'turbo_boost':
            totalBonus += booster.level * 50;
            break;
          case 'automation':
            totalBonus += booster.level * 20;
            break;
        }
      }
    });
    
    return Math.round((1 + totalBonus / 100) * 100) / 100;
  };

  const boosterOnlyMultiplier = calculateBoosterOnlyMultiplier();

  // Helper function to get booster name
  const getBoosterName = (boosterType: string) => {
    const names: Record<string, string> = {
      worker_crew: "Бригада рабочих",
      geological_survey: "Геологическая разведка",
      advanced_equipment: "Продвинутое оборудование",
      turbo_boost: "Турбо-ускорение",
      automation: "Автоматизация"
    };
    return names[boosterType] || boosterType;
  };

  // Calculate booster bonus percentage
  const getBoosterBonus = (boosterType: string, level: number) => {
    const bonuses: Record<string, number> = {
      worker_crew: 10,
      geological_survey: 15,
      advanced_equipment: 25,
      turbo_boost: 50,
      automation: 20
    };
    return (bonuses[boosterType] || 0) * level;
  };

  // Calculate base income (without boosters)
  const baseIncome = wells.reduce((total, well) => total + well.daily_income, 0);

  // Calculate income contribution from each booster
  const getBoosterIncomeContribution = (boosterType: string, level: number) => {
    const bonusPercent = getBoosterBonus(boosterType, level);
    return Math.floor(baseIncome * (bonusPercent / 100));
  };

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
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 animate-fade-in">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/20 rounded-full blur-3xl translate-y-20 -translate-x-20"></div>
          <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
          
          <CardContent className="relative z-10 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-full bg-emerald-500/30 border border-emerald-400/30 animate-pulse shadow-lg shadow-emerald-500/50">
                  <Droplet className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300 drop-shadow" />
                </div>
                <div>
                  <p className="text-sm text-emerald-100/70 drop-shadow">Добыто баррелей</p>
                  <p className="text-2xl sm:text-3xl font-bold text-emerald-200 drop-shadow-lg">
                    {formatBarrels(accumulatedBarrels)}
                  </p>
                </div>
              </div>

              {/* Animated Loading Bar */}
              <div className="hidden sm:flex flex-1 items-center justify-center px-6">
                <div className="relative w-full max-w-md h-4 bg-gradient-to-r from-emerald-900/30 via-emerald-800/40 to-emerald-900/30 rounded-full overflow-hidden shadow-inner border border-emerald-500/30">
                  {/* Shining overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent animate-shine"></div>
                  
                  {/* Pulsing bars */}
                  <div className="absolute inset-0 flex gap-1 px-1">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-500 via-emerald-300 to-emerald-500 rounded-full animate-pulse shadow-lg"
                        style={{ 
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: '1.5s'
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-300/60 to-emerald-400/0 animate-pulse"></div>
                </div>
              </div>

              <Button 
                onClick={handleClaimBarrels}
                disabled={claimingBarrels}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-semibold shadow-xl hover:shadow-emerald-500/50 transition-all border border-emerald-400/50"
                size="lg"
              >
                {claimingBarrels ? "Собираем..." : "Собрать"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg truncate">
              Ваши скважины
            </h2>
            <p className="text-foreground/90 text-sm sm:text-base md:text-lg mt-1 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Живые активы, работающие на вас 24/7
            </p>
          </div>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          {/* Combined Income and Wells Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 group flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
            <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
            
            <CardContent className="relative z-10 p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Daily Income Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-xl border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300 drop-shadow" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-emerald-100/70 font-medium mb-1">Общий доход</p>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-200 drop-shadow-lg truncate">
                        {formatBarrels(profile.daily_income)}
                      </div>
                      <p className="text-xs text-emerald-100/60 mt-0.5">в день</p>
                    </div>
                  </div>
                  {hasActiveBoosters && (
                    <Badge className="bg-purple-500/30 text-purple-200 border border-purple-400/50 px-2 sm:px-3 py-1 sm:py-1.5 animate-pulse shadow-lg self-start sm:self-auto whitespace-nowrap flex-shrink-0">
                      <Sparkles className="h-3 w-3 mr-1 sm:mr-1.5" />
                      <span className="text-xs sm:text-sm">+{Math.round((boosterOnlyMultiplier - 1) * 100)}%</span>
                    </Badge>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-emerald-400/20"></div>

                {/* Active Wells Section */}
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-xl border border-emerald-400/30 flex-shrink-0">
                    <Fuel className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-300 drop-shadow" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-emerald-100/70 font-medium mb-1 truncate">Активных скважин</p>
                    <div className="text-xl sm:text-2xl font-bold text-emerald-200 drop-shadow-lg">
                      {wells.length}
                    </div>
                    <p className="text-xs text-emerald-100/60 mt-0.5">работают 24/7</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Boosters Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 group flex flex-col">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
            <div className="absolute inset-0 border-2 border-white/5 rounded-lg"></div>
            
            <CardContent className="relative z-10 p-4 sm:p-5 flex-1 flex flex-col">
              <div className="flex flex-col gap-3 h-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-xl border border-purple-400/30 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300 drop-shadow" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-purple-100/70 font-medium mb-1">Активные бустеры</p>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-200 drop-shadow-lg">
                      {boosters.filter(b => !b.expires_at || new Date(b.expires_at) > new Date()).length}
                    </div>
                  </div>
                </div>
                
                {hasActiveBoosters ? (
                  <div className="space-y-2 sm:space-y-3 flex-1">
                    <div className="flex items-center justify-between bg-purple-500/10 rounded-lg p-2 sm:p-2.5 border border-purple-400/20">
                      <span className="text-xs sm:text-sm text-purple-200/80 flex items-center gap-1 sm:gap-1.5 font-medium">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                        Множитель от бустеров
                      </span>
                      <span className="text-sm sm:text-base font-bold text-purple-200">×{boosterOnlyMultiplier.toFixed(2)}</span>
                    </div>
                    
                    <div className="space-y-1.5 sm:space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar">
                      {boosters
                        .filter(b => !b.expires_at || new Date(b.expires_at) > new Date())
                        .map(booster => {
                          const bonusPercent = getBoosterBonus(booster.booster_type, booster.level);
                          const incomeContribution = getBoosterIncomeContribution(booster.booster_type, booster.level);
                          
                          return (
                            <div 
                              key={booster.id}
                              className="bg-purple-500/5 rounded-lg p-2 sm:p-2.5 border border-purple-400/10 hover:border-purple-400/30 transition-all duration-200"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <Sparkles className="h-3 w-3 text-purple-300 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium text-purple-200 truncate">
                                      {getBoosterName(booster.booster_type)}
                                    </span>
                                    <Badge className="bg-purple-500/30 text-purple-200 border-0 text-[10px] px-1 py-0 flex-shrink-0">
                                      Ур.{booster.level}
                                    </Badge>
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                      <span className="text-purple-200/60">Бонус к доходу:</span>
                                      <span className="text-purple-300 font-semibold">+{bonusPercent}%</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs">
                                      <span className="text-purple-200/60">Дополнительно:</span>
                                      <span className="text-purple-300 font-semibold">+{formatBarrels(incomeContribution)}/день</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-lg p-2 sm:p-2.5 border border-purple-400/20 mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm text-purple-200/80 font-medium">Итого прибавка:</span>
                        <span className="text-sm sm:text-base font-bold text-purple-200">
                          +{formatBarrels(Math.floor(baseIncome * (boosterOnlyMultiplier - 1)))}/день
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-purple-100/60">Нет активных бустеров</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
            <p className="text-foreground/90 text-sm sm:text-base font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
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