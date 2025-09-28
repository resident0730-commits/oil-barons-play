import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Calendar, Target, Users, Crown, Gift, Star, Briefcase, Award, Gem, Shield, Zap, DollarSign, TrendingUp, ChevronRight } from 'lucide-react';
import { usePlayerLimit } from '@/hooks/usePlayerLimit';
import GiveawayPreview from '@/components/GiveawayPreview';


const Season = () => {
  const { currentPlayers, maxPlayers, progressPercentage, spotsLeft } = usePlayerLimit();

  return (
    <div className="min-h-screen gradient-oil relative">
      {/* Header */}
      <div className="relative overflow-hidden gradient-hero border-b border-primary/30">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_50%)]" />
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <Badge className="text-xl px-8 py-3 gradient-primary text-background font-bold shadow-primary animate-glow-pulse">
              СЕЗОН 1 • АКТИВЕН
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold gradient-luxury bg-clip-text text-transparent animate-fade-in">
              Нефтяная Империя
            </h1>
            <p className="text-2xl text-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Корпоративная битва за доминирование. Создай команду мечты, достигни 4,000₽/день и войди в элиту нефтяных магнатов.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Период: 01.09 - 31.10
              </Badge>
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-2">
                <Trophy className="w-4 h-4 mr-2" />
                Розыгрыш 18 октября
              </Badge>
              <Badge variant="outline" className="border-primary/50 text-primary px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                {spotsLeft.toLocaleString()} мест осталось
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto bg-card/50 border border-primary/20">
            <TabsTrigger value="overview">Обзор</TabsTrigger>
            <TabsTrigger value="giveaway">Розыгрыш и Награды</TabsTrigger>
            <TabsTrigger value="privileges">Привилегии</TabsTrigger>
            <TabsTrigger value="mechanics">Механика</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Progress Section */}
            <Card className="border-primary/30 gradient-oil shadow-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <div className="p-2 rounded-full gradient-luxury">
                    <Users className="h-8 w-8 text-background" />
                  </div>
                  Прогресс сезона
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-medium">Активные игроки империи</span>
                    <span className="text-4xl font-bold gradient-luxury bg-clip-text text-transparent">
                      {currentPlayers.toLocaleString()} / {maxPlayers.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <Progress value={progressPercentage} className="h-6 bg-muted/30" />
                    <div className="flex justify-between text-muted-foreground">
                      <span>Заполнено: {progressPercentage.toFixed(1)}%</span>
                      <span className="font-semibold text-primary">Осталось: {spotsLeft.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Goals */}
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-primary/30 gradient-amber shadow-amber hover-scale group cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                    Глобальная цель
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold gradient-luxury bg-clip-text text-transparent">10,000</div>
                    <p className="text-foreground/80 font-medium">уникальных активных игроков</p>
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                      Открывает доступ к главному розыгрышу
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/30 gradient-oil shadow-primary hover-scale group cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    Личная цель
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold gradient-luxury bg-clip-text text-transparent">4,000₽</div>
                    <p className="text-foreground/80 font-medium">доходность в день</p>
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                      Статус "Магнат" + эксклюзивные бонусы
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/30 gradient-rich shadow-luxury hover-scale group cursor-pointer">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    Корпоративная цель
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="text-5xl font-bold gradient-luxury bg-clip-text text-transparent">100%</div>
                    <p className="text-foreground/80 font-medium">укомплектованность команд</p>
                    <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                      Бонусы для менеджеров и их команд
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Events */}
            <Card className="border-primary/30 gradient-primary shadow-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <div className="p-2 rounded-full bg-background/20">
                    <Calendar className="h-8 w-8 text-background" />
                  </div>
                  Ключевые события сезона
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="grid md:grid-cols-3 gap-8">
                   <div className="text-center space-y-4 p-6 rounded-xl bg-background/10 border border-background/20">
                     <div className="text-4xl font-bold text-background">18 октября</div>
                     <h4 className="text-xl font-semibold text-background">Главный розыгрыш</h4>
                     <p className="text-background/80">Реальные призы для всех участников: iPhone 17 Pro, PlayStation 5 и многое другое</p>
                     <Badge className="bg-background/20 text-background border-background/30">
                       Крупные призы
                     </Badge>
                   </div>
                   <div className="text-center space-y-4 p-6 rounded-xl bg-background/10 border border-background/20">
                     <div className="text-4xl font-bold text-background">Еженедельно</div>
                     <h4 className="text-xl font-semibold text-background">Рейтинги лидеров</h4>
                     <p className="text-background/80">Обновление топ-игроков, прогресс команд и еженедельные мини-призы</p>
                     <Badge className="bg-background/20 text-background border-background/30">
                       Прогресс
                     </Badge>
                   </div>
                   <div className="text-center space-y-4 p-6 rounded-xl bg-background/10 border border-background/20">
                     <div className="text-4xl font-bold text-background">В конце сезона</div>
                     <h4 className="text-xl font-semibold text-background">Топ-1000 Элита</h4>
                     <p className="text-background/80">Определение лучших игроков сезона и выдача эксклюзивных привилегий</p>
                     <Badge className="bg-background/20 text-background border-background/30">
                       Элита
                     </Badge>
                   </div>
                 </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="giveaway" className="space-y-8">
            <div className="text-center space-y-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <Trophy className="h-8 w-8 text-primary animate-glow-pulse" />
                <h2 className="text-4xl font-bold gradient-luxury bg-clip-text text-transparent">
                  Розыгрыш и Система Наград
                </h2>
                <Trophy className="h-8 w-8 text-primary animate-glow-pulse" />
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Главное событие сезона "Нефтяная Империя" - грандиозный розыгрыш и система достижений для всех игроков!
              </p>
            </div>
            
            <GiveawayPreview />
            
            {/* Detailed Rewards System */}
            <Card className="border-primary/30 gradient-oil shadow-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <div className="p-2 rounded-full gradient-luxury">
                    <Trophy className="h-8 w-8 text-background" />
                  </div>
                  Система наград "Нефтяной Империи"
                </CardTitle>
                <p className="text-muted-foreground text-lg">
                  Каждое достижение вознаграждается. Чем больше вклад в развитие империи, тем больше награда.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Achievement Rewards */}
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-primary/20 gradient-amber shadow-amber">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Star className="h-6 w-6 text-primary" />
                        Статус "Магнат" (4000₽/день)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          Эксклюзивная золотая рамка профиля
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          +20% к доходности всех скважин навсегда
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          Доступ к VIP-магазину с эксклюзивными предложениями
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          VIP-статус в розыгрышах с увеличенными шансами
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-primary/20 gradient-rich shadow-luxury">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Crown className="h-6 w-6 text-primary" />
                        Лучшие менеджеры сезона
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          5% с доходов всей команды навсегда
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          Реальный приз от 50,000₽ до 200,000₽
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          Статус "Легенда" с особыми привилегиями
                        </li>
                        <li className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4 text-primary" />
                          Приоритетное место в следующем сезоне
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/30 gradient-oil shadow-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Star className="h-6 w-6 text-primary" />
                  Связь с сезоном "Нефтяная Империя"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="gradient-amber p-6 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-primary mb-3 text-xl flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      🎯 Цель сезона
                    </h3>
                    <p className="text-foreground/80">
                      Достижение дохода 4000₽/день связано с главным розыгрышем - для участия нужно минимум 2000₽/день с премиум-скважиной
                    </p>
                  </div>
                  <div className="gradient-rich p-6 rounded-xl border border-primary/20">
                    <h3 className="font-bold text-primary mb-3 text-xl flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      👑 Топ-1000
                    </h3>
                    <p className="text-foreground/80">
                      Лучшие игроки сезона получают привилегии на следующий сезон + участвуют в розыгрыше реальных призов
                    </p>
                  </div>
                </div>
                
                <div className="gradient-luxury p-6 rounded-xl border-2 border-primary/30">
                  <h3 className="font-bold text-background mb-4 text-xl text-center">
                    🏆 Эксклюзивная привилегия сезона
                  </h3>
                  <p className="text-background/90 text-center text-lg">
                    Все игроки, достигшие статуса "Магнат" (4000₽/день), автоматически получают VIP-статус участника розыгрыша с увеличенными шансами на выигрыш!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privileges" className="space-y-8">
            {/* Top-1000 Privileges Package */}
            <Card className="border-primary/30 gradient-primary shadow-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-4xl">
                  <div className="p-3 rounded-full bg-background/20">
                    <Award className="h-12 w-12 text-background" />
                  </div>
                  Пакет привилегий ТОП-1000
                </CardTitle>
                <p className="text-xl text-background/80">
                  Эксклюзивные бонусы на весь следующий сезон для лучших игроков империи
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Shield className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">VIP Статус</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• Золотая рамка профиля</li>
                        <li>• Эксклюзивный значок "Элита S1"</li>
                        <li>• Приоритетная поддержка</li>
                        <li>• Доступ к VIP-чату</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">Игровые бонусы</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• +15% доходность навсегда</li>
                        <li>• Бесплатная скважина в начале S2</li>
                        <li>• x2 множитель опыта</li>
                        <li>• Скидка 20% в магазине</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Gem className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">Эксклюзивы</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• Ранний доступ к S2 (за 24ч)</li>
                        <li>• Эксклюзивные скважины</li>
                        <li>• VIP-розыгрыши каждый месяц</li>
                        <li>• Участие в бета-тестах</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">Финансовые бонусы</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• Стартовый капитал 50,000₽</li>
                        <li>• Бонус к пополнениям +10%</li>
                        <li>• Кэшбэк 5% с покупок</li>
                        <li>• Льготные условия кредитов</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">Социальные бонусы</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• Место в Совете директоров</li>
                        <li>• Влияние на развитие игры</li>
                        <li>• Персональный менеджер</li>
                        <li>• Прямая связь с разработчиками</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-background/20 border border-background/30">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Zap className="h-8 w-8 text-background" />
                        <h3 className="text-xl font-bold text-background">Реальные призы</h3>
                      </div>
                      <ul className="space-y-2 text-background/80">
                        <li>• Ежемесячные мини-призы</li>
                        <li>• Годовая премия до 1,000,000₽</li>
                        <li>• Участие в VIP-событиях</li>
                        <li>• Подарки к праздникам</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mechanics" className="space-y-8">
            {/* How Everything Works */}
            <Card className="border-primary/30 gradient-oil shadow-luxury">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-3xl">
                  <div className="p-2 rounded-full gradient-luxury">
                    <Briefcase className="h-8 w-8 text-background" />
                  </div>
                  Как все работает
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Management System */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary">Система менеджмента и команд</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="border-primary/20 gradient-amber">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Crown className="h-6 w-6 text-primary" />
                          Как стать менеджером
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li className="flex gap-3">
                            <span className="bg-primary text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                            <span>Достичь доходности 10,000₽/день</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="bg-primary text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                            <span>Пригласить минимум 5 активных игроков</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="bg-primary text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                            <span>Подать заявку через поддержку</span>
                          </li>
                          <li className="flex gap-3">
                            <span className="bg-primary text-background rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                            <span>Пройти собеседование с командой</span>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20 gradient-rich">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Users className="h-6 w-6 text-primary" />
                          Доходы менеджера
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          <li>• <span className="font-bold text-primary">2%</span> с доходов команды первые 30 дней</li>
                          <li>• <span className="font-bold text-primary">3%</span> при команде от 20 человек</li>
                          <li>• <span className="font-bold text-primary">5%</span> при команде от 50 человек</li>
                          <li>• <span className="font-bold text-primary">Бонусы</span> за активность команды</li>
                          <li>• <span className="font-bold text-primary">Реальные призы</span> за топ результаты</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Qualification System */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary">Система квалификации для топ-1000</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Критерии отбора</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span>Доходность в день</span>
                          <span className="font-bold text-primary">60%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Общий депозит</span>
                          <span className="font-bold text-primary">25%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Активность</span>
                          <span className="font-bold text-primary">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Реферралы</span>
                          <span className="font-bold text-primary">5%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Временные рамки</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="font-semibold">Финальный подсчет:</div>
                          <div className="text-sm text-muted-foreground">15 октября 23:59</div>
                        </div>
                        <div>
                          <div className="font-semibold">Объявление топ-1000:</div>
                          <div className="text-sm text-muted-foreground">16 октября</div>
                        </div>
                        <div>
                          <div className="font-semibold">Выдача привилегий:</div>
                          <div className="text-sm text-muted-foreground">Начало сезона 2</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/10">
                      <CardHeader>
                        <CardTitle className="text-lg">Дополнительные бонусы</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <span className="font-semibold text-primary">Топ-10:</span> Персональные призы до 500,000₽
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-primary">Топ-100:</span> Эксклюзивные скважины S2
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold text-primary">Топ-500:</span> Удвоенные привилегии
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Prize Distribution */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-primary">Как происходит розыгрыш 18 октября</h3>
                  <Card className="border-primary/20 gradient-luxury">
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 text-background">
                        <div className="space-y-4">
                          <h4 className="text-xl font-bold">Механика розыгрыша</h4>
                          <ul className="space-y-2 text-background/80">
                            <li>• Участвуют владельцы Премиум-скважин</li>
                            <li>• Минимальный доход: 2000₽/день</li>
                            <li>• Прямой эфир в 20:00 МСК</li>
                            <li>• Независимая система генерации</li>
                            <li>• Возможность наблюдать за процессом</li>
                          </ul>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-xl font-bold">Выдача призов</h4>
                          <ul className="space-y-2 text-background/80">
                            <li>• Виртуальные призы: моментально</li>
                            <li>• Реальные призы: доставка в течение 14 дней</li>
                            <li>• Связь с победителями в течение 24 часов</li>
                            <li>• Выбор цвета/модели для техники</li>
                            <li>• Подтверждение получения обязательно</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Call to Action */}
          <Card className="border-primary/30 gradient-primary shadow-primary">
            <CardContent className="p-12">
              <div className="text-center space-y-6">
                <Badge className="text-2xl px-8 py-4 bg-background/20 text-background border-background/30 font-bold">
                  СЕЗОН АКТИВЕН • МЕСТА ОГРАНИЧЕНЫ
                </Badge>
                <h2 className="text-4xl font-bold text-background">Стань частью нефтяной империи!</h2>
                <p className="text-xl text-background/80 max-w-3xl mx-auto leading-relaxed">
                  Построй свою корпорацию, достигни 4,000₽/день, участвуй в розыгрыше 18 октября 
                  и получи шанс войти в элиту топ-1000 игроков с эксклюзивными привилегиями.
                </p>
                <div className="flex justify-center gap-6 flex-wrap mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-background">{spotsLeft.toLocaleString()}</div>
                    <div className="text-background/60">мест осталось</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-background">18 окт</div>
                    <div className="text-background/60">главный розыгрыш</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-background">1000</div>
                    <div className="text-background/60">привилегированных мест</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
};

export default Season;