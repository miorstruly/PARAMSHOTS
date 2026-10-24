import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "motion/react";

export type MotionAccordionItem = {
  question: ReactNode;
  answer: ReactNode;
};

export type MotionAccordionProps = {
  items: MotionAccordionItem[];
  /** Gap between accordion items in pixels. */
  gap?: number;
  className?: string;
};

// Measures its content with a ResizeObserver so the spring always targets the exact height.
function Panel({ open, children }: { open: boolean; children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = inner.current;
    if (!el) return;
    const update = () => setHeight(el.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height: open ? height : 0, opacity: open ? 1 : 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      style={{ overflow: "hidden" }}
      aria-hidden={!open}
    >
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

export function MotionAccordion({ items, gap = 10, className = "" }: MotionAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-col ${className}`} style={{ gap }}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: open ? "#7A0000" : "#ffffff",
              borderColor: open ? "#7A0000" : "#e5e7eb",
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden rounded-2xl border"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <motion.span
                initial={false}
                animate={{ color: open ? "#ffffff" : "#1c1c1e" }}
                transition={{ duration: 0.3 }}
                className="text-sm font-semibold sm:text-base"
                style={{ fontFamily: "Manrope, sans-serif" }}
              >
                {item.question}
              </motion.span>
              <motion.span
                initial={false}
                animate={{ rotate: open ? 45 : 0, color: open ? "#ffffff" : "#7A0000" }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex h-6 w-6 shrink-0 items-center justify-center"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                </svg>
              </motion.span>
            </button>

            <Panel open={open}>
              <div className="px-5 pb-5 text-sm leading-relaxed text-white/85">{item.answer}</div>
            </Panel>
          </motion.div>
        );
      })}
    </div>
  );
}

export default MotionAccordion;
