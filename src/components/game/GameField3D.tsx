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

  // Calculate positions for wells in 3D space with better layout
  const calculateWellPositions = (): [number, number, number][] => {
    const positions: [number, number, number][] = [];
    
    // Create a more compact, organized layout
    const cols = Math.ceil(Math.sqrt(wells.length));
    const spacing = 6;
    const offsetX = (cols * spacing) / 2;
    const offsetZ = (cols * spacing) / 2;

    wells.forEach((well, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      // Small random offset for organic feel
      const randomX = (Math.random() - 0.5) * 1.5;
      const randomZ = (Math.random() - 0.5) * 1.5;
      
      positions.push([
        col * spacing - offsetX + randomX,
        0,
        row * spacing - offsetZ + randomZ,
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
      <div className="absolute bottom-4 left-4 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur rounded-xl p-4 text-white text-sm z-30 border border-white/10 shadow-2xl">
        <div className="font-bold mb-2 text-lg">🎮 Управление</div>
        <div className="space-y-1.5">
          <p className="flex items-center gap-2"><span className="text-amber-400">🖱️</span> Левая кнопка мыши + перемещение = вращение</p>
          <p className="flex items-center gap-2"><span className="text-blue-400">🔍</span> Колесико мыши = увеличение/уменьшение</p>
          <p className="flex items-center gap-2"><span className="text-green-400">👆</span> Клик по скважине = собрать монеты</p>
          <p className="flex items-center gap-2"><span className="text-purple-400">✨</span> Наведите мышь для подсветки</p>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{ 
          position: [0, 25, 30], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        shadows
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          {/* Improved Lighting Setup */}
          <ambientLight intensity={0.6} />
          
          {/* Main sun light */}
          <directionalLight 
            position={[20, 30, 20]} 
            intensity={1.2} 
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          
          {/* Fill lights for better visibility */}
          <pointLight position={[-20, 15, -20]} intensity={0.4} color="#60a5fa" />
          <pointLight position={[20, 15, -20]} intensity={0.4} color="#fbbf24" />

          {/* Beautiful sky with sunset colors */}
          <Sky 
            distance={450000}
            sunPosition={[100, 20, 100]}
            inclination={0.6}
            azimuth={0.25}
            rayleigh={0.5}
            turbidity={10}
            mieCoefficient={0.005}
            mieDirectionalG={0.8}
          />
          
          {/* Soft environment lighting */}
          <Environment preset="sunset" />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#87ceeb', 30, 100]} />

          {/* Improved ground with grass texture effect */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial 
              color="#4ade80" 
              roughness={0.9}
              metalness={0}
            />
          </mesh>

          {/* Dirt paths/roads for visual interest */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[8, 150]} />
            <meshStandardMaterial 
              color="#a16207" 
              roughness={1}
              metalness={0}
              opacity={0.6}
              transparent
            />
          </mesh>

          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[150, 8]} />
            <meshStandardMaterial 
              color="#a16207" 
              roughness={1}
              metalness={0}
              opacity={0.6}
              transparent
            />
          </mesh>

          {/* Subtle grid for industrial feel - less prominent */}
          <gridHelper 
            args={[150, 30, '#94a3b8', '#cbd5e1']} 
            position={[0, 0.02, 0]}
            material-opacity={0.2}
            material-transparent={true}
          />

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

          {/* Improved Camera controls */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={10}
            maxDistance={60}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, 0]}
            zoomSpeed={0.8}
            rotateSpeed={0.5}
            panSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
