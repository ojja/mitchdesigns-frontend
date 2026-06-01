'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { easeOutSoft, fadeUp, stagger } from '@/lib/motion';

const DOTS_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='25' height='25' fill='%231d1d1b'/%3E%3C/svg%3E")`;

// ─── Floating card definitions ─────────────────────────────────────────────────
import type { CSSProperties } from 'react';
import { Hero } from './Hero';

type CardDef = {
  id: number;
  label: string;
  sub: string;
  image?: string;
  depth: number;
  pos: CSSProperties;
  centered?: boolean;
  rotate: number;
  width: number;
  aspectRatio: string;
  bg: string;
  border: string;
  baseZ?: number;
};

// baseZ controls stacking relative to the Hero text (which is z-10 via Section).
// Edge cards: baseZ 10 (above text on hover). Center cards: baseZ 2–4 (behind text).
const CARDS: CardDef[] = [
  // ── Outer / edge ──────────────────────────────────────────────────────────────
  {
    id: 1,
    label: 'Mountain View',
    sub: 'Website Design',
    image: 'https://picsum.photos/seed/mv/300/400',
    depth: 0.038,
    pos: { left: '2%', top: '10%' },
    rotate: -10,
    width: 190,
    aspectRatio: '3/4',
    bg: '#0b0f1a',
    border: '#ffdb00',
  },
  {
    id: 2,
    label: 'Real Estate',
    sub: 'Mobile App',
    image: 'https://picsum.photos/seed/re/300/400',
    depth: 0.065,
    pos: { right: '3%', top: '8%' },
    rotate: 9,
    width: 165,
    aspectRatio: '3/4',
    bg: '#120d1c',
    border: '#a855f7',
  },
  {
    id: 3,
    label: 'Orderbase',
    sub: 'SaaS Product',
    image: 'https://picsum.photos/seed/ob/400/260',
    depth: 0.028,
    pos: { left: '0%', bottom: '12%' },
    rotate: 7,
    width: 230,
    aspectRatio: '16/9',
    bg: '#0b1710',
    border: '#22c55e',
  },
  {
    id: 4,
    label: 'Travel Booking',
    sub: 'Product Design',
    image: 'https://picsum.photos/seed/tb/400/260',
    depth: 0.052,
    pos: { right: '2%', bottom: '16%' },
    rotate: -7,
    width: 200,
    aspectRatio: '16/9',
    bg: '#1a0e08',
    border: '#f97316',
  },
  // ── Top / bottom center ────────────────────────────────────────────────────────
  {
    id: 5,
    label: 'Brand Identity',
    sub: 'Visual Design',
    image: 'https://picsum.photos/seed/bi/320/240',
    depth: 0.044,
    pos: { left: '50%', top: '3%' },
    centered: true,
    rotate: -4,
    width: 170,
    aspectRatio: '4/3',
    bg: '#0a1015',
    border: '#06b6d4',
    baseZ: 2,
  },
  {
    id: 6,
    label: 'E-Commerce',
    sub: 'Web Platform',
    image: 'https://picsum.photos/seed/ec/400/260',
    depth: 0.035,
    pos: { left: '50%', bottom: '8%' },
    centered: true,
    rotate: 3,
    width: 240,
    aspectRatio: '16/9',
    bg: '#150f05',
    border: '#facc15',
    baseZ: 2,
  },
  // ── Inner / near-center ────────────────────────────────────────────────────────
  {
    id: 7,
    label: 'Fintech App',
    sub: 'Mobile Design',
    image: 'https://picsum.photos/seed/ft/260/360',
    depth: 0.055,
    pos: { left: '16%', top: '42%' },
    rotate: -6,
    width: 150,
    aspectRatio: '3/4',
    bg: '#050f1a',
    border: '#38bdf8',
    baseZ: 3,
  },
  {
    id: 8,
    label: 'Healthcare',
    sub: 'Web App',
    image: 'https://picsum.photos/seed/hc/260/360',
    depth: 0.06,
    pos: { right: '15%', top: '40%' },
    rotate: 6,
    width: 150,
    aspectRatio: '3/4',
    bg: '#0f0a1a',
    border: '#f472b6',
    baseZ: 3,
  },
  {
    id: 9,
    label: 'Food Delivery',
    sub: 'Mobile App',
    image: 'https://picsum.photos/seed/fd/220/300',
    depth: 0.07,
    pos: { left: '7%', top: '45%' },
    rotate: 11,
    width: 130,
    aspectRatio: '3/4',
    bg: '#1a0a05',
    border: '#fb923c',
    baseZ: 2,
  },
  {
    id: 10,
    label: 'EdTech Platform',
    sub: 'Web Design',
    image: 'https://picsum.photos/seed/et/220/300',
    depth: 0.042,
    pos: { right: '6%', top: '48%' },
    rotate: -10,
    width: 130,
    aspectRatio: '3/4',
    bg: '#081510',
    border: '#4ade80',
    baseZ: 2,
  },
];

