"use client";

import { Section } from "@/components/layout/Section";
import { Marquee } from "@/components/ui/Marquee";

const PHOTOS = [1, 2, 3, 4, 5, 6] as const;

export function InnovateMarquee() {
  return (
    <Section theme="dark" bleed className="overflow-hidden">
      {/* Scrolling "Innovate Or Die" text */}
      <div className="py-10 overflow-hidden">
        <Marquee speed={80} gap={120} pauseOnHover={false}>
          <span
            className="shrink-0 font-bold text-jumbo leading-none bg-gradient-to-r from-black to-yellow bg-clip-text text-transparent whitespace-nowrap"
            aria-hidden
          >
            Innovate Or Die
          </span>
        </Marquee>
        <p className="sr-only">Innovate Or Die</p>
      </div>

      {/* Photo strip */}
      <div className="relative pb-20 pt-12">
        <div className="flex gap-5 overflow-hidden">
          {PHOTOS.map((i) => (
            <div
              key={i}
              className="h-[470px] w-[286px] shrink-0 rounded-sm bg-space-grey"
              aria-hidden
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
