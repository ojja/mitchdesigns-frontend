import Link from "next/link";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";

// ── helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── sub-components ─────────────────────────────────────────────────────────

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-yellow px-4 py-2 text-[14px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-black">
      {label}
    </span>
  );
}

function Meta({ date, readTime }: { date: string; readTime?: number }) {
  return (
    <div className="flex items-center gap-3 text-[16px] leading-tight tracking-[0.01em] text-[#515151]">
      <span className="whitespace-nowrap">{formatDate(date)}</span>
      {readTime != null && (
        <>
          <span className="size-1 rounded-full bg-[#515151]" aria-hidden />
          <span className="whitespace-nowrap">{readTime} min read</span>
        </>
      )}
    </div>
  );
}

// ── Featured card (full-width hero row) ────────────────────────────────────

function FeaturedCard({ talk }: { talk: Talk }) {
  return (
    <Link
      href={`/talks/${talk.slug}`}
      className="flex w-full items-start gap-10"
    >
      {/* Image — 55% width, 4:3 aspect */}
      <div className="relative aspect-676/500 w-[55%] shrink-0 overflow-hidden rounded-[4px]">
        {talk.cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      {/* Content — fills remaining space, matches image height via self-stretch */}
      <div className="flex flex-1 self-stretch flex-col items-start justify-between py-10">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            {talk.tags?.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
          <Meta date={talk.date} readTime={talk.readTime} />
        </div>

        <div className="flex flex-col gap-2.5">
          <h2 className="text-[40px] font-bold leading-[1.1] tracking-[0.01em] text-[#07020d]">
            {talk.title}
          </h2>
          <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Regular card (used in 2-col grid) ─────────────────────────────────────

function TalkCard({ talk }: { talk: Talk }) {
  return (
    <Link
      href={`/talks/${talk.slug}`}
      className="flex min-w-0 flex-1 flex-col gap-4"
    >
      {/* Image — natural 4:3 aspect, no fixed height */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-[2px]">
        {talk.cover?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={talk.cover.url}
            alt={talk.cover.alternativeText ?? talk.title}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#e5e5e5]" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {talk.tags?.map((tag) => (
              <TagPill key={tag} label={tag} />
            ))}
          </div>
          <Meta date={talk.date} readTime={talk.readTime} />
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-medium leading-[1.3] tracking-[0.01em] text-[#07020d]">
            {talk.title}
          </h3>
          <p className="text-[16px] leading-6 tracking-[0.01em] text-[#515151]">
            {talk.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export interface TalksListProps {
  talks: Talk[];
  title?: string;
  subtitle?: string;
}

export function TalksList({
  talks,
  title = "Talks",
  subtitle = "Explore Insights, Stories, and Ideas Shaping Creativity and Modern Design.",
}: TalksListProps) {
  const featured = talks.find((t) => t.featured);
  const rest = talks.filter((t) => !t.featured);

  const rows: [Talk, Talk | undefined][] = [];
  for (let i = 0; i < rest.length; i += 2) {
    rows.push([rest[i]!, rest[i + 1]]);
  }

  return (
    <Section className="py-[120px]">
      <div className="flex flex-col gap-[100px]">
        {/* Page heading */}
        <div className="flex items-end justify-between leading-[1.1]">
          <h1 className="text-[92px] font-black tracking-[0.01em] text-space-grey">
            {title}
          </h1>
          <p className="max-w-[40%] text-[32px] font-bold tracking-[0.01em] text-space-grey">
            {subtitle}
          </p>
        </div>

        {/* Post list */}
        <div className="flex flex-col gap-10">
          {featured && <FeaturedCard talk={featured} />}

          {rows.map(([a, b], i) => (
            <div key={i} className="flex gap-10">
              <TalkCard talk={a} />
              {b && <TalkCard talk={b} />}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
