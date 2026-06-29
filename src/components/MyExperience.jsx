"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { SlDirections } from 'react-icons/sl';
import { GrPowerReset } from 'react-icons/gr';
import { FaPause, FaPlay } from 'react-icons/fa6';
import LiquidGlass from './LiquidGlass';
import "@/styles/my_experience.css";
import Image from 'next/image';

const COMPONENT_HEIGHT = '480px';
const UNIQUE_CARD_COUNT = 3;
const SCANNER_POSITION_RATIO = 0.75;

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

const education_cards = [
  "/my_experience/education/edu_sslc.svg",
  "/my_experience/education/edu_puc.svg",
  "/my_experience/education/edu_be.svg",
];

const experience_cards = [
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
];

export default function MyExperience() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [speedSetting, setSpeedSetting] = useState(120);
  const [speedUI, setSpeedUI] = useState(120);
  const [activeLog, setActiveLog] = useState('experience');
  const [isVisible, setIsVisible] = useState(false);

  const experienceAsciiCards = useMemo(() => {
    return [...Array(UNIQUE_CARD_COUNT)].map(() =>
      generateMachineCode(Math.floor(400 / 6), Math.floor(250 / 13))
    );
  }, []);

  const educationAsciiCards = useMemo(() => {
    return [...Array(UNIQUE_CARD_COUNT)].map(() =>
      generateMachineCode(Math.floor(400 / 6), Math.floor(250 / 13))
    );
  }, []);

  const duplicatedCards = useMemo(() => [...Array(UNIQUE_CARD_COUNT * 3)], []);

  const isAnimatingRef = useRef(true);
  const isVisibleRef = useRef(false);
  const containerRef = useRef(null);
  const cardLineRef = useRef(null);
  const reqRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const scannerCanvasRef = useRef(null);

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

  const handleSpeedSliderChange = (e) => {
    const val = Number(e.target.value);
    setSpeedSetting(val);
    stateRef.current.baseSpeed = val;
    if (!stateRef.current.isDragging) {
      stateRef.current.velocity = val;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const animate = useCallback(() => {
    if (!isVisibleRef.current) return;

    const s = stateRef.current;
    const currentTime = performance.now();

    if (s.lastTime === 0 || currentTime - s.lastTime > 1000) {
      s.lastTime = currentTime;
    }
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
      // Calculated alignment shifted specifically to the right side
      const scannerX = containerRect.left + (containerRect.width * SCANNER_POSITION_RATIO);
      const cards = cardLineRef.current.children;

      for (let i = 0; i < cards.length; i++) {
        const cardEl = cards[i];
        const rect = cardEl.getBoundingClientRect();
        let pct = ((scannerX - rect.left) / rect.width) * 100;
        pct = Math.max(0, Math.min(100, pct));

        cardEl.style.setProperty('--clip-right', `${100 - pct}%`);
        cardEl.style.setProperty('--clip-left', `${pct}%`);
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
        stateRef.current.singleLoopWidth = (cardWidth + cardGap) * UNIQUE_CARD_COUNT;

        if (!stateRef.current.hasInitializedPosition) {
          stateRef.current.position = 0;
          stateRef.current.hasInitializedPosition = true;
        }
      }
    };

    handleLayoutCalculations();
    window.addEventListener('resize', handleLayoutCalculations);

    if (isVisible) {
      stateRef.current.lastTime = performance.now();
      reqRef.current = requestAnimationFrame(animate);
    } else {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleLayoutCalculations);
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, [animate, isVisible]);

  useEffect(() => {
    let particleSystem, particleScanner;

    class ParticleSystem {
      constructor(canvas) {
        this.canvas = canvas;
        this.particleCount = 400;
        this.particles = [];
        this.running = false;
        this.rafId = null;
        this.ctx = this.canvas.getContext('2d');
      }
      init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = 250;
        if (this.particles.length === 0) {
          for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.getSpawnProperties(true));
          }
        }
      }
      start() {
        if (this.running) return;
        this.running = true;
        this.init();
        this.animate();
      }
      stop() {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
      }
      getSpawnProperties(isInitial = false) {
        const midPoint = this.canvas.width * SCANNER_POSITION_RATIO;
        let xCoord;
        if (Math.random() < 0.80) {
          xCoord = isInitial ? Math.random() * midPoint : Math.random() * 120;
        } else {
          xCoord = isInitial ? midPoint + Math.random() * (this.canvas.width - midPoint) : midPoint + Math.random() * (this.canvas.width - midPoint);
        }
        return {
          x: Math.floor(xCoord),
          y: Math.floor(Math.random() * this.canvas.height),
          baseVx: (Math.random() - 0.7) * 1.8,
          baseVy: (Math.random() - 0.5) * 0.4,
          size: Math.floor(Math.random() * 5) + 2,
          alpha: Math.random() * 0.35 + 0.15
        };
      }
      animate() {
        if (!this.running) return;
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
          this.ctx.fillStyle = '#000000';
          this.ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        });
        this.rafId = requestAnimationFrame(() => this.animate());
      }
    }

    class ParticleScanner {
      constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.w = window.innerWidth;
        this.h = 320;
        this.particles = [];
        this.maxParticles = 1500;
        this.running = false;
        this.rafId = null;
      }
      start() {
        if (this.running) return;
        this.running = true;
        this.w = window.innerWidth;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.animate();
      }
      stop() {
        this.running = false;
        if (this.rafId) cancelAnimationFrame(this.rafId);
      }
      createParticle() {
        const isWhite = Math.random() > 0.45;
        const explodeLeft = Math.random() < 0.75;
        const lightBarX = this.w * SCANNER_POSITION_RATIO;
        return {
          x: lightBarX + (Math.random() - 0.5) * 10,
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
        if (!this.running) return;
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

        if (visualVelocity > 0) {
          const dynamicSpawnRate = stateRef.current.isDragging ? 24 : 14;
          for (let k = 0; k < dynamicSpawnRate; k++) {
            if (this.particles.length < this.maxParticles) {
              this.particles.push(this.createParticle());
            }
          }
        }
        this.rafId = requestAnimationFrame(() => this.animate());
      }
    }

    if (particleCanvasRef.current) particleSystem = new ParticleSystem(particleCanvasRef.current);
    if (scannerCanvasRef.current) particleScanner = new ParticleScanner(scannerCanvasRef.current);

    const handleResize = () => {
      if (particleSystem?.running) particleSystem.init();
      if (particleScanner?.running) {
        particleScanner.w = window.innerWidth;
        particleScanner.canvas.width = window.innerWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    if (isVisible) {
      if (particleSystem) particleSystem.start();
      if (particleScanner) particleScanner.start();
    } else {
      if (particleSystem) particleSystem.stop();
      if (particleScanner) particleScanner.stop();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (particleSystem) particleSystem.stop();
      if (particleScanner) particleScanner.stop();
    };
  }, [isVisible]);

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

  const toggleLogSource = () => {
    setActiveLog(prev => prev === 'experience' ? 'education' : 'experience');
  };

  return (
    <div className="experience-wrapper" style={{ height: `${COMPONENT_HEIGHT}` }}>
      <div className="controls">
        <LiquidGlass width="65px" height="40px" padding="p-0">
          <button className="flex items-center justify-center w-full h-full text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700 pb-6" onClick={toggleAnimation}>
            <span className="animate-pulse-slow">
              {isAnimating ? <FaPause /> : <FaPlay />}
            </span>
          </button>
        </LiquidGlass>

        <LiquidGlass width="65px" height="40px" padding="p-0">
          <button className="flex items-center justify-center w-full h-full text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700 pb-6" onClick={resetPosition}>
            <span className="animate-pulse-slow"> <GrPowerReset size={18} /> </span>
          </button>
        </LiquidGlass>

        <LiquidGlass width="65px" height="40px" padding="p-0">
          <button className="flex items-center justify-center w-full h-full text-sm font-medium tracking-wide text-zinc-500 transition-colors duration-200 hover:text-zinc-700 pb-6" onClick={changeDirection}>
            <span className="animate-pulse-slow"> <SlDirections size={18} /> </span>
          </button>
        </LiquidGlass>

        <div className="slider-container w-full h-full flex items-center justify-center pb-6">
          <span> Speed: </span>
          <input type="range" min="30" max="150" value={speedSetting} onChange={handleSpeedSliderChange} />
          <span> {speedSetting} px/s </span>
        </div>

        <LiquidGlass width="200px" height="40px" padding="p-0">
          <button className="flex items-center justify-center w-full h-full text-xs font-bold tracking-wider text-zinc-600 transition-colors duration-200 hover:text-zinc-900 uppercase pb-6" onClick={toggleLogSource}>
            <span>{activeLog === 'experience' ? 'Work Experience' : 'Education Log'}</span>
          </button>
        </LiquidGlass>
      </div>

      <div className="speed-indicator">
        Velocity: <span>{speedUI}</span> px/s
      </div>

      <div className="container" ref={containerRef}>
        <canvas id="particleCanvas" ref={particleCanvasRef} style={{ mixBlendMode: 'multiply' }} />
        <canvas id="scannerCanvas" ref={scannerCanvasRef} style={{ mixBlendMode: 'normal' }} />

        <div
          className="scanner-glow-container"
          style={{
            left: `${SCANNER_POSITION_RATIO * 100}%`,
            transform: 'translate(-50%, -50%)',
            position: 'absolute'
          }}
        >
          <div className="glossy-reflection" />
          <div className="scanner-core" />
        </div>

        <div className="card-stream">
          <div className="card-line" ref={cardLineRef}
            onMouseDown={(e) => handleDragStart(e.clientX)}
            onMouseMove={(e) => handleDragMove(e.clientX)}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
            onTouchEnd={handleDragEnd}
            onWheel={handleWheel}>

            {duplicatedCards.map((_, idx) => {
              const currentCardIndex = idx % UNIQUE_CARD_COUNT;
              return (
                <div key={idx} className="card-wrapper">
                  <div className="card card-normal">
                    <Image
                      src={experience_cards[currentCardIndex]}
                      className={`card-image transition-opacity duration-500 ${activeLog === 'experience' ? 'opacity-100 style-visible' : 'opacity-0 absolute hidden-layer'}`}
                      alt="Experience Stream View"
                      fill
                      sizes="400px"
                      priority={idx < UNIQUE_CARD_COUNT}
                      style={{ objectFit: 'cover' }}
                    />

                    <Image
                      src={education_cards[currentCardIndex]}
                      className={`card-image transition-opacity duration-500 ${activeLog === 'education' ? 'opacity-100 style-visible' : 'opacity-0 absolute hidden-layer'}`}
                      alt="Education Stream View"
                      fill
                      sizes="400px"
                      priority={idx < UNIQUE_CARD_COUNT}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>

                  <div className="card card-ascii">
                    <div className={`ascii-content transition-opacity duration-500 ${activeLog === 'experience' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                      {experienceAsciiCards[currentCardIndex]}
                    </div>
                    <div className={`ascii-content transition-opacity duration-500 ${activeLog === 'education' ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'}`}>
                      {educationAsciiCards[currentCardIndex]}
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