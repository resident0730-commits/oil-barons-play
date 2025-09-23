import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Smartphone, Gamepad2, Gift, Clock, Star, Sparkles, TrendingUp } from 'lucide-react';

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
      place: '1-10 место',
      prize: 'iPhone 17 Pro',
      icon: <Smartphone className="h-6 w-6" />,
      color: 'text-yellow-500'
    },
    {
      place: '11-20 место',
      prize: 'PlayStation 5',
      icon: <Gamepad2 className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      place: '21-100 место',
      prize: 'Премиум призы',
      icon: <Gift className="h-6 w-6" />,
      color: 'text-purple-500'
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-6 py-16 relative">
        <Card className="gradient-oil border-primary/40 shadow-gold overflow-hidden relative group animate-fade-in">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
          
          <CardContent className="p-8 md:p-12 relative">
            {/* Заголовок */}
            <div className="text-center space-y-6 mb-8">
              <div className="flex items-center justify-center space-x-4 animate-bounce-in">
                <Crown className="h-12 w-12 text-primary animate-gold-glow" />
                <div>
                  <h2 className="text-4xl md:text-6xl font-bold gradient-gold bg-clip-text text-transparent font-playfair">
                    ПРЕМИУМ РОЗЫГРЫШ
                  </h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <Sparkles className="h-4 w-4 text-primary animate-gold-glow" />
                    <p className="text-lg md:text-xl text-muted-foreground font-semibold">
                      Призы на миллионы рублей!
                    </p>
                    <Sparkles className="h-4 w-4 text-primary animate-gold-glow" />
                  </div>
                </div>
                <Crown className="h-12 w-12 text-primary animate-gold-glow" />
              </div>

              {/* Таймер */}
              <div className="bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20 p-6 rounded-2xl border border-primary/40 animate-glow-pulse">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <Clock className="h-8 w-8 text-primary animate-gold-glow" />
                  <span className="text-2xl md:text-3xl font-bold text-primary">
                    {daysLeft} {getDaysText(daysLeft)} до розыгрыша!
                  </span>
                  <Clock className="h-8 w-8 text-primary animate-gold-glow" />
                </div>
                <p className="text-sm text-muted-foreground font-semibold">
                  📅 Розыгрыш состоится 18 октября 2025 года
                </p>
              </div>
            </div>

            {/* Призы */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {prizes.map((prize, index) => (
                <div 
                  key={index} 
                  className="bg-gradient-to-br from-card/80 to-transparent p-6 rounded-xl border border-primary/20 hover-scale group/prize animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-center space-x-4 mb-3">
                    <div className={`${prize.color} p-3 rounded-full bg-black/20 animate-glow-pulse`}>
                      {prize.icon}
                    </div>
                    <div>
                      <Badge className="bg-primary/20 text-primary border-primary/40 mb-2">
                        {prize.place}
                      </Badge>
                      <h4 className="font-bold text-lg">{prize.prize}</h4>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    {[...Array(3-index)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-primary ml-1" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Условия и CTA */}
            <div className="text-center space-y-6">
              <div className="bg-gradient-to-r from-muted/20 to-muted/10 p-6 rounded-xl border border-muted/30">
                <h3 className="text-xl font-bold mb-3 text-primary">Как участвовать:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span>Купи Премиум-скважину</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    <span>Достигни дохода 2000₽/день</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  asChild
                  size="lg" 
                  className="bg-gradient-to-r from-primary via-accent to-primary hover:from-accent hover:via-primary hover:to-accent text-white font-bold px-8 py-4 text-lg animate-glow-pulse hover-scale shadow-gold border border-primary/30"
                >
                  <Link to="/auth">
                    🎯 Участвовать в розыгрыше
                  </Link>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg"
                  className="border-primary/60 text-primary hover:bg-primary/20 px-8 py-4 hover-scale bg-background/80"
                >
                  <Link to="/dashboard?section=giveaway">
                    📋 Подробнее о розыгрыше
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default GiveawayPreview;