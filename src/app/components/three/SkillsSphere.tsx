"use client";

import { useRef, useMemo, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import TechIcon from "../TechIcon";

interface SkillNode {
  name: string;
  level: "expert" | "advanced" | "intermediate";
  category: string;
}

const skills: SkillNode[] = [
  { name: "Java", level: "expert", category: "backend" },
  { name: "Spring Boot", level: "expert", category: "backend" },
  { name: "Next.js", level: "expert", category: "frontend" },
  { name: "React", level: "expert", category: "frontend" },
  { name: "JavaScript", level: "expert", category: "language" },
  { name: "GitHub", level: "expert", category: "devops" },
  { name: "Node.js", level: "advanced", category: "backend" },
  { name: "NestJS", level: "advanced", category: "backend" },
  { name: "TypeScript", level: "advanced", category: "language" },
  { name: "Python", level: "advanced", category: "language" },
  { name: "Angular", level: "advanced", category: "frontend" },
  { name: "Tailwind", level: "advanced", category: "frontend" },
  { name: "Azure", level: "advanced", category: "cloud" },
  { name: "AWS", level: "advanced", category: "cloud" },
  { name: "Docker", level: "advanced", category: "devops" },
  { name: "PostgreSQL", level: "advanced", category: "database" },
  { name: "Redis", level: "advanced", category: "database" },
  { name: "OpenAI API", level: "advanced", category: "tool" },
  { name: "Kotlin", level: "advanced", category: "language" },
  { name: "WebFlux", level: "advanced", category: "backend" },
  { name: "Flask", level: "advanced", category: "backend" },
  { name: "Jest", level: "advanced", category: "testing" },
  { name: "JUnit", level: "advanced", category: "testing" },
  { name: ".NET", level: "intermediate", category: "backend" },
  { name: "Kubernetes", level: "intermediate", category: "devops" },
  { name: "Terraform", level: "intermediate", category: "devops" },
  { name: "GCP", level: "intermediate", category: "cloud" },
  { name: "MongoDB", level: "intermediate", category: "database" },
  { name: "Figma", level: "intermediate", category: "tool" },
  { name: "ML", level: "intermediate", category: "tool" },
  { name: "C#", level: "intermediate", category: "language" },
];

const levelColors: Record<string, string> = {
  expert: "#818cf8",
  advanced: "#c084fc",
  intermediate: "#e879f9",
};

const levelSizes: Record<string, number> = {
  expert: 16,
  advanced: 13,
  intermediate: 11,
};

function fibonacciSphere(
  n: number,
  radius: number,
): [number, number, number][] {
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
  const color = levelColors[skill.level];
  const size = levelSizes[skill.level];

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
            fontWeight:
              skill.level === "expert"
                ? 700
                : skill.level === "advanced"
                  ? 600
                  : 500,
            textShadow: isHovered
              ? `0 0 20px ${color}cc, 0 0 40px ${color}66`
              : `0 0 8px ${color}44`,
            transition: "all 0.2s ease",
            cursor: "pointer",
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

function RotatingCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const positions = useMemo(() => fibonacciSphere(skills.length, 4.5), []);

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

export default function SkillsSphere() {
  return (
    <div className="w-full h-[350px] sm:h-[450px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <RotatingCloud />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(3 * Math.PI) / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
