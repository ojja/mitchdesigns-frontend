"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useMotionValue, animate, motion } from "framer-motion";
import Image from "next/image";
import { Section } from "@/components/layout/Section";

export interface LogoEntry {
  src: string;
  alt: string;
}

// Fixture logos — replaced by Strapi media gallery when wired
export const fixtureLogos: LogoEntry[] = [
  { src: "/images/client-logos/d4adcf3bc98557a16755015c4af3cc3f4e4a3f92.png", alt: "El Gouna" },
  { src: "/images/client-logos/Joula.png", alt: "Joula" },
  { src: "/images/client-logos/sh.png", alt: "Sally Helmy" },
  { src: "/images/client-logos/mg.png", alt: "MG" },
  { src: "/images/client-logos/exc.png", alt: "Exception Pâtissier" },
  { src: "/images/client-logos/b15c5fd6de0f860a24f79b5cae3a4ec0d8850e85.png", alt: "Cairo Cooking" },
  { src: "/images/client-logos/25adc2a1534f6d2da6a579e0b4fa63c517a1cd3e.png", alt: "Ras Soma" },
  { src: "/images/client-logos/gobill.png", alt: "Gobill" },
  { src: "/images/client-logos/Almaza.png", alt: "Almaza Bay" },
  { src: "/images/client-logos/lychee.png", alt: "Lychee" },
  { src: "/images/client-logos/gobus.png", alt: "gobus" },
  { src: "/images/client-logos/gdev.png", alt: "G Developments" },
  { src: "/images/client-logos/mv.png", alt: "Mountain View" },
  { src: "/images/client-logos/qwell.png", alt: "qwell" },
  { src: "/images/client-logos/abu-auf.png", alt: "Abu Auf" },
];

const GRID_SIZE = 15;

const HALF_DURATION = 0.55;
const EASE_IN: [number, number, number, number] = [0.65, 0, 1, 0];
const EASE_OUT: [number, number, number, number] = [0, 0, 0.35, 1];
const MIN_DELAY = 2000;
const MAX_DELAY = 4500;

/** Pick a random item from pool, excluding `exclude`. Wraps to any item if pool has only one. */
function pickNext(pool: LogoEntry[], exclude: LogoEntry): LogoEntry {
  const candidates = pool.length > 1 ? pool.filter((l) => l !== exclude) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)]!;
}

/** Assign a random starting logo to each of the 15 grid slots (no two adjacent start on the same logo). */
function buildInitial(pool: LogoEntry[]): LogoEntry[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => pool[i % pool.length]!);
}

// One global animation lock so only one card flips at a time
let activeCard: number | null = null;

function LogoCard({
  pool,
  initial,
  cardId,
}: {
  pool: LogoEntry[];
  initial: LogoEntry;
  cardId: number;
}) {
  const rotY = useMotionValue(0);
  const [logo, setLogo] = useState(initial);
  const nextLogoRef = useRef<LogoEntry>(pickNext(pool, initial));
  const mountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    mountedRef.current = true;

    const getRandomDelay = () =>
      Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY);

    const tryFlip = () => {
      if (!mountedRef.current) return;

      if (activeCard !== null) {
        timeoutRef.current = setTimeout(tryFlip, 250);
        return;
      }

      activeCard = cardId;

      // Phase 1: rotate to 90° (edge-on — card invisible)
      animate(rotY, 90, {
        duration: HALF_DURATION,
        ease: EASE_IN,
        onComplete() {
          if (!mountedRef.current) return;
          const incoming = nextLogoRef.current;
          // Swap image while card is edge-on (invisible) — zero flash
          flushSync(() => setLogo(incoming));
          nextLogoRef.current = pickNext(pool, incoming);
          if (!mountedRef.current) return;
          // Phase 2: rotate back to 0° revealing the new logo
          rotY.set(-90);
          animate(rotY, 0, {
            duration: HALF_DURATION,
            ease: EASE_OUT,
            onComplete() {
              if (!mountedRef.current) return;
              activeCard = null;
              timeoutRef.current = setTimeout(tryFlip, getRandomDelay());
            },
          });
        },
      });
    };

    timeoutRef.current = setTimeout(tryFlip, getRandomDelay());

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (activeCard === cardId) activeCard = null;
    };
  }, [cardId, pool, rotY]);

  return (
    <div className="min-w-0 flex-1" style={{ perspective: "900px" }}>
      <motion.div
        className="flex h-[200px] w-full items-center justify-center rounded-[4px] border border-[#414141] px-6"
        style={{ rotateY: rotY }}
      >
        <Image src={logo.src} alt={logo.alt} width={200} height={80} className="max-h-[50%] max-w-[65%] object-contain" />
      </motion.div>
    </div>
  );
}

export interface ClientLogosProps {
  /** Full logo pool from CMS. Defaults to fixture logos. Any length ≥ 1. */
  logos?: LogoEntry[];
}

export function ClientLogos({ logos = fixtureLogos }: ClientLogosProps) {
  const initials = useMemo(() => buildInitial(logos), [logos]);

  const rows = [
    initials.slice(0, 5),
    initials.slice(5, 10),
    initials.slice(10, 15),
  ] as const;

  return (
    <Section theme="dark">
      <div className="flex flex-col gap-[60px] py-20">
        <h2 className="text-hero-2 font-bold tracking-[0.01em] text-white">
          Our <span className="text-yellow">Agency</span> Experience
        </h2>

        <div className="flex flex-col gap-4">
          {rows.map((row, ri) => (
            <div key={ri} className="flex gap-4">
              {row.map((initial, ci) => {
                const cardId = ri * 5 + ci;
                return (
                  <LogoCard
                    key={cardId}
                    cardId={cardId}
                    pool={logos}
                    initial={initial}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
