import { Section } from "@/components/layout/Section";
import type { BriefSectionProps } from "@/lib/cms/types";
import { RichText } from "@/components/ui/RichText";

export function BriefSection({ description, signature }: BriefSectionProps) {
  return (
    <Section theme="beige" className="py-20 md:py-28">
      <div className="mx-auto max-w-4xl space-y-8 text-center">
        <blockquote className="text-hero-4 font-bold leading-snug md:text-hero-3">
          <RichText content={description} />
        </blockquote>
        {signature && (
          <p className="font-signature text-4xl text-fg-muted">{signature}</p>
        )}
      </div>
    </Section>
  );
}
