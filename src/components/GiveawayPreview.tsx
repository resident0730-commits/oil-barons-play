import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Smartphone, Gamepad2, Gift, Clock, Star, Sparkles, TrendingUp, Zap } from 'lucide-react';

const GiveawayPreview: React.FC = () => {
  // Дата окончания розыгрыша
  const endDate = new Date('2025-10-18T23:59:59');
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));

  // Функция для склонения дней
  const getDaysText = (days: number) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  const prizes = [
    {
      place: '🥇 1-10 место',
      prize: 'iPhone 17 Pro',
      value: '150 000₽',
      icon: <Smartphone className="h-7 w-7 text-white" />,
      gradient: 'from-amber-400 via-yellow-500 to-orange-500',
      bgGlow: 'shadow-amber-500/30',
      borderGlow: 'border-primary/50'
    },
    {
      place: '🥈 11-20 место', 
      prize: 'PlayStation 5',
      value: '60 000₽',
      icon: <Gamepad2 className="h-7 w-7 text-white" />,
      gradient: 'from-blue-400 via-cyan-500 to-blue-600',
      bgGlow: 'shadow-blue-500/30',
      borderGlow: 'border-blue-400/50'
    },
    {
      place: '🥉 21-100 место',
      prize: 'Премиум призы',
      value: 'до 20 000₽',
      icon: <Gift className="h-7 w-7 text-white" />,
      gradient: 'from-purple-400 via-violet-500 to-purple-600',
      bgGlow: 'shadow-purple-500/30',
      borderGlow: 'border-purple-400/50'
    }
  ];

  return (
    <section className="relative overflow-hidden py-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Card className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group animate-fade-in rounded-none border-l-0 border-r-0">
          {/* Animated border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-30 animate-glow-pulse -z-10 blur-sm"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
          
          <CardContent className="p-4 md:p-6 relative">
            {/* Заголовок */}
            <div className="text-center space-y-4 mb-6">
              <div className="flex items-center justify-center space-x-3 animate-bounce-in">
                <div className="relative">
                  <Crown className="h-8 w-8 text-primary animate-glow-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent font-playfair tracking-wide">
                    ПРЕМИУМ РОЗЫГРЫШ
                  </h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
                    <p className="text-base md:text-lg text-slate-300 font-semibold tracking-wide">
                      🎁 Призы на миллионы рублей! 🎁
                    </p>
                    <Sparkles className="h-4 w-4 text-primary animate-glow-pulse" />
                  </div>
                </div>
                <div className="relative">
                  <Crown className="h-8 w-8 text-primary animate-glow-pulse" />
                </div>
              </div>

              {/* Таймер */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 rounded-xl blur-md"></div>
                <div className="relative bg-gradient-to-r from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl p-4 rounded-xl border-2 border-primary/40">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <div className="relative">
                      <Clock className="h-6 w-6 text-primary animate-glow-pulse" />
                    </div>
                    <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      ⏰ {daysLeft} {getDaysText(daysLeft)} до розыгрыша! ⏰
                    </span>
                    <div className="relative">
                      <Clock className="h-6 w-6 text-primary animate-glow-pulse" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-400 font-semibold">
                    🗓️ Розыгрыш состоится 18 октября 2025 года
                  </p>
                </div>
              </div>
            </div>

            {/* Призы */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {prizes.map((prize, index) => (
                <div 
                  key={index} 
                  className={`relative group hover-scale animate-fade-in bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-lg border-2 ${prize.borderGlow} p-3 ${prize.bgGlow} shadow-2xl transition-all duration-500 hover:shadow-3xl`}
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  {/* Background glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${prize.gradient} opacity-10 rounded-lg blur-xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className={`text-xs px-2 py-1 bg-gradient-to-r ${prize.gradient} text-white border-0 font-bold shadow-lg`}>
                        {prize.place}
                      </Badge>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${prize.gradient} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                        {prize.icon}
                      </div>
                    </div>
                    
                    <div className="text-center space-y-1">
                      <h4 className="text-base font-bold text-white">{prize.prize}</h4>
                      <p className={`text-sm font-semibold bg-gradient-to-r ${prize.gradient} bg-clip-text text-transparent`}>
                        {prize.value}
                      </p>
                      <div className="flex justify-center">
                        {[...Array(3-index)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-primary fill-primary ml-1 animate-pulse" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Условия и CTA */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg blur-md"></div>
                <div className="relative bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-4 rounded-lg border border-primary/30">
                  <h3 className="text-lg font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    ⚡ Как участвовать ⚡
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center justify-center space-x-2 p-2 bg-slate-700/50 rounded-lg border border-primary/20">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-white font-medium text-sm">💎 Купи Премиум-скважину</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 p-2 bg-slate-700/50 rounded-lg border border-accent/20">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="text-white font-medium text-sm">📈 Достигни дохода 2000₽/день</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button 
                  asChild
                  size="lg" 
                  className="relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary hover:from-accent hover:via-primary hover:to-accent text-white font-bold px-6 py-3 text-sm rounded-lg hover-scale shadow-2xl border-2 border-primary/30 transition-all duration-500"
                >
                  <Link to="/auth">
                    <span className="relative z-10 flex items-center space-x-2">
                      <span>🎯</span>
                      <span>Участвовать в розыгрыше</span>
                      <Sparkles className="h-3 w-3 animate-spin" />
                    </span>
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-2 border-primary/60 text-primary hover:bg-primary/20 px-6 py-3 hover-scale bg-slate-800/80 backdrop-blur-xl rounded-lg text-sm font-semibold transition-all duration-500"
                >
                  <Link to="/dashboard?section=giveaway">
                    📋 Подробнее о розыгрыше
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
    </section>
  );
};

export default GiveawayPreview;