import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/**
 * Scroll-linked transition between sections.
 *
 *  - "exit": the section scales back, dims and rounds its corners while it scrolls away (use on the hero)
 *  - "rise": the section lifts up from below with rounded corners that flatten as it settles (solid-colour sections)
 *  - "fade": the section drifts up and fades in (sections on the page background)
 *
 * Once a section has settled, its transform is removed entirely ("none") so sticky/fixed
 * children and the page layout behave exactly as before.
 */
type Variant = "exit" | "rise" | "fade";

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3); // easeOutCubic

export default function ScrollSection({
  children,
  variant = "fade",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: variant === "exit" ? ["start start", "end start"] : ["start end", "start 0.45"],
  });

  const transform = useTransform(scrollYProgress, (raw) => {
    if (variant === "exit") {
      const p = clamp01(raw);
      if (p < 0.001) return "none";
      return `scale(${1 - 0.08 * p})`;
    }
    const p = ease(raw);
    if (p > 0.999) return "none";
    if (variant === "rise") return `translateY(${(1 - p) * 120}px) scale(${0.92 + 0.08 * p})`;
    return `translateY(${(1 - p) * 60}px)`;
  });

  const opacity = useTransform(scrollYProgress, (raw) => {
    if (variant === "exit") return 1 - 0.55 * clamp01(raw);
    const p = ease(raw);
    return variant === "rise" ? 0.35 + 0.65 * p : p;
  });

  const borderRadius = useTransform(scrollYProgress, (raw) => {
    if (variant === "fade") return "0px";
    const p = variant === "exit" ? clamp01(raw) : 1 - ease(raw);
    return `${Math.round(p * 56)}px`;
  });

  const overflow = useTransform(scrollYProgress, (raw) => {
    if (variant === "fade") return "visible";
    const p = variant === "exit" ? clamp01(raw) : 1 - ease(raw);
    return p > 0.001 ? "hidden" : "visible";
  });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform,
        opacity,
        borderRadius,
        overflow,
        transformOrigin: variant === "exit" ? "center bottom" : "center top",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}
