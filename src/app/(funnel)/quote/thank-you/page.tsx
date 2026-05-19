import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you",
};

type SearchParams = Promise<{ sitemap?: string }>;

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { sitemap } = await searchParams;
  const hadSitemap = sitemap === "1";

  return (
    <section className="container-page py-24 text-center">
      <h1 className="text-hero-3 font-bold">Thanks — we got it.</h1>
      <p className="mt-3 text-lg text-fg-muted">
        {hadSitemap
          ? "We'll review your sitemap and reply within 1–2 business days."
          : "We'll be in touch shortly to discuss your project."}
      </p>
    </section>
  );
}
