"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { VARIANTS } from "@/lib/variants";
import { getState, setState, useStore } from "@/lib/store";
import { prefersReducedMotion } from "@/lib/lenis";
import {
  LABEL_H,
  LABEL_W,
  loadFonts,
  makeDropletNormals,
  paintLabel,
  readFonts,
  type Fonts,
} from "./label";

export const CAN_R = 0.53;
export const CAN_H = 2.5;

function lathe(points: [number, number][], offsetY: number) {
  const g = new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x * CAN_R, y + offsetY)),
    128,
  );
  g.computeVertexNormals();
  return g;
}

function roundedRect(p: THREE.Shape | THREE.Path, x: number, y: number, w: number, h: number, r: number) {
  p.moveTo(x + r, y);
  p.lineTo(x + w - r, y);
  p.quadraticCurveTo(x + w, y, x + w, y + r);
  p.lineTo(x + w, y + h - r);
  p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  p.lineTo(x + r, y + h);
  p.quadraticCurveTo(x, y + h, x, y + h - r);
  p.lineTo(x, y + r);
  p.quadraticCurveTo(x, y, x + r, y);
}

function tabGeometry() {
  const w = 0.17;
  const h = 0.3;
  const shape = new THREE.Shape();
  roundedRect(shape, -w / 2, -h / 2, w, h, 0.07);
  const hole = new THREE.Path();
  roundedRect(hole, -w / 2 + 0.032, 0.005, w - 0.064, h / 2 - 0.04, 0.035);
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.01,
    bevelEnabled: true,
    bevelThickness: 0.004,
    bevelSize: 0.004,
    bevelSegments: 2,
    curveSegments: 18,
  });
  g.rotateX(-Math.PI / 2);
  return g;
}

export function Can() {
  const variant = useStore((s) => s.variant);
  const gl = useThree((s) => s.gl);
  const spinGroup = useRef<THREE.Group>(null);
  const spin = useRef({ value: 0, target: 0, pending: -1 });
  const fonts = useRef<Fonts | null>(null);

  const geo = useMemo(() => {
    const body = new THREE.CylinderGeometry(CAN_R, CAN_R, CAN_H, 160, 1, true, -Math.PI, Math.PI * 2);
    const top = lathe(
      [
        [1, 0],
        [0.997, 0.03],
        [0.96, 0.085],
        [0.9, 0.15],
        [0.855, 0.2],
        [0.862, 0.228],
        [0.856, 0.252],
        [0.83, 0.263],
        [0.806, 0.25],
        [0.796, 0.222],
        [0.77, 0.212],
        [0.3, 0.21],
        [0, 0.21],
      ],
      CAN_H / 2,
    );
    const bottom = lathe(
      [
        [0, 0.07],
        [0.4, 0.055],
        [0.62, 0],
        [0.7, -0.06],
        [0.76, -0.085],
        [0.83, -0.08],
        [0.92, -0.05],
        [0.98, -0.015],
        [1, 0],
      ],
      -CAN_H / 2,
    );
    return { body, top, bottom, tab: tabGeometry() };
  }, []);

  const tex = useMemo(() => {
    const color = document.createElement("canvas");
    color.width = LABEL_W;
    color.height = LABEL_H;
    const orm = document.createElement("canvas");
    orm.width = LABEL_W / 2;
    orm.height = LABEL_H / 2;
    const map = new THREE.CanvasTexture(color);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = gl.capabilities.getMaxAnisotropy();
    const ormMap = new THREE.CanvasTexture(orm);
    const drops = new THREE.CanvasTexture(makeDropletNormals());
    drops.wrapS = THREE.RepeatWrapping;
    return { color, orm, map, ormMap, drops };
  }, [gl]);

  const materials = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      map: tex.map,
      roughnessMap: tex.ormMap,
      metalnessMap: tex.ormMap,
      roughness: 1,
      metalness: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      clearcoatNormalMap: tex.drops,
      clearcoatNormalScale: new THREE.Vector2(0.85, 0.85),
      envMapIntensity: 1.25,
    });
    const metal = new THREE.MeshStandardMaterial({
      color: "#d4d9e1",
      metalness: 1,
      roughness: 0.24,
      side: THREE.DoubleSide,
      envMapIntensity: 1.2,
    });
    return { body, metal };
  }, [tex]);

  useEffect(() => {
    return () => {
      tex.map.dispose();
      tex.ormMap.dispose();
      tex.drops.dispose();
      materials.body.dispose();
      materials.metal.dispose();
      Object.values(geo).forEach((g) => g.dispose());
    };
  }, [tex, materials, geo]);

  const paint = (index: number) => {
    if (!fonts.current) return;
    paintLabel(tex.color, VARIANTS[index], "color", fonts.current);
    paintLabel(tex.orm, VARIANTS[index], "orm", fonts.current);
    tex.map.needsUpdate = true;
    tex.ormMap.needsUpdate = true;
  };

  // First paint waits for the web fonts so the wordmark is drawn correctly.
  useEffect(() => {
    let cancelled = false;
    const f = readFonts();
    loadFonts(f).then(() => {
      if (cancelled) return;
      fonts.current = f;
      paint(getState().variant);
      requestAnimationFrame(() => setState({ ready: true }));
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex]);

  // Switching edition: spin the can once and swap the label when its back faces the camera.
  const shown = useRef(variant);
  useEffect(() => {
    if (variant === shown.current) return;
    shown.current = variant;
    if (prefersReducedMotion()) {
      paint(variant);
      return;
    }
    spin.current.target += Math.PI * 2;
    spin.current.pending = variant;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  useFrame((_, delta) => {
    const s = spin.current;
    s.value = THREE.MathUtils.damp(s.value, s.target, 3.4, Math.min(delta, 0.1));
    if (s.pending >= 0 && s.target - s.value < Math.PI) {
      paint(s.pending);
      s.pending = -1;
    }
    if (spinGroup.current) spinGroup.current.rotation.y = s.value;
  });

  return (
    <group ref={spinGroup}>
      <mesh geometry={geo.body} material={materials.body} />
      <mesh geometry={geo.top} material={materials.metal} />
      <mesh geometry={geo.bottom} material={materials.metal} />
      <mesh geometry={geo.tab} material={materials.metal} position={[0, CAN_H / 2 + 0.222, -0.05]} rotation={[0, 0, 0]} />
      <mesh material={materials.metal} position={[0, CAN_H / 2 + 0.222, 0.06]}>
        <cylinderGeometry args={[0.032, 0.036, 0.022, 24]} />
      </mesh>
    </group>
  );
}
