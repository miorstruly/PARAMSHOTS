import { useEffect, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

export type NavChild = { label: string; href: string; description?: string };
export type NavLink = { label: string; href: string; children?: NavChild[] };

export type FloatingNavbarProps = {
  /** Logo element rendered on the left side of the navbar. */
  logo?: ReactNode;
  /** Navigation links. Each link can optionally have children for a dropdown. */
  links?: NavLink[];
  /** CTA button on the right. Slides in once the user scrolls past ctaThreshold. */
  cta?: { label: string; href: string };
  /** Scroll distance in pixels before the CTA button appears. */
  ctaThreshold?: number;
  /** Additional className for the outer wrapper. */
  className?: string;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);
const externalProps = (href: string) =>
  isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};

export function FloatingNavbar({
  logo,
  links = [],
  cta,
  ctaThreshold = 80,
  className = "",
}: FloatingNavbarProps) {
  const reduceMotion = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  // Scroll-velocity spring: scrolling fast nudges the pill up/down by up to 12px,
  // then it springs back to rest.
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const nudge = useTransform(velocity, [-3000, 3000], [12, -12]);
  const y = useSpring(nudge, { stiffness: 220, damping: 22, mass: 0.6 });

  useMotionValueEvent(scrollY, "change", (v) => setShowCta(v > ctaThreshold));
  useEffect(() => {
    setShowCta(window.scrollY > ctaThreshold);
  }, [ctaThreshold]);

  // Lock page scroll while the mobile overlay is open
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <motion.header
        style={reduceMotion ? undefined : { y }}
        className={`pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-3 ${className}`}
      >
        <nav className="pointer-events-auto flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-white/60 bg-white/70 py-1.5 pl-5 pr-2 shadow-lg shadow-black/5 backdrop-blur-md">
          <div className="flex shrink-0 items-center">{logo}</div>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const hasChildren = !!l.children?.length;
              return (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => hasChildren && setOpenMenu(l.label)}
                  onMouseLeave={() => hasChildren && setOpenMenu(null)}
                >
                  <a
                    href={l.href}
                    className="inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium text-[#374151] transition-colors hover:bg-[#7A0000]/5 hover:text-[#7A0000]"
                  >
                    {l.label}
                    {hasChildren && (
                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          openMenu === l.label ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </a>

                  <AnimatePresence>
                    {hasChildren && openMenu === l.label && (
                      <div className="absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -6 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -6 }}
                          transition={{ type: "spring", stiffness: 380, damping: 28 }}
                          style={{ transformOrigin: "top center" }}
                          className="w-64 rounded-2xl border border-[#e5e7eb] bg-white p-2 shadow-xl"
                        >
                          {l.children!.map((c) => (
                            <a
                              key={c.label}
                              href={c.href}
                              {...externalProps(c.href)}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-[#7A0000]/5"
                            >
                              <div className="text-sm font-semibold text-[#1c1c1e]">{c.label}</div>
                              {c.description && (
                                <div className="mt-0.5 text-xs text-[#6b7280]">{c.description}</div>
                              )}
                            </a>
                          ))}
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex items-center">
            {/* CTA: width springs from 0 to auto once the threshold is crossed */}
            {cta && (
              <motion.div
                initial={false}
                animate={{ width: showCta ? "auto" : 0, opacity: showCta ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="hidden overflow-hidden md:block"
                aria-hidden={!showCta}
              >
                <a
                  href={cta.href}
                  {...externalProps(cta.href)}
                  tabIndex={showCta ? 0 : -1}
                  className="inline-flex items-center whitespace-nowrap rounded-full bg-[#7A0000] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#5a0000]"
                >
                  {cta.label}
                </a>
              </motion.div>
            )}

            <button
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#1c1c1e] transition-colors hover:bg-black/5 md:hidden"
              onClick={() => (mobileOpen ? closeMobile() : setMobileOpen(true))}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-white px-6 pb-8 pt-28 md:hidden"
          >
            <div className="flex flex-1 flex-col gap-1">
              {links.map((l) => {
                const hasChildren = !!l.children?.length;
                const expanded = mobileExpanded === l.label;
                return (
                  <div key={l.label} className="border-b border-[#f0f0ef]">
                    {hasChildren ? (
                      <button
                        onClick={() => setMobileExpanded(expanded ? null : l.label)}
                        className="flex w-full items-center justify-between py-4 text-left text-2xl font-bold text-[#1c1c1e]"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {l.label}
                        <svg
                          className={`h-5 w-5 text-[#7A0000] transition-transform duration-300 ${
                            expanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    ) : (
                      <a
                        href={l.href}
                        onClick={closeMobile}
                        className="block py-4 text-2xl font-bold text-[#1c1c1e]"
                        style={{ fontFamily: "Manrope, sans-serif" }}
                      >
                        {l.label}
                      </a>
                    )}
                    <AnimatePresence initial={false}>
                      {hasChildren && expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 32 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 pb-4">
                            {l.children!.map((c) => (
                              <a
                                key={c.label}
                                href={c.href}
                                {...externalProps(c.href)}
                                onClick={closeMobile}
                                className="rounded-xl px-3 py-2.5 hover:bg-[#7A0000]/5"
                              >
                                <div className="text-base font-semibold text-[#1c1c1e]">{c.label}</div>
                                {c.description && (
                                  <div className="text-sm text-[#6b7280]">{c.description}</div>
                                )}
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {cta && (
              <a
                href={cta.href}
                {...externalProps(cta.href)}
                onClick={closeMobile}
                className="mt-8 block rounded-2xl bg-[#7A0000] px-5 py-4 text-center text-base font-semibold text-white transition-colors hover:bg-[#5a0000]"
              >
                {cta.label}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FloatingNavbar;
