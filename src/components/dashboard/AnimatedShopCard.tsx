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
        relative overflow-hidden premium-shop-card
        ${rarityGlow} 
        ${!canAfford ? "opacity-60" : ""}
        border-2 border-primary/20
        min-h-[500px]
      `}
    >
      {/* Fullscreen background image with parallax */}
      <div className="parallax-bg">
        <img
          src={wellImage}
          alt={wellType.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 premium-gradient-overlay z-[1]"></div>

      {/* Floating gold/oil particles */}
      <div className="floating-particles z-[2]">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Content - positioned relative to stack above background */}
      <div className="relative z-[3] h-full flex flex-col">
        {/* Top badges section */}
        <div className="p-4 flex justify-between items-start">
          <Badge 
            className={`
              ${getRarityBadgeColor(wellType.rarity)} 
              rarity-badge-spin shadow-2xl backdrop-blur-sm
              border-2 border-white/20
            `}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {wellType.rarity}
          </Badge>

          <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-primary/40 shadow-2xl">
            <p className="font-bold text-2xl text-primary">{formatGameCurrency(wellType.baseIncome)}</p>
            <p className="text-xs text-white/90">в день</p>
          </div>
        </div>

        {/* Middle section - well name */}
        <div className="flex-1 flex items-center justify-center px-4">
          <h3 className="text-3xl font-bold text-white drop-shadow-2xl text-center">
            {wellType.name}
          </h3>
        </div>

        {/* Bottom section - stats and purchase */}
        <div className="p-6 space-y-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <p className="text-sm text-white/80 leading-relaxed text-center">
            {wellType.description}
          </p>

          {/* Animated metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="stat-card text-center p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <p className="font-bold text-lg text-white">{formatGameCurrency(metrics.monthlyIncome)}</p>
              <p className="text-xs text-white/70">в месяц</p>
            </div>
            <div className="stat-card text-center p-4 bg-primary/20 backdrop-blur-md rounded-xl border border-primary/40">
              <p className="font-bold text-primary text-lg">{formatProfitPercent(metrics.yearlyPercent)}</p>
              <p className="text-xs text-white/70">ROI/год</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-center px-2">
            <span className="text-white/70 text-sm">Цена:</span>
            <span className="text-2xl font-bold text-white">{formatGameCurrency(wellType.price)}</span>
          </div>
          
          {/* Morphing button */}
          <Button
            onClick={() => onBuyWell(wellType)}
            disabled={!canAfford}
            className={`
              w-full py-6 text-lg font-bold 
              morph-button relative z-10
              ${canAfford 
                ? 'bg-gradient-to-r from-primary via-primary/90 to-primary shadow-2xl border-2 border-primary/50' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
              }
            `}
          >
            <ShoppingCart className="h-6 w-6 mr-2" />
            {canAfford ? 'Купить скважину' : 'Недостаточно средств'}
          </Button>
        </div>
      </div>
    </Card>
  );
};