import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { strapiMedia } from "@/lib/cms/media";
import type { TechItem } from "@/lib/cms/types";

type TechStackProps = {
  items: Array<TechItem & { id: number }>;
  title: React.ReactNode;
  description?: string;
};

function formatCategory(category: string): string {
  return category
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function TechStack({ items, title, description }: TechStackProps) {
  return (
    <Section className="py-20">
      <div className="flex items-start justify-between gap-10">
        {/* Left: heading + description */}
        <div className="flex max-w-[415px] shrink-0 flex-col gap-4">
          <div className="relative">
            <h2 className="relative z-10 text-hero-4 font-bold leading-[110%] text-space-grey">
              {title}
            </h2>
            <span
              aria-hidden
              className="absolute bottom-1.5 left-0 h-3.5 w-5/6 bg-yellow"
            />
          </div>
          {description && (
            <p className="text-xl leading-[130%] text-fg-muted text-balance">
              {description}
            </p>
          )}
        </div>

        {/* Right: 3-col grid of tech cards */}
        <div className="grid grid-cols-3 gap-6">
          {items.map((t) => {
            // const logo = strapiMedia(t.logo?.url);
            const logo = t.logo?.url;
            return (
              <div
                key={t.id}
                className="flex h-[100px] w-[300px] items-center gap-5 rounded-card-sm border border-tech-card-border bg-white p-5 shadow-tech-card"
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt={t.name}
                    width={60}
                    height={60}
                    className="size-[60px] shrink-0 object-contain"
                  />
                ) : (
                  <span className="size-[60px] shrink-0 rounded-lg bg-bg-alt" />
                )}
                <div className="flex flex-col">
                  <span className="text-xl font-medium leading-[125%] text-space-grey">
                    {t.name}
                  </span>
                  <span className="text-base font-medium leading-[125%] text-fg-muted">
                    {formatCategory(t.category)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
