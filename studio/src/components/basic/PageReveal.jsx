"use client";

import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

export default function PageReveal({ active, children }) {
  const { theme } = useTheme();

  const bgColor = theme === "metal" ? "bg-red-500" : "bg-black";

  return (
    <>
      {children}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-9999 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ height: "50%" }}
              animate={{ height: ["50%", "24%", "0%"] }}
              transition={{ duration: 2.5, times: [0, 0.45, 1], ease: [0.2, 1, 0.36, 1] }}
              className={`absolute top-0 left-0 right-0 ${bgColor}`}
            />

            <motion.div
              initial={{ height: "50%" }}
              animate={{ height: ["50%", "24%", "0%"] }}
              transition={{ duration: 2.5, times: [0, 0.45, 1], ease: [0.2, 1, 0.36, 1] }}
              className={`absolute bottom-0 left-0 right-0 ${bgColor}`}
            />

            <motion.div
              initial={{ top: "50%", bottom: "50%", width: "50%" }}
              animate={{
                top: ["50%", "24%", "0%"],
                bottom: ["50%", "24%", "0%"],
                width: ["50%", "16%", "0%"],
              }}
              transition={{ duration: 2.5, times: [0, 0.45, 1], ease: [0.2, 1, 0.36, 1] }}
              className={`absolute left-0 ${bgColor}`}
            />

            <motion.div
              initial={{ top: "50%", bottom: "50%", width: "50%" }}
              animate={{
                top: ["50%", "24%", "0%"],
                bottom: ["50%", "24%", "0%"],
                width: ["50%", "16%", "0%"],
              }}
              transition={{ duration: 2.5, times: [0, 0.45, 1], ease: [0.2, 1, 0.36, 1] }}
              className={`absolute right-0 ${bgColor}`}
            />

            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1, 1.4], opacity: [0, 0.18, 0] }}
              transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeOut" }}
              className={`absolute left-1/2 top-1/2 h-55 w-55 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl ${bgColor}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
