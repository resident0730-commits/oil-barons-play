import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Sparkles, Coins, Zap, Star, Crown, Diamond } from "lucide-react";
import { useGameData, wellTypes } from '@/hooks/useGameData';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/useSound';
import { useCurrency } from '@/hooks/useCurrency';
import { supabase } from '@/integrations/supabase/client';

export interface CaseReward {
  type: 'money' | 'booster' | 'well' | 'multiplier';
  name: string;
  amount?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  description: string;
  boosterType?: string;
  wellType?: string;
  multiplierDuration?: number;
}

export interface CaseType {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: React.ReactNode;
  rewards: CaseReward[];
  rarity: 'basic' | 'premium' | 'elite' | 'cosmic';
}

const caseTypes: CaseType[] = [
  {
    id: 'basic_case',
    name: 'Базовый кейс',
    description: 'Простые награды для начинающих магнатов',
    price: 5000,
    icon: <Gift className="h-8 w-8" />,
    rarity: 'basic',
    rewards: [
      // Common rewards (60%)
      { type: 'money', name: 'Небольшие монеты', amount: 1500, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '1,500 OC' },
      { type: 'money', name: 'Карманные деньги', amount: 2000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '2,000 OC' },
      { type: 'money', name: 'Стартовый капитал', amount: 2500, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '2,500 OC' },
      { type: 'money', name: 'Базовая прибыль', amount: 3000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '3,000 OC' },
      { type: 'money', name: 'Простой доход', amount: 3500, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '3,500 OC' },
      { type: 'money', name: 'Ежедневная касса', amount: 4000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '4,000 OC' },
      
      // Rare rewards (25%)
      { type: 'money', name: 'Неплохая находка', amount: 6000, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '6,000 OC' },
      { type: 'money', name: 'Удачная сделка', amount: 7500, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '7,500 OC' },
      { type: 'money', name: 'Выгодный контракт', amount: 9000, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '9,000 OC' },
      
      // Epic rewards (12%)
      { type: 'money', name: 'Крупная сделка', amount: 12000, rarity: 'epic', icon: <Coins className="h-6 w-6" />, description: '12,000 OC' },
      { type: 'booster', name: 'Мини турбо-буст', rarity: 'epic', icon: <Zap className="h-6 w-6" />, description: '+50% дохода на 12 часов', boosterType: 'turbo_boost' },
      
      // Legendary rewards (3%)
      { type: 'money', name: 'Базовый джекпот!', amount: 20000, rarity: 'legendary', icon: <Star className="h-6 w-6" />, description: '20,000 OC' }
    ]
  },
  {
    id: 'premium_case',
    name: 'Премиум кейс',
    description: 'Ценные награды для опытных игроков',
    price: 15000,
    icon: <Star className="h-8 w-8" />,
    rarity: 'premium',
    rewards: [
      // Common rewards (45%)
      { type: 'money', name: 'Солидная сумма', amount: 12000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '12,000 OC' },
      { type: 'money', name: 'Хорошая прибыль', amount: 15000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '15,000 OC' },
      { type: 'money', name: 'Стабильный доход', amount: 18000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '18,000 OC' },
      { type: 'money', name: 'Премиум бонус', amount: 21000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '21,000 OC' },
      
      // Rare rewards (35%)
      { type: 'money', name: 'Отличная находка', amount: 25000, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '25,000 OC' },
      { type: 'money', name: 'Ценная сделка', amount: 30000, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '30,000 OC' },
      { type: 'booster', name: 'Рабочая смена', rarity: 'rare', icon: <Zap className="h-6 w-6" />, description: '+10% дохода навсегда', boosterType: 'worker_crew' },
      { type: 'money', name: 'Премиум контракт', amount: 35000, rarity: 'rare', icon: <Coins className="h-6 w-6" />, description: '35,000 OC' },
      
      // Epic rewards (15%)
      { type: 'money', name: 'Эпическая прибыль', amount: 45000, rarity: 'epic', icon: <Crown className="h-6 w-6" />, description: '45,000 OC' },
      { type: 'booster', name: 'Геологическая разведка', rarity: 'epic', icon: <Zap className="h-6 w-6" />, description: '+15% дохода навсегда', boosterType: 'geological_survey' },
      { type: 'money', name: 'Золотая жила', amount: 55000, rarity: 'epic', icon: <Crown className="h-6 w-6" />, description: '55,000 OC' },
      
      // Legendary rewards (5%)
      { type: 'well', name: 'Премиум скважина', rarity: 'legendary', icon: <Diamond className="h-6 w-6" />, description: 'Готовая к работе скважина', wellType: 'Премиум скважина' },
      { type: 'money', name: 'Премиум джекпот!', amount: 80000, rarity: 'legendary', icon: <Crown className="h-6 w-6" />, description: '80,000 OC' }
    ]
  },
  {
    id: 'elite_case',
    name: 'Элитный кейс',
    description: 'Эксклюзивные награды для магнатов',
    price: 50000,
    icon: <Crown className="h-8 w-8" />,
    rarity: 'elite',
    rewards: [
      // Common rewards (40%)
      { type: 'money', name: 'Элитная прибыль', amount: 40000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '40,000 OC' },
      { type: 'money', name: 'VIP бонус', amount: 50000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '50,000 OC' },
      { type: 'money', name: 'Магнатский доход', amount: 60000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '60,000 OC' },
      { type: 'money', name: 'Элитная касса', amount: 70000, rarity: 'common', icon: <Coins className="h-6 w-6" />, description: '70,000 OC' },
      
      // Rare rewards (30%)
      { type: 'money', name: 'Крупная инвестиция', amount: 85000, rarity: 'rare', icon: <Star className="h-6 w-6" />, description: '85,000 OC' },
      { type: 'booster', name: 'Автоматизация', rarity: 'rare', icon: <Zap className="h-6 w-6" />, description: '+20% дохода навсегда', boosterType: 'automation' },
      { type: 'money', name: 'Золотой резерв', amount: 100000, rarity: 'rare', icon: <Star className="h-6 w-6" />, description: '100,000 OC' },
      { type: 'money', name: 'Элитный фонд', amount: 120000, rarity: 'rare', icon: <Star className="h-6 w-6" />, description: '120,000 OC' },
      
      // Epic rewards (20%)
      { type: 'money', name: 'Мега-прибыль', amount: 150000, rarity: 'epic', icon: <Crown className="h-6 w-6" />, description: '150,000 OC' },
      { type: 'well', name: 'Элитная скважина', rarity: 'epic', icon: <Diamond className="h-6 w-6" />, description: 'Готовая к работе элитная скважина', wellType: 'Элитная скважина' },
      { type: 'booster', name: 'Продвинутое оборудование', rarity: 'epic', icon: <Zap className="h-6 w-6" />, description: '+25% дохода навсегда', boosterType: 'advanced_equipment' },
      
      // Legendary rewards (10%)
      { type: 'money', name: 'Космический джекпот!', amount: 250000, rarity: 'legendary', icon: <Diamond className="h-6 w-6" />, description: '250,000 OC' },
      { type: 'multiplier', name: 'Супер множитель', amount: 2, rarity: 'legendary', icon: <Sparkles className="h-6 w-6" />, description: 'x2 ко всем доходам на 3 дня', multiplierDuration: 3 },
      { type: 'well', name: 'Легендарная скважина', rarity: 'legendary', icon: <Diamond className="h-6 w-6" />, description: 'Готовая легендарная скважина', wellType: 'Легендарная скважина' }
    ]
  }
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    case 'rare': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'epic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'legendary': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'basic': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    case 'premium': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
    case 'elite': return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
    case 'cosmic': return 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-300 border-pink-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getRarityGlow = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'shadow-lg shadow-yellow-500/20';
    case 'epic': return 'shadow-lg shadow-purple-500/20';
    case 'rare': return 'shadow-md shadow-blue-500/20';
    default: return '';
  }
};

