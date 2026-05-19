import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orderbase — Case Study",
  description: "How we built and launched Orderbase.",
};

export default function OrderbasePage() {
  return (
    <main className="min-h-dvh">
      <section className="container-page py-24">
        <h1 className="text-hero-2 font-bold">Orderbase</h1>
        {/* TODO: standalone microsite — uses --color-orderbase-red */}
      </section>
    </main>
  );
}
