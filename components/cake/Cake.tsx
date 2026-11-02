"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CAKE } from "@/lib/cakePalette";

const spongeMaterial = new THREE.MeshStandardMaterial({
  color: CAKE.spongeDeep,
  roughness: 0.94,
});
const spongeLightMaterial = new THREE.MeshStandardMaterial({
  color: CAKE.spongeLight,
  roughness: 0.94,
});
const creamMaterial = new THREE.MeshStandardMaterial({
  color: CAKE.spongeLight,
  roughness: 0.9,
});
const crumbMaterial = new THREE.MeshStandardMaterial({
  color: CAKE.crumb,
  roughness: 0.92,
});

function SpongeLayer({
  radius,
  y,
  light,
}: {
  radius: number;
  y: number;
  light?: boolean;
}) {
  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow material={light ? spongeLightMaterial : spongeMaterial}>
      <cylinderGeometry args={[radius, radius, 0.3, 64]} />
    </mesh>
  );
}

function CreamLayer({ radius, y }: { radius: number; y: number }) {
  return (
    <mesh position={[0, y, 0]} castShadow material={creamMaterial}>
      <cylinderGeometry args={[radius + 0.045, radius + 0.045, 0.1, 64]} />
    </mesh>
  );
}

function PipedBorder({
  count,
  radius,
  y,
  size,
}: {
  count: number;
  radius: number;
  y: number;
  size: number;
}) {
  const geometry = useMemo(() => new THREE.SphereGeometry(size, 12, 8), [size]);
  const mesh = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      matrix.makeTranslation(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      mesh.current.setMatrixAt(index, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, radius, y]);

  return (
    <instancedMesh ref={mesh} args={[geometry, creamMaterial, count]} castShadow />
  );
}

function CrumbSprinkles() {
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const transforms = useMemo(
    () =>
      Array.from({ length: 520 }, (_, index) => {
        const angle = index * 2.399963;
        const radius = 0.18 + (index % 25) * 0.06;
        return {
          x: Math.cos(angle) * radius,
          y: 3.105 + (index % 4) * 0.003,
          z: Math.sin(angle) * radius,
          scale: 0.007 + (index % 5) * 0.003,
          rotation: index * 0.37,
        };
      }),
    [],
  );

  useEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    for (let index = 0; index < transforms.length; index += 1) {
      const crumb = transforms[index];
      rotation.set(crumb.rotation, crumb.rotation * 0.7, crumb.rotation * 0.4);
      scale.set(crumb.scale, crumb.scale * 0.7, crumb.scale);
      matrix.compose(
        new THREE.Vector3(crumb.x, crumb.y, crumb.z),
        new THREE.Quaternion().setFromEuler(rotation),
        scale,
      );
      mesh.current.setMatrixAt(index, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  return <instancedMesh ref={mesh} args={[geometry, crumbMaterial, transforms.length]} />;
}

function VelvetTextureFlecks() {
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const mesh = useRef<THREE.InstancedMesh>(null);
  const transforms = useMemo(
    () =>
      Array.from({ length: 92 }, (_, index) => {
        const angle = index * 2.399963;
        const isTopTier = index % 3 === 0;
        const radius = isTopTier ? 1.705 : 2.405;
        const y = isTopTier
          ? 2.05 + (index % 9) * 0.105
          : 0.47 + (index % 12) * 0.102;
        return {
          x: Math.cos(angle) * radius,
          y,
          z: Math.sin(angle) * radius,
          scale: 0.012 + (index % 3) * 0.006,
          rotation: index * 0.51,
        };
      }),
    [],
  );

  useEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Euler();
    const scale = new THREE.Vector3();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    for (let index = 0; index < transforms.length; index += 1) {
      const fleck = transforms[index];
      rotation.set(fleck.rotation, fleck.rotation * 0.7, fleck.rotation * 0.3);
      scale.set(fleck.scale, fleck.scale * 1.8, fleck.scale * 0.65);
      position.set(fleck.x, fleck.y, fleck.z);
      matrix.compose(position, quaternion.setFromEuler(rotation), scale);
      mesh.current.setMatrixAt(index, matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [transforms]);

  return <instancedMesh ref={mesh} args={[geometry, crumbMaterial, transforms.length]} />;
}

export function Cake() {
  const plate = useRef<THREE.Group>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext("2d");
    if (!context) return;
    const image = context.createImageData(64, 64);
    for (let index = 0; index < image.data.length; index += 4) {
      const value = (index / 4 * 17) % 29 < 14 ? 150 : 205;
      image.data[index] = value;
      image.data[index + 1] = value * 0.72;
      image.data[index + 2] = value * 0.78;
      image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 3);
    spongeMaterial.bumpMap = texture;
    spongeMaterial.bumpScale = 0.12;
    spongeLightMaterial.bumpMap = texture;
    spongeLightMaterial.bumpScale = 0.1;
    crumbMaterial.bumpMap = texture;
    crumbMaterial.bumpScale = 0.08;
    spongeMaterial.needsUpdate = true;
    spongeLightMaterial.needsUpdate = true;
    crumbMaterial.needsUpdate = true;
    return () => texture.dispose();
  }, []);

  useFrame(({ clock }) => {
    if (plate.current) {
      plate.current.rotation.z = Math.sin(clock.elapsedTime * 2) * 0.002;
    }
  });

  return (
    <group>
      <group ref={plate}>
        <mesh position={[0, 0.12, 0]} receiveShadow>
          <cylinderGeometry args={[3.25, 3.25, 0.12, 64]} />
          <meshStandardMaterial color={CAKE.plate} roughness={0.48} />
        </mesh>
      </group>

      <SpongeLayer radius={2.4} y={0.42} />
      <CreamLayer radius={2.4} y={0.62} />
      <SpongeLayer radius={2.4} y={0.82} light />
      <CreamLayer radius={2.4} y={1.02} />
      <SpongeLayer radius={2.4} y={1.22} />
      <CreamLayer radius={2.4} y={1.42} />
      <SpongeLayer radius={2.4} y={1.62} light />
      <mesh position={[0, 1.82, 0]} castShadow material={creamMaterial}>
        <cylinderGeometry args={[2.45, 2.45, 0.16, 64]} />
      </mesh>

      <SpongeLayer radius={1.7} y={2.02} />
      <CreamLayer radius={1.7} y={2.22} />
      <SpongeLayer radius={1.7} y={2.42} light />
      <CreamLayer radius={1.7} y={2.62} />
      <SpongeLayer radius={1.7} y={2.82} />
      <mesh position={[0, 3.02, 0]} castShadow material={creamMaterial}>
        <cylinderGeometry args={[1.75, 1.75, 0.16, 64]} />
      </mesh>

      <PipedBorder count={24} radius={2.42} y={1.78} size={0.085} />
      <PipedBorder count={16} radius={1.73} y={2.98} size={0.075} />
      <CrumbSprinkles />
      <VelvetTextureFlecks />
    </group>
  );
}
