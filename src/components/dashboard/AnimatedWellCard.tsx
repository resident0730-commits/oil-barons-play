import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { UserWell, wellTypes, UserBooster } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

// Import well images - используем максимально разные изображения
import starterWellArt from "@/assets/wells/starter-well-art.jpg";
import miniWellArt from "@/assets/wells/mini-well-art.jpg"; 
import mediumWellArt from "@/assets/wells/medium-well-art.jpg";
import premiumWellArt from "@/assets/wells/premium-well-art.jpg"; // Попробуем art версию снова
import superWellArt from "@/assets/wells/super-well-art.jpg";
import eliteWellArt from "@/assets/wells/elite-well-art.jpg";
import industrialWellArt from "@/assets/wells/industrial-well-art.jpg";  
import legendaryWellArt from "@/assets/wells/legendary-well-art.jpg";
import cosmicWellArt from "@/assets/wells/cosmic-well-art.jpg";

// Запасные изображения если art версии не работают
import premiumWellRegular from "@/assets/wells/premium-well.jpg";
import superWellRegular from "@/assets/wells/super-well.jpg";
import eliteWellRegular from "@/assets/wells/elite-well.jpg";
import industrialWellRegular from "@/assets/wells/industrial-well.jpg";
import legendaryWellRegular from "@/assets/wells/legendary-well.jpg";
import cosmicWellRegular from "@/assets/wells/cosmic-well.jpg";

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
    'Стартовая скважина': starterWellArt,       // starter-well-art.jpg ✅
    'Мини скважина': miniWellArt,               // mini-well-art.jpg ✅  
    'Средняя скважина': mediumWellArt,          // medium-well-art.jpg ✅
    'Премиум-скважина': premiumWellArt,         // premium-well-art.jpg (как в карточках!)
    'Супер скважина': superWellArt,             // super-well-art.jpg ✅
    'Элитная скважина': eliteWellArt,           // elite-well-art.jpg ✅
    'Промышленная скважина': industrialWellArt, // industrial-well-art.jpg ✅
    'Легендарная скважина': legendaryWellArt,   // legendary-well-art.jpg (как в карточках!)
    'Космическая скважина': cosmicWellArt,      // cosmic-well-art.jpg ✅
  };
  
  const selectedImage = avatarMap[wellType] || starterWellArt;
  
  // Отладочная информация в консоль
  console.log(`Well type: ${wellType}, Selected image: ${selectedImage}`);
  
  return selectedImage;
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
      {/* Well Avatar - УВЕЛИЧЕННЫЙ РАЗМЕР */}
      <div className="relative w-40 h-40 mx-auto">
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
        <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50 border-2 border-background z-20"></div>
        
        {/* Level badge */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
          <Badge className={`${getRarityColor(wellType.rarity)} text-sm px-3 py-1 shadow-lg font-bold`}>
            Ур. {well.level}
          </Badge>
        </div>
        
        {/* Booster indicator */}
        {hasActiveBoosters && (
          <div className="absolute -top-3 -right-3 z-20">
            <Badge className="bg-purple-500/90 text-purple-100 border-purple-400 text-xs p-2 rounded-full shadow-lg animate-bounce-in">
              <Sparkles className="h-4 w-4" />
            </Badge>
          </div>
        )}
        
        {/* Income overlay on hover */}
        <div className="absolute inset-0 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-15">
          <div className="text-center text-white">
            <div className="text-xl font-bold">
              {formatGameCurrency(Math.round(well.daily_income * boosterMultiplier))}
            </div>
            <div className="text-sm opacity-90">в день</div>
          </div>
        </div>
      </div>
      
      {/* УЛУЧШЕННЫЕ ПОДПИСИ */}
      <div className="text-center mt-4 space-y-1">
        <h3 className="text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 leading-tight">
          {wellType.name}
        </h3>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Badge variant="outline" className="text-xs bg-background/80 backdrop-blur-sm">
            {wellType.rarity}
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-primary font-semibold">
            {formatGameCurrency(Math.round(well.daily_income * boosterMultiplier))}/день
          </span>
        </div>
      </div>
      
      {/* Animated working effect */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse opacity-60"></div>
    </div>
  );
};