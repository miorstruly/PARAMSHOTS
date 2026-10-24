import { useEffect, useState } from "react";

interface TextMorphProps {
  words: string[];
  /** Time each word stays on screen, in ms */
  interval?: number;
  /** Duration of the blur/fade morph between words, in ms */
  morphDuration?: number;
  className?: string;
}

export default function TextMorph({
  words,
  interval = 2400,
  morphDuration = 680,
  className = "",
}: TextMorphProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    // All words share one grid cell, so the box is as wide as the longest word and the layout never jumps
    <span className={`inline-grid ${className}`}>
      {words.map((word, i) => {
        const active = i === index;
        return (
          <span
            key={word}
            aria-hidden={!active}
            className="col-start-1 row-start-1 text-center motion-reduce:!blur-none"
            style={{
              opacity: active ? 1 : 0,
              filter: active ? "blur(0px)" : "blur(10px)",
              transform: active ? "scale(1)" : "scale(0.94)",
              transition: `opacity ${morphDuration}ms ease, filter ${morphDuration}ms ease, transform ${morphDuration}ms ease`,
            }}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}
