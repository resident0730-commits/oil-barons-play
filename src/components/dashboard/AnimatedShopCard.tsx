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
  
  // Determine which special effects to show based on well type
  const showSmoke = wellType.name.includes('Промышленная') || wellType.name.includes('Супер');
  const showWaterWaves = wellType.name.includes('Космическая') || wellType.name.includes('Элитная');
  const showSparks = wellType.name.includes('Промышленная') || wellType.name.includes('Легендарная');

  return (
    <Card 
      className={`
        relative overflow-visible
        isometric-card depth-shadow
        ${rarityGlow} 
        ${!canAfford ? "opacity-60" : ""}
        border-2 border-primary/30
        h-[550px]
      `}
    >
      {/* Large well image */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={wellImage}
          alt={wellType.name}
          className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        
        {/* Twinkling lights on platforms */}
        <div className="lights-container">
          <div className="light"></div>
          <div className="light"></div>
          <div className="light"></div>
          <div className="light"></div>
        </div>

        {/* Animated smoke/steam */}
        {showSmoke && (
          <div className="smoke-container">
            <div className="smoke"></div>
            <div className="smoke"></div>
            <div className="smoke"></div>
          </div>
        )}

        {/* Water waves */}
        {showWaterWaves && (
          <div className="water-waves">
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        )}

        {/* Spark particles */}
        {showSparks && (
          <div className="sparks-container">
            <div className="spark"></div>
            <div className="spark"></div>
            <div className="spark"></div>
            <div className="spark"></div>
          </div>
        )}

        {/* Rarity badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge 
            className={`
              ${getRarityBadgeColor(wellType.rarity)} 
              shadow-2xl backdrop-blur-sm border-2 border-white/30
              text-sm px-3 py-1
            `}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {wellType.rarity}
          </Badge>
        </div>

        {/* Daily income badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-gradient-to-br from-primary/90 to-primary/70 backdrop-blur-md rounded-xl p-3 border-2 border-primary/40 shadow-2xl">
            <p className="font-bold text-xl text-white">{formatGameCurrency(wellType.baseIncome)}</p>
            <p className="text-xs text-white/90 font-medium">в день</p>
          </div>
        </div>

        {/* Well name overlay */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="text-2xl font-bold text-white drop-shadow-2xl">
            {wellType.name}
          </h3>
        </div>
      </div>

      {/* Content section */}
      <CardContent className="p-5 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {wellType.description}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl border border-border/50 transition-all duration-300 hover:scale-105">
            <p className="font-bold text-base">{formatGameCurrency(metrics.monthlyIncome)}</p>
            <p className="text-xs text-muted-foreground">в месяц</p>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl border border-primary/30 transition-all duration-300 hover:scale-105">
            <p className="font-bold text-primary text-base">{formatProfitPercent(metrics.yearlyPercent)}</p>
            <p className="text-xs text-muted-foreground">ROI/год</p>
          </div>
        </div>

        {/* Price and purchase */}
        <div className="space-y-3">
          <div className="flex justify-between items-center px-2 py-2 bg-muted/30 rounded-lg">
            <span className="text-muted-foreground text-sm">Цена:</span>
            <span className="text-2xl font-bold text-foreground">{formatGameCurrency(wellType.price)}</span>
          </div>
          
          <Button
            onClick={() => onBuyWell(wellType)}
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
            <ShoppingCart className="h-5 w-5 mr-2" />
            {canAfford ? 'Купить скважину' : 'Недостаточно средств'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};