"use client";

import CustomButton from "./basic/CustomButton";
import { AnimatePresence, motion } from "framer-motion";
import { setLocationMode } from "../app/api/weather/route";

function LocationPreferenceModal({ open, onComplete }) {

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
                <motion.div className="fixed inset-0 z-[9999] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>

                    <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

                    <motion.div initial={{ opacity: 0, y: 24, scale: 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.96 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}
                        className="relative w-[460px] overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-[0_25px_80px_rgba(0,0,0,0.18)]">

                        <motion.div initial="hidden" animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.08, delayChildren: 0.12 } }
                            }}>

                            <motion.h2 variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-xl font-semibold uppercase text-gray-900">
                                Scene Personalization
                            </motion.h2>

                            <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-3 text-sm text-gray-600">
                                Choose how weather is created for your scene.
                            </motion.p>

                            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="mt-5 space-y-3">

                                <motion.div whileHover={{ y: -2, scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                                    <p className="mb-3 text-sm text-gray-500">
                                        Uses your precise location. A browser permission prompt may appear.
                                    </p>

                                    <div className="flex justify-end">
                                        <CustomButton title="Accurate Location" onClick={handleAccurate} width={240} height={40} />
                                    </div>
                                </motion.div>

                                <motion.div whileHover={{ y: -2, scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4">
                                    <p className="mb-3 text-sm text-gray-500">
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

export default LocationPreferenceModal;