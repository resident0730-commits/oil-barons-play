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
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative p-2.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full border border-primary/30">
                  <Crown className="h-7 w-7 text-primary drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-lg">
                  Oil Tycoon
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-3 w-3 text-accent/70" />
                  <span className="text-xs text-muted-foreground font-medium">Нефтяная империя</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-5 py-2.5 border border-primary/20 shadow-md">
                    <div className="p-1 bg-primary/20 rounded-full">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">{profile?.nickname || 'Игрок'}</span>
                  </div>
                  <Link to="/dashboard">
                    <Button className="gradient-primary shadow-primary hover-scale relative overflow-hidden group">
                      <span className="relative z-10">В игру</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/auth">
                    <Button variant="ghost" className="backdrop-blur-sm border border-primary/20 hover:bg-primary/10">
                      Войти
                    </Button>
                  </Link>
                  <Link to="/dashboard">
                    <Button className="gradient-primary shadow-primary hover-scale relative overflow-hidden group">
                      <span className="relative z-10">Начать игру</span>
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
        <div className="container mx-auto px-4 mb-24 animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="luxury-gold-text text-3xl sm:text-5xl md:text-7xl font-bold font-playfair mb-6 leading-tight px-4">
              ИГРОВАЯ ВАЛЮТА
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-yellow-400 to-primary bg-clip-text text-transparent mb-4 px-4">
              {currencyConfig.game_currency_name}
            </h3>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
              Приобретайте игровую валюту для развития своей нефтяной империи
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto bg-transparent backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-10 animate-glow-pulse -z-10 blur-sm"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-full border border-primary/30 shadow-lg">
                  <Coins className="h-10 w-10 text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </div>
                <div className="p-4 bg-accent/10 rounded-full border border-accent/30 shadow-lg">
                  <Wallet className="h-10 w-10 text-accent drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-lg hover-scale group">
                  <div className="text-5xl font-bold text-primary mb-3 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                    {currencyConfig.exchange_rate}
                  </div>
                  <p className="text-base font-medium text-foreground/80">Прозрачный курс обмена</p>
                </div>
                <div className="text-center p-8 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20 shadow-lg hover-scale group">
                  <div className="text-5xl font-bold text-accent mb-3 drop-shadow-[0_0_20px_rgba(234,179,8,0.4)] group-hover:scale-110 transition-transform">
                    100%
                  </div>
                  <p className="text-base font-medium text-foreground/80">Безопасные платежи</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl p-8 border border-primary/10">
                <h4 className="font-bold text-2xl mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Что такое {currencyConfig.game_currency_name}?
                </h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-primary/15 rounded-lg inline-block border border-primary/20">
                      <Target className="h-7 w-7 text-primary drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    </div>
                    <p className="font-bold text-lg text-foreground">Игровая валюта</p>
                    <p className="text-muted-foreground leading-relaxed">{getGameCurrencyDescription()}</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-accent/15 rounded-lg inline-block border border-accent/20">
                      <Shield className="h-7 w-7 text-accent drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    </div>
                    <p className="font-bold text-lg text-foreground">Курс обмена</p>
                    <p className="text-muted-foreground leading-relaxed">{getExchangeDescription()}</p>
                  </div>
                  <div className="text-center space-y-3">
                    <div className="p-3 bg-primary/15 rounded-lg inline-block border border-primary/20">
                      <Zap className="h-7 w-7 text-primary drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    </div>
                    <p className="font-bold text-lg text-foreground">Мгновенное зачисление</p>
                    <p className="text-muted-foreground leading-relaxed">{currencyConfig.game_currency_name} поступают на игровой счет сразу после платежа</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="luxury-gold-text text-3xl sm:text-5xl md:text-7xl font-bold font-playfair mb-6 leading-tight">
              ВОЗМОЖНОСТИ ИГРЫ
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-lg px-4">
              Все инструменты для построения нефтяной империи
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 container mx-auto px-4">
            <Card className="text-center group hover-scale bg-transparent backdrop-blur-xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="mx-auto mb-4 p-5 bg-primary/15 rounded-full w-fit border border-primary/30 shadow-lg group-hover:scale-110 transition-transform">
                  <Fuel className="h-14 w-14 text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                  Нефтяные скважины
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-foreground/80 leading-relaxed text-base">
                  Покупайте и развивайте скважины различных классов для изучения экономических принципов
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-transparent backdrop-blur-xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="mx-auto mb-4 p-5 bg-accent/15 rounded-full w-fit border border-accent/30 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-14 w-14 text-accent drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Стабильная прибыль
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-foreground/80 leading-relaxed text-base">
                  Изучайте основы экономики через игровые механики и получайте стабильный прогресс в игре
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-transparent backdrop-blur-xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="mx-auto mb-4 p-5 bg-primary/15 rounded-full w-fit border border-primary/30 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-14 w-14 text-primary drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-yellow-400 bg-clip-text text-transparent">
                  Реферальная программа
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-foreground/80 leading-relaxed text-base">
                  Приглашайте друзей в игру и получайте бонусы за совместную игру в образовательной игре
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-transparent backdrop-blur-xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
              <CardHeader className="relative z-10 pb-4">
                <div className="mx-auto mb-4 p-5 bg-accent/15 rounded-full w-fit border border-accent/30 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="h-14 w-14 text-accent drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Система достижений
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-foreground/80 leading-relaxed text-base">
                  Соревнуйтесь с другими игроками за звание лучшего стратега в рейтингах игры
                </p>
              </CardContent>
            </Card>
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