import Link from "next/link";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";
import { ArrowRight } from "@/components/icons/ArrowRight";

// ── TOC ────────────────────────────────────────────────────────────────────

export type TocItem = { label: string; href: string };

function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <div className="flex gap-5">
      {/* Yellow/beige 4px bar */}
      <div className="w-1 shrink-0 rounded-full bg-[#f9f7f1]" />
      <ul className="flex flex-col gap-5 py-1.5">
        {items.map((item, i) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={
                i === 0
                  ? "text-[14px] font-medium leading-[1.3] text-black"
                  : "text-[14px] leading-[1.3] text-[#575757]"
              }
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Social share ───────────────────────────────────────────────────────────

function ShareButtons({ url, title }: { url: string; title: string }) {
  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M20 6h-3a5 5 0 0 0-5 5v3H9v4h3v8h4v-8h3l1-4h-4V11a1 1 0 0 1 1-1h3V6Z"
            fill="#ffdb00"
          />
        </svg>
      ),
    },
    {
      label: "Instagram",
      href: `https://www.instagram.com/`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <rect x="4" y="4" width="24" height="24" rx="6" stroke="#ffdb00" strokeWidth="2" />
          <circle cx="16" cy="16" r="5" stroke="#ffdb00" strokeWidth="2" />
          <circle cx="22.5" cy="9.5" r="1.5" fill="#ffdb00" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`,
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
          <path
            d="M8 12h4v12H8V12ZM10 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM14 12h3.6v1.7h.05c.5-.95 1.7-1.95 3.5-1.95C24.6 11.75 25 14 25 17v7h-4v-6.2c0-1.5-.03-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V24H14V12Z"
            fill="#ffdb00"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[14px] font-medium text-black">Share Talk via:</span>
      <div className="flex gap-3">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${l.label}`}
            className="flex size-10 items-center justify-center rounded-[6px] bg-black p-1"
          >
            {l.icon}
          </a>
        ))}
      </div>
    </div>
  );
}

// ── Body renderer ──────────────────────────────────────────────────────────

function TalkBody({ body }: { body?: unknown }) {
  if (!body) return null;

  if (typeof body === "string") {
    return (
      <div className="flex flex-col gap-[60px]">
        {body.split(/\n{2,}/).map((para, i) => (
          <p key={i} className="text-balance text-[24px] leading-[170%] text-black">
            {para.trim()}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

// ── Nav buttons ────────────────────────────────────────────────────────────

function NavButton({
  href,
  label,
  direction,
}: {
  href: string;
  label: string;
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-pill bg-space-grey px-9 py-4 text-[16px] font-medium text-white"
    >
      {direction === "prev" && <ArrowRight size={20} className="rotate-180" />}
      {label}
      {direction === "next" && <ArrowRight size={20} />}
    </Link>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

export interface TalkContentProps {
  talk: Talk;
  toc?: TocItem[];
  prev?: Pick<Talk, "slug" | "title">;
  next?: Pick<Talk, "slug" | "title">;
  pageUrl?: string;
}

export function TalkContent({
  talk,
  toc = [],
  prev,
  next,
  pageUrl = `https://mitchdesigns.com/talks/${talk.slug}`,
}: TalkContentProps) {
  return (
    <Section className="py-10">
      <div className="flex gap-10">
        {/* Left sticky sidebar */}
        <aside className="w-[439px] shrink-0">
          <div className="sticky top-24 flex flex-col gap-[30px] py-10">
            <TableOfContents items={toc} />
            <ShareButtons url={pageUrl} title={talk.title} />
          </div>
        </aside>

        {/* Right content */}
        <div className="flex flex-1 flex-col gap-[100px]">
          <TalkBody body={talk.body} />

          {/* Prev / Next navigation */}
          {(prev || next) && (
            <div className="flex items-center justify-between">
              {prev ? (
                <NavButton href={`/talks/${prev.slug}`} label="Previous Talk" direction="prev" />
              ) : (
                <span />
              )}
              {next ? (
                <NavButton href={`/talks/${next.slug}`} label="Next Talk" direction="next" />
              ) : (
                <span />
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
