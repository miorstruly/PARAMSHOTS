import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

export const SNAP_SPRING = { stiffness: 260, damping: 30, mass: 0.8 };

/** One shared counter so the text and the images step together. */
export function useSnapTick(count: number, interval = 500) {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (count < 2) return;
    const id = setInterval(
      () => setTick((t) => t + 1),
      reduceMotion ? Math.max(interval, 2500) : interval
    );
    return () => clearInterval(id);
  }, [count, interval, reduceMotion]);
  return tick;
}

type VercelSnapTextProps = {
  items: string[];
  /** Line shown above the rolling word. Same size as the word, never animates. */
  prefix?: string;
  itemHeight?: number;
  interval?: number;
  tick?: number;
  stiffness?: number;
  damping?: number;
  /** "left" aligns the text to the left edge on tablets and desktops (always centered on phones). */
  align?: "center" | "left";
  /** Put the prefix and the rolling word on ONE line on tablets and desktops (stacked on phones). */
  inline?: boolean;
  className?: string;
  /** Color of the prefix. */
  textColor?: string;
  /** Color of the rolling word. */
  activeColor?: string;
};

/* Headline size: phones first, `md:` value for tablets and desktops. */
const WORD_SIZE =
  "[font-size:clamp(1.5rem,6.6vw,2.25rem)] md:[font-size:clamp(1.9rem,2.6vw,2.5rem)]";

const TEXT_SHADOW = "0 2px 24px rgba(250,250,249,0.9), 0 0 2px rgba(250,250,249,0.6)";
const PAD = 0.25; // extra room above/below the row so letters never clip
const FADE = "linear-gradient(to bottom, transparent 0%, black 17%, black 83%, transparent 100%)";

const baseStyle = { fontFamily: "Manrope, sans-serif", textShadow: TEXT_SHADOW } as const;

export default function VercelSnapText({
  items,
  prefix = "",
  itemHeight = 64,
  interval = 500,
  tick: controlledTick,
  stiffness = SNAP_SPRING.stiffness,
  damping = SNAP_SPRING.damping,
  align = "center",
  inline = false,
  className = "",
  textColor = "#1c1c1e",
  activeColor = "#7A0000",
}: VercelSnapTextProps) {
  const [ownTick, setOwnTick] = useState(0);
  const tick = controlledTick ?? ownTick;
  // Read the breakpoint synchronously so the very first paint already uses the desktop layout
  const [wide, setWide] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );
  const [rowH, setRowH] = useState(itemHeight);
  const sizerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [widths, setWidths] = useState<number[]>([]);
  // Hidden until the real word widths are known (after the web font loads), so it never shows off-centre
  const [measured, setMeasured] = useState(false);
  const reduceMotion = useReducedMotion();
  const n = items.length;
  const left = (align === "left" || inline) && wide;

  useEffect(() => {
    if (controlledTick !== undefined || n < 2) return;
    const id = setInterval(
      () => setOwnTick((t) => t + 1),
      reduceMotion ? Math.max(interval, 2500) : interval
    );
    return () => clearInterval(id);
  }, [controlledTick, n, interval, reduceMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    const el = sizerRef.current;
    if (!el) return;
    const update = () => {
      const h = el.offsetHeight;
      if (h) setRowH(h);
      const w = itemRefs.current.map((it) => it?.offsetWidth ?? 0);
      if (w.every((x) => x > 0)) setWidths(w);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    // Re-measure once the web font has loaded so the slot matches the real word widths
    let cancelled = false;
    const finish = () => {
      if (cancelled) return;
      update();
      setMeasured(true);
    };
    if (document.fonts?.ready) document.fonts.ready.then(finish);
    else finish();
    const safety = setTimeout(finish, 1500); // never stay hidden if the font is slow
    return () => {
      cancelled = true;
      clearTimeout(safety);
      ro.disconnect();
    };
  }, [items]);

  const transition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness, damping, mass: SNAP_SPRING.mass };

  const rows: number[] = [];
  for (let k = tick - 1; k <= tick + 1; k++) rows.push(k);

  const activeIdx = ((tick % n) + n) % n;
  // Only animate the slot width when the word actually changes. Measuring (first paint, font load,
  // resize) updates the width instantly, so the headline is centred from the first frame.
  const prevIdxRef = useRef(activeIdx);
  const widthTransition = prevIdxRef.current !== activeIdx ? transition : { duration: 0 };
  useEffect(() => {
    prevIdxRef.current = activeIdx;
  });
  // In one-line mode the slot is as wide as the current word, so the whole line stays centred
  const slotWidth = inline && wide ? widths[activeIdx] : undefined;

  const wordClass = "whitespace-nowrap font-extrabold leading-[1.2] tracking-[-0.02em]";
  // Pull the padded window back in so the prefix and word sit as two tight lines
  const tuck = wide && inline ? 0 : -rowH * PAD * 0.85;

  return (
    <div
      aria-hidden="true"
      style={measured ? undefined : { visibility: "hidden" }}
      className={`pointer-events-none relative flex flex-col items-center ${
        inline ? "md:flex-row md:items-baseline md:gap-[0.3em]" : ""
      } ${align === "left" ? "md:items-start" : ""} ${WORD_SIZE} ${className}`}
    >
      {prefix && (
        <span className={wordClass} style={{ ...baseStyle, color: textColor }}>
          {prefix}
        </span>
      )}

      <motion.div
        className="relative"
        initial={false}
        animate={slotWidth ? { width: slotWidth } : undefined}
        transition={widthTransition}
        style={{
          paddingTop: rowH * PAD,
          paddingBottom: rowH * PAD,
          marginTop: tuck,
          marginBottom: tuck,
          maskImage: FADE,
          WebkitMaskImage: FADE,
        }}
      >
        {/* Invisible copies size this slot to the widest word and give the row height */}
        <div ref={sizerRef} className="grid">
          {items.map((item, idx) => (
            <span
              key={item}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              className={`invisible col-start-1 row-start-1 flex items-center justify-self-start ${wordClass}`}
              style={baseStyle}
            >
              {item}
            </span>
          ))}
        </div>

        {rows.map((k) => {
          const offset = k - tick;
          return (
            <motion.div
              key={k}
              className={`absolute flex items-center ${wordClass} ${
                left ? "left-0 justify-start" : "inset-x-0 justify-center"
              }`}
              style={{ ...baseStyle, top: rowH * PAD, height: rowH, color: activeColor }}
              initial={false}
              animate={{ y: offset * rowH, opacity: offset === 0 ? 1 : 0 }}
              transition={transition}
            >
              {items[((k % n) + n) % n]}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
