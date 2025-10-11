import { useRef, useState, useMemo } from 'react';
import { Group, Mesh } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import { TextureLoader } from 'three';

// Import well images
import starterWell from '@/assets/game-wells/starter-well-top.png';
import mediumWell from '@/assets/game-wells/medium-well-top.png';
import premiumWell from '@/assets/game-wells/premium-well-top.png';
import eliteWell from '@/assets/game-wells/elite-well-top.png';
import industrialWell from '@/assets/game-wells/industrial-well-top.png';
import legendaryWell from '@/assets/game-wells/legendary-well-top.png';
import superWell from '@/assets/game-wells/super-well-top.png';
import cosmicWell from '@/assets/game-wells/cosmic-well-top.png';

interface WellSprite3DProps {
  id: string;
  type: string;
  dailyIncome: number;
  level: number;
  position: [number, number, number];
  onCoinsCollected: (amount: number) => void;
}

export const WellSprite3D = ({ 
  type, 
  dailyIncome, 
  position,
  onCoinsCollected 
}: WellSprite3DProps) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [coins, setCoins] = useState(0);

  // Floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
      
      if (hovered) {
        groupRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 5) * 0.05);
      } else {
        groupRef.current.scale.setScalar(1);
      }
    }
  });

  // Get well image based on type
  const getWellImage = () => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('космическ')) return cosmicWell;
    if (lowerType.includes('легендарн')) return legendaryWell;
    if (lowerType.includes('элитн')) return eliteWell;
    if (lowerType.includes('промышленн')) return industrialWell;
    if (lowerType.includes('супер')) return superWell;
    if (lowerType.includes('премиум')) return premiumWell;
    if (lowerType.includes('стандартн') || lowerType.includes('средн')) return mediumWell;
    return starterWell;
  };

  // Get size based on type
  const getSize = () => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('космическ') || lowerType.includes('легендарн')) return 2.8;
    if (lowerType.includes('элитн') || lowerType.includes('промышленн')) return 2.4;
    if (lowerType.includes('супер') || lowerType.includes('премиум')) return 2.0;
    if (lowerType.includes('стандартн') || lowerType.includes('средн')) return 1.6;
    return 1.3;
  };

  const wellImage = getWellImage();
  const size = getSize();
  
  // Load texture
  const texture = useLoader(TextureLoader, wellImage);

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

  return (
    <group ref={groupRef} position={position}>
      {/* Ground shadow */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <circleGeometry args={[size * 0.5, 32]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.3}
        />
      </mesh>

      {/* Well sprite billboard (always faces camera) */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <mesh
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={[size, size]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            alphaTest={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Glow effect when hovered */}
        {hovered && (
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[size * 1.2, size * 1.2]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent 
              opacity={0.3}
            />
          </mesh>
        )}
      </Billboard>

      {/* Floating coin indicator */}
      {coins > 0 && (
        <Billboard follow={true}>
          <mesh position={[0, size * 0.6, 0]}>
            <circleGeometry args={[0.35, 32]} />
            <meshBasicMaterial 
              color="#fbbf24"
              transparent
              opacity={0.9}
            />
          </mesh>
          <Text
            position={[0, size * 0.6, 0.01]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            +{coins}
          </Text>
        </Billboard>
      )}

      {/* Income label - always faces camera */}
      <Billboard follow={true}>
        <mesh position={[0, -size * 0.5, 0]}>
          <planeGeometry args={[1.5, 0.4]} />
          <meshBasicMaterial 
            color="#22c55e"
            transparent
            opacity={0.9}
          />
        </mesh>
        <Text
          position={[0, -size * 0.5, 0.01]}
          fontSize={0.25}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          {dailyIncome.toLocaleString()}₽/д
        </Text>
      </Billboard>

      {/* Hover ring on ground */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[size * 0.5, size * 0.6, 32]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      )}

      {/* Animated selection ring */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
          <ringGeometry args={[size * 0.6, size * 0.7, 32]} />
          <meshBasicMaterial 
            color="#22c55e" 
            transparent 
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
};
