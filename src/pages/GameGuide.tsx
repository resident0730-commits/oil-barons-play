import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  ArrowLeft,
  Target,
  TrendingUp,
  Zap,
  Users,
  Coins,
  Clock,
  Settings,
  Gift,
  Star,
  Crown,
  ArrowRight,
  BarChart3,
  Wrench,
  Sparkles,
  Gem,
  Rocket,
  Calendar,
  HelpCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";

const GameGuide = () => {
  const { formatGameCurrency, currencyConfig } = useCurrency();

  const wellTypes = [
    {
      name: "Мини-скважина",
      price: `1,000 ${currencyConfig.game_currency_symbol}`,
      income: "20,000 BBL/день",
      description: "Компактная установка для первых шагов в нефтяной индустрии.",
      example: `Купив 10 мини-скважин за ${formatGameCurrency(10000)}, вы будете добывать 200,000 BBL в день.`,
      gradient: "from-yellow-600 to-yellow-700",
      color: "yellow",
      icon: <Fuel className="h-8 w-8 text-white" />
    },
    {
      name: "Стартовая скважина",
      price: `2,000 ${currencyConfig.game_currency_symbol}`,
      income: "44,000 BBL/день",
      description: "Проверенная временем установка с оптимизированной системой добычи.",
      example: `Купив 5 стартовых скважин за ${formatGameCurrency(10000)}, вы будете добывать 220,000 BBL в день.`,
      gradient: "from-amber-500 to-yellow-600",
      color: "amber",
      icon: <Fuel className="h-8 w-8 text-white" />
    },
    {
      name: "Средняя скважина", 
      price: `3,000 ${currencyConfig.game_currency_symbol}`,
      income: "72,000 BBL/день",
      description: "Сбалансированное решение с улучшенной системой извлечения.",
      example: "3 средние скважины добывают 216,000 BBL в день.",
      gradient: "from-yellow-500 to-amber-500",
      color: "yellow",
      icon: <Target className="h-8 w-8 text-white" />
    },
    {
      name: "Промышленная скважина",
      price: `5,000 ${currencyConfig.game_currency_symbol}`, 
      income: "130,000 BBL/день",
      description: "Мощная установка промышленного класса с глубоким бурением.",
      example: "2 промышленные скважины добывают 260,000 BBL в день.",
      gradient: "from-orange-500 to-amber-600",
      color: "orange",
      icon: <Settings className="h-8 w-8 text-white" />
    },
    {
      name: "Супер-скважина",
      price: `8,000 ${currencyConfig.game_currency_symbol}`,
      income: "224,000 BBL/день",
      description: "Высокотехнологичная установка с турбонаддувом и многоступенчатой системой.",
      example: "1 супер-скважина добывает 224,000 BBL ежедневно.",
      gradient: "from-amber-600 to-orange-600",
      color: "amber",
      icon: <Zap className="h-8 w-8 text-white" />
    },
    {
      name: "Премиум-скважина",
      price: `12,000 ${currencyConfig.game_currency_symbol}`,
      income: "360,000 BBL/день",
      description: "Эксклюзивная установка с алмазным буровым оборудованием и ИИ.",
      example: "1 премиум-скважина добывает стабильные 360,000 BBL ежедневно.",
      gradient: "from-yellow-400 to-amber-500",
      color: "yellow",
      icon: <Gem className="h-8 w-8 text-white" />
    },
    {
      name: "Элитная скважина",
      price: `18,000 ${currencyConfig.game_currency_symbol}`,
      income: "576,000 BBL/день", 
      description: "Королевская установка с позолоченными элементами и квантовыми сенсорами.",
      example: "1 элитная скважина добывает стабильные 576,000 BBL ежедневно.",
      gradient: "from-yellow-500 to-orange-500",
      color: "yellow",
      icon: <Crown className="h-8 w-8 text-white" />
    },
    {
      name: "Легендарная скважина",
      price: `27,000 ${currencyConfig.game_currency_symbol}`,
      income: "918,000 BBL/день",
      description: "Мифическая установка с нанотехнологиями и квантовыми процессорами.",
      example: "1 легендарная скважина добывает невероятные 918,000 BBL ежедневно.",
      gradient: "from-amber-400 to-yellow-500",
      color: "amber",
      icon: <Star className="h-8 w-8 text-white" />
    },
    {
      name: "Космическая скважина",
      price: `40,000 ${currencyConfig.game_currency_symbol}`,
      income: "1,440,000 BBL/день",
      description: "Футуристическая установка внеземных технологий с антигравитационным двигателем.",
      example: "1 космическая скважина добывает фантастические 1,440,000 BBL ежедневно.",
      gradient: "from-orange-400 to-amber-500",
      color: "orange",
      icon: <Rocket className="h-8 w-8 text-white" />
    }
  ];

  const boosterTypes = [
    {
      name: "Бригада рабочих",
      effect: "+10% за уровень",
      duration: "Постоянно",
      price: `1,000 ${currencyConfig.game_currency_symbol} за уровень`,
      description: "Увеличивает доходность всех скважин",
      example: "При добыче 10,000 BBL/день, бригада 2-го уровня (+20%) добавит 2,000 BBL в день",
      gradient: "from-amber-500 to-orange-500",
      color: "amber",
      icon: <Users className="h-6 w-6 text-white" />
    },
    {
      name: "Геологическая разведка",
      effect: "+15% за уровень", 
      duration: "Постоянно",
      price: `2,000 ${currencyConfig.game_currency_symbol} за уровень`,
      description: "Находит более продуктивные места для бурения",
      example: "Разведка 1-го уровня (+15%) превратит 10,000 BBL/день в 11,500 BBL/день (+1,500 BBL)",
      gradient: "from-yellow-500 to-amber-600",
      color: "yellow",
      icon: <Target className="h-6 w-6 text-white" />
    },
    {
      name: "Продвинутое оборудование",
      effect: "+25% за уровень",
      duration: "Постоянно", 
      price: `5,000 ${currencyConfig.game_currency_symbol} за уровень`,
      description: "Современное оборудование для максимальной добычи",
      example: "Оборудование 1-го уровня (+25%) увеличит добычу с 10,000 до 12,500 BBL в день (+2,500 BBL)",
      gradient: "from-orange-500 to-amber-700",
      color: "orange",
      icon: <Settings className="h-6 w-6 text-white" />
    },
    {
      name: "Турбо-буст",
      effect: "+50%",
      duration: "24 часа",
      price: `3,000 ${currencyConfig.game_currency_symbol}`,
      description: "Временное, но мощное ускорение всех процессов. Рекомендуется при высоком уровне добычи.",
      example: "При добыче 300,000 BBL/день буст даст +150,000 BBL за 24 часа. Окупаемость: при доходе от 6,000,000 BBL/день",
      gradient: "from-yellow-400 to-orange-600",
      color: "yellow",
      icon: <Zap className="h-6 w-6 text-white" />
    },
    {
      name: "Автоматизация",
      effect: "+20% за уровень",
      duration: "Постоянно",
      price: `4,000 ${currencyConfig.game_currency_symbol} за уровень`, 
      description: "Автоматические системы управления скважинами",
      example: "Автоматизация 2-го уровня (+40%) увеличит 10,000 BBL/день до 14,000 BBL/день (+4,000 BBL)",
      gradient: "from-amber-600 to-yellow-500",
      color: "amber",
      icon: <Wrench className="h-6 w-6 text-white" />
    }
  ];

  const upgradeExamples = [
    {
      level: "1 → 2",
      cost: "50% от цены скважины",
      effect: "+50% к доходу",
      example: `Стартовая скважина: ${formatGameCurrency(1000)} → добыча 44,000 → 66,000 BBL/день`,
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      level: "2 → 3", 
      cost: "60% от цены скважины",
      effect: "+50% к доходу",
      example: `Средняя скважина: ${formatGameCurrency(1800)} → добыча 108,000 → 162,000 BBL/день`,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      level: "3 → 4",
      cost: "72% от цены скважины", 
      effect: "+50% к доходу",
      example: `Промышленная: ${formatGameCurrency(3600)} → добыча 260,000 → 390,000 BBL/день`,
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  const strategyTips = [
    {
      icon: <Target className="h-8 w-8 text-white" />,
      title: "Стратегия новичка",
      description: "Начните с 3-5 стартовых скважин, затем переходите к средним",
      details: `Стартовые скважины дают хорошую добычу 44,000 BBL/день. Накопив ${formatGameCurrency(15000)}, покупайте средние скважины для 72,000 BBL/день.`,
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: "Средний уровень",
      description: "Комбинируйте улучшения скважин с покупкой постоянных бустеров",
      details: "Улучшайте скважины до 3-4 уровня, покупайте бригаду рабочих для увеличения добычи на +10-30% BBL.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Crown className="h-8 w-8 text-white" />,
      title: "Продвинутая игра",
      description: "Инвестируйте в элитные скважины и дорогие бустеры",
      details: "Элитные скважины + продвинутое оборудование могут добавить +25% BBL к вашей добыче.",
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  const dailyActivities = [
    {
      activity: "Ежедневный сундук",
      reward: `100-1,400 ${currencyConfig.game_currency_symbol}`,
      description: "Каждый день получайте бесплатную награду. Серия увеличивает размер награды.",
      tip: `Не пропускайте дни! Серия из 7 дней даст ${formatGameCurrency(800)}, а из 14 дней - ${formatGameCurrency(1400)}.`,
      icon: <Gift className="h-6 w-6 text-white" />,
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      activity: "Сбор BBL", 
      reward: "Накопленные BBL",
      description: "Скважины добывают BBL 24/7 в реальном времени. Собирайте их вручную в разделе 'Скважины'.",
      tip: "BBL накапливаются постоянно, даже когда вы офлайн. Чем чаще собираете - тем больше BBL! Обменивайте их на OilCoins через биржу.",
      icon: <Fuel className="h-6 w-6 text-white" />,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      activity: "Обмен валют",
      reward: "OilCoins и рубли",
      description: "Используйте биржу для обмена BBL на OilCoins, а OilCoins на рубли (1 OC = 1 ₽).",
      tip: "Обменивайте BBL на OilCoins для покупки новых скважин, а OilCoins на рубли для вывода средств или участия в розыгрышах.",
      icon: <BarChart3 className="h-6 w-6 text-white" />,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      activity: "Планирование покупок",
      reward: "Оптимизация роста",
      description: "Решайте, что покупать: новые скважины, улучшения или бустеры.",
      tip: `При добыче менее 1,000 BBL/день - покупайте скважины. Свыше 3,000 BBL/день - улучшайте и используйте бустеры.`,
      icon: <Coins className="h-6 w-6 text-white" />,
      gradient: "from-orange-500 to-amber-700"
    }
  ];

  return (
    <div className="min-h-screen hero-luxury-background">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/40 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-amber-500/30 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-primary/20 backdrop-blur-md bg-black/40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-white/70 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад на главную
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Fuel className="h-6 w-6 text-white animate-pulse" />
                <div className="absolute inset-0 h-6 w-6 text-white/30 animate-ping"></div>
              </div>
              <span className="font-bold text-white">Oil Tycoon</span>
              <div className="px-3 py-1 gradient-primary text-xs font-bold text-black rounded-full">
                ГАЙД
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-16 space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 animate-fade-in">
          <div className="relative">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-yellow-600 text-white border-0 font-bold shadow-lg">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Подробное руководство
            </Badge>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-amber-500 to-primary blur-3xl opacity-30 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-bold text-white font-playfair leading-tight animate-scale-in [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Как играть в Oil Tycoon
            </h1>
          </div>
          
          <p className="text-2xl md:text-3xl text-white max-w-3xl mx-auto leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
            Полное руководство по управлению нефтяной империей: от первых скважин до статуса магната
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <Link to="/auth">
              <Button size="lg" className="gradient-luxury shadow-luxury text-lg px-10 py-6 hover-scale animate-glow-pulse">
                <Rocket className="h-5 w-5 mr-2" />
                Начать игру
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
              <a href="#quick-start">
                <Zap className="h-5 w-5 mr-2" />
                Быстрый старт
              </a>
            </Button>
          </div>
        </div>

        {/* Wells Section */}
        <div id="wells" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-emerald-600 text-white border-0 font-bold shadow-lg">
              <Fuel className="h-4 w-4 mr-2" />
              Основа игры
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Нефтяные скважины
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Каждая скважина добывает баррели (BBL) в реальном времени 24/7
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {wellTypes.map((well, index) => (
              <Card 
                key={well.name}
                className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-emerald-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-8 space-y-4">
                  <div className={`p-4 bg-gradient-to-br ${well.gradient} rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]`}>
                    {well.icon}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {well.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <Badge className="bg-emerald-500/30 text-emerald-300 border-emerald-400/60 border font-bold text-base px-4 py-1 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                        {well.price}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.8)]">
                      {well.income}
                    </div>
                  </div>

                  <p className="text-emerald-50/90 text-center leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {well.description}
                  </p>

                  <div className="pt-4 border-t border-emerald-500/20">
                    <p className="text-sm text-emerald-100/80 text-center italic [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {well.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Boosters Section */}
        <div id="boosters" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-yellow-600 text-white border-0 font-bold shadow-lg">
              <Zap className="h-4 w-4 mr-2" />
              Ускорители
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Бустеры
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Улучшайте добычу с помощью различных ускорителей
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {boosterTypes.map((booster, index) => (
              <Card 
                key={booster.name}
                className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-yellow-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-yellow-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-8 space-y-4">
                  <div className={`p-4 bg-gradient-to-br ${booster.gradient} rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]`}>
                    {booster.icon}
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-yellow-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {booster.name}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="h-5 w-5 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">
                          {booster.effect}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-yellow-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-medium">{booster.duration}</span>
                      </div>
                    </div>

                    <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-400/60 border font-bold text-base px-4 py-1 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                      {booster.price}
                    </Badge>
                  </div>

                  <p className="text-yellow-50/90 text-center leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {booster.description}
                  </p>

                  <div className="pt-4 border-t border-yellow-500/20">
                    <p className="text-sm text-yellow-100/80 text-center italic [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      💡 {booster.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upgrades Section */}
        <div id="upgrades" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-orange-600 text-white border-0 font-bold shadow-lg">
              <TrendingUp className="h-4 w-4 mr-2" />
              Прокачка
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Улучшения скважин
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Каждое улучшение увеличивает доход на +50%
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {upgradeExamples.map((upgrade, index) => (
              <Card 
                key={upgrade.level}
                className="group relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-orange-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-8 space-y-4">
                  <div className={`p-6 bg-gradient-to-br ${upgrade.gradient} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(249,115,22,0.5)]`}>
                    <div className="text-center text-3xl font-black text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {upgrade.level}
                    </div>
                  </div>
                  
                  <div className="text-center space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Coins className="h-5 w-5 text-orange-400" />
                        <span className="text-lg font-bold text-orange-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          {upgrade.cost}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2">
                        <ArrowRight className="h-5 w-5 text-orange-400" />
                        <span className="text-2xl font-bold text-orange-400 drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]">
                          {upgrade.effect}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-orange-500/20">
                    <p className="text-sm text-orange-100/80 text-center [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {upgrade.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-50"></div>
            <CardContent className="relative p-8">
              <div className="flex items-start gap-4">
                <div className="p-4 bg-purple-500/30 rounded-2xl flex-shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    Важно знать об улучшениях
                  </h3>
                  <ul className="space-y-2 text-purple-50/90 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">•</span>
                      <span>Максимальный уровень скважины - 5 (до +250% к доходу)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">•</span>
                      <span>Стоимость увеличивается с каждым уровнем (50% → 60% → 72%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">•</span>
                      <span>Улучшайте самые продуктивные скважины в первую очередь</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 font-bold flex-shrink-0">•</span>
                      <span>Все улучшения постоянны - выгода навсегда</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Section */}
        <div id="strategies" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-cyan-600 text-white border-0 font-bold shadow-lg">
              <Target className="h-4 w-4 mr-2" />
              Тактика
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Стратегии развития
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Проверенные подходы к построению империи
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {strategyTips.map((tip, index) => (
              <Card 
                key={tip.title}
                className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-8 space-y-4">
                  <div className={`p-5 bg-gradient-to-br ${tip.gradient} rounded-2xl w-fit mx-auto group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(34,211,238,0.5)]`}>
                    {tip.icon}
                  </div>
                  
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {tip.title}
                    </h3>
                    <p className="text-lg text-cyan-50/90 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {tip.description}
                    </p>
                  </div>

                  <p className="text-cyan-50/80 text-center leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {tip.details}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Activities Section */}
        <div id="quick-start" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-pink-600 text-white border-0 font-bold shadow-lg">
              <Calendar className="h-4 w-4 mr-2" />
              Ежедневная рутина
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              Что делать каждый день
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Простой план действий для максимального роста
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {dailyActivities.map((activity, index) => (
              <Card 
                key={activity.activity}
                className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-500 hover:-translate-y-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-pink-400/40 transition-all duration-500"></div>
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </div>
                <CardContent className="relative p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 bg-gradient-to-br ${activity.gradient} rounded-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(236,72,153,0.5)]`}>
                      {activity.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-pink-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                        {activity.activity}
                      </h3>
                      <Badge className="bg-pink-500/30 text-pink-300 border-pink-400/60 border font-bold text-sm px-3 py-1 mt-2 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                        {activity.reward}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-pink-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {activity.description}
                  </p>

                  <div className="pt-4 border-t border-pink-500/20 bg-pink-500/5 -mx-8 px-8 py-4 rounded-b-lg">
                    <p className="text-sm text-pink-100/90 font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      💡 <span className="font-bold">Совет:</span> {activity.tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="text-sm px-6 py-3 bg-blue-600 text-white border-0 font-bold shadow-lg">
              <HelpCircle className="h-4 w-4 mr-2" />
              Часто задаваемые вопросы
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold font-playfair bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(251,191,36,0.8)] [text-shadow:_3px_3px_6px_rgb(0_0_0_/_90%),_-2px_-2px_4px_rgb(0_0_0_/_70%)]">
              FAQ
            </h2>
            <p className="text-xl text-white max-w-3xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Ответы на популярные вопросы игроков
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent backdrop-blur-xl border-2 border-blue-500/50 hover:border-blue-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-blue-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                    <HelpCircle className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-blue-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Как начать играть?
                    </h3>
                    <p className="text-blue-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Зарегистрируйтесь, получите стартовый бонус и купите свою первую скважину. Скважины добывают BBL автоматически 24/7.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent backdrop-blur-xl border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-purple-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                    <Coins className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-purple-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Как работает система валют?
                    </h3>
                    <p className="text-purple-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      BBL добывают скважины → обменивайте BBL на OilCoins → OilCoins можно конвертировать в рубли (1 OC = 1 ₽) для вывода.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent backdrop-blur-xl border-2 border-emerald-500/50 hover:border-emerald-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-emerald-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <Clock className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-emerald-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Нужно ли быть онлайн?
                    </h3>
                    <p className="text-emerald-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Нет! Скважины добывают BBL даже когда вы офлайн. Заходите в игру, собирайте накопленные баррели и развивайте империю.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-xl border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-orange-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-orange-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-orange-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Что лучше: новые скважины или улучшения?
                    </h3>
                    <p className="text-orange-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Сначала набирайте 5-10 скважин, затем улучшайте самые продуктивные до 3-4 уровня, потом покупайте бустеры.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-cyan-500/10 to-transparent backdrop-blur-xl border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-cyan-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-cyan-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    <Gift className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-cyan-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Как получить бесплатные OilCoins?
                    </h3>
                    <p className="text-cyan-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Открывайте ежедневный сундук (до 1,400 OC за серию), приглашайте друзей по реферальной программе, участвуйте в событиях.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-pink-500/20 via-pink-500/10 to-transparent backdrop-blur-xl border-2 border-pink-500/50 hover:border-pink-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-pink-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-pink-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-pink-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                    <BarChart3 className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-pink-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Можно ли вывести заработанное?
                    </h3>
                    <p className="text-pink-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Да! Обменяйте BBL на OilCoins, затем OilCoins на рубли и выводите на банковскую карту через раздел "Вывод средств".
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-yellow-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-yellow-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                    <Zap className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-yellow-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Какие бустеры покупать первыми?
                    </h3>
                    <p className="text-yellow-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Начните с "Бригады рабочих" (дешево, постоянный эффект). Затем "Геологическая разведка" и "Продвинутое оборудование" для мощного усиления.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-indigo-500/20 via-indigo-500/10 to-transparent backdrop-blur-xl border-2 border-indigo-500/50 hover:border-indigo-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-indigo-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                    <Wrench className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-indigo-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Складываются ли эффекты бустеров?
                    </h3>
                    <p className="text-indigo-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Да! Все постоянные бустеры суммируются. Например, Бригада 2 ур. (+20%) + Оборудование 1 ур. (+25%) = +45% к добыче всех скважин.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-teal-500/20 via-teal-500/10 to-transparent backdrop-blur-xl border-2 border-teal-500/50 hover:border-teal-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/30 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-teal-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-teal-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-teal-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(20,184,166,0.5)]">
                    <ArrowRight className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-teal-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      До какого уровня улучшать скважины?
                    </h3>
                    <p className="text-teal-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Максимум 5 уровень (до +250% к доходу). Выгоднее улучшать дорогие скважины (Элитные, Легендарные) до 3-4 уровня, чем дешевые до 5.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-rose-500/20 via-rose-500/10 to-transparent backdrop-blur-xl border-2 border-rose-500/50 hover:border-rose-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-rose-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-rose-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-rose-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.5)]">
                    <Users className="h-6 w-6 text-rose-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-rose-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Как работает реферальная программа?
                    </h3>
                    <p className="text-rose-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Приглашайте друзей по своей реферальной ссылке. Вы получаете бонус от их активности и покупок. Чем больше рефералов - тем больше пассивный доход!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-lime-500/20 via-lime-500/10 to-transparent backdrop-blur-xl border-2 border-lime-500/50 hover:border-lime-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-lime-500/30 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-lime-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-lime-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-lime-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(132,204,22,0.5)]">
                    <Star className="h-6 w-6 text-lime-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-lime-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Сколько можно заработать на рефералах?
                    </h3>
                    <p className="text-lime-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Зависит от активности рефералов. Получайте процент от их пополнений и добычи. Активные рефералы могут приносить сотни OilCoins ежемесячно!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden bg-gradient-to-br from-violet-500/20 via-violet-500/10 to-transparent backdrop-blur-xl border-2 border-violet-500/50 hover:border-violet-400 transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/30 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -right-16 -top-16 w-48 h-48 bg-violet-500/30 rounded-full blur-3xl group-hover:blur-2xl group-hover:bg-violet-400/40 transition-all duration-500"></div>
              <CardContent className="relative p-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-violet-500/30 rounded-xl flex-shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                    <Crown className="h-6 w-6 text-violet-400" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-violet-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Стоит ли покупать Турбо-буст?
                    </h3>
                    <p className="text-violet-50/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Турбо-буст (3,000 OC = 3,000,000 BBL) окупается при добыче от 6,000,000 BBL/день. При меньшем доходе лучше инвестировать в постоянные бустеры или новые скважины.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 animate-fade-in">
          <Card className="max-w-4xl mx-auto relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-yellow-500/10 to-transparent backdrop-blur-xl border-2 border-yellow-500/50">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 to-amber-600/20 opacity-70"></div>
            <CardContent className="relative p-6 sm:p-12 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.8)]">
                  <Rocket className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
                </div>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-yellow-100 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Готовы начать?
              </h3>
              <p className="text-base sm:text-xl text-yellow-50/90 max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Присоединяйтесь к тысячам игроков и постройте свою нефтяную империю уже сегодня!
              </p>
              <Link to="/auth" className="inline-block w-full sm:w-auto">
                <Button size="lg" className="gradient-luxury shadow-luxury text-base sm:text-xl px-6 sm:px-12 py-5 sm:py-7 hover-scale animate-glow-pulse w-full sm:w-auto">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" />
                  <span className="truncate">Начать играть бесплатно</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GameGuide;
