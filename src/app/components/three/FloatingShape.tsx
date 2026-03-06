"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed?: number;
  shape?: "icosahedron" | "torus" | "octahedron" | "torusKnot" | "dodecahedron";
  scale?: number;
  distort?: number;
}

function GeometryByShape({ shape }: { shape: FloatingShapeProps["shape"] }) {
  switch (shape) {
    case "torus":
      return <torusGeometry args={[1, 0.4, 16, 32]} />;
    case "octahedron":
      return <octahedronGeometry args={[1, 0]} />;
    case "torusKnot":
      return <torusKnotGeometry args={[0.8, 0.3, 100, 16]} />;
    case "dodecahedron":
      return <dodecahedronGeometry args={[1, 0]} />;
    case "icosahedron":
    default:
      return <icosahedronGeometry args={[1, 1]} />;
  }
}

export default function FloatingShape({
  position,
  color,
  speed = 1,
  shape = "icosahedron",
  scale = 1,
  distort = 0.3,
}: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.15 * speed;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
  });

  return (
    <Float
      speed={speed * 1.5}
      rotationIntensity={0.5}
      floatIntensity={2}
      floatingRange={[-0.5, 0.5]}
    >
      <mesh ref={meshRef} position={position} scale={scale}>
        <GeometryByShape shape={shape} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={distort}
          speed={2}
          roughness={0}
          metalness={0.8}
          wireframe
        />
      </mesh>
    </Float>
  );
}
