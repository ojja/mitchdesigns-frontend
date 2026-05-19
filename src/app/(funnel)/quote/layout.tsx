import Link from "next/link";

export default function QuoteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="text-base font-bold tracking-tight">
            MitchDesigns
          </Link>
          {/* TODO: progress bar (StepShell) */}
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
