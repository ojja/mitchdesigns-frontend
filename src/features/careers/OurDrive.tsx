import { Section } from "@/components/layout/Section";

const drives = [
  { label: "Open Communication" },
  { label: "Flat Hierarchies" },
  { label: "Full Ownership" },
  { label: "Innovative Culture" },
];

export function OurDrive() {
  return (
    <Section theme="dark" className="py-25">
      <div className="flex gap-5">
        {drives.map(({ label }) => (
          <div
            key={label}
            className="flex-1 min-h-87 rounded-card border border-border shadow-soft-lg flex items-center justify-center"
          >
            <span className="text-lg text-fg-muted font-medium text-center text-balance px-6">
              {label}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
