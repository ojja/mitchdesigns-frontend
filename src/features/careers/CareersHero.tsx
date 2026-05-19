import { Section } from "@/components/layout/Section";

export function CareersHero() {
  return (
    <Section theme="dark" className="pt-25 pb-25">
      <div className="flex flex-col gap-6">
        <span className="text-lg font-medium text-yellow">Join Our Team</span>
        <div className="flex items-end justify-between gap-10">
          <h1 className="text-hero-1 font-black text-fg leading-[1.1] max-w-[44%]">
            Be Part Of Our Team
          </h1>
          <p className="text-xl text-fg max-w-[39%] text-balance">
            Join our team of passionate individuals dedicated to innovative web
            design. We embrace open communication, flat hierarchies, and empower
            you with full ownership of your work.
          </p>
        </div>
      </div>
    </Section>
  );
}
