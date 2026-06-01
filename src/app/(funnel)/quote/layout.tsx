import { HeaderMinimal } from "@/components/layout/HeaderMinimal";

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <HeaderMinimal />
      <main className="flex-1">{children}</main>
    </div>
  );
}
