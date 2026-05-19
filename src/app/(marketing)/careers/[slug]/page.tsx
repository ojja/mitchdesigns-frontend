import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "@/components/layout/Section";
import { getCareers, getCareer } from "@/lib/cms";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const careers = await getCareers();
    return careers.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const role = await getCareer(slug);
    if (role) return { title: role.title, description: role.excerpt };
  } catch { /* fall through */ }
  return { title: slug.replace(/-/g, " ") };
}

export default async function SingleCareerPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const role = await getCareer(slug).catch(() => null);
  if (!role) notFound();

  return (
    <Section className="pt-32 pb-24">
      <h1 className="text-hero-3 font-bold">{role.title}</h1>
      {/* TODO: role description + apply CTA */}
    </Section>
  );
}
