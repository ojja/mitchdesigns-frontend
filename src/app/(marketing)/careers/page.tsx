import type { Metadata } from "next";
import { CareersHero } from "@/features/careers/CareersHero";
import { OurDrive } from "@/features/careers/OurDrive";
import { OpenPositions } from "@/features/careers/OpenPositions";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles at MitchDesigns.",
};

export default function CareersIndexPage() {
  return (
    <main>
      <CareersHero />
      <OurDrive />
      <OpenPositions />
    </main>
  );
}
