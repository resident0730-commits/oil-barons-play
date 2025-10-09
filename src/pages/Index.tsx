import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameData } from "@/hooks/useGameData";
import { useGameStatistics } from "@/hooks/useGameStatistics";
import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useCurrency } from "@/hooks/useCurrency";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GameReviews } from "@/components/GameReviews";
import { ParallaxHero } from "@/components/ParallaxHero";
import { 
  Fuel, 
  TrendingUp, 
  Users, 
  Award, 
  Coins, 
  BarChart3,
  Zap,
  Target,
  Wallet,
  User,
  Shield,
  Crown,
  Sparkles
} from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { profile, wells, loading, reload } = useGameData();
  const { statistics } = useGameStatistics();
  const { isPageVisible } = usePageVisibility();
  const { currencyConfig, formatGameCurrency, getGameCurrencyDescription, getExchangeDescription } = useCurrency();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Обработка результата платежа
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const amount = searchParams.get('amount');
    const invoice = searchParams.get('invoice');
    
    if (paymentStatus && user) {
      if (paymentStatus === 'success') {
        handlePaymentSuccess(amount, invoice);
      } else if (paymentStatus === 'fail') {
        handlePaymentFailure();
      }
      
      // Очищаем URL параметры
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('payment');
      newParams.delete('amount');
      newParams.delete('invoice');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, user]);

  const handlePaymentSuccess = async (amount: string | null, invoiceId: string | null) => {
    try {
      if (!user || !amount) return;
      
      const amountNum = parseFloat(amount);
      if (amountNum <= 0) return;

      // Просто показываем уведомление - баланс уже обновлен через ResultURL
      toast({
        title: "🎉 Платеж успешно завершен!",
        description: `Ваш баланс пополнен на ${amountNum.toLocaleString()} ₽. Заказ #${invoiceId}`,
        duration: 5000,
      });

      // Обновляем данные профиля для отображения нового баланса
      reload();

    } catch (error: any) {
      console.error('Payment success handling error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Возникла ошибка при обработке успешного платежа.",
      });
    }
  };

  const handlePaymentFailure = () => {
    toast({
      variant: "destructive", 
      title: "❌ Платеж отменен",
      description: "Оплата не была завершена. Попробуйте еще раз.",
      duration: 4000,
    });
  };

  return (
    <div className="min-h-screen hero-luxury-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-gradient-to-b from-background/95 to-background/80 border-b border-primary/10 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <nav className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-shrink">
              <div className="relative group flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-1.5 sm:p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border border-primary/30">
                  <Crown className="h-5 w-5 sm:h-7 sm:w-7 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg truncate">
                  Oil Tycoon
                </h1>
                <div className="hidden sm:flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-accent/70" />
                  <span className="text-xs text-muted-foreground font-medium">Нефтяная империя</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {user ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="hidden md:flex items-center space-x-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 shadow-md">
                    <div className="p-1 bg-primary/20 rounded-full">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground max-w-[100px] truncate">{profile?.nickname || 'Игрок'}</span>
                  </div>
                  <Link to="/dashboard">
                    <Button size="sm" className="gradient-primary shadow-primary hover-scale relative overflow-hidden group text-xs sm:text-sm px-3 sm:px-4">
                      <span className="relative z-10">В игру</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:block">
                    <Button size="sm" variant="ghost" className="backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-xs sm:text-sm">
                      Войти
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button size="sm" className="gradient-primary shadow-primary hover-scale relative overflow-hidden group text-xs sm:text-sm px-3 sm:px-4">
                      <span className="relative z-10 whitespace-nowrap">Начать игру</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Parallax Hero Section */}
      <ParallaxHero />

      {/* Rest of the content with spacing */}
      <div className="relative mt-12">
        {/* Currency Exchange Information */}
        <div className="container mx-auto px-4 mb-32 animate-fade-in">
          <div className="text-center mb-16">
            <h2 className="luxury-gold-text text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight">
              Игровая валюта
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              {currencyConfig.game_currency_name} — внутренняя валюта для развития вашей нефтяной империи
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Exchange Rate Card */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-500"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-primary/20 rounded-2xl backdrop-blur-sm">
                      <Coins className="h-12 w-12 text-primary animate-gold-glow" />
                    </div>
                    <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2 font-bold animate-pulse">
                      ✓ Активно
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Курс обмена</h3>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-7xl font-bold text-primary drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                      {currencyConfig.exchange_rate}
                    </span>
                    <span className="text-2xl text-white/80 font-medium">₽</span>
                  </div>
                  <p className="text-lg text-white/80 leading-relaxed">
                    {getExchangeDescription()}
                  </p>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-accent/10 via-accent/5 to-transparent backdrop-blur-xl border-2 border-accent/40 hover:border-accent transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-accent/20 rounded-full blur-3xl group-hover:bg-accent/30 transition-colors duration-500"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-accent/20 rounded-2xl backdrop-blur-sm">
                      <Shield className="h-12 w-12 text-accent animate-gold-glow" />
                    </div>
                    <div className="text-6xl font-bold text-accent drop-shadow-[0_0_30px_rgba(251,191,36,0.5)]">
                      100%
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Безопасность</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Все платежи защищены банковским шифрованием. Надежные платежные системы гарантируют безопасность ваших средств
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features Row */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="relative overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-primary/20 rounded-xl flex-shrink-0">
                      <Zap className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-3">Мгновенное зачисление</h4>
                      <p className="text-lg text-white/80 leading-relaxed">
                        {currencyConfig.game_currency_name} поступают на счет сразу после оплаты
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-black/40 backdrop-blur-xl border-2 border-primary/30 hover:border-primary/60 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-primary/20 rounded-xl flex-shrink-0">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white mb-3">Для чего нужна</h4>
                      <p className="text-lg text-white/80 leading-relaxed">
                        {getGameCurrencyDescription()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="luxury-gold-text text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight">
              Возможности игры
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
              Все инструменты для построения успешной нефтяной империи
            </p>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Wells Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-primary/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Fuel className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-5xl font-black text-primary/20">01</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Нефтяные скважины</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Покупайте и развивайте скважины различных классов для изучения экономических принципов
                  </p>
                </CardContent>
              </Card>

              {/* Profit Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-xl border-2 border-accent/40 hover:border-accent transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-accent/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-16 w-16 text-accent" />
                    </div>
                    <div className="text-5xl font-black text-accent/20">02</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Стабильная прибыль</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Изучайте основы экономики через игровые механики и получайте стабильный прогресс
                  </p>
                </CardContent>
              </Card>

              {/* Referral Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-xl border-2 border-primary/40 hover:border-primary transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-primary/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-16 w-16 text-primary" />
                    </div>
                    <div className="text-5xl font-black text-primary/20">03</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Реферальная программа</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Приглашайте друзей и получайте бонусы за совместную игру в образовательной игре
                  </p>
                </CardContent>
              </Card>

              {/* Achievements Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-accent/10 to-transparent backdrop-blur-xl border-2 border-accent/40 hover:border-accent transition-all duration-500 hover-scale">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-accent/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                      <Award className="h-16 w-16 text-accent" />
                    </div>
                    <div className="text-5xl font-black text-accent/20">04</div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Система достижений</h3>
                  <p className="text-lg text-white/80 leading-relaxed">
                    Соревнуйтесь с другими игроками за звание лучшего стратега в рейтингах
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12 relative">
          <div className="absolute inset-0 backdrop-blur-sm bg-muted/20 rounded-3xl"></div>
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 font-playfair">
                Отзывы наших игроков
              </h2>
              <p className="text-lg text-muted-foreground">Узнайте, что говорят реальные игроки о нашей игре</p>
            </div>
            <div className="bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20 animate-glow-pulse -z-10 blur-sm"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
              <div className="relative z-10">
                <GameReviews />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="relative border-t border-primary/20 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="relative p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border border-primary/30">
                  <Crown className="h-6 w-6 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Oil Tycoon</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              <Link to="/rules" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Правила игры
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                О компании
              </Link>
              <Link to="/careers" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Вакансии
              </Link>
              {isPageVisible('terms') && (
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Условия использования
                </Link>
              )}
              {isPageVisible('offer') && (
                <Link to="/offer" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                  Публичная оферта
                </Link>
              )}
              <Link to="/support" className="text-muted-foreground hover:text-primary transition-colors duration-300 font-medium">
                Поддержка
              </Link>
            </div>
            
            <Separator className="bg-primary/20" />
            
            <div className="space-y-2 text-muted-foreground">
              <p className="font-medium">&copy; 2025 Oil Tycoon. Все права защищены.</p>
              <p className="text-sm">Образовательная экономическая игра для изучения основ бизнеса. Возрастное ограничение: 18+</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;