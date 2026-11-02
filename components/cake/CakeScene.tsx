"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { CakePhase } from "@/lib/cakeStore";
import { CAKE } from "@/lib/cakePalette";
import { Cake } from "./Cake";
import { Candles } from "./Candles";
import { Smoke } from "./Smoke";

function CameraRig() {
  const { camera, pointer } = useThree();
  const home = useRef(new THREE.Vector3(0, 3.8, 10.5));
  const target = useRef(new THREE.Vector3());
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const intro = Math.min(1, elapsed.current / 2.5);
    const ease = 1 - Math.pow(1 - intro, 3);
    const homeY = 3.8;
    const homeZ = 10.5;
    home.current.set(0, homeY, homeZ);
    target.current.set(
      pointer.x * 0.3,
      4.5 + (homeY - 4.5) * ease + pointer.y * 0.16 + Math.sin(elapsed.current * 0.12) * 0.06,
      11 + (homeZ - 11) * ease,
    );
    camera.position.lerp(target.current, 0.035);
    camera.lookAt(0, 1.35, 0);
  });
  return null;
}

function SceneLights({ phase }: { phase: CakePhase }) {
  const candle = useRef<THREE.PointLight>(null);
  const front = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  useFrame(({ clock }) => {
    const lit = !["dark", "celebrating", "done"].includes(phase);
    const flicker = 1 + Math.sin(clock.elapsedTime * 8) * 0.06;
    if (candle.current) {
      candle.current.intensity = THREE.MathUtils.lerp(candle.current.intensity, (lit ? 5.5 : 0.25) * flicker, 0.05);
      candle.current.position.x = Math.sin(clock.elapsedTime * 2.2) * 0.08;
    }
    if (front.current) front.current.intensity = THREE.MathUtils.lerp(front.current.intensity, lit ? 1.8 : 2.5, 0.04);
    if (rim.current) rim.current.intensity = THREE.MathUtils.lerp(rim.current.intensity, lit ? 0.65 : 1.2, 0.04);
  });
  return (
    <>
      <hemisphereLight args={["#ffd9c2", "#2a0f1a", 0.9]} />
      <pointLight ref={candle} color="#ffad52" position={[0, 3.8, 0]} intensity={5.5} distance={14} decay={2} />
      <pointLight ref={front} color="#ffcfaa" position={[0, 1.2, 3]} intensity={1.8} distance={10} decay={2} />
      <directionalLight ref={rim} castShadow position={[4, 6, -4]} color="#ffd19e" intensity={0.65} />
    </>
  );
}

function Atmosphere({ reducedMotion }: { reducedMotion: boolean }) {
  const positions = useMemo(() => {
    const data = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i += 1) {
      const seed = (i * 9301 + 49297) % 233280;
      const next = (seed * 9301 + 49297) % 233280;
      const final = (next * 9301 + 49297) % 233280;
      data[i * 3] = (seed / 233280 - 0.5) * 14;
      data[i * 3 + 1] = (next / 233280) * 7;
      data[i * 3 + 2] = -(final / 233280) * 12 - 2;
    }
    return data;
  }, []);
  const points = useRef<THREE.Points>(null);
  useFrame(({ clock }) => {
    if (reducedMotion || !points.current) return;
    points.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08;
    points.current.position.y = Math.sin(clock.elapsedTime * 0.2) * 0.08;
  });
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#f4c58e" size={0.045} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Table() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#481325" roughness={0.92} />
    </mesh>
  );
}

