"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import OrderBaseLogo from "./OrderBaseLogo";

export interface HeroProps {
  title: string;
  titleHighlight?: string;
  description: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image?: string;
  imageAlt?: string;
}

export function Hero({
  title,
  titleHighlight,
  description,
  primaryCtaLabel = "Contact Sales",
  primaryCtaHref = "#",
  secondaryCtaLabel = "See How It Works",
  secondaryCtaHref = "#",
  image,
  imageAlt = "Orderbase dashboard",
}: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Image drifts up as you scroll out of the hero
  const imageY = useTransform(scrollYProgress, [0, 1], ["0px", "-80px"]);
  // Subtle scale-down reveals the screenshot coming into frame on load
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.04, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-black"
    >
      {/* Red glow — 2311×981 ellipse at x:-233 y:669, blur 200px */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-[50%]"
        style={{
          left: -233,
          top: 669,
          width: 2311,
          height: 981,
          background: "linear-gradient(to top, #e72b29 0%, #000 100%)",
          filter: "blur(200px)",
          opacity: 0.7,
        }}
      />

      {/* ── Above-fold content ── */}
      <div className="relative z-10 flex flex-col items-center gap-[1.875rem] px-[3.75rem] pt-20 pb-0">

        {/* Logo + text block */}
        <div className="flex flex-col items-center gap-1">
          <OrderBaseLogo />

          <motion.div
            className="flex flex-col items-center gap-4 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h1 className="text-hero-ob font-medium text-white text-balance max-w-[782px]">
              {title}
              {titleHighlight && (
                <>
                  {" "}
                  <span className="text-orderbase-red">{titleHighlight}</span>
                </>
              )}
            </h1>

            <p className="text-xl font-medium text-white/70 text-balance max-w-[580px]">
              {description}
            </p>
          </motion.div>
        </div>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <a
            href={primaryCtaHref}
            className="inline-flex items-center justify-center rounded-pill bg-orderbase-red px-9 py-6 text-xl font-medium text-white"
          >
            {primaryCtaLabel}
          </a>
          <a
            href={secondaryCtaHref}
            className="inline-flex items-center justify-center gap-2 rounded-pill border border-white px-9 py-6 text-xl font-medium text-white"
          >
            {secondaryCtaLabel}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4.5 10h11m0 0-4.5-4.5m4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ── Dashboard screenshot — scroll parallax ── */}
      {image && (
        <div className="relative z-10 flex justify-center px-[3.75rem] pt-10 pb-0 overflow-visible">
          <motion.div
            className="w-full max-w-[1048px]"
            style={{ y: imageY, scale: imageScale }}
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <img
              src={image}
              alt={imageAlt}
              className="w-full rounded-card"
            />
          </motion.div>
        </div>
      )}

      {/* Placeholder when no image is passed */}
      {!image && (
        <div className="relative z-10 flex justify-center px-[3.75rem] pt-10">
          <div className="w-full max-w-[1048px] aspect-[1048/1124] rounded-card bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-white/30 text-sm">Dashboard screenshot</span>
          </div>
        </div>
      )}
    </section>
  );
}
