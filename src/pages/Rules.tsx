import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Coins, Gift, Zap, Trophy, Shield, Heart, Sparkles, ArrowLeft, Home, Users, Award, Crown, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Rules() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              На главную
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              В игру
            </Button>
          </Link>
        </div>

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
              <h4 className="font-semibold">Способы получения оилкоинов:</h4>
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
                  <Badge variant="secondary">+500-25,000</Badge>
                  <span className="text-sm">Награды за достижения</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary">+10%</Badge>
                  <span className="text-sm">Реферальные бонусы с доходов друзей</span>
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
                  <span>Ежедневные бонусы 100 оилкоинов каждые 24 часа</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Быстрый путь:</span>
                  <span>Пополнение реальными деньгами для ускорения</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Реферальная система */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Реферальная система
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Приглашайте друзей и зарабатывайте вместе! Взаимовыгодная система, где все остаются в плюсе.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Для реферера (кто приглашает):</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">10%</Badge>
                    <span>От всех доходов рефералов навсегда</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">5 рефералов</Badge>
                    <span>Бесплатная Starter Well</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">15 рефералов</Badge>
                    <span>Turbo Boost на 30 дней</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">50 рефералов</Badge>
                    <span>Premium Well бесплатно</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">100 рефералов</Badge>
                    <span>VIP статус с особыми привилегиями</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Для реферала (кого пригласили):</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Badge variant="secondary">+50%</Badge>
                    <span>К доходу от всех скважин на 7 дней</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Обычный старт</Badge>
                    <span>1,000 OC стартовый капитал</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline">Ускоренный рост</Badge>
                    <span>Быстрое развитие благодаря бонусу</span>
                  </li>
                </ul>
                
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 text-sm">
                    📋 Как использовать код?
                  </h5>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    Введите реферальный код друга в разделе "Рефералы" в игре
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Система достижений */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Система достижений
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Выполняйте задания и получайте награды! 13 уникальных достижений в 4 категориях.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  🏭 Категория "Магнат"
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Первая скважина</span>
                    <Badge variant="outline">+500 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Миллионер</span>
                    <Badge variant="outline">+10,000 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Промышленник (10 скважин)</span>
                    <Badge variant="outline">Бустер</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Нефтяной король</span>
                    <Badge variant="outline">Статус +5%</Badge>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-3 mt-4 flex items-center gap-2">
                  🎯 Категория "Коллекционер"
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Разнообразие (все типы скважин)</span>
                    <Badge variant="outline">+5,000 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Мастер усилителей</span>
                    <Badge variant="outline">+3,000 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Крупный покупатель</span>
                    <Badge variant="outline">20% скидка</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  📅 Категория "Активность"
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Постоянство (30 дней подряд)</span>
                    <Badge variant="outline">+15,000 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Везунчик (100 бонусов)</span>
                    <Badge variant="outline">Бустер</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Лидер (топ-10)</span>
                    <Badge variant="outline">Статус +3%</Badge>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-3 mt-4 flex items-center gap-2">
                  🤝 Категория "Социальная"
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Наставник (10 рефералов)</span>
                    <Badge variant="outline">+25,000 OC</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Амбассадор (100 рефералов)</span>
                    <Badge variant="outline">Статус +10%</Badge>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">Помощник (10 тикетов)</span>
                    <Badge variant="outline">+2,000 OC</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Система статусов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-500" />
              Система статусов и бонусов
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Эксклюзивные статусы дают постоянные бонусы к доходности. Получайте через достижения!
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Статусы доходности:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Нефтяной король</span>
                    </div>
                    <Badge variant="secondary">+5% доход</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Лидер</span>
                    </div>
                    <Badge variant="secondary">+3% доход</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Промышленник</span>
                    </div>
                    <Badge variant="secondary">+2% доход</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Социальные статусы:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Амбассадор</span>
                    </div>
                    <Badge variant="secondary">+10% реф. бонус</Badge>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                  <h5 className="font-semibold text-purple-700 dark:text-purple-300 text-sm mb-2">
                    ✨ Как работают статусы?
                  </h5>
                  <ul className="text-xs text-purple-600 dark:text-purple-400 space-y-1">
                    <li>• Статусы получаются автоматически за достижения</li>
                    <li>• Бонусы к доходности применяются ко всем скважинам</li>
                    <li>• Эффекты суммируются с бустерами</li>
                    <li>• Статусы действуют постоянно</li>
                  </ul>
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
                <h4 className="font-semibold mb-3">Доступные скважины:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">🌱 Мини-скважина</span>
                    <div className="text-right">
                      <Badge variant="outline">1,000 OC</Badge>
                      <div className="text-xs text-green-600">+100 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">🔸 Стартовая скважина</span>
                    <div className="text-right">
                      <Badge variant="outline">2,000 OC</Badge>
                      <div className="text-xs text-green-600">+220 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">⚡ Средняя скважина</span>
                    <div className="text-right">
                       <Badge variant="outline">3,000 OC</Badge>
                      <div className="text-xs text-green-600">+360 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">🏭 Промышленная</span>
                    <div className="text-right">
                      <Badge variant="outline">5,000 OC</Badge>
                      <div className="text-xs text-green-600">+650 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">💎 Супер скважина</span>
                    <div className="text-right">
                      <Badge variant="outline">8,000 OC</Badge>
                      <div className="text-xs text-green-600">+1,120 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">👑 Премиум скважина</span>
                    <div className="text-right">
                      <Badge variant="outline">12,000 OC</Badge>
                      <div className="text-xs text-green-600">+1,800 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">💠 Элитная скважина</span>
                    <div className="text-right">
                      <Badge variant="outline">18,000 OC</Badge>
                      <div className="text-xs text-green-600">+2,880 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">🌟 Легендарная</span>
                    <div className="text-right">
                      <Badge variant="outline">27,000 OC</Badge>
                      <div className="text-xs text-green-600">+4,590 OC/день</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">🚀 Космическая</span>
                    <div className="text-right">
                      <Badge variant="outline">40,000 OC</Badge>
                      <div className="text-xs text-green-600">+7,200 OC/день</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Особенности:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Улучшение повышает доходность скважин в день</li>
                  <li>• Каждая скважина приносит доход ежедневно</li>
                  <li>• Более дорогие скважины = больше дохода</li>
                  <li>• Доход накапливается автоматически</li>
                  <li>• Максимальный уровень зависит от типа скважины</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Бустеры */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Система бустеров
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Улучшения, которые повышают эффективность ваших скважин и дают дополнительные преимущества.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-3">Постоянные бустеры:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">👥 Квалифицированная бригада</span>
                    <div className="text-right">
                      <Badge variant="outline">5,000+ OC</Badge>
                      <div className="text-xs text-green-600">+10% за уровень</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">📊 Геологические исследования</span>
                    <div className="text-right">
                      <Badge variant="outline">8,000+ OC</Badge>
                      <div className="text-xs text-green-600">+15% за уровень</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">⚙️ Современное оборудование</span>
                    <div className="text-right">
                      <Badge variant="outline">15,000+ OC</Badge>
                      <div className="text-xs text-green-600">+25% за уровень</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">✨ Автоматизация</span>
                    <div className="text-right">
                      <Badge variant="outline">20,000+ OC</Badge>
                      <div className="text-xs text-green-600">+20% за уровень</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Временные бустеры:</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/20 rounded">
                    <span className="text-sm">⚡ Турбо режим</span>
                    <div className="text-right">
                      <Badge variant="outline">3,000 OC</Badge>
                      <div className="text-xs text-muted-foreground">+50% на 24 часа</div>
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold mb-3 mt-4">Особенности:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Постоянные бустеры можно улучшать до максимального уровня</li>
                  <li>• Временные бустеры действуют ограниченное время</li>
                  <li>• Эффекты бустеров суммируются</li>
                  <li>• Доступ к бустерам через иконку ✨ в меню</li>
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
              Экономьте на покупке сразу нескольких скважин! Пакеты дают скидку до 24%.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  🎯 Стартовый пакет
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  3 мини-скважины + 1 стартовая скважина
                </p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Обычная цена:</span>
                    <span className="line-through">5,000 OC</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Со скидкой:</span>
                    <Badge variant="secondary">3,800 OC (-24%)</Badge>
                  </div>
                  <div className="text-green-600 text-xs">
                    Доход: +520 OC/день
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  📈 Пакет роста
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  2 стартовые + 2 средние + 1 промышленная скважина
                </p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Обычная цена:</span>
                    <span className="line-through">16,000 OC</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Со скидкой:</span>
                    <Badge variant="secondary">12,500 OC (-22%)</Badge>
                  </div>
                  <div className="text-green-600 text-xs">
                    Доход: +1,450 OC/день
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  💼 Бизнес пакет
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  3 промышленные + 2 супер + 1 премиум скважина
                </p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Обычная цена:</span>
                    <span className="line-through">55,000 OC</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Со скидкой:</span>
                    <Badge variant="secondary">42,000 OC (-24%)</Badge>
                  </div>
                  <div className="text-green-600 text-xs">
                    Доход: +6,040 OC/день
                  </div>
                </div>
              </div>
              
              <div className="bg-secondary/20 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  👑 Империя пакет
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  2 премиум + 2 элитные + 1 легендарная скважина
                </p>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Обычная цена:</span>
                    <span className="line-through">96,000 OC</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Со скидкой:</span>
                    <Badge variant="secondary">72,000 OC (-25%)</Badge>
                  </div>
                  <div className="text-green-600 text-xs">
                    Доход: +13,950 OC/день
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Справедливость */}
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-300">
              🎯 Честная игровая система
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-green-500/10 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold">Наши гарантии:</h4>
              <ul className="text-sm space-y-1">
                <li>✅ Никаких обязательных платежей - все доступно бесплатно</li>
                <li>✅ Ежедневные бонусы для всех игроков</li>
                <li>✅ Прозрачная система доходов</li>
                <li>✅ Возможность получить любые скважины через игру</li>
                <li>✅ Никаких скрытых комиссий или ограничений</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Игра создана для развлечения и стратегического планирования. 
              Наслаждайтесь честной игрой! 🎮
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}