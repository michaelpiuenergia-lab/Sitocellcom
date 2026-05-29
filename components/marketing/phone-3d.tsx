"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const MODEL_PATH = "/models/samsung-phone.glb";
useGLTF.preload(MODEL_PATH);

type Phone3DProps = {
  rotationDeg?: MotionValue<number>;
  photoUrl?: string | null;
};

function SamsungPhoneModel({
  rotationDeg,
}: {
  rotationDeg?: MotionValue<number>;
}) {
  const gltf = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null!);
  const [scale, setScale] = useState(1);
  const { invalidate } = useThree();

  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.rotation.set(0, Math.PI / 2, 0);
    gltf.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fit = maxDim > 0 ? 3.2 / maxDim : 1;
    setScale(fit);

    gltf.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      if (obj.material instanceof THREE.MeshStandardMaterial) {
        obj.material.envMapIntensity = 2;
        if (obj.material.transparent && obj.material.opacity < 0.1) {
          obj.material.opacity = 1;
          obj.material.transparent = false;
        }
      }
    });

    invalidate();
  }, [gltf.scene, invalidate]);

  // frameloop="demand": ridipingiamo solo quando rotationDeg cambia
  // (scroll-driven). Niente 60fps continui sul nulla.
  useEffect(() => {
    if (!rotationDeg) return;
    const unsub = rotationDeg.on("change", () => invalidate());
    return () => unsub();
  }, [rotationDeg, invalidate]);

  useFrame(() => {
    if (!groupRef.current || !rotationDeg) return;
    groupRef.current.rotation.y =
      ((rotationDeg.get() + 30) * Math.PI) / 180;
  });

  return (
    <group ref={groupRef} scale={scale} rotation={[-0.21, 0, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export function Phone3D({ rotationDeg }: Phone3DProps = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px" },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full min-h-[500px] lg:min-h-[700px] relative"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
        // demand: render solo dopo invalidate() (es. rotation cambia).
        // Quando fuori viewport: "never" — nessun render.
        frameloop={inView ? "demand" : "never"}
      >
        {/* Lighting alleggerito: hemisphere (full ambient) + 2 directional.
            Tolti 2 directional e 2 point lights — meno shader work. */}
        <hemisphereLight args={["#ffffff", "#3a0a0a", 1.4]} />
        <ambientLight intensity={0.6} color="#ffffff" />
        <directionalLight position={[5, 3, 5]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={2.0} color="#dc2626" />

        <Suspense fallback={null}>
          <SamsungPhoneModel rotationDeg={rotationDeg} />
        </Suspense>
      </Canvas>
    </div>
  );
}
