import { useCallback, useEffect, useMemo } from "react";
import CircularCarousel from "./CircularCarousel";
import type { HeroSlide } from "./heroSlides";

type Props = {
  slides: HeroSlide[];
  /** Called with the index (0..n-1) of the slide in the centre. */
  onActiveChange: (index: number) => void;
  /** Auto-advance every N ms, starting once the intro has finished. Pauses while the pointer is over the carousel. Use 0 to turn off. */
  interval?: number;
  /** Wait this many ms after the intro before the first step (0 = step right away). */
  startDelay?: number;
  /** false while the intro plays, true once the cards have risen into place. */
  onEntryDone?: (done: boolean) => void;
  className?: string;
};

export default function HeroCarousel({
  slides,
  onActiveChange,
  interval = 1500,
  startDelay = 0,
  onEntryDone,
  className = "",
}: Props) {
  // Keep the same array between renders so the carousel doesn't reload its images
  const items = useMemo(
    () => slides.map((s) => ({ src: s.images[0] ?? "", title: s.label, alt: s.alt })),
    [slides]
  );

  // The intro is playing until the carousel says it's done
  useEffect(() => {
    onEntryDone?.(false);
  }, [onEntryDone]);

  const handleIntroDone = useCallback(() => onEntryDone?.(true), [onEntryDone]);

  return (
    <div className={className}>
      <CircularCarousel
        items={items}
        preset="cylinder"
        intro="rise"
        cardWidth={214}
        aspectRatio={1}
        gap={96}
        tilt={-16}
        curve={1}
        perspective={3100}
        // Step one card at a time so the headline word always matches the card at the front
        autoplay={interval ? "step" : "off"}
        interval={Math.max(0.5, interval / 1000)}
        firstStepDelay={startDelay / 1000}
        direction="left"
        momentum={0.49}
        snap
        pauseOnHover={false} // keep auto-scrolling while the mouse is over it; only dragging stops it
        focusOnClick
        draggable
        parallax={0.53}
        stretch={0.41}
        fadeColor="#fafaf9"
        depthFade={0.55}
        innerShade={0.6}
        cornerRadius={16}
        captions={false}
        onChange={onActiveChange}
        onIntroDone={handleIntroDone}
      />
    </div>
  );
}
