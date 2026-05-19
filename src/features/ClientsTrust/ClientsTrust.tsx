"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { ClientsTrustCard } from "./ClientsTrustCard";

const REASONS = [
  {
    image: null,
    title: "Expertise Led By The Founder",
    body: "Every project is guided by direct founder insight — blending business strategy, UX design, and conversion logic to ensure every outcome feels intentional and high-performing.",
  },
  {
    image: null,
    title: "Tailor-Made Digital Systems",
    body: "We don't rely on templates. We build from the ground up — fully custom platforms that match how your business operates, not the other way around.",
  },
  {
    image: null,
    title: "Smooth Tech Integration",
    body: "From ERPs and CRMs to payments and logistics — we connect every moving part into a smooth, automated system.",
  },
  {
    image: null,
    title: "Design That Drives Business",
    body: "Our designs are not just beautiful — they're designed and built for growth, clarity, and conversion.",
  },
  {
    image: null,
    title: "Partnership After Launch",
    body: "We don't disappear after go-live. Our shared support team and monthly retainer model keep every website secure, updated, and optimized.",
  },
  {
    image: null,
    title: "Performance Mindset",
    body: "We measure success by real impact — conversions, traffic, and operational efficiency — not vanity metrics.",
  },
];

const CARD_WIDTH = 330;
const CARD_GAP = 16;
const SCROLL_STEP = CARD_WIDTH + CARD_GAP;

export function ClientsTrust() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * SCROLL_STEP, behavior: "smooth" });
  };

  return (
    <Section theme="dark" className="py-20">
      {/* Header */}
      <div className="mb-15 flex items-end justify-between gap-10">
        <h2 className="text-hero-3 font-bold text-fg">
          6 Reasons Clients
          <br />
          Trust MitchDesigns
        </h2>
        <p className="max-w-[506px] text-xl text-fg-muted text-balance">
          Because choosing a digital partner shouldn&rsquo;t feel risky, it should feel right.
        </p>
      </div>

      {/* Slider */}
      <div className="relative mb-6">
        <div
          ref={trackRef}
          onScroll={updateArrows}
          className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {REASONS.map((reason) => (
            <ClientsTrustCard key={reason.title} {...reason} />
          ))}
        </div>

        {/* Nav arrows */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <div className="pointer-events-auto flex gap-2">
            {canScrollLeft && (
              <button
                onClick={() => scrollBy(-1)}
                aria-label="Previous"
                className="grid size-[100px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90"
              >
                <ArrowRight size={40} className="rotate-180" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollBy(1)}
                aria-label="Next"
                className="grid size-[100px] place-items-center rounded-full bg-yellow text-black transition-opacity hover:opacity-90"
              >
                <ArrowRight size={40} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button size="lg" asChild>
        <Link href="/quote">Get Detailed Proposal</Link>
      </Button>
    </Section>
  );
}
