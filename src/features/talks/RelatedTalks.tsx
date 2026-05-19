import Link from "next/link";
import type { Talk } from "@/lib/cms/types";
import { Section } from "@/components/layout/Section";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function TagPill({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-pill bg-yellow px-4 py-2 text-[14px] font-bold leading-[1.3] text-black">
      {label}
    </span>
  );
}

function RelatedCard({ talk }: { talk: Talk }) {
  return (
    <Link href={`/talks/${talk.slug}`} className="flex flex-1 flex-col gap-4">
      <div className="relative aspect-[676/402] w-full overflow-hidden rounded-[2px]">
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

      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex flex-wrap gap-2">
            {talk.tags?.map((tag) => <TagPill key={tag} label={tag} />)}
          </div>
          <span className="text-[16px] text-[#515151]">{formatDate(talk.date)}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3 className="text-[20px] font-medium leading-[1.3] text-black">{talk.title}</h3>
          <p className="text-balance text-[16px] leading-6 text-[#515151]">{talk.excerpt}</p>
        </div>
      </div>
    </Link>
  );
}

export function RelatedTalks({
  talks,
  heading = "More Talks",
}: {
  talks: Talk[];
  heading?: string;
}) {
  if (!talks.length) return null;

  return (
    <Section className="pt-10 pb-15">
      <div className="flex flex-col gap-[60px]">
        <h2 className="text-[60px] font-bold leading-[1.1] text-black">{heading}</h2>
        <div className="flex gap-10">
          {talks.map((t) => (
            <RelatedCard key={t.slug} talk={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}
