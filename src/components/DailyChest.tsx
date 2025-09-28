import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import treasureChestImage from '@/assets/treasure-chest.jpg';
import headphonesIcon from '@/assets/prizes/headphones.png';
import smartwatchIcon from '@/assets/prizes/smartwatch.png';
import droneIcon from '@/assets/prizes/drone.png';
import giftcardIcon from '@/assets/prizes/giftcard.png';
import usbHubIcon from '@/assets/prizes/usb-hub.png';
import powerbankIcon from '@/assets/prizes/powerbank.png';
import smarthomeIcon from '@/assets/prizes/smarthome.png';
import gamingGearIcon from '@/assets/prizes/gaming-gear.png';
import accessoriesIcon from '@/assets/prizes/accessories.png';
import { 
  Gift, 
  Sparkles, 
  Trophy, 
  Star, 
  Zap,
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  Settings
} from 'lucide-react';

// Реальные подарки на основе исследования рынка до 10,000₽
const realPrizes = [
  // Электроника и гаджеты
  { id: 1, name: "Беспроводные наушники Sony WH-CH720N", value: 8500, rarity: 'epic', icon: headphonesIcon, category: 'Электроника' },
  { id: 2, name: "Умные часы Xiaomi Mi Watch", value: 7200, rarity: 'epic', icon: smartwatchIcon, category: 'Электроника' },
  { id: 3, name: "Портативная колонка JBL Charge 5", value: 9800, rarity: 'legendary', icon: headphonesIcon, category: 'Электроника' },
  { id: 4, name: "Беспроводные наушники Huawei FreeBuds Pro", value: 6900, rarity: 'rare', icon: headphonesIcon, category: 'Электроника' },
  { id: 5, name: "Фитнес-браслет Xiaomi Mi Band 8", value: 3500, rarity: 'rare', icon: smartwatchIcon, category: 'Электроника' },
  
  // Игры и развлечения
  { id: 6, name: "Steam Gift Card 5000₽", value: 5000, rarity: 'epic', icon: giftcardIcon, category: 'Игры' },
  { id: 7, name: "PlayStation Store Gift Card 3000₽", value: 3000, rarity: 'rare', icon: giftcardIcon, category: 'Игры' },
  { id: 8, name: "Nintendo eShop Card 4000₽", value: 4000, rarity: 'rare', icon: giftcardIcon, category: 'Игры' },
  { id: 9, name: "Игровая мышь Logitech G Pro X", value: 8000, rarity: 'epic', icon: gamingGearIcon, category: 'Игры' },
  { id: 10, name: "Механическая клавиатура HyperX Alloy", value: 7500, rarity: 'epic', icon: gamingGearIcon, category: 'Игры' },
  
  // Аксессуары и товары для дома
  { id: 11, name: "Умная лампа Philips Hue", value: 4500, rarity: 'rare', icon: smarthomeIcon, category: 'Дом' },
  { id: 12, name: "Портативное зарядное устройство 20000mAh", value: 2800, rarity: 'common', icon: powerbankIcon, category: 'Аксессуары' },
  { id: 13, name: "Bluetooth-трекер Apple AirTag (4 шт)", value: 9500, rarity: 'legendary', icon: accessoriesIcon, category: 'Аксессуары' },
  { id: 14, name: "Умный термос Xiaomi с подогревом", value: 3200, rarity: 'rare', icon: smarthomeIcon, category: 'Дом' },
  { id: 15, name: "Беспроводное зарядное устройство Samsung", value: 2200, rarity: 'common', icon: accessoriesIcon, category: 'Аксессуары' },
  
  // Подписки и сервисы
  { id: 16, name: "Яндекс.Плюс на 12 месяцев", value: 4200, rarity: 'rare', icon: giftcardIcon, category: 'Подписки' },
  { id: 17, name: "Spotify Premium на 12 месяцев", value: 3600, rarity: 'rare', icon: giftcardIcon, category: 'Подписки' },
  { id: 18, name: "YouTube Premium на 6 месяцев", value: 2400, rarity: 'common', icon: giftcardIcon, category: 'Подписки' },
  { id: 19, name: "Netflix подписка на 6 месяцев", value: 3000, rarity: 'rare', icon: giftcardIcon, category: 'Подписки' },
  { id: 20, name: "Adobe Creative Cloud на 3 месяца", value: 6000, rarity: 'epic', icon: giftcardIcon, category: 'Подписки' },
  
  // Премиум категория
  { id: 21, name: "Квадрокоптер Xiaomi FIMI Mini", value: 9900, rarity: 'legendary', icon: droneIcon, category: 'Премиум' },
  { id: 22, name: "Экшн-камера Yi 4K+", value: 8800, rarity: 'epic', icon: accessoriesIcon, category: 'Премиум' },
  { id: 23, name: "Планшет Lenovo Tab M10 Plus", value: 9500, rarity: 'legendary', icon: accessoriesIcon, category: 'Премиум' },
  { id: 24, name: "Электронная книга Amazon Kindle", value: 7800, rarity: 'epic', icon: accessoriesIcon, category: 'Премиум' },
  { id: 25, name: "VR-очки Oculus Go", value: 9200, rarity: 'legendary', icon: accessoriesIcon, category: 'Премиум' },
  
  // Дополнительные подарки (25 штук для общего количества 50)
  { id: 26, name: "Умная розетка Xiaomi (комплект)", value: 1800, rarity: 'common', icon: smarthomeIcon, category: 'Дом' },
  { id: 27, name: "Bluetooth-колонка Anker SoundCore", value: 4200, rarity: 'rare', icon: headphonesIcon, category: 'Электроника' },
  { id: 28, name: "Веб-камера Logitech C920", value: 6500, rarity: 'epic', icon: accessoriesIcon, category: 'Электроника' },
  { id: 29, name: "Микрофон Blue Yeti Nano", value: 7000, rarity: 'epic', icon: headphonesIcon, category: 'Электроника' },   
  { id: 30, name: "Графический планшет Wacom Intuos", value: 5500, rarity: 'rare', icon: accessoriesIcon, category: 'Творчество' },
  { id: 31, name: "LED-лента с умным управлением", value: 2500, rarity: 'common', icon: smarthomeIcon, category: 'Дом' },
  { id: 32, name: "Термокружка с подогревом", value: 3800, rarity: 'rare', icon: accessoriesIcon, category: 'Аксессуары' },
  { id: 33, name: "Проектор портативный Xiaomi", value: 8500, rarity: 'epic', icon: accessoriesIcon, category: 'Электроника' },
  { id: 34, name: "Умный будильник с проекцией", value: 3200, rarity: 'rare', icon: smarthomeIcon, category: 'Дом' },
  { id: 35, name: "Массажер для шеи Xiaomi", value: 4500, rarity: 'rare', icon: accessoriesIcon, category: 'Здоровье' },
  { id: 36, name: "Электронные весы умные Xiaomi", value: 2800, rarity: 'common', icon: smarthomeIcon, category: 'Здоровье' },
  { id: 37, name: "Робот-пылесос Xiaomi Mi Robot", value: 9800, rarity: 'legendary', icon: droneIcon, category: 'Дом' },
  { id: 38, name: "Умный чайник Redmond SkyKettle", value: 4800, rarity: 'rare', icon: smarthomeIcon, category: 'Дом' },
  { id: 39, name: "Автомобильный видеорегистратор", value: 5200, rarity: 'rare', icon: accessoriesIcon, category: 'Авто' },
  { id: 40, name: "Держатель для телефона в авто", value: 1500, rarity: 'common', icon: accessoriesIcon, category: 'Авто' },
  { id: 41, name: "Умный замок Xiaomi", value: 6800, rarity: 'epic', icon: smarthomeIcon, category: 'Дом' },
  { id: 42, name: "Портативный SSD диск 1TB", value: 7500, rarity: 'epic', icon: accessoriesIcon, category: 'Электроника' },
  { id: 43, name: "Беспроводная мышь Logitech MX Master", value: 6200, rarity: 'epic', icon: gamingGearIcon, category: 'Электроника' },
  { id: 44, name: "USB-концентратор с быстрой зарядкой", value: 2200, rarity: 'common', icon: usbHubIcon, category: 'Аксессуары' },
  { id: 45, name: "Селфи-палка с Bluetooth", value: 1200, rarity: 'common', icon: accessoriesIcon, category: 'Аксессуары' },
  { id: 46, name: "Настольная лампа с беспроводной зарядкой", value: 3500, rarity: 'rare', icon: smarthomeIcon, category: 'Дом' },
  { id: 47, name: "Электрическая зубная щетка Oral-B", value: 4200, rarity: 'rare', icon: accessoriesIcon, category: 'Здоровье' },
  { id: 48, name: "Термостат умный Nest", value: 8200, rarity: 'epic', icon: smarthomeIcon, category: 'Дом' },
  { id: 49, name: "Дрон с камерой DJI Mini SE", value: 9700, rarity: 'legendary', icon: droneIcon, category: 'Премиум' },
  { id: 50, name: "Набор умной техники Xiaomi Starter Kit", value: 9900, rarity: 'legendary', icon: smarthomeIcon, category: 'Премиум' },
];

