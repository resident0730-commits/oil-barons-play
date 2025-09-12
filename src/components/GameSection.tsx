import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Lock } from 'lucide-react';

interface GameSectionProps {
  title: string;
  description: string;
  backgroundImage: string;
  icon: React.ReactNode;
  badge?: string;
  badgeVariant?: 'default' | 'secondary' | 'destructive' | 'outline';
  onClick: () => void;
  isLocked?: boolean;
  stats?: Array<{ label: string; value: string | number }>;
  className?: string;
}

export const GameSection: React.FC<GameSectionProps> = ({
  title,
  description,
  backgroundImage,
  icon,
  badge,
  badgeVariant = 'default',
  onClick,
  isLocked = false,
  stats = [],
  className = ''
}) => {
  return (
    <Card 
      className={`group relative overflow-hidden cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
        isLocked ? 'opacity-60' : ''
      } ${className}`}
      onClick={isLocked ? undefined : onClick}
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
      
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="text-center text-white">
            <Lock className="h-12 w-12 mx-auto mb-2 opacity-70" />
            <p className="text-sm">Разблокируется позже</p>
          </div>
        </div>
      )}

      <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between min-h-[300px]">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                {icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white drop-shadow-lg shadow-black">{title}</h3>
                <p className="text-sm text-white/90 drop-shadow-md shadow-black">{description}</p>
              </div>
            </div>
            {badge && (
              <Badge variant={badgeVariant} className="animate-pulse">
                {badge}
              </Badge>
            )}
          </div>

          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-xs text-white/80 drop-shadow-md">{stat.label}</p>
                  <p className="text-lg font-bold text-white drop-shadow-lg">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button */}
        {!isLocked && (
          <Button 
            className="w-full bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm border border-white/20 text-white hover:from-primary hover:to-accent transition-all duration-300 group-hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            Перейти
            <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};