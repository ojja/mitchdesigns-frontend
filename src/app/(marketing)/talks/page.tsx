import type { Metadata } from "next";
import { TalksList } from "@/features/talks";
import { getTalks } from "@/lib/cms";
import { fixtureTalks } from "@/lib/cms/fixtures";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Talks & Articles — MitchDesigns",
  description:
    "Insights on UX, product design, and digital growth from the MitchDesigns team — conference talks, workshops, and community sessions across Egypt and the region.",
  openGraph: {
    title: "Talks & Articles — MitchDesigns",
    description:
      "Insights on UX, product design, and digital growth from the MitchDesigns team.",
    url: "https://mitchdesigns.com/talks",
  },
  alternates: { canonical: "/talks" },
};

async function safe<T>(p: Promise<T[]>, fallback: T[]): Promise<T[]> {
  try {
    const data = await p;
    return data.length ? data : fallback;
  } catch {
    return fallback;
  }
}

export default async function TalksIndexPage() {
  const talks = await safe(getTalks(), fixtureTalks);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "MitchDesigns Talks & Articles",
    itemListElement: talks.map((talk, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://mitchdesigns.com/talks/${talk.slug}`,
      name: talk.title,
    })),
  };

  return (
    <>
      <JsonLd data={itemListSchema} />
      <TalksList talks={talks} />
    </>
  );
}
