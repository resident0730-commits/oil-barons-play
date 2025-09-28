import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePlayerLimit } from "@/hooks/usePlayerLimit";
import { Crown, Users, Star, Clock, Zap, Sparkles } from "lucide-react";

export const ExclusiveAccessBanner = () => {
  const { currentPlayers, maxPlayers, progressPercentage, spotsLeft, isLimitReached, loading } = usePlayerLimit();

  if (loading) {
    return (
      <section className="relative overflow-hidden py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-6 relative">
          <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden animate-pulse">
            <CardContent className="p-8 text-center">
              <div className="h-8 bg-primary/20 rounded mb-4"></div>
              <div className="h-4 bg-muted/40 rounded w-3/4 mx-auto"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-6 relative">
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group animate-fade-in">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-30 animate-glow-pulse -z-10 blur-sm"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4">
              <Crown className="h-8 w-8 text-primary rotate-12 animate-gold-glow" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Star className="h-6 w-6 text-accent -rotate-12 animate-pulse" />
            </div>
          </div>

          <CardContent className="p-4 md:p-6 relative z-10">
            <div className="text-center space-y-4">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Badge className="bg-gradient-to-r from-primary via-accent to-primary text-white border-0 px-3 py-1 text-sm font-bold shadow-xl">
                    <Crown className="w-3 h-3 mr-1 animate-gold-glow" />
                    👑 ЭКСКЛЮЗИВНЫЙ ДОСТУП
                  </Badge>
                  {!isLimitReached && (
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 px-2 py-1 animate-pulse text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      ⏰ Ограниченное время
                    </Badge>
                  )}
                </div>
                
                <div className="relative">
                  <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent font-playfair tracking-wide">
                    {isLimitReached ? "🚫 Набор закрыт!" : "Эксклюзивный доступ"}
                  </h3>
                  <div className="absolute -top-2 -right-2">
                    <Zap className="h-6 w-6 text-accent animate-bounce" />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-md"></div>
                  <p className="relative text-slate-300 text-sm md:text-base max-w-lg mx-auto leading-relaxed p-3 bg-slate-800/50 backdrop-blur-xl rounded-lg border border-primary/20">
                    {isLimitReached 
                      ? "🔒 Достигнут лимит в 10,000 игроков. Следите за обновлениями о новых наборах!"
                      : `🎯 Присоединяйтесь к элитному сообществу нефтяных магнатов. Всего ${spotsLeft.toLocaleString()} мест до закрытия!`
                    }
                  </p>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg blur-md"></div>
                  <div className="relative bg-slate-800/70 backdrop-blur-xl p-3 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-center gap-4 text-sm mb-2">
                      <div className="flex items-center gap-2 text-primary">
                        <Users className="w-4 h-4" />
                        <span className="font-bold">{currentPlayers.toLocaleString()}</span>
                      </div>
                      <div className="text-slate-400">/</div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Crown className="w-4 h-4 text-accent animate-gold-glow" />
                        <span className="font-semibold">{maxPlayers.toLocaleString()} мест</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <Progress 
                          value={progressPercentage} 
                          className="h-2 bg-slate-700/50 rounded-full overflow-hidden shadow-inner"
                        />
                        <div 
                          className="absolute inset-0 h-2 bg-gradient-to-r from-primary via-accent to-primary rounded-full animate-glow-pulse"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="text-slate-400 font-semibold text-xs">
                        📊 {progressPercentage.toFixed(1)}% заполнено
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap justify-center gap-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <Badge className="relative bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-primary/40 text-primary px-6 py-3 text-sm font-semibold hover-scale">
                    <Star className="w-4 h-4 mr-2 animate-pulse" />
                    💎 Премиум опыт
                  </Badge>
                </div>
                
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                  <Badge className="relative bg-gradient-to-r from-slate-700 to-slate-800 border-2 border-accent/40 text-accent px-6 py-3 text-sm font-semibold hover-scale">
                    <Users className="w-4 h-4 mr-2 animate-pulse" />
                    👥 Элитное сообщество
                  </Badge>
                </div>
                
                {!isLimitReached && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <Badge className="relative bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 px-6 py-3 text-sm font-semibold animate-pulse hover-scale shadow-lg">
                      <Clock className="w-4 h-4 mr-2" />
                      🔥 Спешите!
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};