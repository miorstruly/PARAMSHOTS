import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import "./TrueFocus.css";

type TrueFocusProps = {
  sentence?: string;
  separator?: string;
  /** true = focus follows the mouse instead of cycling automatically */
  manualMode?: boolean;
  blurAmount?: number;
  borderColor?: string;
  glowColor?: string;
  /** Seconds the frame takes to move to the next word */
  animationDuration?: number;
  /** Seconds the frame rests on each word */
  pauseBetweenAnimations?: number;
  /** Where the words sit inside their box */
  align?: "start" | "center";
  /** After the frame has visited every word, wrap all of them together before restarting */
  focusAllAfterCycle?: boolean;
};

const TrueFocus = ({
  sentence = "True Focus",
  separator = " ",
  manualMode = false,
  blurAmount = 5,
  borderColor = "green",
  glowColor = "rgba(0, 255, 0, 0.6)",
  animationDuration = 0.5,
  pauseBetweenAnimations = 1,
  align = "center",
  focusAllAfterCycle = false,
}: TrueFocusProps) => {
  const words = sentence.split(separator);
  // One extra step after the last word: every word in focus, framed together
  const stepCount = focusAllAfterCycle && !manualMode ? words.length + 1 : words.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastActiveIndex, setLastActiveIndex] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [focusRect, setFocusRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Auto-cycle through the words
  useEffect(() => {
    if (manualMode) return;
    const interval = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % stepCount),
      (animationDuration + pauseBetweenAnimations) * 1000
    );
    return () => clearInterval(interval);
  }, [manualMode, animationDuration, pauseBetweenAnimations, stepCount]);

  // Place the frame around the active word
  const measure = useCallback(() => {
    const parent = containerRef.current;
    if (!parent) return;
    const p = parent.getBoundingClientRect();
    if (currentIndex >= words.length) {
      // "All words" step: one frame around the whole sentence
      const rects = wordRefs.current
        .filter((w): w is HTMLSpanElement => !!w)
        .map((w) => w.getBoundingClientRect());
      if (!rects.length) return;
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      setFocusRect({ x: left - p.left, y: top - p.top, width: right - left, height: bottom - top });
      return;
    }
    const word = wordRefs.current[currentIndex];
    if (!word) return;
    const a = word.getBoundingClientRect();
    setFocusRect({ x: a.left - p.left, y: a.top - p.top, width: a.width, height: a.height });
  }, [currentIndex, words.length]);

  useEffect(() => {
    measure();
  }, [measure]);

  // Re-measure when the layout changes (resize, words wrapping, web font finishing loading)
  useEffect(() => {
    const parent = containerRef.current;
    if (!parent) return;
    const ro = new ResizeObserver(measure);
    ro.observe(parent);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // The first placement is instant and invisible, then the frame fades in
  useEffect(() => {
    if (ready || focusRect.width === 0) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [focusRect.width, ready]);

  const handleMouseEnter = (index: number) => {
    if (manualMode) {
      setLastActiveIndex(index);
      setCurrentIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (manualMode && lastActiveIndex !== null) setCurrentIndex(lastActiveIndex);
  };

  return (
    <div
      className="focus-container"
      ref={containerRef}
      style={{ justifyContent: align === "start" ? "flex-start" : "center" }}
    >
      {words.map((word, index) => {
        const showAll = currentIndex >= words.length;
        const isActive = showAll || index === currentIndex;
        return (
          <span
            key={index}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            className={`focus-word ${manualMode ? "manual" : ""} ${isActive && !manualMode ? "active" : ""}`}
            style={
              {
                filter: isActive ? "blur(0px)" : `blur(${blurAmount}px)`,
                "--border-color": borderColor,
                "--glow-color": glowColor,
                transition: `filter ${animationDuration}s ease`,
              } as CSSProperties
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        className="focus-frame"
        initial={false}
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: ready && currentIndex >= 0 ? 1 : 0,
        }}
        transition={{ duration: ready ? animationDuration : 0 }}
        style={{ "--border-color": borderColor, "--glow-color": glowColor } as CSSProperties}
      >
        <span className="corner top-left" />
        <span className="corner top-right" />
        <span className="corner bottom-left" />
        <span className="corner bottom-right" />
      </motion.div>
    </div>
  );
};

export default TrueFocus;
