import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePlayerLimit } from "@/hooks/usePlayerLimit";
import { Crown, Users, Star, Clock } from "lucide-react";

export const ExclusiveAccessBanner = () => {
  const { currentPlayers, maxPlayers, progressPercentage, spotsLeft, isLimitReached, loading } = usePlayerLimit();

  if (loading) {
    return (
      <Card className="relative overflow-hidden backdrop-blur-md bg-card/80 border-primary/30 shadow-luxury animate-pulse">
        <CardContent className="p-6 text-center">
          <div className="h-8 bg-primary/20 rounded mb-4"></div>
          <div className="h-4 bg-muted/40 rounded w-3/4 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden backdrop-blur-md bg-card/80 border-primary/30 shadow-luxury animate-fade-in">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 gradient-gold"></div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 right-4">
          <Crown className="h-16 w-16 text-primary rotate-12" />
        </div>
        <div className="absolute bottom-4 left-4">
          <Star className="h-12 w-12 text-accent -rotate-12" />
        </div>
      </div>

      <CardContent className="p-6 relative z-10">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30 px-4 py-2">
                <Crown className="w-4 h-4 mr-2" />
                ЭКСКЛЮЗИВНЫЙ ДОСТУП
              </Badge>
              {!isLimitReached && (
                <Badge variant="outline" className="border-accent/50 text-accent">
                  <Clock className="w-3 h-3 mr-1" />
                  Ограниченное время
                </Badge>
              )}
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              {isLimitReached ? "Набор закрыт!" : "Эксклюзивный доступ"}
            </h3>
            
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {isLimitReached 
                ? "Достигнут лимит в 10,000 игроков. Следите за обновлениями о новых наборах!"
                : `Присоединяйтесь к элитному сообществу нефтяных магнатов. Всего ${spotsLeft.toLocaleString()} мест до закрытия!`
              }
            </p>
          </div>

          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{currentPlayers.toLocaleString()}</span>
              </div>
              <div className="text-muted-foreground">/</div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Crown className="w-4 h-4" />
                <span>{maxPlayers.toLocaleString()} мест</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={progressPercentage} 
                className="h-3 bg-muted/30"
                style={{
                  background: `linear-gradient(90deg, 
                    hsl(var(--primary)) 0%, 
                    hsl(var(--accent)) 50%, 
                    hsl(var(--primary)) 100%)`
                }}
              />
              <div className="text-xs text-muted-foreground">
                {progressPercentage.toFixed(1)}% заполнено
              </div>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary/80">
              <Star className="w-3 h-3 mr-1" />
              Премиум опыт
            </Badge>
            <Badge variant="outline" className="border-accent/30 text-accent/80">
              <Users className="w-3 h-3 mr-1" />
              Элитное сообщество
            </Badge>
            {!isLimitReached && (
              <Badge variant="outline" className="border-destructive/30 text-destructive/80 animate-pulse">
                <Clock className="w-3 h-3 mr-1" />
                Спешите!
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};