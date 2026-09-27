"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// Ashima Arts 3D simplex noise (MIT)
const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vNoise;
${simplexNoise}

float field(vec3 n){
  return snoise(n*uFreq+vec3(0.0,uTime*0.22,uTime*0.12))*0.65
       + snoise(n*uFreq*2.1-vec3(uTime*0.17))*0.25;
}
vec3 displace(vec3 p){
  vec3 n=normalize(p);
  return n*(1.0+field(n)*uAmp);
}
vec3 orthogonal(vec3 v){
  return normalize(abs(v.x)>abs(v.z)?vec3(-v.y,v.x,0.0):vec3(0.0,-v.z,v.y));
}

void main(){
  vec3 n=normalize(position);
  float d=field(n);
  vec3 dp=n*(1.0+d*uAmp);

  // Recompute the normal from two displaced neighbours
  vec3 t=orthogonal(n);
  vec3 b=normalize(cross(n,t));
  float e=0.01;
  vec3 dn=normalize(cross(displace(position+t*e)-dp,displace(position+b*e)-dp));

  vNoise=d;
  vPos=dp;
  vNormal=normalize(normalMatrix*dn);
  vec4 mv=modelViewMatrix*vec4(dp,1.0);
  vView=-mv.xyz;
  gl_Position=projectionMatrix*mv;
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vPos;
varying float vNoise;

vec3 palette(float t){
  t=fract(t);
  vec3 c=mix(uC1,uC2,smoothstep(0.0,0.25,t));
  c=mix(c,uC3,smoothstep(0.25,0.5,t));
  c=mix(c,uC4,smoothstep(0.5,0.75,t));
  return mix(c,uC1,smoothstep(0.75,1.0,t));
}

void main(){
  vec3 n=normalize(vNormal);
  vec3 v=normalize(vView);
  float ndv=clamp(dot(n,v),0.0,1.0);
  float fres=pow(1.0-ndv,2.2);

  float t=vPos.y*0.22+vPos.x*0.12+vNoise*0.35+uTime*0.04;
  vec3 col=palette(t);

  vec3 L=normalize(vec3(-0.4,0.7,0.8));
  float diff=clamp(dot(n,L),0.0,1.0);
  float spec=pow(clamp(dot(n,normalize(L+v)),0.0,1.0),56.0);

  vec3 base=col*(0.06+diff*0.42);
  vec3 rim=col*fres*1.7;
  vec3 sheen=palette(t+ndv*0.5)*pow(1.0-ndv,5.0)*0.9;
  gl_FragColor=vec4(base+rim+sheen+vec3(spec)*0.6,1.0);
}
`;

// Apple-Intelligence-like palette, in display (sRGB) space — ShaderMaterial skips color management
const PALETTE = ["#0894ff", "#c959dd", "#ff2e54", "#ff9004"];
const toVec3 = (hex: string) => {
  const c = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255);
};

interface PointerState {
  x: number;
  y: number;
  energy: number;
}

function Orb({
  progress,
  pointer,
}: {
  progress: RefObject<number>;
  pointer: RefObject<PointerState>;
}) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const dust = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const placed = useRef(false);
  const { viewport, size } = useThree();
  const compact = size.width < 768;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.16 },
      uFreq: { value: 1.35 },
      uC1: { value: toVec3(PALETTE[0]) },
      uC2: { value: toVec3(PALETTE[1]) },
      uC3: { value: toVec3(PALETTE[2]) },
      uC4: { value: toVec3(PALETTE[3]) },
    }),
    [],
  );

  const dustGeometry = useMemo(() => {
    const count = 900;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const r = 1.45 + Math.random() * 1.3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.7;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      color.set(PALETTE[i % PALETTE.length]).lerp(new THREE.Color("#ffffff"), 0.35);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geometry;
  }, []);

  useEffect(() => () => dustGeometry.dispose(), [dustGeometry]);

  useFrame((state, delta) => {
    const g = group.current;
    const m = mesh.current;
    const u = material.current?.uniforms;
    if (!g || !m || !u) return;

    const p = progress.current ?? 0;
    const ptr = pointer.current ?? { x: 0, y: 0, energy: 0 };
    ptr.energy = THREE.MathUtils.damp(ptr.energy, 0, 1.6, delta);

    u.uTime.value += delta;
    u.uAmp.value = THREE.MathUtils.damp(
      u.uAmp.value,
      0.15 + ptr.energy * 0.14 + p * 0.12,
      3,
      delta,
    );

    // Layout: right of the headline on desktop; on phones the canvas is its
    // own band above the copy, so the orb simply fills it
    const baseScale = compact
      ? Math.min(viewport.width * 0.3, viewport.height * 0.36)
      : Math.min(viewport.height * 0.26, viewport.width * 0.18);
    const baseX = compact ? 0 : viewport.width * 0.23;
    const baseY = compact ? 0 : viewport.height * 0.08;

    const scale = baseScale * (1 + p * 0.35);
    const y = baseY + p * viewport.height * 0.25;
    if (!placed.current) {
      g.scale.setScalar(scale);
      g.position.set(baseX, y, 0);
      placed.current = true;
    }
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, scale, 4, delta));
    g.position.x = THREE.MathUtils.damp(g.position.x, baseX, 4, delta);
    g.position.y = THREE.MathUtils.damp(g.position.y, y, 4, delta);

    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, ptr.y * 0.35, 2.5, delta);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, ptr.x * 0.5, 2.5, delta);
    m.rotation.y += delta * 0.08;
    m.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    if (dust.current) dust.current.rotation.y -= delta * 0.03;
  });

  const segments = compact ? 128 : 192;

  return (
    <group ref={group} scale={0.001}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1, segments, segments]} />
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <points ref={dust} geometry={dustGeometry}>
        <pointsMaterial
          size={0.018}
          vertexColors
          transparent
          opacity={0.7}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/**
 * Siri-like iridescent orb: simplex-noise displaced sphere that breathes,
 * follows the pointer and swells as the hero scrolls away.
 */
export default function HeroOrb({ progress }: { progress: RefObject<number> }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useRef<PointerState>({ x: 0, y: 0, energy: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(el);

    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      const ptr = pointer.current;
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
      const speed = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      ptr.energy = Math.min(1, ptr.energy + speed * 0.0025);
      lastX = e.clientX;
      lastY = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        // Measure layout size, not the transformed box (the hero intro scales this container)
        resize={{ offsetSize: true }}
        camera={{ position: [0, 0, 6], fov: 35 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Orb progress={progress} pointer={pointer} />
      </Canvas>
    </div>
  );
}
