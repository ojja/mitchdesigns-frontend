import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { fixtureCaseStudies } from "@/lib/cms/fixtures";
import { CaseStudyGrid } from "@/features/work";

export const metadata: Metadata = {
  title: "Case Studies — Websites & Apps We've Built",
  description:
    "Browse MitchDesigns' portfolio — websites, mobile apps, and custom platforms built for top Egyptian and regional brands including El Gouna, Lychee, and G Developments.",
  openGraph: {
    title: "Case Studies — Websites & Apps We've Built",
    description:
      "Browse MitchDesigns' portfolio — websites, mobile apps, and custom platforms built for top Egyptian and regional brands.",
    url: "https://mitchdesigns.com/case-studies",
  },
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MitchDesigns Case Studies",
    itemListElement: fixtureCaseStudies.map((study, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mitchdesigns.com/case-studies/${study.slug}`,
      name: study.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <CaseStudyGrid caseStudies={fixtureCaseStudies} />
    </>
  );
}
