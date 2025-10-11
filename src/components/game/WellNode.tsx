import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { CoinParticle } from './CoinParticle';

// Import well images
import starterWell from '@/assets/game-wells/starter-well-top.png';
import mediumWell from '@/assets/game-wells/medium-well-top.png';
import premiumWell from '@/assets/game-wells/premium-well-top.png';
import eliteWell from '@/assets/game-wells/elite-well-top.png';
import industrialWell from '@/assets/game-wells/industrial-well-top.png';
import legendaryWell from '@/assets/game-wells/legendary-well-top.png';
import superWell from '@/assets/game-wells/super-well-top.png';
import cosmicWell from '@/assets/game-wells/cosmic-well-top.png';

interface Coin {
  id: string;
  createdAt: number;
}

interface WellNodeProps {
  id: string;
  type: string;
  dailyIncome: number;
  level: number;
  position: { x: number; y: number };
  onCoinsCollected: (amount: number) => void;
}

const WELL_IMAGES: Record<string, string> = {
  'мини-скважина': starterWell,
  'стандартная скважина': mediumWell,
  'премиум-скважина': premiumWell,
  'супер-скважина': superWell,
  'промышленная скважина': industrialWell,
  'элитная скважина': eliteWell,
  'легендарная скважина': legendaryWell,
  'космическая скважина': cosmicWell,
};

const COIN_VALUE = 10; // Each coin worth 10₽

export const WellNode = ({ 
  id, 
  type, 
  dailyIncome, 
  level,
  position,
  onCoinsCollected 
}: WellNodeProps) => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate coin generation interval based on daily income
  // dailyIncome per day → convert to coins per minute
  const coinsPerMinute = dailyIncome / (24 * 60);
  const intervalMs = coinsPerMinute > 0 ? (60000 / coinsPerMinute) : 60000;

  useEffect(() => {
    // Generate coins periodically
    const interval = setInterval(() => {
      setCoins(prev => [
        ...prev,
        {
          id: `${id}-${Date.now()}-${Math.random()}`,
          createdAt: Date.now(),
        }
      ]);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, Math.max(intervalMs, 5000)); // Minimum 5 seconds between coins

    return () => clearInterval(interval);
  }, [dailyIncome, intervalMs, id]);

  const handleCoinCollect = (coinId: string) => {
    setCoins(prev => prev.filter(c => c.id !== coinId));
    onCoinsCollected(COIN_VALUE);
    
    // Play sound effect (if available)
    try {
      const audio = new Audio('/coin-collect.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore audio errors
    }
  };

  const handleWellClick = () => {
    if (coins.length === 0) return;
    
    const collectedAmount = coins.length * COIN_VALUE;
    setCoins([]);
    onCoinsCollected(collectedAmount);

    // Play collection sound
    try {
      const audio = new Audio('/coin-collect.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore
    }
  };

  const wellImage = WELL_IMAGES[type.toLowerCase()] || starterWell;
  const lowerType = type.toLowerCase();
  const wellSize = lowerType.includes('легендарн') || lowerType.includes('космическ') ? 200 : 
                   lowerType.includes('промышленн') || lowerType.includes('супер') ? 170 :
                   lowerType.includes('элитн') ? 140 :
                   lowerType.includes('премиум') ? 120 :
                   lowerType.includes('стандартн') ? 100 : 80;

  return (
    <div
      className="absolute"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${wellSize}px`,
        height: `${wellSize}px`,
      }}
    >
      {/* Well Image */}
      <div
        className={`relative cursor-pointer transition-all duration-300 hover:scale-110 ${
          isAnimating ? 'animate-pulse' : ''
        }`}
        onClick={handleWellClick}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={wellImage}
          alt={`${type} well`}
          className="w-full h-full object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 4px 20px rgba(0, 0, 0, 0.3))',
            animation: isAnimating ? 'bounce 0.5s ease-in-out' : undefined,
          }}
        />

        {/* Glow effect for working wells */}
        <div
          className="absolute inset-0 rounded-full opacity-30 blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        {/* Coin counter badge */}
        {coins.length > 0 && (
          <div className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full px-2 py-1 text-xs font-bold shadow-lg flex items-center gap-1 z-10 animate-bounce">
            <Coins className="w-3 h-3" />
            {coins.length}
          </div>
        )}

        {/* Income indicator */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-card/90 backdrop-blur px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg border border-primary/20">
          <span className="text-primary">{dailyIncome.toLocaleString()}₽</span>
          <span className="text-muted-foreground">/день</span>
        </div>
      </div>

      {/* Render coins */}
      {coins.map((coin, index) => (
        <CoinParticle
          key={coin.id}
          id={coin.id}
          onCollect={handleCoinCollect}
          wellPosition={{ 
            x: wellSize / 2 + (Math.random() - 0.5) * 40, 
            y: wellSize / 2 + (Math.random() - 0.5) * 40 
          }}
          delay={index * 200}
        />
      ))}
    </div>
  );
};