// ─── FloatingCard ──────────────────────────────────────────────────────────────
function FloatingCard({
  card,
  rawX,
  rawY,
}: {
  card: CardDef;
  rawX: ReturnType<typeof useMotionValue<number>>;
  rawY: ReturnType<typeof useMotionValue<number>>;
}) {
  const [hovered, setHovered] = useState(false);

  const px = useTransform(rawX, (v) => v * card.depth);
  const py = useTransform(rawY, (v) => v * card.depth);

  const [aw, ah] = card.aspectRatio.split('/').map(Number);
  const aspectNum = aw / ah;

  return (
    <motion.div
      style={{
        position: 'absolute',
        x: px,
        y: py,
        ...card.pos,
        ...(card.centered ? { marginLeft: `${-card.width / 2}px` } : {}),
        zIndex: hovered ? 20 : (card.baseZ ?? 10),
      }}
      animate={{
        rotate: hovered ? 0 : card.rotate,
        scale: hovered ? 1.06 : 1,
      }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Card body */}
      <div
        style={{
          width: card.width,
          aspectRatio: card.aspectRatio,
          background: card.bg,
          borderRadius: 16,
          border: `1.5px solid`,
          borderColor: hovered ? card.border : 'rgba(255,255,255,0.08)',
          boxShadow: hovered
            ? `0 0 32px 0 ${card.border}44, 0 16px 48px rgba(0,0,0,0.6)`
            : '0 8px 32px rgba(0,0,0,0.5)',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Project image */}
        {card.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={card.image}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: hovered ? 0.85 : 0.55,
              transition: 'opacity 0.3s ease',
            }}
          />
        )}

        {/* Decorative grid lines */}
        <svg
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0.15,
          }}
        >
          <defs>
            <pattern
              id={`grid-${card.id}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${card.id})`} />
        </svg>

        {/* Accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: card.border,
            opacity: hovered ? 1 : 0.4,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Label overlay */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25, ease: easeOutSoft }}
          style={{
            position: 'relative',
            padding: '10px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
          }}
        >
          <p
            style={{
              margin: 0,
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: '0.01em',
              lineHeight: 1.2,
            }}
          >
            {card.label}
          </p>
          <p
            style={{
              margin: 0,
              color: card.border,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {card.sub}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Custom cursor ─────────────────────────────────────────────────────────────
function Cursor({
  rawX,
  rawY,
  hovering,
}: {
  rawX: ReturnType<typeof useMotionValue<number>>;
  rawY: ReturnType<typeof useMotionValue<number>>;
  hovering: boolean;
}) {
  // These spring values track absolute page position
  const cx = useSpring(rawX, { stiffness: 300, damping: 30 });
  const cy = useSpring(rawY, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        left: cx,
        top: cy,
        translateX: '-50%',
        translateY: '-50%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      animate={{
        width: hovering ? 56 : 24,
        height: hovering ? 56 : 24,
        opacity: hovering ? 0.7 : 0.4,
      }}
      transition={{ type: 'spring', stiffness: 250, damping: 24 }}
      className="rounded-full border border-yellow"
    />
  );
}

// ─── CreativeHero ──────────────────────────────────────────────────────────────
export function CreativeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [cardHovered, setCardHovered] = useState(false);

  // Absolute cursor position (for the visual cursor ring)
  const absX = useMotionValue(-200);
  const absY = useMotionValue(-200);

  // Cursor offset from section center (for parallax — range roughly ±viewport/2)
  const relX = useMotionValue(0);
  const relY = useMotionValue(0);

  // Smooth spring for parallax
  const springX = useSpring(relX, { stiffness: 50, damping: 18 });
  const springY = useSpring(relY, { stiffness: 50, damping: 18 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onMove = (e: MouseEvent) => {
      absX.set(e.clientX);
      absY.set(e.clientY);

      const rect = section.getBoundingClientRect();
      relX.set(e.clientX - (rect.left + rect.width / 2));
      relY.set(e.clientY - (rect.top + rect.height / 2));
    };

    section.addEventListener('mousemove', onMove);
    return () => section.removeEventListener('mousemove', onMove);
  }, [absX, absY, relX, relY]);

  return (
    <>
      <Cursor rawX={absX} rawY={absY} hovering={cardHovered} />

      <section
        ref={sectionRef}
        data-theme="dark"
        className="relative overflow-hidden"
        style={{ minHeight: '100svh', background: '#060606' }}
      >
        {/* Dots pattern */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{ backgroundImage: DOTS_BG, backgroundSize: '50px 50px' }}
        />

        {/* Radial gradient glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,219,0,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Floating cards */}
        <div
          aria-hidden
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          className="pointer-events-none absolute inset-0"
          style={{ pointerEvents: 'none' }}
        >
          {CARDS.map((card) => (
            <div
              key={card.id}
              style={{ pointerEvents: 'auto' }}
              onMouseEnter={() => setCardHovered(true)}
              onMouseLeave={() => setCardHovered(false)}
            >
              <FloatingCard card={card} rawX={springX} rawY={springY} />
            </div>
          ))}
        </div>

        <div className="relative" style={{ zIndex: 30 }}>
          <Hero
            eyebrow="MitchDesigns — Website & Mobile App Design Company Based in Egypt"
            headline="Start Building Digital Experiences that"
          />
        </div>
      </section>
    </>
  );
}
