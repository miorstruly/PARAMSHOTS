import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router-dom";
import FileTransfer from "./FileTransfer";
import GradientWaves from "./GradientWaves";
import SiteButton from "./SiteButton";

/**
 * Landing-page section: "No AirDrop? No problem."
 * Light section with the hero's soft wave gradient. Left: animated phone walkthrough of the 4 steps.
 * Right: the real Send/Receive card, side by side on desktop (stacked on mobile).
 */

const STEP_MS = 5000;
const ACCENT = "#7A0000";
const HEADING_FONT = "Manrope, sans-serif";

type Step = {
  num: string;
  title: string;
  desc: string;
  card: { label: string; main: string; sub: string; pill: string };
};

const STEPS: Step[] = [
  {
    num: "01",
    title: "Pick your files",
    desc: "On the rental phone, choose the photos, videos or ZIPs you want to keep. Big clips are welcome.",
    card: { label: "SELECTED", main: "12 files · 1.8 GB", sub: "Photos, videos and ZIPs", pill: "Big videos welcome" },
  },
  {
    num: "02",
    title: "Get your code",
    desc: "A private code and QR appear. It works for one device only and expires in 10 minutes.",
    card: { label: "ONE-TIME CODE", main: "K7M2-9PQX", sub: "Expires in 10 minutes", pill: "One device only" },
  },
  {
    num: "03",
    title: "Connect your device",
    desc: "Scan the QR or type the code on your own phone or computer, then approve it on the rental phone.",
    card: { label: "YOUR APPROVAL", main: "Allow this device?", sub: "Nothing sends until you tap Allow", pill: "You stay in control" },
  },
  {
    num: "04",
    title: "Memories saved",
    desc: "Files fly straight from device to device, encrypted. Nothing is stored on a server.",
    card: { label: "ENCRYPTED", main: "Device → Device", sub: "No cloud, no storage, no account", pill: "End-to-end encrypted" },
  },
];

// ---------------------------------------------------------------- helpers

function RevealText({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <span className={`inline-block ${className}`} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: "0.6em", filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: delay + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </span>
  );
}

// Decorative QR-like pattern (not scannable, it only illustrates the step)
const QR_SIZE = 11;
const QR_CELLS: boolean[] = (() => {
  let seed = 7;
  const cells: boolean[] = [];
  for (let r = 0; r < QR_SIZE; r++) {
    for (let c = 0; c < QR_SIZE; c++) {
      const finderTL = r < 3 && c < 3;
      const finderTR = r < 3 && c >= QR_SIZE - 3;
      const finderBL = r >= QR_SIZE - 3 && c < 3;
      if (finderTL || finderTR || finderBL) {
        const rr = r % 3 === 0 || r >= QR_SIZE - 3 ? r % 3 : r % 3;
        const cc = c % 3;
        cells.push(!(rr === 1 && cc === 1));
      } else {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        cells.push(((seed >> 16) & 1) === 1);
      }
    }
  }
  return cells;
})();

