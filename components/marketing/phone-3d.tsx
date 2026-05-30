"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

const MODEL_PATH = "/models/samsung-phone.glb";
useGLTF.preload(MODEL_PATH);

type Phone3DProps = {
  rotationDeg?: MotionValue<number>;
  photoUrl?: string | null;
};

function SamsungPhoneModel({ rotationDeg }: { rotationDeg?: MotionValue<number> }) {
  const gltf = useGLTF(MODEL_PATH);
  const groupRef = useRef<THREE.Group>(null!);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!gltf.scene) return;

    gltf.scene.rotation.set(0, Math.PI / 2, 0);
    gltf.scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    gltf.scene.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    // Target 3.2 unità (era 5) → telefono più piccolo, lascia più spazio
    // alla composizione tipografica della sezione.
    const fit = maxDim > 0 ? 3.2 / maxDim : 1;
    setScale(fit);

    // Materiali GLB originali (cover blu profondo del Samsung), solo
    // bump leggero di envMapIntensity per riflessi più visibili.
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

    console.log("[Phone3D] Samsung GLB loaded — bbox:", size.toArray(), "scale:", fit);
  }, [gltf.scene]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    if (rotationDeg) {
      // Offset 30° per partire da una vista 3/4 (mai pure frontale nera)
      groupRef.current.rotation.y = ((rotationDeg.get() + 30) * Math.PI) / 180;
    } else {
      groupRef.current.rotation.y = clock.elapsedTime * 0.35;
    }
  });

  // Tilt X costante -12° per vedere sempre il top del telefono → mai
  // perfettamente di profilo (avoid edge-on invisible state)
  return (
    <group ref={groupRef} scale={scale} rotation={[-0.21, 0, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export function Phone3D({ rotationDeg }: Phone3DProps = {}) {
  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[700px] relative">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 32 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting OMNIDIREZIONALE per tenere il telefono visibile a 360°:
            - hemisphere light: bianco dall'alto + bordeaux dal basso, illumina
              tutto in modo uniforme così il telefono non sparisce mai
            - 4 directional light dai 4 lati cardinali (rim light a 360°)
            - point lights rossi per accenti caldi
        */}
        <hemisphereLight args={["#ffffff", "#3a0a0a", 1.2]} />
        <ambientLight intensity={0.6} color="#ffffff" />

        {/* Rim lights ai 4 lati per illuminare il phone da qualsiasi angolo */}
        <directionalLight position={[5, 3, 5]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={2.2} color="#dc2626" />
        <directionalLight position={[5, 3, -5]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-5, 3, 5]} intensity={1.8} color="#ff8888" />

        {/* Accent points */}
        <pointLight position={[3, 0, 3]} intensity={1.2} color="#ef4444" />
        <pointLight position={[-3, 0, -3]} intensity={1} color="#991b1b" />

        <Suspense fallback={null}>
          <SamsungPhoneModel rotationDeg={rotationDeg} />
        </Suspense>
      </Canvas>
    </div>
  );
}
