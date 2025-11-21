import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  TrendingUp, 
  Zap, 
  Target, 
  Award,
  BookOpen,
  Rocket,
  Brain,
  DollarSign,
  Clock,
  Sparkles,
  Trophy,
  Fuel,
  ArrowUpCircle
} from "lucide-react";

const Strategies = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Стратегии игры
            </h1>
          </div>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Изучите проверенные стратегии, оптимизируйте свой доход и станьте нефтяным магнатом
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="beginner" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto p-2 bg-card/50">
            <TabsTrigger value="beginner" className="flex items-center gap-2 py-3">
              <Rocket className="h-4 w-4" />
              <span>Новичкам</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 py-3">
              <Trophy className="h-4 w-4" />
              <span>Продвинутым</span>
            </TabsTrigger>
            <TabsTrigger value="boosters" className="flex items-center gap-2 py-3">
              <Zap className="h-4 w-4" />
              <span>Бустеры</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 py-3">
              <Target className="h-4 w-4" />
              <span>Сравнение</span>
            </TabsTrigger>
          </TabsList>

          {/* Раздел для новичков */}
          <TabsContent value="beginner" className="space-y-6">
            <Alert className="border-primary/50 bg-primary/5">
              <Lightbulb className="h-5 w-5 text-primary" />
              <AlertDescription className="text-base">
                Начните с правильной стратегии и достигните успеха быстрее!
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <CardTitle>Первые шаги</CardTitle>
                  </div>
                  <CardDescription>С чего начать свой путь</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="rounded-full h-6 w-6 flex items-center justify-center shrink-0">1</Badge>
                      <div>
                        <p className="font-medium">Начните со Стартовой скважины</p>
                        <p className="text-sm text-muted-foreground">Самый доступный способ начать добычу</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="rounded-full h-6 w-6 flex items-center justify-center shrink-0">2</Badge>
                      <div>
                        <p className="font-medium">Накапливайте на Среднюю скважину</p>
                        <p className="text-sm text-muted-foreground">Значительно выше доход при небольшой цене</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="rounded-full h-6 w-6 flex items-center justify-center shrink-0">3</Badge>
                      <div>
                        <p className="font-medium">Используйте реферальную систему</p>
                        <p className="text-sm text-muted-foreground">Получайте бонусы от друзей</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="rounded-full h-6 w-6 flex items-center justify-center shrink-0">4</Badge>
                      <div>
                        <p className="font-medium">Не забывайте ежедневные бонусы</p>
                        <p className="text-sm text-muted-foreground">Заходите каждый день за наградами</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20 hover:border-accent/40 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <CardTitle>Быстрый старт</CardTitle>
                  </div>
                  <CardDescription>Как быстро заработать первый капитал</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Рекомендуемый путь
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span>2-3 Стартовые скважины</span>
                        <Badge variant="secondary">День 1-2</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Купить 1 Среднюю скважину</span>
                        <Badge variant="secondary">День 3-4</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Апгрейд до уровня 2-3</span>
                        <Badge variant="secondary">День 5-7</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Премиум скважина</span>
                        <Badge variant="secondary">День 10+</Badge>
                      </div>
                    </div>
                  </div>
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>Совет:</strong> Не тратьте все деньги сразу. Оставляйте резерв на апгрейды!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Частые ошибки новичков
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                    <p className="font-semibold text-destructive mb-2">❌ Покупка только дорогих скважин</p>
                    <p className="text-sm text-muted-foreground">Лучше иметь несколько средних, чем одну дорогую</p>
                  </div>
                  <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                    <p className="font-semibold text-destructive mb-2">❌ Игнорирование апгрейдов</p>
                    <p className="text-sm text-muted-foreground">Апгрейд часто выгоднее покупки новой скважины</p>
                  </div>
                  <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
                    <p className="font-semibold text-destructive mb-2">❌ Трата всех денег сразу</p>
                    <p className="text-sm text-muted-foreground">Держите резерв на возможности и бонусы</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Раздел для продвинутых */}
          <TabsContent value="advanced" className="space-y-6">
            <Alert className="border-accent/50 bg-accent/5">
              <Trophy className="h-5 w-5 text-accent" />
              <AlertDescription className="text-base">
                Продвинутые стратегии для максимизации прибыли
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Оптимизация портфеля</CardTitle>
                  </div>
                  <CardDescription>Правильное соотношение скважин</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="font-medium mb-1">🎯 Золотое правило 40-30-30</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• 40% капитала в скважины среднего уровня</li>
                        <li>• 30% в премиум скважины</li>
                        <li>• 30% резерв на апгрейды и возможности</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <p className="font-medium mb-1">⚡ Стратегия "Пирамида"</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Много дешевых скважин в основании</li>
                        <li>• Несколько средних в середине</li>
                        <li>• 1-2 топовые на вершине</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpCircle className="h-5 w-5 text-accent" />
                    <CardTitle>Апгрейд vs Покупка</CardTitle>
                  </div>
                  <CardDescription>Когда что выгоднее</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <p className="font-medium text-green-600 mb-1">✅ Апгрейдить, если:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Скважина уже высокого уровня</li>
                        <li>• ROI апгрейда {"<"} 30 дней</li>
                        <li>• Не хватает на новую скважину</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <p className="font-medium text-blue-600 mb-1">✅ Покупать новую, если:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Скважина низкого уровня ({"<"}5)</li>
                        <li>• Есть свободный капитал</li>
                        <li>• Диверсификация портфеля</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Продвинутые тактики
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Award className="h-4 w-4 text-accent" />
                        Максимизация дохода
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Комбинируйте бустеры для синергии (x2 эффект)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Используйте сезонные бонусы и события</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Планируйте крупные покупки перед сезонами</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>Активно участвуйте в реферальной программе</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        Долгосрочная стратегия
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">•</span>
                          <span>Реинвестируйте 70-80% прибыли</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">•</span>
                          <span>Следите за таблицей лидеров для мотивации</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">•</span>
                          <span>Участвуйте в достижениях для бонусов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent font-bold">•</span>
                          <span>Планируйте рост на 3-6 месяцев вперед</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Раздел бустеров */}
          <TabsContent value="boosters" className="space-y-6">
            <Alert className="border-accent/50 bg-accent/5">
              <Zap className="h-5 w-5 text-accent" />
              <AlertDescription className="text-base">
                Правильное использование бустеров может удвоить ваш доход
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-primary">Базовый</Badge>
                  <CardTitle className="text-lg">🚀 Turbo Boost</CardTitle>
                  <CardDescription>+10% к скорости добычи</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Когда использовать:</p>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>• Начало игры для быстрого старта</li>
                      <li>• В комбинации с другими бустерами</li>
                      <li>• Перед важными покупками</li>
                    </ul>
                  </div>
                  <Badge variant="outline" className="w-fit">ROI: 15-20 дней</Badge>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-accent">Средний</Badge>
                  <CardTitle className="text-lg">⚙️ Автоматизация</CardTitle>
                  <CardDescription>+15% эффективность</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Когда использовать:</p>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>• При 5+ скважинах</li>
                      <li>• Для пассивного дохода</li>
                      <li>• Долгосрочные инвестиции</li>
                    </ul>
                  </div>
                  <Badge variant="outline" className="w-fit">ROI: 20-25 дней</Badge>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-primary">Продвинутый</Badge>
                  <CardTitle className="text-lg">👷 Рабочая бригада</CardTitle>
                  <CardDescription>+20% производство</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <p className="font-medium">Когда использовать:</p>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>• На высокоуровневых скважинах</li>
                      <li>• Максимальная прибыль</li>
                      <li>• Перед сезонными событиями</li>
                    </ul>
                  </div>
                  <Badge variant="outline" className="w-fit">ROI: 25-30 дней</Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Комбинации бустеров
                </CardTitle>
                <CardDescription>Синергетические эффекты для максимальной прибыли</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                    <h4 className="font-semibold mb-2">🔥 Комбо "Быстрый старт"</h4>
                    <p className="text-sm text-muted-foreground mb-3">Turbo Boost + Автоматизация</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Прирост дохода:</span>
                        <span className="font-semibold text-primary">+28%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Окупаемость:</span>
                        <span className="font-semibold">12-15 дней</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                    <h4 className="font-semibold mb-2">⚡ Комбо "Максимум"</h4>
                    <p className="text-sm text-muted-foreground mb-3">Все три бустера</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Прирост дохода:</span>
                        <span className="font-semibold text-accent">+52%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Окупаемость:</span>
                        <span className="font-semibold">8-10 дней</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Раздел сравнения */}
          <TabsContent value="comparison" className="space-y-6">
            <Alert className="border-primary/50 bg-primary/5">
              <Target className="h-5 w-5 text-primary" />
              <AlertDescription className="text-base">
                Сравните эффективность скважин и выберите оптимальную стратегию
              </AlertDescription>
            </Alert>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  Сравнение скважин по эффективности
                </CardTitle>
                <CardDescription>Базовые характеристики и ROI (окупаемость)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Тип скважины</TableHead>
                        <TableHead className="text-right">Цена</TableHead>
                        <TableHead className="text-right">Доход/день</TableHead>
                        <TableHead className="text-right">ROI (дней)</TableHead>
                        <TableHead className="text-center">Эффективность</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Стартовая</TableCell>
                        <TableCell className="text-right">1,000 ₽</TableCell>
                        <TableCell className="text-right">50 ₽</TableCell>
                        <TableCell className="text-right">20</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">★★☆☆☆</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/5">
                        <TableCell className="font-medium">Средняя</TableCell>
                        <TableCell className="text-right">5,000 ₽</TableCell>
                        <TableCell className="text-right">300 ₽</TableCell>
                        <TableCell className="text-right">16.7</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">★★★☆☆</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Премиум</TableCell>
                        <TableCell className="text-right">15,000 ₽</TableCell>
                        <TableCell className="text-right">1,000 ₽</TableCell>
                        <TableCell className="text-right">15</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-accent">★★★★☆</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-accent/5">
                        <TableCell className="font-medium">Промышленная</TableCell>
                        <TableCell className="text-right">50,000 ₽</TableCell>
                        <TableCell className="text-right">3,800 ₽</TableCell>
                        <TableCell className="text-right">13.2</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-primary">★★★★☆</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Супер</TableCell>
                        <TableCell className="text-right">150,000 ₽</TableCell>
                        <TableCell className="text-right">12,500 ₽</TableCell>
                        <TableCell className="text-right">12</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-primary">★★★★★</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-primary/5">
                        <TableCell className="font-medium">Элитная</TableCell>
                        <TableCell className="text-right">500,000 ₽</TableCell>
                        <TableCell className="text-right">45,000 ₽</TableCell>
                        <TableCell className="text-right">11.1</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-accent">★★★★★</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Космическая</TableCell>
                        <TableCell className="text-right">2,000,000 ₽</TableCell>
                        <TableCell className="text-right">200,000 ₽</TableCell>
                        <TableCell className="text-right">10</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-primary">★★★★★</Badge>
                        </TableCell>
                      </TableRow>
                      <TableRow className="bg-gradient-to-r from-primary/10 to-accent/10">
                        <TableCell className="font-medium">Легендарная</TableCell>
                        <TableCell className="text-right">10,000,000 ₽</TableCell>
                        <TableCell className="text-right">1,200,000 ₽</TableCell>
                        <TableCell className="text-right">8.3</TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-gradient-to-r from-primary to-accent">★★★★★</Badge>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-green-500/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <CardTitle className="text-lg">Лучший ROI</CardTitle>
                  </div>
                  <CardDescription>Быстрая окупаемость</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <span className="font-medium">Легендарная</span>
                      <Badge className="bg-green-500">8.3 дня</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <span className="font-medium">Космическая</span>
                      <Badge variant="outline">10 дней</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                      <span className="font-medium">Элитная</span>
                      <Badge variant="outline">11.1 дня</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-500/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Лучший доход</CardTitle>
                  </div>
                  <CardDescription>Максимальная прибыль</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <span className="font-medium">Легендарная</span>
                      <Badge className="bg-blue-500">1.2M/день</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <span className="font-medium">Космическая</span>
                      <Badge variant="outline">200K/день</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <span className="font-medium">Элитная</span>
                      <Badge variant="outline">45K/день</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-accent/20">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Rocket className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">Для новичков</CardTitle>
                  </div>
                  <CardDescription>Оптимальный старт</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <span className="font-medium">Средняя</span>
                      <Badge className="bg-accent">Лучший</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <span className="font-medium">Премиум</span>
                      <Badge variant="outline">Хороший</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-accent/5 rounded-lg border border-accent/20">
                      <span className="font-medium">Стартовая</span>
                      <Badge variant="outline">Базовый</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Strategies;
