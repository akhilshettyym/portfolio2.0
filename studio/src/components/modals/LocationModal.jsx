"use client";

import { useTheme } from "@/context/ThemeContext";
import { AnimatePresence, motion } from "framer-motion";
import { setLocationMode } from "@/utils/weather-scene";
import { getLocationStyles } from "@/utils/themeSwatch";
import CustomButton from "@/components/basic/CustomButton";

export default function LocationModal({ open, onComplete }) {
  const { theme } = useTheme();
  const styles = getLocationStyles(theme);

  const handleLocationSelect = (mode) => {
    setLocationMode(mode);
    onComplete?.();
  };

  const options = [
    {
      mode: "accurate",
      title: "Accurate Location",
      description:
        "Use your precise device location to create the most location-aware weather scene. Your browser may ask for permission.",
      button: "Use Accurate",
    },
    {
      mode: "fast",
      title: "Fast Location",
      description:
        "Use an approximate city-level location based on your network. No browser location permission is required.",
      button: "Use Fast",
    },
    {
      mode: "denied",
      title: "Default Location",
      description: "Skip location entirely and continue with the portfolio's default clouds, background, and scene.",
      button: "Continue",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          className="fixed inset-0 z-9999 flex items-center justify-center px-3 py-4 sm:px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title">
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            className={`relative w-full max-w-5xl overflow-hidden border transition-colors duration-500 ${styles.modalBox}`}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.06 } } }}
              className="p-4 sm:p-6 lg:p-7">
              <div className="mx-auto max-w-2xl text-center">
                <motion.div
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] opacity-60 transition-colors duration-500 ${styles.description}`}>
                  Weather Scene
                </motion.div>

                <motion.h2
                  id="location-modal-title"
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className={`text-lg font-bold uppercase tracking-tighter md:tracking-[-0.09em] transition-colors duration-500 sm:text-xl lg:text-2xl ${styles.title}`}>
                  Scene Personalization
                </motion.h2>

                <motion.p
                  variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                  className={`mx-auto mt-2 max-w-xl text-xs leading-relaxed transition-colors duration-500 sm:text-sm ${styles.description}`}>
                  Choose how location is used to create the weather scene.
                </motion.p>
              </div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4">
                {options.map((option) => (
                  <motion.div
                    key={option.mode}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={`group flex min-h-42 flex-col justify-between border p-4 transition-all duration-500 sm:min-h-48 sm:p-5 ${styles.optionCard}`}>
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <h3
                          className={`text-sm font-bold uppercase tracking-tight transition-colors duration-500 ${styles.title}`}>
                          {option.title}
                        </h3>
                      </div>

                      <p
                        className={`mt-3 text-xs leading-relaxed transition-colors duration-500 sm:text-sm ${styles.optionText}`}>
                        {option.description}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-center sm:justify-start">
                      <CustomButton
                        title={option.button}
                        onClick={() => handleLocationSelect(option.mode)}
                        width={200}
                        height={38}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className={`mt-5 border-t pt-4 text-center transition-colors duration-500 ${styles.description}`}>
                <p className="text-xs leading-relaxed tracking-tight opacity-70">
                  Accurate uses your precise location. Fast uses an approximate location. Default keeps your location
                  private and uses the built-in scene.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
