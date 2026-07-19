"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { usePerformanceTier } from "@/hooks/usePerformanceTier";
import { getQualityPreset } from "@/lib/performance/applyQualityTier";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";

const trailImages = [
  "/bubbles/bubbles.docker.svg",
  "/bubbles/bubbles.github.svg",
  "/bubbles/bubbles.kubernetes.svg",
  "/bubbles/bubbles.salesforce.svg",
  "/bubbles/bubbles.vscode.svg",
];

export default function MySocials() {
  const [trail, setTrail] = useState([]);
  const lastPosition = useRef({ x: 0, y: 0 });
  const imageIndex = useRef(0);
  const timeouts = useRef(new Set());

  const shouldReduceMotion = useReducedMotion();
  const { tier } = usePerformanceTier();
  const quality = getQualityPreset(tier);

  // Motion values for mouse tracking parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs to prevent jerky movement when the mouse darts around
  const globeRotateX = useSpring(mouseY, { stiffness: 60, damping: 15 });
  const globeRotateY = useSpring(mouseX, { stiffness: 60, damping: 15 });

  // Cleanup timeouts to prevent memory leaks if component unmounts
  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => clearTimeout(id));
      timeouts.current.clear();
    };
  }, []);

  const handleMouseMove = useCallback(
    (event) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 1. Handle Globe 3D Parallax Tilt Calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Limits tilt angle to max ~15 degrees
      mouseX.set(((x - centerX) / centerX) * 15);
      mouseY.set(((y - centerY) / centerY) * -15);

      // 2. Handle Mouse Trail Bubbles
      if (shouldReduceMotion) return;
      const distance = Math.hypot(
        x - lastPosition.current.x,
        y - lastPosition.current.y
      );
      if (distance < quality.socialTrailDistance) return;

      lastPosition.current = { x, y };

      // Generate a robust unique key
      const uniqueId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`;

      const nextItem = {
        id: uniqueId,
        x,
        y,
        src: trailImages[imageIndex.current],
        zIndex: 20 + (imageIndex.current % 10),
      };

      imageIndex.current = (imageIndex.current + 1) % trailImages.length;
      
      // Slice keeps the array bounds tight before pushing the next item
      setTrail((prev) => [...prev.slice(-4), nextItem]);

      const timeoutId = setTimeout(() => {
        setTrail((prev) => prev.filter((item) => item.id !== nextItem.id));
        timeouts.current.delete(timeoutId);
      }, quality.socialTrailLifeMs);

      timeouts.current.add(timeoutId);
    },
    [mouseX, mouseY, quality, shouldReduceMotion]
  );

  // Reset the globe back to center when mouse leaves the section
  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 80, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-[72vh] overflow-hidden bg-white px-5 py-18 text-black md:min-h-screen md:px-10"
      style={{ perspective: "1200px" }}
    >
      {/* Background patterns */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.035)_1px,transparent_1px)] bg-size-[25px_25px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-black/15" />

      {/* Rotating & Reacting Globe Background Container */}
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <motion.div
          style={{
            rotateX: globeRotateX,
            rotateY: globeRotateY,
            transformStyle: "preserve-3d",
          }}
          animate={{ rotateZ: [0, 360] }}
          transition={{
            rotateZ: {
              repeat: Infinity,
              duration: 35,
              ease: "linear",
            },
          }}
          className="flex h-150 w-100 items-center justify-center"
        >
          <GlobeSVG />
        </motion.div>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex min-h-[56vh] w-full max-w-6xl flex-col justify-center gap-10 md:min-h-[78vh]">
        <div className="pointer-events-auto relative text-center mix-blend-difference">
          <div className="text-xs uppercase tracking-[0.32em] text-black/40">
            network nodes
          </div>
          <h2 className="mt-3 text-[clamp(2.6rem,7vw,4rem)] font-black uppercase leading-[0.88] tracking-normal">
            Socials
          </h2>
          <h1 className="mt-4 text-3xl font-bold uppercase text-black/20 mix-blend-difference md:text-5xl">
            Some Visuals <br />
            to get an idea
          </h1>
        </div>
      </div>

      {/* Mouse Trail layer */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ zIndex: 20, top: "10.5%", height: "75%" }}
      >
        <AnimatePresence>
          {trail.map((item) => (
            <motion.img
              key={item.id}
              src={item.src}
              alt="Decorative network node"
              initial={{
                opacity: 0,
                scale: 0.2,
                x: item.x - 96,
                y: item.y - 96,
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute h-35 w-35 rounded-lg object-cover"
              style={{ zIndex: item.zIndex }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

// Extracted SVG Component
const GlobeSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1000 1000" width="1000" height="1000" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', transform: 'translate3d(0px, 0px, 0px)', contentVisibility: 'visible' }}>
    <defs>
      <clipPath id="__lottie_element_2"><rect width="1000" height="1000" x="0" y="0"></rect></clipPath>
      <g id="__lottie_element_6">
        <g transform="matrix(1,0,0,1,500,500)" opacity="1" style={{ display: 'block' }}>
          <g opacity="1" transform="matrix(1,0,0,1,0,0)">
            <path fill="#000000" fillOpacity="1" d=" M317.5,0 C317.5,175.35000610351562 175.35000610351562,317.5 0,317.5 C-175.35000610351562,317.5 -317.5,175.35000610351562 -317.5,0 C-317.5,-175.35000610351562 -175.35000610351562,-317.5 0,-317.5 C175.35000610351562,-317.5 317.5,-175.35000610351562 317.5,0z"></path>
          </g>
        </g>
      </g>
      <clipPath id="__lottie_element_10"><path d="M0,0 L1000,0 L1000,1000 L0,1000z"></path></clipPath>
      <mask id="__lottie_element_6_1" maskType="alpha"><use xlinkHref="#__lottie_element_6"></use></mask>
    </defs>
    <g clipPath="url(#__lottie_element_2)">
      <g mask="url(#__lottie_element_6_1)" style={{ display: 'block' }}>
        <g clipPath="url(#__lottie_element_10)" transform="matrix(1,0,0,1,0,0)" opacity="1">
          <g transform="matrix(1,0,0,1,367.5849914550781,542.89599609375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M88.0479965209961,-319.10400390625 C88.0479965209961,-319.10400390625 -138.8518524169922,-297.95703125 -189.9392852783203,-81.04444122314453"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,367.5849914550781,542.89599609375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M88.0479965209961,-319.10400390625 C88.0479965209961,-319.10400390625 -138.99757385253906,-297.92059326171875 -189.94383239746094,-80.75300598144531"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,374.1700134277344,543.5969848632812)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M81.41500091552734,-318.40301513671875 C81.41500091552734,-318.40301513671875 -139.94119262695312,-274.7831726074219 -185.7341766357422,-59.193241119384766 C-185.7341766357422,-59.193241119384766 -271.2674560546875,297.9576416015625 193.70431518554688,319.5687561035156"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,386.5769958496094,544.0900268554688)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M69.56786346435547,-318.5406799316406 C69.56786346435547,-318.5406799316406 -134.0738067626953,-258.501220703125 -175.20425415039062,-28.547679901123047 C-175.20425415039062,-28.547679901123047 -241.01870727539062,298.0839538574219 181.8802032470703,318.7843322753906"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,407.1369934082031,542.8699951171875)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M49.72800064086914,-318.9497985839844 C49.72800064086914,-318.9497985839844 -128.76173400878906,-229.72650146484375 -156.4542999267578,-0.5244005918502808 C-156.4542999267578,-0.5244005918502808 -197.99583435058594,310.7046813964844 161.72093200683594,319.8586120605469"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,433.5429992675781,543.60400390625)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M22.04199981689453,-318.4110107421875 C22.04199981689453,-318.4110107421875 -117.82221221923828,-221.45687866210938 -131.11904907226562,17.838123321533203 C-131.11904907226562,17.838123321533203 -146.2196807861328,321.93426513671875 135.64279174804688,318.8331604003906"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,463.3689880371094,543.5969848632812)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-7.7829999923706055,-318.40301513671875 C-7.7829999923706055,-318.40301513671875 -82.2529067993164,-227.60948181152344 -99.34487915039062,-32.58599853515625 C-104.60186767578125,27.671358108520508 -99.07406616210938,88.25302124023438 -81.52242279052734,146.3979949951172 C-57.2186164855957,226.924560546875 -5.328422546386719,319.49835205078125 105.8167953491211,318.40301513671875"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,494.2799987792969,544.208984375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M72.72000122070312,317.7909851074219 C-36.14793395996094,317.8447265625 -65.45030212402344,30.42824363708496 -65.45030212402344,30.42824363708496 C-85.74430847167969,-187.61630249023438 -38.95199966430664,-317.7919921875 -38.95199966430664,-317.7919921875"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,511.2929992675781,543.5969848632812)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-55.707000732421875,-318.40301513671875 C-55.707000732421875,-318.40301513671875 -36.982635498046875,-104.53521728515625 -15.641036987304688,25.537872314453125 C-15.641036987304688,25.537872314453125 20.28533172607422,308.536865234375 55.707000732421875,318.40301513671875"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,521.1380004882812,543.5150146484375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-64.9540023803711,-318.4849853515625 C-64.9540023803711,-318.4849853515625 -4.363065242767334,-202.74368286132812 43.671592712402344,12.070540428161621 C43.671592712402344,12.070540428161621 95.35108184814453,272.0760803222656 45.86199951171875,318.4849853515625"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,555.7509765625,542.9400024414062)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-100.7490005493164,-319.05999755859375 C-100.7490005493164,-319.05999755859375 3.262550115585327,-241.06011962890625 75.51994323730469,-8.908533096313477 C75.51994323730469,-8.908533096313477 168.86376953125,274.1938781738281 11.24899959564209,319.05999755859375"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,587.0780029296875,542.89599609375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-131.4219970703125,-319.10400390625 C-131.4219970703125,-319.10400390625 14.175514221191406,-258.5220947265625 104.24346923828125,-37.793617248535156 C104.24346923828125,-37.793617248535156 222.95388793945312,235.63861083984375 -20.077999114990234,319.10400390625"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,612.3049926757812,543.5150146484375)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-156.12100219726562,-318.4849853515625 C-156.12100219726562,-318.4849853515625 28.94504165649414,-283.4451599121094 125.99931335449219,-71.55612182617188 C125.99931335449219,-71.55612182617188 266.47186279296875,210.56605529785156 -45.30500030517578,318.4849853515625"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,631.43798828125,542.9400024414062)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-176.43600463867188,-319.05999755859375 C-176.43600463867188,-319.05999755859375 29.11941909790039,-308.3442687988281 139.29833984375,-106.37210845947266 C139.29833984375,-106.37210845947266 307.79241943359375,202.26673889160156 -64.43800354003906,319.05999755859375"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,638.7160034179688,356.20098876953125)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-183.08299255371094,-132.4080047607422 C-183.08299255371094,-132.4080047607422 107.86688232421875,-151.1754150390625 187.66587829589844,142.15670776367188"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,615.85302734375,281.1319885253906)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-160.48899841308594,-57.323001861572266 C-160.48899841308594,-57.323001861572266 55.48306655883789,-102.95071411132812 181.32415771484375,88.515625"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,571.448974609375,228.83700561523438)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-116.14199829101562,-5.019999980926514 C-116.14199829101562,-5.019999980926514 43.621124267578125,-56.61933135986328 159.68479919433594,47.93465042114258"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,534.1640014648438,211.8820037841797)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-78.85600280761719,11.9350004196167 C-78.85600280761719,11.9350004196167 16.05776596069336,-34.84648132324219 115.34393310546875,2.370319128036499"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,507.95098876953125,206.7310028076172)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-52.89899826049805,17.135000228881836 C-52.89899826049805,17.135000228881836 10.534882545471191,-26.287521362304688 80.11637115478516,-17.028213500976562"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,489.0090026855469,204.27999877929688)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-33.70100021362305,19.53700065612793 C-33.70100021362305,19.53700065612793 11.569796562194824,-27.40211296081543 69.52980041503906,-25.847320556640625"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,473.5050048828125,204.0070037841797)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-18.50200080871582,19.87299919128418 C-18.50200080871582,19.87299919128418 4.009798049926758,-17.445615768432617 32.30778121948242,-28.783292770385742"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,465.7760009765625,195.68299865722656)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M-10.723999977111816,28.183000564575195 C-10.723999977111816,28.183000564575195 -7.567439556121826,-7.091925144195557 8.902501106262207,-28.183000564575195"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,431.3349914550781,189.51100158691406)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M23.667999267578125,34.36899948120117 C23.667999267578125,34.36899948120117 15.409078598022461,-15.728668212890625 -25.03412437438965,-33.29887008666992"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,412.6830139160156,204.01199340820312)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M42.36899948120117,19.854000091552734 C42.36899948120117,19.854000091552734 13.561989784240723,-21.946334838867188 -42.77883529663086,-19.038938522338867"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,396.4679870605469,212.98500061035156)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M58.58399963378906,10.880999565124512 C58.58399963378906,10.880999565124512 9.849849700927734,-23.048803329467773 -58.85722351074219,-5.236056804656982"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,371.531005859375,227.92599487304688)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M83.52100372314453,-4.059000015258789 C83.52100372314453,-4.059000015258789 9.731204986572266,-34.97062683105469 -83.66671752929688,14.487541198730469"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,342.8909912109375,259.4599914550781)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M112.41696166992188,-35.643001556396484 C112.41696166992188,-35.643001556396484 -2.8008370399475098,-62.33158493041992 -112.41600036621094,39.69404602050781"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,323.2139892578125,296.89898681640625)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M131.75482177734375,-73.0417709350586 C131.75482177734375,-73.0417709350586 -35.33430862426758,-84.36074829101562 -131.62506103515625,74.46440124511719"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,457.49700927734375,239.80099487304688)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M99.90299987792969,-16.711999893188477 C95.27899932861328,-47.32400131225586 43.819000244140625,-60.6870002746582 -8.869000434875488,-52.72800064086914 C-61.55699920654297,-44.76900100708008 -104.5199966430664,-18.50200080871582 -99.89600372314453,12.109999656677246 C-95.27200317382812,42.72200012207031 -44.8120002746582,61.08599853515625 7.875999927520752,53.12699890136719 C60.5629997253418,45.167999267578125 104.5270004272461,13.899999618530273 99.90299987792969,-16.711999893188477z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,461.135986328125,259.4949951171875)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M193.77000427246094,-28.374000549316406 C183.91900634765625,-93.58499908447266 98.2959976196289,-130.05299377441406 -13.942000389099121,-113.0979995727539 C-126.18000030517578,-96.14299774169922 -203.7030029296875,-29.18600082397461 -193.8520050048828,36.025001525878906 C-184.00100708007812,101.23600006103516 -90.50800323486328,129.35499572753906 21.729999542236328,112.4000015258789 C133.96800231933594,95.44499969482422 203.62100219726562,36.83700180053711 193.77000427246094,-28.374000549316406z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,472.80499267578125,321.6889953613281)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M260.5260009765625,-36.42900085449219 C247.6820068359375,-121.4520034790039 108.75199890136719,-267.57000732421875 -37.58599853515625,-245.46400451660156 C-183.9239959716797,-223.35800170898438 -273.2539978027344,-38.39899826049805 -260.4100036621094,46.624000549316406 C-247.5659942626953,131.64700317382812 -129.41299438476562,168.65199279785156 16.924999237060547,146.54600524902344 C163.26300048828125,124.44000244140625 273.3699951171875,48.59400177001953 260.5260009765625,-36.42900085449219z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,477.4809875488281,370.4360046386719)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M317.56298828125,-47.81800079345703 C300.13299560546875,-163.197998046875 134.17100524902344,-402.5679931640625 -64.41600036621094,-372.5690002441406 C-263.00299072265625,-342.57000732421875 -334.9360046386719,-65.56199645996094 -317.5069885253906,49.81800079345703 C-300.0780029296875,165.197998046875 -168.88499450683594,229.41299438476562 29.70199966430664,199.41400146484375 C228.28900146484375,169.4149932861328 334.9930114746094,67.56199645996094 317.56298828125,-47.81800079345703z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,489.9630126953125,404.97100830078125)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M349.69000244140625,-71.83200073242188 C327.1679992675781,-220.92100524902344 187.54100036621094,-398.0050048828125 -69.06300354003906,-359.24200439453125 C-325.6669921875,-320.47900390625 -371.9110107421875,-90.5469970703125 -349.3890075683594,58.54100036621094 C-326.86700439453125,207.6300048828125 -220.11000061035156,297.0669860839844 36.49399948120117,258.3039855957031 C293.0979919433594,219.54100036621094 372.21099853515625,77.25700378417969 349.69000244140625,-71.83200073242188z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,503.51300048828125,474.0069885253906)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M349.1319885253906,-83.9010009765625 C325.7749938964844,-238.52200317382812 181.84500122070312,-478.02301025390625 -84.28199768066406,-437.8210144042969 C-350.40899658203125,-397.6189880371094 -371.4169921875,-109.93900299072266 -348.05999755859375,44.68199920654297 C-324.7030029296875,199.30299377441406 -235.82400512695312,309.0589904785156 30.30299949645996,268.85699462890625 C296.42999267578125,228.656005859375 372.489013671875,70.72000122070312 349.1319885253906,-83.9010009765625z"></path></g>
          </g>
          <g transform="matrix(1,0,0,1,505.7460021972656,506.47100830078125)" opacity="1" style={{ display: 'block' }}>
            <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M353.60198974609375,-120.5530014038086 C328.5400085449219,-286.4620056152344 199.63600158691406,-514.8889770507812 -85.91799926757812,-471.75299072265625 C-371.47198486328125,-428.61700439453125 -377.3210144042969,-189.2519989013672 -352.2590026855469,-23.343000411987305 C-327.1969909667969,142.5659942626953 -250.71299743652344,335.0929870605469 34.840999603271484,291.9570007324219 C320.3949890136719,248.8209991455078 378.66400146484375,45.35599899291992 353.60198974609375,-120.5530014038086z"></path></g>
          </g>
        </g>
      </g>
      <g transform="matrix(1,0,0,1,500,500)" opacity="1" style={{ display: 'block' }}>
        <g opacity="1" transform="matrix(1,0,0,1,0,0)"><path strokeLinecap="butt" strokeLinejoin="miter" fillOpacity="0" strokeMiterlimit="10" stroke="#000000" strokeOpacity="1" strokeWidth="3" d=" M317.5,0 C317.5,175.35000610351562 175.35000610351562,317.5 0,317.5 C-175.35000610351562,317.5 -317.5,175.35000610351562 -317.5,0 C-317.5,-175.35000610351562 -175.35000610351562,-317.5 0,-317.5 C175.35000610351562,-317.5 317.5,-175.35000610351562 317.5,0z"></path></g>
      </g>
    </g>
  </svg>
);