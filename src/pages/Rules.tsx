import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Gift, Zap, Trophy, Shield, Heart } from 'lucide-react';

export default function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Правила игры</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Честная игра с прозрачными правилами. Развивайте свою нефтяную империю!
          </p>
        </div>

        {/* Основные принципы */}
        <Card className="gradient-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Наши принципы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Честная игра</h4>
                  <p className="text-sm text-muted-foreground">
                    Все можно получить бесплатно через игровую активность
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Ежедневные бонусы</h4>
                  <p className="text-sm text-muted-foreground">
                    Получайте игровую валюту каждый день бесплатно
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Игровая валюта */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              Игровая валюта
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold">Способы получения монет:</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">+100</Badge>
                  <span className="text-sm">Ежедневный бонус (каждые 24 часа)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">+50-500</Badge>
                  <span className="text-sm">Доходность скважин в день (автоматически)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">+1000</Badge>
                  <span className="text-sm">Стартовый капитал для новых игроков</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Скоро</Badge>
                  <span className="text-sm">Задания и достижения</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                🎮 Два пути к успеху
              </h4>
              <div className="space-y-2 text-sm text-green-600 dark:text-green-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Бесплатная игра:</span>
                  <span>Ежедневные бонусы 100 монет каждые 24 часа</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Быстрый путь:</span>
                  <span>Пополнение реальными деньгами для ускорения</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Скважины */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Система скважин
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Типы скважин:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Стартовая</span>
                    <Badge variant="outline">500 монет</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Средняя</span>
                    <Badge variant="outline">1,500 монет</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Премиум</span>
                    <Badge variant="outline">5,000 монет</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Элитная</span>
                    <Badge variant="outline">15,000 монет</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Особенности:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Улучшение повышает доходность</li>
                  <li>• Каждая скважина приносит доход каждый день</li>
                  <li>• Более дорогие скважины = больше дохода</li>
                  <li>• Доход накапливается автоматически</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Пакеты */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              Пакеты скважин
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Экономьте на покупке сразу нескольких скважин! Пакеты дают скидку до 30%.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Стартовый пакет</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  3 стартовые скважины со скидкой 20%
                </p>
                <Badge variant="secondary">1,200 монет вместо 1,500</Badge>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Бизнес пакет</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Микс скважин разных типов со скидкой 25%
                </p>
                <Badge variant="secondary">От 5,000 монет</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Справедливость */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">
              🎯 Справедливая игра
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-500/10 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Наши гарантии:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Никаких обязательных платежей - все доступно бесплатно</li>
                <li>✅ Ежедневные бонусы для всех игроков</li>
                <li>✅ Прозрачная система доходов</li>
                <li>✅ Возможность получить лучшие скважины через игру</li>
                <li>✅ Никаких скрытых комиссий или ограничений</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Игра создана для удовольствия, а не для выкачивания денег. 
              Наслаждайтесь честной игрой! 🎮
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}