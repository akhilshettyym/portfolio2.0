import { getCardState } from "@/utils/functions";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { getFloatingCardStyles, getThemeTransforms } from "@/utils/themeSwatch";

export default function FloatingCard({ card, index, progress, hoveredCard, setHoveredCard, theme = "light" }) {
  const stateX = useTransform(progress, (v) => getCardState(v, index).x);
  const stateY = useTransform(progress, (v) => getCardState(v, index).y);
  const stateScale = useTransform(progress, (v) => getCardState(v, index).scale);
  const stateOpacity = useTransform(progress, (v) => getCardState(v, index).opacity);
  const stateRotate = useTransform(progress, (v) => getCardState(v, index).rotate);
  const stateBlur = useTransform(progress, (v) => getCardState(v, index).blur);

  const blurFilter = useMotionTemplate`blur(${stateBlur}px)`;
  const finalized = useTransform(progress, [0.5, 0.9], [0, 1]);

  const themeTransforms = getThemeTransforms(theme);
  const background = useTransform(finalized, [0, 1], themeTransforms.bg);
  const border = useTransform(finalized, [0, 1], themeTransforms.border);
  const shadow = useTransform(finalized, [0, 1], themeTransforms.shadow);

  const isHovered = hoveredCard === index;
  const hasHoveredCard = hoveredCard !== -1;

  const styles = getFloatingCardStyles(theme);

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[min(90vw,20rem)] -translate-x-1/2 -translate-y-1/2"
      style={{
        x: stateX,
        y: stateY,
        scale: stateScale,
        opacity: stateOpacity,
        rotate: stateRotate,
        filter: blurFilter,
        zIndex: isHovered ? 999 : 20 + index,
      }}>
      <motion.div
        animate={{
          filter: hasHoveredCard && !isHovered ? "blur(2px)" : "blur(0px)",
          opacity: hasHoveredCard && !isHovered ? 0.25 : 1,
          scale: hasHoveredCard && !isHovered ? 0.95 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: hasHoveredCard && !isHovered ? "none" : "auto" }}>
        <motion.article
          className="relative overflow-hidden rounded-lg border backdrop-blur-3xl transition-colors duration-300"
          style={{ background, borderColor: border, boxShadow: shadow }}
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onHoverStart={() => setHoveredCard(index)}
          onHoverEnd={() => setHoveredCard(-1)}>
          <div className="relative flex min-h-120 flex-col p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] transition-colors duration-300 ${styles.badge}`}>
                ©0{String(index + 1).padStart(2, "")}
              </div>
            </div>

            <div className="flex-1">
              <div className="overflow-hidden">
                <h1
                  className={`text-[35px] leading-[0.75] font-black tracking-[-0.08em] will-change-transform uppercase transition-colors duration-300 ${styles.title}`}
                  style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}>
                  {" "}
                  {card.title}{" "}
                </h1>
              </div>
              <p
                className={`mt-3 max-w-[20rem] text-sm font-medium tracking-tight transition-colors duration-300 ${styles.caption}`}>
                {card.caption}
              </p>
              <p className={`mt-5 text-md transition-colors duration-300 ${styles.desc}`}>{card.description}</p>
            </div>

            <div className="mt-7">
              <div
                className={`mb-4 flex items-center justify-between text-xs uppercase tracking-normal transition-colors duration-300 ${styles.caption}`}>
                <span> Timeline </span>
                <span> {card.year} </span>
              </div>

              <div className={`h-px w-full transition-colors duration-300 ${styles.divider}`} />

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className={`text-xs transition-colors duration-300 ${styles.caption}`}> Decrypt </div>

                <motion.a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold tracking-tight transition-all duration-300 ${styles.button}`}>
                  <span> {card.cta} </span>
                  <span aria-hidden="true"> ↗ </span>
                </motion.a>
              </div>
            </div>
          </div>
        </motion.article>
      </motion.div>
    </motion.div>
  );
}
