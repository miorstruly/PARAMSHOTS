import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import VercelSnapText from "./VercelSnapText";
import HeroCarousel from "./HeroCarousel";
import PrismGradient from "./PrismGradient";
import { HERO_SLIDES } from "./heroSlides";

// Autoplay timing, in milliseconds
const AUTOPLAY_START_DELAY = 0; // wait after the photos have grown into place, before the first scroll
const AUTOPLAY_MS = 1800; // time between photos after that

// The headline reads as a question: "Need a Phone for content creation?"
const HERO_WORDS = HERO_SLIDES.map((s) => `${s.word}?`);

const iconProps = {
  className: "h-5 w-5 text-white",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  viewBox: "0 0 24 24",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const STATS: { value: string; label: string; icon: ReactNode }[] = [
  {
    value: "24/7",
    label: "Customer Support",
    icon: (
      <svg {...iconProps}>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <rect x="3" y="14" width="4" height="6" rx="1.5" />
        <rect x="17" y="14" width="4" height="6" rx="1.5" />
        <path d="M19 20c0 1.2-1.4 2-4 2h-2" />
      </svg>
    ),
  },
  {
    value: "100%",
    label: "Verified Devices",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
        <path d="M11 18.5h2" />
      </svg>
    ),
  },
  {
    value: "5★",
    label: "Average Rating",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.8 6.7 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
      </svg>
    ),
  },
];

export default function HeroSection({ bookingUrl }: { bookingUrl: string }) {
  const n = HERO_WORDS.length;
  // The headline follows the carousel: tick counts up/down by the shortest way round
  const [tick, setTick] = useState(0);
  const prevIndex = useRef(0);
  // The text block stays hidden until the intro finishes and the photos have grown into place
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 9000); // safety net if the intro never reports back
    return () => clearTimeout(id);
  }, []);
  const handleActive = useCallback(
    (index: number) => {
      let d = index - prevIndex.current;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;
      prevIndex.current = index;
      if (d) setTick((t) => t + d);
    },
    [n]
  );

  return (
    <section id="hero" className="relative h-[570px] w-full overflow-hidden bg-[#fafaf9] sm:h-[100svh] sm:min-h-[780px]">
      <h1 className="sr-only">
        ParamShots: phone rental in Pampanga. Need a phone for a concert, travel, celebration, or content creation?
      </h1>

      {/* Prism gradient behind everything, using the same colors as the Browse Phones to Requirements waves */}
      <PrismGradient colors={["#fafaf9", "#f8c9c9", "#c94a4a"]} speed={1} />

      {/* The circular carousel sits on top of the gradient */}
      <HeroCarousel
        slides={HERO_SLIDES}
        onActiveChange={handleActive}
        interval={AUTOPLAY_MS}
        startDelay={AUTOPLAY_START_DELAY}
        onEntryDone={setReady}
        className="absolute inset-x-0 top-[72px] h-[540px] sm:inset-0 sm:top-0 sm:h-auto"
      />

      {/* Soft white fades keep the text areas clean */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[32%] bg-gradient-to-b from-[#fafaf9] via-[#fafaf9]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[22%] bg-gradient-to-t from-[#fafaf9] via-[#fafaf9]/90 to-transparent" />

      {/* Top: one-line headline, then the single call to action. Hidden until the intro finishes. */}
      <div
        aria-hidden={!ready}
        className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center gap-6 px-4 pt-28 transition-[opacity,transform] duration-700 ease-out md:pt-36 ${
          ready ? "translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <VercelSnapText tick={tick} items={HERO_WORDS} prefix="Need a Phone for" align="center" inline />
        <a
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group pointer-events-auto inline-flex items-center gap-3 rounded-full bg-[#7A0000] px-7 py-3.5 text-base font-bold text-white shadow-[0_14px_34px_-10px_rgba(122,0,0,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5a0000] hover:shadow-[0_18px_40px_-10px_rgba(122,0,0,0.7)]"
          style={{ fontFamily: "Manrope, sans-serif" }}
        >
          Yes, I&apos;d like to rent
          <svg
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        
      </div>

      {/* Bottom: quiet trust strip */}
      <div
        aria-hidden={!ready}
        className={`pointer-events-none absolute inset-x-0 top-[478px] z-20 sm:top-auto sm:bottom-[24%] md:bottom-[13%] flex justify-center px-4 transition-[opacity,transform] duration-700 ease-out ${
          ready ? "translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
        }`}
      >
        <div className="grid w-full max-w-[calc(100vw-2rem)] grid-cols-3 items-center rounded-2xl border border-white/70 bg-white/85 px-2 py-3 shadow-[0_10px_30px_-14px_rgba(122,0,0,0.35)] backdrop-blur-md sm:inline-flex sm:w-auto sm:max-w-none sm:gap-6 sm:px-5 sm:py-3.5">
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center sm:gap-6">
              {i > 0 && <div className="h-9 w-px shrink-0 bg-black/10 sm:h-10" />}
              <div className="flex flex-1 items-center justify-center gap-2.5 text-center sm:flex-none sm:gap-3 sm:text-left">
                <div className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#7A0000] sm:flex sm:h-10 sm:w-10">
                  {s.icon}
                </div>
                <div>
                  <div
                    className="text-base font-extrabold leading-none text-[#1c1c1e] sm:text-xl"
                    style={{ fontFamily: "Manrope, sans-serif" }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] leading-tight text-[#6b7280] sm:text-xs">{s.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
