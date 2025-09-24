import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Gem, Star } from "lucide-react";
import { wellTypes, wellPackages, UserProfile, WellType, WellPackage } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

interface ShopSectionProps {
  profile: UserProfile;
  onBuyWell: (wellType: WellType) => void;
  onBuyPackage: (wellPackage: WellPackage) => void;
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
  getWellIcon, 
  getRarityColor, 
  getRarityBadgeColor, 
  calculateProfitMetrics, 
  formatProfitPercent 
}: ShopSectionProps) => {
  const { formatGameCurrency } = useCurrency();
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold heading-contrast">Магазин скважин</h2>
          <p className="text-muted-foreground subtitle-contrast text-sm">Расширяйте свою нефтяную империю</p>
        </div>
        <div className="section-toolbar overflow-x-auto">
          <div className="flex items-center space-x-2 min-w-max">
            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Доступно:</span>
            <Badge className="gradient-gold text-primary-foreground text-xs sm:text-sm">
              {formatGameCurrency(profile.balance)}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="wells" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wells" className="flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Отдельные скважины
          </TabsTrigger>
          <TabsTrigger value="packages" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Пакеты скважин
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wells" className="mt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {wellTypes.map((wellType) => {
              const canAfford = profile.balance >= wellType.price;
              const metrics = calculateProfitMetrics(wellType.baseIncome, wellType.price);

              return (
                <Card key={wellType.name} className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${!canAfford ? "opacity-60" : ""}`}>
                  <div className={`absolute top-0 left-0 w-full h-1 ${wellType.rarity === 'mythic' ? 'gradient-luxury' : 'gradient-gold'}`}></div>
                  
                  <CardHeader className="pb-2 sm:pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="flex-shrink-0">
                          {getWellIcon(wellType.name)}
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-base sm:text-lg truncate">{wellType.name}</CardTitle>
                          <Badge className={getRarityBadgeColor(wellType.rarity)} variant="secondary">
                            {wellType.rarity}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm sm:text-lg text-primary">{formatGameCurrency(wellType.baseIncome)}</p>
                        <p className="text-xs text-muted-foreground">в день</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-foreground/90 sm:text-muted-foreground break-words leading-relaxed font-medium sm:font-normal">
                        {wellType.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                        <div className="text-center p-2 bg-muted/50 rounded">
                          <p className="font-medium text-xs sm:text-sm">{formatGameCurrency(metrics.monthlyIncome)}</p>
                          <p className="text-xs text-muted-foreground">в месяц</p>
                        </div>
                        <div className="text-center p-2 bg-primary/10 rounded">
                          <p className="font-medium text-primary text-xs sm:text-sm">{formatProfitPercent(metrics.yearlyPercent)}</p>
                          <p className="text-xs text-muted-foreground">ROI/год</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Цена: </span>
                        <span className="font-bold text-base sm:text-lg">{formatGameCurrency(wellType.price)}</span>
                      </div>
                      <Button
                        onClick={() => onBuyWell(wellType)}
                        disabled={!canAfford}
                        className="gradient-gold text-primary-foreground w-full sm:w-auto"
                        size="sm"
                      >
                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Купить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="packages" className="mt-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
            {wellPackages.map((wellPackage) => {
              const canAfford = profile.balance >= wellPackage.discountedPrice;
              const savings = wellPackage.originalPrice - wellPackage.discountedPrice;

              return (
                <Card key={wellPackage.name} className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${!canAfford ? 'opacity-60' : ''}`}>
                  <div className="absolute top-0 left-0 w-full h-1 gradient-luxury"></div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <img 
                            src={wellPackage.image} 
                            alt={wellPackage.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-primary/20"
                          />
                          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded-full flex items-center justify-center text-xs">
                            {wellPackage.icon}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg sm:text-xl truncate">{wellPackage.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">{wellPackage.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex flex-col gap-1 sm:gap-2">
                          <Badge className="bg-red-100 text-red-800 border-red-300 text-xs">
                            -{wellPackage.discount}%
                          </Badge>
                          <Badge className="gradient-gold text-primary-foreground text-xs">
                            <Star className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            Хит
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Содержимое пакета:</h4>
                      <div className="grid gap-1 sm:gap-2">
                        {wellPackage.wells.map((well) => (
                          <div key={well.type} className="flex justify-between items-center text-xs sm:text-sm bg-muted/50 p-2 rounded">
                            <span className="truncate">{well.type}</span>
                            <Badge variant="outline" className="text-xs">{well.count}x</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-sm">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="font-medium text-xs sm:text-sm">{formatGameCurrency(wellPackage.totalDailyIncome)}</p>
                        <p className="text-xs text-muted-foreground">в день</p>
                      </div>
                      <div className="text-center p-2 bg-green-100 rounded">
                        <p className="font-medium text-green-800 text-xs sm:text-sm">{formatGameCurrency(savings)}</p>
                        <p className="text-xs text-green-600">экономия</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Обычная цена:</span>
                        <span className="line-through text-muted-foreground">{formatGameCurrency(wellPackage.originalPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold">Цена пакета:</span>
                        <span className="text-lg sm:text-xl font-bold text-primary">{formatGameCurrency(wellPackage.discountedPrice)}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onBuyPackage(wellPackage)}
                      disabled={!canAfford}
                      className="w-full gradient-luxury text-primary-foreground text-base sm:text-lg py-2 sm:py-3"
                    >
                      <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Купить пакет
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};