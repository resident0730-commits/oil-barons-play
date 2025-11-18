import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Fuel, 
  ArrowLeft,
  Target,
  TrendingUp,
  Zap,
  Users,
  Trophy,
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
  Shield,
  Rocket,
  Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrency } from "@/hooks/useCurrency";

const GameGuide = () => {
  const { formatGameCurrency, formatGameCurrencyWithName, currencyConfig } = useCurrency();

  const wellTypes = [
    {
      name: "Мини-скважина",
      price: `1,000 ${currencyConfig.game_currency_symbol}`,
      income: "20 BBL/день",
      description: "Компактная установка для первых шагов в нефтяной индустрии.",
      example: `Купив 10 мини-скважин за ${formatGameCurrency(10000)}, вы будете добывать 200 BBL в день.`,
      gradient: "from-yellow-600 to-yellow-700",
      icon: <Fuel className="h-8 w-8 text-white" />
    },
    {
      name: "Стартовая скважина",
      price: `2,000 ${currencyConfig.game_currency_symbol}`,
      income: "44 BBL/день",
      description: "Проверенная временем установка с оптимизированной системой добычи.",
      example: `Купив 5 стартовых скважин за ${formatGameCurrency(10000)}, вы будете добывать 220 BBL в день.`,
      gradient: "from-amber-500 to-yellow-600",
      icon: <Fuel className="h-8 w-8 text-white" />
    },
    {
      name: "Средняя скважина", 
      price: `3,000 ${currencyConfig.game_currency_symbol}`,
      income: "72 BBL/день",
      description: "Сбалансированное решение с улучшенной системой извлечения.",
      example: "3 средние скважины добывают 216 BBL в день и окупаются за 8.3 дня.",
      gradient: "from-yellow-500 to-amber-500",
      icon: <Target className="h-8 w-8 text-white" />
    },
    {
      name: "Промышленная скважина",
      price: `5,000 ${currencyConfig.game_currency_symbol}`, 
      income: "130 BBL/день",
      description: "Мощная установка промышленного класса с глубоким бурением.",
      example: "2 промышленные скважины добывают 260 BBL в день и окупаются за 7.7 дня.",
      gradient: "from-orange-500 to-amber-600",
      icon: <Settings className="h-8 w-8 text-white" />
    },
    {
      name: "Супер-скважина",
      price: `8,000 ${currencyConfig.game_currency_symbol}`,
      income: "224 BBL/день",
      description: "Высокотехнологичная установка с турбонаддувом и многоступенчатой системой.",
      example: "1 супер-скважина окупается за 7.1 дня и добывает 224 BBL ежедневно.",
      gradient: "from-amber-600 to-orange-600",
      icon: <Zap className="h-8 w-8 text-white" />
    },
    {
      name: "Премиум-скважина",
      price: `12,000 ${currencyConfig.game_currency_symbol}`,
      income: "360 BBL/день",
      description: "Эксклюзивная установка с алмазным буровым оборудованием и ИИ.",
      example: "1 премиум-скважина окупается за 6.7 дня и добывает стабильные 360 BBL ежедневно.",
      gradient: "from-yellow-400 to-amber-500",
      icon: <Gem className="h-8 w-8 text-white" />
    },
    {
      name: "Элитная скважина",
      price: `18,000 ${currencyConfig.game_currency_symbol}`,
      income: "576 BBL/день", 
      description: "Королевская установка с позолоченными элементами и квантовыми сенсорами.",
      example: "1 элитная скважина окупается за 6.3 дня и добывает стабильные 576 BBL ежедневно.",
      gradient: "from-yellow-500 to-orange-500",
      icon: <Crown className="h-8 w-8 text-white" />
    },
    {
      name: "Легендарная скважина",
      price: `27,000 ${currencyConfig.game_currency_symbol}`,
      income: "918 BBL/день",
      description: "Мифическая установка с нанотехнологиями и квантовыми процессорами.",
      example: "1 легендарная скважина окупается за 5.9 дня и добывает невероятные 918 BBL ежедневно.",
      gradient: "from-amber-400 to-yellow-500",
      icon: <Star className="h-8 w-8 text-white" />
    },
    {
      name: "Космическая скважина",
      price: `40,000 ${currencyConfig.game_currency_symbol}`,
      income: "1,440 BBL/день",
      description: "Футуристическая установка внеземных технологий с антигравитационным двигателем.",
      example: "1 космическая скважина окупается за 5.6 дня и добывает фантастические 1,440 BBL ежедневно.",
      gradient: "from-orange-400 to-amber-500",
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
      example: "При добыче 3,000 BBL/день, бригада 2-го уровня (+20%) добавит 600 BBL в день",
      gradient: "from-amber-500 to-orange-500",
      icon: <Users className="h-6 w-6 text-white" />
    },
    {
      name: "Геологическая разведка",
      effect: "+15% за уровень", 
      duration: "Постоянно",
      price: `2,000 ${currencyConfig.game_currency_symbol} за уровень`,
      description: "Находит более продуктивные места для бурения",
      example: "Разведка 1-го уровня (+15%) превратит 2,000 BBL/день в 2,300 BBL/день",
      gradient: "from-yellow-500 to-amber-600",
      icon: <Target className="h-6 w-6 text-white" />
    },
    {
      name: "Продвинутое оборудование",
      effect: "+25% за уровень",
      duration: "Постоянно", 
      price: `5,000 ${currencyConfig.game_currency_symbol} за уровень`,
      description: "Современное оборудование для максимальной добычи",
      example: "Оборудование 1-го уровня увеличит добычу с 5,000 до 6,250 BBL в день",
      gradient: "from-orange-500 to-amber-700",
      icon: <Settings className="h-6 w-6 text-white" />
    },
    {
      name: "Турбо-буст",
      effect: "+50%",
      duration: "24 часа",
      price: `3,000 ${currencyConfig.game_currency_symbol}`,
      description: "Временное, но мощное ускорение всех процессов",
      example: "За 24 часа добыча 4,000 BBL/день превратится в 6,000 BBL/день",
      gradient: "from-yellow-400 to-orange-600",
      icon: <Zap className="h-6 w-6 text-white" />
    },
    {
      name: "Автоматизация",
      effect: "+20% за уровень",
      duration: "Постоянно",
      price: `4,000 ${currencyConfig.game_currency_symbol} за уровень`, 
      description: "Автоматические системы управления скважинами",
      example: "Автоматизация 2-го уровня (+40%) увеличит 3,000 BBL/день до 4,200 BBL/день",
      gradient: "from-amber-600 to-yellow-500",
      icon: <Wrench className="h-6 w-6 text-white" />
    }
  ];

  const upgradeExamples = [
    {
      level: "1 → 2",
      cost: "50% от цены скважины",
      effect: "+20% к доходу",
      example: `Стартовая скважина: ${formatGameCurrency(500)} → добыча 44 → 53 BBL/день`,
      gradient: "from-yellow-500 to-amber-600"
    },
    {
      level: "2 → 3", 
      cost: "60% от цены скважины",
      effect: "+20% к новому доходу",
      example: `Средняя скважина: ${formatGameCurrency(1800)} → добыча 72 → 86 BBL/день`,
      gradient: "from-amber-500 to-orange-500"
    },
    {
      level: "3 → 4",
      cost: "72% от цены скважины", 
      effect: "+20% к новому доходу",
      example: `Промышленная: ${formatGameCurrency(4680)} → добыча 130 → 156 BBL/день`,
      gradient: "from-orange-500 to-amber-600"
    }
  ];

  const strategyTips = [
    {
      icon: <Target className="h-8 w-8 text-white" />,
      title: "Стратегия новичка",
      description: "Начните с 3-5 стартовых скважин, затем переходите к средним",
      details: `Стартовые скважины дают быструю окупаемость за 4.5 дня. Накопив ${formatGameCurrency(15000)}, покупайте средние скважины.`,
      gradient: "from-yellow-500 to-amber-500"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-white" />,
      title: "Средний уровень",
      description: "Комбинируйте улучшения скважин с покупкой постоянных бустеров",
      details: "Улучшайте скважины до 3-4 уровня, покупайте бригаду рабочих для +10-30% ко всему доходу.",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: <Crown className="h-8 w-8 text-white" />,
      title: "Продвинутая игра",
      description: "Инвестируйте в элитные скважины и дорогие бустеры",
      details: "Элитные скважины + продвинутое оборудование могут дать +25% к огромному доходу.",
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
            <Badge variant="secondary" className="text-sm px-6 py-3 gradient-primary text-black border-0 shadow-luxury animate-scale-in">
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

          {/* Currency Info */}
          <div className="max-w-4xl mx-auto mt-12">
            <Card className="bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury animate-border-glow">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="p-3 gradient-primary rounded-full">
                    <Coins className="h-6 w-6 text-black" />
                  </div>
                </div>
                <CardTitle className="text-3xl md:text-4xl font-bold text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Система валют
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-base md:text-lg text-white text-center [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Oil Tycoon использует трехвалютную систему для полноценной игровой экономики
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {/* OilCoins */}
                  <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg border-2 border-primary/40">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Coins className="h-8 w-8 text-primary" />
                      <h3 className="text-2xl font-bold text-white">OilCoins</h3>
                    </div>
                    <Badge className="mb-3 w-full justify-center text-lg">OC</Badge>
                    <p className="text-white text-center mb-3">Основная валюта для покупок</p>
                    <ul className="text-sm text-white/90 space-y-2">
                      <li>✓ Покупка скважин</li>
                      <li>✓ Покупка бустеров</li>
                      <li>✓ Улучшение скважин</li>
                      <li>✓ Покупка пакетов</li>
                    </ul>
                  </div>

                  {/* Barrels */}
                  <div className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-lg border-2 border-amber-500/40">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Fuel className="h-8 w-8 text-amber-500" />
                      <h3 className="text-2xl font-bold text-white">BBL</h3>
                    </div>
                    <Badge className="mb-3 w-full justify-center text-lg bg-amber-500/20 text-amber-300 border-amber-500/40">BBL</Badge>
                    <p className="text-white text-center mb-3">Производственная валюта</p>
                    <ul className="text-sm text-white/90 space-y-2">
                      <li>✓ Добываются скважинами 24/7</li>
                      <li>✓ Накапливаются в реальном времени</li>
                      <li>✓ Собирайте вручную</li>
                      <li>✓ Обменивайте на OilCoins</li>
                    </ul>
                  </div>

                  {/* Rubles */}
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border-2 border-green-500/40">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <BarChart3 className="h-8 w-8 text-green-500" />
                      <h3 className="text-2xl font-bold text-white">Рубли</h3>
                    </div>
                    <Badge className="mb-3 w-full justify-center text-lg bg-green-500/20 text-green-300 border-green-500/40">₽</Badge>
                    <p className="text-white text-center mb-3">Игровая валюта для вывода</p>
                    <ul className="text-sm text-white/90 space-y-2">
                      <li>✓ Получайте через обмен OC</li>
                      <li>✓ 1 OC = 1 рубль</li>
                      <li>✓ Выводите на реальные средства</li>
                      <li>✓ Участвуйте в розыгрышах</li>
                    </ul>
                  </div>
                </div>

                {/* Exchange System */}
                <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border-2 border-purple-500/40 mt-6">
                  <h3 className="text-2xl font-bold text-white text-center mb-4 flex items-center justify-center gap-2">
                    <ArrowRight className="h-6 w-6" />
                    Биржа обмена
                    <ArrowRight className="h-6 w-6" />
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <p className="text-white font-bold mb-2">BBL → OilCoins</p>
                      <p className="text-white/80 text-sm">Обменивайте добытые BBL на OilCoins для покупок</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <p className="text-white font-bold mb-2">OilCoins → Рубли</p>
                      <p className="text-white/80 text-sm">Фиксированный курс: 1 OC = 1 рубль</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Start */}
        <div id="quick-start" className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Rocket className="h-12 w-12 md:h-16 md:w-16" />
              Быстрый старт
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Первые шаги для успешного старта в Oil Tycoon
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Регистрация", desc: `Создайте аккаунт и получите стартовый капитал ${formatGameCurrency(1000)}`, badge: "Бесплатно", gradient: "from-primary to-amber-500" },
              { step: "2", title: "Первая скважина", desc: `Купите скважину за OilCoins. Она начнёт добывать BBL 24/7`, badge: "44 BBL/день", gradient: "from-amber-500 to-yellow-600" },
              { step: "3", title: "Собирайте BBL", desc: "Собирайте накопленные BBL в разделе 'Скважины' и обменивайте на OC через биржу", badge: "Каждый час", gradient: "from-yellow-600 to-orange-500" },
              { step: "4", title: "Расширяйтесь", desc: "Покупайте новые скважины, обменивайте валюты и выводите средства", badge: "Масштабируйте", gradient: "from-orange-500 to-primary" }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 bg-transparent border-2 border-primary/30 backdrop-blur-xl hover-scale group animate-border-glow">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.gradient} text-white rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4 shadow-lg group-hover:animate-bounce`}>
                    {item.step}
                  </div>
                  <CardTitle className="text-2xl md:text-3xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white text-base md:text-lg leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {item.desc}
                  </p>
                  <Badge className={`bg-gradient-to-r ${item.gradient} text-white border-0 shadow-md`}>
                    {item.badge}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Wells Guide */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Fuel className="h-12 w-12 md:h-16 md:w-16" />
              Типы скважин и их экономика
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Подробный разбор каждого типа скважин с примерами доходности
            </p>
          </div>

          {/* Important Note */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/40 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/30 rounded-full flex-shrink-0">
                    <Fuel className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Важно: О доходах скважин</h3>
                    <p className="text-white/90 leading-relaxed">
                      Все скважины добывают <span className="font-bold text-amber-400">BBL (баррели)</span> в реальном времени 24/7. 
                      Указанный доход - это количество BBL в день. Собирайте BBL вручную в разделе "Скважины" и 
                      обменивайте их на <span className="font-bold text-primary">OilCoins</span> через биржу для покупки новых активов.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellTypes.map((well, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 bg-transparent border-2 border-primary/30 backdrop-blur-xl hover-scale group overflow-hidden animate-border-glow">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${well.gradient}`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-r ${well.gradient} rounded-full shadow-lg group-hover:animate-pulse`}>
                        {well.icon}
                      </div>
                      <CardTitle className="text-2xl md:text-3xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{well.name}</CardTitle>
                    </div>
                    <Badge className={`bg-gradient-to-r ${well.gradient} text-white border-0 font-bold shadow-md`}>
                      {well.income}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-base md:text-lg">
                    <span className="text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость: {well.price}</span>
                    <span className="text-white font-medium [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      Окупаемость: {Math.round(parseInt(well.price.replace(/[^\d]/g, '')) / parseInt(well.income.replace(/[^\d]/g, '')))} дней
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base md:text-lg text-white leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {well.description}
                  </p>
                  <div className={`p-4 bg-gradient-to-r ${well.gradient} bg-opacity-10 rounded-lg border border-white/10`}>
                    <p className="text-base md:text-lg font-medium text-white mb-1 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      <Sparkles className="h-4 w-4" />
                      Пример использования:
                    </p>
                    <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {well.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Upgrades Guide */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <TrendingUp className="h-12 w-12 md:h-16 md:w-16" />
              Система улучшений
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Как работают улучшения скважин и когда их стоит покупать
            </p>
          </div>

          <Card className="max-w-4xl mx-auto bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury animate-border-glow">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl text-center text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Механика улучшений</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                <p className="text-base md:text-lg text-white mb-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] flex items-center justify-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Каждое улучшение увеличивает доход скважины на 20%
                </p>
                <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] flex items-center justify-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Стоимость улучшения растет с каждым уровнем: 50% → 60% → 72% от базовой цены
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {upgradeExamples.map((upgrade, index) => (
                  <Card key={index} className="bg-transparent border border-primary/20 backdrop-blur-sm hover-scale group">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${upgrade.gradient}`}></div>
                    <CardHeader className="text-center pb-3">
                      <Badge className={`bg-gradient-to-r ${upgrade.gradient} text-white border-0 font-bold mb-2`}>
                        Уровень {upgrade.level}
                      </Badge>
                      <CardTitle className="text-xl md:text-2xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{upgrade.effect}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-center">
                        <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость:</p>
                        <p className="font-bold text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{upgrade.cost}</p>
                      </div>
                      <Separator className="bg-white/10" />
                      <div className={`p-3 bg-gradient-to-r ${upgrade.gradient} bg-opacity-10 rounded-lg border border-white/10`}>
                        <p className="text-sm md:text-base font-medium text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Пример:</p>
                        <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                          {upgrade.example}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                <p className="text-base md:text-lg font-medium text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] flex items-center justify-center gap-2">
                  <Coins className="h-5 w-5" />
                  Когда улучшать?
                </p>
                <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Улучшайте скважины когда у вас стабильный доход {formatGameCurrency(2000)}+ в день. 
                  Улучшение окупается за 5-10 дней, но дает прибыль навсегда!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boosters Guide */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Zap className="h-12 w-12 md:h-16 md:w-16" />
              Система бустеров
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Подробное руководство по всем бустерам и их эффективному использованию
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boosterTypes.map((booster, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 bg-transparent border-2 border-primary/30 backdrop-blur-xl hover-scale group overflow-hidden animate-border-glow">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${booster.gradient}`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-gradient-to-r ${booster.gradient} rounded-full shadow-lg group-hover:animate-pulse`}>
                        {booster.icon}
                      </div>
                      <CardTitle className="text-xl md:text-2xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{booster.name}</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`bg-gradient-to-r ${booster.gradient} text-white border-0 font-bold`}>
                      {booster.effect}
                    </Badge>
                    <span className="text-sm text-white/60">{booster.duration}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-base md:text-lg font-medium mb-1 text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Стоимость: {booster.price}</p>
                    <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{booster.description}</p>
                  </div>
                  <div className={`p-3 bg-gradient-to-r ${booster.gradient} bg-opacity-10 rounded-lg border border-white/10`}>
                    <p className="text-sm md:text-base font-medium text-white mb-1 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      <Sparkles className="h-3 w-3" />
                      Пример расчета:
                    </p>
                    <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {booster.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-4xl mx-auto bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury animate-border-glow">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl text-center text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] flex items-center justify-center gap-3">
                <BarChart3 className="h-10 w-10" />
                Калькулятор эффективности бустеров
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                  <p className="text-base md:text-lg text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">При доходе {formatGameCurrency(1000)}/день</p>
                  <p className="font-bold text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Бригада 1 ур. → +{formatGameCurrency(100)}/день</p>
                  <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупается за 10 дней</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                  <p className="text-base md:text-lg text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">При доходе {formatGameCurrency(5000)}/день</p>
                  <p className="font-bold text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Оборудование 1 ур. → +{formatGameCurrency(1250)}/день</p>
                  <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупается за 4 дня</p>
                </div>
                <div className="p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                  <p className="text-base md:text-lg text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">При доходе {formatGameCurrency(10000)}/день</p>
                  <p className="font-bold text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Все бустеры → +{formatGameCurrency(7000)}/день</p>
                  <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Окупается за 2-3 дня</p>
                </div>
              </div>
              <div className="text-center p-4 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                <p className="text-base md:text-lg font-medium text-white mb-1 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)] flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5" />
                  Совет эксперта:
                </p>
                <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Бустеры эффективнее при высоком доходе! Если у вас менее {formatGameCurrency(2000)}/день - сначала купите больше скважин.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategies */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Target className="h-12 w-12 md:h-16 md:w-16" />
              Стратегии развития
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Проверенные стратегии для разных этапов игры
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {strategyTips.map((strategy, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 bg-transparent border-2 border-primary/30 backdrop-blur-xl hover-scale group h-full overflow-hidden animate-border-glow">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${strategy.gradient}`}></div>
                <CardHeader>
                  <div className={`mx-auto mb-4 p-4 bg-gradient-to-r ${strategy.gradient} rounded-full w-fit shadow-lg group-hover:animate-pulse`}>
                    {strategy.icon}
                  </div>
                  <CardTitle className="text-3xl md:text-4xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{strategy.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base md:text-lg text-white leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {strategy.description}
                  </p>
                  <div className={`p-4 bg-gradient-to-r ${strategy.gradient} bg-opacity-10 rounded-lg border border-white/10`}>
                    <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {strategy.details}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Daily Activities */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Calendar className="h-12 w-12 md:h-16 md:w-16" />
              Ежедневные активности
            </h2>
            <p className="text-xl md:text-2xl text-white max-w-2xl mx-auto [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
              Что делать каждый день для максимальной эффективности
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {dailyActivities.map((activity, index) => (
              <Card key={index} className="hover:shadow-2xl transition-all duration-300 bg-transparent border-2 border-primary/30 backdrop-blur-xl hover-scale group overflow-hidden animate-border-glow">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${activity.gradient}`}></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl md:text-2xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">{activity.activity}</CardTitle>
                    <div className={`p-2 bg-gradient-to-r ${activity.gradient} rounded-full shadow-lg group-hover:animate-pulse`}>
                      {activity.icon}
                    </div>
                  </div>
                  <Badge className={`bg-gradient-to-r ${activity.gradient} text-white border-0 font-bold w-fit`}>
                    {activity.reward}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    {activity.description}
                  </p>
                  <div className={`p-3 bg-gradient-to-r ${activity.gradient} bg-opacity-10 rounded-lg border border-white/10`}>
                    <p className="text-sm md:text-base font-medium text-white mb-1 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      <Sparkles className="h-3 w-3" />
                      Совет:
                    </p>
                    <p className="text-sm md:text-base text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                      {activity.tip}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Tips */}
        <div className="space-y-10">
          <div className="text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white flex items-center justify-center gap-4">
              <Trophy className="h-12 w-12 md:h-16 md:w-16" />
              Секреты профессионалов
            </h2>
          </div>

          <Card className="max-w-4xl mx-auto bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury overflow-hidden animate-border-glow">
            <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl text-center flex items-center justify-center gap-3 text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                <Crown className="h-8 w-8 text-white animate-pulse" />
                Формула успеха в Oil Tycoon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <BarChart3 className="h-5 w-5" />
                    Математика прибыли
                  </h3>
                  <div className="space-y-2 text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <p><strong>ROI скважин:</strong> Стартовая 22%, Средняя 12%, Промышленная 10%</p>
                    <p><strong>Лучший ROI:</strong> Улучшения скважин (20% за 5-10 дней окупаемости)</p>
                    <p><strong>Бустеры:</strong> Эффективны при доходе {formatGameCurrency(3000)}+ в день</p>
                    <p><strong>Турбо-буст:</strong> Используйте когда планируете быть онлайн 24 часа</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <Clock className="h-5 w-5" />
                    Тайминг решений
                  </h3>
                  <div className="space-y-2 text-base md:text-lg text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                    <p><strong>0-{formatGameCurrency(1000)}/день:</strong> Покупайте только стартовые скважины</p>
                    <p><strong>{formatGameCurrency(1000)}-{formatGameCurrency(5000)}/день:</strong> Переходите на средние скважины</p>
                    <p><strong>{formatGameCurrency(5000)}+ в день:</strong> Улучшайте существующие + бустеры</p>
                    <p><strong>{formatGameCurrency(20000)}+ в день:</strong> Элитные скважины + все бустеры</p>
                  </div>
                </div>
              </div>
              
              <Separator className="bg-white/10" />
              
              <div className="text-center p-6 bg-gradient-to-r from-primary/20 to-amber-500/20 rounded-lg border border-primary/30">
                <p className="font-bold text-xl md:text-2xl text-white mb-2 flex items-center justify-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Target className="h-5 w-5" />
                  Главное правило
                </p>
                <p className="text-base md:text-lg text-white leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Не торопитесь! Oil Tycoon - игра на терпение. Лучше медленно, но стабильно наращивать активы, 
                  чем тратить все сразу на дорогие скважины без поддержки бустерами.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div id="faq">
          <Card className="bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury animate-border-glow">
            <CardHeader className="text-center pb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
                <CardTitle className="text-4xl md:text-5xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Часто задаваемые вопросы
                </CardTitle>
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
              </div>
              <p className="text-lg text-white/80 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Ответы на популярные вопросы о валютной системе
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question 1 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Coins className="h-5 w-5 text-primary" />
                  Зачем нужны три вида валюты?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Система из трёх валют создаёт многоуровневую экономику: <strong>BBL</strong> вы добываете скважинами, 
                  <strong>OilCoins</strong> получаете за обмен и используете для покупок в игре, а <strong>Рубли</strong> - это реальная 
                  валюта, которую можно вывести. Такая система делает игру интереснее и даёт больше возможностей для стратегии.
                </p>
              </div>

              {/* Question 2 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <ArrowRight className="h-5 w-5 text-amber-500" />
                  Как получить OilCoins?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Есть несколько способов: обменять BBL на OilCoins в разделе "Обмен валют", получить в награду за достижения, 
                  открыть в ежедневных сундуках, получить бонусы от рефералов или просто пополнить баланс. OilCoins нужны для покупки 
                  скважин, бустеров и участия в розыгрышах.
                </p>
              </div>

              {/* Question 3 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Shield className="h-5 w-5 text-green-500" />
                  Могу ли я вывести OilCoins?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Нет, OilCoins — это внутриигровая валюта, которую нельзя напрямую вывести. Но вы можете обменять OilCoins на рубли 
                  по курсу 1:1, а затем вывести рубли. Важно помнить, что обратный обмен (рубли на OilCoins) тоже доступен, если вам 
                  нужна игровая валюта.
                </p>
              </div>

              {/* Question 4 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  Какой курс обмена валют?
                </h3>
                <p className="text-white/90 leading-relaxed mb-3 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Курсы обмена фиксированные и прозрачные:
                </p>
                <ul className="space-y-2 text-white/90 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <li>• <strong>BBL → OilCoins:</strong> курс зависит от текущих настроек игры</li>
                  <li>• <strong>OilCoins ⇄ Рубли:</strong> 1 OC = 1 ₽ (обмен в обе стороны)</li>
                </ul>
              </div>

              {/* Question 5 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Clock className="h-5 w-5 text-orange-500" />
                  Как часто можно собирать BBL?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  BBL накапливаются автоматически от ваших скважин 24/7. Собирать их можно в любое время без ограничений - 
                  просто заходите в игру и нажимайте кнопку "Собрать BBL". Рекомендуется заходить минимум раз в день, чтобы 
                  не терять накопленные BBL и не пропускать ежедневные бонусы.
                </p>
              </div>

              {/* Question 6 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Gem className="h-5 w-5 text-purple-500" />
                  Что лучше: копить BBL или сразу обменивать?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Зависит от вашей стратегии! Если вы хотите быстро купить новую скважину или бустер - обменивайте BBL на OilCoins 
                  сразу. Если у вас уже есть хороший доход и вы играете долгосрочно - можете копить BBL и обменивать крупными 
                  суммами. Помните: BBL не теряются и не обесцениваются, так что выбор за вами!
                </p>
              </div>

              {/* Question 7 */}
              <div className="p-6 bg-black/40 border border-primary/20 rounded-lg hover:border-primary/40 transition-all">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2 [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Можно ли потерять валюту?
                </h3>
                <p className="text-white/90 leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                  Нет, вся ваша валюта в безопасности! BBL, OilCoins и рубли хранятся на вашем аккаунте и никуда не пропадут.
                  Единственный способ потратить валюту - это сделать покупку или обмен самостоятельно. Даже если вы долго не заходите 
                  в игру, ваши средства остаются нетронутыми.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-transparent border-2 border-primary/30 backdrop-blur-xl shadow-luxury animate-border-glow">
            <CardHeader>
              <CardTitle className="text-4xl md:text-5xl text-white [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">Готовы применить знания?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base md:text-lg text-white leading-relaxed [text-shadow:_2px_2px_4px_rgb(0_0_0_/_90%)]">
                Теперь у вас есть все знания для успешной игры в Oil Tycoon. 
                Начните свою нефтяную империю прямо сейчас!
              </p>
              <Link to="/auth">
                <Button size="lg" className="gradient-luxury shadow-luxury w-full text-lg hover-scale">
                  <Rocket className="h-5 w-5 mr-2" />
                  Начать игру с {formatGameCurrency(1000)}
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