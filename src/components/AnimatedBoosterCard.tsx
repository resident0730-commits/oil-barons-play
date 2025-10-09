import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, TrendingUp, Clock, Sparkles, X } from "lucide-react";
import { BoosterType } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";
import { AnimatedCounter } from "@/components/AnimatedCounter";

interface AnimatedBoosterCardProps {
  booster: BoosterType;
  currentLevel: number;
  cost: number;
  balance: number;
  isMaxLevel: boolean;
  isActive: boolean;
  onBuy: (booster: BoosterType) => void;
  onCancel: (booster: BoosterType) => void;
  expiresAt?: string | null;
}

// Get rarity colors
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300';
    case 'uncommon': return 'bg-green-500/20 text-green-300';
    case 'rare': return 'bg-blue-500/20 text-blue-300';
    case 'epic': return 'bg-purple-500/20 text-purple-300';
    case 'temporary': return 'bg-orange-500/20 text-orange-300';
    default: return 'bg-gray-500/20 text-gray-300';
  }
};

const getRarityText = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'Обычный';
    case 'uncommon': return 'Необычный';
    case 'rare': return 'Редкий';
    case 'epic': return 'Эпический';
    case 'temporary': return 'Временный';
    default: return 'Обычный';
  }
};

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'shadow-lg shadow-gray-500/50';
    case 'uncommon': return 'shadow-lg shadow-green-500/50';
    case 'rare': return 'shadow-lg shadow-blue-500/50';
    case 'epic': return 'shadow-lg shadow-purple-500/50';
    case 'temporary': return 'shadow-lg shadow-orange-500/50';
    default: return 'shadow-lg';
  }
};

export const AnimatedBoosterCard = ({
  booster,
  currentLevel,
  cost,
  balance,
  isMaxLevel,
  isActive,
  onBuy,
  onCancel,
  expiresAt
}: AnimatedBoosterCardProps) => {
  const { formatGameCurrency } = useCurrency();
  const canAfford = balance >= cost;
  const progress = (currentLevel / booster.maxLevel) * 100;

  // Calculate boost percentage for animated counter
  const boostPercent = parseInt(booster.effect.match(/\d+/)?.[0] || "0");

  return (
    <Card 
      className={`
        group relative overflow-hidden
        transition-all duration-700 ease-out
        hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]
        hover:scale-[1.02]
        ${isActive ? 'ring-2 ring-primary shadow-primary/50' : ''}
        ${getRarityGlow(booster.rarity)}
        perspective-1000
      `}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.7s ease-out'
      }}
      onMouseMove={(e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      }}
    >
      {/* Oil bubbles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full animate-bubble"
            style={{
              left: `${20 + i * 15}%`,
              bottom: '-10px',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.3}s`
            }}
          />
        ))}
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
      )}

      <CardContent className="p-6 relative">
        {/* Large booster image - 60% of card */}
        <div className="relative mb-6 h-56 flex items-center justify-center">
          {/* Glow effect behind image */}
          <div className={`
            absolute inset-0 blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-500
            ${booster.rarity === 'epic' ? 'bg-purple-500' : ''}
            ${booster.rarity === 'rare' ? 'bg-blue-500' : ''}
            ${booster.rarity === 'uncommon' ? 'bg-green-500' : ''}
            ${booster.rarity === 'temporary' ? 'bg-orange-500' : ''}
          `}></div>
          
          <img 
            src={booster.icon} 
            alt={booster.name}
            className="relative z-10 w-48 h-48 object-contain group-hover:scale-110 transition-transform duration-700 ease-out drop-shadow-2xl"
          />
          
          {/* Rarity badge */}
          <Badge className={`absolute top-2 right-2 z-20 ${getRarityColor(booster.rarity)}`}>
            <Sparkles className="h-3 w-3 mr-1" />
            {getRarityText(booster.rarity)}
          </Badge>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold mb-2">{booster.name}</h3>
          <p className="text-sm text-muted-foreground">{booster.description}</p>
        </div>

        {/* Animated stats with golden glow */}
        <div className="space-y-3 mb-6">
          {/* ROI/Effect stat with pulsing golden glow */}
          <div className="relative p-4 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-yellow-500/10 rounded-lg border border-yellow-500/30 overflow-hidden">
            {/* Pulsing golden glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-pulse"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-500/20 rounded-full animate-pulse">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                </div>
                <span className="text-sm font-medium">Эффект</span>
              </div>
              <div className="text-2xl font-bold text-yellow-500">
                +<AnimatedCounter end={boostPercent} duration={1500} suffix="%" />
              </div>
            </div>
          </div>

          {/* Duration for temporary boosters */}
          {booster.duration && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
              <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm">Действует 24 часа</span>
            </div>
          )}

          {/* Expiration timer */}
          {isActive && expiresAt && (
            <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-500">Активен до:</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(expiresAt).toLocaleString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Level progress for permanent boosters */}
        {!booster.duration && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Уровень</span>
              <span className="font-bold">
                <AnimatedCounter end={currentLevel} duration={800} /> / {booster.maxLevel}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Price with golden pulsing glow */}
        {!isMaxLevel && (
          <div className="relative mb-4 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg border border-primary/30 overflow-hidden">
            {/* Pulsing glow around price */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse"></div>
            
            <div className="relative flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {currentLevel > 0 ? 'Улучшить' : 'Цена'}:
              </span>
              <span className="text-2xl font-bold">{formatGameCurrency(cost)}</span>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {!isMaxLevel && (
            <Button
              onClick={() => onBuy(booster)}
              disabled={!canAfford}
              className={`
                flex-1 transition-all duration-300
                ${canAfford
                  ? 'bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {currentLevel > 0 ? 'Улучшить' : 'Купить'}
            </Button>
          )}

          {isMaxLevel && (
            <div className="flex-1 p-3 bg-gradient-to-r from-green-500/20 to-green-500/10 rounded-lg border border-green-500/30 text-center">
              <span className="text-sm font-medium text-green-500">Максимальный уровень</span>
            </div>
          )}

          {currentLevel > 0 && !booster.duration && (
            <Button
              onClick={() => onCancel(booster)}
              variant="outline"
              size="icon"
              className="hover:bg-destructive hover:text-destructive-foreground"
              title="Отменить (возврат 50%)"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {!canAfford && !isMaxLevel && (
          <p className="text-xs text-center text-destructive mt-2">
            Недостаточно средств
          </p>
        )}
      </CardContent>
    </Card>
  );
};