function Balloon({
  position,
  color,
  scale = 1,
  phase,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  phase: number;
}) {
  const group = useRef<THREE.Group>(null);
  const bodyGeometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          new THREE.Vector2(0.08, -0.62),
          new THREE.Vector2(0.2, -0.58),
          new THREE.Vector2(0.42, -0.4),
          new THREE.Vector2(0.6, -0.08),
          new THREE.Vector2(0.7, 0.3),
          new THREE.Vector2(0.64, 0.65),
          new THREE.Vector2(0.42, 0.94),
          new THREE.Vector2(0.18, 1.1),
          new THREE.Vector2(0, 1.14),
        ],
        32,
      ),
    [],
  );
  const stringGeometry = useMemo(
    () =>
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(0, -0.65, 0),
          new THREE.Vector3(0.08, -1.25, 0.02),
          new THREE.Vector3(-0.05, -1.9, -0.02),
        ]),
        12,
        0.012,
        6,
        false,
      ),
    [],
  );
  useFrame(({ clock }) => {
    if (!group.current) return;
    const lift = Math.min(7, Math.max(0, clock.elapsedTime - 2.2) * 0.32);
    group.current.position.y = Math.sin(clock.elapsedTime * 0.65 + phase) * 0.16 + lift;
    group.current.position.x += Math.sin(clock.elapsedTime * 0.35 + phase) * 0.0008;
    group.current.rotation.z = Math.sin(clock.elapsedTime * 0.42 + phase) * 0.06;
    group.current.visible = group.current.position.y < 6.4;
  });
  return (
    <group ref={group} position={position} scale={scale}>
      <mesh geometry={bodyGeometry} castShadow>
        <meshPhysicalMaterial
          color={color}
          roughness={0.22}
          metalness={0.02}
          clearcoat={0.75}
          clearcoatRoughness={0.18}
          sheen={0.25}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, -0.68, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.11, 0.13, 16]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.77, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.08, 0.12, 4]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh geometry={stringGeometry} position={[0, -0.78, 0]}>
        <meshBasicMaterial color="#d9b77e" />
      </mesh>
    </group>
  );
}

function CelebrationDecor({ phase, reducedMotion }: { phase: CakePhase; reducedMotion: boolean }) {
  const active = ["celebrating", "done"].includes(phase);
  const balloons = useMemo(
    () => [
      { position: [-4.6, 2.2, -5] as [number, number, number], color: "#8f1027", scale: 0.9 },
      { position: [-3.6, 3.7, -6] as [number, number, number], color: "#d9b77e", scale: 0.72 },
      { position: [-2.4, 2.3, -7] as [number, number, number], color: "#d8a9b5", scale: 0.62 },
      { position: [4.6, 2.4, -5] as [number, number, number], color: "#721126", scale: 0.92 },
      { position: [3.8, 4.1, -6] as [number, number, number], color: "#d9b77e", scale: 0.7 },
      { position: [2.4, 2.2, -7] as [number, number, number], color: "#c4142e", scale: 0.62 },
      { position: [-5.2, 4.8, -9] as [number, number, number], color: "#d8a9b5", scale: 0.58 },
      { position: [5.3, 5, -9] as [number, number, number], color: "#8f1027", scale: 0.64 },
      { position: [0, 5.2, -10] as [number, number, number], color: "#d9b77e", scale: 0.55 },
    ],
    [],
  );
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current || reducedMotion) return;
    group.current.position.y = active ? Math.sin(clock.elapsedTime * 0.45) * 0.12 : 0;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.18) * 0.08;
  });
  return (
    <group ref={group} visible={active}>
      {balloons.map((balloon, index) => (
        <Balloon key={index} {...balloon} phase={index * 0.8} />
      ))}
    </group>
  );
}

export function CakeScene({ phase }: { phase: CakePhase }) {
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <div className="absolute inset-0 h-dvh w-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 4.5, 11] }}
        gl={{ antialias: true, alpha: true }}
        fallback={<div className="flex h-full items-center justify-center px-6 text-center font-body text-xl text-[#f7ede3]">This page needs WebGL to show the cake.</div>}
        onCreated={({ scene, gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.15;
          gl.outputColorSpace = THREE.SRGBColorSpace;
          scene.background = null;
          scene.fog = new THREE.Fog(CAKE.room, 12, 24);
        }}
      >
        <CameraRig />
        <OrbitControls enablePan={false} enableZoom={false} enableDamping minPolarAngle={THREE.MathUtils.degToRad(55)} maxPolarAngle={THREE.MathUtils.degToRad(85)} minAzimuthAngle={THREE.MathUtils.degToRad(-40)} maxAzimuthAngle={THREE.MathUtils.degToRad(40)} enabled={phase !== "done"} />
        <SceneLights phase={phase} />
        <Atmosphere reducedMotion={reducedMotion} />
        <CelebrationDecor phase={phase} reducedMotion={reducedMotion} />
        <Table />
        <Cake />
        <Candles phase={phase} reducedMotion={reducedMotion} />
        <Smoke phase={phase} />
        <ContactShadows position={[0, 0.07, 0]} opacity={0.32} scale={8} blur={2.5} far={4} color="#160a12" />
      </Canvas>
    </div>
  );
}
