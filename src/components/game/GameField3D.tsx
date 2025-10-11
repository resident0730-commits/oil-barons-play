import { useEffect, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import { WellNode3D } from './WellNode3D';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Fuel, Loader2 } from 'lucide-react';

interface Well {
  id: string;
  well_type: string;
  daily_income: number;
  level: number;
}

export const GameField3D = () => {
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

  // Calculate positions for wells in 3D space
  const calculateWellPositions = (): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    const gridSize = 8;
    const spacing = 5;

    wells.forEach((well, index) => {
      const row = Math.floor(index / gridSize);
      const col = index % gridSize;
      
      // Add some randomness for organic placement
      const randomX = (Math.random() - 0.5) * 2;
      const randomZ = (Math.random() - 0.5) * 2;
      
      positions.push([
        col * spacing - (gridSize * spacing) / 2 + randomX,
        0,
        row * spacing - (gridSize * spacing) / 2 + randomZ,
      ]);
    });

    return positions;
  };

  const positions = calculateWellPositions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg font-medium">Загрузка 3D месторождения...</p>
        </div>
      </div>
    );
  }

  if (wells.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-green-200">
        <div className="text-center max-w-md">
          <Fuel className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Пока нет скважин</h2>
          <p className="text-muted-foreground mb-4">
            Купите свою первую скважину в магазине, и она появится здесь в 3D!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      {/* Stats overlay */}
      <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-2xl border-4 border-white z-30 min-w-[200px]">
        <div className="text-xs text-white/90 mb-1 font-bold uppercase tracking-wide">Собрано за сессию</div>
        <div className="text-3xl font-black text-white drop-shadow-lg">{collectedAmount.toLocaleString()}₽</div>
        <div className="text-xs text-white/80 mt-2 flex items-center gap-2">
          <Fuel className="w-4 h-4" />
          <span>Скважин: {wells.length}</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg p-3 text-white text-sm z-30">
        <p>🖱️ Вращайте камеру мышью</p>
        <p>🔍 Приближайте колесиком мыши</p>
        <p>👆 Кликайте на скважины для сбора монет</p>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 15, 15], fov: 60 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-10, 10, -10]} intensity={0.5} />

          {/* Environment */}
          <Sky sunPosition={[100, 20, 100]} />
          <Environment preset="sunset" />

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#86efac" />
          </mesh>

          {/* Grid helper for orientation */}
          <gridHelper args={[100, 20, '#64748b', '#94a3b8']} position={[0, 0, 0]} />

          {/* Wells */}
          {wells.map((well, index) => (
            <WellNode3D
              key={well.id}
              id={well.id}
              type={well.well_type}
              dailyIncome={Number(well.daily_income)}
              level={well.level}
              position={positions[index]}
              onCoinsCollected={handleCoinsCollected}
            />
          ))}

          {/* Camera controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
            maxPolarAngle={Math.PI / 2.1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
