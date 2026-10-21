"use client";

import { Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Can } from "./Can";
import { Particles } from "./Particles";
import { VARIANTS } from "@/lib/variants";
import { getState, motion, useStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/lenis";

type Pose = {
  /** Fraction of viewport width / height, from the centre. */
  x: number;
  y: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  /** Follow the anchor element as it scrolls instead of staying fixed. */
  track?: boolean;
};

const ANCHORS = ["hero", "company", "numbers", "products", "outro"] as const;
type AnchorId = (typeof ANCHORS)[number];

const DESKTOP: Record<AnchorId, Pose> = {
  hero: { x: 0, y: -0.03, s: 1, rx: 0.16, ry: -0.45, rz: -0.14 },
  company: { x: -0.25, y: -0.02, s: 0.9, rx: 0.3, ry: 0.5, rz: 0.32 },
  numbers: { x: 0.27, y: 0, s: 0.78, rx: 0.5, ry: -0.3, rz: -1.15 },
  products: { x: 0.22, y: -0.03, s: 0.98, rx: 0.08, ry: 0, rz: -0.06 },
  outro: { x: 0, y: 0.04, s: 0.92, rx: 0.35, ry: 0.4, rz: 0.55 },
};

const MOBILE: Record<AnchorId, Pose> = {
  hero: { x: 0, y: 0.08, s: 0.6, rx: 0.16, ry: -0.45, rz: -0.12 },
  company: { x: 0.7, y: 0.62, s: 0.5, rx: 0.4, ry: 0.6, rz: 0.9 },
  numbers: { x: -0.75, y: 0.65, s: 0.5, rx: 0.4, ry: 0, rz: -1.2 },
  products: { x: 0, y: 0, s: 0.6, rx: 0.08, ry: 0, rz: -0.06, track: true },
  outro: { x: 0, y: 0.12, s: 0.56, rx: 0.35, ry: 0.4, rz: 0.55 },
};

const TAU = Math.PI * 2;
const { lerp, damp, smoothstep } = THREE.MathUtils;

function Rig({ children }: { children: ReactNode }) {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const anchors = useRef<{ id: AnchorId; center: number }[]>([]);
  const mobile = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const first = useRef(true);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useEffect(() => {
    const measure = () => {
      mobile.current = window.innerWidth < 768;
      anchors.current = ANCHORS.flatMap((id) => {
        const el =
          (mobile.current && document.querySelector(`[data-can-mobile="${id}"]`)) ||
          document.querySelector(`[data-can="${id}"]`);
        if (!el) return [];
        const r = el.getBoundingClientRect();
        return [{ id, center: r.top + window.scrollY + r.height / 2 }];
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("pointermove", onMove);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, []);

  useFrame((state, delta) => {
    const list = anchors.current;
    const o = outer.current;
    const n = inner.current;
    if (!list.length || !o || !n) return;

    const d = Math.min(delta, 0.1);
    const vh = window.innerHeight;
    const c = window.scrollY + vh / 2;

    // Which pair of anchors the viewport centre sits between.
    let i = 0;
    let t = 0;
    if (c >= list[list.length - 1].center) {
      i = list.length - 1;
    } else if (c > list[0].center) {
      while (i < list.length - 2 && c >= list[i + 1].center) i++;
      t = (c - list[i].center) / (list[i + 1].center - list[i].center);
    }
    const j = Math.min(i + 1, list.length - 1);
    // Hold each pose while its section is centred, travel in between.
    t = reduced ? (t < 0.5 ? 0 : 1) : smoothstep(t, 0.12, 0.88);

    const poses = mobile.current ? MOBILE : DESKTOP;
    const A = poses[list[i].id];
    const B = poses[list[j].id];
    const { width: vw, height: vhw } = state.viewport;
    const yOf = (p: Pose, center: number) =>
      p.y * vhw + (p.track ? -((center - c) / vh) * vhw : 0);

    const intro = motion.intro;
    const time = reduced ? 0 : state.clock.elapsedTime;
    const px = reduced ? 0 : pointer.current.x;
    const py = reduced ? 0 : pointer.current.y;

    const target = {
      x: lerp(A.x, B.x, t) * vw + px * 0.12,
      y: lerp(yOf(A, list[i].center), yOf(B, list[j].center), t) + Math.sin(time * 1.2) * 0.05 - (1 - intro) * vhw * 0.95,
      s: lerp(A.s, B.s, t) * (0.75 + 0.25 * intro),
      rx: lerp(A.rx, B.rx, t) - py * 0.12,
      // One full turn per section travelled; cumulative so damping never unwinds.
      ry: lerp(A.ry + i * TAU, B.ry + j * TAU, t) + px * 0.35 - (1 - intro) * TAU,
      rz: lerp(A.rz, B.rz, t) + Math.sin(time * 0.8) * 0.025,
    };

    const k = reduced || first.current ? 1e3 : 3.2;
    first.current = false;
    o.position.x = damp(o.position.x, target.x, k, d);
    o.position.y = damp(o.position.y, target.y, k, d);
    o.scale.setScalar(damp(o.scale.x, target.s, k, d));
    n.rotation.x = damp(n.rotation.x, target.rx, k, d);
    n.rotation.y = damp(n.rotation.y, target.ry, k, d);
    n.rotation.z = damp(n.rotation.z, target.rz, k, d);
  });

  return (
    <group ref={outer}>
      <Glow />
      <group ref={inner}>{children}</group>
    </group>
  );
}

/** Soft accent-coloured halo behind the can. */
function Glow() {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(VARIANTS[0].accent) } }), []);
  const target = useMemo(() => new THREE.Color(), []);
  useFrame((_, delta) => {
    target.set(VARIANTS[getState().variant].accent);
    uniforms.uColor.value.lerp(target, 1 - Math.exp(-3 * Math.min(delta, 0.1)));
  });
  return (
    <mesh position={[0, 0, -1.6]} renderOrder={-1}>
      <planeGeometry args={[7, 7]} />
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform vec3 uColor; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(1.0 - smoothstep(0.0, 1.0, d), 2.4); gl_FragColor = vec4(uColor, a * 0.42); }`}
      />
    </mesh>
  );
}

function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      {/* Navy fill so bare aluminium never reflects pure black. */}
      <color attach="background" args={["#1b2540"]} />
      {/* Two front softboxes with a dark gap between them: classic silver banding. */}
      <Lightformer form="rect" intensity={1.4} position={[-3.2, 0.5, 7]} scale={[4, 10, 1]} />
      <Lightformer form="rect" intensity={0.9} position={[3.6, 0.5, 7]} scale={[3, 10, 1]} />
      {/* Vertical strips give the can its long product-shot highlights. */}
      <Lightformer form="rect" intensity={6} position={[-4, 0, 3]} rotation-y={Math.PI / 3} scale={[0.8, 12, 1]} />
      <Lightformer form="rect" intensity={5} color="#ff2a55" position={[4.5, 0, -1]} rotation-y={-Math.PI / 2.5} scale={[0.5, 12, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#7aa2ff" position={[3, 0, 4]} rotation-y={-Math.PI / 4} scale={[1.5, 10, 1]} />
      <Lightformer form="rect" intensity={1.6} position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      <Lightformer form="rect" intensity={0.7} color="#1d3d8f" position={[0, 0, -8]} scale={[16, 6, 1]} />
      <Lightformer form="ring" intensity={2} color="#ffc906" position={[2, 3, 6]} scale={1.5} />
    </Environment>
  );
}

export default function Scene() {
  const paused = useStore((s) => s.paused);
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, 1.75));
  const small = useMemo(() => window.innerWidth < 768, []);

  return (
    <Canvas
      dpr={dpr}
      frameloop={paused ? "never" : "always"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 35, near: 0.1, far: 40 }}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(Math.min(window.devicePixelRatio, 1.75))}
      />
      <ambientLight intensity={0.15} />
      <directionalLight position={[2, 3, 5]} intensity={1.2} />
      <Suspense fallback={null}>
        <Studio />
        <Rig>
          <Can />
        </Rig>
      </Suspense>
      <Particles count={small ? 260 : 520} />
    </Canvas>
  );
}
