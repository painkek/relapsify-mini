import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import * as THREE from "three";

// 🌧️ RAIN COMPONENT (unchanged)
function Rain({ count = 5000 }) {
  const meshRef = useRef();
  const drops = useRef([]);
  const speedFactor = useRef(1);
  const [mouseActive, setMouseActive] = useState(false);
  const inactivityTimer = useRef(null);

  useEffect(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = Math.random() * 200 - 100;
      positions[i * 3 + 1] = Math.random() * 200 + 100;
      positions[i * 3 + 2] = Math.random() * 200 - 100;

      sizes[i] = Math.random() * 0.5 + 0.5;

      drops.current.push({
        x: positions[i * 3],
        y: positions[i * 3 + 1],
        z: positions[i * 3 + 2],
        speed: Math.random() * 0.1 + 0.1,
      });
    }

    meshRef.current.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    meshRef.current.geometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizes, 1)
    );

    const handleMouseMove = () => {
      setMouseActive(true);
      speedFactor.current = 0.3;

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
      inactivityTimer.current = setTimeout(() => {
        setMouseActive(false);
        speedFactor.current = 1;
      }, 2000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;

    const positions = meshRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const drop = drops.current[i];
      drop.y -= drop.speed * speedFactor.current;

      if (drop.y < -100) {
        drop.y = Math.random() * 100 + 200;
        drop.x = Math.random() * 200 - 100;
      }

      positions[i * 3 + 1] = drop.y;
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry attach="geometry" />
      <pointsMaterial
        attach="material"
        size={0.2}
        color={0xaaaaee}
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

// ☁️ MOVING CLOUDS COMPONENT
function MovingClouds() {
  const cloudGroup = useRef();
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!cloudGroup.current) return;

    time.current += delta;

    // Move slowly in X and float up/down with sine wave
    cloudGroup.current.position.x += 0.01;
    cloudGroup.current.position.y = Math.sin(time.current * 0.5) * 3;

    if (cloudGroup.current.position.x > 100) {
      cloudGroup.current.position.x = -100;
    }
  });

  return (
    <group ref={cloudGroup}>
      <Clouds material={THREE.MeshStandardMaterial}>
        <Cloud
          position={[0, 60, -50]}
          scale={[80, 30, 40]}
          opacity={0.2}
          color="#ffffff"
          volume={10}
        />
        <Cloud
          position={[-40, 40, -60]}
          scale={[35, 10, 20]}
          opacity={0.15}
          color="#ccccff"
          volume={8}
        />
        <Cloud
          position={[30, 50, -40]}
          scale={[30, 12, 18]}
          opacity={0.18}
          color="#eeeeff"
          volume={9}
        />
      </Clouds>
    </group>
  );
}

// 🎬 MAIN SCENE
export default function ThreeJSRain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 75 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        background: "#0a0a14",
      }}
      gl={{ antialias: false }}
    >
      <ambientLight intensity={0.1} />

      {/* ☁️ Clouds that float and drift */}
      <MovingClouds />

      {/* 🌧️ Rain */}
      <Rain count={3000} />
    </Canvas>
  );
}
