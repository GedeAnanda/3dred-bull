"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VARIANTS } from "@/lib/variants";
import { getState } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/lenis";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vRand;
  varying float vAlpha;

  void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * (0.25 + aRand * 0.7) + 5.0, 10.0) - 5.0;
    p.x += sin(uTime * 0.35 + aRand * 6.2831) * 0.35;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.3 + aRand) * uPixelRatio / -mv.z;
    vRand = aRand;
    vAlpha = smoothstep(5.0, 3.2, abs(p.y));
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vRand;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 2.2);
    vec3 col = mix(uColor, vec3(1.0, 0.86, 0.35), step(0.82, vRand));
    col = mix(col, vec3(1.0), step(0.94, vRand));
    gl_FragColor = vec4(col, a * vAlpha * 0.75);
  }
`;

/** Rising "energy" motes. Speed reacts to scroll velocity. */
export function Particles({ count = 520 }: { count?: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const lastY = useRef(0);
  const boost = useRef(0);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = 1.8 - Math.random() * 9;
      rand[i] = Math.random();
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSize: { value: 70 },
      uPixelRatio: { value: 1 },
      uColor: { value: new THREE.Color(VARIANTS[0].accent) },
    }),
    [],
  );
  const target = useMemo(() => new THREE.Color(), []);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1);
    const y = window.scrollY;
    const velocity = Math.abs(y - lastY.current) / Math.max(d, 1e-3) / window.innerHeight;
    lastY.current = y;
    boost.current = THREE.MathUtils.damp(boost.current, Math.min(velocity, 3), 4, d);
    if (!reduced) uniforms.uTime.value += d * (0.35 + boost.current * 1.6);
    uniforms.uPixelRatio.value = dpr;
    target.set(VARIANTS[getState().variant].accent);
    uniforms.uColor.value.lerp(target, 1 - Math.exp(-3 * d));
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
