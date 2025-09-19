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
  Info,
  Users,
  Search,
  Cog,
  Zap,
  Bot,
  Crown
} from 'lucide-react';
import { useGameData, BoosterType } from '@/hooks/useGameData';
import { useStatusBonuses } from '@/hooks/useStatusBonuses';
import { useToast } from '@/hooks/use-toast';
import { useCurrency } from '@/hooks/useCurrency';

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
  const { statusMultiplier, userTitles, getStatusDisplayNames } = useStatusBonuses();
  const { toast } = useToast();
  const { formatGameCurrency } = useCurrency();
  const [selectedBooster, setSelectedBooster] = useState<BoosterType | null>(null);

  // Calculate booster multiplier for display
  const getBoosterMultiplier = () => {
    let totalBonus = 0;
    boosters.forEach(booster => {
      const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
      if (isActive) {
        switch (booster.booster_type) {
          case 'worker_crew':
            totalBonus += booster.level * 10;
            break;
          case 'geological_survey':
            totalBonus += booster.level * 15;
            break;
          case 'advanced_equipment':
            totalBonus += booster.level * 25;
            break;
          case 'turbo_boost':
            totalBonus += 50;
            break;
          case 'automation':
            totalBonus += booster.level * 20;
            break;
        }
      }
    });
    return totalBonus;
  };

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
      baseCost: 20000,
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
      baseCost: 15000,
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
        description: `${booster.name} ${currentLevel === 1 ? 'удален' : 'понижен до уровня ' + (currentLevel - 1)}. Возврат: ${formatGameCurrency(result.refundAmount || 0)} (50%)`,
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
        description: `Нужно ${formatGameCurrency(cost)}`,
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
        {(boosters.length > 0 || statusMultiplier > 1) && (
          <div className="mt-6 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 rounded-xl border border-primary/30 shadow-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-3 text-foreground">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                <div className="absolute -inset-1 bg-primary/20 blur-sm rounded-full"></div>
              </div>
              Активные улучшения
            </h3>
            
            <div className="space-y-3 mb-4">
              {/* Status bonuses */}
              {statusMultiplier > 1 && (
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/20 hover:border-accent/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent/20 rounded-full">
                      <Crown className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">Статусные бонусы</div>
                      <div className="text-sm text-muted-foreground">
                        {userTitles.length > 0 ? getStatusDisplayNames().join(', ') : 'Активные достижения'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-accent text-lg">+{Math.round((statusMultiplier - 1) * 100)}%</div>
                  </div>
                </div>
              )}

              {/* Booster effects */}
              {boosters.map(booster => {
                const isActive = !booster.expires_at || new Date(booster.expires_at) > new Date();
                if (!isActive) return null;
                
                let effectText = '';
                let iconName = '';
                switch (booster.booster_type) {
                  case 'worker_crew':
                    effectText = `Бригада рабочих`;
                    iconName = 'Users';
                    break;
                  case 'geological_survey':
                    effectText = `Геологические исследования`;
                    iconName = 'Search';
                    break;
                  case 'advanced_equipment':
                    effectText = `Продвинутое оборудование`;
                    iconName = 'Cog';
                    break;
                  case 'turbo_boost':
                    effectText = `Турбо режим`;
                    iconName = 'Zap';
                    break;
                  case 'automation':
                    effectText = `Автоматизация`;
                    iconName = 'Bot';
                    break;
                }

                let bonusPercent = 0;
                switch (booster.booster_type) {
                  case 'worker_crew':
                    bonusPercent = booster.level * 10;
                    break;
                  case 'geological_survey':
                    bonusPercent = booster.level * 15;
                    break;
                  case 'advanced_equipment':
                    bonusPercent = booster.level * 25;
                    break;
                  case 'turbo_boost':
                    bonusPercent = 50;
                    break;
                  case 'automation':
                    bonusPercent = booster.level * 20;
                    break;
                }
                
                return (
                  <div key={booster.id} className="flex items-center justify-between p-4 bg-card/80 rounded-lg border border-primary/20 hover:border-primary/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-full">
                        {iconName === 'Users' && <Users className="h-4 w-4 text-primary" />}
                        {iconName === 'Search' && <Search className="h-4 w-4 text-primary" />}
                        {iconName === 'Cog' && <Cog className="h-4 w-4 text-primary" />}
                        {iconName === 'Zap' && <Zap className="h-4 w-4 text-primary" />}
                        {iconName === 'Bot' && <Bot className="h-4 w-4 text-primary" />}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{effectText}</div>
                        {booster.level > 1 && (
                          <div className="text-sm text-muted-foreground">Уровень {booster.level}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-primary text-lg">+{bonusPercent}%</div>
                      {booster.expires_at && (
                        <div className="text-xs text-orange-500 font-medium">
                          До {new Date(booster.expires_at).toLocaleString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            day: '2-digit',
                            month: '2-digit'
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                      <span className="font-bold">{formatGameCurrency(cost)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleBuyBooster(booster)}
                        disabled={loading || !profile || profile.balance < cost}
                        className="flex-1"
                        variant={profile && profile.balance >= cost ? "default" : "outline"}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {currentLevel === 0 ? 'Активировать' : 'Улучшить'}
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