export const CaseSystem = () => {
  const { profile, buyWell, buyBooster, addIncome, reload } = useGameData();
  const { user } = useAuth();
  const { formatGameCurrency } = useCurrency();
  const { toast } = useToast();
  const sounds = useSound();
  const [openingCase, setOpeningCase] = useState<CaseType | null>(null);
  const [showReward, setShowReward] = useState<CaseReward | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const getRewardDescription = (reward: CaseReward) => {
    if (reward.type === 'money' && reward.amount) {
      return formatGameCurrency(reward.amount);
    }
    return reward.description;
  };

  const openCase = async (caseType: CaseType) => {
    console.log(`🎯 Starting case opening: ${caseType.name} for ${caseType.price}`);
    console.log(`💰 Current balance: ${profile?.balance}`);
    
    if (!profile || profile.balance < caseType.price) {
      sounds.error();
      toast({
        title: "Недостаточно средств",
        description: `Нужно ${caseType.price.toLocaleString()} OC для открытия кейса`,
        variant: "destructive"
      });
      return;
    }

    setOpeningCase(caseType);
    setIsOpening(true);

    // Звук открытия кейса
    sounds.caseOpen();
    
    // Анимация открытия
    setTimeout(() => {
      console.log(`🎰 Determining reward for case: ${caseType.name}`);
      
      // Улучшенный алгоритм определения награды
      const allRewards = caseType.rewards;
      const commonRewards = allRewards.filter(r => r.rarity === 'common');
      const rareRewards = allRewards.filter(r => r.rarity === 'rare');
      const epicRewards = allRewards.filter(r => r.rarity === 'epic');
      const legendaryRewards = allRewards.filter(r => r.rarity === 'legendary');
      
      const rand = Math.random() * 100;
      let reward: CaseReward;
      
      // Настроенные вероятности для каждого кейса
      if (caseType.id === 'basic_case') {
        if (rand < 3 && legendaryRewards.length > 0) { // 3% legendary
          reward = legendaryRewards[Math.floor(Math.random() * legendaryRewards.length)];
        } else if (rand < 15 && epicRewards.length > 0) { // 12% epic
          reward = epicRewards[Math.floor(Math.random() * epicRewards.length)];
        } else if (rand < 40 && rareRewards.length > 0) { // 25% rare
          reward = rareRewards[Math.floor(Math.random() * rareRewards.length)];
        } else { // 60% common
          reward = commonRewards[Math.floor(Math.random() * commonRewards.length)];
        }
      } else if (caseType.id === 'premium_case') {
        if (rand < 5 && legendaryRewards.length > 0) { // 5% legendary
          reward = legendaryRewards[Math.floor(Math.random() * legendaryRewards.length)];
        } else if (rand < 20 && epicRewards.length > 0) { // 15% epic
          reward = epicRewards[Math.floor(Math.random() * epicRewards.length)];
        } else if (rand < 55 && rareRewards.length > 0) { // 35% rare
          reward = rareRewards[Math.floor(Math.random() * rareRewards.length)];
        } else { // 45% common
          reward = commonRewards[Math.floor(Math.random() * commonRewards.length)];
        }
      } else { // elite_case
        if (rand < 10 && legendaryRewards.length > 0) { // 10% legendary
          reward = legendaryRewards[Math.floor(Math.random() * legendaryRewards.length)];
        } else if (rand < 30 && epicRewards.length > 0) { // 20% epic
          reward = epicRewards[Math.floor(Math.random() * epicRewards.length)];
        } else if (rand < 60 && rareRewards.length > 0) { // 30% rare
          reward = rareRewards[Math.floor(Math.random() * rareRewards.length)];
        } else { // 40% common
          reward = commonRewards[Math.floor(Math.random() * commonRewards.length)];
        }
      }

      console.log(`🎁 Selected reward: ${reward.name} (${reward.type}, ${reward.rarity})`);

      // Звук получения награды
      if (reward.rarity === 'legendary') {
        sounds.success();
      } else if (reward.rarity === 'epic') {
        sounds.upgrade();
      } else {
        sounds.coin();
      }

      giveReward(reward, caseType.price);
      setShowReward(reward);
      setIsOpening(false);
    }, 3000);
  };

  const giveReward = async (reward: CaseReward, casePrice: number) => {
    console.log(`🎁 Processing reward: ${reward.name}, case cost: ${casePrice}`);
    console.log(`💰 Current balance before: ${profile?.balance}`);
    
    try {
      switch (reward.type) {
        case 'money':
          if (reward.amount) {
            // Вычисляем чистую прибыль (награда минус стоимость кейса)
            const netAmount = reward.amount - casePrice;
            console.log(`💵 Money reward: ${reward.amount}, net amount: ${netAmount}`);
            await addIncome(netAmount);
          } else {
            // Если денежной награды нет, просто списываем стоимость кейса
            console.log(`💸 No money reward, deducting case cost: -${casePrice}`);
            await addIncome(-casePrice);
          }
          break;
        case 'booster':
          // Сначала списываем стоимость кейса
          console.log(`⚡ Booster reward, deducting case cost: -${casePrice}`);
          await addIncome(-casePrice);
          if (reward.boosterType) {
            // Получаем бустер бесплатно из кейса (cost = 0)
            const result = await buyBooster(reward.boosterType, 0, null);
            if (result.success) {
              toast({
                title: "Бустер получен!",
                description: `${reward.name} добавлен в ваши бустеры`,
                className: getRarityColor(reward.rarity)
              });
            }
          }
          break;
        case 'well':
          // Списываем стоимость кейса и создаем скважину напрямую
          console.log(`🏭 Well reward, deducting case cost: -${casePrice}`);
          await addIncome(-casePrice);
          if (reward.wellType) {
            // Находим тип скважины
            const wellType = wellTypes.find(wt => wt.name === reward.wellType);
            if (wellType) {
              // Создаем скважину напрямую в базе, минуя buyWell
              if (user) {
                const { error: wellError } = await supabase
                  .from('wells')
                  .insert({
                    user_id: user.id,
                    well_type: wellType.name,
                    level: 1,
                    daily_income: wellType.baseIncome
                  });

                if (!wellError) {
                  // Перезагружаем данные игры
                  setTimeout(() => reload(), 100);
                  
                  toast({
                    title: "Скважина получена!",
                    description: `${reward.name} добавлена в ваши скважины`,
                    className: getRarityColor(reward.rarity)
                  });
                }
              }
            }
          }
          break;
        case 'multiplier':
          // Сначала списываем стоимость кейса
          console.log(`✨ Multiplier reward, deducting case cost: -${casePrice}`);
          await addIncome(-casePrice);
          // Временный множитель - пока просто уведомление
          toast({
            title: "Множитель получен!",
            description: `${reward.name} - функция будет добавлена позже`,
            className: getRarityColor(reward.rarity)
          });
          break;
      }

      // Общее уведомление о получении награды только для денежных наград
      if (reward.type === 'money') {
        toast({
          title: "Награда получена!",
          description: reward.description,
          className: getRarityColor(reward.rarity)
        });
      }
    } catch (error) {
      console.error('❌ Error processing reward:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обработать награду",
        variant: "destructive"
      });
    }
  };

  const closeDialog = () => {
    setOpeningCase(null);
    setShowReward(null);
    setIsOpening(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold heading-contrast mb-2">🎁 Сокровищница</h2>
        <p className="text-muted-foreground subtitle-contrast">
          Откройте кейсы и получите ценные награды для развития вашей нефтяной империи
        </p>
      </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {caseTypes.map((caseType, index) => {
              const canAfford = profile && profile.balance >= caseType.price;
              
              return (
                <Card 
                  key={caseType.id} 
                  className={`relative overflow-hidden group hover:shadow-luxury transition-all duration-300 ${getRarityGlow(caseType.rarity)} animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
              <div className={`absolute top-0 left-0 w-full h-1 ${getRarityColor(caseType.rarity).split(' ')[0]}`}></div>
              
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  <div className={`p-4 rounded-full ${getRarityColor(caseType.rarity)} animate-pulse`}>
                    {caseType.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">{caseType.name}</CardTitle>
                <CardDescription>{caseType.description}</CardDescription>
                <Badge className={`${getRarityColor(caseType.rarity)} mx-auto`}>
                  {caseType.rarity.charAt(0).toUpperCase() + caseType.rarity.slice(1)}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {caseType.price.toLocaleString()} OC
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Стоимость открытия
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Шансы выпадения:</div>
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">
                        {caseType.id === 'basic_case' ? '60%' : 
                         caseType.id === 'premium_case' ? '45%' : '40%'}
                      </div>
                      <div className="text-gray-300">Обычные</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-400">
                        {caseType.id === 'basic_case' ? '25%' : 
                         caseType.id === 'premium_case' ? '35%' : '30%'}
                      </div>
                      <div className="text-blue-300">Редкие</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400">
                        {caseType.id === 'basic_case' ? '12%' : 
                         caseType.id === 'premium_case' ? '15%' : '20%'}
                      </div>
                      <div className="text-purple-300">Эпич.</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400">
                        {caseType.id === 'basic_case' ? '3%' : 
                         caseType.id === 'premium_case' ? '5%' : '10%'}
                      </div>
                      <div className="text-yellow-300">Легенд.</div>
                    </div>
                  </div>
                </div>

                <Button
                  className={`w-full gradient-gold text-primary-foreground ${!canAfford ? 'opacity-50' : 'hover:scale-105 animate-fade-in'} transition-all`}
                  onClick={() => {
                    sounds.purchase();
                    openCase(caseType);
                  }}
                  disabled={!canAfford}
                >
                  <Gift className="h-4 w-4 mr-2" />
                  Открыть кейс
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Диалог открытия кейса */}
      <Dialog open={!!openingCase} onOpenChange={() => closeDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {openingCase ? `Открываем ${openingCase.name}` : ''}
            </DialogTitle>
            <DialogDescription className="text-center">
              {isOpening ? 'Подождите, кейс открывается...' : 'Ваша награда:'}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-6 py-6">
            {isOpening ? (
              <div className="animate-bounce-in">
                <div className={`p-8 rounded-full ${openingCase ? getRarityColor(openingCase.rarity) : ''} animate-glow-pulse`}>
                  {openingCase?.icon}
                </div>
              </div>
            ) : showReward ? (
              <div className="text-center space-y-4 animate-bounce-in">
                <div className={`inline-flex p-6 rounded-full ${getRarityColor(showReward.rarity)} ${getRarityGlow(showReward.rarity)} animate-glow-pulse`}>
                  {showReward.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold animate-fade-in">{showReward.name}</h3>
                  <p className="text-sm text-muted-foreground animate-fade-in">{getRewardDescription(showReward)}</p>
                  <Badge className={`${getRarityColor(showReward.rarity)} mt-2 animate-scale-in`}>
                    {showReward.rarity.charAt(0).toUpperCase() + showReward.rarity.slice(1)}
                  </Badge>
                </div>
              </div>
            ) : null}
          </div>

          {!isOpening && showReward && (
            <Button onClick={closeDialog} className="w-full">
              Забрать награду
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};