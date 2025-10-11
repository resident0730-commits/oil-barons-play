import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';

interface CoinParticleProps {
  id: string;
  onCollect: (id: string) => void;
  wellPosition: { x: number; y: number };
  delay: number;
}

export const CoinParticle = ({ id, onCollect, wellPosition, delay }: CoinParticleProps) => {
  const [collected, setCollected] = useState(false);

  useEffect(() => {
    // Auto-collect after animation completes (in case user doesn't click)
    const timer = setTimeout(() => {
      if (!collected) {
        handleCollect();
      }
    }, 3000 + delay);

    return () => clearTimeout(timer);
  }, [collected, delay]);

  const handleCollect = () => {
    if (collected) return;
    setCollected(true);
    onCollect(id);
  };

  if (collected) return null;

  return (
    <div
      className="absolute cursor-pointer z-20 animate-fade-in"
      style={{
        left: `${wellPosition.x}px`,
        top: `${wellPosition.y}px`,
        animation: `floatUp 3s ease-out ${delay}ms forwards`,
      }}
      onClick={handleCollect}
    >
      <Coins
        className="w-8 h-8 text-amber-400 drop-shadow-lg filter"
        style={{
          filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.6))',
          animation: 'spin 2s linear infinite',
        }}
      />
    </div>
  );
};
