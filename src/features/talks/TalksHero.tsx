import { Section } from "@/components/layout/Section";
import { RichText } from "@/components/ui/RichText";

interface TalksHeroProps {
  heading?: string;
  subheading?: unknown;
}

export function TalksHero({
  heading = "Talks",
  subheading,
}: TalksHeroProps) {
  return (
    <Section className="py-[120px] pb-0">
      <div className="flex items-end justify-between">
        <h1 className="font-black text-[92px] leading-[1.1] text-space-grey">
          {heading}
        </h1>
        <div className="max-w-[517px] text-[32px] font-bold leading-[1.1] text-space-grey">
          {subheading ? (
            <RichText content={subheading} />
          ) : (
            <p className="text-balance">
              Explore Insights, Stories, and Ideas Shaping Creativity and Modern Design.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
