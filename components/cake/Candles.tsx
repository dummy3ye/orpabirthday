"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CakePhase } from "@/lib/cakeStore";
import { CAKE } from "@/lib/cakePalette";
import { CAKE_TIMINGS } from "@/lib/cakeTimings";

const COUNT = 16;
const candleColors = [CAKE.cream, "#e8a4ae", CAKE.gold];

export function Candles({ phase, reducedMotion }: { phase: CakePhase; reducedMotion: boolean }) {
  const flames = useRef<THREE.Group[]>([]);
  const started = useRef<number | null>(null);
  const born = useRef<number | null>(null);
  const offsets = useMemo(() => Array.from({ length: COUNT }, (_, index) => index * 0.73), []);
  const order = useMemo(() => {
    const values = Array.from({ length: COUNT }, (_, index) => index);
    for (let index = values.length - 1; index > 0; index -= 1) {
      const swap = (index * 17 + 5) % (index + 1);
      [values[index], values[swap]] = [values[swap], values[index]];
    }
    return values;
  }, []);
  useFrame(({ clock }) => {
    if (born.current === null) born.current = clock.elapsedTime;
    if (phase === "blowing" && started.current === null) started.current = clock.elapsedTime;
    const intro = (clock.elapsedTime - born.current) * 1000;
    const elapsed = started.current === null ? -1 : (clock.elapsedTime - started.current) * 1000;
    flames.current.forEach((flame, index) => {
      if (!flame) return;
      const ignited = intro > CAKE_TIMINGS.candleIgniteDelay + index * CAKE_TIMINGS.candleIgniteStagger;
      const extinguished = elapsed >= order.indexOf(index) * CAKE_TIMINGS.extinguishStagger + 120;
      const fade = phase === "blowing" ? Math.max(0, 1 - elapsed / CAKE_TIMINGS.extinguishDuration) : 1;
      const pulse = 1 + (reducedMotion ? 0.025 : 0.07) * Math.sin(clock.elapsedTime * 8 + offsets[index]);
      flame.scale.setScalar(!ignited || extinguished ? 0 : pulse * fade);
      flame.rotation.z = phase === "blowing" ? THREE.MathUtils.lerp(flame.rotation.z, 0.42, 0.12) : THREE.MathUtils.lerp(flame.rotation.z, Math.sin(clock.elapsedTime * 2 + offsets[index]) * 0.04, 0.08);
    });
  });
  return (
    <group>
      {Array.from({ length: COUNT }, (_, index) => {
        const angleOffsets = [-0.08, 0.035, -0.045, 0.065, -0.025, 0.055, -0.06, 0.02, -0.035, 0.07, -0.02, 0.045, -0.055, 0.03, -0.04, 0.015];
        const radiusOffsets = [0.02, -0.035, 0.045, -0.015, 0.03, -0.045, 0.01, 0.04, -0.025, 0.035, -0.04, 0.02, 0.05, -0.02, 0.03, -0.035];
        const angle = (index / COUNT) * Math.PI * 2 + angleOffsets[index];
        const radius = 1.13 + radiusOffsets[index];
        return (
          <group
            key={index}
            position={[Math.cos(angle) * radius, 3.28 + (index % 3 - 1) * 0.012, Math.sin(angle) * radius]}
            rotation={[0, 0, (index % 5 - 2) * 0.018]}
          >
            <mesh castShadow>
              <cylinderGeometry args={[0.045, 0.045, 0.55, 16]} />
              <meshStandardMaterial color={candleColors[index % candleColors.length]} roughness={0.45} />
            </mesh>
            <mesh position={[0, 0.31, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.07, 8]} />
              <meshStandardMaterial color="#35101a" />
            </mesh>
            <group ref={(node) => { if (node) flames.current[index] = node; }} position={[0, 0.43, 0]}>
              <mesh scale={[0.055, 0.13, 0.055]}>
                <sphereGeometry args={[1, 16, 12]} />
                <meshStandardMaterial color="#ffb347" emissive="#ff8d22" emissiveIntensity={2.2} />
              </mesh>
              <mesh scale={[0.035, 0.09, 0.035]}>
                <sphereGeometry args={[1, 16, 12]} />
                <meshStandardMaterial color="#fffbe6" emissive="#fff3b0" emissiveIntensity={3} />
              </mesh>
            </group>
          </group>
        );
      })}
    </group>
  );
}
