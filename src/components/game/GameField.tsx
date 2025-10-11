import { useEffect, useState } from 'react';
import { WellNode } from './WellNode';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Fuel } from 'lucide-react';

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

  // Calculate positions for wells in a grid with varied spacing
  const calculateWellPositions = () => {
    const positions: { x: number; y: number }[] = [];
    const padding = 80;
    const baseSpacing = 250;
    const cols = Math.ceil(Math.sqrt(wells.length));

    wells.forEach((well, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Add slight randomness to positions for more organic look
      const randomOffsetX = (Math.random() - 0.5) * 40;
      const randomOffsetY = (Math.random() - 0.5) * 40;
      
      positions.push({
        x: padding + col * baseSpacing + randomOffsetX,
        y: padding + row * baseSpacing + randomOffsetY,
      });
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
        background: 'linear-gradient(to bottom, #c2946f 0%, #d4a574 30%, #e0b589 60%, #d4a574 100%)',
      }}
    >
      {/* Desert sand texture */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.1) 1px, transparent 1px),
            radial-gradient(circle at 60% 70%, rgba(0,0,0,0.1) 1px, transparent 1px),
            radial-gradient(circle at 80% 20%, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 120px 120px, 90px 90px',
        }}
      />
      
      {/* Sand dunes pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'repeating-linear-gradient(120deg, transparent, transparent 100px, rgba(0,0,0,.1) 100px, rgba(0,0,0,.1) 200px)',
        }}
      />
      
      {/* Scattered rocks and details */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 15% 25%, rgba(101, 67, 33, 0.4) 0%, transparent 3%),
            radial-gradient(ellipse at 45% 65%, rgba(101, 67, 33, 0.3) 0%, transparent 2%),
            radial-gradient(ellipse at 75% 35%, rgba(101, 67, 33, 0.35) 0%, transparent 4%),
            radial-gradient(ellipse at 25% 85%, rgba(101, 67, 33, 0.3) 0%, transparent 3%),
            radial-gradient(ellipse at 85% 75%, rgba(101, 67, 33, 0.4) 0%, transparent 2.5%)
          `,
          backgroundSize: '600px 600px',
        }}
      />

      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-card/95 backdrop-blur rounded-lg p-4 shadow-2xl border border-primary/20 z-30">
        <div className="text-sm text-muted-foreground mb-1">Собрано за сессию</div>
        <div className="text-2xl font-bold text-primary">{collectedAmount.toLocaleString()}₽</div>
        <div className="text-xs text-muted-foreground mt-2">
          Активных скважин: {wells.length}
        </div>
      </div>

      {/* Wells */}
      <div className="relative" style={{ width: '2000px', height: '2000px' }}>
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
