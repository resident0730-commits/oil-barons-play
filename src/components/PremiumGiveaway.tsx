import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Smartphone, Gamepad2, Headphones, Gift, Calendar, Crown, Star, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCurrency } from '@/hooks/useCurrency';

interface PremiumGiveawayProps {
  profile: any;
  wells: any[];
}

const PremiumGiveaway: React.FC<PremiumGiveawayProps> = ({ profile, wells }) => {
  const { formatGameCurrency } = useCurrency();
  const navigate = useNavigate();
  
  // Дата окончания розыгрыша
  const endDate = new Date('2025-10-18T23:59:59');
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));

  // Проверяем наличие премиум-скважины
  const hasPremiumWell = wells.some(well => well.well_type === 'Премиум-скважина');
  const dailyIncome = profile?.daily_income || 0;
  const isEligible = hasPremiumWell && dailyIncome >= 2000; // Изменено с > на >=

  // Динамический счетчик участников
  const [totalParticipants, setTotalParticipants] = useState(923);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalParticipants(prev => prev + Math.floor(Math.random() * 15) + 5); // Прибавляет 5-19 участников
    }, Math.random() * 30000 + 15000); // Каждые 15-45 секунд
    
    return () => clearInterval(interval);
  }, []);

  // Функция для склонения дней
  const getDaysText = (days: number) => {
    if (days % 10 === 1 && days % 100 !== 11) return 'день';
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) return 'дня';
    return 'дней';
  };

  const prizes = [
    {
      places: '1-10 место',
      prize: 'iPhone 17 Pro (256GB/512GB) - Cosmic Orange, Deep Blue, Silver',
      description: 'Новейший iPhone 17 Pro с инновационным дизайном и мощным чипом A19 Pro',
      icon: <Smartphone className="h-8 w-8" />,
      color: 'text-yellow-500',
      bgColor: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      places: '11-20 место',
      prize: 'Sony PlayStation 5 Digital/Standard Edition',
      description: 'Игровая консоль нового поколения с поддержкой 4K и эксклюзивными играми',
      icon: <Gamepad2 className="h-8 w-8" />,
      color: 'text-blue-500',
      bgColor: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      places: '21-50 место',
      prize: 'iPhone 15/14 Pro (128GB-512GB) или AirPods Pro 2',
      description: 'iPhone 15 Pro: Black/White/Blue/Natural Titanium | iPhone 14 Pro: Space Black/Silver/Gold/Deep Purple',
      icon: <Headphones className="h-8 w-8" />,
      color: 'text-purple-500',
      bgColor: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      places: '51-100 место',
      prize: 'Сертификаты: Золотое яблоко, Летуаль, МВидео',
      description: 'Премиум сертификаты номиналом 15-30 тысяч рублей в лучшие магазины',
      icon: <Gift className="h-8 w-8" />,
      color: 'text-green-500',
      bgColor: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30'
    }
  ];

  const getStatusBadge = () => {
    if (!hasPremiumWell) {
      return (
        <Badge variant="secondary" className="bg-red-500/20 text-red-300 border-red-500/40 text-lg py-2 px-4 animate-glow-pulse">
          <AlertCircle className="h-4 w-4 mr-2" />
          ❌ Нужна Премиум-скважина
        </Badge>
      );
    }
    
    if (dailyIncome < 2000) {
      return (
        <Badge variant="secondary" className="bg-primary/30 text-primary-foreground border-primary/50 text-lg py-2 px-4 animate-glow-pulse">
          <AlertCircle className="h-4 w-4 mr-2" />
          ⚠️ Доход: {formatGameCurrency(dailyIncome)}/день (нужно ≥2000₽)
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-green-500/30 text-green-200 border-green-400/50 text-lg py-2 px-4 animate-glow-pulse">
        <CheckCircle className="h-4 w-4 mr-2" />
        🎉 Участвуете в розыгрыше!
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Заголовок */}
      <div className="text-center space-y-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl"></div>
        <div className="relative flex items-center justify-center space-x-3 animate-bounce-in">
          <Crown className="h-12 w-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-playfair">
            🏆 ПРЕМИУМ РОЗЫГРЫШ 🏆
          </h1>
          <Crown className="h-12 w-12 text-primary" />
        </div>
        <div className="bg-card/50 border border-primary/30 p-6 rounded-2xl shadow-lg backdrop-blur-sm animate-scale-in">
          <p className="text-xl font-semibold text-foreground max-w-3xl mx-auto leading-relaxed">
            💎 Купи <span className="text-primary font-bold">Премиум-скважину</span>, достигни дохода более <span className="text-primary font-bold">2000₽/день</span> и участвуй в розыгрыше премиальных призов! 💎
          </p>
        </div>
      </div>

      {/* Статус участия */}
      <Card className="bg-card/50 border border-primary/20 shadow-lg overflow-hidden relative animate-scale-in hover-scale backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <CardHeader className="text-center relative">
          <CardTitle className="flex items-center justify-center space-x-3 text-2xl text-foreground">
            <Star className="h-8 w-8 text-primary" />
            <span>Ваш статус участия</span>
            <Star className="h-8 w-8 text-primary" />
          </CardTitle>
          <CardDescription className="text-lg">
            {getStatusBadge()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-card/30 border border-primary/20 hover-scale backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">
                {hasPremiumWell ? '✅' : '❌'}
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {hasPremiumWell ? 'ЕСТЬ' : 'НЕТ'}
              </div>
              <p className="text-sm text-muted-foreground">Премиум-скважина</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 border border-accent/20 hover-scale backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">💰</div>
              <div className="text-3xl font-bold text-accent mb-1">
                {formatGameCurrency(dailyIncome)}
              </div>
              <p className="text-sm text-muted-foreground">Доход в день</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-card/30 border border-green-400/20 hover-scale backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">
                {isEligible ? '🎉' : '⏳'}
              </div>
              <div className="text-3xl font-bold text-green-400 mb-1">
                {isEligible ? 'ДА!' : 'НЕТ'}
              </div>
              <p className="text-sm text-muted-foreground">
                {isEligible ? 'Участвуете!' : 'Не участвуете'}
              </p>
            </div>
          </div>

          {!hasPremiumWell && (
            <div className="bg-card/30 border-2 border-destructive/40 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/20 border border-primary/40">
                  <ShoppingBag className="h-12 w-12 text-primary" />
                </div>
              </div>
              <p className="text-lg text-foreground mb-4 font-semibold">
                💎 Купите Премиум-скважину в магазине, чтобы стать участником розыгрыша! 💎
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard?section=shop')}
                className="w-full py-3 text-lg font-bold hover-scale"
              >
                Перейти в Магазин
              </Button>
            </div>
          )}

          {hasPremiumWell && dailyIncome < 2000 && (
            <div className="bg-card/30 border-2 border-primary/40 rounded-2xl p-6 text-center backdrop-blur-sm">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-lg text-foreground mb-4 font-semibold">
                ⚡ Увеличьте доход до 2000₽/день или выше для участия в розыгрыше! ⚡
              </p>
              <Progress 
                value={(dailyIncome / 2000) * 100} 
                className="w-full h-4 mb-4"
              />
              <p className="text-sm text-muted-foreground font-semibold">
                💪 Осталось: {formatGameCurrency(2000 - dailyIncome)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Призовые места */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-playfair">
          🏆 Призовые места 🏆
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prizes.map((prize, index) => (
            <Card 
              key={index} 
              className="bg-card/50 border border-primary/20 shadow-lg hover-scale transition-all duration-300 overflow-hidden relative group animate-fade-in backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-8 relative">
                <div className="flex items-center space-x-6">
                  <div className={`${prize.color} p-4 rounded-full bg-primary/20 border border-primary/40`}>
                    {prize.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-2xl text-foreground">{prize.places}</h3>
                      <div className="flex space-x-1">
                        {[...Array(4-index)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg font-semibold mb-2">{prize.prize}</p>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed">{prize.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Статистика и дата */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-card/50 border border-primary/20 shadow-lg overflow-hidden relative animate-scale-in hover-scale group backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center justify-center space-x-3 text-2xl text-foreground">
              <Calendar className="h-8 w-8 text-primary" />
              <span>⏰ Время до розыгрыша</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center space-y-4 p-4">
              <div className="text-6xl font-bold text-primary animate-bounce-in">{daysLeft}</div>
              <p className="text-xl text-muted-foreground font-semibold">{getDaysText(daysLeft)} осталось</p>
              <div className="bg-primary/20 border border-primary/40 p-3 rounded-xl">
                <p className="text-lg text-foreground font-bold">
                  📅 Розыгрыш: 18 октября 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border border-accent/20 shadow-lg overflow-hidden relative animate-scale-in hover-scale group backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent"></div>
          <CardHeader className="relative">
            <CardTitle className="flex items-center justify-center space-x-3 text-2xl text-foreground">
              <Trophy className="h-8 w-8 text-accent" />
              <span>👥 Участники</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-center space-y-4 p-4">
              <div className="text-6xl font-bold text-accent animate-bounce-in">{totalParticipants}</div>
              <p className="text-xl text-muted-foreground font-semibold">активных участников</p>
              <div className="bg-accent/20 border border-accent/40 p-3 rounded-xl">
                <p className="text-lg text-foreground font-bold">
                  🏆 100 призовых мест
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Правила */}
      <Card className="bg-card/50 border border-primary/20 shadow-lg overflow-hidden relative animate-fade-in group backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-accent to-primary"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center justify-center space-x-3 text-3xl text-foreground">
            <div className="p-2 rounded-full bg-primary/20 border border-primary/40">
              📋
            </div>
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-playfair">
              Правила розыгрыша
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">💎 Купите Премиум-скважину в магазине игры</p>
            </div>
            <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">📈 Достигните дохода 2000 рублей в день или выше</p>
            </div>
            <div className="bg-green-400/10 border border-green-400/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">⏰ Поддерживайте доход до даты розыгрыша</p>
            </div>
            <div className="bg-blue-400/10 border border-blue-400/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">🎯 Розыгрыш состоится 18 октября 2025 года</p>
            </div>
            <div className="bg-purple-400/10 border border-purple-400/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">🎲 Победители определяются случайным образом</p>
            </div>
            <div className="bg-pink-400/10 border border-pink-400/20 p-4 rounded-xl hover-scale backdrop-blur-sm">
              <p className="text-foreground font-semibold">📱 Уведомления о выигрыше в Telegram</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumGiveaway;