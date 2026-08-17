"use client";

import { useEffect, useRef } from "react";
import { CLOTH_FEEL, createClothSimulation } from "./clothSimulation";

export type FabricMotionState = "static" | "loading" | "moving" | "title" | "details" | "settled";

type FabricSceneProps = {
  onStateChange: (state: FabricMotionState) => void;
};

export function FabricScene({ onStateChange }: FabricSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || reducedMotion) {
      onStateChange("static");
      return;
    }

    const loadingStartedAt = performance.now();
    onStateChange("loading");
    let cancelled = false;
    let disposeScene: (() => void) | undefined;

    void Promise.all([import("three"), new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))])
      .then(async ([THREE]) => {
        const texture = await new THREE.TextureLoader().loadAsync("/textile-hero-v2.png");
        if (cancelled) {
          texture.dispose();
          return;
        }

        const remainingHold = Math.max(1050 - (performance.now() - loadingStartedAt), 0);
        if (remainingHold > 0) await new Promise<void>((resolve) => window.setTimeout(resolve, remainingHold));
        if (cancelled) {
          texture.dispose();
          return;
        }

        const mobile = canvas.getBoundingClientRect().width < 720;
        const sourceImage = texture.image as HTMLImageElement;
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = mobile ? 768 : 640;
        maskCanvas.height = Math.round((sourceImage.naturalHeight / sourceImage.naturalWidth) * maskCanvas.width);
        const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
        let alphaTexture: InstanceType<typeof THREE.CanvasTexture> | undefined;
        if (maskContext) {
          maskContext.drawImage(sourceImage, 0, 0, maskCanvas.width, maskCanvas.height);
          const mask = maskContext.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
          for (let offset = 0; offset < mask.data.length; offset += 4) {
            const red = mask.data[offset];
            const green = mask.data[offset + 1];
            const blue = mask.data[offset + 2];
            const maximum = Math.max(red, green, blue);
            const minimum = Math.min(red, green, blue);
            const chroma = maximum - minimum;
            const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
            const isBackdrop = luminance < 26 && chroma < 16;
            let alpha = isBackdrop ? 0 : Math.max(0, Math.min(1, (luminance + chroma * 2.8 - 20) / 40));
            alpha = alpha * alpha * (3 - 2 * alpha);
            const value = Math.round(alpha * 255);
            mask.data[offset] = value;
            mask.data[offset + 1] = value;
            mask.data[offset + 2] = value;
            mask.data[offset + 3] = 255;
          }
          maskContext.putImageData(mask, 0, 0);
          alphaTexture = new THREE.CanvasTexture(maskCanvas);
          alphaTexture.needsUpdate = true;
        }

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 2 : 1.5));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
        camera.position.set(0, 0, 8.4);

        const columns = mobile ? 32 : 36;
        const rows = mobile ? 42 : 46;
        const geometry = new THREE.PlaneGeometry(8.2, 10.4, columns - 1, rows - 1);
        const basePositions = geometry.attributes.position.array.slice();
        const simulation = createClothSimulation(basePositions, columns, rows);
        geometry.attributes.position.array.set(simulation.positions);
        geometry.attributes.position.needsUpdate = true;

        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), mobile ? 16 : 12);
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          emissive: 0xffffff,
          emissiveMap: texture,
          emissiveIntensity: 0.16,
          alphaMap: alphaTexture,
          alphaTest: 0.12,
          transparent: Boolean(alphaTexture),
          roughness: 0.48,
          metalness: 0,
          side: THREE.DoubleSide,
        });
        const cloth = new THREE.Mesh(geometry, material);
        cloth.rotation.z = -0.055;
        scene.add(cloth);

        scene.add(new THREE.AmbientLight(0x211319, 1.42));
        const neutralLight = new THREE.DirectionalLight(0xf5f1ed, 1.9);
        neutralLight.position.set(-4, 3, 6);
        scene.add(neutralLight);
        const coolLight = new THREE.DirectionalLight(0x4e8b93, 0.24);
        coolLight.position.set(4, -1, 4);
        scene.add(coolLight);
        const burgundyLight = new THREE.DirectionalLight(0x9a3f52, 0.42);
        burgundyLight.position.set(5, -3, 4);
        scene.add(burgundyLight);

        let frame = 0;
        let lastTime = performance.now();
        let accumulator = 0;
        let motionPhase: "moving" | "title" | "details" = "moving";
        let settledFrames = 0;
        const position = geometry.attributes.position;

        const resize = () => {
          const rect = canvas.getBoundingClientRect();
          renderer.setSize(rect.width, rect.height, false);
          camera.aspect = rect.width / Math.max(rect.height, 1);
          camera.updateProjectionMatrix();
          const compact = rect.width < 720;
          if (compact) {
            // Reveal more of the textile's teal-to-burgundy transition on a narrow screen.
            cloth.scale.set(.46, .86, 1);
            cloth.position.x = -.25;
          } else {
            cloth.scale.set(.98, 1.14, 1);
            cloth.position.x = .55;
          }
        };

        const render = () => {
          position.array.set(simulation.positions);
          position.needsUpdate = true;
          geometry.computeVertexNormals();
          renderer.render(scene, camera);
        };

        const animate = (now: number) => {
          accumulator += Math.min((now - lastTime) / 1000, 0.05);
          lastTime = now;
          let substeps = 0;
          while (accumulator >= CLOTH_FEEL.fixedStep && substeps < CLOTH_FEEL.maxSubsteps) {
            simulation.step(CLOTH_FEEL.fixedStep);
            accumulator -= CLOTH_FEEL.fixedStep;
            substeps += 1;
          }

          render();
          if (motionPhase === "moving" && simulation.time >= CLOTH_FEEL.titleAt) {
            motionPhase = "title";
            onStateChange("title");
          }

          if (motionPhase === "title" && simulation.time >= CLOTH_FEEL.detailsAt) {
            motionPhase = "details";
            onStateChange("details");
          }

          if (simulation.time > 3 && simulation.speed < CLOTH_FEEL.settleSpeed) settledFrames += 1;
          else settledFrames = 0;

          if (settledFrames >= CLOTH_FEEL.settleFrames || simulation.time >= CLOTH_FEEL.safetySettleAt) {
            onStateChange("settled");
            return;
          }
          frame = requestAnimationFrame(animate);
        };

        resize();
        render();
        onStateChange("moving");
        window.addEventListener("resize", resize);
        frame = requestAnimationFrame(animate);

        disposeScene = () => {
          cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          geometry.dispose();
          material.dispose();
          texture.dispose();
          alphaTexture?.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        if (!cancelled) onStateChange("static");
      });

    return () => {
      cancelled = true;
      disposeScene?.();
    };
  }, [onStateChange]);

  return <canvas ref={canvasRef} className="fabric-canvas" aria-hidden="true" />;
}
