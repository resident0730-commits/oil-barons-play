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
import { PromoBanner } from "@/components/PromoBanner";
import { StatisticMetrics } from "@/components/StatisticMetrics";
import { InteractiveChart } from "@/components/InteractiveChart";
import { RealTimeVisualizer } from "@/components/RealTimeVisualizer";
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
  Shield
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
    <div className="min-h-screen bg-background overflow-x-hidden">
        {/* Header */}
      <header className="relative z-50 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between backdrop-blur-sm bg-card/80 rounded-2xl p-4 shadow-oil border border-primary/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Fuel className="h-10 w-10 text-primary animate-glow-pulse" />
              <div className="absolute inset-0 h-10 w-10 text-primary/30 animate-pulse" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">Oil Tycoon</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm bg-card/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-medium">{profile?.nickname || 'Игрок'}</span>
                </div>
                <Link to="/dashboard">
                  <Button className="gradient-primary shadow-primary hover-scale">В игру</Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="backdrop-blur-sm">Войти</Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="gradient-primary shadow-primary hover-scale">Начать игру</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section - Main focal point */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center space-y-12 mb-24 animate-fade-in">
          <div className="relative">
            <Badge variant="default" className="text-lg px-6 py-3 shadow-primary animate-scale-in border border-primary/30">
              <Fuel className="w-5 h-5 mr-2" />
              Богатство из недр земли
            </Badge>
          </div>
          
          <div className="space-y-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl" />
            <h1 className="relative text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-scale-in font-playfair leading-tight">
              Oil Tycoon
            </h1>
            <div className="relative max-w-4xl mx-auto space-y-4">
              <p className="text-2xl md:text-3xl text-foreground/90 font-medium leading-relaxed">
                Постройте нефтяную империю
              </p>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Реальный заработок через игровую механику! Управляйте скважинами, развивайте бизнес и выводите заработанные средства. Ваши навыки магната превращаются в реальный доход.
              </p>
              <div className="pt-4">
                <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Зарабатывайте реальные деньги, развивая свою нефтяную империю
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="gradient-primary shadow-primary text-xl px-12 py-6 hover-scale animate-glow-pulse">
                  <Zap className="mr-3 h-6 w-6" />
                  Продолжить империю
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="gradient-primary shadow-primary text-xl px-12 py-6 hover-scale animate-glow-pulse">
                  <Coins className="mr-3 h-6 w-6" />
                  Начать игру бесплатно
                </Button>
              </Link>
            )}
            <Link to="/guide">
              <Button size="lg" variant="outline" className="text-xl px-10 py-6 hover-scale">
                <BarChart3 className="mr-3 h-6 w-6" />
                Узнать больше
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Promo Banner */}
      <PromoBanner />

      {/* Rest of the content with spacing */}
      <div className="relative mt-12">
        {/* Currency Exchange Information */}
        <div className="container mx-auto px-4 mb-24 animate-fade-in">
          <Card className="max-w-4xl mx-auto bg-card/95 backdrop-blur-xl border-2 border-primary/20 shadow-gold overflow-hidden relative group animate-fade-in">
            {/* Animated border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Coins className="h-8 w-8 text-primary" />
                </div>
                <div className="p-3 bg-accent/10 rounded-full">
                  <Wallet className="h-8 w-8 text-accent" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                Игровая валюта {currencyConfig.game_currency_name}
              </CardTitle>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Приобретайте игровую валюту для развития своей нефтяной империи
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="text-4xl font-bold text-primary mb-2">{currencyConfig.exchange_rate}</div>
                  <p className="text-sm text-muted-foreground">Прозрачный курс обмена</p>
                </div>
                <div className="text-center p-6 bg-accent/5 rounded-xl border border-accent/10">
                  <div className="text-4xl font-bold text-accent mb-2">100%</div>
                  <p className="text-sm text-muted-foreground">Безопасные платежи</p>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-xl p-6">
                <h4 className="font-semibold text-lg mb-3 text-center">Что такое {currencyConfig.game_currency_name}?</h4>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center space-y-2">
                    <div className="p-2 bg-primary/10 rounded-lg inline-block">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Игровая валюта</p>
                    <p className="text-muted-foreground">{getGameCurrencyDescription()}</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="p-2 bg-accent/10 rounded-lg inline-block">
                      <Shield className="h-5 w-5 text-accent" />
                    </div>
                    <p className="font-medium">Курс обмена</p>
                    <p className="text-muted-foreground">{getExchangeDescription()}</p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="p-2 bg-primary/10 rounded-lg inline-block">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <p className="font-medium">Мгновенное зачисление</p>
                    <p className="text-muted-foreground">{currencyConfig.game_currency_name} поступают на игровой счет сразу после платежа</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Progress Section - показывается только для авторизованных игроков */}
        {user && profile && (
          <div className="mb-24 animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 font-playfair">Ваша нефтяная империя</h2>
              <p className="text-xl text-muted-foreground">Текущие достижения и активы</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="relative overflow-hidden group hover-scale bg-card backdrop-blur-xl border-2 border-primary/20 shadow-primary">
                {/* Animated border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-luxury"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-lg font-medium">Капитал</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Wallet className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{formatGameCurrency(profile.balance)}</div>
                  <p className="text-sm text-muted-foreground">Игровая валюта для развития</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover-scale bg-card backdrop-blur-xl border-2 border-primary/20 shadow-primary">
                {/* Animated border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-luxury"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-lg font-medium">Ежедневный доход</CardTitle>
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold text-accent">{profile.daily_income.toLocaleString()} OC</div>
                  <p className="text-sm text-muted-foreground">Игровой доход от активности</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group hover-scale bg-card backdrop-blur-xl border-2 border-primary/20 shadow-primary">
                {/* Animated border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-luxury"></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-lg font-medium">Нефтяные активы</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Fuel className="h-6 w-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-3xl font-bold text-primary">{wells.length}</div>
                  <p className="text-sm text-muted-foreground">Работающих скважин</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Features Grid */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4 font-playfair">Возможности игры</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Все инструменты для построения нефтяной империи</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center group hover-scale bg-card border-2 border-primary/20 shadow-primary relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
              <CardHeader className="relative z-10">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <Fuel className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Нефтяные скважины</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Покупайте и развивайте скважины различных классов для изучения экономических принципов
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-card border-2 border-primary/20 shadow-primary relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
              <CardHeader className="relative z-10">
                <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                  <TrendingUp className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Стабильная прибыль</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Изучайте основы экономики через игровые механики и получайте стабильный прогресс в игре
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-card border-2 border-primary/20 shadow-primary relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
              <CardHeader className="relative z-10">
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold">Реферальная программа</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Приглашайте друзей в игру и получайте бонусы за совместную игру в образовательной игре
                </p>
              </CardContent>
            </Card>

            <Card className="text-center group hover-scale bg-card border-2 border-primary/20 shadow-primary relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
              <CardHeader className="relative z-10">
                <div className="mx-auto mb-4 p-4 bg-accent/10 rounded-full w-fit">
                  <Award className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-xl font-bold">Система достижений</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-muted-foreground leading-relaxed">
                  Соревнуйтесь с другими игроками за звание лучшего стратега в рейтингах игры
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Data Visualization Section */}
        <div className="py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50 rounded-3xl"></div>
          <div className="relative max-w-6xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-3 font-playfair">
                📊 Аналитика & Метрики
              </h2>
              <p className="text-lg text-slate-300 mb-6">Современная визуализация игровых данных в реальном времени</p>
            </div>

            {/* Real-time visualizer */}
            <div className="mb-8">
              <RealTimeVisualizer />
            </div>
            
            {/* Metrics grid */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                ⚡ Ключевые показатели
              </h3>
              <StatisticMetrics />
            </div>
            
            {/* Interactive chart */}
            <div>
              <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                📈 Динамика роста
              </h3>
              <InteractiveChart />
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
            <div className="bg-card rounded-2xl p-8 border-2 border-primary/20 shadow-primary relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-luxury"></div>
              <div className="relative z-10">
                <GameReviews />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-12">
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 blur-3xl rounded-full"></div>
            <Card className="relative bg-card backdrop-blur-xl border-2 border-primary/20 shadow-gold overflow-hidden group animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-luxury"></div>
              <CardHeader className="text-center py-8">
                <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 font-playfair">
                  Готовы изучать экономику через игру?
                </CardTitle>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Присоединяйтесь к тысячам игроков в образовательной игре. Изучайте основы экономики и бизнеса в безопасной игровой среде!
                </p>
              </CardHeader>
              <CardContent className="space-y-8 pb-12">
                <Separator className="bg-primary/20" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-primary/5">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Coins className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">Стартовые ресурсы</div>
                      <div className="text-sm text-muted-foreground">1000 игровых монет</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-accent/5">
                    <div className="p-3 bg-accent/10 rounded-full">
                      <Target className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-accent">Обучение через игру</div>
                      <div className="text-sm text-muted-foreground">Изучайте экономику</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-primary/5">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">Игровые награды</div>
                      <div className="text-sm text-muted-foreground">За активность в игре</div>
                    </div>
                  </div>
                </div>
                <Link to={user ? "/dashboard" : "/auth"} className="block">
                  <Button size="lg" className="gradient-primary shadow-primary w-full md:w-auto text-xl px-16 py-6 hover-scale animate-glow-pulse">
                    <Zap className="mr-3 h-6 w-6" />
                    {user ? "Продолжить игру" : "Начать обучение игрой"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-primary/20 backdrop-blur-sm bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <Fuel className="h-8 w-8 text-primary animate-glow-pulse" />
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