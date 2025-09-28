import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  Gift, 
  Crown, 
  Star, 
  Users, 
  Timer, 
  Coins, 
  Sparkles,
  Trophy,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface JackpotParticipant {
  id: string;
  nickname: string;
  tickets: number;
  lastActivity: string;
  avatar?: string;
}

// Мок-данные участников
const mockParticipants: JackpotParticipant[] = [
  { id: '1', nickname: 'OilMaster', tickets: 15, lastActivity: '2024-12-20' },
  { id: '2', nickname: 'NeftKing', tickets: 12, lastActivity: '2024-12-19' },
  { id: '3', nickname: 'Tycoon2024', tickets: 8, lastActivity: '2024-12-21' },
  { id: '4', nickname: 'GoldDigger', tickets: 6, lastActivity: '2024-12-18' },
  { id: '5', nickname: 'PetroMagnat', tickets: 4, lastActivity: '2024-12-20' },
];

export const NewYearJackpot = () => {
  const { user } = useAuth();
  const { formatGameCurrency } = useCurrency();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [jackpotAmount] = useState(2847500); // Мок сумма джекпота
  const [totalParticipants] = useState(156);
  const [totalTickets] = useState(892);
  const [userTickets] = useState(user ? 3 : 0);

  // Обратный отсчет до Нового года
  useEffect(() => {
    const calculateTimeLeft = () => {
      const newYear = new Date('2025-01-01T00:00:00');
      const now = new Date();
      const difference = newYear.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const userChance = userTickets > 0 ? ((userTickets / totalTickets) * 100).toFixed(2) : '0';

  return (
    <div className="min-h-screen hero-luxury-background">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl animate-pulse"></div>
            <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-playfair">
              Новогодний Джекпот
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Встречайте Новый год с рекордными выигрышами! Участвуйте в розыгрыше и выиграйте главный приз года!
          </p>
        </div>

        {/* Основная информация */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Призовой фонд и отсчет */}
          <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse -z-10"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
            
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                  <Trophy className="h-8 w-8 text-primary animate-bounce" />
                </div>
                <div className="p-3 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full">
                  <Crown className="h-8 w-8 text-accent animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Главный приз
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl md:text-6xl font-bold text-primary mb-2 animate-glow-pulse">
                  {formatGameCurrency(jackpotAmount)}
                </div>
                <p className="text-muted-foreground">Призовой фонд растет каждую минуту!</p>
              </div>

              {/* Обратный отсчет */}
              <div className="bg-muted/30 rounded-xl p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Timer className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">До розыгрыша осталось:</h3>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {[
                    { label: 'Дней', value: timeLeft.days },
                    { label: 'Часов', value: timeLeft.hours },
                    { label: 'Минут', value: timeLeft.minutes },
                    { label: 'Секунд', value: timeLeft.seconds }
                  ].map((item, index) => (
                    <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary">{item.value}</div>
                      <div className="text-sm text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Участие пользователя */}
          <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 animate-pulse -z-10"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
            
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {user ? 'Ваше участие' : 'Войдите для участия'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {user ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-xl">
                      <div className="text-3xl font-bold text-primary">{userTickets}</div>
                      <p className="text-sm text-muted-foreground">Ваши билеты</p>
                    </div>
                    <div className="text-center p-4 bg-accent/10 rounded-xl">
                      <div className="text-3xl font-bold text-accent">{userChance}%</div>
                      <p className="text-sm text-muted-foreground">Шанс выигрыша</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Ваши шансы</span>
                      <span>{userTickets}/{totalTickets} билетов</span>
                    </div>
                    <Progress value={parseFloat(userChance)} className="h-3" />
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      // Перенаправляем в дашборд для пополнения баланса
                      window.location.href = '/dashboard';
                    }}
                  >
                    <Gift className="w-5 h-5 mr-2" />
                    Получить больше билетов
                  </Button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="p-6 bg-muted/30 rounded-xl">
                    <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Войдите, чтобы участвовать!</p>
                  <p className="text-sm text-muted-foreground">
                    Зарегистрируйтесь и получите бесплатные билеты на участие в розыгрыше
                  </p>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold py-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    onClick={() => {
                      window.location.href = '/auth';
                    }}
                  >
                    Войти в игру
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Статистика и условия */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-primary/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-medium">Участники</CardTitle>
              <Users className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{totalParticipants}</div>
              <p className="text-sm text-muted-foreground">Игроков участвует</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-primary/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-medium">Всего билетов</CardTitle>
              <Star className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{totalTickets}</div>
              <p className="text-sm text-muted-foreground">Билетов в розыгрыше</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border-primary/30 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-medium">Дата розыгрыша</CardTitle>
              <Calendar className="h-6 w-6 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">31.12.2024</div>
              <p className="text-sm text-muted-foreground">23:59 МСК</p>
            </CardContent>
          </Card>
        </div>

        {/* Правила и условия */}
        <Card className="mb-12 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
              <Target className="inline h-6 w-6 mr-2" />
              Правила участия в Новогоднем джекпоте
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Основные правила */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Кто может участвовать?
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Все зарегистрированные игроки Oil Tycoon
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Возраст участника должен быть 18+ лет
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Один аккаунт на одного человека
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Запрещены фейковые и мультиаккаунты
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-accent mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Как получить билеты?
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Пополнение баланса:</strong> 1 билет за каждые 100₽</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Ежедневная активность:</strong> 1 билет за вход в игру</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Покупки в игре:</strong> 1 билет за каждую покупку</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Реферальная программа:</strong> 2 билета за друга</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Специальные акции:</strong> до 10 билетов</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    Когда и как проходит розыгрыш?
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      <span><strong>Дата:</strong> 31 декабря 2024 года в 23:59 МСК</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Розыгрыш проводится автоматически системой
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Используется алгоритм проверяемой случайности
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Все участники получают уведомления о результатах
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                      Запись розыгрыша публикуется для прозрачности
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-accent mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Призы и выплаты
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>Главный приз:</strong> весь накопленный джекпот</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>2-е место:</strong> 10% от джекпота</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      <span><strong>3-е место:</strong> 5% от джекпота</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      Призы зачисляются автоматически на игровой баланс
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                      Выплаты производятся в течение 24 часов
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Важная информация */}
            <div className="bg-muted/20 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <Crown className="h-5 w-5" />
                Важная информация
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    Администрация оставляет за собой право изменить правила розыгрыша
                  </p>
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    Участники, нарушившие правила игры, исключаются из розыгрыша
                  </p>
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    Билеты не подлежат передаче другим игрокам
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    Все спорные вопросы решаются администрацией
                  </p>
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    Победители обязаны предоставить данные для верификации
                  </p>
                  <p className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></div>
                    Джекпот формируется из взносов игроков (5% с каждого пополнения)
                  </p>
                </div>
              </div>
            </div>

            {/* Контакты поддержки */}
            <div className="bg-primary/10 rounded-xl p-6 text-center">
              <h3 className="text-lg font-semibold text-primary mb-2">Есть вопросы?</h3>
              <p className="text-muted-foreground mb-4">
                Свяжитесь с нашей службой поддержки для получения дополнительной информации
              </p>
              <Button 
                variant="outline" 
                className="bg-primary/20 hover:bg-primary/30 border-primary/50"
                onClick={() => window.location.href = '/support'}
              >
                Связаться с поддержкой
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Как получить билеты */}
        <Card className="mb-12 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
              <Sparkles className="inline h-6 w-6 mr-2" />
              Как получить билеты на джекпот?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Coins className="h-8 w-8 text-primary" />,
                  title: 'Пополните баланс',
                  description: '1 билет за каждые 100₽ пополнения',
                  tickets: '+1-5 билетов'
                },
                {
                  icon: <Zap className="h-8 w-8 text-accent" />,
                  title: 'Играйте активно',
                  description: 'Ежедневный вход и покупки дают билеты',
                  tickets: '+1-3 билета'
                },
                {
                  icon: <Users className="h-8 w-8 text-primary" />,
                  title: 'Приглашайте друзей',
                  description: 'За каждого нового игрока',
                  tickets: '+2 билета'
                },
                {
                  icon: <Gift className="h-8 w-8 text-accent" />,
                  title: 'Специальные акции',
                  description: 'Участвуйте в праздничных событиях',
                  tickets: '+1-10 билетов'
                }
              ].map((item, index) => (
                <div key={index} className="text-center p-6 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="mb-4 flex justify-center">{item.icon}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <Badge variant="outline" className="text-primary border-primary/50">
                    {item.tickets}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Топ участников */}
        <Card className="bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-2 border-primary/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center">
              <Trophy className="inline h-6 w-6 mr-2" />
              Топ участников джекпота
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockParticipants.map((participant, index) => (
                <div key={participant.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-500 text-yellow-900' :
                      index === 1 ? 'bg-gray-400 text-gray-900' :
                      index === 2 ? 'bg-amber-600 text-amber-100' :
                      'bg-slate-600 text-slate-200'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{participant.nickname}</div>
                      <div className="text-sm text-muted-foreground">
                        Последняя активность: {participant.lastActivity}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">{participant.tickets} билетов</div>
                    <div className="text-sm text-muted-foreground">
                      {((participant.tickets / totalTickets) * 100).toFixed(1)}% шанс
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center">
              <Button variant="outline" className="bg-muted/20 hover:bg-muted/30">
                Посмотреть всех участников
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};