"use client";

import { useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import TechIcon from "../TechIcon";
import {
  CATEGORY_COLORS,
  LEVEL_SIZES,
  SkillCategoryFilter,
  SkillLevelFilter,
  SkillNode,
  getFilteredSkills,
} from "../skillsData";

interface SkillsSphereProps {
  activeCategory?: SkillCategoryFilter;
  activeLevel?: SkillLevelFilter;
  emptyLabel: string;
}

function fibonacciSphere(
  n: number,
  radius: number,
): [number, number, number][] {
  if (n <= 0) {
    return [];
  }

  if (n === 1) {
    return [[0, 0, 0]];
  }

  const points: [number, number, number][] = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return points;
}

function SkillLabel({
  skill,
  position,
  onHover,
  onUnhover,
  isHovered,
}: {
  skill: SkillNode;
  position: [number, number, number];
  onHover: () => void;
  onUnhover: () => void;
  isHovered: boolean;
}) {
  const color = CATEGORY_COLORS[skill.category];
  const size = LEVEL_SIZES[skill.level];

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={10}
        style={{
          pointerEvents: "auto",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        <span
          onMouseEnter={onHover}
          onMouseLeave={onUnhover}
          style={{
            color,
            fontSize: `${isHovered ? size * 1.4 : size}px`,
            fontWeight: skill.level === "expert" ? 700 : 600,
            textShadow: isHovered
              ? `0 0 20px ${color}cc, 0 0 40px ${color}55`
              : `0 0 10px ${color}44`,
            transition: "all 0.2s ease",
            cursor: "pointer",
            display: "inline-flex",
            flexDirection: isHovered ? "column" : "row",
            alignItems: isHovered ? "flex-start" : "center",
            gap: isHovered ? "2px" : "4px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <TechIcon
              technology={skill.name}
              size={isHovered ? size * 1.2 : size * 0.9}
              className="flex-shrink-0"
            />
            {skill.name}
          </span>
          {isHovered && (
            <span
              style={{
                display: "block",
                fontSize: "9px",
                color: "#94a3b8",
                textAlign: "center",
                marginTop: "2px",
                textShadow: "none",
              }}
            >
              {skill.level} · {skill.category}
            </span>
          )}
        </span>
      </Html>
    </group>
  );
}

function RotatingCloud({ skills }: { skills: SkillNode[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setHoveredIndex(null);
  }, [skills]);

  const positions = useMemo(() => fibonacciSphere(skills.length, 4.5), [skills]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const speed = hoveredIndex !== null ? 0.03 : 0.12;
      groupRef.current.rotation.y += speed * delta;
      groupRef.current.rotation.x += speed * 0.15 * delta;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillLabel
          key={skill.name}
          skill={skill}
          position={positions[i]}
          isHovered={hoveredIndex === i}
          onHover={() => setHoveredIndex(i)}
          onUnhover={() => setHoveredIndex(null)}
        />
      ))}
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.15} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.05} />
      </mesh>
      {/* Wireframe sphere outline */}
      <mesh rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[4.8, 24, 24]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.03}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default function SkillsSphere({
  activeCategory = "all",
  activeLevel = "all",
  emptyLabel,
}: SkillsSphereProps) {
  const filteredSkills = useMemo(
    () =>
      getFilteredSkills({
        category: activeCategory,
        level: activeLevel,
      }),
    [activeCategory, activeLevel],
  );

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <RotatingCloud skills={filteredSkills} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Suspense>
      </Canvas>

      {filteredSkills.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
          <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-300 backdrop-blur-md">
            {emptyLabel}
          </div>
        </div>
      )}
    </div>
  );
}
