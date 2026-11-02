"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CakePhase } from "@/lib/cakeStore";

export function Smoke({ phase }: { phase: CakePhase }) {
  const candleCount = 16;
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(candleCount * 6 * 3);
    for (let i = 0; i < data.length; i += 3) {
      const candle = Math.floor(i / 18);
      const angle = (candle / candleCount) * Math.PI * 2;
      data[i] = Math.cos(angle) * 1.13;
      data[i + 1] = 3.15;
      data[i + 2] = Math.sin(angle) * 1.13;
    }
    return data;
  }, []);
  useFrame(({ clock }) => {
    if (!points.current || phase !== "blowing") return;
    const attr = points.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < attr.count; i++) {
      attr.setY(i, 3.15 + ((clock.elapsedTime * 0.35 + i * 0.04) % 1.4));
      attr.setX(i, positions[i * 3] + Math.sin(clock.elapsedTime + i) * 0.08);
    }
    attr.needsUpdate = true;
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#d9d0cb" size={0.11} transparent opacity={phase === "blowing" ? 0.32 : 0} depthWrite={false} />
    </points>
  );
}
