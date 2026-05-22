"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/**
 * Smartphone 3D — modello generato proceduralmente con primitive Three.js,
 * niente GLB da caricare. Ruota lentamente, materiale glass premium con
 * riflessi e accenti rossi sullo schermo.
 */
function PhoneModel() {
  const groupRef = useRef<THREE.Group>(null!);

  // Auto-rotation continua sull'asse Y (orizzontale)
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.4;
    }
  });

  // Geometria phone: rounded box con corner radius simulato
  const phoneGeometry = useMemo(() => {
    const w = 1.5;
    const h = 3;
    const d = 0.12;
    const r = 0.18;
    const shape = new THREE.Shape();
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    shape.lineTo(w / 2, h / 2 - r);
    shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    shape.lineTo(-w / 2, -h / 2 + r);
    shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return new THREE.ExtrudeGeometry(shape, {
      depth: d,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.025,
      bevelSegments: 8,
      curveSegments: 32,
    });
  }, []);

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
      <group ref={groupRef} position={[0, 0, 0]} scale={1.5}>
        {/* Body — alluminio scuro */}
        <mesh geometry={phoneGeometry} castShadow receiveShadow>
          <meshPhysicalMaterial
            color="#1a1a1a"
            metalness={0.9}
            roughness={0.25}
            clearcoat={0.6}
            clearcoatRoughness={0.3}
          />
        </mesh>

        {/* Schermo nero brillante con accent rosso */}
        <mesh position={[0, 0.05, 0.13]}>
          <planeGeometry args={[1.35, 2.85]} />
          <meshPhysicalMaterial
            color="#050505"
            emissive="#dc2626"
            emissiveIntensity={0.08}
            metalness={0.4}
            roughness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.02}
          />
        </mesh>

        {/* Linea rossa sullo schermo come "logo highlight" */}
        <mesh position={[0, -1.3, 0.131]}>
          <planeGeometry args={[0.8, 0.025]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>

        {/* Dynamic Island / notch */}
        <mesh position={[0, 1.2, 0.131]}>
          <planeGeometry args={[0.5, 0.13]} />
          <meshBasicMaterial color="#000000" />
        </mesh>

        {/* Camera bump posteriore (square) */}
        <mesh position={[-0.4, 1, -0.13]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[0.55, 0.55, 0.06]} />
          <meshPhysicalMaterial
            color="#0a0a0a"
            metalness={0.95}
            roughness={0.2}
            clearcoat={1}
          />
        </mesh>

        {/* 3 camera lens */}
        {[
          [-0.55, 1.15, -0.17],
          [-0.25, 1.15, -0.17],
          [-0.4, 0.85, -0.17],
        ].map((p, i) => (
          <mesh key={i} position={p as [number, number, number]} rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 32]} />
            <meshPhysicalMaterial
              color="#1a1a1a"
              metalness={1}
              roughness={0.1}
              clearcoat={1}
            />
          </mesh>
        ))}

        {/* Flash LED */}
        <mesh position={[-0.1, 1.05, -0.165]} rotation={[0, Math.PI, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
          <meshBasicMaterial color="#fef2f2" />
        </mesh>

        {/* Bordi rossi laterali (Cellcom signature) */}
        <mesh position={[0.755, 0, 0.06]}>
          <boxGeometry args={[0.003, 2.4, 0.04]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
        <mesh position={[-0.755, 0, 0.06]}>
          <boxGeometry args={[0.003, 2.4, 0.04]} />
          <meshBasicMaterial color="#dc2626" />
        </mesh>
      </group>
    </Float>
  );
}

export function Phone3D() {
  return (
    <div className="w-full h-full min-h-[500px] lg:min-h-[700px]">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 35 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting setup completo — 6 luci compensano la mancanza di HDR.
             Key light bianca + rim light rosso + fill ambient + accenti. */}
          <ambientLight intensity={0.35} color="#1a1a1a" />

          {/* KEY light — direzionale principale */}
          <directionalLight
            position={[4, 6, 5]}
            intensity={1.8}
            color="#ffffff"
            castShadow
            shadow-mapSize={[1024, 1024]}
          />

          {/* RIM light rossa — separa il phone dal background nero */}
          <directionalLight
            position={[-6, 2, -4]}
            intensity={1.5}
            color="#dc2626"
          />

          {/* FILL bianca soft — riempie le ombre */}
          <directionalLight
            position={[-3, -2, 3]}
            intensity={0.5}
            color="#ffffff"
          />

          {/* Spotlight cinematico dall'alto */}
          <spotLight
            position={[0, 8, 5]}
            angle={0.4}
            penumbra={1}
            intensity={1.2}
            color="#ffffff"
          />

          {/* Glow rosso ambientale — illumina il metallo del body */}
          <pointLight position={[2, -1, 4]} intensity={0.8} color="#ef4444" />
          <pointLight position={[-2, 1, -2]} intensity={0.6} color="#991b1b" />

          <PhoneModel />

          {/* Pavimento per ombra rossa proiettata */}
          <ContactShadows
            position={[0, -2.2, 0]}
            opacity={0.65}
            scale={6}
            blur={2.5}
            far={4}
            color="#dc2626"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
