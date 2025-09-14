import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  TrendingUp, 
  Sparkles,
  ShoppingCart,
  Info
} from 'lucide-react';
import { useGameData, BoosterType } from '@/hooks/useGameData';
import { useToast } from '@/hooks/use-toast';

// Import booster images
import workerCrewImg from '@/assets/boosters/worker-crew.png';
import geologicalSurveyImg from '@/assets/boosters/geological-survey.png';
import advancedEquipmentImg from '@/assets/boosters/advanced-equipment.png';
import turboBoostImg from '@/assets/boosters/turbo-boost.png';
import automationImg from '@/assets/boosters/automation.png';

interface BoosterShopProps {
  onClose?: () => void;
}

export function BoosterShop({ onClose }: BoosterShopProps) {
  const { profile, boosters, buyBooster, cancelBooster, loading, getActiveBoosterMultiplier } = useGameData();
  const { toast } = useToast();
  const [selectedBooster, setSelectedBooster] = useState<BoosterType | null>(null);

  // Early return if profile is not loaded yet
  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка магазина улучшений...</p>
        </div>
      </div>
    );
  }

  const availableBoosters: BoosterType[] = [
    {
      id: 'worker_crew',
      name: 'Квалифицированная бригада',
      description: 'Опытные рабочие увеличивают доходность всех скважин',
      icon: workerCrewImg,
      effect: '+10% к доходности всех скважин',
      maxLevel: 5,
      baseCost: 5000,
      costMultiplier: 1.8,
      bonusPerLevel: 10,
      duration: null, // Постоянный эффект
      rarity: 'common'
    },
    {
      id: 'geological_survey',
      name: 'Геологические исследования',
      description: 'Детальное изучение месторождений повышает эффективность',
      icon: geologicalSurveyImg,
      effect: '+15% к доходности скважин',
      maxLevel: 3,
      baseCost: 8000,
      costMultiplier: 2.0,
      bonusPerLevel: 15,
      duration: null,
      rarity: 'uncommon'
    },
    {
      id: 'advanced_equipment',
      name: 'Современное оборудование',
      description: 'Передовые технологии для максимальной добычи',
      icon: advancedEquipmentImg,
      effect: '+25% к доходности скважин',
      maxLevel: 3,
      baseCost: 15000,
      costMultiplier: 2.2,
      bonusPerLevel: 25,
      duration: null,
      rarity: 'rare'
    },
    {
      id: 'turbo_boost',
      name: 'Турбо режим',
      description: 'Временное увеличение добычи на 24 часа',
      icon: turboBoostImg,
      effect: '+50% к доходности на 24 часа',
      maxLevel: 1,
      baseCost: 3000,
      costMultiplier: 1.0,
      bonusPerLevel: 50,
      duration: 24 * 60 * 60 * 1000, // 24 часа в миллисекундах
      rarity: 'temporary'
    },
    {
      id: 'automation',
      name: 'Автоматизация',
      description: 'Скважины работают эффективнее без постоянного контроля',
      icon: automationImg,
      effect: '+20% к базовой доходности',
      maxLevel: 2,
      baseCost: 20000,
      costMultiplier: 2.5,
      bonusPerLevel: 20,
      duration: null,
      rarity: 'epic'
    }
  ];

  const getBoosterLevel = (boosterId: string) => {
    const userBooster = boosters.find(b => b.booster_type === boosterId);
    return userBooster?.level || 0;
  };

  const getBoosterCost = (booster: BoosterType) => {
    const currentLevel = getBoosterLevel(booster.id);
    if (currentLevel >= booster.maxLevel) return 0;
    return Math.floor(booster.baseCost * Math.pow(booster.costMultiplier, currentLevel));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'temporary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Обычный';
      case 'uncommon': return 'Необычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'temporary': return 'Временный';
      default: return 'Обычный';
    }
  };

  const isBoosterActive = (boosterId: string) => {
    const userBooster = boosters.find(b => b.booster_type === boosterId);
    if (!userBooster) return false;
    
    if (userBooster.expires_at) {
      return new Date(userBooster.expires_at) > new Date();
    }
    return userBooster.level > 0;
  };

  const handleCancelBooster = async (booster: BoosterType) => {
    if (!profile) {
      toast({
        title: "Ошибка",
        description: "Профиль не загружен",
        variant: "destructive"
      });
      return;
    }

    const currentLevel = getBoosterLevel(booster.id);
    if (currentLevel === 0) {
      toast({
        title: "Бустер не куплен",
        description: "У вас нет этого бустера для отмены",
        variant: "destructive"
      });
      return;
    }

    // Проверяем, что это не временный истекший бустер
    const userBooster = boosters.find(b => b.booster_type === booster.id);
    if (userBooster?.expires_at && new Date(userBooster.expires_at) <= new Date()) {
      toast({
        title: "Бустер истек",
        description: "Нельзя отменить истекший временный бустер",
        variant: "destructive"
      });
      return;
    }

    const result = await cancelBooster(booster.id);
    if (result.success) {
      toast({
        title: "Бустер отменен!",
        description: `${booster.name} ${currentLevel === 1 ? 'удален' : 'понижен до уровня ' + (currentLevel - 1)}. Возврат: ${result.refundAmount?.toLocaleString()} OC (50%)`,
      });
    } else {
      toast({
        title: "Ошибка отмены",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleBuyBooster = async (booster: BoosterType) => {
    if (!profile) {
      toast({
        title: "Ошибка",
        description: "Профиль не загружен",
        variant: "destructive"
      });
      return;
    }

    const currentLevel = getBoosterLevel(booster.id);
    if (currentLevel >= booster.maxLevel) {
      toast({
        title: "Максимальный уровень",
        description: "Этот бустер уже улучшен до максимального уровня",
        variant: "destructive"
      });
      return;
    }

    const cost = getBoosterCost(booster);
    if (profile.balance < cost) {
      toast({
        title: "Недостаточно средств",
        description: `Нужно ${cost.toLocaleString()} оилкоинов`,
        variant: "destructive"
      });
      return;
    }

    const result = await buyBooster(booster.id, cost, booster.duration);
    if (result.success) {
      toast({
        title: "Бустер приобретен!",
        description: `${booster.name} активирован${booster.duration ? ' на 24 часа' : ''}`,
      });
    } else {
      toast({
        title: "Ошибка покупки",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold heading-contrast mb-2">Магазин улучшений</h2>
        <p className="subtitle-contrast">
          Покупайте бустеры для увеличения доходности ваших скважин
        </p>
        
        {/* Current Booster Effects */}
        {boosters.length > 0 && (
          <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Активные улучшения
            </h3>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {boosters.map(booster => {
                const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
                if (!isActive) return null;
                
                let effectText = '';
                switch (booster.booster_type) {
                  case 'worker_crew':
                    effectText = `+${booster.level * 10}% от бригады (Ур.${booster.level})`;
                    break;
                  case 'geological_survey':
                    effectText = `+${booster.level * 15}% от исследований (Ур.${booster.level})`;
                    break;
                  case 'advanced_equipment':
                    effectText = `+${booster.level * 25}% от оборудования (Ур.${booster.level})`;
                    break;
                  case 'turbo_boost':
                    effectText = `+50% турбо режим`;
                    break;
                  case 'automation':
                    effectText = `+${booster.level * 20}% от автоматизации (Ур.${booster.level})`;
                    break;
                }
                
                return (
                  <div key={booster.id} className="flex justify-between items-center p-2 bg-background/50 rounded">
                    <span className="text-muted-foreground">{effectText}</span>
                    {booster.expires_at && (
                      <span className="text-xs text-orange-600">
                        До {new Date(booster.expires_at).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="col-span-full mt-2 pt-2 border-t border-primary/20">
                <div className="flex justify-between items-center font-semibold">
                  <span>Общий бонус:</span>
                  <span className="text-primary">
                    +{Math.round((getActiveBoosterMultiplier() - 1) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableBoosters.map((booster) => {
          const currentLevel = getBoosterLevel(booster.id);
          const cost = getBoosterCost(booster);
          const isMaxLevel = currentLevel >= booster.maxLevel;
          const isActive = isBoosterActive(booster.id);

          return (
            <Card key={booster.id} className={`relative hover:shadow-lg transition-all duration-300 hover:scale-105 ${isActive ? 'ring-2 ring-primary' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center space-y-3">
                  <div className="relative">
                    <img 
                      src={booster.icon} 
                      alt={booster.name}
                      className="w-32 h-32 rounded-lg object-cover border-3 border-primary/30 shadow-lg"
                    />
                    <Badge className={`absolute -top-2 -right-2 ${getRarityColor(booster.rarity)}`}>
                      {getRarityText(booster.rarity)}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-lg font-medium mb-2">{booster.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {booster.description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{booster.effect}</span>
                  </div>
                  
                  {booster.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Действует 24 часа</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Уровень:</span>
                    <span className="font-medium">
                      {currentLevel}/{booster.maxLevel}
                      {isActive && !booster.duration && ' (активен)'}
                    </span>
                  </div>
                  <Progress 
                    value={(currentLevel / booster.maxLevel) * 100} 
                    className="h-2"
                  />
                </div>

                {isMaxLevel ? (
                  <div className="space-y-2">
                    <Button disabled className="w-full">
                      Максимальный уровень
                    </Button>
                    {currentLevel > 0 && (
                      <Button 
                        onClick={() => handleCancelBooster(booster)}
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        className="w-full"
                      >
                        Отменить бустер (50% возврат)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Стоимость:</span>
                      <span className="font-bold">{cost.toLocaleString()} OC</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleBuyBooster(booster)}
                        disabled={loading || !profile || profile.balance < cost}
                        className="flex-1"
                        variant={profile && profile.balance >= cost ? "default" : "outline"}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {booster.duration ? 'Активировать' : 'Улучшить'}
                      </Button>
                      {currentLevel > 0 && (
                        <Button 
                          onClick={() => handleCancelBooster(booster)}
                          disabled={loading}
                          variant="destructive"
                          size="sm"
                          className="px-3"
                          title="Отменить бустер (50% возврат)"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full">
                      <Info className="h-4 w-4 mr-2" />
                      Подробнее
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <img src={booster.icon} alt={booster.name} className="h-8 w-8 object-cover rounded" />
                        {booster.name}
                      </DialogTitle>
                      <DialogDescription>
                        Подробная информация об улучшении и его эффекте на доходность.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p>{booster.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Эффект за уровень:</span>
                          <span>+{booster.bonusPerLevel}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Максимальный уровень:</span>
                          <span>{booster.maxLevel}</span>
                        </div>
                        {booster.duration && (
                          <div className="flex justify-between">
                            <span>Длительность:</span>
                            <span>24 часа</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Возврат при отмене:</span>
                          <span>50% от последнего уровня</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
              
              {isActive && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    Активен
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}