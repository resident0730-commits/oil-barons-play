import { useState } from "react";
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
  const [isFlipped, setIsFlipped] = useState(false);
  const { formatBarrels, formatOilCoins } = useCurrency();
  const canAfford = profile.oilcoin_balance >= wellType.price;
  const metrics = calculateProfitMetrics(wellType.baseIncome, wellType.price);
  const wellImage = getWellImage(wellType.name);
  const rarityGlow = getRarityGlowClass(wellType.rarity);
  
  const isLegendaryOrHigher = wellType.rarity === 'legendary' || wellType.rarity === 'mythic';

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="game-card-flip" onClick={handleCardClick}>
      <div className={`game-card-inner ${isFlipped ? 'flipped' : ''}`}>
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
          <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
            <img
              src={wellImage}
              alt={wellType.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            
            {/* Floating rarity badge */}
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 floating-badge">
              <Badge 
                className={`
                  ${getRarityBadgeColor(wellType.rarity)} 
                  shadow-2xl backdrop-blur-sm border-2 border-white/30
                  text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1
                `}
              >
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                <span className="truncate">{wellType.rarity}</span>
              </Badge>
            </div>

            {/* Daily income badge */}
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
              <div className="bg-gradient-to-br from-amber-500/90 to-amber-600/70 backdrop-blur-md rounded-lg sm:rounded-xl p-2 sm:p-3 border-2 border-amber-400/40 shadow-2xl">
                <p className="font-bold text-base sm:text-lg md:text-xl text-white truncate">{formatBarrels(wellType.baseIncome)}</p>
                <p className="text-xs text-white/90 font-medium">в день</p>
              </div>
            </div>

            {/* Well name overlay */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-2xl truncate">
                {wellType.name}
              </h3>
            </div>
          </div>

          {/* Content section */}
          <CardContent className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {wellType.description}
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              <div className="text-center p-2 sm:p-3 bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl border border-border/50">
                <p className="font-bold text-sm sm:text-base truncate">{formatBarrels(metrics.monthlyIncome)}</p>
                <p className="text-xs text-muted-foreground">в месяц</p>
              </div>
            </div>

            {/* Price display */}
            <div className="flex justify-between items-center px-2 py-2 sm:py-3 bg-muted/30 rounded-lg">
              <span className="text-muted-foreground text-xs sm:text-sm">Цена:</span>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{formatOilCoins(wellType.price)}</span>
            </div>

            {/* Tips section */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2">
              <p className="text-xs font-medium text-primary">Совет:</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {wellType.name === 'Мини-скважина' && 'Идеальный старт для новичка! Купите 3-5 штук и прокачивайте их параллельно для стабильного роста дохода.'}
                {wellType.name === 'Стартовая скважина' && 'Лучшее соотношение цена/доход для старта. Прокачайте до 5 уровня перед покупкой следующей скважины.'}
                {wellType.name === 'Средняя скважина' && 'Золотая середина! Автоматизация процессов снижает время на управление. Отлично подходит для пассивного дохода.'}
                {wellType.name === 'Промышленная скважина' && 'Серьёзное вложение для серьёзного дохода. Активируйте бустер "Турбо-ускорение" для максимального эффекта!'}
                {wellType.name === 'Супер-скважина' && 'Высокая отдача при регулярном улучшении. Комбинируйте с бустером "Геологоразведка" для бонуса +25% к доходу!'}
                {wellType.name === 'Премиум-скважина' && 'AI-оптимизация делает эту скважину очень эффективной. Приоритет прокачки — каждый уровень даёт ощутимый прирост!'}
                {wellType.name === 'Элитная скважина' && 'Статусная скважина для настоящих магнатов. Максимальный уровень откроет доступ к эксклюзивным бонусам!'}
                {wellType.name === 'Легендарная скважина' && 'Нанотехнологии обеспечивают стабильность дохода. Используйте бустер "Бригада рабочих" для ускорения прокачки!'}
                {wellType.name === 'Космическая скважина' && 'Вершина технологий! Каждый уровень значительно увеличивает доход. Инвестируйте в прокачку в первую очередь!'}
              </p>
            </div>

            {/* Click hint */}
            <p className="text-center text-xs text-muted-foreground/70 italic">
              Нажмите для деталей
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
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold truncate">{wellType.name}</h3>
                  <Badge className={`${getRarityBadgeColor(wellType.rarity)} text-xs whitespace-nowrap flex-shrink-0`}>
                    {wellType.rarity}
                  </Badge>
                </div>

                {/* Detailed description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {wellType.description}
                </p>

                {/* Detailed stats */}
                <div className="space-y-2 sm:space-y-3 bg-muted/30 rounded-xl p-3 sm:p-4">
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в день:</span>
                    <span className="font-bold text-amber-400 truncate">{formatBarrels(wellType.baseIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в месяц:</span>
                    <span className="font-bold truncate">{formatBarrels(metrics.monthlyIncome)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="text-muted-foreground">Доход в год:</span>
                    <span className="font-bold truncate">{formatBarrels(metrics.yearlyIncome)}</span>
                  </div>
                </div>

                {/* Additional info */}
                <div className="bg-primary/10 rounded-lg p-2 sm:p-3 border border-primary/20">
                  <p className="text-xs text-center">
                    💡 <span className="font-medium">Максимальный уровень: {wellType.maxLevel}</span>
                  </p>
                </div>
              </div>

              {/* Purchase section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center text-sm sm:text-base md:text-lg gap-2">
                  <span className="text-muted-foreground">Цена:</span>
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">{formatOilCoins(wellType.price)}</span>
                </div>
                
                {canAfford ? (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBuyWell(wellType);
                    }}
                    className="w-full py-4 sm:py-5 md:py-6 text-sm sm:text-base md:text-lg font-bold transition-all duration-300 bg-gradient-to-r from-primary via-primary/90 to-primary hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="truncate">Купить скважину</span>
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