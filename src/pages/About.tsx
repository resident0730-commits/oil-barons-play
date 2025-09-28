import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Fuel, 
  ArrowLeft,
  Target,
  Shield,
  Users,
  Trophy,
  Coins,
  TrendingUp,
  Globe,
  Clock
} from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Стратегическое планирование",
      description: "Тщательно планируйте свои инвестиции и развивайте нефтяную империю"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Безопасность данных",
      description: "Мы используем современные технологии для защиты ваших данных"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Реферальная программа",
      description: "Приглашайте друзей и получайте до 10% от их инвестиций"
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: "Система достижений",
      description: "Соревнуйтесь с другими игроками за звание лучшего магната"
    },
    {
      icon: <Coins className="h-8 w-8 text-primary" />,
      title: "Бонусные программы",
      description: "Получайте дополнительные награды за активность в игре"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Аналитика операций",
      description: "Подробная статистика и графики ваших операций"
    }
  ];

  const gameRules = [
    {
      step: "1",
      title: "Регистрация",
      description: "Создайте аккаунт и получите стартовый капитал 1000₽"
    },
    {
      step: "2", 
      title: "Покупка скважин",
      description: "Инвестируйте в нефтяные скважины различных типов"
    },
    {
      step: "3",
      title: "Стабильная прибыль",
      description: "Каждая скважина приносит стабильную прибыль от операций"
    },
    {
      step: "4",
      title: "Улучшения",
      description: "Улучшайте скважины для увеличения прибыльности"
    },
    {
      step: "5",
      title: "Расширение",
      description: "Покупайте новые скважины и масштабируйте бизнес"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Назад на главную
            </Link>
            <div className="flex items-center space-x-2">
              <Fuel className="h-6 w-6 text-primary" />
              <span className="font-semibold">Oil Tycoon</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            Инвестиционная симуляция
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-yellow-300 bg-clip-text text-transparent">
            Oil Tycoon: Wealth from the Ground
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Погрузитесь в мир нефтяного бизнеса. Стройте империю, управляйте активами, 
            получайте стабильную прибыль и становитесь магнатом нефтяной индустрии.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary shadow-primary text-lg px-8 py-4">
                Начать играть
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <a href="#game-rules">Как играть</a>
            </Button>
          </div>
        </div>

        {/* Company Information */}
        <Card className="max-w-4xl mx-auto border-primary/20 shadow-luxury">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2 mb-4">
              <Globe className="h-6 w-6 text-primary" />
              Информация о компании
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-muted/50 rounded-xl">
              <h3 className="font-semibold text-lg mb-3">О проекте</h3>
              <p className="text-muted-foreground leading-relaxed">
                Oil Tycoon - образовательный симулятор для изучения экономических принципов и развития бизнес-мышления. 
                Проект создан с целью обучения основам инвестирования и управления ресурсами в безопасной игровой среде.
              </p>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-sm text-muted-foreground">
                🎓 Образовательный контент • 🔒 Безопасная среда обучения • 📊 Развитие финансовой грамотности
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Особенности игры</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oil Tycoon предлагает реалистичную симуляцию инвестиционного процесса 
              с элементами стратегического планирования
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Game Rules */}
        <div id="game-rules" className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Как играть</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Простые шаги для начала вашей нефтяной империи
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {gameRules.map((rule, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-2">
                    {rule.step}
                  </div>
                  <CardTitle className="text-lg">{rule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {rule.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Economics */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Игровая экономика</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Понимайте механики игры для максимизации прибыли
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Временные циклы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Регулярные начисления</h4>
                  <p className="text-sm text-muted-foreground">
                    Прибыль от скважин начисляется каждые 24 часа реального времени
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Бонусное время</h4>
                  <p className="text-sm text-muted-foreground">
                    В демо-режиме прибыль начисляется каждые 10 секунд для быстрого тестирования
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                  Стратегии роста
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Диверсификация</h4>
                  <p className="text-sm text-muted-foreground">
                    Покупайте скважины разных типов для стабильной прибыли
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Реинвестирование</h4>
                  <p className="text-sm text-muted-foreground">
                    Улучшайте существующие скважины для экспоненциального роста
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Готовы стать нефтяным магнатом?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Присоединяйтесь к Oil Tycoon уже сегодня и начните строить свою нефтяную империю. 
                Стартовый капитал 1000₽ ждет вас!
              </p>
              <Link to="/auth">
                <Button size="lg" className="gradient-primary shadow-primary w-full text-lg">
                  Начать игру с 1000₽
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;