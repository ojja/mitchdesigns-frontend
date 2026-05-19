import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule a call",
};

export default function ScheduleCallPage() {
  return (
    <section className="container-page py-16">
      <h1 className="text-hero-3 font-bold">Schedule a call</h1>
      <p className="mt-3 text-lg text-fg-muted">
        Pick a time that works for you.
      </p>
      {/* TODO: Calendly / Cal.com embed */}
    </section>
  );
}
