import * as THREE from "three";

export function createThreeTimer() {
  if (typeof THREE.Timer === "function") {
    const timer = new THREE.Timer();
    return {
      update() {
        timer.update();
        return timer.getDelta();
      },
    };
  }

  let lastTime = typeof performance !== "undefined" ? performance.now() : 0;

  return {
    update() {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      return delta;
    },
  };
}