interface DailyChestProps {
  userId?: string;
  userIncome?: number;
  devMode?: boolean; // Режим разработчика
}

const DailyChest: React.FC<DailyChestProps> = ({ userId, userIncome = 0, devMode = false }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isOpened, setIsOpened] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [prize, setPrize] = useState<typeof realPrizes[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openProgress, setOpenProgress] = useState(0);
  const [timeUntilNextChest, setTimeUntilNextChest] = useState<string>('');
  const [showAllPrizes, setShowAllPrizes] = useState(false);

  const currentUserId = userId || user?.id;
  const chestKey = devMode ? `daily_chest_dev_${currentUserId}` : `daily_chest_${currentUserId}`;
  const hasRequiredIncome = userIncome >= 2000 || devMode;

  useEffect(() => {
    checkChestStatus();
    if (isOpened) {
      const interval = setInterval(updateTimeUntilReset, 1000);
      return () => clearInterval(interval);
    }
  }, [currentUserId, isOpened]);

  const updateTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeLeft = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    setTimeUntilNextChest(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const checkChestStatus = () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }
    
    try {
      const savedData = localStorage.getItem(chestKey);
      const today = new Date().toDateString();
      
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // В режиме разработчика сундук всегда доступен для открытия
        if (devMode) {
          setIsOpened(false);
          setPrize(null);
        } else {
          // Проверяем, открывался ли сундук сегодня
          if (data.date === today) {
            setIsOpened(true);
            if (data.prizeId) {
              const wonPrize = realPrizes.find(p => p.id === data.prizeId);
              setPrize(wonPrize || null);
            }
          } else {
            // Новый день - сбрасываем состояние
            setIsOpened(false);
            setPrize(null);
          }
        }
      }
    } catch (error) {
      console.error('Error checking chest status:', error);
    } finally {
      setLoading(false);
    }
  };

  const openChest = async () => {
    if (!currentUserId || isOpened || isOpening) return;
    
    // Проверяем доходность
    if (!hasRequiredIncome) {
      toast({
        title: "❌ Недостаточная доходность",
        description: `Для открытия сундука нужна доходность от 2,000₽/день. Ваша текущая: ${userIncome.toLocaleString()}₽/день`,
        variant: "destructive",
      });
      return;
    }

    setIsOpening(true);
    
    // Анимация открытия
    const interval = setInterval(() => {
      setOpenProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Определяем выпадет ли приз (75% шанс на приз, 25% на пустоту)
      const hasWon = Math.random() < 0.75;
      let wonPrize = null;

      if (hasWon) {
        // Выбираем случайный приз с учетом редкости
        const rarityChances = { legendary: 0.08, epic: 0.20, rare: 0.35, common: 0.37 };
        const rand = Math.random();
        let selectedRarity: keyof typeof rarityChances;
        
        if (rand < rarityChances.legendary) selectedRarity = 'legendary';
        else if (rand < rarityChances.legendary + rarityChances.epic) selectedRarity = 'epic';
        else if (rand < rarityChances.legendary + rarityChances.epic + rarityChances.rare) selectedRarity = 'rare';
        else selectedRarity = 'common';

        const availablePrizes = realPrizes.filter(p => p.rarity === selectedRarity);
        wonPrize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
      }

      // Сохраняем результат в localStorage (только если не режим разработчика)
      if (!devMode) {
        const chestData = {
          prizeId: wonPrize?.id || null,
          opened: true,
          date: new Date().toDateString(),
          openedAt: new Date().toISOString()
        };
        localStorage.setItem(chestKey, JSON.stringify(chestData));
      }

      setIsOpened(true);
      setPrize(wonPrize);
      
      if (wonPrize) {
        toast({
          title: "🎉 Поздравляем!",
          description: `Вы получили: ${wonPrize.name}! ${devMode ? "(Режим разработчика)" : "Подарок будет отправлен в течение 7 дней."}`,
        });
      } else {
        toast({
          title: "😔 Не повезло!",
          description: `В этот раз приз не выпал${devMode ? " (Режим разработчика)" : ", но завтра будет новый шанс!"}`,
        });
      }
    } catch (error) {
      console.error('Error opening chest:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при открытии сундука.",
        variant: "destructive",
      });
    } finally {
      setIsOpening(false);
      setOpenProgress(0);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'epic': return 'text-purple-400 border-purple-400/50 bg-purple-400/10';
      case 'rare': return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'Легендарный';
      case 'epic': return 'Эпический';
      case 'rare': return 'Редкий';
      default: return 'Обычный';
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/30 gradient-oil shadow-luxury animate-pulse">
        <CardContent className="p-8 text-center">
          <div className="h-16 w-16 bg-muted rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-3/4 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  if (!hasRequiredIncome) {
    return (
      <Card className="border-destructive/50 bg-destructive/5 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-muted/10"></div>
        <CardHeader className="text-center relative">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl text-destructive mb-4">
            <Lock className="h-8 w-8" />
            Ежедневный Сундук - Заблокирован
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6 relative">
          <div className="p-6 rounded-2xl border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 to-muted/20 backdrop-blur-sm">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-destructive animate-pulse" />
            <h3 className="text-xl font-bold text-foreground mb-3">
              Требуется минимальная доходность
            </h3>
            <p className="text-base text-muted-foreground mb-4">
              Для доступа к ежедневному сундуку с реальными призами необходима доходность от
            </p>
            <div className="text-3xl font-black text-primary mb-4">
              2,000₽/день
            </div>
            <div className="bg-muted/40 rounded-xl p-4 border border-muted">
              <p className="text-sm text-muted-foreground mb-2">Ваша текущая доходность:</p>
              <p className="text-2xl font-bold text-foreground">
                {userIncome.toLocaleString()}₽/день
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Осталось: <span className="font-bold text-primary">{Math.max(0, 2000 - userIncome).toLocaleString()}₽/день</span>
              </p>
            </div>
          </div>
          <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
            <p className="text-blue-400 text-sm font-medium flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              Увеличьте доходность, покупая более мощные скважины!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 gradient-oil shadow-luxury overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary animate-glow-pulse"></div>
      
      <CardHeader className="text-center relative">
        <CardTitle className="flex items-center justify-center gap-4 text-4xl font-extrabold mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 shadow-lg">
            {isOpened ? <CheckCircle className="h-10 w-10 text-green-400 animate-pulse" /> : <Gift className="h-10 w-10 text-primary animate-glow-pulse" />}
          </div>
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-wide font-black drop-shadow-lg">
            Ежедневный Сундук {devMode && <span className="text-sm text-yellow-400 font-normal">(DEV)</span>}
          </span>
          {devMode && (
            <div className="p-1 rounded-full bg-yellow-500/20">
              <Settings className="h-6 w-6 text-yellow-400" />
            </div>
          )}
        </CardTitle>
        <div className="space-y-3">
          <p className="text-xl font-bold text-foreground tracking-wide">
            {isOpened && !devMode ? `Следующий сундук через: ${timeUntilNextChest}` : 'Откройте сундук и получите реальный подарок!'}
          </p>
          {devMode && <p className="text-lg font-medium text-yellow-400">Режим разработчика: неограниченные попытки</p>}
        </div>
        
        {/* Кнопка для показа всех призов */}
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => setShowAllPrizes(!showAllPrizes)}
            className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30 hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 text-foreground font-medium"
          >
            {showAllPrizes ? 'Скрыть призы' : 'Посмотреть все призы'}
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        {/* Список всех призов */}
        {showAllPrizes && (
          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Возможные призы
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
              {realPrizes.map((prize) => (
                <div key={prize.id} className={`p-4 rounded-lg border ${getRarityColor(prize.rarity)} backdrop-blur-sm transition-all duration-300 hover:scale-105`}>
                  <div className="flex items-center gap-3 mb-2">
                    <img src={prize.icon} alt={prize.name} className="w-8 h-8 object-cover rounded" />
                    <Badge variant="outline" className={`${getRarityColor(prize.rarity)} text-xs font-medium`}>
                      {getRarityName(prize.rarity)}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm text-foreground mb-1 leading-tight">{prize.name}</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{prize.category}</span>
                    <span className="font-bold text-primary">{prize.value.toLocaleString()}₽</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Всего доступно <span className="font-bold text-primary">{realPrizes.length}</span> различных призов на сумму до <span className="font-bold text-accent">10,000₽</span>
              </p>
            </div>
          </div>
        )}
        
        {!isOpened && !isOpening && (
          <div className="space-y-8">
            {/* Главный сундук - премиальный дизайн */}
            <div className="relative group">
              <div className="relative mx-auto w-64 h-64 group-hover:scale-105 transition-all duration-700">
                {/* Анимированные световые эффекты */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/40 via-yellow-500/40 to-orange-500/40 rounded-[2rem] blur-2xl animate-glow-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-primary/30 via-accent/30 to-primary/30 rounded-[1.8rem] blur-lg animate-pulse delay-500"></div>
                
                {/* Основной контейнер сундука */}
                <div className="relative bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-900/90 rounded-[2rem] border-2 border-primary/40 shadow-2xl overflow-hidden backdrop-blur-xl h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 rounded-[2rem]"></div>
                  
                  {/* Изображение сундука */}
                  <div className="relative h-full flex items-center justify-center p-6">
                    <img 
                      src={treasureChestImage} 
                      alt="Treasure Chest" 
                      className="w-full h-full object-cover rounded-[1.5rem] opacity-95 group-hover:opacity-100 transition-opacity duration-500 shadow-2xl"
                    />
                    
                    {/* Магические эффекты поверх изображения */}
                    <div className="absolute inset-6 bg-gradient-to-tr from-transparent via-white/10 to-white/5 rounded-[1.5rem] pointer-events-none"></div>
                    <div className="absolute top-8 left-8 w-3 h-3 bg-white/30 rounded-full blur-sm animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-2 h-2 bg-primary/60 rounded-full blur-sm animate-ping"></div>
                  </div>
                  
                  {/* Анимированная иконка в углу */}
                  <div className="absolute -top-4 -right-4 z-10">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-spin shadow-2xl border-2 border-white/20">
                      <Sparkles className="h-7 w-7 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  
                  {/* Дополнительные анимированные элементы */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-12 left-12 w-2 h-2 bg-primary rounded-full animate-ping delay-1000"></div>
                    <div className="absolute bottom-16 left-8 w-1 h-1 bg-accent rounded-full animate-ping delay-500"></div>
                    <div className="absolute top-20 right-12 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping delay-1500"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Информационная секция - современный дизайн */}
            <div className="space-y-6">
              {/* Главная информационная карточка */}
              <div className="relative bg-gradient-to-br from-slate-800/60 via-slate-700/50 to-slate-900/60 backdrop-blur-2xl rounded-2xl border border-primary/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 backdrop-blur-sm border border-primary/30">
                      <Gift className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                      Реальные подарки каждый день!
                    </h3>
                  </div>
                  
                  {/* Категории призов - стильная сетка */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                      <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">🎧</span>
                      </div>
                      <span className="text-white font-medium">Наушники Sony, JBL</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                      <div className="p-2 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">⌚</span>
                      </div>
                      <span className="text-white font-medium">Умные часы Xiaomi</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                      <div className="p-2 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">🎮</span>
                      </div>
                      <span className="text-white font-medium">Steam Gift Cards</span>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 hover:border-primary/30 transition-all duration-300 group">
                      <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl">🚁</span>
                      </div>
                      <span className="text-white font-medium">Квадрокоптеры</span>
                    </div>
                  </div>

                  {/* Статистики - стильные бейджи */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-yellow-500/20 to-amber-500/20 backdrop-blur-sm border border-yellow-400/30 shadow-lg">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold text-sm">До 10,000₽</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-blue-400/30 shadow-lg">
                      <Trophy className="h-4 w-4 text-blue-400" />
                      <span className="text-blue-300 font-semibold text-sm">50 призов</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 shadow-lg">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span className="text-green-300 font-semibold text-sm">75% шанс</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-400/30 shadow-lg">
                      <Clock className="h-4 w-4 text-purple-400" />
                      <span className="text-purple-300 font-semibold text-sm">Ежедневно</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопка открыть - премиальный дизайн */}
              <div className="space-y-4">
                {/* Информация о требуемой доходности */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 border border-primary/20 backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">Требования для открытия</span>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm text-muted-foreground">Минимальная доходность: <span className="font-bold text-primary">2,000₽/день</span></p>
                    <p className="text-sm text-foreground">Ваша доходность: <span className="font-bold text-green-400">{userIncome.toLocaleString()}₽/день</span> ✅</p>
                  </div>
                </div>

                <Button
                  onClick={openChest}
                  disabled={!hasRequiredIncome}
                  size="lg"
                  className="w-full relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary hover:from-accent hover:via-primary hover:to-accent text-white font-bold py-8 text-2xl rounded-2xl shadow-2xl border-2 border-primary/40 transition-all duration-700 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <div className="p-2 rounded-full bg-white/20">
                      <Unlock className="h-8 w-8" />
                    </div>
                    <span>Открыть сундук</span>
                    <div className="p-2 rounded-full bg-white/20">
                      <Sparkles className="h-8 w-8 animate-spin" />
                    </div>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Button>
              </div>
            </div>
          </div>
        )}

        {isOpening && (
          <div className="text-center space-y-8">
            {/* Премиальная анимация открытия сундука */}
            <div className="relative">
              {/* Главный контейнер с анимацией */}
              <div className="relative mx-auto w-80 h-80">
                {/* Множественные световые кольца */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/40 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute inset-4 bg-gradient-to-br from-accent/30 via-primary/30 to-accent/30 rounded-full blur-2xl animate-glow-pulse delay-300"></div>
                <div className="absolute inset-8 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-full blur-xl animate-pulse delay-700"></div>
                
                {/* Основной контейнер сундука */}
                <div className="relative h-full bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-900/90 rounded-full border-4 border-primary/60 shadow-2xl overflow-hidden backdrop-blur-xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-full animate-spin-slow"></div>
                  
                  {/* Анимированный сундук в центре */}
                  <div className="relative z-10">
                    <img 
                      src={treasureChestImage} 
                      alt="Opening Chest" 
                      className="w-48 h-48 object-cover rounded-2xl shadow-2xl animate-bounce filter brightness-110 contrast-110"
                    />
                    
                    {/* Магические искры вокруг сундука */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                      <div className="absolute top-8 right-6 w-2 h-2 bg-primary rounded-full animate-ping delay-500"></div>
                      <div className="absolute bottom-6 left-8 w-2.5 h-2.5 bg-accent rounded-full animate-ping delay-1000"></div>
                      <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-1500"></div>
                      <div className="absolute top-1/2 left-2 w-1 h-1 bg-white rounded-full animate-ping delay-2000"></div>
                      <div className="absolute top-1/2 right-2 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-700"></div>
                    </div>
                  </div>
                  
                  {/* Вращающиеся иконки магии */}
                  <div className="absolute inset-12 animate-spin pointer-events-none">
                    <Sparkles className="absolute top-0 left-1/2 transform -translate-x-1/2 h-6 w-6 text-primary animate-pulse" />
                    <Star className="absolute top-1/2 right-0 transform -translate-y-1/2 h-5 w-5 text-accent animate-pulse delay-300" />
                    <Zap className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-400 animate-pulse delay-700" />
                    <Trophy className="absolute top-1/2 left-0 transform -translate-y-1/2 h-5 w-5 text-emerald-400 animate-pulse delay-1000" />
                  </div>
                </div>
                
                {/* Дополнительные анимационные элементы */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-8 left-16 w-4 h-4 bg-gradient-to-r from-primary to-accent rounded-full animate-ping delay-200"></div>
                  <div className="absolute top-16 right-8 w-3 h-3 bg-gradient-to-r from-accent to-primary rounded-full animate-ping delay-800"></div>
                  <div className="absolute bottom-12 left-8 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping delay-1200"></div>
                  <div className="absolute bottom-8 right-16 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-ping delay-400"></div>
                </div>
              </div>
            </div>
            
            {/* Информационная секция - современный дизайн */}
            <div className="space-y-6 max-w-md mx-auto">
              {/* Заголовок с анимацией */}
              <div className="text-center space-y-4">
                <h3 className="text-3xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                  ОТКРЫВАЕМ СУНДУК
                </h3>
                <p className="text-xl text-primary/80 font-semibold animate-bounce">
                  ✨ Определяем ваш подарок ✨
                </p>
              </div>
              
              {/* Прогресс-бар - премиальный дизайн */}
              <div className="relative">
                <div className="h-6 bg-gradient-to-r from-slate-800/60 to-slate-700/60 rounded-full border-2 border-primary/30 shadow-inner overflow-hidden backdrop-blur-sm">
                  <div 
                    className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full shadow-lg transition-all duration-300 relative overflow-hidden"
                    style={{ width: `${openProgress}%` }}
                  >
                    {/* Анимированный блик на прогресс-баре */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_1s_infinite] rounded-full"></div>
                  </div>
                </div>
                
                {/* Процент прогресса */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <span className="text-sm font-bold text-primary bg-slate-800/80 px-3 py-1 rounded-full border border-primary/30 backdrop-blur-sm">
                    {openProgress}%
                  </span>
                </div>
              </div>
              
              {/* Дополнительные эффекты */}
              <div className="flex justify-center items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  <span className="text-primary/80 text-sm font-medium">Магия в действии</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {isOpened && prize && (
          <div className="text-center space-y-8">
            {/* Результат с крутыми современными эффектами */}
            <div className="animate-scale-in">
              {/* Главная карточка с призом */}
              <div className="relative mx-auto w-96 h-[500px] mb-8">
                {/* Анимированный фон с частицами */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-500/20 to-cyan-500/20 rounded-[2rem] blur-2xl animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-emerald-400/10 via-teal-500/10 to-cyan-500/10 rounded-[1.8rem] blur-xl animate-glow-pulse"></div>
                
                {/* Основная карточка - Glass Morphism */}
                <div className="relative h-full bg-gradient-to-br from-slate-800/80 via-slate-700/70 to-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl overflow-hidden">
                  {/* Блики и переливы */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[2rem]"></div>
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-[2rem] blur-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-cyan-400/20 to-transparent rounded-[2rem] blur-xl"></div>
                  
                  {/* Верхняя секция с призом */}
                  <div className="relative flex flex-col h-full">
                    {/* Заголовок с редкостью */}
                    <div className="p-6 text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${getRarityColor(prize.rarity)} font-semibold text-sm shadow-lg`}>
                        <Star className="h-4 w-4" />
                        {getRarityName(prize.rarity)}
                        <Star className="h-4 w-4" />
                      </div>
                    </div>
                    
                    {/* Изображение приза */}
                    <div className="flex-1 flex items-center justify-center px-8">
                      <div className="relative group">
                        <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/30 shadow-2xl flex items-center justify-center p-8 group-hover:scale-105 transition-all duration-500">
                          <img 
                            src={prize.icon} 
                            alt={prize.name}
                            className="w-full h-full object-contain drop-shadow-2xl filter brightness-110"
                          />
                          {/* Анимированные блики на изображении */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                        {/* Светящееся кольцо вокруг изображения */}
                        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/50 via-teal-400/50 to-cyan-400/50 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-spin-slow"></div>
                      </div>
                    </div>
                    
                    {/* Информация о призе */}
                    <div className="p-8 bg-gradient-to-t from-slate-900/90 via-slate-800/50 to-transparent backdrop-blur-sm border-t border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-3 leading-tight bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent">
                        {prize.name}
                      </h3>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                          {prize.value.toLocaleString()}₽
                        </div>
                      </div>
                      <p className="text-emerald-200/80 text-sm font-medium">{prize.category}</p>
                    </div>
                  </div>
                  
                  {/* Анимированные частицы */}
                  <div className="absolute top-8 left-8 w-2 h-2 bg-emerald-400 rounded-full animate-ping delay-1000"></div>
                  <div className="absolute top-16 right-12 w-1 h-1 bg-teal-300 rounded-full animate-ping delay-500"></div>
                  <div className="absolute bottom-20 left-12 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping delay-1500"></div>
                  <div className="absolute bottom-32 right-8 w-1 h-1 bg-emerald-300 rounded-full animate-ping delay-2000"></div>
                </div>
              </div>
              
              {/* Поздравительное сообщение - Современный стиль */}
              <div className="max-w-lg mx-auto">
                <div className="relative bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-emerald-400/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-transparent to-cyan-400/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-400 shadow-lg">
                        <Trophy className="h-8 w-8 text-white drop-shadow-lg" />
                      </div>
                      <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                        ПОЗДРАВЛЯЕМ!
                      </h3>
                    </div>
                    <p className="text-xl text-emerald-100 mb-6 font-medium">
                      Вы выиграли <span className="font-bold text-white">{prize.name}</span>
                    </p>
                    <div className="space-y-3">
                      <p className="text-emerald-200/90 text-sm leading-relaxed">
                        {devMode ? (
                          <span className="flex items-center justify-center gap-2">
                            <Settings className="h-4 w-4" />
                            Режим разработчика - тестовый режим
                          </span>
                        ) : (
                          "🎁 Подарок будет доставлен в течение 7 рабочих дней"
                        )}
                      </p>
                      {!devMode && (
                        <p className="text-xs text-emerald-300/70">
                          Мы свяжемся с вами для уточнения деталей доставки
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isOpened && !prize && (
          <div className="text-center space-y-8">
            <div className="animate-scale-in">
              {/* Пустой сундук - современный дизайн */}
              <div className="relative mx-auto w-80 h-80 mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 via-slate-500/20 to-gray-600/20 rounded-[2rem] blur-2xl"></div>
                <div className="relative h-full bg-gradient-to-br from-slate-800/80 via-slate-700/70 to-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-[2rem]"></div>
                  <div className="text-center space-y-6">
                    <div className="relative">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gray-600/30 to-gray-800/30 backdrop-blur-sm border border-gray-500/20 flex items-center justify-center">
                        <X className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-gray-500/20 via-transparent to-gray-500/20 rounded-full blur-lg animate-pulse"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-300 mb-2">Пусто...</h3>
                      <p className="text-gray-500 text-sm">Сундук оказался пустым</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Сообщение о неудаче */}
              <div className="max-w-md mx-auto">
                <div className="relative bg-gradient-to-r from-gray-500/10 via-slate-500/10 to-gray-600/10 backdrop-blur-xl rounded-2xl border border-gray-500/20 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/5 via-transparent to-slate-400/5"></div>
                  <div className="relative p-8">
                    <div className="flex items-center justify-center gap-3 mb-6">
                      <div className="p-3 rounded-full bg-gradient-to-r from-gray-500 to-slate-500 shadow-lg">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-300">НЕ ПОВЕЗЛО</h3>
                    </div>
                    <p className="text-gray-400 mb-4 text-lg">
                      В этот раз приз не выпал
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {devMode ? (
                        <span className="flex items-center justify-center gap-2">
                          <Settings className="h-4 w-4" />
                          Режим разработчика - попробуйте еще раз!
                        </span>
                      ) : (
                        "Но завтра будет новый шанс получить крутой подарок!"
                      )}
                    </p>
                    {!devMode && (
                      <div className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm">
                        <p className="text-blue-400 text-sm font-medium flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4" />
                          Следующий сундук: {timeUntilNextChest}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyChest;