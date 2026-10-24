import { Fragment, useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";

export type KineticSplit = "words" | "chars" | "lines";
export type KineticDirection = "up" | "down" | "left" | "right";

export type KineticTextRevealProps = {
  text: string;
  /** Split the copy by words, characters, or lines (lines split on "\n"). */
  split?: KineticSplit;
  /** Direction each segment travels as it comes in. */
  direction?: KineticDirection;
  /** Seconds between each segment. */
  stagger?: number;
  /** Seconds each segment takes to settle. */
  duration?: number;
  /** Seconds before the first segment starts. */
  delay?: number;
  /** Travel distance in pixels. */
  distance?: number;
  /** Starting blur in pixels. */
  blur?: number;
  /** Only animate the first time it scrolls into view. */
  once?: boolean;
  className?: string;
};

export function KineticTextReveal({
  text,
  split = "words",
  direction = "up",
  stagger = 0.06,
  duration = 0.7,
  delay = 0,
  distance = 24,
  blur = 8,
  once = true,
  className = "",
}: KineticTextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, amount: 0.1 });
  const reduceMotion = useReducedMotion();

  // With "reduce motion" on, keep a soft staggered fade but drop the travel and blur
  const dist = reduceMotion ? 0 : distance;
  const blurPx = reduceMotion ? 0 : blur;

  const offset = {
    up: { x: 0, y: dist },
    down: { x: 0, y: -dist },
    left: { x: -dist, y: 0 },
    right: { x: dist, y: 0 },
  }[direction];

  // Every segment carries its own initial/animate/delay, so nothing depends on
  // variant propagation from a parent.
  let index = 0;
  const segment = (key: string, children: ReactNode, segClassName: string) => {
    const i = index++;
    return (
      <motion.span
        key={key}
        className={segClassName}
        initial={{ opacity: 0, filter: `blur(${blurPx}px)`, x: offset.x, y: offset.y }}
        animate={inView ? { opacity: 1, filter: "blur(0px)", x: 0, y: 0 } : undefined}
        transition={{
          duration,
          delay: delay + i * stagger,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        }}
      >
        {children}
      </motion.span>
    );
  };

  const words = text.split(/\s+/).filter(Boolean);

  let content: ReactNode;
  if (split === "lines") {
    content = text.split("\n").map((line, li) => segment(`l${li}`, line, "block"));
  } else if (split === "chars") {
    content = words.map((word, wi) => (
      <Fragment key={wi}>
        <span className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => segment(`${wi}-${ci}`, ch, "inline-block"))}
        </span>
        {wi < words.length - 1 && " "}
      </Fragment>
    ));
  } else {
    content = words.map((word, wi) => (
      <Fragment key={wi}>
        {segment(`w${wi}`, word, "inline-block")}
        {wi < words.length - 1 && " "}
      </Fragment>
    ));
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true" className="inline-block">
        {content}
      </span>
    </span>
  );
}

export default KineticTextReveal;
