"use client";

import { useRef, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  Stars, 
  Trail, 
  MeshDistortMaterial, 
  Environment, 
  PerspectiveCamera
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// --- Components ---

// Tech Cube dengan material kaca frosted dan wireframe glow
function TechCube({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
      wireRef.current.rotation.y = state.clock.elapsedTime * 0.15 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group position={position}>
        {/* Inner solid core */}
        <mesh ref={meshRef} scale={0.8}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial 
            color={color} 
            metalness={0.1}
            roughness={0.1}
            transmission={0.6} // Glass-like
            thickness={2}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Outer wireframe glow */}
        <lineSegments ref={wireRef}>
          <edgesGeometry args={[new THREE.BoxGeometry(1.05, 1.05, 1.05)]} />
          <lineBasicMaterial color={color} toneMapped={false} linewidth={2} />
        </lineSegments>

        {/* Inner glow light */}
        <pointLight color={color} intensity={2} distance={3} decay={2} />
      </group>
    </Float>
  );
}

// Glowing Sphere Liquid Metal
function GlowingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.7, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.5}
          roughness={0.2}
          speed={2}
          distort={0.4}
          radius={1}
        />
        {/* Tambahkan rim light effect dengan point light kecil */}
        <pointLight color={color} intensity={1.5} distance={2} />
      </mesh>
    </Float>
  );
}

// Torus Knot High Polish
function TechTorusKnot({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position}>
        <torusKnotGeometry args={[0.5, 0.15, 128, 32]} />
        <meshStandardMaterial
          color="#f97316"
          metalness={1}
          roughness={0.1}
          envMapIntensity={2}
        />
      </mesh>
    </Float>
  );
}

// Octahedron Cyberpunk
function OctahedronWithTrail({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.5) * 0.8;
      meshRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 0.4) * 0.5;
      meshRef.current.rotation.x = state.clock.elapsedTime;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Trail
      width={1.5}
      length={5}
      color="#1e3a5f"
      attenuation={(t) => t * t}
    >
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#1e3a5f"
          emissiveIntensity={2}
          toneMapped={false}
        />
        <pointLight color="#1e3a5f" intensity={2} distance={3} />
      </mesh>
    </Trail>
  );
}

// Orbit Ring Glassy
function OrbitRing({ radius, speed, color, tilt = 0 }: { radius: number; speed: number; color: string; tilt?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1 + tilt;
      groupRef.current.rotation.y += state.clock.getDelta() * speed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.03, 32, 100]} />
        <meshPhysicalMaterial 
          color={color}
          metalness={0.5}
          roughness={0}
          transmission={0.5}
          thickness={1}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// Particle Field Glowing
function ParticleField() {
  const count = 150;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 10 + Math.random() * 10;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() * 2;

      // Orange and Blue colors, but brighter
      if (Math.random() > 0.5) {
        // Bright Orange
        colors[i3] = 1.0; 
        colors[i3 + 1] = 0.6;
        colors[i3 + 2] = 0.2;
      } else {
        // Bright Blue
        colors[i3] = 0.2; 
        colors[i3 + 1] = 0.5;
        colors[i3 + 2] = 1.0;
      }
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
            attach="attributes-size"
            count={count}
            array={particles.sizes}
            itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Central Core: The Reactor
function CentralCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.2;
      coreRef.current.rotation.y = t * 0.15;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.3;
      innerRef.current.rotation.y = -t * 0.2;
      // Pulsing effect
      const scale = 0.8 + Math.sin(t * 2) * 0.05;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Outer Cage */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshPhysicalMaterial
          color="#f97316"
          metalness={0.9}
          roughness={0.1}
          transmission={0.2}
          transparent
          opacity={0.3}
          wireframe
        />
      </mesh>
      
      {/* Inner Energy Ball */}
      <mesh ref={innerRef}>
        <dodecahedronGeometry args={[0.8]} />
        <MeshDistortMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={2}
          toneMapped={false}
          speed={3}
          distort={0.3}
        />
        {/* Glow Light */}
        <pointLight color="#f97316" intensity={3} distance={5} decay={2} />
      </mesh>
    </group>
  );
}

// Mouse follow component
function MouseFollower() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetPosition.current.set(x * viewport.width * 0.4, y * viewport.height * 0.4, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [viewport]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPosition.current, 0.05);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 2]}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshPhysicalMaterial
        color="#f97316"
        emissive="#f97316"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
        transmission={0.5}
      />
      <pointLight color="#f97316" intensity={3} distance={5} />
    </mesh>
  );
}

// Interactive camera that responds to mouse
function InteractiveCamera() {
  const { camera } = useThree();
  const targetRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.current = { x: y * 0.1, y: x * 0.1 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    camera.rotation.x += (targetRotation.current.x - camera.rotation.x) * 0.02;
    camera.rotation.y += (targetRotation.current.y - camera.rotation.y) * 0.02;
  });

  return null;
}

// Scene Setup
function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      <InteractiveCamera />

      {/* Dark mode lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 10, 5]} intensity={1} color="#f97316" />
      <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#3b82f6" />
      <directionalLight position={[5, -5, 5]} intensity={0.5} color="#8b5cf6" />

      {/* Environment for Reflections */}
      <Environment preset="night" />

      {/* Interactive mouse follower */}
      <MouseFollower />

      {/* Objects */}
      <group position={[0, 0, 0]}>
        <CentralCore />
        
        {/* Orbits with tilt */}
        <OrbitRing radius={2.2} speed={0.2} color="#f97316" tilt={0.2} />
        <OrbitRing radius={3.0} speed={-0.15} color="#3b82f6" tilt={-0.1} />
        <OrbitRing radius={3.8} speed={0.1} color="#8b5cf6" tilt={0.1} />
      </group>

      {/* Floating Tech Elements - Spread out for better composition */}
      <TechCube position={[-4, 2, -2]} color="#3b82f6" speed={0.5} />
      <TechCube position={[4, -2, -1]} color="#f97316" speed={0.7} />
      
      <GlowingSphere position={[-3.5, -2, 0]} color="#f97316" />
      <GlowingSphere position={[3.5, 2.5, 1]} color="#8b5cf6" />
      
      <TechTorusKnot position={[0, 3.5, -2]} />
      <OctahedronWithTrail position={[-5, 0, 1]} />

      {/* Background Ambience - More stars for dark mode */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.8} />
      <ParticleField />

      {/* Post Processing for Bloom - Enhanced for dark mode */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.5} 
          mipmapBlur 
          intensity={2} 
          radius={0.5}
        />
      </EffectComposer>
    </>
  );
}

// Component Main
export default function TechScene3D() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 2]} // Support retina displays
          gl={{ 
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.2
          }}
          style={{ background: "linear-gradient(to bottom right, #0f172a, #1e1b4b, #0f172a)" }}
        >
          <color attach="background" args={['#0f172a']} />
          <fog attach="fog" args={['#0f172a', 8, 25]} />
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
