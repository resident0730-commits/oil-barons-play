import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Sparkles } from "lucide-react";
import { WellType, UserProfile } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

// Import well images
import starterWellArt from "@/assets/wells/starter-well-art.jpg";
import miniWellArt from "@/assets/wells/mini-well-art.jpg"; 
import mediumWellArt from "@/assets/wells/medium-well-art.jpg";
import premiumWellArt from "@/assets/wells/premium-well-art.jpg";
import superWellArt from "@/assets/wells/super-well-art.jpg";
import eliteWellArt from "@/assets/wells/elite-well-art.jpg";
import industrialWellArt from "@/assets/wells/industrial-well-art.jpg";  
import legendaryWellArt from "@/assets/wells/legendary-well-art.jpg";
import cosmicWellArt from "@/assets/wells/cosmic-well-art.jpg";

interface AnimatedShopCardProps {
  wellType: WellType;
  profile: UserProfile;
  onBuyWell: (wellType: WellType) => void;
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

// Mapping well types to their images
const getWellImage = (wellType: string) => {
  const imageMap: { [key: string]: string } = {
    'Стартовая скважина': starterWellArt,
    'Мини скважина': miniWellArt,
    'Средняя скважина': mediumWellArt,
    'Премиум-скважина': premiumWellArt,
    'Супер скважина': superWellArt,
    'Элитная скважина': eliteWellArt,
    'Промышленная скважина': industrialWellArt,
    'Легендарная скважина': legendaryWellArt,
    'Космическая скважина': cosmicWellArt,
  };
  return imageMap[wellType] || starterWellArt;
};

// Get rarity glow class
const getRarityGlowClass = (rarity: string) => {
  const glowMap: { [key: string]: string } = {
    'common': 'rarity-glow-common',
    'rare': 'rarity-glow-rare', 
    'epic': 'rarity-glow-epic',
    'legendary': 'rarity-glow-legendary',
    'mythic': 'rarity-glow-mythic',
  };
  return glowMap[rarity] || 'rarity-glow-common';
};

export const AnimatedShopCard = ({ 
  wellType, 
  profile, 
  onBuyWell, 
  getWellIcon, 
  getRarityColor, 
  getRarityBadgeColor, 
  calculateProfitMetrics, 
  formatProfitPercent 
}: AnimatedShopCardProps) => {
  const { formatGameCurrency } = useCurrency();
  const canAfford = profile.balance >= wellType.price;
  const metrics = calculateProfitMetrics(wellType.baseIncome, wellType.price);
  const wellImage = getWellImage(wellType.name);
  const rarityGlow = getRarityGlowClass(wellType.rarity);

  return (
    <Card 
      className={`
        relative overflow-hidden group shop-card-3d 
        ${rarityGlow} 
        ${!canAfford ? "opacity-60" : ""}
        border-2 hover:border-primary/40
        bg-gradient-to-br from-card via-card to-card/90
      `}
    >
      {/* Oil bubbles animation */}
      <div className="oil-bubbles">
        <div className="oil-bubble"></div>
        <div className="oil-bubble"></div>
        <div className="oil-bubble"></div>
        <div className="oil-bubble"></div>
      </div>

      {/* Rarity border glow */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getRarityColor(wellType.rarity)}`}></div>
      
      {/* Large well image section - 60% of card */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={wellImage}
          alt={wellType.name}
          className="w-full h-full object-cover well-image-scale group-hover:brightness-110 transition-all duration-500"
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Rarity badge - floating */}
        <div className="absolute top-3 left-3">
          <Badge className={`${getRarityBadgeColor(wellType.rarity)} animate-pulse shadow-lg`} variant="secondary">
            <Sparkles className="h-3 w-3 mr-1" />
            {wellType.rarity}
          </Badge>
        </div>

        {/* Daily income - floating */}
        <div className="absolute top-3 right-3 text-right">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 border border-primary/30">
            <p className="font-bold text-lg text-primary animated-counter">{formatGameCurrency(wellType.baseIncome)}</p>
            <p className="text-xs text-white/90">в день</p>
          </div>
        </div>

        {/* Well name - overlay at bottom */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{wellType.name}</h3>
        </div>
      </div>

      {/* Content section - 40% of card */}
      <CardContent className="p-4 space-y-4">
        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {wellType.description}
        </p>

        {/* Animated metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl hover:from-muted/70 hover:to-muted/50 transition-all duration-300">
            <p className="font-bold text-sm animated-counter">{formatGameCurrency(metrics.monthlyIncome)}</p>
            <p className="text-xs text-muted-foreground">в месяц</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl hover:from-primary/20 hover:to-primary/10 transition-all duration-300">
            <p className="font-bold text-primary text-sm animated-counter">{formatProfitPercent(metrics.yearlyPercent)}</p>
            <p className="text-xs text-muted-foreground">ROI/год</p>
          </div>
        </div>

        {/* Price and buy button */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground text-sm">Цена:</span>
            <span className="text-xl font-bold text-foreground">{formatGameCurrency(wellType.price)}</span>
          </div>
          
          <Button
            onClick={() => onBuyWell(wellType)}
            disabled={!canAfford}
            className={`
              w-full py-3 text-base font-bold transition-all duration-300
              ${canAfford 
                ? 'gradient-primary hover:shadow-primary hover:scale-105 active:scale-95' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            {canAfford ? 'Купить скважину' : 'Недостаточно средств'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};