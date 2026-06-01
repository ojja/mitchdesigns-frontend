"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";

// ── helpers ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 3;

const CATEGORIES = ["All", "Corporate", "eCommerce", "Booking Website", "Mobile App"];

// ── sub-components ─────────────────────────────────────────────────────────

function ServiceBullet({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-1">
      <span className="size-1 shrink-0 rounded-full bg-space-grey" aria-hidden />
      <span className="text-[12px] leading-[1.3] text-space-grey">{label}</span>
    </li>
  );
}

function CaseStudyRow({ cs }: { cs: CaseStudy & { id: number } }) {
  return (
    <Link
      href={`/case-studies/${cs.slug}`}
      className="flex w-full overflow-hidden rounded-[2px]"
    >
      {/* Left — info panel */}
      <div className="flex w-[30%] shrink-0 flex-col justify-between bg-white p-6">
        {/* Logo */}
        <div className="h-[70px] w-full">
          {cs.logo?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cs.logo.url}
              alt={cs.logo.alternativeText ?? cs.client}
              className="h-full max-w-[120px] object-contain object-left"
            />
          ) : (
            <span className="text-[14px] font-medium text-space-grey">{cs.client}</span>
          )}
        </div>

        {/* Title + divider + services */}
        <div className="flex flex-col gap-5">
          <h3 className="whitespace-pre-line text-[48px] font-bold leading-[1.1] text-black">
            {cs.title}
          </h3>
          <div className="h-px w-full bg-black/20" />
          <ul className="flex flex-col gap-1">
            {cs.services.map((s) => (
              <ServiceBullet key={s} label={s} />
            ))}
          </ul>
        </div>
      </div>

      {/* Center — cover image */}
      <div className="relative flex-1 overflow-hidden">
        {cs.cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.cover.url}
            alt={cs.cover.alternativeText ?? cs.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      {/* Right — testimonial panel */}
      <div className="flex w-[30%] shrink-0 flex-col justify-between bg-space-grey p-10">
        {/* Opening quote mark */}
        <span className="text-[92px] font-black leading-none text-yellow">&ldquo;</span>

        {/* Quote */}
        {cs.testimonial ? (
          <p className="text-[32px] font-bold leading-[1.1] text-white">
            {cs.testimonial.quote}
          </p>
        ) : null}

        {/* Author */}
        {cs.testimonial ? (
          <div className="flex flex-col gap-10">
            <div className="h-px w-full bg-[#878787]" />
            <div className="flex items-center gap-5">
              {cs.testimonial.avatar?.url ? (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full">
                  <img
                    src={cs.testimonial.avatar.url}
                    alt={cs.testimonial.author}
                    className="absolute inset-0 size-full object-cover"
                  />
                </div>
              ) : (
                <div className="size-16 shrink-0 rounded-full bg-[#444]" />
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[24px] font-medium leading-tight text-white">
                  {cs.testimonial.author}
                </span>
                <span className="text-[16px] leading-tight text-yellow">
                  {cs.testimonial.role}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export type CaseStudyGridProps = {
  caseStudies: Array<CaseStudy & { id: number }>;
  title?: string;
  description?: string;
};

export function CaseStudyGrid({
  caseStudies,
  title = "Case Studies",
  description = "We don't just promise results — we prove them. These case studies show how we've helped businesses launch, grow, and succeed.",
}: CaseStudyGridProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === "All"
    ? caseStudies
    : caseStudies.filter(
        (cs) => cs.category === activeCategory || cs.services.includes(activeCategory),
      );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory]);

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    setVisibleCount((n) => n + PAGE_SIZE);
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <Section theme="dark" className="py-20">
      <div className="flex flex-col gap-[60px]">
        {/* Header */}
        <div className="flex items-end justify-between gap-10">
          <h1 className="text-[92px] font-black leading-[1.1] text-white">{title}</h1>
          <p className="max-w-[37%] text-[24px] leading-[125%] text-white">{description}</p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={
                cat === activeCategory
                  ? "rounded-pill bg-yellow px-6 py-3 text-[16px] font-medium text-black"
                  : "rounded-pill border border-[#d6d6d6] px-6 py-3 text-[16px] font-medium text-[#d6d6d6]"
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-[60px]">
          {visible.map((cs) => (
            <CaseStudyRow key={cs.id} cs={cs} />
          ))}
        </div>

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-1" aria-hidden />
      </div>
    </Section>
  );
}
