"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { cn } from "@/lib/cn";

type MarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  speed?: number; // px/s
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number; // px between items
};

export function Marquee({
  speed = 60,
  direction = "left",
  pauseOnHover = true,
  gap = 48,
  className,
  children,
  ...props
}: MarqueeProps) {
  const chunkRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const el = chunkRef.current;
    if (!el) return;

    // paddingRight on the chunk equals gap, so offsetWidth = content + trailing gap
    // → translating by exactly -offsetWidth loops back to an identical visual position
    const width = el.offsetWidth;
    // Left: 0 → -width  (chunk2 fills from right as chunk1 exits left)
    // Right: -width → 0 (chunk2 sits before chunk1; content appears to move right)
    const [from, to] = direction === "left" ? [0, -width] : [-width, 0];

    x.set(from);
    controlsRef.current = animate(x, [from, to], {
      duration: width / speed,
      ease: "linear",
      repeat: Infinity,
      repeatType: "loop",
    });

    return () => controlsRef.current?.stop();
  }, [direction, gap, speed, x]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => pauseOnHover && controlsRef.current?.pause()}
      onMouseLeave={() => pauseOnHover && controlsRef.current?.play()}
      {...props}
    >
      <motion.div className="flex w-max" style={{ x }}>
        {/* First chunk — measured for loop width */}
        <div
          ref={chunkRef}
          className="flex shrink-0"
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
        >
          {children}
        </div>
        {/* Duplicate — seamlessly continues the first chunk */}
        <div
          className="flex shrink-0"
          aria-hidden
          style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
