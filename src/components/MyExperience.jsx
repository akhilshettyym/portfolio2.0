"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

const COMPONENT_HEIGHT = '480px';
const UNIQUE_CARD_COUNT = 5;

const generateMachineCode = (width, height) => {
  const hexChars = "0123456789ABCDEF";
  const statusTokens = ["[READY]", "[SYSTEM_A]", "[EXECUTE]", "[LOAD_MEM]", "0xFF", "0x00", "0x7A", "[SECURE]", "::", "||"];

  let output = "";
  for (let row = 0; row < height; row++) {
    let line = "";
    while (line.length < width) {
      const distribution = Math.random();

      if (distribution < 0.45) {
        for (let b = 0; b < 6; b++) line += Math.random() > 0.5 ? "1" : "0";
        line += " ";
      } else if (distribution < 0.75) {
        line += hexChars[Math.floor(Math.random() * 16)];
        line += hexChars[Math.floor(Math.random() * 16)];
        line += " ";
      } else if (distribution < 0.92) {
        line += statusTokens[Math.floor(Math.random() * statusTokens.length)] + " ";
      } else {
        line += "   ";
      }
    }
    output += line.slice(0, width) + (row < height - 1 ? "\n" : "");
  }
  return output;
};

const cardImages = [
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
];

export default function EvervaultScanner() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [speedSetting, setSpeedSetting] = useState(120);
  const [speedUI, setSpeedUI] = useState(120);

  // Generate unique ASCII maps only for the baseline count
  const asciiCards = useMemo(() => {
    return [...Array(UNIQUE_CARD_COUNT)].map(() =>
      generateMachineCode(Math.floor(400 / 6), Math.floor(250 / 13))
    );
  }, []);

  const isAnimatingRef = useRef(true);
  const stateRef = useRef({
    position: 0,
    velocity: 120,
    baseSpeed: 120,
    direction: -1,
    isDragging: false,
    lastTime: typeof performance !== 'undefined' ? performance.now() : 0,
    lastMouseX: 0,
    mouseVelocity: 0,
    containerWidth: 0,
    singleLoopWidth: 0,
    hasInitializedPosition: false,
    lastSpeedUI: 120
  });

  const containerRef = useRef(null);
  const cardLineRef = useRef(null);
  const reqRef = useRef(null);

  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);

  const handleSpeedSliderChange = (e) => {
    const val = Number(e.target.value);
    setSpeedSetting(val);
    stateRef.current.baseSpeed = val;
    if (!stateRef.current.isDragging) {
      stateRef.current.velocity = val;
    }
  };

  const animate = useCallback(() => {
    const s = stateRef.current;
    const currentTime = performance.now();
    const deltaTime = (currentTime - s.lastTime) / 1000;
    s.lastTime = currentTime;

    if (isAnimatingRef.current && !s.isDragging) {
      if (s.velocity > s.baseSpeed) {
        s.velocity *= 0.95;
        if (s.velocity < s.baseSpeed) s.velocity = s.baseSpeed;
      } else {
        s.velocity = s.baseSpeed;
      }

      s.position += s.velocity * s.direction * deltaTime;

      // Clean modulo boundary resets for a seamless loop
      if (s.singleLoopWidth > 0) {
        if (s.position <= -s.singleLoopWidth) {
          s.position += s.singleLoopWidth;
        } else if (s.position >= 0) {
          s.position -= s.singleLoopWidth;
        }
      }

      const currentSpeed = Math.round(s.velocity);
      if (currentSpeed !== s.lastSpeedUI) {
        setSpeedUI(currentSpeed);
        s.lastSpeedUI = currentSpeed;
      }
    } else if (!isAnimatingRef.current && !s.isDragging) {
      if (s.lastSpeedUI !== 0) {
        setSpeedUI(0);
        s.lastSpeedUI = 0;
      }
    }

    if (cardLineRef.current && containerRef.current) {
      cardLineRef.current.style.transform = `translateX(${s.position}px)`;

      const containerRect = containerRef.current.getBoundingClientRect();
      const center = containerRect.left + (containerRect.width / 2);
      const cards = cardLineRef.current.children;

      for (let i = 0; i < cards.length; i++) {
        const rect = cards[i].getBoundingClientRect();
        let pct = ((center - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));

        cards[i].style.setProperty('--clip-right', `${100 - pct}%`);
        cards[i].style.setProperty('--clip-left', `${pct}%`);
      }
    }

    reqRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const handleLayoutCalculations = () => {
      if (containerRef.current && cardLineRef.current) {
        stateRef.current.containerWidth = containerRef.current.offsetWidth;
        const cardWidth = 400;
        const cardGap = 60;

        // singleLoopWidth represents exactly one full cycle width
        stateRef.current.singleLoopWidth = (cardWidth + cardGap) * UNIQUE_CARD_COUNT;

        if (!stateRef.current.hasInitializedPosition) {
          stateRef.current.position = 0;
          stateRef.current.hasInitializedPosition = true;
        }
      }
    };

    handleLayoutCalculations();
    window.addEventListener('resize', handleLayoutCalculations);
    reqRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleLayoutCalculations);
      cancelAnimationFrame(reqRef.current);
    };
  }, [animate]);

  // Particle Engines
  useEffect(() => {
    let particleSystem, particleScanner;

    class ParticleSystem {
      constructor(canvas) {
        this.canvas = canvas;
        this.particleCount = 400;
        this.init();
      }
      init() {
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = 250;
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
          this.particles.push(this.getSpawnProperties(true));
        }
        this.animate();
      }
      getSpawnProperties(isInitial = false) {
        const midPoint = this.canvas.width / 2;
        let xCoord;

        // 80% distribution clustering on the binary side (left side of screen)
        if (Math.random() < 0.80) {
          xCoord = isInitial ? Math.random() * midPoint : Math.random() * 120;
        } else {
          xCoord = isInitial ? midPoint + Math.random() * midPoint : midPoint + Math.random() * midPoint;
        }

        return {
          x: Math.floor(xCoord),
          y: Math.floor(Math.random() * this.canvas.height),
          baseVx: (Math.random() - 0.7) * 1.8,
          baseVy: (Math.random() - 0.5) * 0.4,
          size: Math.floor(Math.random() * 5) + 2, // Crisper square boundaries
          alpha: Math.random() * 0.35 + 0.15
        };
      }
      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let visualVelocity = stateRef.current.velocity;
        if (!isAnimatingRef.current && !stateRef.current.isDragging) {
          visualVelocity = 0;
        } else if (stateRef.current.isDragging) {
          visualVelocity = Math.abs(stateRef.current.mouseVelocity / 45);
        }

        const speedFactor = visualVelocity / 120;

        this.particles.forEach((p, index) => {
          p.x += p.baseVx * speedFactor;
          p.y += p.baseVy * speedFactor;

          if (p.x < -10 || p.x > this.canvas.width + 10 || p.y < -10 || p.y > this.canvas.height + 10) {
            this.particles[index] = this.getSpawnProperties(false);
          }

          this.ctx.globalAlpha = p.alpha;
          this.ctx.fillStyle = '#000000'; // Pure crisp black ambient squares
          this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        });
        requestAnimationFrame(() => this.animate());
      }
    }

    class ParticleScanner {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = window.innerWidth;
        this.h = 320;
        this.particles = [];
        this.maxParticles = 1500; // Increased capacity for high density
        this.lightBarX = this.w / 2;
        this.setup();
      }
      setup() {
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.animate();
      }
      createParticle() {
        const isWhite = Math.random() > 0.45; // High-contrast mix of black and white micro-fragments
        const explodeLeft = Math.random() < 0.75; // Heavily scattering towards the binary side
        return {
          x: this.lightBarX + (Math.random() - 0.5) * 10,
          y: Math.random() * this.h,
          vx: explodeLeft ? -(Math.random() * 6.0 + 2.0) : (Math.random() * 3.5 + 0.5),
          vy: (Math.random() - 0.5) * 5.0,
          size: Math.floor(Math.random() * 4) + 1.5,
          color: isWhite ? '#ffffff' : '#000000',
          alpha: Math.random() * 0.9 + 0.1,
          life: 1.0,
          decay: Math.random() * 0.04 + 0.02
        };
      }
      animate() {
        this.ctx.clearRect(0, 0, this.w, this.h);

        let visualVelocity = stateRef.current.velocity;
        if (!isAnimatingRef.current && !stateRef.current.isDragging) visualVelocity = 0;
        const speedFactor = Math.max(0.1, visualVelocity / 120);

        for (let i = 0; i < this.particles.length; i++) {
          const p = this.particles[i];
          if (!p) continue;

          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor;
          p.life -= p.decay * (speedFactor * 0.4 + 0.6);
          p.alpha = p.life;

          if (p.life <= 0 || p.x < -20 || p.x > this.w + 20) {
            if (visualVelocity > 0 && this.particles.length <= this.maxParticles) {
              this.particles[i] = this.createParticle();
            } else {
              this.particles.splice(i, 1);
              i--;
            }
            continue;
          }

          this.ctx.globalAlpha = Math.max(0, p.alpha);
          this.ctx.fillStyle = p.color;
          this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        }

        // Intense spawning rate tied directly to current speed setting
        if (visualVelocity > 0) {
          const dynamicSpawnRate = stateRef.current.isDragging ? 24 : 14;
          for (let k = 0; k < dynamicSpawnRate; k++) {
            if (this.particles.length < this.maxParticles) {
              this.particles.push(this.createParticle());
            }
          }
        }

        requestAnimationFrame(() => this.animate());
      }
    }

    if (particleCanvasRef.current) {
      particleSystem = new ParticleSystem(particleCanvasRef.current);
    }
    if (scannerCanvasRef.current) {
      particleScanner = new ParticleScanner(scannerCanvasRef.current);
    }

    return () => { };
  }, []);

  const handleDragStart = (clientX) => {
    stateRef.current.isDragging = true;
    stateRef.current.lastMouseX = clientX;
    stateRef.current.mouseVelocity = 0;
    if (cardLineRef.current) cardLineRef.current.style.cursor = 'grabbing';
  };

  const handleDragMove = (clientX) => {
    if (!stateRef.current.isDragging) return;
    const deltaX = clientX - stateRef.current.lastMouseX;
    stateRef.current.position += deltaX;
    stateRef.current.mouseVelocity = deltaX * 60;
    stateRef.current.lastMouseX = clientX;
  };

  const handleDragEnd = () => {
    if (!stateRef.current.isDragging) return;
    stateRef.current.isDragging = false;
    if (cardLineRef.current) cardLineRef.current.style.cursor = 'grab';

    if (Math.abs(stateRef.current.mouseVelocity) > stateRef.current.baseSpeed) {
      stateRef.current.velocity = Math.abs(stateRef.current.mouseVelocity);
      stateRef.current.direction = stateRef.current.mouseVelocity > 0 ? 1 : -1;
    } else {
      stateRef.current.velocity = stateRef.current.baseSpeed;
    }
  };

  const handleWheel = (e) => {
    const scrollSpeed = 20;
    const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;
    stateRef.current.position += delta;
  };

  const toggleAnimation = () => {
    const nextState = !isAnimating;
    setIsAnimating(nextState);
    isAnimatingRef.current = nextState;
  };

  const resetPosition = () => {
    stateRef.current.position = 0;
    stateRef.current.velocity = stateRef.current.baseSpeed;
    stateRef.current.direction = -1;
    setIsAnimating(true);
    isAnimatingRef.current = true;
  };

  const changeDirection = () => {
    stateRef.current.direction *= -1;
  };

  // Duplicate loop array to create a completely seamless marquee layout buffer
  const duplicatedCards = [...Array(UNIQUE_CARD_COUNT * 3)];

  return (
    <div className="evervault-wrapper">
      <style>{`
        .evervault-wrapper {
          background: #ffffff;
          height: ${COMPONENT_HEIGHT};
          width: 100%;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          position: relative;
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .controls {
          position: absolute; top: 20px; left: 20px;
          display: flex; align-items: center; gap: 12px; z-index: 100;
        }
        .control-btn {
          padding: 8px 16px;
          background: #000000;
          border: 1px solid #000000; border-radius: 20px;
          color: #ffffff; font-weight: 600;
          cursor: pointer; 
          transition: all 0.2s ease; font-size: 13px;
        }
        .control-btn:hover {
          background: #333333;
          border-color: #333333;
          transform: translateY(-1px);
        }
        .slider-container {
          display: flex; align-items: center; gap: 10px;
          background: rgba(0, 0, 0, 0.05); padding: 6px 14px;
          border-radius: 20px; font-size: 13px; color: #000000;
          font-weight: 600; border: 1px solid rgba(0, 0, 0, 0.1);
        }
        .slider-container input[type="range"] {
          accent-color: #000000; cursor: pointer; width: 90px;
        }
        .speed-indicator {
          position: absolute; top: 20px; right: 20px;
          color: #000000; font-size: 13px; font-weight: 700;
          background: rgba(255, 255, 255, 0.9); padding: 8px 16px;
          border-radius: 20px; z-index: 100;
          letter-spacing: -0.2px; border: 1px solid #000000;
        }
        .container {
          position: relative; width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }
        .card-stream {
          position: absolute; width: 100%; height: 250px;
          display: flex; align-items: center; overflow: visible;
          z-index: 5;
        }
        .card-line {
          display: flex; align-items: center; gap: 60px;
          white-space: nowrap; cursor: grab; user-select: none;
          will-change: transform;
        }
        .card-wrapper {
          position: relative; width: 400px; height: 250px; flex-shrink: 0;
        }
        .card {
          position: absolute; top: 0; left: 0;
          width: 400px; height: 250px; border-radius: 16px; overflow: hidden;
        }
        .card-normal {
          background: transparent; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.15);
          z-index: 2; position: relative;
          clip-path: inset(0 var(--clip-right, 0%) 0 0);
        }
        .card-image {
          width: 100%; height: 100%; object-fit: cover; border-radius: 16px;
        }
        .card-ascii {
          background: #000000; z-index: 1; position: absolute;
          clip-path: inset(0 0 0 var(--clip-left, 0%));
          border: 1px solid #000000; border-radius: 16px;
        }
        .ascii-content {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          color: #ffffff;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 11px; line-height: 14px;
          padding: 12px; box-sizing: border-box;
          overflow: hidden; white-space: pre;
          letter-spacing: 0.5px;
          animation: terminal-flicker 0.15s infinite linear alternate-reverse;
          -webkit-mask-image: linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.15) 100%);
        }
        @keyframes terminal-flicker {
          0% { opacity: 0.92; } 100% { opacity: 1; }
        }
        
        /* High-Contrast Glossy Shredder Laser & Glow Alignment */
        .scanner-glow-container {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 60px; height: 80%;
          pointer-events: none; z-index: 10;
          display: flex; align-items: center; justify-content: center;
        }
        .glossy-reflection {
          position: absolute;
          width: 100%; height: 100%;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.35) 45%, rgba(0,0,0,0.25) 50%, rgba(255,255,255,0.35) 55%, transparent);
          mix-blend-mode: overlay;
        }
        .scanner-core {
          width: 3px; height: 100%; border-radius: 4px;
          background: linear-gradient(to bottom, transparent, #000000 15%, #ffffff 50%, #000000 85%, transparent);
          box-shadow: 
            0 0 12px rgba(255, 255, 255, 1),
            0 0 24px rgba(255, 255, 255, 0.8),
            0 0 40px rgba(255, 255, 255, 0.4);
        }

        #particleCanvas, #scannerCanvas {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          width: 100%;
          height: 250px;
          z-index: 1;
          pointer-events: none;
        }
        #scannerCanvas {
          z-index: 6; 
          height: 320px;
        }
      `}</style>

      <div className="controls">
        <button className="control-btn" onClick={toggleAnimation}>
          {isAnimating ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button className="control-btn" onClick={resetPosition}>🔄 Reset</button>
        <button className="control-btn" onClick={changeDirection}>↔️ Direction</button>

        <div className="slider-container">
          <span>Speed:</span>
          <input
            type="range"
            min="30"
            max="150"
            value={speedSetting}
            onChange={handleSpeedSliderChange}
          />
          <span>{speedSetting}px/s</span>
        </div>
      </div>

      <div className="speed-indicator">
        Live Stream: <span>{speedUI}</span> px/s
      </div>

      <div className="container" ref={containerRef}>
        <canvas id="particleCanvas" ref={particleCanvasRef} style={{ mixBlendMode: 'multiply' }} />
        <canvas id="scannerCanvas" ref={scannerCanvasRef} style={{ mixBlendMode: 'normal' }} />

        <div className="scanner-glow-container">
          <div className="glossy-reflection"></div>
          <div className="scanner-core"></div>
        </div>

        <div className="card-stream">
          <div
            className="card-line"
            ref={cardLineRef}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onWheel={handleWheel}
          >
            {duplicatedCards.map((_, idx) => {
              const currentCardIndex = idx % UNIQUE_CARD_COUNT;
              return (
                <div key={idx} className="card-wrapper">
                  <div className="card card-normal">
                    <img
                      src={cardImages[currentCardIndex]}
                      className="card-image"
                      alt="Evervault Stream View"
                    />
                  </div>
                  <div className="card card-ascii">
                    <div className="ascii-content">
                      {asciiCards[currentCardIndex]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}