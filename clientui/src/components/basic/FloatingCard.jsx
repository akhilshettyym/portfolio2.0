import { getCardState } from "@/utils/funct";
import { motion, useMotionTemplate, useTransform } from "framer-motion";

export default function FloatingCard({ card, index, progress, hoveredCard, setHoveredCard }) {
  const stateX = useTransform(progress, (v) => getCardState(v, index).x);
  const stateY = useTransform(progress, (v) => getCardState(v, index).y);

  const stateScale = useTransform(
    progress,
    (v) => getCardState(v, index).scale,
  );

  const stateOpacity = useTransform(
    progress,
    (v) => getCardState(v, index).opacity,
  );

  const stateRotate = useTransform(
    progress,
    (v) => getCardState(v, index).rotate,
  );

  const stateBlur = useTransform(progress, (v) => getCardState(v, index).blur);

  const blurFilter = useMotionTemplate`blur(${stateBlur}px)`;

  const finalized = useTransform(progress, [0.5, 0.9], [0, 1]);

  const background = useTransform(
    finalized,
    [0, 1],
    ["rgba(255,255,255,0.42)", "rgba(255,255,255,0.98)"],
  );

  const border = useTransform(
    finalized,
    [0, 1],
    ["rgba(255,255,255,0.70)", "rgba(0,0,0,0.08)"],
  );

  const shadow = useTransform(
    finalized,
    [0, 1],
    ["0 30px 80px rgba(0,0,0,0.08)", "0 40px 120px rgba(0,0,0,0.14)"],
  );

  const isHovered = hoveredCard === index;
  const hasHoveredCard = hoveredCard !== -1;

  return (
    <motion.div className="absolute left-1/2 top-1/2 w-[min(90vw,20rem)] -translate-x-1/2 -translate-y-1/2" style={{ x: stateX, y: stateY, scale: stateScale, opacity: stateOpacity, rotate: stateRotate, filter: blurFilter, zIndex: isHovered ? 999 : 20 + index }}>

      <motion.div animate={{ filter: hasHoveredCard && !isHovered ? "blur(2px)" : "blur(0px)", opacity: hasHoveredCard && !isHovered ? 0.25 : 1, scale: hasHoveredCard && !isHovered ? 0.95 : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ pointerEvents: hasHoveredCard && !isHovered ? "none" : "auto" }}>

        <motion.article className="relative overflow-hidden rounded-lg border backdrop-blur-3xl"
          style={{ background, borderColor: border, boxShadow: shadow }}
          animate={{ y: isHovered ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          onHoverStart={() => setHoveredCard(index)}
          onHoverEnd={() => setHoveredCard(-1)}>

          <div className="relative flex min-h-120 flex-col p-6">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55">
                ©0{String(index + 1).padStart(2, "")}
              </div>
            </div>

            <div className="flex-1">
              <div className="overflow-hidden">
                <h1 className="text-[35px] leading-[0.75] font-black tracking-[-0.08em] text-black will-change-transform uppercase" style={{ fontFeatureSettings: '"ss01" on, "ss02" on' }}> {card.title} </h1>
              </div>
              <p className="mt-3 max-w-[20rem] text-sm font-medium tracking-tight text-black/45"> {card.caption} </p>
              <p className="mt-5 text-md text-black/68">{card.description}</p>
            </div>

            <div className="mt-7">
              <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-normal text-black/45">
                <span> Timeline </span>
                <span> {card.year} </span>
              </div>
              <div className="h-px w-full bg-black/10" />

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-xs text-black/45"> Decrypt </div>

                <motion.a href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black px-5 py-3 text-xs font-semibold  text-white tracking-tight shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:bg-black/90">
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
};