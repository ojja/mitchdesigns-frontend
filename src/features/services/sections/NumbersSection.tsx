import { Section } from "@/components/layout/Section";
import { CountUp } from "@/components/ui/CountUp";
import type { NumbersSectionProps } from "@/lib/cms/types";

export function NumbersSection({ numbers }: NumbersSectionProps) {
  return (
    <Section theme="dark" className="py-20 md:py-28">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {numbers.map((item) => (
          <div key={item.title} className="flex flex-col gap-2">
            <dt className="text-hero-3 font-bold text-fg md:text-hero-2">
              <CountUp value={item.value} />
            </dt>
            <dd className="text-lg font-semibold text-fg">{item.title}</dd>
            {item.description && (
              <p className="text-sm text-fg-muted text-balance">{item.description}</p>
            )}
          </div>
        ))}
      </dl>
    </Section>
  );
}
