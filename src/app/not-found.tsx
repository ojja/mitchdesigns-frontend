import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-medium text-fg-muted">404</p>
      <h1 className="mt-4 text-hero-3 font-bold">Page not found</h1>
      <p className="mt-3 max-w-md text-lg text-fg-muted">
        The page you&apos;re looking for has moved, been renamed, or never
        existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-14 items-center rounded-full bg-accent px-8 font-medium text-accent-fg transition-transform hover:scale-[1.02]"
      >
        Back home
      </Link>
    </main>
  );
}
