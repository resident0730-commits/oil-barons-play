import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, Gem, Star } from "lucide-react";
import { wellTypes, wellPackages, UserProfile, WellType, WellPackage } from "@/hooks/useGameData";

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
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold heading-contrast">Магазин скважин</h2>
          <p className="text-muted-foreground subtitle-contrast">Расширяйте свою нефтяную империю</p>
        </div>
        <div className="section-toolbar">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">Доступно:</span>
            <Badge className="gradient-gold text-primary-foreground">
              {profile.balance.toLocaleString()} OC
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {wellTypes.map((wellType) => {
              const canAfford = profile.balance >= wellType.price;
              const metrics = calculateProfitMetrics(wellType.baseIncome, wellType.price);

              return (
                <Card key={wellType.name} className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${!canAfford ? 'opacity-60' : ''}`}>
                  <div className={`absolute top-0 left-0 w-full h-1 ${wellType.rarity === 'mythic' ? 'gradient-luxury' : 'gradient-gold'}`}></div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        {getWellIcon(wellType.name)}
                        <div>
                          <CardTitle className="text-lg">{wellType.name}</CardTitle>
                          <Badge className={getRarityBadgeColor(wellType.rarity)} variant="secondary">
                            {wellType.rarity}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-primary">{wellType.baseIncome.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">OC/день</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {wellType.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="font-medium">{metrics.monthlyIncome.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">в месяц</p>
                      </div>
                      <div className="text-center p-2 bg-primary/10 rounded">
                        <p className="font-medium text-primary">{formatProfitPercent(metrics.yearlyPercent)}</p>
                        <p className="text-xs text-muted-foreground">ROI/год</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Цена: </span>
                        <span className="font-bold text-lg">{wellType.price.toLocaleString()} OC</span>
                      </div>
                      <Button
                        onClick={() => onBuyWell(wellType)}
                        disabled={!canAfford}
                        className="gradient-gold text-primary-foreground"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
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
          <div className="grid gap-4 md:grid-cols-2">
            {wellPackages.map((wellPackage) => {
              const canAfford = profile.balance >= wellPackage.discountedPrice;
              const savings = wellPackage.originalPrice - wellPackage.discountedPrice;

              return (
                <Card key={wellPackage.name} className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${!canAfford ? 'opacity-60' : ''}`}>
                  <div className="absolute top-0 left-0 w-full h-1 gradient-luxury"></div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Package className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{wellPackage.name}</CardTitle>
                          <CardDescription>{wellPackage.description}</CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-800 border-red-300">
                            -{wellPackage.discount}%
                          </Badge>
                          <Badge className="gradient-gold text-primary-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Хит
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Содержимое пакета:</h4>
                      <div className="grid gap-2">
                        {wellPackage.wells.map((well) => (
                          <div key={well.type} className="flex justify-between items-center text-sm bg-muted/50 p-2 rounded">
                            <span>{well.type}</span>
                            <Badge variant="outline">{well.count}x</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <p className="font-medium">{wellPackage.totalDailyIncome.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">OC в день</p>
                      </div>
                      <div className="text-center p-2 bg-green-100 rounded">
                        <p className="font-medium text-green-800">{savings.toLocaleString()}</p>
                        <p className="text-xs text-green-600">экономия</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Обычная цена:</span>
                        <span className="line-through text-muted-foreground">{wellPackage.originalPrice.toLocaleString()} OC</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">Цена пакета:</span>
                        <span className="text-xl font-bold text-primary">{wellPackage.discountedPrice.toLocaleString()} OC</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onBuyPackage(wellPackage)}
                      disabled={!canAfford}
                      className="w-full gradient-luxury text-primary-foreground text-lg py-3"
                    >
                      <Package className="h-5 w-5 mr-2" />
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