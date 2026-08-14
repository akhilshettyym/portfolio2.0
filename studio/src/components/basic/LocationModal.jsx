"use client";

import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { setLocationMode } from "@/utils/weather-scene";
import { getLocationStyles } from "@/utils/themeSwatch";
import CustomButton from "@/components/basic/CustomButton";

export default function LocationModal({ open, onComplete }) {
  const { theme } = useTheme();
  const styles = getLocationStyles(theme);

  const handleAccurate = () => {
    setLocationMode("accurate");
    onComplete();
  };

  const handleFast = () => {
    setLocationMode("fast");
    onComplete();
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}>
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className={`relative w-115 overflow-hidden border p-6 transition-colors duration-500 ${styles.modalBox}`}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
              }}>
              <motion.h2
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`text-xl font-semibold uppercase transition-colors duration-500 ${styles.title}`}>
                Scene Personalization
              </motion.h2>

              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className={`mt-3 text-sm transition-colors duration-500 ${styles.description}`}>
                Choose how weather is created for your scene.
              </motion.p>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-5 space-y-3">
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-full border p-4 transition-colors duration-500 ${styles.optionCard}`}>
                  <p className={`mb-3 text-sm transition-colors duration-500 ${styles.optionText}`}>
                    Uses your precise location. A browser permission prompt may appear.
                  </p>

                  <div className="flex justify-end">
                    <CustomButton title="Accurate Location" onClick={handleAccurate} width={240} height={40} />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className={`w-full border p-4 transition-colors duration-500 ${styles.optionCard}`}>
                  <p className={`mb-3 text-sm transition-colors duration-500 ${styles.optionText}`}>
                    Uses city-level IP location. No permission prompt required.
                  </p>

                  <div className="flex justify-end">
                    <CustomButton title="Fast Location" onClick={handleFast} width={240} height={40} />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
