import { useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder, Sphere, Cone, Torus, RoundedBox } from '@react-three/drei';

interface StylizedWell3DProps {
  id: string;
  type: string;
  dailyIncome: number;
  level: number;
  position: [number, number, number];
  onCoinsCollected: (amount: number) => void;
}

export const StylizedWell3D = ({ 
  type, 
  dailyIncome, 
  position,
  onCoinsCollected 
}: StylizedWell3DProps) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [coins, setCoins] = useState(0);

  // Анимация
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      groupRef.current.rotation.y += 0.005;
    }
  });

  const handleClick = () => {
    const amount = Math.floor(dailyIncome / 100);
    setCoins(coins + 1);
    onCoinsCollected(amount);
    
    try {
      const audio = new Audio('/coin-collect.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const lowerType = type.toLowerCase();

  // Космическая скважина - фантазийная с кристаллами
  if (lowerType.includes('космическ')) {
    return (
      <group ref={groupRef} position={position}>
        {/* Светящаяся платформа */}
        <Cylinder args={[1.5, 1.5, 0.3, 16]} position={[0, 0.15, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#581c87" metalness={0.9} roughness={0.1} emissive="#7c3aed" emissiveIntensity={0.5} />
        </Cylinder>

        {/* Центральный кристалл */}
        <Cone args={[0.6, 2, 6]} position={[0, 1.5, 0]} rotation={[0, Math.PI / 6, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#a78bfa" metalness={0.8} roughness={0.2} emissive="#c4b5fd" emissiveIntensity={1} transparent opacity={0.8} />
        </Cone>

        {/* Боковые кристаллы */}
        {[0, 120, 240].map((angle, i) => (
          <Cone key={i} args={[0.3, 1, 6]} 
            position={[Math.cos(angle * Math.PI / 180) * 0.8, 1, Math.sin(angle * Math.PI / 180) * 0.8]} 
            rotation={[0.2, angle * Math.PI / 180, 0]} castShadow>
            <meshStandardMaterial color="#c4b5fd" metalness={0.7} roughness={0.3} emissive="#ddd6fe" emissiveIntensity={0.8} transparent opacity={0.7} />
          </Cone>
        ))}

        {/* Светящиеся частицы */}
        {[0, 90, 180, 270].map((angle, i) => (
          <Sphere key={i} args={[0.1, 16, 16]} 
            position={[Math.cos(angle * Math.PI / 180) * 1, 2.5, Math.sin(angle * Math.PI / 180) * 1]}>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={2} />
          </Sphere>
        ))}

        <Text position={[0, -0.2, 0]} fontSize={0.3} color="#a78bfa" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {dailyIncome.toLocaleString()}₽/д
        </Text>
        {coins > 0 && (
          <Sphere args={[0.3, 16, 16]} position={[0, 3, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
        )}
        {hovered && <Torus args={[1.8, 0.08, 16, 32]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#a78bfa" transparent opacity={0.6} emissive="#a78bfa" emissiveIntensity={1} />
        </Torus>}
      </group>
    );
  }

  // Легендарная скважина - эпическая башня с огнем
  if (lowerType.includes('легендарн')) {
    return (
      <group ref={groupRef} position={position}>
        {/* Каменная база */}
        <Cylinder args={[1.6, 1.8, 0.5, 8]} position={[0, 0.25, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#78350f" metalness={0.3} roughness={0.8} />
        </Cylinder>

        {/* Центральная башня */}
        <Cylinder args={[0.7, 0.9, 2.5, 8]} position={[0, 1.75, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.4} />
        </Cylinder>

        {/* Декоративные кольца */}
        {[1, 2, 2.8].map((h, i) => (
          <Torus key={i} args={[0.85, 0.08, 8, 16]} position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.5} />
          </Torus>
        ))}

        {/* Огненные элементы */}
        {[0, 90, 180, 270].map((angle, i) => (
          <Cone key={i} args={[0.15, 0.6, 8]} 
            position={[Math.cos(angle * Math.PI / 180) * 0.7, 3.2, Math.sin(angle * Math.PI / 180) * 0.7]} 
            castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.5} />
          </Cone>
        ))}

        {/* Верхушка */}
        <Sphere args={[0.4, 16, 16]} position={[0, 3.5, 0]} castShadow>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={1} />
        </Sphere>

        <Text position={[0, -0.3, 0]} fontSize={0.3} color="#ef4444" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {dailyIncome.toLocaleString()}₽/д
        </Text>
        {coins > 0 && (
          <Sphere args={[0.3, 16, 16]} position={[0, 4, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
        )}
        {hovered && <Torus args={[2, 0.08, 16, 32]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#ef4444" transparent opacity={0.6} emissive="#ef4444" emissiveIntensity={1} />
        </Torus>}
      </group>
    );
  }

  // Элитная скважина - золотая станция
  if (lowerType.includes('элитн')) {
    return (
      <group ref={groupRef} position={position}>
        {/* Золотая платформа */}
        <RoundedBox args={[2, 0.3, 2]} radius={0.1} position={[0, 0.15, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
        </RoundedBox>

        {/* Центральное строение */}
        <Cylinder args={[0.6, 0.8, 1.5, 8]} position={[0, 1.05, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </Cylinder>

        {/* Крыша */}
        <Cone args={[0.9, 0.6, 8]} position={[0, 2.1, 0]} castShadow>
          <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
        </Cone>

        {/* Декоративные колонны */}
        {[[-0.8, 0.8], [0.8, 0.8], [-0.8, -0.8], [0.8, -0.8]].map(([x, z], i) => (
          <Cylinder key={i} args={[0.1, 0.1, 1.2, 8]} position={[x, 0.9, z]} castShadow>
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} emissive="#f59e0b" emissiveIntensity={0.3} />
          </Cylinder>
        ))}

        <Text position={[0, -0.2, 0]} fontSize={0.3} color="#fbbf24" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {dailyIncome.toLocaleString()}₽/д
        </Text>
        {coins > 0 && (
          <Sphere args={[0.3, 16, 16]} position={[0, 2.8, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
        )}
        {hovered && <Torus args={[1.5, 0.08, 16, 32]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#fbbf24" transparent opacity={0.6} emissive="#fbbf24" emissiveIntensity={1} />
        </Torus>}
      </group>
    );
  }

  // Промышленная/Супер - качалка (pump jack)
  if (lowerType.includes('промышленн') || lowerType.includes('супер')) {
    const color = lowerType.includes('промышленн') ? '#fb923c' : '#3b82f6';
    return (
      <group ref={groupRef} position={position}>
        {/* База */}
        <RoundedBox args={[1.8, 0.3, 1.8]} radius={0.08} position={[0, 0.15, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
        </RoundedBox>

        {/* Треугольная опора */}
        <Cone args={[0.5, 2, 4]} position={[0, 1.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </Cone>

        {/* Балансир (качающаяся часть) */}
        <Box args={[2, 0.2, 0.3]} position={[0.3, 2.2, 0]} rotation={[0, 0, -0.2]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </Box>

        {/* Головка качалки */}
        <Sphere args={[0.25, 16, 16]} position={[1.2, 2.1, 0]} castShadow>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </Sphere>

        {/* Двигатель */}
        <RoundedBox args={[0.6, 0.5, 0.6]} radius={0.05} position={[-0.6, 0.55, 0]} castShadow>
          <meshStandardMaterial color="#71717a" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        <Text position={[0, -0.2, 0]} fontSize={0.3} color={color} anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {dailyIncome.toLocaleString()}₽/д
        </Text>
        {coins > 0 && (
          <Sphere args={[0.3, 16, 16]} position={[0, 3, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
        )}
        {hovered && <Torus args={[1.3, 0.08, 16, 32]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={1} />
        </Torus>}
      </group>
    );
  }

  // Премиум - золотая качалка
  if (lowerType.includes('премиум')) {
    return (
      <group ref={groupRef} position={position}>
        <RoundedBox args={[1.6, 0.3, 1.6]} radius={0.08} position={[0, 0.15, 0]} castShadow
          onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <meshStandardMaterial color="#0891b2" metalness={0.7} roughness={0.3} />
        </RoundedBox>

        <Cone args={[0.45, 1.8, 4]} position={[0, 1.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <meshStandardMaterial color="#06b6d4" metalness={0.8} roughness={0.2} />
        </Cone>

        <Box args={[1.8, 0.18, 0.25]} position={[0.2, 2, 0]} rotation={[0, 0, -0.15]} castShadow>
          <meshStandardMaterial color="#22d3ee" metalness={0.8} roughness={0.2} />
        </Box>

        <Sphere args={[0.22, 16, 16]} position={[1.05, 1.9, 0]} castShadow>
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </Sphere>

        <RoundedBox args={[0.5, 0.45, 0.5]} radius={0.05} position={[-0.5, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </RoundedBox>

        <Text position={[0, -0.2, 0]} fontSize={0.3} color="#06b6d4" anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
          {dailyIncome.toLocaleString()}₽/д
        </Text>
        {coins > 0 && (
          <Sphere args={[0.3, 16, 16]} position={[0, 2.7, 0]} castShadow>
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
          </Sphere>
        )}
        {hovered && <Torus args={[1.2, 0.08, 16, 32]} position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#22d3ee" transparent opacity={0.6} emissive="#22d3ee" emissiveIntensity={1} />
        </Torus>}
      </group>
    );
  }

  // Стартовая/Средняя - простая вышка
  const isStarter = lowerType.includes('мини') || lowerType.includes('старт');
  const color = isStarter ? '#fb923c' : '#10b981';
  
  return (
    <group ref={groupRef} position={position}>
      <Cylinder args={[0.9, 1, 0.25, 8]} position={[0, 0.125, 0]} castShadow
        onClick={handleClick} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <meshStandardMaterial color="#a1a1aa" metalness={0.5} roughness={0.5} />
      </Cylinder>

      {[[-0.35, 0.35], [0.35, 0.35], [-0.35, -0.35], [0.35, -0.35]].map(([x, z], i) => (
        <Box key={i} args={[0.1, 1.8, 0.1]} position={[x, 1.15, z]} castShadow>
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </Box>
      ))}

      {[0.5, 1.2, 1.8].map((h, i) => (
        <Box key={i} args={[0.8, 0.08, 0.08]} position={[0, h, 0]} castShadow>
          <meshStandardMaterial color="#52525b" metalness={0.6} roughness={0.4} />
        </Box>
      ))}

      <Cylinder args={[0.25, 0.25, 0.15, 8]} position={[0, 2.1, 0]} castShadow>
        <meshStandardMaterial color="#27272a" metalness={0.7} roughness={0.3} />
      </Cylinder>

      <Sphere args={[0.12, 16, 16]} position={[0, 2.25, 0]} castShadow>
        <meshStandardMaterial color="#dc2626" metalness={0.9} roughness={0.1} emissive="#dc2626" emissiveIntensity={hovered ? 1 : 0.5} />
      </Sphere>

      <Text position={[0, -0.15, 0]} fontSize={0.25} color={color} anchorX="center" anchorY="middle" outlineWidth={0.04} outlineColor="#000000">
        {dailyIncome.toLocaleString()}₽/д
      </Text>
      {coins > 0 && (
        <Sphere args={[0.25, 16, 16]} position={[0, 2.8, 0]} castShadow>
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
        </Sphere>
      )}
      {hovered && <Torus args={[1.1, 0.06, 16, 32]} position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.6} emissive={color} emissiveIntensity={1} />
      </Torus>}
    </group>
  );
};
