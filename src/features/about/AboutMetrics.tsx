import { Section } from "@/components/layout/Section";

const METRICS = [
  { value: "20+", label: "Years of experience," },
  { value: "400+", label: "Projects Delivered" },
  { value: "30+", label: "Dedicated Experts" },
] as const;

export function AboutMetrics() {
  return (
    <Section className="py-15">
      <div className="flex items-center justify-center gap-25">
        {METRICS.map(({ value, label }) => (
          <div key={value} className="flex flex-col items-start">
            <span className="text-hero-2 font-bold leading-[72px] text-black">
              {value}
            </span>
            <span className="text-sm text-fg-muted">{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
