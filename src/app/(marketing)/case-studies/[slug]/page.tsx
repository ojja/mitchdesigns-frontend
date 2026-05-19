import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseStudies, getCaseStudy } from "@/lib/cms";
import { fixtureCaseStudies } from "@/lib/cms/fixtures";
import type { CaseStudy } from "@/lib/cms/types";

type Params = { slug: string };

async function resolveStudy(slug: string): Promise<CaseStudy | null> {
  try {
    const cms = await getCaseStudy(slug);
    if (cms) return cms;
  } catch { /* fall through */ }
  return fixtureCaseStudies.find((s) => s.slug === slug) ?? null;
}

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const studies = await getCaseStudies();
    if (studies.length) return studies.map((s) => ({ slug: s.slug }));
  } catch { /* fall through */ }
  return fixtureCaseStudies.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = await resolveStudy(slug);

  if (!study) return { title: slug.replace(/-/g, " ") };

  const title = `${study.title} — Case Study`;
  const description =
    study.tagline ||
    `How MitchDesigns designed and built ${study.title} for ${study.client}.`;

  return {
    title,
    description,
    alternates: { canonical: `/case-studies/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://mitchdesigns.com/case-studies/${slug}`,
      ...(study.cover?.url ? { images: [{ url: study.cover.url }] } : {}),
    },
  };
}

export default async function SingleCaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const study = await resolveStudy(slug);
  if (!study) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mitchdesigns.com" },
      { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://mitchdesigns.com/case-studies" },
      { "@type": "ListItem", position: 3, name: study.title, item: `https://mitchdesigns.com/case-studies/${slug}` },
    ],
  };

  const creativeWorkSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.tagline,
    creator: { "@type": "Organization", name: "MitchDesigns", url: "https://mitchdesigns.com" },
    datePublished: study.publishedAt,
    url: `https://mitchdesigns.com/case-studies/${slug}`,
  };

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={creativeWorkSchema} />
      <Section className="pt-32 pb-24">
        <h1 className="text-hero-2 font-bold">{study.title}</h1>
        {/* TODO: CaseStudyHero, content modules, related work */}
      </Section>
    </>
  );
}
