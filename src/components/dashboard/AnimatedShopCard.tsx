import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Sparkles, Wallet } from "lucide-react";
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

// Mapping well types to their images
const getWellImage = (wellType: string) => {
  const imageMap: { [key: string]: string } = {
    'Стартовая скважина': starterWellArt,
    'Мини-скважина': miniWellArt,
    'Средняя скважина': mediumWellArt,
    'Премиум-скважина': premiumWellArt,
    'Супер-скважина': superWellArt,
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
  onTopUpClick,
  getWellIcon, 
  getRarityColor, 
  getRarityBadgeColor, 
  calculateProfitMetrics, 
  formatProfitPercent 
}: AnimatedShopCardProps) => {
  const { formatBarrels, formatOilCoins } = useCurrency();
  const canAfford = profile.oilcoin_balance >= wellType.price;
  const metrics = calculateProfitMetrics(wellType.baseIncome, wellType.price);
  const wellImage = getWellImage(wellType.name);
  const rarityGlow = getRarityGlowClass(wellType.rarity);
  
  const isLegendaryOrHigher = wellType.rarity === 'legendary' || wellType.rarity === 'mythic';

  return (
    <div className="game-card-flip">
      <div className="game-card-inner">
        {/* FRONT SIDE */}
        <Card 
          className={`
            game-card-front
            relative overflow-hidden
            ${rarityGlow} 
            ${isLegendaryOrHigher ? 'holographic-effect' : ''}
            border-2 border-primary/30
            shimmer-effect
          `}
        >
          {/* Large well image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={wellImage}
              alt={wellType.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Floating rarity badge */}
            <div className="absolute top-4 left-4 floating-badge">
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
            <div className="absolute top-4 right-4">
              <div className="bg-gradient-to-br from-amber-500/90 to-amber-600/70 backdrop-blur-md rounded-xl p-3 border-2 border-amber-400/40 shadow-2xl">
                <p className="font-bold text-xl text-white">{formatBarrels(wellType.baseIncome)}</p>
                <p className="text-xs text-white/90 font-medium">в день</p>
              </div>
            </div>

            {/* Well name overlay */}
            <div className="absolute bottom-4 left-4 right-4">
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

            {/* Quick stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl border border-border/50">
                <p className="font-bold text-base">{formatBarrels(metrics.monthlyIncome)}</p>
                <p className="text-xs text-muted-foreground">в месяц</p>
              </div>
            </div>

            {/* Price display */}
            <div className="flex justify-between items-center px-2 py-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground text-sm">Цена:</span>
              <span className="text-2xl font-bold text-foreground">{formatOilCoins(wellType.price)}</span>
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
            ${rarityGlow}
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
                <h3 className="text-xl font-bold">{wellType.name}</h3>
                <Badge className={getRarityBadgeColor(wellType.rarity)}>
                  {wellType.rarity}
                </Badge>
              </div>

              {/* Detailed description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {wellType.description}
              </p>

              {/* Detailed stats */}
              <div className="space-y-3 bg-muted/30 rounded-xl p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доход в день:</span>
                  <span className="font-bold text-amber-400">{formatBarrels(wellType.baseIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доход в месяц:</span>
                  <span className="font-bold">{formatBarrels(metrics.monthlyIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Доход в год:</span>
                  <span className="font-bold">{formatBarrels(metrics.yearlyIncome)}</span>
                </div>
              </div>

              {/* Additional info */}
              <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                <p className="text-xs text-center">
                  💡 <span className="font-medium">Максимальный уровень: {wellType.maxLevel}</span>
                </p>
              </div>
            </div>

            {/* Purchase section */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground">Цена:</span>
                <span className="text-2xl font-bold text-foreground">{formatOilCoins(wellType.price)}</span>
              </div>
              
              {canAfford ? (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBuyWell(wellType);
                  }}
                  className="w-full py-6 text-lg font-bold transition-all duration-300 bg-gradient-to-r from-primary via-primary/90 to-primary hover:shadow-2xl hover:scale-105 active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Купить скважину
                </Button>
              ) : (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onTopUpClick) onTopUpClick();
                  }}
                  variant="outline"
                  className="w-full py-6 text-lg font-bold transition-all duration-300 border-2 border-primary/50 hover:border-primary hover:bg-primary/10 hover:scale-105"
                >
                  <Wallet className="h-5 w-5 mr-2" />
                  Пополнить баланс
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