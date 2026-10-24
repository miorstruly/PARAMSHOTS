import type { ElementType, ReactNode } from "react";

/**
 * ParamShots button: plain Tailwind, the site's original white + maroon, hover effects only.
 * Use it for every call-to-action. Renders a <button> by default, or an <a> / router <Link>
 * through the `as` prop.
 *
 *   primary  solid maroon, white text      (main actions)
 *   outline  white with a maroon border    (secondary actions)
 *   light    solid white, maroon text      (on maroon or photo cards)
 */

type Variant = "primary" | "outline" | "light";
type SiteSize = "sm" | "md";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-[#7A0000] text-white hover:bg-[#5a0000] hover:shadow-lg hover:shadow-[#7A0000]/25",
  outline:
    "border border-[#7A0000]/30 bg-white text-[#7A0000] hover:border-[#7A0000]/60 hover:bg-[#7A0000]/5 hover:shadow-md hover:shadow-[#7A0000]/10",
  light: "bg-white text-[#7A0000] hover:bg-gray-100 hover:shadow-lg hover:shadow-black/10",
};

const SIZES: Record<SiteSize, string> = {
  sm: "rounded-lg px-4 py-2 text-xs",
  md: "rounded-xl px-5 py-3 text-sm",
};

type SiteButtonProps = {
  as?: ElementType;
  variant?: Variant;
  size?: SiteSize;
  /** stretch to the full width of the parent */
  full?: boolean;
  className?: string;
  children?: ReactNode;
  // everything else (href, to, target, rel, onClick, disabled, style, aria-*) goes to the element
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
};

export default function SiteButton({
  as: Tag = "button",
  variant = "primary",
  size = "md",
  full = false,
  className = "",
  type = "button",
  children,
  ...rest
}: SiteButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 font-semibold",
    "transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7A0000]",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
    SIZES[size],
    VARIANTS[variant],
    full ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} {...(Tag === "button" ? { type } : null)} {...rest}>
      {children}
    </Tag>
  );
}
