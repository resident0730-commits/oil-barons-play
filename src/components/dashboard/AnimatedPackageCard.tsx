import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Star, Sparkles, Wallet } from "lucide-react";
import { WellPackage, UserProfile } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

interface AnimatedPackageCardProps {
  wellPackage: WellPackage;
  profile: UserProfile;
  onBuyPackage: (wellPackage: WellPackage) => void;
  onTopUpClick?: () => void;
}

export const AnimatedPackageCard = ({ 
  wellPackage, 
  profile, 
  onBuyPackage,
  onTopUpClick
}: AnimatedPackageCardProps) => {
  const { formatBarrels, formatOilCoins } = useCurrency();
  const canAfford = profile.oilcoin_balance >= wellPackage.discountedPrice;
  const savings = wellPackage.originalPrice - wellPackage.discountedPrice;

  return (
    <div className="game-card-flip">
      <div className="game-card-inner">
        {/* FRONT SIDE */}
        <Card 
          className={`
            game-card-front
            relative overflow-hidden
            rarity-glow-epic
            border-2 border-primary/30
            shimmer-effect
          `}
        >
          {/* Large package image */}
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
            <img
              src={wellPackage.image}
              alt={wellPackage.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Discount badge */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 floating-badge">
              <Badge 
                className="bg-red-500 hover:bg-red-600 text-white shadow-2xl backdrop-blur-sm border-2 border-white/30 text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1"
              >
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                -{wellPackage.discount}%
              </Badge>
            </div>

            {/* Daily income badge */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="bg-gradient-to-br from-amber-500/90 to-amber-600/70 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-amber-400/40 shadow-2xl">
                <p className="font-bold text-base sm:text-lg md:text-xl text-white truncate">{formatBarrels(wellPackage.totalDailyIncome)}</p>
                <p className="text-xs text-white/90 font-medium">в день</p>
              </div>
            </div>

            {/* Package name overlay */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-2xl truncate">
                {wellPackage.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-1">{wellPackage.description}</p>
            </div>
          </div>

          {/* Content section */}
          <CardContent className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl border border-border/50">
                <p className="font-bold text-sm sm:text-base">{wellPackage.wells.reduce((acc, w) => acc + w.count, 0)}</p>
                <p className="text-xs text-muted-foreground">скважин</p>
              </div>
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl border border-green-500/30">
                <p className="font-bold text-green-600 text-sm sm:text-base truncate">{formatOilCoins(savings)}</p>
                <p className="text-xs text-muted-foreground">экономия</p>
              </div>
            </div>

            {/* Price display */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-muted-foreground line-through truncate">{formatOilCoins(wellPackage.originalPrice)}</span>
                <Badge className="gradient-gold text-primary-foreground text-xs whitespace-nowrap">Хит продаж</Badge>
              </div>
              <div className="flex justify-between items-center px-2 py-2 sm:py-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground text-xs sm:text-sm">Цена пакета:</span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{formatOilCoins(wellPackage.discountedPrice)}</span>
              </div>
            </div>

            {/* Hover hint */}
            <p className="text-center text-xs text-muted-foreground/70 italic hidden sm:block">
              Наведите для деталей
            </p>
          </CardContent>
        </Card>

        {/* BACK SIDE */}
        <Card 
          className={`
            game-card-back
            rarity-glow-epic
            border-2 border-primary/30
            bg-gradient-to-br from-card via-card/95 to-card/90
            overflow-hidden
          `}
        >
          <div className="h-full overflow-y-auto">
            <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col justify-between min-h-full">
              {/* Header */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">{wellPackage.name}</h3>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs whitespace-nowrap flex-shrink-0">
                    -{wellPackage.discount}%
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {wellPackage.description}
                </p>

                {/* Package contents */}
                <div className="space-y-2">
                  <h4 className="font-medium text-xs sm:text-sm flex items-center gap-2">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                    <span className="truncate">Содержимое пакета:</span>
                  </h4>
                  <div className="space-y-1 sm:space-y-2 bg-muted/30 rounded-xl p-2 sm:p-3">
                    {wellPackage.wells.map((well) => (
                      <div key={well.type} className="flex justify-between items-center text-xs sm:text-sm gap-2">
                        <span className="text-muted-foreground truncate min-w-0">{well.type}</span>
                        <Badge variant="outline" className="text-xs whitespace-nowrap flex-shrink-0">{well.count}x</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Income stats */}
                <div className="space-y-2 sm:space-y-3 bg-muted/30 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в день:</span>
                    <span className="font-bold text-amber-400 truncate">{formatBarrels(wellPackage.totalDailyIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в месяц:</span>
                    <span className="font-bold truncate">{formatBarrels(wellPackage.totalDailyIncome * 30)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в год:</span>
                    <span className="font-bold truncate">{formatBarrels(wellPackage.totalDailyIncome * 365)}</span>
                  </div>
                </div>

                {/* Savings highlight */}
                <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 border border-green-500/20">
                  <p className="text-xs text-center">
                    💰 <span className="font-medium text-green-600">Экономия {formatOilCoins(savings)} при покупке пакета!</span>
                  </p>
                </div>
              </div>

              {/* Purchase section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground line-through truncate">Обычная цена:</span>
                    <span className="text-muted-foreground line-through truncate">{formatOilCoins(wellPackage.originalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm sm:text-base md:text-lg gap-2">
                    <span className="text-muted-foreground truncate">Цена пакета:</span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{formatOilCoins(wellPackage.discountedPrice)}</span>
                  </div>
                </div>
                
                {canAfford ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyPackage(wellPackage);
                    }}
                    className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-bold transition-all duration-300 bg-gradient-to-r from-primary via-primary/90 to-primary hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">Купить пакет</span>
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTopUpClick) onTopUpClick();
                    }}
                    variant="outline"
                    className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-bold transition-all duration-300 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 hover:scale-105"
                  >
                    <Wallet className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">Пополнить баланс</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};
