"use client";

import { useEffect, useMemo, useRef, useState, Suspense, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
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

/** Translated names shown in a label's detail pill */
export interface SkillLabels {
  levels: Record<string, string>;
  categories: Record<string, string>;
}

interface SkillsSphereProps {
  activeCategory?: SkillCategoryFilter;
  activeLevel?: SkillLevelFilter;
  emptyLabel: string;
  labels: SkillLabels;
}

/** Drag state shared between the pointer handlers and the render loop. */
interface Spin {
  dragging: boolean;
  /** rotation to apply on the next frame (radians) */
  pendingX: number;
  pendingY: number;
  /** angular velocity carried after release (rad/s) */
  vx: number;
  vy: number;
  /** a drag (not a tap) happened during the current press */
  moved: boolean;
  touch: boolean;
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
  spin,
  labels,
}: {
  skill: SkillNode;
  position: [number, number, number];
  onHover: () => void;
  onUnhover: () => void;
  isHovered: boolean;
  spin: RefObject<Spin>;
  labels: SkillLabels;
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
          onMouseEnter={() => !spin.current?.touch && onHover()}
          onMouseLeave={() => !spin.current?.touch && onUnhover()}
          // Touch has no hover: a tap (not a swipe) toggles the details
          onClick={() => {
            const s = spin.current;
            if (!s?.touch || s.moved) return;
            if (isHovered) onUnhover();
            else onHover();
          }}
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
                fontSize: "11px",
                fontWeight: 500,
                color: "#e2e8f0",
                background: "rgba(0, 0, 0, 0.6)",
                border: `1px solid ${color}55`,
                borderRadius: "999px",
                padding: "2px 8px",
                marginTop: "4px",
                textShadow: "none",
              }}
            >
              {labels.levels[skill.level] ?? skill.level} · {labels.categories[skill.category] ?? skill.category}
            </span>
          )}
        </span>
      </Html>
    </group>
  );
}

function RotatingCloud({
  skills,
  spin,
  labels,
}: {
  skills: SkillNode[];
  spin: RefObject<Spin>;
  labels: SkillLabels;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    setHoveredIndex(null);
  }, [skills]);

  const positions = useMemo(
    () => fibonacciSphere(skills.length, 4.5),
    [skills],
  );

  useFrame((_, delta) => {
    const group = groupRef.current;
    const s = spin.current;
    if (!group || !s) return;
    const auto = hoveredIndex !== null ? 0.03 : 0.12;

    if (s.dragging) {
      group.rotation.y += s.pendingY;
      group.rotation.x += s.pendingX;
    } else {
      // Fling: carry the release velocity and let it ease out
      const decay = Math.pow(0.04, delta);
      s.vx *= decay;
      s.vy *= decay;
      group.rotation.y += (auto + s.vy) * delta;
      group.rotation.x += (auto * 0.15 + s.vx) * delta;
    }
    group.rotation.x = THREE.MathUtils.clamp(group.rotation.x, -1.1, 1.1);
    s.pendingX = 0;
    s.pendingY = 0;
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <SkillLabel
          key={skill.name}
          skill={skill}
          spin={spin}
          labels={labels}
          position={positions[i]}
          isHovered={hoveredIndex === i}
          onHover={() => setHoveredIndex(i)}
          onUnhover={() => setHoveredIndex(null)}
        />
      ))}
      {/* Center glow */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#0894ff" transparent opacity={0.18} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#c959dd" transparent opacity={0.06} />
      </mesh>
      {/* Wireframe sphere outline */}
      <mesh rotation={[0.3, 0, 0]}>
        <sphereGeometry args={[4.8, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.035}
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
  labels,
}: SkillsSphereProps) {
  const spin = useRef<Spin>({
    dragging: false,
    pendingX: 0,
    pendingY: 0,
    vx: 0,
    vy: 0,
    moved: false,
    touch: false,
  });
  const last = useRef({ x: 0, y: 0, t: 0 });

  const filteredSkills = useMemo(
    () =>
      getFilteredSkills({
        category: activeCategory,
        level: activeLevel,
      }),
    [activeCategory, activeLevel],
  );

  // Drag to spin, fling to keep it going. `touch-action: pan-y` leaves vertical
  // swipes to the page, so phones can still scroll past the sphere.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = spin.current;
    s.touch = e.pointerType !== "mouse";
    s.dragging = true;
    s.moved = false;
    s.vx = 0;
    s.vy = 0;
    last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
    if (!s.touch) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = spin.current;
    if (!s.dragging) return;
    const dx = e.clientX - last.current.x;
    const dy = s.touch ? 0 : e.clientY - last.current.y;
    const dt = Math.max(1, e.timeStamp - last.current.t) / 1000;
    if (Math.abs(dx) + Math.abs(dy) > 2) s.moved = true;
    const ry = dx * 0.008;
    const rx = dy * 0.006;
    s.pendingY += ry;
    s.pendingX += rx;
    // Smoothed release velocity, capped so a hard flick stays readable
    s.vy = THREE.MathUtils.clamp(s.vy * 0.5 + (ry / dt) * 0.5, -6, 6);
    s.vx = THREE.MathUtils.clamp(s.vx * 0.5 + (rx / dt) * 0.5, -4, 4);
    last.current = { x: e.clientX, y: e.clientY, t: e.timeStamp };
  };

  const onPointerEnd = () => {
    const s = spin.current;
    s.dragging = false;
    // A finger held still before lifting shouldn't fling
    if (performance.now() - last.current.t > 120) {
      s.vx = 0;
      s.vy = 0;
    }
  };

  return (
    <div
      className="relative h-[21.875rem] max-h-[85svh] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[28rem] md:h-[37.5rem]"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onPointerLeave={(e) => e.pointerType === "mouse" && onPointerEnd()}
    >
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        resize={{ offsetSize: true }}
        style={{ background: "transparent", touchAction: "pan-y" }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <RotatingCloud skills={filteredSkills} spin={spin} labels={labels} />
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
