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
import { ProfitabilityCalculator } from "@/components/ProfitabilityCalculator";
import { Logo } from "@/components/Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Sparkles,
  Rocket,
  Package,
  Gift,
  Gamepad2
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
            <Logo variant="default" linkTo="/" />
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <TooltipProvider>
                {user ? (
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="hidden md:flex items-center space-x-2 text-sm bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20 shadow-md">
                      <div className="p-1 bg-primary/20 rounded-full">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground max-w-[100px] truncate">{profile?.nickname || 'Игрок'}</span>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/calculator" className="hidden sm:block">
                          <Button size="sm" variant="ghost" className="backdrop-blur-sm border border-accent/20 hover:bg-accent/10 text-xs sm:text-sm gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Калькулятор
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Рассчитайте потенциальную прибыль</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/dashboard">
                          <Button size="sm" className="gradient-primary shadow-primary hover-scale relative overflow-hidden group text-xs sm:text-sm px-3 sm:px-4">
                            <span className="relative z-10">В игру</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Перейти в игровой дашборд</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/calculator" className="hidden md:block">
                          <Button size="sm" variant="ghost" className="backdrop-blur-sm border border-accent/20 hover:bg-accent/10 text-xs sm:text-sm gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Калькулятор
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Рассчитайте потенциальную прибыль</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/auth" className="hidden sm:block">
                          <Button size="sm" variant="ghost" className="backdrop-blur-sm border border-primary/20 hover:bg-primary/10 text-xs sm:text-sm">
                            Войти
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Войти в существующий аккаунт</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to="/dashboard">
                          <Button size="sm" className="gradient-primary shadow-primary hover-scale relative overflow-hidden group text-xs sm:text-sm px-3 sm:px-4">
                            <span className="relative z-10 whitespace-nowrap">Начать игру</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Начать строить нефтяную империю</p>
                      </TooltipContent>
                    </Tooltip>
                  </>
                )}
              </TooltipProvider>
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
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Игровая валюта
            </h2>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Exchange Rate Card */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-cyan-500/30 rounded-2xl backdrop-blur-sm animate-bounce-in">
                      <Coins className="h-12 w-12 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                    </div>
                    <Badge className="text-xl px-6 py-2 bg-cyan-500/30 text-cyan-300 border-cyan-400/60 font-bold shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                      {currencyConfig.game_currency_symbol}
                    </Badge>
                  </div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Курс обмена</h3>
                  <div className="flex items-center gap-4 mb-4 justify-center">
                    <span className="text-6xl font-bold text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%)] whitespace-nowrap">
                      1 OC
                    </span>
                    <span className="text-5xl font-bold text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                      =
                    </span>
                    <span className="text-6xl font-bold text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%)] whitespace-nowrap">
                      1 ₽
                    </span>
                  </div>
                  <p className="text-lg text-cyan-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    1 OilCoin всегда равен 1 игровому рублю. Простой и понятный обмен валют
                  </p>
                </CardContent>
              </Card>

              {/* Security Card */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-100">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-purple-500/30 rounded-2xl backdrop-blur-sm animate-bounce-in">
                      <Shield className="h-12 w-12 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                    </div>
                    <div className="text-6xl font-bold text-purple-400 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                      100%
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-purple-100 mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Безопасность</h3>
                  <p className="text-lg text-purple-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Все платежи защищены банковским шифрованием. Надежные платежные системы гарантируют безопасность ваших средств
                  </p>
                </CardContent>
              </Card>

              {/* Instant Credit Card */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in animation-delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-pink-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-4 bg-pink-500/30 rounded-2xl backdrop-blur-sm animate-bounce-in">
                      <Zap className="h-12 w-12 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                    </div>
                    <Sparkles className="h-16 w-16 text-pink-400/50 animate-spin-slow" />
                  </div>
                  <h3 className="text-3xl font-bold text-pink-100 mb-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Мгновенно</h3>
                  <p className="text-lg text-pink-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Игровая валюта OilCoin поступает на счет сразу после оплаты
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Features Row */}
            <div className="grid md:grid-cols-2 gap-8 animate-fade-in animation-delay-300">
              <Card className="group relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl border-2 border-cyan-500/30 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-cyan-500/20 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Wallet className="h-10 w-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-cyan-100 mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Что можно купить</h4>
                      <p className="text-lg text-cyan-50/80 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                        За OilCoin покупайте скважины, бустеры и улучшения для развития империи
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border-2 border-purple-500/30 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="relative p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-purple-500/20 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <Crown className="h-10 w-10 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-purple-100 mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Премиум опыт</h4>
                      <p className="text-lg text-purple-50/80 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                        Получайте доступ к эксклюзивным возможностям и ускоряйте свой прогресс в игре
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Калькулятор доходности */}
        <div className="container mx-auto px-4 mb-32 animate-fade-in">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Планируй свою империю
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Узнайте, что нужно купить для достижения желаемого дохода
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <ProfitabilityCalculator compact />
          </div>
        </div>


        {/* Features Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold font-playfair mb-6 leading-tight bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Возможности игры
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Все инструменты для построения успешной нефтяной империи
            </p>
          </div>
          
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Wells Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-emerald-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-emerald-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <Fuel className="h-16 w-16 text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-emerald-400/30 group-hover:text-emerald-400/50 transition-colors duration-300">01</div>
                  </div>
                  <h3 className="text-3xl font-bold text-emerald-100 mb-4 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Нефтяные скважины</h3>
                  <p className="text-lg text-emerald-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Покупайте и развивайте скважины различных классов для изучения экономических принципов
                  </p>
                </CardContent>
              </Card>

              {/* Profit Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 animate-fade-in animation-delay-100">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-orange-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-100"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-orange-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      <Coins className="h-16 w-16 text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-orange-400/30 group-hover:text-orange-400/50 transition-colors duration-300">02</div>
                  </div>
                  <h3 className="text-3xl font-bold text-orange-100 mb-4 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Три валюты</h3>
                  <p className="text-lg text-orange-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    OilCoins для покупок, Баррели для добычи, Рубли для вывода - полноценная экономическая система
                  </p>
                </CardContent>
              </Card>

              {/* Referral Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 hover:border-blue-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in animation-delay-200">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-blue-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-200"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-blue-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <Fuel className="h-16 w-16 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-blue-400/30 group-hover:text-blue-400/50 transition-colors duration-300">03</div>
                  </div>
                  <h3 className="text-3xl font-bold text-blue-100 mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Система баррелей</h3>
                  <p className="text-lg text-blue-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Скважины добывают баррели 24/7 в реальном времени. Собирайте их и обменивайте на другие валюты
                  </p>
                </CardContent>
              </Card>

              {/* Exchange Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 animate-fade-in animation-delay-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-300"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-purple-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      <BarChart3 className="h-16 w-16 text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-purple-400/30 group-hover:text-purple-400/50 transition-colors duration-300">04</div>
                  </div>
                  <h3 className="text-3xl font-bold text-purple-100 mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Биржа валют</h3>
                  <p className="text-lg text-purple-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Обменивайте валюты по актуальным курсам. Баррели → OilCoins → Рубли. Полный контроль над финансами
                  </p>
                </CardContent>
              </Card>

              {/* Referral Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in animation-delay-400">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-400"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-cyan-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <Users className="h-16 w-16 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-cyan-400/30 group-hover:text-cyan-400/50 transition-colors duration-300">05</div>
                  </div>
                  <h3 className="text-3xl font-bold text-cyan-100 mb-4 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Реферальная программа</h3>
                  <p className="text-lg text-cyan-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Приглашайте друзей и получайте бонусы за совместное развитие нефтяной империи
                  </p>
                </CardContent>
              </Card>

              {/* Achievements Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-transparent backdrop-blur-xl border-2 border-violet-500/50 hover:border-violet-400 transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 animate-fade-in animation-delay-500">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-fuchsia-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-violet-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-500"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-violet-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      <Award className="h-16 w-16 text-violet-400 drop-shadow-[0_0_20px_rgba(139,92,246,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-violet-400/30 group-hover:text-violet-400/50 transition-colors duration-300">06</div>
                  </div>
                  <h3 className="text-3xl font-bold text-violet-100 mb-4 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Система достижений</h3>
                  <p className="text-lg text-violet-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Соревнуйтесь с другими игроками за звание лучшего стратега в рейтингах
                  </p>
                </CardContent>
              </Card>

              {/* Boosters Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in animation-delay-600">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-yellow-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-600"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-yellow-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                      <Rocket className="h-16 w-16 text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-yellow-400/30 group-hover:text-yellow-400/50 transition-colors duration-300">07</div>
                  </div>
                  <h3 className="text-3xl font-bold text-yellow-100 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бустеры</h3>
                  <p className="text-lg text-yellow-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Турбо-ускорение, автоматизация и улучшенное оборудование для максимальной эффективности
                  </p>
                </CardContent>
              </Card>

              {/* Well Packages Feature */}
              <Card className="group relative overflow-hidden bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-transparent backdrop-blur-xl border-2 border-rose-500/50 hover:border-rose-400 transition-all duration-500 hover:-translate-y-2 hover:-rotate-1 animate-fade-in animation-delay-700">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-rose-400/30 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-700"></div>
                </div>
                <CardContent className="relative p-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-5 bg-rose-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                      <Package className="h-16 w-16 text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.8)]" />
                    </div>
                    <div className="text-5xl font-black text-rose-400/30 group-hover:text-rose-400/50 transition-colors duration-300">08</div>
                  </div>
                  <h3 className="text-3xl font-bold text-rose-100 mb-4 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Пакеты скважин</h3>
                  <p className="text-lg text-rose-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Готовые наборы скважин - от стартового до империи. Быстрый старт и мгновенный доход
                  </p>
                </CardContent>
              </Card>

              {/* Treasure Chest Feature */}
              {/* <Card className="group relative overflow-hidden bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border-2 border-teal-500/50 hover:border-teal-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in animation-delay-800">
...
                </CardContent>
              </Card> */}

              {/* Mini Games - Pipeline */}
              {/* <Link to="/pipeline" className="block">
...
                </Card>
              </Link> */}

              {/* Mini Games - Lucky Chests */}
              {/* <Link to="/lucky-chests" className="block">
...
                </Card>
              </Link> */}

              {/* Mini Games - Tower Jumper */}
              {/* <Link to="/tower-jumper" className="block">
                <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 hover:border-blue-400 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 animate-fade-in animation-delay-1200">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-blue-400/30 transition-all duration-500"></div>
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 delay-1200"></div>
                  </div>
                  <CardContent className="relative p-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className="p-5 bg-blue-500/30 rounded-2xl backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                        <Rocket className="h-16 w-16 text-blue-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                      </div>
                      <div className="text-5xl font-black text-blue-400/30 group-hover:text-blue-400/50 transition-colors duration-300">13</div>
                    </div>
                    <h3 className="text-3xl font-bold text-blue-100 mb-4 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Прыжки по вышкам 🚀</h3>
                    <p className="text-lg text-blue-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Аркадный платформер. Прыгай по нефтяным вышкам и собирай очки. Игра ускоряется каждые 5 прыжков!
                    </p>
                  </CardContent>
                </Card>
              </Link> */}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="py-12 relative">
          <div className="absolute inset-0 backdrop-blur-sm bg-muted/20 rounded-3xl"></div>
          <div className="relative max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3 font-playfair [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Отзывы наших игроков
              </h2>
              <p className="text-lg text-muted-foreground [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Узнайте, что говорят реальные игроки о нашей игре</p>
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
              <p className="font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">&copy; 2025 Oil Tycoon. Все права защищены.</p>
              <p className="text-sm [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Образовательная экономическая игра для изучения основ бизнеса. Возрастное ограничение: 18+</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;