"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
// @ts-ignore
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { VRMLoaderPlugin, VRM } from "@pixiv/three-vrm";
import * as THREE from "three";

function VRMModel({ isSpeaking }: { isSpeaking: boolean }) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const vrmRef = useRef<VRM | null>(null);
  const currentMouthOpenRef = useRef(0);
  const targetMouthOpenRef = useRef(0);
  const lastTickRef = useRef(0);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";
    loader.register((parser: any) => new VRMLoaderPlugin(parser));

    loader.load(
      "/ryo.vrm",
      (gltf: any) => {
        const vrmInstance = gltf.userData.vrm;
        setVrm(vrmInstance);
        vrmRef.current = vrmInstance;
        
        // Rotate model to face camera correctly
        if (vrmInstance.scene) {
          vrmInstance.scene.rotation.y = Math.PI;
        }
      },
      (progress: any) => console.log("Loading model...", 100.0 * (progress.loaded / progress.total), "%"),
      (error: any) => console.error(error)
    );
  }, []);

  useFrame((state, delta) => {
    if (!vrmRef.current) return;

    // Update physics/spring bones
    vrmRef.current.update(delta);

    // Subtle idle floating/breathing
    const time = state.clock.getElapsedTime();
    if (vrmRef.current.scene) {
      vrmRef.current.scene.position.y = Math.sin(time * 2) * 0.01;
    }

    // Fake Lip-Sync logic
    if (vrmRef.current.expressionManager) {
      if (isSpeaking) {
        // Change target mouth open every 100ms
        if (time - lastTickRef.current > 0.1) {
          targetMouthOpenRef.current = Math.random() > 0.3 ? Math.random() * 0.8 + 0.2 : 0;
          lastTickRef.current = time;
        }
      } else {
        targetMouthOpenRef.current = 0;
      }

      // Smooth transition
      currentMouthOpenRef.current += (targetMouthOpenRef.current - currentMouthOpenRef.current) * 10 * delta;
      
      // VRM1 uses lowercase 'aa'
      vrmRef.current.expressionManager.setValue("aa", currentMouthOpenRef.current);
      // Small blink or other expressions can be added here
      vrmRef.current.expressionManager.update();
    }
  });

  return vrm ? <primitive object={vrm.scene} /> : null;
}

export default function Ryo3D({ isSpeaking = false }: { isSpeaking?: boolean }) {
  return (
    <div className="w-full h-full relative" style={{ background: "transparent" }}>
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={[0, 1.48, -0.45]} // Zoomed in closely to the face
          fov={30}
        />
        <OrbitControls
          target={[0, 1.43, 0]} // Targeted exactly at the face
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2 - 0.1}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minAzimuthAngle={-0.1}
          maxAzimuthAngle={0.1}
        />
        
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, -2]} intensity={1.5} color="#F0F4FF" />
        <directionalLight position={[-2, 1, -2]} intensity={0.5} color="#C9A84C" />
        
        <VRMModel isSpeaking={isSpeaking} />
      </Canvas>
      
      {/* Loading indicator that disappears when Canvas renders */}
      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--text-muted)] pointer-events-none -z-10">
        Loading...
      </div>
    </div>
  );
}
