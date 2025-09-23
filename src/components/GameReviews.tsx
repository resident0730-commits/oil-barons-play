import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReviewCriteria {
  name: string;
  rating: number;
}

interface GameReview {
  id: number;
  nickname: string;
  avatar: string;
  text: string;
  criteria: ReviewCriteria[];
  date: string;
  overallRating: number;
}

const generateReviews = (): GameReview[] => {
  const nicknames = [
    "Сергей Ковленко", "Александр Петров", "Дмитрий Соколов", "Михаил Волков", "Андрей Новиков",
    "Максим Козлов", "Никита Морозов", "Артём Лебедев", "Владимир Васильев", "Егор Федоров",
    "Иван Смирнов", "Алексей Кузнецов", "Денис Попов", "Роман Орлов", "Павел Медведев",
    "GameMaster2024", "ProPlayer_RU", "ShadowHunter", "FireStorm", "CyberWolf",
    "NightRider", "StormBreaker", "IcePhoenix", "ThunderBolt", "DarkKnight",
    "SkyWalker", "RocketMan", "StarHunter", "WaveRider", "WindRunner",
    "Елена Кузнецова", "Анна Лебедева", "Мария Волкова", "Ольга Соколова", "Татьяна Петрова",
    "Наталья Козлова", "Светлана Новикова", "Екатерина Морозова", "Юлия Федорова", "Ирина Васильева",
    "CrazyGamer", "FastRunner", "SmartPlayer", "CoolDude", "EpicWin"
  ];

  const reviewTexts = [
    "Играю уже 3 недели, пока доволен. Выводил 2 раза - пришло быстро.",
    "Неплохая игра, но хотелось бы больше бонусов для новичков.",
    "Скважины качаются долго, но это норм для такой игры. Главное что платят.",
    "Интерфейс простой, разобрался быстро. Доходы небольшие но стабильные.",
    "Вывел первые 500р через неделю игры. Работает, буду играть дальше.",
    "Поначалу непонятно было, но потом втянулся. Поддержка отвечает.",
    "Обычная idle игра, ничего особенного. Но деньги действительно выводят.",
    "Играю в обеденный перерыв, удобно что не требует постоянного внимания.",
    "Реферальная программа слабая, но сама игра норм. Вывожу по 200-300р.",
    "За полтора месяца игры вывел около 2к. Не миллионы конечно, но на кофе хватает.",
    "Графика простая, но мне нравится минимализм. Главное что стабильно работает.",
    "Техподдержка ответила через день. Не быстро, но проблему решили.",
    "Бустеры дорогие, но эффект есть. Пока экспериментирую с разными.",
    "Иногда скучновато, хотелось бы больше разнообразия в игровом процессе.",
    "Пока что лучшая игра такого типа из тех что пробовал. Рекомендую попробовать.",
    "Бонус в 10000 получил за первую премиум скважину! Не ожидал такой щедрости.",
    "Круто что дают 10000 рублей за регистрацию! Сразу купил несколько скважин.",
    "Прошёл весь туториал за бонус в 10000. Теперь доход 1500 в день, доволен!",
    "Потратил стартовый бонус 10000 на улучшения, окупилось за 2 недели.",
    "10к рублей подарили просто так! Инвестировал в производство, растёт доход.",
    "За первый депозит дополнительно дали 10000 бонусом. Честная игра!",
    "Друг рассказал про бонус в 10000 при регистрации - правда работает!",
    "Стартовые 10000 помогли быстро развиться. Сейчас зарабатываю по 2000 в день.",
    "Благодаря бонусу в 10к смог купить премиум скважину на старте. Советую всем!",
    "Кэшбек 10000 рублей получил за активную игру в первые недели. Приятно!",
    "Воспользовался акцией с бонусом 10000 - лучшее решение для новичка.",
    "Промокод на 10к рублей реально работает! Проверил сам, деньги зачислились.",
    "Администрация подарила 10000 за участие в бета-тесте. Класс!",
    "VIP бонус 10000 рублей получил за покупку пакета. Выгодная инвестиция.",
    "На день рождения игры раздавали по 10к всем активным - получил свои!",
    "Сезонный бонус в 10000 за выполнение заданий. Мотивирует продолжать играть.",
    "Реферальный друг принёс бонус 10000. Теперь приглашаю всех знакомых!",
    "За достижение топ-100 дали 10к рублей. Стимул развиваться дальше.",
    "Компенсация 10000 за технические проблемы - ответственные разработчики.",
    "Программа лояльности: 10к бонус за месяц игры. Долгосрочная выгода.",
    "Акционный бонус 10000 потратил на автоматизацию - лучшее вложение.",
    "За отзыв дали 10к рублей! Честно заслужил, игра реально крутая.",
    "Стартер пак с 10000 бонусом окупился за неделю. Рекомендую новичкам.",
    "Еженедельный розыгрыш выиграл - 10к на счёт! Удача улыбнулась.",
    "Вернули 10000 за неудачную покупку бустера. Честная служба поддержки.",
    "Переходный бонус 10к за смену тарифа. Выгодные условия для игроков.",
    "За активность в чате модеры дали 10000. Общительность окупается!",
    "Праздничная акция: 10к всем участникам. Люблю такие сюрпризы от админов.",
    "Компенсационный бонус 10000 за долгое ожидание вывода. Извинились достойно.",
    "Тестирование новых функций - 10к рублей. Приятно быть частью развития игры."
  ];

  const criteriaNames = [
    { name: "Доходность", weight: 1 },
    { name: "Скорость вывода", weight: 1 },
    { name: "Интерфейс", weight: 0.8 },
    { name: "Поддержка", weight: 0.9 },
    { name: "Надежность", weight: 1 }
  ];

  // Перемешиваем массивы для уникальности
  const shuffledNicknames = [...nicknames].sort(() => Math.random() - 0.5);
  const shuffledReviewTexts = [...reviewTexts].sort(() => Math.random() - 0.5);

  return Array.from({ length: Math.min(45, nicknames.length) }, (_, i) => {
    const criteria = criteriaNames.map(c => ({
      name: c.name,
      rating: Math.floor(Math.random() * 2) + 4 // 4-5 звезд преимущественно
    }));

    const overallRating = criteria.reduce((sum, c, index) => 
      sum + c.rating * criteriaNames[index].weight, 0) / criteriaNames.reduce((sum, c) => sum + c.weight, 0);

    const nickname = shuffledNicknames[i];
    
    return {
      id: i + 1,
      nickname: nickname,
      avatar: nickname.charAt(0).toUpperCase(),
      text: shuffledReviewTexts[i % shuffledReviewTexts.length],
      criteria,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('ru-RU'),
      overallRating: Math.round(overallRating * 10) / 10
    };
  });
};

