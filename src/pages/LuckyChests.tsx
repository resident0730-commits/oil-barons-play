import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useGameData } from "@/hooks/useGameData";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Package,
  Sparkles,
  Coins,
  Lock
} from "lucide-react";

// 3D Chest Component
const Chest3D = ({ type, className = "" }: { type: 'basic' | 'silver' | 'gold' | 'diamond'; className?: string }) => {
  const chestStyles = {
    basic: {
      body: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-800',
      lid: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
      lock: 'bg-gradient-to-br from-gray-300 to-gray-500',
      shine: 'from-gray-300/40'
    },
    silver: {
      body: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700',
      lid: 'bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600',
      lock: 'bg-gradient-to-br from-cyan-300 to-blue-400',
      shine: 'from-cyan-200/50'
    },
    gold: {
      body: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600',
      lid: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600',
      lock: 'bg-gradient-to-br from-yellow-200 to-orange-400',
      shine: 'from-yellow-100/60'
    },
    diamond: {
      body: 'bg-gradient-to-br from-purple-400 via-fuchsia-500 to-pink-600',
      lid: 'bg-gradient-to-br from-purple-300 via-fuchsia-400 to-pink-500',
      lock: 'bg-gradient-to-br from-purple-200 to-fuchsia-400',
      shine: 'from-white/70'
    }
  };

  const style = chestStyles[type];

  return (
    <div className={`relative ${className}`} style={{ perspective: '1000px' }}>
      <div className="relative w-32 h-32 mx-auto transform-gpu transition-transform duration-500 group-hover:scale-110 group-hover:rotate-y-12" 
           style={{ transformStyle: 'preserve-3d' }}>
        {/* Chest Body */}
        <div className={`absolute inset-x-4 bottom-0 h-20 ${style.body} rounded-lg shadow-2xl`}
             style={{ transform: 'translateZ(20px)' }}>
          <div className="absolute inset-0 bg-black/20 rounded-lg" />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.shine} to-transparent rounded-lg opacity-40`} />
          {/* Chest bands */}
          <div className="absolute left-2 right-2 top-1/3 h-1 bg-black/40 rounded" />
          <div className="absolute left-2 right-2 bottom-1/3 h-1 bg-black/40 rounded" />
        </div>

        {/* Chest Lid */}
        <div className={`absolute inset-x-4 top-4 h-12 ${style.lid} rounded-t-lg shadow-xl`}
             style={{ transform: 'translateZ(25px)' }}>
          <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
          <div className={`absolute inset-0 bg-gradient-to-br ${style.shine} to-transparent rounded-t-lg opacity-50`} />
          <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-black/30 rounded" />
        </div>

        {/* Lock */}
        <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-10 ${style.lock} rounded-lg shadow-lg border-2 border-black/20`}
             style={{ transform: 'translateZ(30px)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-lg" />
          <Lock className="absolute inset-0 m-auto w-4 h-4 text-black/40" />
        </div>

        {/* Magical glow */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
             style={{ 
               boxShadow: `0 0 40px ${type === 'diamond' ? 'rgba(168, 85, 247, 0.8)' : 
                                     type === 'gold' ? 'rgba(251, 191, 36, 0.8)' : 
                                     type === 'silver' ? 'rgba(59, 130, 246, 0.8)' : 
                                     'rgba(156, 163, 175, 0.6)'}`,
               transform: 'translateZ(15px)'
             }} 
        />
      </div>
    </div>
  );
};

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

interface Prize {
  id: string;
  name: string;
  icon: string;
  rarity: Rarity;
  value: number;
  description: string;
}

interface ChestType {
  id: string;
  name: string;
  icon: string;
  cost: number;
  color: string;
  glowColor: string;
  minRarity: Rarity;
}

const PRIZES: Prize[] = [
  // Common
  { id: 'coins_50', name: '50 Бочек', icon: '🪙', rarity: 'common', value: 50, description: 'Небольшая сумма' },
  { id: 'coins_100', name: '100 Бочек', icon: '💰', rarity: 'common', value: 100, description: 'Немного денег' },
  { id: 'coins_200', name: '200 Бочек', icon: '💵', rarity: 'common', value: 200, description: 'Неплохая сумма' },
  
  // Rare
  { id: 'coins_500', name: '500 Бочек', icon: '💸', rarity: 'rare', value: 500, description: 'Хорошая награда' },
  { id: 'coins_1000', name: '1000 Бочек', icon: '💎', rarity: 'rare', value: 1000, description: 'Отличный приз' },
  { id: 'booster_small', name: 'Мини-бустер', icon: '⚡', rarity: 'rare', value: 750, description: '+10% доход на 1 день' },
  
  // Epic
  { id: 'coins_2500', name: '2500 Бочек', icon: '💰', rarity: 'epic', value: 2500, description: 'Большая награда' },
  { id: 'coins_5000', name: '5000 Бочек', icon: '🏆', rarity: 'epic', value: 5000, description: 'Отличная находка' },
  { id: 'booster_medium', name: 'Бустер', icon: '🚀', rarity: 'epic', value: 4000, description: '+25% доход на 3 дня' },
  
  // Legendary
  { id: 'coins_10000', name: '10000 Бочек', icon: '👑', rarity: 'legendary', value: 10000, description: 'ДЖЕКПОТ!' },
  { id: 'coins_25000', name: '25000 Бочек', icon: '💎', rarity: 'legendary', value: 25000, description: 'МЕГА ДЖЕКПОТ!' },
  { id: 'booster_mega', name: 'Мега-бустер', icon: '⭐', rarity: 'legendary', value: 20000, description: '+50% доход на 7 дней' },
];

const CHEST_TYPES: ChestType[] = [
  { 
    id: 'basic', 
    name: 'Базовый сундук', 
    icon: 'basic', 
    cost: 100, 
    color: 'from-gray-600 to-gray-800',
    glowColor: 'rgba(156, 163, 175, 0.5)',
    minRarity: 'common'
  },
  { 
    id: 'silver', 
    name: 'Серебряный сундук', 
    icon: 'silver', 
    cost: 500, 
    color: 'from-blue-500 to-blue-700',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    minRarity: 'rare'
  },
  { 
    id: 'gold', 
    name: 'Золотой сундук', 
    icon: 'gold', 
    cost: 2000, 
    color: 'from-yellow-500 to-orange-600',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    minRarity: 'epic'
  },
  { 
    id: 'diamond', 
    name: 'Алмазный сундук', 
    icon: 'diamond', 
    cost: 5000, 
    color: 'from-purple-500 to-pink-600',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    minRarity: 'legendary'
  },
];

export default function LuckyChests() {
  const { user } = useAuth();
  const { profile, addIncome } = useGameData();
  const sounds = useSound();
  const { toast } = useToast();
  
  const [selectedChest, setSelectedChest] = useState<ChestType | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [openingAnimation, setOpeningAnimation] = useState(false);
  const [revealedPrize, setRevealedPrize] = useState<Prize | null>(null);
  const [spinningPrizes, setSpinningPrizes] = useState<Prize[]>([]);
  const [spinPosition, setSpinPosition] = useState(0);

  // Получить приз на основе редкости сундука
  const getPrize = (chestType: ChestType): Prize => {
    const random = Math.random();
    let targetRarity: Rarity;
    
    if (chestType.id === 'basic') {
      if (random < 0.7) targetRarity = 'common';
      else if (random < 0.95) targetRarity = 'rare';
      else targetRarity = 'epic';
    } else if (chestType.id === 'silver') {
      if (random < 0.5) targetRarity = 'rare';
      else if (random < 0.85) targetRarity = 'epic';
      else targetRarity = 'legendary';
    } else if (chestType.id === 'gold') {
      if (random < 0.6) targetRarity = 'epic';
      else targetRarity = 'legendary';
    } else {
      if (random < 0.7) targetRarity = 'legendary';
      else targetRarity = 'epic';
    }
    
    const availablePrizes = PRIZES.filter(p => p.rarity === targetRarity);
    return availablePrizes[Math.floor(Math.random() * availablePrizes.length)];
  };

  // Открытие сундука
  const openChest = async (chest: ChestType) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "⚠️ Требуется вход",
        description: "Войдите, чтобы открывать сундуки",
      });
      return;
    }

    if (!profile || profile.balance < chest.cost) {
      toast({
        variant: "destructive",
        title: "💰 Недостаточно средств",
        description: `Нужно ${chest.cost} бочек для открытия`,
      });
      return;
    }

    setSelectedChest(chest);
    setIsOpening(true);
    setOpeningAnimation(true);
    
    // Списываем средства
    try {
      await addIncome(-chest.cost);
    } catch (error) {
      console.error('Error deducting cost:', error);
      setIsOpening(false);
      setOpeningAnimation(false);
      return;
    }

    // Генерируем список призов для прокрутки
    const prize = getPrize(chest);
    const fakesPrizes: Prize[] = [];
    for (let i = 0; i < 50; i++) {
      fakesPrizes.push(PRIZES[Math.floor(Math.random() * PRIZES.length)]);
    }
    // Вставляем выигранный приз в конец
    fakesPrizes[45] = prize;
    setSpinningPrizes(fakesPrizes);
    setSpinPosition(0);

    sounds.caseOpen();

    // Анимация прокрутки
    let position = 0;
    const interval = setInterval(() => {
      position += 120;
      setSpinPosition(position);
      
      if (position >= 45 * 120) {
        clearInterval(interval);
        setTimeout(() => {
          setRevealedPrize(prize);
          setOpeningAnimation(false);
          sounds.success();
          
          // Добавляем выигрыш
          addIncome(prize.value);
          
          toast({
            title: `🎉 ${getRarityLabel(prize.rarity)}!`,
            description: `Вы выиграли: ${prize.name} (+${prize.value} бочек)`,
            duration: 5000,
          });
        }, 500);
      }
    }, 50);
  };

  // Сброс
  const reset = () => {
    setSelectedChest(null);
    setIsOpening(false);
    setOpeningAnimation(false);
    setRevealedPrize(null);
    setSpinningPrizes([]);
    setSpinPosition(0);
  };

  // Цвет редкости
  const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-700';
      case 'rare': return 'from-blue-500 to-blue-700';
      case 'epic': return 'from-purple-500 to-pink-600';
      case 'legendary': return 'from-yellow-400 to-orange-600';
    }
  };

  const getRarityGlow = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'rgba(107, 114, 128, 0.6)';
      case 'rare': return 'rgba(59, 130, 246, 0.8)';
      case 'epic': return 'rgba(168, 85, 247, 0.8)';
      case 'legendary': return 'rgba(251, 191, 36, 0.9)';
    }
  };

  const getRarityLabel = (rarity: Rarity) => {
    switch (rarity) {
      case 'common': return 'ОБЫЧНЫЙ';
      case 'rare': return 'РЕДКИЙ';
      case 'epic': return 'ЭПИЧЕСКИЙ';
      case 'legendary': return 'ЛЕГЕНДАРНЫЙ';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Modern ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-violet-600/20 via-fuchsia-500/20 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-cyan-500/15 via-blue-500/15 to-transparent rounded-full blur-3xl animate-float animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight">
              Сундуки Удачи
            </h1>
            <p className="text-white/50 text-sm font-medium tracking-wider uppercase">Премиум Система Наград</p>
          </div>
          <div className="w-20" />
        </div>

        {/* Balance - Modern card */}
        <div className="flex justify-center mb-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                  <Coins className="h-7 w-7 text-white" />
                </div>
                <div>
                  <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-1">Ваш баланс</p>
                  <p className="text-3xl font-bold text-white">
                    {profile?.balance.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isOpening ? (
          <>
            {/* Chest Selection */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-white/90 mb-2">Выберите сундук</h2>
              <p className="text-white/40 text-sm">Сундуки высшего уровня дают лучшие награды</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
              {CHEST_TYPES.map((chest, index) => {
                const canAfford = user && profile && profile.balance >= chest.cost;
                
                return (
                  <div 
                    key={chest.id}
                    className="group relative"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effect */}
                    <div 
                      className="absolute -inset-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 rounded-3xl"
                      style={{
                        background: `linear-gradient(135deg, ${chest.glowColor}, transparent)`
                      }}
                    />
                    
                    {/* Card */}
                    <div 
                      className={`relative h-full bg-white/[0.03] backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 ${
                        canAfford 
                          ? 'border-white/10 hover:border-white/20 hover:-translate-y-2 cursor-pointer' 
                          : 'border-white/5 opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => canAfford && openChest(chest)}
                    >
                      {/* Top section with 3D icon */}
                      <div className={`relative p-8 bg-gradient-to-br ${chest.color}`}>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                        <div className="relative text-center">
                          <Chest3D type={chest.id as 'basic' | 'silver' | 'gold' | 'diamond'} className="mb-4" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div className="text-center">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {chest.name}
                          </h3>
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                            <Coins className="h-4 w-4 text-yellow-400" />
                            <span className="text-white font-bold">{chest.cost.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs text-white/50">
                          <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                            <span>Мин. редкость</span>
                            <span className="text-white/80 font-medium">{getRarityLabel(chest.minRarity)}</span>
                          </div>
                          <div className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                            <span>Шанс легенды</span>
                            <span className="text-yellow-400 font-bold">
                              {chest.id === 'diamond' ? '70%' : chest.id === 'gold' ? '40%' : chest.id === 'silver' ? '15%' : '5%'}
                            </span>
                          </div>
                        </div>

                        <Button 
                          className={`w-full relative overflow-hidden group/btn ${
                            canAfford
                              ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                              : 'bg-white/5 text-white/30 border border-white/5 cursor-not-allowed'
                          }`}
                          disabled={!canAfford}
                        >
                          <span className="relative z-10 font-bold flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {canAfford ? 'Открыть сундук' : 'Недостаточно средств'}
                          </span>
                          {canAfford && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Section - Modern glassmorphic */}
            <div className="max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl opacity-50" />
                <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-all">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Система редкости</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { rarity: 'common', label: 'ОБЫЧНЫЙ', gradient: 'from-gray-500 to-gray-600', chance: '60-70%' },
                      { rarity: 'rare', label: 'РЕДКИЙ', gradient: 'from-blue-500 to-cyan-500', chance: '20-30%' },
                      { rarity: 'epic', label: 'ЭПИЧЕСКИЙ', gradient: 'from-purple-500 to-fuchsia-500', chance: '8-15%' },
                      { rarity: 'legendary', label: 'ЛЕГЕНДАРНЫЙ', gradient: 'from-yellow-400 to-orange-500', chance: '2-5%' },
                    ].map((item) => (
                      <div key={item.rarity} className="relative group/card">
                        <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-xl blur-xl opacity-0 group-hover/card:opacity-50 transition-opacity`} />
                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                          <Sparkles className={`h-8 w-8 mx-auto mb-2 ${item.gradient === 'from-yellow-400 to-orange-500' ? 'text-yellow-400' : item.gradient === 'from-purple-500 to-fuchsia-500' ? 'text-purple-400' : item.gradient === 'from-blue-500 to-cyan-500' ? 'text-blue-400' : 'text-gray-400'}`} />
                          <p className="font-bold text-white text-sm mb-1">{item.label}</p>
                          <p className="text-xs text-white/50">{item.chance}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { icon: Package, text: 'Каждый сундук содержит гарантированный приз', color: 'text-yellow-400' },
                      { icon: Sparkles, text: 'Сундуки высшего уровня дают лучшие шансы на редкие предметы', color: 'text-purple-400' },
                      { icon: Coins, text: 'Легендарные призы до 25 000 бочек!', color: 'text-orange-400' },
                      { icon: Package, text: 'Моментальное зачисление на ваш счёт', color: 'text-pink-400' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                        <item.icon className={`h-5 w-5 ${item.color} flex-shrink-0`} />
                        <span className="text-sm text-white/70">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            {openingAnimation ? (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-12">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-white mb-2">
                      Открытие {selectedChest?.name}
                    </h2>
                    <p className="text-white/50">Приготовьтесь к награде...</p>
                  </div>

                  {/* Modern Spinning Animation */}
                  <div className="relative h-80 bg-black/20 rounded-2xl overflow-hidden border border-white/10">
                    {/* Center indicator - modern style */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white to-transparent z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/30 rounded-2xl z-10 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                    </div>

                    {/* Prizes carousel - cleaner */}
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-y-1/2 flex gap-4 transition-all duration-75"
                      style={{ transform: `translate(-50%, -50%) translateX(-${spinPosition}px)` }}
                    >
                      {spinningPrizes.map((prize, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 w-32 h-48 bg-gradient-to-br ${getRarityColor(prize.rarity)} rounded-2xl p-4 flex flex-col items-center justify-center border border-white/20 backdrop-blur-xl`}
                        >
                          <div className="text-5xl mb-2">{prize.icon}</div>
                          <p className="text-xs text-white font-bold text-center leading-tight">{prize.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : revealedPrize ? (
              <div className="relative animate-scale-in">
                <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(revealedPrize.rarity)} rounded-3xl blur-3xl opacity-50`} />
                <div className={`relative bg-gradient-to-br ${getRarityColor(revealedPrize.rarity)} rounded-3xl p-16 text-center border-2 border-white/30 overflow-hidden`}>
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <div className="absolute inset-0">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-1 h-24 bg-white/20"
                        style={{
                          transform: `rotate(${i * 30}deg) translateY(-200px)`,
                          transformOrigin: 'top center',
                          animation: 'pulse 2s ease-in-out infinite',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative z-10">
                    <div className={`inline-block px-6 py-2 mb-6 rounded-full font-black text-lg uppercase tracking-wider ${
                      revealedPrize.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
                      revealedPrize.rarity === 'epic' ? 'bg-purple-600 text-white' :
                      revealedPrize.rarity === 'rare' ? 'bg-blue-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {getRarityLabel(revealedPrize.rarity)}
                    </div>

                    <div className="text-9xl mb-6 drop-shadow-2xl animate-bounce">
                      {revealedPrize.icon}
                    </div>

                    <h2 className="text-6xl font-black text-white mb-4 drop-shadow-2xl">
                      {revealedPrize.name}
                    </h2>
                    
                    <p className="text-xl text-white/80 mb-6">
                      {revealedPrize.description}
                    </p>

                    <div className="inline-block px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl mb-8">
                      <p className="text-5xl font-black text-yellow-300">
                        +{revealedPrize.value.toLocaleString()}
                      </p>
                    </div>

                    <Button
                      onClick={reset}
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 text-white font-bold text-lg px-12 py-6 backdrop-blur-xl border border-white/20 rounded-xl"
                    >
                      <Package className="mr-2 h-5 w-5" />
                      Открыть еще
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}