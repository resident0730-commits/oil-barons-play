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
  const wellSize = lowerType.includes('легендарн') || lowerType.includes('космическ') ? 320 : 
                   lowerType.includes('промышленн') || lowerType.includes('супер') ? 280 :
                   lowerType.includes('элитн') ? 240 :
                   lowerType.includes('премиум') ? 200 :
                   lowerType.includes('стандартн') ? 180 : 140;

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
      {/* Well Image - game asset style */}
      <div
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
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
          className="w-full h-full object-contain select-none"
          style={{
            animation: isAnimating ? 'bounce 0.5s ease-in-out' : undefined,
            imageRendering: 'crisp-edges',
          }}
          draggable={false}
        />

        {/* Coin counter badge */}
        {coins.length > 0 && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-full px-3 py-1.5 text-sm font-bold shadow-xl flex items-center gap-1.5 z-10 animate-bounce border-2 border-white">
            <Coins className="w-4 h-4" />
            {coins.length}
          </div>
        )}

        {/* Income indicator - farm game style */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-br from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg border-2 border-white">
          <span className="drop-shadow">{dailyIncome.toLocaleString()}₽/день</span>
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
