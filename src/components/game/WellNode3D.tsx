import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder, Sphere } from '@react-three/drei';

interface WellNode3DProps {
  id: string;
  type: string;
  dailyIncome: number;
  level: number;
  position: [number, number, number];
  onCoinsCollected: (amount: number) => void;
}

export const WellNode3D = ({ 
  type, 
  dailyIncome, 
  position,
  onCoinsCollected 
}: WellNode3DProps) => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [coins, setCoins] = useState(0);

  // Animation
  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  // Determine well appearance based on type
  const getWellConfig = () => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('космическ')) {
      return { color: '#8b5cf6', height: 4, radius: 0.8, derrickHeight: 3 };
    }
    if (lowerType.includes('легендарн')) {
      return { color: '#ef4444', height: 3.5, radius: 0.7, derrickHeight: 2.5 };
    }
    if (lowerType.includes('элитн')) {
      return { color: '#f59e0b', height: 3, radius: 0.6, derrickHeight: 2.2 };
    }
    if (lowerType.includes('промышленн')) {
      return { color: '#fb923c', height: 2.8, radius: 0.6, derrickHeight: 2 };
    }
    if (lowerType.includes('супер')) {
      return { color: '#3b82f6', height: 2.5, radius: 0.5, derrickHeight: 1.8 };
    }
    if (lowerType.includes('премиум')) {
      return { color: '#06b6d4', height: 2, radius: 0.45, derrickHeight: 1.5 };
    }
    if (lowerType.includes('стандартн')) {
      return { color: '#10b981', height: 1.5, radius: 0.4, derrickHeight: 1.2 };
    }
    return { color: '#6b7280', height: 1.2, radius: 0.35, derrickHeight: 1 };
  };

  const config = getWellConfig();

  const handleClick = () => {
    const amount = Math.floor(dailyIncome / 100);
    setCoins(coins + 1);
    onCoinsCollected(amount);
    
    // Play sound
    try {
      const audio = new Audio('/coin-collect.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (e) {
      // Ignore
    }
  };

  return (
    <group position={position}>
      {/* Concrete platform with texture */}
      <Box 
        args={[2, 0.3, 2]} 
        position={[0, 0.15, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial 
          color="#d4d4d8" 
          roughness={0.8}
          metalness={0.2}
        />
      </Box>

      {/* Base structure - industrial box */}
      <Box 
        args={[1.2, 0.6, 1.2]} 
        position={[0, 0.6, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial 
          color="#52525b" 
          metalness={0.5}
          roughness={0.4}
        />
      </Box>

      {/* Main tower body */}
      <Box 
        ref={meshRef}
        args={[0.8, 1.2, 0.8]} 
        position={[0, 1.5, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <meshStandardMaterial 
          color={config.color} 
          metalness={0.7}
          roughness={0.3}
        />
      </Box>

      {/* Derrick tower - detailed structure */}
      <group position={[0, 2.1, 0]}>
        {/* Main derrick */}
        <Cylinder 
          args={[0.15, 0.15, config.derrickHeight, 8]} 
          position={[0, config.derrickHeight / 2, 0]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <meshStandardMaterial 
            color={config.color} 
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>

        {/* Support beams */}
        {[0, 90, 180, 270].map((angle, i) => (
          <Cylinder
            key={i}
            args={[0.05, 0.08, config.derrickHeight * 0.8, 4]}
            position={[
              Math.cos((angle * Math.PI) / 180) * 0.3,
              config.derrickHeight * 0.4,
              Math.sin((angle * Math.PI) / 180) * 0.3
            ]}
            rotation={[0.2, 0, 0]}
            castShadow
          >
            <meshStandardMaterial 
              color="#71717a" 
              metalness={0.8}
              roughness={0.2}
            />
          </Cylinder>
        ))}

        {/* Top platform */}
        <Cylinder 
          args={[0.4, 0.4, 0.15, 8]} 
          position={[0, config.derrickHeight, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#27272a" 
            metalness={0.6}
            roughness={0.4}
          />
        </Cylinder>

        {/* Warning light on top */}
        <Sphere 
          args={[0.2, 16, 16]} 
          position={[0, config.derrickHeight + 0.25, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.9}
            roughness={0.1}
            emissive="#fbbf24"
            emissiveIntensity={hovered ? 1 : 0.5}
          />
        </Sphere>
      </group>

      {/* Pipeline accessories */}
      <Cylinder 
        args={[0.1, 0.1, 0.8, 8]} 
        position={[0.6, 0.7, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <meshStandardMaterial 
          color="#a1a1aa" 
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Storage tank */}
      <Cylinder 
        args={[0.3, 0.3, 0.6, 16]} 
        position={[-0.7, 0.6, 0]}
        castShadow
      >
        <meshStandardMaterial 
          color="#71717a" 
          metalness={0.6}
          roughness={0.3}
        />
      </Cylinder>

      {/* Income label with better styling */}
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.25}
        color="#10b981"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {dailyIncome.toLocaleString()}₽/д
      </Text>

      {/* Coins indicator */}
      {coins > 0 && (
        <group position={[0, config.derrickHeight + 2.5, 0]}>
          <Sphere args={[0.3, 16, 16]}>
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24"
              emissiveIntensity={0.5}
            />
          </Sphere>
          <Text
            position={[0, 0, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            +{coins}
          </Text>
        </group>
      )}

      {/* Hover effect - glowing ring on ground */}
      {hovered && (
        <>
          <Cylinder 
            args={[1.2, 1.2, 0.05, 32]} 
            position={[0, 0.05, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#fbbf24" 
              transparent
              opacity={0.4}
              emissive="#fbbf24"
              emissiveIntensity={0.8}
            />
          </Cylinder>
          
          {/* Animated rings */}
          <Cylinder 
            args={[1.5, 1.5, 0.02, 32]} 
            position={[0, 0.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#22c55e" 
              transparent
              opacity={0.3}
              emissive="#22c55e"
              emissiveIntensity={0.6}
            />
          </Cylinder>
        </>
      )}
    </group>
  );
};
