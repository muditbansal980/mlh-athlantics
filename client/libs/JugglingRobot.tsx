"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Float } from "@react-three/drei";
import * as THREE from "three";

function RobotScene() {
  const ballRef = useRef<THREE.Mesh>(null);
  const leftThighRef = useRef<THREE.Mesh>(null);
  const rightThighRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Juggling Physics Calculations
    const juggleSpeed = 4.5; 
    const bounceY = Math.abs(Math.sin(time * juggleSpeed)) * 2.0 - 0.1;
    const sideMovement = Math.cos(time * juggleSpeed) * 0.25;

    // 1. Realistic Football Rotation and Physics
    if (ballRef.current) {
      ballRef.current.position.y = bounceY;
      ballRef.current.position.x = sideMovement;
      ballRef.current.rotation.x += 0.04;
      ballRef.current.rotation.y += 0.02;
    }

    // 2. Leg Juggling Synchronization
    if (leftThighRef.current && rightThighRef.current) {
      const legCycle = Math.sin(time * juggleSpeed);
      if (legCycle > 0) {
        leftThighRef.current.rotation.x = THREE.MathUtils.lerp(leftThighRef.current.rotation.x, -Math.PI / 3.5, 0.25);
        rightThighRef.current.rotation.x = THREE.MathUtils.lerp(rightThighRef.current.rotation.x, 0, 0.1);
      } else {
        leftThighRef.current.rotation.x = THREE.MathUtils.lerp(leftThighRef.current.rotation.x, 0, 0.1);
        rightThighRef.current.rotation.x = THREE.MathUtils.lerp(rightThighRef.current.rotation.x, -Math.PI / 3.5, 0.25);
      }
    }

    // 3. Subtle Body Sway
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(time * 2) * 0.03;
      bodyRef.current.position.y = Math.sin(time * 3) * 0.02;
    }
  });

  return (
    <group position={[0, -0.1, 0]}>
      {/* HIGH-CONTRAST STUDIO LIGHTING ENVIRONMENT */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={2.0} castShadow />
      <directionalLight position={[-5, 4, -2]} intensity={0.9} color="#EEEDED" />
      <pointLight position={[0, 1.5, 2]} intensity={1.5} color="#00f0ff" />

      {/* REALISTIC SOLID FOOTBALL */}
      <mesh ref={ballRef} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial 
          color="#EEEDED"
          roughness={0.4}
          metalness={0.1}
          // Using 3D view-space coordinates to inject a reliable, uncompromised checkerboard design
          onBeforeCompile={(shader) => {
            shader.fragmentShader = shader.fragmentShader.replace(
              `vec4 diffuseColor = vec4( diffuse, opacity );`,
              `
              vec3 coord = vViewPosition * 8.0;
              float pattern = step(0.0, sin(coord.x) * cos(coord.y) * sin(coord.z));
              vec3 finalColor = mix(vec3(0.12, 0.11, 0.11), vec3(0.95, 0.95, 0.95), pattern);
              vec4 diffuseColor = vec4( finalColor, opacity );
              `
            );
          }}
        />
      </mesh>

      {/* THE MECHATRONIC ROBOT ASSEMBLY */}
      <group ref={bodyRef}>
        
        {/* HEAD ASSEMBLY */}
        <group position={[0, 1.4, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.34, 32, 32]} />
            <meshStandardMaterial color="#EEEDED" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.02, 0.12]} castShadow>
            <boxGeometry args={[0.42, 0.4, 0.35]} />
            <meshStandardMaterial color="#141212" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[-0.11, 0.04, 0.29]}>
            <boxGeometry args={[0.12, 0.03, 0.03]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
          <mesh position={[0.11, 0.04, 0.29]}>
            <boxGeometry args={[0.12, 0.03, 0.03]} />
            <meshBasicMaterial color="#00f0ff" />
          </mesh>
        </group>

        {/* MECHANICAL NECK ACTUATOR */}
        <mesh position={[0, 1.05, -0.02]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.3, 16]} />
          <meshStandardMaterial color="#201C1C" roughness={0.5} metalness={0.9} />
        </mesh>

        {/* CHEST AND COLLAR ARMOR PANELING */}
        <group position={[0, 0.55, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.65, 0.7, 0.45]} />
            <meshStandardMaterial color="#201C1C" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.02, 0.1]} castShadow>
            <boxGeometry args={[0.72, 0.62, 0.32]} />
            <meshStandardMaterial color="#EEEDED" roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0.1, 0.27]}>
            <boxGeometry args={[0.04, 0.25, 0.02]} />
            <meshBasicMaterial color="#EA3A3A" />
          </mesh>
        </group>

        {/* WHITE ARMORED SHOULDERS */}
        <mesh position={[-0.48, 0.78, 0]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#EEEDED" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0.48, 0.78, 0]} castShadow>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#EEEDED" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* LEFT LEG STRUCTURE */}
        <group position={[-0.22, 0.1, 0]}>
          <mesh ref={leftThighRef} castShadow>
            <boxGeometry args={[0.16, 0.45, 0.18]} />
            <meshStandardMaterial color="#201C1C" roughness={0.4} metalness={0.8} />
            <mesh position={[0, -0.22, 0.05]} castShadow>
              <boxGeometry args={[0.18, 0.22, 0.14]} />
              <meshStandardMaterial color="#EEEDED" roughness={0.15} />
            </mesh>
          </mesh>
        </group>

        {/* RIGHT LEG STRUCTURE */}
        <group position={[0.22, 0.1, 0]}>
          <mesh ref={rightThighRef} castShadow>
            <boxGeometry args={[0.16, 0.45, 0.18]} />
            <meshStandardMaterial color="#201C1C" roughness={0.4} metalness={0.8} />
            <mesh position={[0, -0.22, 0.05]} castShadow>
              <boxGeometry args={[0.18, 0.22, 0.14]} />
              <meshStandardMaterial color="#EEEDED" roughness={0.15} />
            </mesh>
          </mesh>
        </group>

      </group>

      {/* Cyber Stadium Ring Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.9, 0]} receiveShadow>
        <ringGeometry args={[1.2, 1.25, 32]} />
        <meshBasicMaterial color="#EA3A3A" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default function JugglingRobotCanvas() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[360px] sm:h-[550px] bg-[#201C1C]/5 rounded-[30px] sm:rounded-[40px] flex items-center justify-center">
        <span className="text-[#201C1C]/30 text-xs font-mono uppercase tracking-[0.2em] animate-pulse">
          Calibrating Core Grid...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] sm:h-[550px] relative rounded-[30px] sm:rounded-[40px] overflow-hidden cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        camera={{ position: [0, 0.8, isMobile ? 4.8 : 3.6], fov: 48 }}
        className="w-full h-full z-10"
      >
        <Center>
          <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.05}>
            <group scale={isMobile ? 0.75 : 1.0}>
              <RobotScene />
            </group>
          </Float>
        </Center>
      </Canvas>
    </div>
  );
}