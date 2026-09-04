import { motion } from "framer-motion";

const ENTRANCE_DELAY = 10;

export default function HeroLayer({ theme }) {
  const styles = getHeroLayerStyles(theme);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: ENTRANCE_DELAY,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const creditVariants = {
    hidden: { opacity: 0, y: 6 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: ENTRANCE_DELAY + 0.9 },
    },
  };

  return (
    <div className="absolute top-25 left-0 z-20 w-full">
      <div className="flex w-full items-start justify-between p-5">
        <div className="group relative max-w-md select-none">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-[19px] font-bold leading-relaxed origin-left">
            <motion.p
              variants={itemVariants}
              style={{ transform: "scaleY(1.3) scaleX(1.5)" }}
              className={`inline-block -tracking-widest origin-left ${styles.text}`}>
              A perspective, not a syntax.
            </motion.p>

            <br />

            <motion.p
              variants={itemVariants}
              style={{ transform: "scaleY(1.3) scaleX(1.5)" }}
              className={`inline-block -tracking-widest origin-left ${styles.text}`}>
              Where nothing is everything.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <motion.div variants={creditVariants} initial="hidden" animate="visible" className="fixed bottom-3 right-4 z-20">
        <span className={`text-sm inline-block -tracking-widest origin-left font-bold ${styles.credit}`}>
          designed by me
        </span>
      </motion.div>
    </div>
  );
}