function usePercent(durationMs: number) {
  const reduce = useReducedMotion();
  const [pct, setPct] = useState(reduce ? 100 : 0);
  useEffect(() => {
    if (reduce) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const v = Math.min(100, ((t - start) / durationMs) * 100);
      setPct(v);
      if (v < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, reduce]);
  return pct;
}

// ---------------------------------------------------------------- phone screens

function ScreenFiles() {
  const tiles = [
    "from-[#7A0000] to-[#c94a4a]",
    "from-[#3b0a0a] to-[#7A0000]",
    "from-[#c94a4a] to-[#f8c9c9]",
    "from-[#5a0000] to-[#e86a6a]",
    "from-[#7A0000] to-[#2a0505]",
    "from-[#e86a6a] to-[#7A0000]",
  ];
  return (
    <div className="flex h-full flex-col">
      <h4 className="text-lg font-bold text-white" style={{ fontFamily: HEADING_FONT }}>
        Choose your files
      </h4>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 260, damping: 18 }}
            className={`relative aspect-square rounded-xl bg-gradient-to-br ${t}`}
          >
            {i % 3 === 1 && (
              <svg className="absolute bottom-1.5 left-1.5 h-3.5 w-3.5 text-white/90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.9 + i * 0.08, type: "spring", stiffness: 400, damping: 15 }}
              className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[#7A0000]"
            >
              <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mt-3 w-fit rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/70"
      >
        12 selected · 1.8 GB
      </motion.div>
      <div className="mt-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="flex h-11 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#111]"
        >
          Create transfer code
        </motion.div>
      </div>
    </div>
  );
}

function ScreenCode() {
  const chars = ["K", "7", "M", "2", "–", "9", "P", "Q", "X"];
  return (
    <div className="flex h-full flex-col items-center">
      <h4 className="self-start text-lg font-bold text-white" style={{ fontFamily: HEADING_FONT }}>
        Your code
      </h4>
      <div className="mt-5 flex gap-1">
        {chars.map((ch, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 14, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.07, type: "spring", stiffness: 320, damping: 16 }}
            className={`text-2xl font-extrabold ${ch === "–" ? "text-white/40" : "text-white"}`}
          >
            {ch}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 18 }}
        className="mt-5 rounded-2xl bg-white p-3"
      >
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${QR_SIZE}, 1fr)` }}>
          {QR_CELLS.map((on, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.008 }}
              className={`h-[10px] w-[10px] rounded-[2px] ${on ? "bg-[#111]" : "bg-transparent"}`}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/70"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-amber-400"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        Waiting for your device · 10:00
      </motion.div>
    </div>
  );
}

function ScreenApprove() {
  return (
    <div className="flex h-full flex-col items-center">
      <h4 className="self-start text-lg font-bold text-white" style={{ fontFamily: HEADING_FONT }}>
        New connection
      </h4>

      <div className="relative mt-6 flex h-28 w-28 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-[#e86a6a]/60"
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7A0000] to-[#c94a4a] shadow-lg shadow-[#7A0000]/40"
        >
          <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
            <path strokeLinecap="round" d="M11 18.5h2" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
      >
        <div className="text-sm font-bold text-white">A device wants to receive 12 files</div>
        <div className="mt-1 text-[10px] leading-4 text-white/55">Only allow this if it is your own device.</div>
        <div className="mt-4 flex gap-2">
          <div className="flex h-9 flex-1 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold text-white/80">
            Decline
          </div>
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 1 }}
            className="flex h-9 flex-1 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#111]"
          >
            Allow &amp; send
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ScreenSend() {
  const pct = usePercent(3800);
  const rows = [
    { name: "VID_0192.MOV", at: 40 },
    { name: "IMG_2041.HEIC", at: 70 },
    { name: "Beach-day.zip", at: 100 },
  ];
  const done = pct >= 100;
  return (
    <div className="flex h-full flex-col">
      <h4 className="text-lg font-bold text-white" style={{ fontFamily: HEADING_FONT }}>
        {done ? "Transfer complete" : "Sending…"}
      </h4>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/60">
          <span>12 files · 1.8 GB</span>
          <span className="font-semibold text-white">{Math.round(pct)}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7A0000] to-[#e86a6a]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.name} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-[11px] text-white/80">
            <span className="truncate">{r.name}</span>
            {pct >= r.at ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 14 }}
                className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white"
              >
                <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.span>
            ) : (
              <span className="h-3 w-3 animate-spin rounded-full border border-white/20 border-t-white/80" />
            )}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col items-center pb-2">
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400"
            >
              <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const SCREENS = [ScreenFiles, ScreenCode, ScreenApprove, ScreenSend];

// ---------------------------------------------------------------- section

// ---------------------------------------------------------------- compatibility strip

const ICON_PROPS = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, viewBox: "0 0 24 24", className: "h-4 w-4" } as const;

const WORKS_WITH = [
  {
    label: "Android devices",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
        <path strokeLinecap="round" d="M11 18.5h2" />
      </svg>
    ),
  },
  {
    label: "Windows PC",
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path strokeLinecap="round" d="M9 20h6M12 16v4" />
      </svg>
    ),
  },
];

/** One quiet capsule: small caption on top, evenly spaced items. */
function CompatStrip() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ delay: 1.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 flex w-full flex-col items-center gap-3 sm:mt-8"
    >
      <span className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6b7280] sm:text-xs sm:tracking-widest">
        Works great with
      </span>
      <ul className="flex w-full max-w-full flex-nowrap items-center justify-between gap-0 rounded-2xl border border-black/[0.06] bg-white/70 px-1.5 py-2 backdrop-blur-sm sm:max-w-xl sm:gap-1 sm:rounded-full sm:px-2">
        {WORKS_WITH.map((w, i) => (
          <motion.li
            key={w.label}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ delay: 1.5 + i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
            className="flex min-w-0 flex-1 items-center justify-center"
          >
            <span className="flex min-w-0 items-center justify-center gap-1 rounded-full px-1 py-2 text-[10px] font-medium leading-tight text-[#1c1c1e] sm:gap-2 sm:px-3 sm:text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#7A0000]/10 text-[#7A0000]">
                {w.icon}
              </span>
              <span className="whitespace-nowrap">{w.label}</span>
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function TransferShowcase() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Advance the steps automatically while the section is on screen
  useEffect(() => {
    if (reduce || paused || !inView) return;
    const id = setInterval(() => setProgress((p) => p + (50 / STEP_MS) * 100), 50);
    return () => clearInterval(id);
  }, [reduce, paused, inView]);

  useEffect(() => {
    if (progress >= 100) {
      setStep((s) => (s + 1) % STEPS.length);
      setProgress(0);
    }
  }, [progress]);

  const goTo = (i: number) => {
    setStep(i);
    setProgress(0);
  };

  const current = STEPS[step];
  const Screen = SCREENS[step];

  const fade = "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 8%, rgba(0,0,0,0.08) 15%, rgba(0,0,0,0.2) 22%, rgba(0,0,0,0.4) 29%, rgba(0,0,0,0.65) 36%, rgba(0,0,0,0.88) 43%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.88) 57%, rgba(0,0,0,0.65) 64%, rgba(0,0,0,0.4) 71%, rgba(0,0,0,0.2) 78%, rgba(0,0,0,0.08) 85%, rgba(0,0,0,0.02) 92%, rgba(0,0,0,0) 100%)";

  return (
    <section
      id="transfer"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#fafaf9] px-5 py-14 text-[#1c1c1e] sm:px-8 md:py-24"
    >
      {/* The hero's soft wave gradient, fading out at the top and bottom so it melts into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <GradientWaves
          horizonColor="#fafaf9"
          waveColor="#f8c9c9"
          crestColor="#c94a4a"
          speed={reduce ? 0 : 0.4}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1}
          opacity={1}
          parallaxStrength={0.5}
          grain
          grainIntensity={0.05}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Heading: same label + h2 style as the other sections */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#7A0000]">Photo &amp; Video Transfer</span>
          <h2
            className="mt-2 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
            style={{ fontFamily: HEADING_FONT }}
          >
            <RevealText text="No AirDrop?" />
            <br />
            <RevealText text="No problem." delay={0.55} className="text-[#7A0000]" />
          </h2>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#6b7280] sm:text-base"
          >
            Move photos, videos and ZIPs from your rental phone to your own device. No cable, no cloud, no account.
          </motion.p>
          <CompatStrip />
        </div>

        {/* Two columns, each centered in its own half so there is plenty of space between them */}
        <div className="mt-14 grid items-center gap-16 lg:mt-20 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {/* LEFT: animated walkthrough */}
          <div
            className="flex flex-col items-center justify-center gap-8 xl:flex-row xl:gap-7"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {/* Phone + progress bars */}
            <div className="flex shrink-0 flex-col items-center">
              <motion.div
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-[33rem] w-[16.5rem] rounded-[2.6rem] border border-white/10 bg-[#111] p-2 shadow-[0_30px_80px_-20px_rgba(122,0,0,0.4)]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-[#171717]">
                  <div className="absolute left-1/2 top-2.5 z-10 h-6 w-20 -translate-x-1/2 rounded-full bg-black" />
                  <div className="flex h-full flex-col px-4 pb-4 pt-12">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-white">New transfer</span>
                      <span className="h-5 w-5 rounded-full bg-white/10" />
                    </div>
                    <div className="relative min-h-0 flex-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={step}
                          className="h-full"
                          initial={reduce ? false : { opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reduce ? undefined : { opacity: 0, x: -24 }}
                          transition={{ duration: 0.35 }}
                        >
                          <Screen />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-8 flex gap-2" role="tablist" aria-label="Transfer steps">
                {STEPS.map((s, i) => (
                  <button
                    key={s.num}
                    type="button"
                    role="tab"
                    aria-selected={i === step}
                    aria-label={`Step ${s.num}: ${s.title}`}
                    onClick={() => goTo(i)}
                    className="h-1.5 w-9 overflow-hidden rounded-full bg-black/10"
                  >
                    <span
                      className="block h-full rounded-full bg-[#7A0000]"
                      style={{ width: i < step ? "100%" : i === step ? `${reduce ? 100 : progress}%` : "0%" }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Step text + floating info card */}
            <div className="w-full max-w-[16rem] text-center xl:min-h-[17rem] xl:max-w-[14rem] xl:text-left">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={reduce ? false : { opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center justify-center gap-3 text-xs font-semibold text-[#7A0000] xl:justify-start">
                    <span>{current.num}</span>
                    <motion.span
                      className="h-px w-14 origin-left bg-[#7A0000]/50"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    />
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight" style={{ fontFamily: HEADING_FONT }}>
                    {current.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#6b7280]">{current.desc}</p>

                  <motion.div
                    animate={reduce ? undefined : { y: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-5 rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm"
                  >
                    <div className="text-[10px] font-semibold tracking-[0.2em] text-[#6b7280]">{current.card.label}</div>
                    <div className="mt-2 text-sm font-bold" style={{ color: ACCENT }}>
                      {current.card.main}
                    </div>
                    <div className="mt-1 text-xs text-[#6b7280]">{current.card.sub}</div>
                  </motion.div>
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mx-auto mt-3 w-fit rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-xs text-[#6b7280] xl:mx-0"
                  >
                    {current.card.pill}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT: the real transfer card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full flex-col items-center justify-center"
          >
            <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-[#6b7280]">
              Ready? Try it right here
            </p>
            <div className="w-full max-w-md">
              <FileTransfer />
            </div>

            <div className="mt-6 flex flex-col items-center gap-3">
              <p className="text-xs text-[#6b7280]">Free · No account needed</p>
              <SiteButton as={Link} to="/transfer" variant="outline">
                Open the Full Transfer Page
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </SiteButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default TransferShowcase;
