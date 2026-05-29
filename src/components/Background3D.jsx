import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';

function FloatingCube({ position, size, color, speed }) {
  const meshRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * speed * 0.4;
      meshRef.current.rotation.y = time * speed;
      meshRef.current.position.y = position[1] + Math.sin(time * speed) * 0.2;
    }
  });

  return (
    <Float speed={2} floatIntensity={2} floatingRange={[-0.4, 0.4]}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />

        
        <meshPhysicalMaterial
          color={color}
          metalness={0.9}
          roughness={0.05}
          transmission={0.6} 
          transparent
          opacity={0.85}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0.01}
          ior={1.5} 
          thickness={1.2}
        />
      </mesh>
    </Float>
  );
}


function MirrorParticles() {
  const particlesRef = useRef();

  
  const particles = useMemo(() => Array.from({ length: 45 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 6,
    ],
    scale: Math.random() * 0.09 + 0.03,
    speed: Math.random() * 0.4 + 0.1,
  })), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, i) => {
        particle.rotation.x += 0.005;
        particle.rotation.y += 0.008;
        particle.position.y += Math.sin(time * particles[i].speed + i) * 0.0015;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <mesh key={index} position={particle.position} scale={particle.scale}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={1}
            roughness={0}
            reflectivity={1}
            clearcoat={1}
            transparent
            opacity={0.8}
            emissive="#3b82f6" 
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#040612] overflow-hidden">
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} gl={{ antialias: true, alpha: false }}>
        
        
        <ambientLight intensity={0.2} />

       
        <directionalLight
          position={[0, 5, 5]}
          intensity={1.5}
          color="#a5b4fc"
        />

        
        <pointLight
          position={[-6, 4, 2]}
          intensity={8}
          distance={15}
          color="#ec4899" 
        />

        <pointLight
          position={[6, -4, 2]}
          intensity={8}
          distance={15}
          color="#06b6d4" 
        />

        <pointLight
          position={[0, -2, -3]}
          intensity={4}
          distance={10}
          color="#3b82f6" 
        />

        <Environment preset="studio" intensity={0.6} />

        <FloatingCube position={[-2.5, 1.2, 0]} size={[0.8, 0.8, 0.8]} color="#3b82f6" speed={0.4} />
        <FloatingCube position={[2.6, 1.8, -1]} size={[1.1, 1.1, 1.1]} color="#1d4ed8" speed={0.25} />
        <FloatingCube position={[-2.8, -1.4, 1]} size={[0.6, 0.6, 0.6]} color="#60a5fa" speed={0.5} />
        <FloatingCube position={[2.8, -1.8, 0]} size={[0.7, 0.7, 0.7]} color="#1e40af" speed={0.4} />
        <FloatingCube position={[0, 2.3, -2]} size={[0.5, 0.5, 0.5]} color="#93c5fd" speed={0.6} />

       
        <MirrorParticles />

        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />

       
        <EffectComposer>
          <Bloom 
            intensity={1.2} 
            luminanceThreshold={0.15} 
            luminanceSmoothing={0.9} 
            height={300} 
          />
          <ChromaticAberration 
            offset={[0.001, 0.001]} 
          />
        </EffectComposer>

      </Canvas>
    </div>
  );
}