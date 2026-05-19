import Image from "next/image";
import { Section } from "@/components/layout/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { SupportSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

export function SupportSection({ title, cards }: SupportSectionProps) {
  return (
    <Section theme="beige" className="py-20 md:py-28">
      <div className="space-y-12">
        <SectionHeader title={title} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-5 rounded-card-sm bg-bg p-6"
            >
              <div className="relative aspect-video overflow-hidden rounded-card-sm">
                <Image
                  src={card.image}
                  alt={card.imageAlt ?? ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <h3 className="text-lg font-semibold text-fg">{card.title}</h3>
              <RichText content={card.description} className="text-base text-fg-muted" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
