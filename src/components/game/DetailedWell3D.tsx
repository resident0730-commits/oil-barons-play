import { useRef, useState } from 'react';
import { Mesh, Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder, Sphere, Cone, Torus } from '@react-three/drei';

interface DetailedWell3DProps {
  id: string;
  type: string;
  dailyIncome: number;
  level: number;
  position: [number, number, number];
  onCoinsCollected: (amount: number) => void;
}

export const DetailedWell3D = ({ 
  type, 
  dailyIncome, 
  position,
  onCoinsCollected 
}: DetailedWell3DProps) => {
  const groupRef = useRef<Group>(null);
  const derrickRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const [coins, setCoins] = useState(0);

  // Gentle idle animation
  useFrame((state) => {
    if (derrickRef.current && !hovered) {
      derrickRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
    if (hovered && groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05;
    }
  });

  // Get well configuration based on type
  const getWellConfig = () => {
    const lowerType = type.toLowerCase();
    
    if (lowerType.includes('космическ')) {
      return { 
        primaryColor: '#8b5cf6', 
        secondaryColor: '#a78bfa',
        accentColor: '#c4b5fd',
        height: 5, 
        derrickHeight: 4,
        platformSize: 2.5,
        complexity: 'ultra'
      };
    }
    if (lowerType.includes('легендарн')) {
      return { 
        primaryColor: '#dc2626', 
        secondaryColor: '#ef4444',
        accentColor: '#f87171',
        height: 4.5, 
        derrickHeight: 3.8,
        platformSize: 2.3,
        complexity: 'high'
      };
    }
    if (lowerType.includes('элитн')) {
      return { 
        primaryColor: '#d97706', 
        secondaryColor: '#f59e0b',
        accentColor: '#fbbf24',
        height: 4, 
        derrickHeight: 3.5,
        platformSize: 2.2,
        complexity: 'high'
      };
    }
    if (lowerType.includes('промышленн')) {
      return { 
        primaryColor: '#ea580c', 
        secondaryColor: '#fb923c',
        accentColor: '#fdba74',
        height: 3.8, 
        derrickHeight: 3.2,
        platformSize: 2.1,
        complexity: 'medium'
      };
    }
    if (lowerType.includes('супер')) {
      return { 
        primaryColor: '#2563eb', 
        secondaryColor: '#3b82f6',
        accentColor: '#60a5fa',
        height: 3.5, 
        derrickHeight: 3,
        platformSize: 2,
        complexity: 'medium'
      };
    }
    if (lowerType.includes('премиум')) {
      return { 
        primaryColor: '#0891b2', 
        secondaryColor: '#06b6d4',
        accentColor: '#22d3ee',
        height: 3, 
        derrickHeight: 2.5,
        platformSize: 1.8,
        complexity: 'medium'
      };
    }
    if (lowerType.includes('стандартн') || lowerType.includes('средн')) {
      return { 
        primaryColor: '#059669', 
        secondaryColor: '#10b981',
        accentColor: '#34d399',
        height: 2.5, 
        derrickHeight: 2.2,
        platformSize: 1.6,
        complexity: 'low'
      };
    }
    // Starter/Mini well
    return { 
      primaryColor: '#4b5563', 
      secondaryColor: '#6b7280',
      accentColor: '#9ca3af',
      height: 2, 
      derrickHeight: 1.8,
      platformSize: 1.4,
      complexity: 'low'
    };
  };

  const config = getWellConfig();

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
      {/* Multi-level concrete platform */}
      <group position={[0, 0, 0]}>
        {/* Base level */}
        <Box 
          args={[config.platformSize + 0.4, 0.15, config.platformSize + 0.4]} 
          position={[0, 0.075, 0]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color="#71717a" 
            roughness={0.9}
            metalness={0.1}
          />
        </Box>

        {/* Upper platform */}
        <Box 
          args={[config.platformSize, 0.25, config.platformSize]} 
          position={[0, 0.275, 0]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial 
            color="#a1a1aa" 
            roughness={0.8}
            metalness={0.2}
          />
        </Box>
      </group>

      {/* Main building structure */}
      <group position={[0, 0.9, 0]}>
        {/* Central control room */}
        <Box 
          args={[1.4, 0.8, 1.4]} 
          position={[0, 0, 0]}
          onClick={handleClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <meshStandardMaterial 
            color="#3f3f46" 
            metalness={0.6}
            roughness={0.4}
          />
        </Box>

        {/* Windows/Panels */}
        {[-0.6, 0.6].map((xPos, i) => (
          <Box
            key={`window-x-${i}`}
            args={[0.15, 0.4, 0.4]}
            position={[xPos, 0.1, 0.71]}
            castShadow
          >
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={hovered ? 0.8 : 0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
        ))}

        {[-0.6, 0.6].map((zPos, i) => (
          <Box
            key={`window-z-${i}`}
            args={[0.4, 0.4, 0.15]}
            position={[0, 0.1, zPos]}
            castShadow
          >
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={hovered ? 0.8 : 0.3}
              metalness={0.9}
              roughness={0.1}
            />
          </Box>
        ))}

        {/* Roof */}
        <Box 
          args={[1.6, 0.15, 1.6]} 
          position={[0, 0.475, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={config.primaryColor} 
            metalness={0.7}
            roughness={0.3}
          />
        </Box>
      </group>

      {/* Main Derrick Tower */}
      <group ref={derrickRef} position={[0, 1.5, 0]}>
        {/* Tower legs - 4 corners */}
        {[
          [-0.4, 0.4], [0.4, 0.4], 
          [-0.4, -0.4], [0.4, -0.4]
        ].map(([x, z], i) => (
          <Box
            key={`leg-${i}`}
            args={[0.12, config.derrickHeight, 0.12]}
            position={[x, config.derrickHeight / 2, z]}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            castShadow
          >
            <meshStandardMaterial 
              color={config.secondaryColor} 
              metalness={0.85}
              roughness={0.15}
            />
          </Box>
        ))}

        {/* Cross beams at different heights */}
        {[0.3, 0.6, 0.9].map((heightRatio, idx) => (
          <group key={`beams-${idx}`} position={[0, config.derrickHeight * heightRatio, 0]}>
            <Box args={[0.9, 0.08, 0.08]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
            </Box>
            <Box args={[0.08, 0.08, 0.9]} position={[0, 0, 0]} castShadow>
              <meshStandardMaterial color="#52525b" metalness={0.8} roughness={0.2} />
            </Box>
          </group>
        ))}

        {/* Top platform */}
        <Cylinder 
          args={[0.5, 0.5, 0.2, 8]} 
          position={[0, config.derrickHeight, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#27272a" 
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>

        {/* Crown block */}
        <Box 
          args={[0.6, 0.3, 0.6]} 
          position={[0, config.derrickHeight + 0.25, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color={config.accentColor} 
            metalness={0.8}
            roughness={0.2}
          />
        </Box>

        {/* Warning beacon */}
        <Sphere 
          args={[0.15, 16, 16]} 
          position={[0, config.derrickHeight + 0.5, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#fbbf24" 
            metalness={0.95}
            roughness={0.05}
            emissive="#fbbf24"
            emissiveIntensity={hovered ? 1.5 : 0.8}
          />
        </Sphere>

        {/* Antenna */}
        <Cylinder 
          args={[0.02, 0.02, 0.5, 8]} 
          position={[0, config.derrickHeight + 0.85, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#71717a" 
            metalness={0.9}
            roughness={0.1}
          />
        </Cylinder>
      </group>

      {/* Side equipment */}
      <group position={[0, 0.6, 0]}>
        {/* Storage tanks */}
        <Cylinder 
          args={[0.35, 0.35, 0.9, 16]} 
          position={[-1.1, 0.45, 0]}
          castShadow
        >
          <meshStandardMaterial 
            color="#52525b" 
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>

        <Cylinder 
          args={[0.35, 0.35, 0.9, 16]} 
          position={[-1.1, 0.45, -0.7]}
          castShadow
        >
          <meshStandardMaterial 
            color="#52525b" 
            metalness={0.7}
            roughness={0.3}
          />
        </Cylinder>

        {/* Pipes */}
        <Cylinder 
          args={[0.08, 0.08, 1.5, 8]} 
          position={[0.8, 0.3, 0]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <meshStandardMaterial 
            color="#a1a1aa" 
            metalness={0.85}
            roughness={0.15}
          />
        </Cylinder>

        {/* Pump jack (for some well types) */}
        {config.complexity !== 'low' && (
          <group position={[1.2, 0, 0.8]}>
            <Box args={[0.3, 0.4, 0.3]} position={[0, 0.2, 0]} castShadow>
              <meshStandardMaterial color={config.primaryColor} metalness={0.6} roughness={0.4} />
            </Box>
            <Cylinder args={[0.08, 0.08, 0.6, 8]} position={[0, 0.5, 0]} castShadow>
              <meshStandardMaterial color="#71717a" metalness={0.8} roughness={0.2} />
            </Cylinder>
          </group>
        )}
      </group>

      {/* Decorative elements for high-tier wells */}
      {config.complexity === 'high' || config.complexity === 'ultra' ? (
        <group position={[0, 0, 0]}>
          {/* Corner pillars */}
          {[
            [-1, 1], [1, 1], [-1, -1], [1, -1]
          ].map(([x, z], i) => (
            <Cylinder
              key={`pillar-${i}`}
              args={[0.08, 0.08, 0.8, 8]}
              position={[x, 0.8, z]}
              castShadow
            >
              <meshStandardMaterial 
                color={config.accentColor} 
                metalness={0.9}
                roughness={0.1}
                emissive={config.accentColor}
                emissiveIntensity={0.3}
              />
            </Cylinder>
          ))}
        </group>
      ) : null}

      {/* Income label */}
      <Text
        position={[0, -0.2, 0]}
        fontSize={0.3}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000000"
      >
        {dailyIncome.toLocaleString()}₽/д
      </Text>

      {/* Coins indicator */}
      {coins > 0 && (
        <group position={[0, config.derrickHeight + 2.5, 0]}>
          <Sphere args={[0.35, 16, 16]} castShadow>
            <meshStandardMaterial 
              color="#fbbf24" 
              emissive="#fbbf24"
              emissiveIntensity={0.8}
              metalness={0.8}
              roughness={0.2}
            />
          </Sphere>
          <Text
            position={[0, 0, 0.36]}
            fontSize={0.25}
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

      {/* Hover effects */}
      {hovered && (
        <>
          {/* Ground ring */}
          <Torus 
            args={[1.3, 0.08, 16, 32]} 
            position={[0, 0.1, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color={config.accentColor} 
              transparent
              opacity={0.6}
              emissive={config.accentColor}
              emissiveIntensity={1}
            />
          </Torus>

          {/* Outer glow ring */}
          <Torus 
            args={[1.6, 0.05, 16, 32]} 
            position={[0, 0.15, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial 
              color="#22c55e" 
              transparent
              opacity={0.4}
              emissive="#22c55e"
              emissiveIntensity={0.8}
            />
          </Torus>
        </>
      )}
    </group>
  );
};
