import Link from "next/link";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { ArrowRight } from "@/components/icons/ArrowRight";

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-pill bg-yellow px-4 py-2 text-[14px] font-bold leading-[1.3] text-black">
      {label}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TalkHero({ talk }: { talk: Talk }) {
  return (
    <Section theme="dark" className="pt-20 pb-10">
      <div className="flex flex-col gap-10">
        {/* Two-column header row — aligned to bottom */}
        <div className="flex items-end gap-10">
          {/* Left: go-back + title */}
          <div className="flex w-1/2 shrink-0 flex-col justify-between gap-10">
            <Link
              href="/talks"
              className="inline-flex items-center gap-2 text-[16px] text-[#d6d6d6]"
            >
              <ArrowRight size={20} className="rotate-180" />
              Go Back
            </Link>
            <h1 className="text-[60px] font-bold leading-[1.1] text-white">
              {talk.title}
            </h1>
          </div>

          {/* Right: meta + tags + excerpt — bottom aligned */}
          <div className="flex flex-1 flex-col items-start gap-6">
            {/* Date + read time */}
            <div className="flex items-center gap-3 text-[16px] text-[#d6d6d6]">
              {(talk.publishedAt ?? talk.date) && (
                <span>{formatDate((talk.publishedAt ?? talk.date)!)}</span>
              )}
              {talk.readTime != null && (
                <>
                  <span className="size-1 rounded-full bg-[#d6d6d6]" aria-hidden />
                  <span>{talk.readTime} min read</span>
                </>
              )}
            </div>

            {/* Tags */}
            {(talk.category ?? talk.tags?.length) && (
              <div className="flex flex-wrap gap-2">
                {talk.category
                  ? <TagPill label={talk.category} />
                  : talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)
                }
              </div>
            )}

            {/* Excerpt */}
            <p className="text-balance text-[16px] leading-6 text-[#d6d6d6]">
              {talk.excerpt}
            </p>
          </div>
        </div>

        {/* Cover image — full width */}
        {talk.cover?.url && (
          <div className="relative aspect-[1392/450] w-full overflow-hidden rounded-[4px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={talk.cover.url}
              alt={talk.cover.alternativeText ?? talk.title}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        )}
      </div>
    </Section>
  );
}
