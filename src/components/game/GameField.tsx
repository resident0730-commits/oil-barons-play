import { useEffect, useState } from 'react';
import { WellNode } from './WellNode';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Fuel } from 'lucide-react';
import gameFieldBg from '@/assets/game-field-background.jpg';

interface Well {
  id: string;
  well_type: string;
  daily_income: number;
  level: number;
}

export const GameField = () => {
  const { user } = useAuth();
  const [wells, setWells] = useState<Well[]>([]);
  const [loading, setLoading] = useState(true);
  const [collectedAmount, setCollectedAmount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchWells();
    }
  }, [user]);

  const fetchWells = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('wells')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching wells:', error);
      toast.error('Ошибка загрузки скважин');
    } else {
      setWells(data || []);
    }
    setLoading(false);
  };

  const handleCoinsCollected = async (amount: number) => {
    if (!user) return;

    setCollectedAmount(prev => prev + amount);

    // Update balance in database
    try {
      await supabase.rpc('add_user_balance', {
        user_id: user.id,
        amount_to_add: amount,
      });

      toast.success(`Собрано ${amount}₽!`, {
        icon: '💰',
      });
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Ошибка при сборе монет');
    }
  };

  // Calculate positions for wells in organic farm-game style layout
  const calculateWellPositions = () => {
    const positions: { x: number; y: number }[] = [];
    const padding = 150;
    const minSpacing = 300;
    const maxSpacing = 400;
    
    wells.forEach((well, index) => {
      if (index === 0) {
        // First well in a nice starting position
        positions.push({ x: padding + 200, y: padding + 200 });
      } else {
        // Place subsequent wells in a more organic pattern
        const prevPos = positions[index - 1];
        const angle = (index * 137.5) * (Math.PI / 180); // Golden angle for natural distribution
        const distance = minSpacing + Math.random() * (maxSpacing - minSpacing);
        
        positions.push({
          x: prevPos.x + Math.cos(angle) * distance + (Math.random() - 0.5) * 100,
          y: prevPos.y + Math.sin(angle) * distance + (Math.random() - 0.5) * 100,
        });
      }
    });

    return positions;
  };

  const positions = calculateWellPositions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Fuel className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-lg font-medium">Загрузка месторождения...</p>
        </div>
      </div>
    );
  }

  if (wells.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md">
          <Fuel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Пока нет скважин</h2>
          <p className="text-muted-foreground mb-4">
            Купите свою первую скважину в магазине, и она появится здесь!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full min-h-screen overflow-auto"
      style={{
        backgroundImage: `url(${gameFieldBg})`,
        backgroundSize: '800px 800px',
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat',
      }}
    >

      {/* Stats overlay - farm game style */}
      <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-2xl border-4 border-white z-30 min-w-[200px]">
        <div className="text-xs text-white/90 mb-1 font-bold uppercase tracking-wide">Собрано за сессию</div>
        <div className="text-3xl font-black text-white drop-shadow-lg">{collectedAmount.toLocaleString()}₽</div>
        <div className="text-xs text-white/80 mt-2 flex items-center gap-2">
          <Fuel className="w-4 h-4" />
          <span>Скважин: {wells.length}</span>
        </div>
      </div>

      {/* Wells - positioned organically like farm game */}
      <div className="relative" style={{ width: '3000px', height: '3000px' }}>
        {wells.map((well, index) => (
          <WellNode
            key={well.id}
            id={well.id}
            type={well.well_type}
            dailyIncome={Number(well.daily_income)}
            level={well.level}
            position={positions[index]}
            onCoinsCollected={handleCoinsCollected}
          />
        ))}
      </div>
    </div>
  );
};
