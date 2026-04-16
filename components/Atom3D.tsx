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
  const nucleusSize = Math.max(1.0, Math.min(2.0, element.number * 0.06));

  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 20]} intensity={2} />
      
      <group>
        <Nucleus color={color} size={nucleusSize} />

        {mode === 'bohr' && (
          <group>
            {element.shells.map((count, shellIndex) => {
              const orbitRadius = nucleusSize + 1.5 + (shellIndex * 1.8);
              return (
                <ElectronShell
                  key={shellIndex}
                  radius={orbitRadius}
                  count={count}
                  speed={0.1 - (shellIndex * 0.01)}
                  color={color}
                />
              );
            })}
          </group>
        )}

        {mode === 'cloud' && (
          <ElectronCloud count={element.number * 60 + 400} color={color} />
        )}
      </group>
    </>
  );
};

export const AtomVisualizer: React.FC<AtomProps> = (props) => {
  const [ready, setReady] = React.useState(false);
  const shellCount = props.element.shells.length;
  const dynamicZ = 12 + (shellCount * 3);

  React.useEffect(() => {
    setReady(false);
    // 500ms delay ensures the 400ms scale-in animation is completely finished
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, [props.element.number, props.mode]);

  if (!ready) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      <Canvas 
        shadows={false}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, dynamicZ], fov: 45 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor(0x000000, 0);
          camera.lookAt(0, 0, 0);
        }}
      >
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        <SceneContent {...props} />
        <OrbitControls 
          enableRotate={props.mode === 'cloud'}
          enableZoom={true} 
          minDistance={5} 
          maxDistance={150} 
          enablePan={false}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none select-none z-10">
         <span className="text-white text-xs font-bold uppercase tracking-wider shadow-black drop-shadow-md">
           {props.mode === 'bohr' ? 'Bohr Model (2D)' : 'Quantum Cloud'}
         </span>
         <span className="text-white/40 text-[10px] shadow-black drop-shadow-md">
           {props.mode === 'bohr' ? 'Planar Shell Representation' : 'Probability Density Distribution'}
         </span>
      </div>
    </div>
  );
};