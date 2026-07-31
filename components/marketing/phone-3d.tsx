"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
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

    // Il modello veniva scalato a 3.2 unità: con camera a z=7 e fov 32 il
    // campo visibile è ~4 unità, e la scala animata dello scroll arriva a
    // 1.15 → 3.68. Margine troppo stretto, il telefono usciva dai bordi e si
    // vedeva tagliato. A 2.6 resta dentro l'inquadratura in ogni fase.
    const maxDim = Math.max(size.x, size.y, size.z);
    const fit = maxDim > 0 ? 2.6 / maxDim : 1;
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
        {/* Lighting alleggerito: hemisphere (full ambient) + directional.
            Tolti 2 directional e 2 point lights — meno shader work. */}
        {/*
          Il modello è un telefono nero lucido: senza sorgenti che gli
          disegnino sopra dei riflessi resta una sagoma piatta, che su fondo
          scuro sembra un rettangolo rotto invece di un oggetto.
          Le luci sono disposte su angoli diversi apposta: una chiave frontale,
          una rossa di rimbalzo, due di taglio che accendono i bordi lunghi e
          una da dietro che stacca la silhouette dallo sfondo.
        */}
        <hemisphereLight args={["#ffffff", "#4a1414", 1.8]} />
        <ambientLight intensity={1.0} color="#fff5f5" />
        <directionalLight position={[5, 3, 5]} intensity={3.0} color="#ffffff" />
        <directionalLight position={[-5, 3, -5]} intensity={2.2} color="#dc2626" />
        <directionalLight position={[0, 2, -6]} intensity={2.4} color="#ffd9d9" />
        {/* Tagli laterali: sono questi a dare il bordo lucido sui fianchi */}
        <directionalLight position={[-6, 0, 2]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[6, -1, 1]} intensity={1.6} color="#ffe8e8" />

        <Suspense fallback={null}>
          {/*
            LA ragione per cui il telefono appariva come un rettangolo nero.

            I materiali del modello hanno envMapIntensity 2 e superfici
            metalliche/lucide, ma nella scena non c'era nessuna mappa
            d'ambiente: un materiale metallico senza qualcosa da riflettere
            resta nero comunque, per quante luci si accendano. Le luci
            illuminano le superfici opache, i riflessi li fa l'ambiente.

            Environment costruito con Lightformer, cioè generato in memoria da
            questi pannelli: niente HDR scaricata da un CDN esterno, che
            violerebbe la CSP e smentirebbe la cookie policy dove abbiamo
            scritto che il sito non contatta domini di terzi per gli asset.
          */}
          <Environment resolution={256}>
            {/* Pannello chiave: il riflesso lungo sul fronte del vetro */}
            <Lightformer
              intensity={3}
              form="rect"
              position={[0, 1.5, 4]}
              scale={[6, 8, 1]}
              color="#ffffff"
            />
            {/* Tagli laterali: accendono i bordi del telaio */}
            <Lightformer
              intensity={2}
              form="rect"
              position={[-5, 0, 1]}
              scale={[3, 8, 1]}
              color="#ffe4e4"
            />
            <Lightformer
              intensity={1.6}
              form="rect"
              position={[5, 0, 1]}
              scale={[3, 8, 1]}
              color="#ffffff"
            />
            {/* Rimbalzo rosso dal basso: lega il device allo sfondo brand */}
            <Lightformer
              intensity={1.4}
              form="circle"
              position={[0, -4, 2]}
              scale={[6, 6, 1]}
              color="#dc2626"
            />
          </Environment>
          <SamsungPhoneModel rotationDeg={rotationDeg} />
        </Suspense>
      </Canvas>
    </div>
  );
}
