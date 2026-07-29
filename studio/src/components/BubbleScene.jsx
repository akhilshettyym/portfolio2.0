"use client";

import gsap from "gsap";
import * as THREE from "three";
import "@/styles/bubble_scene.css";
import { memo, useEffect, useRef } from "react";
import { BUBBLE_TEXT_GROUPS } from "@/utils/basic";
import { useDeviceType } from "@/hooks/useDeviceType";
import { motion, useReducedMotion } from "framer-motion";
import { createThreeTimer } from "@/lib/performance/threeTimer";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { RADII, POSITIONS, TEXTURE_PATHS } from "@/utils/basic";
import { getQualityPreset, getRendererPixelRatio } from "@/lib/performance/applyQualityTier";

function BubbleScene() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { tier, isTier2 } = usePerformanceTier();
  const { isMobile } = useDeviceType();
  const quality = getQualityPreset(tier);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return undefined;

    let animationFrameId = null;
    let loadingComplete = false;
    let animationStarted = false;
    let sceneIsVisible = false;
    let mouseMoveTimeout;
    let resizeObserver;
    let frame = 0;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog("#ffffff", 20, 52);

    const camera = new THREE.PerspectiveCamera(30, wrapper.clientWidth / wrapper.clientHeight, 0.1, 1000);
    camera.position.set(0, 0.3, 24);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: quality.antialias,
      powerPreference: tier === "tier_1" ? "high-performance" : "default",
    });

    renderer.setSize(wrapper.clientWidth, wrapper.clientHeight);
    renderer.setPixelRatio(getRendererPixelRatio(tier, isTier2 ? 1 : 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const loader = new THREE.TextureLoader();
    const textures = TEXTURE_PATHS.map((name) => {
      const texture = loader.load(`/bubbles/bubbles.${name}.svg`);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });

    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const directionalLight = new THREE.DirectionalLight("#dbeafe", 0.8);
    directionalLight.position.set(8, 12, 10);
    scene.add(directionalLight);

    const group = new THREE.Group();

    const baseScaleFactor = isMobile ? 0.75 : 1.0;
    const targetZRotation = isMobile ? -(Math.PI / 2) : 0;

    group.rotation.set(-0.16, 0, targetZRotation + 0.1);
    group.scale.setScalar(baseScaleFactor * 0.8);
    scene.add(group);

    const bubbles = POSITIONS.map((pos, index) => {
      const radius = RADII[index] ?? 0.5;
      const texture = textures[index % textures.length];
      const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      const bubble = new THREE.Sprite(material);
      const scale = radius * 3.0;
      const entryAngle = index * 0.62;
      const entryRadius = 2.5 + (index % 9) * 0.32;

      bubble.scale.set(0.05, 0.05, 0.05);
      bubble.position.set(Math.cos(entryAngle) * entryRadius, -6 + Math.sin(entryAngle) * 1.2, -6 - (index % 7) * 0.2);

      bubble.userData = {
        originalPosition: new THREE.Vector3(pos.x, pos.y, pos.z),
        baseScale: scale,
        velocity: new THREE.Vector3(),
        radius,
        hovered: false,
        floatOffset: Math.random() * Math.PI * 2,
      };
      group.add(bubble);
      return bubble;
    });

    const damping = 0.955;
    const mouseForce = 0.017;
    const returnStrength = 0.015;
    const floatSpeed = shouldReduceMotion || isTier2 ? 0.00025 : 0.00072;
    const floatAmplitude = shouldReduceMotion || isTier2 ? 0.06 : 0.19;
    const hoverScale = isTier2 ? 2.2 : 2.95;
    const mouse = new THREE.Vector2(-10, -10);
    const raycaster = new THREE.Raycaster();
    const tempVector = new THREE.Vector3();

    function startAnimation() {
      if (animationStarted) return;
      animationStarted = true;
      const duration = shouldReduceMotion || isTier2 ? 0.35 : 1.55;
      const scaleDuration = shouldReduceMotion || isTier2 ? 0.35 : 1.25;

      gsap.to(group.rotation, {
        x: 0,
        z: targetZRotation,
        duration,
        ease: "power3.out",
      });
      gsap.to(group.scale, {
        x: baseScaleFactor,
        y: baseScaleFactor,
        z: baseScaleFactor,
        duration,
        ease: "power3.out",
      });

      bubbles.forEach((bubble, index) => {
        const delay = shouldReduceMotion || isTier2 ? 0 : Math.min(index * 0.012, 0.8);
        const target = bubble.userData.originalPosition;

        gsap.to(bubble.material, {
          opacity: 1,
          duration: 0.45,
          delay,
          ease: "power2.out",
        });
        gsap.to(bubble.position, {
          x: target.x,
          y: target.y,
          z: target.z,
          duration,
          delay,
          ease: "expo.out",
        });
        gsap.to(bubble.scale, {
          x: bubble.userData.baseScale,
          y: bubble.userData.baseScale,
          duration: scaleDuration,
          delay,
          ease: shouldReduceMotion || isTier2 ? "power2.out" : "elastic.out(1, 0.7)",
        });
      });

      window.setTimeout(
        () => {
          loadingComplete = true;
        },
        shouldReduceMotion || isTier2 ? 420 : 1650,
      );
    }

    function handleCollisions() {
      const collisionCheckLimit = Math.min(bubbles.length, quality.bubbleCollisionLimit);
      for (let i = 0; i < collisionCheckLimit; i += 1) {
        const bubbleA = bubbles[i];
        const radiusA = bubbleA.userData.radius;
        const localLimit = Math.min(i + 12, bubbles.length);
        for (let j = i + 1; j < localLimit; j += 1) {
          const bubbleB = bubbles[j];
          const radiusB = bubbleB.userData.radius;
          const minDistance = (radiusA + radiusB) * 1.3;
          const distanceSquared = bubbleA.position.distanceToSquared(bubbleB.position);

          if (distanceSquared === 0 || distanceSquared >= minDistance * minDistance) continue;

          const distance = Math.sqrt(distanceSquared);
          tempVector.subVectors(bubbleB.position, bubbleA.position).normalize();
          const correction = (minDistance - distance) * 0.014;

          bubbleA.position.addScaledVector(tempVector, -correction);
          bubbleB.position.addScaledVector(tempVector, correction);
        }
      }
    }

    const timer = createThreeTimer();
    const animate = () => {
      if (!sceneIsVisible) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);
      timer.update();
      frame += 1;
      const time = performance.now() * floatSpeed;

      if (loadingComplete) {
        let intersects = [];
        if (mouse.x !== -10 && mouse.y !== -10) {
          raycaster.setFromCamera(mouse, camera);
          intersects = raycaster.intersectObjects(bubbles, false);
        }

        bubbles.forEach((bubble) => {
          const { originalPosition, velocity, floatOffset } = bubble.userData;

          if (!isTier2) {
            const targetY = originalPosition.y + Math.sin(time + floatOffset) * floatAmplitude;
            const targetX = originalPosition.x + Math.cos(time * 0.8 + floatOffset) * 0.08;
            const targetZ = originalPosition.z + Math.sin(time * 0.65 + floatOffset) * 0.12;
            velocity.x += (targetX - bubble.position.x) * returnStrength;
            velocity.y += (targetY - bubble.position.y) * returnStrength;
            velocity.z += (targetZ - bubble.position.z) * returnStrength;
          }

          const isHovered = intersects.some((hit) => hit.object === bubble);

          if (isHovered) {
            tempVector.subVectors(bubble.position, camera.position).normalize();
            if (!isTier2) {
              velocity.addScaledVector(tempVector, mouseForce);
            }
          }

          if (isHovered && !bubble.userData.hovered) {
            bubble.userData.hovered = true;
            gsap.to(bubble.scale, {
              x: bubble.userData.radius * hoverScale,
              y: bubble.userData.radius * hoverScale,
              duration: 0.35,
              ease: "power3.out",
            });
          }

          if (!isHovered && bubble.userData.hovered) {
            bubble.userData.hovered = false;
            gsap.to(bubble.scale, {
              x: bubble.userData.baseScale,
              y: bubble.userData.baseScale,
              duration: 0.55,
              ease: "power3.out",
            });
          }

          if (!isTier2) {
            velocity.multiplyScalar(damping);
            bubble.position.add(velocity);
          }
          bubble.lookAt(camera.position);
        });

        if (!isTier2 && frame % 3 === 0) {
          handleCollisions();
        }
      }
      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (animationFrameId) return;
      sceneIsVisible = true;
      animate();
    };

    const stopLoop = () => {
      sceneIsVisible = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop();
          if (entry.intersectionRatio > 0) {
            startAnimation();
          }
        } else {
          stopLoop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(wrapper);

    const onPointerMove = (event) => {
      const rect = wrapper.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      window.clearTimeout(mouseMoveTimeout);
      mouseMoveTimeout = window.setTimeout(() => {
        mouse.x = -10;
        mouse.y = -10;
      }, 160);
    };

    const onPointerLeave = () => {
      mouse.x = -10;
      mouse.y = -10;
    };

    wrapper.addEventListener("pointermove", onPointerMove, { passive: true });
    wrapper.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(getRendererPixelRatio(tier, isTier2 ? 1 : 1.6));
      renderer.render(scene, camera);
    };

    resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(wrapper);
    renderer.render(scene, camera);

    return () => {
      stopLoop();
      window.clearTimeout(mouseMoveTimeout);
      observer.disconnect();
      resizeObserver?.disconnect();
      wrapper.removeEventListener("pointermove", onPointerMove);
      wrapper.removeEventListener("pointerleave", onPointerLeave);
      gsap.killTweensOf(group.rotation);
      gsap.killTweensOf(group.scale);
      bubbles.forEach((bubble) => {
        gsap.killTweensOf(bubble.position);
        gsap.killTweensOf(bubble.scale);
        gsap.killTweensOf(bubble.material);
        bubble.material.dispose();
      });
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
    };
  }, [isTier2, quality.antialias, quality.bubbleCollisionLimit, shouldReduceMotion, tier, isMobile]);

  return (
    <section className="bubble-wrapper relative w-full pb-12 flex flex-col justify-center bg-[#0a0a0a]">
      <div ref={wrapperRef} className="bubble-scene-panel relative w-full min-h-100">
        <div className="bubble-grid" aria-hidden="true" />
        <div className="bubble-orbit bubble-orbit-one mt-10" aria-hidden="true" />
        <div className="bubble-orbit bubble-orbit-two mt-5" aria-hidden="true" />

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 34, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.4 }}
        className="bubble-content relative z-10 w-full max-w-6xl mx-auto px-6 -mt-8">
        <div className="bubble-content-inner">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            {BUBBLE_TEXT_GROUPS.map((group) => (
              <div
                key={group.summary}
                className="flex flex-col space-y-2 p-4 border border-neutral-200 bg-white shadow-[4px_4px_0px_#000000]">
                <p className="text-sm font-sans text-neutral-800 leading-relaxed font-medium">{group.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default memo(BubbleScene);