const StarRating = ({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            "fill-current",
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
            i < rating ? "text-yellow-500" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

export const GameReviews = () => {
  const [reviews, setReviews] = useState<GameReview[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const loadReviews = () => {
    setIsRefreshing(true);
    // Имитация загрузки
    setTimeout(() => {
      setReviews(generateReviews());
      setIsRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleRefresh = () => {
    if (!isRefreshing) {
      loadReviews();
    }
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);
  const hasMoreReviews = reviews.length > 6;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">
            Последние отзывы от наших игроков
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl border border-primary/20">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">Общая оценка</span>
              <div className="flex items-center gap-2">
                <StarRating rating={5} size="md" />
                <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">4.8</span>
                <span className="text-xs sm:text-sm text-muted-foreground">/5</span>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border"></div>
            <div className="sm:hidden w-12 h-px bg-border"></div>
            <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
              <div>Основано на отзывах</div>
              <div className="font-semibold text-foreground">{reviews.length} игроков</div>
            </div>
          </div>
        </div>
        <div className="flex justify-center sm:justify-end w-full sm:w-auto shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-1 sm:gap-2 hover-scale text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 min-w-0"
          >
            <RefreshCw className={cn("h-3 w-3", isRefreshing && "animate-spin")} />
            <span className="hidden sm:inline">Обновить</span>
            <span className="sm:hidden">↻</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {displayedReviews.map((review, index) => (
          <Card key={review.id} className="group hover:shadow-lg transition-all duration-300 hover-scale border-primary/10 hover:border-primary/30 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold text-lg group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                      {review.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">{review.nickname}</h3>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                      <div className="flex items-center gap-1">
                        <StarRating rating={Math.round(review.overallRating)} size="sm" />
                        <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{review.overallRating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/30">
                    ✓ Проверенный игрок
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 sm:p-4 bg-muted/30 rounded-lg border-l-4 border-primary/50">
                <p className="leading-relaxed text-sm sm:text-base text-foreground/90 italic">"{review.text}"</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <h4 className="font-semibold text-foreground">Детальная оценка по критериям</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {review.criteria.map((criterion, criterionIndex) => (
                    <div 
                      key={criterionIndex} 
                      className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-muted-foreground/10 hover:border-primary/30 transition-all duration-300 hover-scale"
                    >
                      <span className="text-xs sm:text-sm font-medium text-foreground/80 truncate">{criterion.name}</span>
                      <StarRating rating={criterion.rating} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMoreReviews && (
        <div className="text-center">
          <Button
            variant="outline" 
            onClick={() => setShowAll(!showAll)}
            className="gap-2 hover-scale"
          >
            {showAll ? (
              <>
                <MessageSquare className="h-4 w-4" />
                Скрыть отзывы
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4" />
                Показать все отзывы ({reviews.length - 6} еще)
              </>
            )}
          </Button>
        </div>
      )}

      {reviews.length === 0 && !isRefreshing && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">Отзывы загружаются...</p>
        </div>
      )}
    </div>
  );
};