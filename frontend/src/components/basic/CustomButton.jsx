"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ArrowIcon = () => {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10 7H17V14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const CustomButton = ({ title, onClick, width = 180, height = 56, className = "", disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`inline-block disabled:cursor-not-allowed disabled:opacity-60 ${className}`}>
      <motion.div onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.97, transition: { duration: 0.15 } }}
        className="relative cursor-pointer overflow-hidden border border-zinc-300 bg-white" 
        style={{ width: `${width}px`, height: `${height}px`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}>

        <div className="flex h-full">
          <div className="flex w-3/4 items-center justify-start bg-zinc-900 px-5">
            <span className="text-xs font-medium uppercase text-white"> {" "}{title}{" "} </span>
          </div>
          <div className="flex w-1/4 items-center justify-center border-l border-white/10 bg-zinc-800 text-white">
            <motion.div animate={{ x: isHovered ? 3 : 0, y: isHovered ? -3 : 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
              <ArrowIcon />
            </motion.div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isHovered && (
            <motion.div key="wipe"
              initial={{ x: "-110%" }}
              animate={{ x: "0%" }}
              exit={{ x: "110%" }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-10 flex h-full" style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}>
                
              <div className="flex w-3/4 items-center justify-start bg-white px-5">
                <span className="text-xs font-medium uppercase text-black"> {" "}{title}{" "} </span>
              </div>
              <div className="flex w-1/4 items-center justify-center border-l border-black/10 bg-black text-white">
                <motion.div initial={{ x: 0, y: 0 }}
                  animate={{ x: 3, y: 0 }}
                  exit={{ x: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}>
                  <ArrowIcon />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </button>
  );
};

export default CustomButton;