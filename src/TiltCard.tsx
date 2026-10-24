import { useRef, useState, ReactNode, MouseEvent, HTMLAttributes } from "react";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Max tilt in degrees on each axis */
  rotationFactor?: number;
  /** Scale while idle (e.g. 1.02 for a highlighted card) */
  restScale?: number;
  /** Extra scale multiplier while hovered */
  hoverScale?: number;
  /** Tailwind classes that colour the spotlight circle */
  spotlightClassName?: string;
  /** Diameter of the spotlight circle in px */
  spotlightSize?: number;
}

export default function TiltCard({
  children,
  className = "",
  rotationFactor = 11,
  restScale = 1,
  hoverScale = 1.04,
  spotlightClassName = "bg-black/5",
  spotlightSize = 800,
  ...rest
}: TiltCardProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  // Mouse tracking happens on the un-rotated outer wrapper so the tilt doesn't feed back into the maths
  const track = (e: MouseEvent<HTMLDivElement>) => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });
    setTilt({
      x: -(y / rect.height - 0.5) * 2 * rotationFactor,
      y: (x / rect.width - 0.5) * 2 * rotationFactor,
    });
  };

  const scale = hovering ? restScale * hoverScale : restScale;

  return (
    <div
      ref={outerRef}
      className="flex"
      style={{ perspective: 1000 }}
      onMouseEnter={(e) => {
        track(e);
        setHovering(true);
      }}
      onMouseMove={track}
      onMouseLeave={() => {
        setHovering(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      <div
        {...rest}
        className={`relative isolate w-full ${className}`}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${scale})`,
          transition: hovering
            ? "transform 150ms ease-out, box-shadow 300ms ease-out"
            : "transform 500ms ease-out, box-shadow 300ms ease-out",
          willChange: "transform",
          ...rest.style,
        }}
      >
        {/* Spotlight: a circle that grows out from the cursor, clipped to the card */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
          <div className="absolute" style={{ left: pos.x, top: pos.y }}>
            <div
              className={`absolute rounded-full transition-transform duration-500 ease-out ${spotlightClassName}`}
              style={{
                width: spotlightSize,
                height: spotlightSize,
                left: -spotlightSize / 2,
                top: -spotlightSize / 2,
                transform: `scale(${hovering ? 1 : 0})`,
              }}
            />
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
