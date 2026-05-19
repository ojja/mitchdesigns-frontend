"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/layout/Section";
import { easeOutSoft } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { FAQ } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

type FAQSectionProps = {
  faqs: Array<FAQ & { id: number }>;
  title?: React.ReactNode;
  description?: string;
  categories?: string[];
  defaultCategory?: string;
  defaultOpenId?: number;
  ctaHref?: string;
};

function ChevronRight() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6.75 4.5 11.25 9l-4.5 4.5" />
    </svg>
  );
}

export function FAQSection({
  faqs,
  title = "Got Questions?",
  description = "We've answered the most common ones to help you understand how we work and what to expect.",
  categories,
  defaultCategory,
  defaultOpenId,
  ctaHref = "/faqs",
}: FAQSectionProps) {
  const derivedCategories =
    categories ??
    Array.from(new Set(faqs.map((f) => f.category).filter(Boolean) as string[]));

  const hasCategories = derivedCategories.length > 0;
  const [activeCategory, setActiveCategory] = useState<string>(
    defaultCategory ?? derivedCategories[0] ?? ""
  );
  const [openId, setOpenId] = useState<number | null>(defaultOpenId ?? null);

  const visibleFaqs =
    hasCategories && activeCategory
      ? faqs.filter((f) => !f.category || f.category === activeCategory)
      : faqs;

  return (
    <Section theme="dark" className="py-24 md:py-32">
      <div className="flex flex-col items-center gap-12">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-hero-2 font-bold text-white">{title}</h2>
          {description && (
            <p className="max-w-md text-base text-fg-muted">{description}</p>
          )}
        </div>

        {/* Category tabs */}
        {hasCategories && (
          <div className="flex flex-wrap justify-center gap-3">
            {derivedCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenId(null);
                }}
                className={cn(
                  "rounded-pill border px-5 py-2.5 text-sm font-medium transition-colors",
                  activeCategory === cat
                    ? "border-white bg-space-grey text-white"
                    : "border-border bg-space-grey text-fg-muted hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* FAQ cards */}
        <div className="flex w-full max-w-2xl flex-col gap-3">
          {visibleFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="rounded-card-sm bg-space-grey">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-${faq.id}`}
                  className="flex w-full items-center gap-4 px-6 py-5 text-left"
                >
                  <span
                    className={cn(
                      "shrink-0 text-fg-muted transition-transform duration-300",
                      isOpen && "rotate-90"
                    )}
                  >
                    <ChevronRight />
                  </span>
                  <span className="text-base font-medium text-white">
                    {faq.question}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: easeOutSoft }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pl-14">
                        <RichText content={faq.answer} className="text-sm leading-relaxed text-fg-muted" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="rounded-pill bg-space-grey px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-bg-alt"
        >
          Explore All FAQs
        </Link>
      </div>
    </Section>
  );
}
