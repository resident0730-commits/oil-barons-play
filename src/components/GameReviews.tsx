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
    "BlazeRunner", "CryptoKing", "SpeedDemon", "GhostRider", "StormChaser",
    "DeepMiner", "OilBaron", "WealthHunter", "DigitalNomad", "CashFlow",
    "CrazyGamer", "FastRunner", "SmartPlayer", "CoolDude", "EpicWin"
  ];

  const reviewTexts = [
    "Играю уже 3 недели, пока доволен. Получил выплаты 2 раза - пришло быстро.",
    "Неплохая игра, но хотелось бы больше бонусов для новичков.",
    "Скважины качаются долго, но это норм для такой игры. Главное что платят.",
    "Интерфейс простой, легко разобраться. Доходы небольшие но стабильные.",
    "Получил первые 500р через неделю игры. Работает, буду играть дальше.",
    "Поначалу непонятно было, но потом втянулся. Поддержка отвечает.",
    "Обычная idle игра, ничего особенного. Но деньги действительно выводят.",
    "Играю в обеденный перерыв, удобно что не требует постоянного внимания.",
    "Реферальная программа слабая, но сама игра норм. Получаю по 200-300р.",
    "За полтора месяца игры получил около 2к. Не миллионы конечно, но на кофе хватает.",
    "Минималистичный дизайн мне по душе, ничего лишнего.",
    "Техподдержка ответила через день. Не быстро, но проблему решили.",
    "Бустеры дорогие, но эффект есть. Пока экспериментирую с разными.",
    "Иногда скучновато, хотелось бы больше разнообразия в игровом процессе.",
    "Пока что лучшая игра такого типа из тех что пробовал. Рекомендую попробовать.",
    "При депозите от 10000 рублей дают бонус к депозиту! Выгодно.",
    "Есть акция на крупные депозиты от 10к - хороший бонус получил.",
    "Воспользовался предложением для депозитов от 10000р - советую!",
    "На крупные пополнения от десяти тысяч действует бонусная программа.",
    "Медленно но верно набираю доход. Главное терпение и правильная стратегия.",
    "Автоматизация работает хорошо, можно не заходить целый день.",
    "Вывод работает стабильно, проверял уже 5 раз. Все приходит вовремя.",
    "Чем больше скважин, тем больше доход. Логично, но нужны вложения.",
    "Техподдержка реально помогает, не отмахиваются от проблем.",
    "Бустеры стоящие, особенно на автоматизацию. Окупаются быстро.",
    "Реферальная система могла бы быть лучше, но в целом норм.",
    "Играю уже месяц, стабильно получаю по 500-1000 рублей в неделю.",
    "Простая механика, легко разобраться даже новичку в таких играх.",
    "Нравится что можно играть в фоне, не требует постоянного внимания.",
    "Баланс между вложениями и доходом адекватный, не обман.",
    "Скорость развития нормальная, не слишком быстро и не медленно.",
    "Поддержка быстро отвечает, решили мой вопрос за пару часов.",
    "Интерфейс понятный, все на русском языке, никаких проблем.",
    "Вывод средств работает четко, комиссии небольшие.",
    "Долгосрочная игра, подходит для пассивного заработка.",
    "Разнообразие скважин хорошее, есть из чего выбрать.",
    "Статистика подробная, видно весь прогресс и доходы.",
    "Никакого обмана, все честно. При вложениях получаешь результат.",
    "Удобно что есть мобильная версия, играю с телефона.",
    "Сообщество дружелюбное, в чате помогают новичкам советами.",
    "Регулярные обновления, разработчики не забросили проект.",
    "Хорошая альтернатива банковским вкладам с большей доходностью.",
    "Игра затягивает, интересно наблюдать как растет доход.",
    "Единственный минус - хочется больше игровых элементов.",
    "Первый раз играю в такую игру, пока все понравилось.",
    "Качество исполнения на уровне, видно что делали с душой.",
    "Начинал с минимального депозита, постепенно увеличиваю вложения.",
    "Друг посоветовал, сам теперь рекомендую другим.",
    "Время от времени захожу проверить доходы, приятно удивляет.",
    "Прозрачная система начислений, все понятно и логично.",
    "Никаких скрытых комиссий при выводе, что радует.",
    "Играю параллельно с основной работой, хороший пассивный доход.",
    "Достойная игра для тех кто понимает специфику таких проектов.",
    "Уведомления работают корректно, всегда в курсе событий.",
    "Система ачивок мотивирует продолжать развиваться в игре.",
    "Хороший баланс между риском и потенциальной прибылью.",
    "Попробовал из любопытства, остался из-за стабильных выплат.",
    "Не верил сначала что платят, но убедился на собственном опыте."
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
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-full border border-primary/10">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Отзывы игроков</span>
          <div className="flex items-center gap-2">
            <StarRating rating={5} size="sm" />
            <span className="text-sm font-bold text-primary">4.8</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2 text-muted-foreground hover:text-primary"
        >
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          Обновить
        </Button>
      </div>

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedReviews.map((review, index) => (
          <div 
            key={review.id} 
            className="group relative bg-gradient-to-br from-background via-background to-muted/20 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 animate-fade-in overflow-hidden" 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Gradient Accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Rating Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full border border-primary/20">
              <Star className="w-3 h-3 fill-current text-yellow-500" />
              <span className="text-xs font-bold text-foreground">{review.overallRating}</span>
            </div>

            <div className="relative p-6 space-y-4">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-bold text-primary group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  {review.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-foreground truncate">{review.nickname}</div>
                  <div className="text-xs text-muted-foreground">{review.date}</div>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                  "{review.text}"
                </p>
              </div>

              {/* Criteria Tags */}
              <div className="flex flex-wrap gap-2">
                {review.criteria.slice(0, 3).map((criterion, criterionIndex) => (
                  <div 
                    key={criterionIndex}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-muted/50 rounded-lg text-xs"
                  >
                    <span className="text-muted-foreground">{criterion.name}</span>
                    <div className="flex">
                      {Array.from({ length: criterion.rating }, (_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current text-yellow-500" />
                      ))}
                    </div>
                  </div>
                ))}
                {review.criteria.length > 3 && (
                  <div className="inline-flex items-center px-2 py-1 bg-primary/10 rounded-lg text-xs text-primary">
                    +{review.criteria.length - 3}
                  </div>
                )}
              </div>

              {/* Verified Badge */}
              <div className="flex items-center gap-1 text-xs text-primary">
                <div className="w-1 h-1 bg-primary rounded-full" />
                <span>Проверенный игрок</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {hasMoreReviews && (
        <div className="text-center">
          <Button
            variant="outline" 
            onClick={() => setShowAll(!showAll)}
            className="gap-2 rounded-full px-6 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            {showAll ? (
              <>
                Скрыть отзывы
              </>
            ) : (
              <>
                Показать еще {reviews.length - 6} отзывов
              </>
            )}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {reviews.length === 0 && !isRefreshing && (
        <div className="text-center py-16 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground">Отзывы загружаются...</p>
        </div>
      )}
    </div>
  );
};