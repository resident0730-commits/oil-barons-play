import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { UserWell, wellTypes, UserBooster } from "@/hooks/useGameData";
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

interface AnimatedWellCardProps {
  well: UserWell;
  onShowDetails: (well: UserWell) => void;
  getWellIcon: (wellType: string) => JSX.Element;
  getRarityColor: (rarity: string) => string;
  boosters: UserBooster[];
  getActiveBoosterMultiplier: () => number;
}

// Mapping well types to their avatar images - ИСПОЛЬЗУЕМ ТЕ ЖЕ ИЗОБРАЖЕНИЯ ЧТО И В КАРТОЧКАХ
const getWellAvatar = (wellType: string) => {
  const avatarMap: { [key: string]: string } = {
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
  
  return avatarMap[wellType] || starterWellArt;
};

export const AnimatedWellCard = ({ 
  well, 
  onShowDetails, 
  getWellIcon, 
  getRarityColor,
  boosters,
  getActiveBoosterMultiplier
}: AnimatedWellCardProps) => {
  const { formatGameCurrency } = useCurrency();
  const wellType = wellTypes.find(wt => wt.name === well.well_type);
  const boosterMultiplier = getActiveBoosterMultiplier();
  const hasActiveBoosters = boosters.some(booster => 
    !booster.expires_at || new Date(booster.expires_at) > new Date()
  );

  if (!wellType) return null;

  const avatarSrc = getWellAvatar(well.well_type);

  return (
    <div 
      className="relative group cursor-pointer animate-fade-in hover-scale transition-all duration-500"
      onClick={() => onShowDetails(well)}
    >
      {/* Well Avatar - АДАПТИВНЫЙ РАЗМЕР */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 mx-auto">
        {/* Working status glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 to-primary/30 rounded-full animate-pulse blur-sm scale-110"></div>
        
        {/* Rarity border glow */}
        <div className={`absolute inset-0 rounded-full border-4 ${getRarityColor(wellType.rarity)} animate-glow-pulse scale-105`}></div>
        
        {/* Avatar image */}
        <img
          src={avatarSrc}
          alt={wellType.name}
          className="relative z-10 w-full h-full object-cover rounded-full border-4 border-background shadow-2xl group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Working indicator */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50 border-2 border-background z-20"></div>
        
        {/* Level badge */}
        <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 z-20">
          <Badge className={`${getRarityColor(wellType.rarity)} text-xs sm:text-sm px-2 sm:px-3 py-1 shadow-lg font-bold`}>
            Ур. {well.level}
          </Badge>
        </div>
        
        {/* Booster indicator */}
        {hasActiveBoosters && (
          <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20">
            <Badge className="bg-purple-500/90 text-purple-100 border-purple-400 text-xs p-1.5 sm:p-2 rounded-full shadow-lg animate-bounce-in">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
            </Badge>
          </div>
        )}
        
        {/* Income overlay on hover */}
        <div className="absolute inset-0 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-15">
          <div className="text-center text-white">
            <div className="text-sm sm:text-lg md:text-xl font-bold">
              {formatGameCurrency(Math.round(well.daily_income * boosterMultiplier))}
            </div>
            <div className="text-xs sm:text-sm opacity-90">в день</div>
          </div>
        </div>
      </div>
      
      {/* УЛУЧШЕННЫЕ ПОДПИСИ */}
      <div className="text-center mt-3 sm:mt-4 space-y-1">
        <h3 className="text-xs sm:text-sm md:text-base font-bold group-hover:scale-105 transition-transform duration-300 leading-tight px-1 drop-shadow-md" style={{ color: 'hsl(45, 100%, 65%)' }}>
          {wellType.name}
        </h3>
        <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
          <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm px-1.5 py-0.5 border-amber-500/30">
            {wellType.rarity}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span className="font-bold text-xs sm:text-sm" style={{ color: 'hsl(45, 100%, 65%)' }}>
            {formatGameCurrency(Math.round(well.daily_income * boosterMultiplier))}/день
          </span>
        </div>
      </div>
      
      {/* Animated working effect */}
      <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-60"></div>
    </div>
  );
};