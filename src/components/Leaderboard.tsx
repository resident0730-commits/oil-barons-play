import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown, Zap } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Skeleton } from '@/components/ui/skeleton';

const getRankIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Trophy className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Award className="h-4 w-4 text-muted-foreground" />;
  }
};

const getRankBadgeVariant = (position: number) => {
  if (position === 1) return "default";
  if (position === 2) return "secondary";
  if (position === 3) return "outline";
  return "secondary";
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const Leaderboard: React.FC<{ maxEntries?: number }> = ({ maxEntries = 10 }) => {
  const { leaderboard, loading } = useLeaderboard();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Рейтинг игроков
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const topPlayers = leaderboard.slice(0, maxEntries);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Рейтинг игроков
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topPlayers.map((player, index) => {
          const position = index + 1;
          return (
            <div
              key={`${player.nickname}-${index}`}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                position <= 3 
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20' 
                  : 'bg-card hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Badge variant={getRankBadgeVariant(position)} className="flex items-center gap-1 min-w-[2rem] justify-center">
                  {getRankIcon(position)}
                  #{position}
                </Badge>
                <div className="flex flex-col">
                  <span className={`font-medium ${position <= 3 ? 'text-primary' : ''}`}>
                    {player.nickname}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    <span>{formatCurrency(Number(player.daily_income))}/день</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${position <= 3 ? 'text-primary' : ''}`}>
                  {formatCurrency(Number(player.balance))}
                </div>
              </div>
            </div>
          );
        })}
        
        {topPlayers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Рейтинг пока пуст</p>
            <p className="text-sm">Станьте первым!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};