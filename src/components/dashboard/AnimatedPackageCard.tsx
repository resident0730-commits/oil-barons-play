import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Star, Sparkles } from "lucide-react";
import { WellPackage, UserProfile } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

interface AnimatedPackageCardProps {
  wellPackage: WellPackage;
  profile: UserProfile;
  onBuyPackage: (wellPackage: WellPackage) => void;
}

export const AnimatedPackageCard = ({ 
  wellPackage, 
  profile, 
  onBuyPackage
}: AnimatedPackageCardProps) => {
  const { formatGameCurrency } = useCurrency();
  const canAfford = profile.balance >= wellPackage.discountedPrice;
  const savings = wellPackage.originalPrice - wellPackage.discountedPrice;

  return (
    <div 
      className={`
        game-card-flip
        ${!canAfford ? "opacity-60" : ""}
      `}
    >
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
          <div className="relative h-64 overflow-hidden">
            <img
              src={wellPackage.image}
              alt={wellPackage.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Discount badge */}
            <div className="absolute top-4 left-4 floating-badge">
              <Badge 
                className="bg-red-500 hover:bg-red-600 text-white shadow-2xl backdrop-blur-sm border-2 border-white/30 text-sm px-3 py-1"
              >
                <Star className="h-4 w-4 mr-1" />
                -{wellPackage.discount}%
              </Badge>
            </div>

            {/* Daily income badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-br from-primary/90 to-primary/70 backdrop-blur-md rounded-xl p-3 border-2 border-primary/40 shadow-2xl">
                <p className="font-bold text-xl text-white">{formatGameCurrency(wellPackage.totalDailyIncome)}</p>
                <p className="text-xs text-white/90 font-medium">в день</p>
              </div>
            </div>

            {/* Package name overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2">
                <div className="text-3xl">{wellPackage.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-white drop-shadow-2xl">
                    {wellPackage.name}
                  </h3>
                  <p className="text-sm text-white/80">{wellPackage.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content section */}
          <CardContent className="p-5 space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl border border-border/50">
                <p className="font-bold text-base">{wellPackage.wells.reduce((acc, w) => acc + w.count, 0)}</p>
                <p className="text-xs text-muted-foreground">скважин</p>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl border border-green-500/30">
                <p className="font-bold text-green-600 text-base">{formatGameCurrency(savings)}</p>
                <p className="text-xs text-muted-foreground">экономия</p>
              </div>
            </div>

            {/* Price display */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground line-through">{formatGameCurrency(wellPackage.originalPrice)}</span>
                <Badge className="gradient-gold text-primary-foreground">Хит продаж</Badge>
              </div>
              <div className="flex justify-between items-center px-2 py-3 bg-muted/30 rounded-lg">
                <span className="text-muted-foreground text-sm">Цена пакета:</span>
                <span className="text-2xl font-bold text-foreground">{formatGameCurrency(wellPackage.discountedPrice)}</span>
              </div>
            </div>

            {/* Hover hint */}
            <p className="text-center text-xs text-muted-foreground/70 italic">
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
            <CardContent className="p-6 flex flex-col justify-between min-h-full">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{wellPackage.icon}</span>
                    <h3 className="text-xl font-bold">{wellPackage.name}</h3>
                  </div>
                  <Badge className="bg-red-500 hover:bg-red-600 text-white">
                    -{wellPackage.discount}%
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {wellPackage.description}
                </p>

                {/* Package contents */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Содержимое пакета:
                  </h4>
                  <div className="space-y-2 bg-muted/30 rounded-xl p-3">
                    {wellPackage.wells.map((well) => (
                      <div key={well.type} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{well.type}</span>
                        <Badge variant="outline" className="text-xs">{well.count}x</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Income stats */}
                <div className="space-y-3 bg-muted/30 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доход в день:</span>
                    <span className="font-bold text-primary">{formatGameCurrency(wellPackage.totalDailyIncome)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доход в месяц:</span>
                    <span className="font-bold">{formatGameCurrency(wellPackage.totalDailyIncome * 30)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Доход в год:</span>
                    <span className="font-bold">{formatGameCurrency(wellPackage.totalDailyIncome * 365)}</span>
                  </div>
                </div>

                {/* Savings highlight */}
                <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                  <p className="text-xs text-center">
                    💰 <span className="font-medium text-green-600">Экономия {formatGameCurrency(savings)} при покупке пакета!</span>
                  </p>
                </div>
              </div>

              {/* Purchase section */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground line-through">Обычная цена:</span>
                    <span className="text-muted-foreground line-through">{formatGameCurrency(wellPackage.originalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Цена пакета:</span>
                    <span className="text-2xl font-bold text-foreground">{formatGameCurrency(wellPackage.discountedPrice)}</span>
                  </div>
                </div>
                
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyPackage(wellPackage);
                  }}
                  disabled={!canAfford}
                  className={`
                    w-full py-6 text-lg font-bold 
                    transition-all duration-300
                    ${canAfford 
                      ? 'bg-gradient-to-r from-primary via-primary/90 to-primary hover:shadow-2xl hover:scale-105 active:scale-95' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }
                  `}
                >
                  <Package className="h-5 w-5 mr-2" />
                  {canAfford ? 'Купить пакет' : 'Недостаточно средств'}
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};
