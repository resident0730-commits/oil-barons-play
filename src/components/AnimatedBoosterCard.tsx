import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShoppingCart, TrendingUp, Clock, Sparkles, X } from "lucide-react";
import { BoosterType } from "@/hooks/useGameData";
import { useCurrency } from "@/hooks/useCurrency";

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

  return (
    <Card 
      className={`
        group relative overflow-hidden
        transition-all duration-500
        hover:shadow-2xl hover:-translate-y-2
        ${isActive ? 'ring-2 ring-primary shadow-primary/50' : ''}
        ${getRarityGlow(booster.rarity)}
      `}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
      )}

      <CardContent className="p-6 relative">
        {/* Header with image and rarity */}
        <div className="flex flex-col items-center space-y-4 mb-4">
          <div className="relative">
            <div className={`
              absolute inset-0 blur-xl opacity-50 
              ${booster.rarity === 'epic' ? 'bg-purple-500' : ''}
              ${booster.rarity === 'rare' ? 'bg-blue-500' : ''}
              ${booster.rarity === 'uncommon' ? 'bg-green-500' : ''}
              ${booster.rarity === 'temporary' ? 'bg-orange-500' : ''}
              group-hover:opacity-75 transition-opacity
            `}></div>
            <img 
              src={booster.icon} 
              alt={booster.name}
              className="w-32 h-32 rounded-xl object-cover border-2 border-primary/30 relative z-10 group-hover:scale-110 transition-transform duration-500"
            />
            <Badge className={`absolute -top-2 -right-2 z-20 ${getRarityColor(booster.rarity)}`}>
              <Sparkles className="h-3 w-3 mr-1" />
              {getRarityText(booster.rarity)}
            </Badge>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold mb-1">{booster.name}</h3>
            <p className="text-sm text-muted-foreground">{booster.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
            <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm font-medium">{booster.effect}</span>
          </div>

          {booster.duration && (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
              <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm">Действует 24 часа</span>
            </div>
          )}

          {/* Expiration timer for active temporary boosters */}
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
              <span className="font-bold">{currentLevel} / {booster.maxLevel}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Price and actions */}
        <div className="space-y-3">
          {!isMaxLevel && (
            <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {currentLevel > 0 ? 'Улучшить' : 'Цена'}:
              </span>
              <span className="text-lg font-bold">{formatGameCurrency(cost)}</span>
            </div>
          )}

          <div className="flex gap-2">
            {!isMaxLevel && (
              <Button
                onClick={() => onBuy(booster)}
                disabled={!canAfford}
                className={`
                  flex-1 transition-all duration-300
                  ${canAfford
                    ? 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:scale-105'
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
                <span className="text-sm font-medium text-green-600">Максимальный уровень</span>
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
            <p className="text-xs text-center text-destructive">
              Недостаточно средств
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
