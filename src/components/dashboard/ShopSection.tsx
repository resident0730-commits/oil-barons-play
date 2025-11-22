import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Gem, Star } from "lucide-react";
import { wellTypes, wellPackages, UserProfile, WellType, WellPackage } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";
import { AnimatedShopCard } from "./AnimatedShopCard";
import { AnimatedPackageCard } from "./AnimatedPackageCard";

interface ShopSectionProps {
  profile: UserProfile;
  onBuyWell: (wellType: WellType) => void;
  onBuyPackage: (wellPackage: WellPackage) => void;
  onTopUpClick?: () => void;
  getWellIcon: (wellType: string) => JSX.Element;
  getRarityColor: (rarity: string) => string;
  getRarityBadgeColor: (rarity: string) => string;
  calculateProfitMetrics: (dailyIncome: number, price: number) => { 
    monthlyIncome: number; 
    yearlyIncome: number; 
    yearlyPercent: number; 
  };
  formatProfitPercent: (percent: number) => string;
}

export const ShopSection = ({ 
  profile, 
  onBuyWell, 
  onBuyPackage,
  onTopUpClick,
  getWellIcon, 
  getRarityColor, 
  getRarityBadgeColor, 
  calculateProfitMetrics, 
  formatProfitPercent 
}: ShopSectionProps) => {
  const { formatOilCoins } = useCurrency();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold heading-contrast truncate">Магазин скважин</h2>
          <p className="text-muted-foreground subtitle-contrast text-xs sm:text-sm">Расширяйте свою нефтяную империю</p>
        </div>
        <div className="section-toolbar overflow-x-auto w-full sm:w-auto">
          <div className="flex items-center space-x-2 min-w-max">
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Доступно:</span>
            <Badge className="gradient-gold text-primary-foreground text-xs sm:text-sm whitespace-nowrap">
              {formatOilCoins(profile.oilcoin_balance)}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="wells" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wells" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Gem className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Отдельные скважины</span>
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Пакеты скважин</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wells" className="mt-4 sm:mt-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {wellTypes.map((wellType, index) => (
              <div 
                key={wellType.name} 
                className="wave-appear" 
                style={{animationDelay: `${index * 100}ms`}}
              >
                <AnimatedShopCard
                  wellType={wellType}
                  profile={profile}
                  onBuyWell={onBuyWell}
                  onTopUpClick={onTopUpClick}
                  getWellIcon={getWellIcon}
                  getRarityColor={getRarityColor}
                  getRarityBadgeColor={getRarityBadgeColor}
                  calculateProfitMetrics={calculateProfitMetrics}
                  formatProfitPercent={formatProfitPercent}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
            {wellPackages.map((wellPackage, index) => (
              <div 
                key={wellPackage.name} 
                className="wave-appear" 
                style={{animationDelay: `${index * 100}ms`}}
              >
                <AnimatedPackageCard
                  wellPackage={wellPackage}
                  profile={profile}
                  onBuyPackage={onBuyPackage}
                  onTopUpClick={onTopUpClick}
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};