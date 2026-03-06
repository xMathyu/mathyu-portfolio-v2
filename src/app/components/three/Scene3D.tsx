"use client";

import { Canvas } from "@react-three/fiber";
import FloatingParticles from "./FloatingParticles";
import FloatingShape from "./FloatingShape";

export default function Scene3D() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={0.3} />

        <FloatingParticles count={400} />

        {/* Floating geometric shapes scattered around */}
        <FloatingShape
          position={[-8, 4, -5]}
          color="#818cf8"
          shape="icosahedron"
          scale={1.5}
          speed={0.8}
          distort={0.4}
        />
        <FloatingShape
          position={[7, -3, -8]}
          color="#6366f1"
          shape="torusKnot"
          scale={1.2}
          speed={0.6}
          distort={0.3}
        />
        <FloatingShape
          position={[-5, -5, -3]}
          color="#a78bfa"
          shape="octahedron"
          scale={1}
          speed={1.2}
          distort={0.5}
        />
        <FloatingShape
          position={[6, 5, -6]}
          color="#c084fc"
          shape="dodecahedron"
          scale={1.3}
          speed={0.9}
          distort={0.35}
        />
        <FloatingShape
          position={[0, -6, -4]}
          color="#818cf8"
          shape="torus"
          scale={1.1}
          speed={0.7}
          distort={0.2}
        />
        <FloatingShape
          position={[-7, 0, -7]}
          color="#e879f9"
          shape="torusKnot"
          scale={0.8}
          speed={1}
          distort={0.4}
        />
        <FloatingShape
          position={[8, 0, -5]}
          color="#a78bfa"
          shape="icosahedron"
          scale={0.9}
          speed={1.1}
          distort={0.3}
        />
      </Canvas>
    </div>
  );
}
