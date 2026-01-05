import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ElementData, VisualMode } from '../types';

interface AtomProps {
  element: ElementData;
  mode: VisualMode;
  color: string;
}

const Nucleus: React.FC<{ color: string, size: number }> = ({ color, size }) => {
  return (
    <mesh>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color} 
        emissiveIntensity={0.8}
        roughness={0.2}
        metalness={0.8}
      />
      <pointLight distance={10} intensity={2} color={color} />
    </mesh>
  );
};

// A single shell containing multiple electrons distributed evenly
const ElectronShell: React.FC<{ 
  radius: number, 
  count: number, 
  speed: number, 
  color: string 
}> = ({ radius, count, speed, color }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate the shell around Z axis (flat 2D rotation)
      groupRef.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* The Orbit Ring - Flat on XY Plane */}
      <mesh>
        <ringGeometry args={[radius - 0.03, radius + 0.03, 128]} />
        <meshBasicMaterial color={color} opacity={0.3} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Electrons distributed on the ring */}
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, y, 0]}>
             <sphereGeometry args={[0.2, 16, 16]} />
             <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
          </mesh>
        );
      })}
    </group>
  );
};

const ElectronCloud: React.FC<{ count: number, color: string }> = ({ count, color }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Gaussian-ish distribution for cloud probability
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = Math.pow(Math.random(), 1/3) * 6 + 1; // Cloud radius spread
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      p[i * 3] = x;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = z;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color={color}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const SceneContent: React.FC<AtomProps> = ({ element, mode, color }) => {
  // Make nucleus smaller in 2D view so rings are clearer
  const nucleusSize = Math.max(0.6, Math.min(1.2, element.number * 0.04));

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* No rotation group -> Flat 2D View */}
      <group>
        <Nucleus color={color} size={nucleusSize} />

        {/* Electrons */}
        {mode === 'bohr' && (
          <group>
            {element.shells.map((count, shellIndex) => {
              // Increase spacing between rings for clarity in 2D
              const orbitRadius = nucleusSize + 2.5 + (shellIndex * 1.8);
              return (
                <ElectronShell
                  key={shellIndex}
                  radius={orbitRadius}
                  count={count}
                  speed={0.2 - (shellIndex * 0.02)} // Outer shells slower
                  color={color}
                />
              );
            })}
          </group>
        )}

        {/* Quantum Cloud - Still looks best as a 3D cloud, but we view it from front */}
        {mode === 'cloud' && (
          <ElectronCloud count={element.number * 80 + 500} color={color} />
        )}
      </group>
    </>
  );
};

export const AtomVisualizer: React.FC<AtomProps> = (props) => {
  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl bg-black/40 backdrop-blur-sm border border-white/10">
      <Canvas camera={{ position: [0, 0, 30], fov: 35 }}>
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        <SceneContent {...props} />
        {/* Restrict OrbitControls to prevent rotating the 2D plane, allow Zoom only */}
        <OrbitControls 
          enableRotate={props.mode === 'cloud'} // Allow rotation only for cloud mode
          enableZoom={true} 
          minDistance={10} 
          maxDistance={50} 
          enablePan={true}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 flex flex-col gap-1 pointer-events-none select-none">
         <span className="text-white text-xs font-bold uppercase tracking-wider">
           {props.mode === 'bohr' ? 'Bohr Model (2D)' : 'Quantum Cloud'}
         </span>
         <span className="text-white/40 text-[10px]">
           {props.mode === 'bohr' ? 'Planar Shell Representation' : 'Probability Density Distribution'}
         </span>
      </div>
    </div>
  );
};
