import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

export type Review = {
  name: string;
  role: string;
  stars: number;
  quote: string;
  /** Optional photo shown in the post's picture area. Without one, the maroon design is used. */
  image?: string;
};

export type ReviewsScrollSplitProps = {
  reviews: Review[];
  /** Image that is split across the cards before they flip to reveal the reviews. */
  imageSrc: string;
  /** Text revealed at the end of the scroll, under the cards. */
  outro?: ReactNode;
};

// Phones are narrow, so below this width the reviews are a simple stack instead of the 3-card scroll effect
function useIsMobile() {
  const query = "(max-width: 767px)";
  const [mobile, setMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

/* ---------- Instagram-style post ---------- */

const iconProps = {
  className: "h-6 w-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

function HeartIcon() {
  return (
    <svg {...iconProps} className="h-6 w-6 text-[#ed4956]" fill="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg {...iconProps}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
      />
    </svg>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "fill-amber-400" : "fill-gray-200"}`}
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

// `fill` = sits in a fixed-height card (the media area stretches to use the spare room)
export function InstagramPost({
  review,
  fill = false,
  onSeeAll,
}: {
  review: Review;
  fill?: boolean;
  /** Fixed-size cards show a 4-line preview and call this to open the full review. */
  onSeeAll?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white text-[#262626]">
      {/* Header: story-ring avatar, username, location line, menu dots */}
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] p-[2px]">
          <div className="rounded-full bg-white p-[2px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7A0000] text-xs font-bold text-white">
              {review.name.trim().charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-[13px] font-semibold">{review.name}</div>
          <div className="truncate text-[11px] text-[#737373]">{review.role}</div>
        </div>
        <svg className="h-5 w-5 shrink-0 text-[#262626]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </div>

      {/* Media */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-[#7A0000] via-[#A52A2A] to-[#C0392B] ${
          fill ? "min-h-[72px] flex-1" : "h-44"
        }`}
      >
        {review.image ? (
          <img
            src={review.image}
            alt={`Photo shared by ${review.name}, a ParamShots renter, after renting a phone for ${review.role}`}
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
        ) : (
          <>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/10" />
            <div className="relative flex h-full flex-col items-center justify-center gap-1 px-4 text-center text-white">
              <span aria-hidden="true" className="font-serif text-5xl font-bold leading-none opacity-80">
                “
              </span>
              <span className="text-sm font-bold tracking-wide">{review.role}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">ParamShots Renter</span>
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3.5 px-3 pt-2.5">
        <HeartIcon />
        <CommentIcon />
        <SendIcon />
        <span className="ml-auto">
          <BookmarkIcon />
        </span>
      </div>

      {/* Rating (where Instagram shows the like count) */}
      <div className="flex items-center gap-2 px-3 pt-2">
        <Stars count={review.stars} />
        <span className="text-[13px] font-semibold">{review.stars.toFixed(1)} rating</span>
      </div>

      {/* Caption: a fixed 4-line preview in the flip cards so all three are the same height */}
      <p
        className={`px-3 pt-1 text-[13px] leading-[18px] ${
          fill ? "line-clamp-4 h-[calc(72px+0.25rem)] shrink-0 overflow-hidden" : ""
        }`}
      >
        <span className="font-semibold">{review.name}</span> {review.quote}
      </p>
      {fill && onSeeAll && (
        <button
          type="button"
          onClick={onSeeAll}
          className="pointer-events-auto shrink-0 px-3 pt-1 text-left text-[13px] text-[#737373] hover:text-[#262626] focus-visible:outline-2 focus-visible:outline-[#7A0000]"
        >
          See all comments
        </button>
      )}
      <div className="shrink-0 px-3 pb-3 pt-1.5 text-[10px] uppercase tracking-wide text-[#737373]">Renter review</div>
    </div>
  );
}


/* ---------- Full review dialog ---------- */

function ReviewDialog({ review, onClose }: { review: Review; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Review by ${review.name}`}
    >
      <div
        className="relative max-h-[88vh] w-full max-w-sm overflow-y-auto rounded-xl border border-[#dbdbdb] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close review"
          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-lg leading-none text-white hover:bg-black/70"
        >
          ×
        </button>
        <InstagramPost review={review} />
      </div>
    </div>,
    document.body
  );
}

/* ---------- Phones / reduced motion: simple stack ---------- */

function StackedPosts({ reviews }: { reviews: Review[] }) {
  const reduceMotion = useReducedMotion();
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 pb-10 pt-8">
      {reviews.map((review) => (
        <motion.div
          key={review.name}
          initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ type: "spring", stiffness: 140, damping: 20 }}
          className="overflow-hidden rounded-xl border border-[#dbdbdb] bg-white shadow-lg"
        >
          <InstagramPost review={review} />
        </motion.div>
      ))}
    </div>
  );
}

/* ---------- Scroll-split: one image splits into cards that flip to reveal the posts ---------- */

function ScrollSplit({ reviews, imageSrc, outro }: ReviewsScrollSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openReview, setOpenReview] = useState<Review | null>(null);
  const cards = reviews.slice(0, 3);
  const n = cards.length;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 0 → 0.4: the image separates. 0.4 → 0.8: the cards flip. 0.8 → 1: they move up and the outro appears.
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Rounded corners appear as the pieces separate, so it starts as one flat image
  const radiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"]);
  const radiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const radiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const frontShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;
  // The white post only gets the outer shadow, so its bottom isn't darkened
  const backShadow = useMotionTemplate`0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -48]);
  const outroOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const outroY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const hintY = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  return (
    <div
      ref={containerRef}
      className="relative h-[350vh] w-full"
      style={{
        // The image sits centered in a full-screen stage. Pull the block up so the image starts
        // ~2rem under the header, and pull the next section up so there's no dead space after the outro.
        marginTop: "calc(2rem - (100vh - min(34rem, 72vh)) / 2)",
        marginBottom: "calc(-1 * (50vh - min(34rem, 72vh) / 2 - 24px))",
      }}
    >
      <div className="pointer-events-none sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden [perspective:1200px]">
        <motion.div
          className="absolute inset-x-0 bottom-[6%] text-center"
          style={{ opacity: hintOpacity, y: hintY }}
        >
          <p className="text-sm font-medium uppercase tracking-widest text-[#6b7280]">Scroll down</p>
        </motion.div>

        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="pointer-events-auto relative flex h-[min(34rem,72vh)] w-full max-w-5xl px-4"
        >
          {cards.map((review, i) => {
            const first = i === 0;
            const last = i === n - 1;
            return (
              <motion.div
                key={review.name}
                className="relative h-full flex-1"
                style={{
                  x: first ? leftX : last ? rightX : 0,
                  rotateY,
                  rotateZ: first ? rotateZLeft : last ? rotateZRight : 0,
                  zIndex: i,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Front: one slice of the shared image */}
                <motion.div
                  className="absolute inset-0 overflow-hidden [backface-visibility:hidden]"
                  style={{
                    WebkitBackfaceVisibility: "hidden",
                    zIndex: 2,
                    borderRadius: first ? radiusLeft : last ? radiusRight : radiusMiddle,
                    boxShadow: frontShadow,
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 h-full bg-cover bg-center"
                    style={{
                      width: `${n * 100}%`,
                      left: `${-100 * i}%`,
                      backgroundImage: `url(${imageSrc})`,
                    }}
                  />
                </motion.div>

                {/* Back: the Instagram-style review post */}
                <div
                  className="absolute inset-0 [backface-visibility:hidden]"
                  style={{ WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", zIndex: 1 }}
                >
                  <motion.div
                    className="h-full w-full overflow-hidden rounded-xl border border-[#dbdbdb] bg-white"
                    style={{ boxShadow: backShadow }}
                  >
                    <InstagramPost review={review} fill onSeeAll={() => setOpenReview(review)} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="absolute inset-x-0 px-5 text-center"
          style={{
            // sits just under the cards' final position
            top: "calc(50% + min(34rem, 72vh) / 2 - 24px)",
            opacity: outroOpacity,
            y: outroY,
          }}
        >
          <p
            className="text-2xl font-extrabold tracking-tight text-[#1c1c1e]"
            style={{ fontFamily: "Manrope, sans-serif" }}
          >
            {outro}
          </p>
        </motion.div>
      </div>
      {openReview && <ReviewDialog review={openReview} onClose={() => setOpenReview(null)} />}
    </div>
  );
}

export function ReviewsScrollSplit(props: ReviewsScrollSplitProps) {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  if (isMobile || reduceMotion) return <StackedPosts reviews={props.reviews} />;
  return <ScrollSplit {...props} />;
}

export default ReviewsScrollSplit;
