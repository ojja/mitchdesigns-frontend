import type { Metadata } from "next";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { fixtureFAQs } from "@/lib/cms/fixtures";

export const metadata: Metadata = {
  title: "FAQs — MitchDesigns Design & Development",
  description:
    "Get answers to common questions about website design, mobile app development, eCommerce, media buying, and SEO at MitchDesigns. Transparent pricing, timelines, and process.",
  openGraph: {
    title: "FAQs — MitchDesigns Design & Development",
    description:
      "Common questions about working with MitchDesigns — pricing, timelines, tech stack, and process.",
    url: "https://mitchdesigns.com/faqs",
  },
  alternates: { canonical: "/faqs" },
};

export default function FAQsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: fixtureFAQs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      <Section className="pt-32 pb-24">
        <h1 className="text-hero-2 font-bold">Frequently asked questions</h1>
        {/* TODO: FAQSection (blocks/) */}
      </Section>
    </>
  );
}
