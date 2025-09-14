import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift, Sparkles, Coins, Zap, Star, Crown, Diamond } from "lucide-react";
import { useGameData } from '@/hooks/useGameData';
import { useToast } from '@/hooks/use-toast';
import { useSound } from '@/hooks/useSound';

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
      {
        type: 'money',
        name: 'Бонусные монеты',
        amount: 2500,
        rarity: 'common',
        icon: <Coins className="h-6 w-6" />,
        description: '2,500 OC'
      },
      {
        type: 'money',
        name: 'Средний бонус',
        amount: 7500,
        rarity: 'rare',
        icon: <Coins className="h-6 w-6" />,
        description: '7,500 OC'
      },
      {
        type: 'booster',
        name: 'Турбо-буст',
        rarity: 'epic',
        icon: <Zap className="h-6 w-6" />,
        description: '+50% дохода на 24 часа',
        boosterType: 'turbo_boost'
      }
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
      {
        type: 'money',
        name: 'Крупный бонус',
        amount: 15000,
        rarity: 'rare',
        icon: <Coins className="h-6 w-6" />,
        description: '15,000 OC'
      },
      {
        type: 'booster',
        name: 'Рабочая бригада',
        rarity: 'epic',
        icon: <Zap className="h-6 w-6" />,
        description: '+10% дохода навсегда',
        boosterType: 'worker_crew'
      },
      {
        type: 'well',
        name: 'Премиум скважина',
        rarity: 'legendary',
        icon: <Crown className="h-6 w-6" />,
        description: 'Готовая к работе скважина',
        wellType: 'Премиум скважина'
      }
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
      {
        type: 'money',
        name: 'Огромный бонус',
        amount: 75000,
        rarity: 'epic',
        icon: <Coins className="h-6 w-6" />,
        description: '75,000 OC'
      },
      {
        type: 'well',
        name: 'Элитная скважина',
        rarity: 'legendary',
        icon: <Diamond className="h-6 w-6" />,
        description: 'Готовая к работе элитная скважина',
        wellType: 'Элитная скважина'
      },
      {
        type: 'multiplier',
        name: 'Супер множитель',
        amount: 2,
        rarity: 'legendary',
        icon: <Sparkles className="h-6 w-6" />,
        description: 'x2 ко всем доходам на 7 дней',
        multiplierDuration: 7
      }
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
  const { profile, buyWell, buyBooster, addIncome } = useGameData();
  const { toast } = useToast();
  const sounds = useSound();
  const [openingCase, setOpeningCase] = useState<CaseType | null>(null);
  const [showReward, setShowReward] = useState<CaseReward | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const openCase = async (caseType: CaseType) => {
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
      // Определяем награду по вероятности
      const rand = Math.random();
      let reward: CaseReward;
      
      if (rand < 0.05) { // 5% - legendary
        const legendaryRewards = caseType.rewards.filter(r => r.rarity === 'legendary');
        reward = legendaryRewards[Math.floor(Math.random() * legendaryRewards.length)] || caseType.rewards[0];
      } else if (rand < 0.20) { // 15% - epic
        const epicRewards = caseType.rewards.filter(r => r.rarity === 'epic');
        reward = epicRewards[Math.floor(Math.random() * epicRewards.length)] || caseType.rewards[0];
      } else if (rand < 0.50) { // 30% - rare
        const rareRewards = caseType.rewards.filter(r => r.rarity === 'rare');
        reward = rareRewards[Math.floor(Math.random() * rareRewards.length)] || caseType.rewards[0];
      } else { // 50% - common
        const commonRewards = caseType.rewards.filter(r => r.rarity === 'common');
        reward = commonRewards[Math.floor(Math.random() * commonRewards.length)] || caseType.rewards[0];
      }

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
    // Сначала списываем стоимость кейса
    await addIncome(-casePrice);
    
    switch (reward.type) {
      case 'money':
        if (reward.amount) {
          await addIncome(reward.amount);
        }
        break;
      case 'booster':
        if (reward.boosterType) {
          // Логика покупки бустера - можно реализовать позже
        }
        break;
      case 'well':
        if (reward.wellType) {
          // Логика получения скважины - можно реализовать позже
        }
        break;
      case 'multiplier':
        // Логика временного множителя - можно реализовать позже
        break;
    }

    toast({
      title: "Награда получена!",
      description: reward.description,
      className: getRarityColor(reward.rarity)
    });
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
                  <div className="text-sm font-medium">Возможные награды:</div>
                  <div className="grid grid-cols-3 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-gray-400">50%</div>
                      <div className="text-gray-300">Обычные</div>
                    </div>
                    <div className="text-center">
                      <div className="text-purple-400">20%</div>
                      <div className="text-purple-300">Редкие+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-400">5%</div>
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
                  <p className="text-sm text-muted-foreground animate-fade-in">{showReward.description}</p>
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