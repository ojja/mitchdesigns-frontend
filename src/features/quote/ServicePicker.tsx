"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/cn";
import { quoteServiceOptions, type QuoteService } from "@/lib/quote/schema";

const STORAGE_KEY = "mitchdesigns.quote.lead";

type PickerStage = "name" | "service";

export function ServicePicker() {
  const router = useRouter();
  const [stage, setStage] = useState<PickerStage>("name");
  const [firstName, setFirstName] = useState("");
  const [selectedService, setSelectedService] = useState<QuoteService | null>(
    null,
  );
  const [showServiceError, setShowServiceError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.firstName) setFirstName(data.firstName);
        if (data.service) setSelectedService(data.service);
      } catch (e) {
        console.error("Failed to parse lead data", e);
      }
    }
  }, []);

  const canContinueFromName = firstName.trim().length > 0;

  const selectedHref = useMemo(() => {
    return quoteServiceOptions.find(
      (option) => option.service === selectedService,
    )?.href;
  }, [selectedService]);

  function saveLead(nextService?: QuoteService) {
    if (typeof window === "undefined") return;

    const existingRaw = window.localStorage.getItem(STORAGE_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : {};

    const next = {
      ...existing,
      firstName: firstName.trim() || existing.firstName,
      service: nextService ?? selectedService ?? existing.service,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleNameSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canContinueFromName) return;
    saveLead();
    setStage("service");
  }

  function handleServiceSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedHref || !selectedService) {
      setShowServiceError(true);
      return;
    }

    saveLead(selectedService);
    router.push(selectedHref);
  }

  return (
    <section className="container-page flex min-h-[calc(100dvh-4rem)] items-start justify-center py-8 md:items-center md:py-12">
      <div className="relative w-full max-w-[790px] rounded-card-sm bg-bg px-6 py-9 shadow-soft-lg ring-1 ring-border md:px-12 md:py-11">
        <button
          type="button"
          aria-label={stage === "name" ? "Back to homepage" : "Back"}
          onClick={() => {
            if (stage === "service") {
              setStage("name");
              return;
            }
            router.push("/");
          }}
          className="absolute left-6 top-9 grid h-9 w-9 place-items-center rounded-full text-fg transition-colors hover:bg-bg-alt focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:left-10"
        >
          <Icon size={22}>
            <path d="M15 18l-6-6 6-6" />
          </Icon>
        </button>

        {stage === "name" ? (
          <form onSubmit={handleNameSubmit} className="mx-auto max-w-[500px]">
            <header className="text-center">
              <h1 className="text-hero-5 font-bold md:text-hero-4">
                Let&apos;s start
              </h1>
              <p className="mt-4 text-lg text-fg md:text-xl">
                Just answer a few quick questions, and our team will send your
                personalized estimate within 48 hours.
              </p>
            </header>

            <div className="mt-11">
              <label htmlFor="quote-first-name" className="text-base font-medium">
                First Name <span className="text-accent">*</span>
              </label>
              <Input
                id="quote-first-name"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="mt-2 h-11 rounded-[3px] border-grey-500 px-4"
                autoComplete="given-name"
                required
              />
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={!canContinueFromName}
                className="h-[68px] min-w-[200px] text-base uppercase md:min-w-[250px]"
              >
                Next
                <Icon size={22}>
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </Icon>
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleServiceSubmit}>
            <header className="mx-auto max-w-[640px] text-center">
              <h1 className="text-hero-5 font-bold md:text-hero-4">
                What brings you here to Mitch Designs
              </h1>
              <p className="mt-4 text-lg text-fg md:text-xl">
                Get an accurate project estimate tailored to your goals - no
                meetings, no waiting.
              </p>
            </header>

            <div className="mt-11">
              <p className="text-lg text-fg">I Want to build a...</p>
              <p
                className={cn(
                  "mt-1 text-base text-orderbase-red",
                  !showServiceError ? "invisible" : "",
                )}
              >
                Please choose a service to proceed
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {quoteServiceOptions.map((option) => (
                  <label
                    key={option.service}
                    className={cn(
                      "grid min-h-[150px] place-items-center rounded-card-sm border border-grey-500 bg-bg px-6 text-center text-lg font-medium transition-colors md:min-h-[150px] md:text-xl",
                      "focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2 focus-within:ring-offset-bg",
                      selectedService === option.service &&
                        "border-fg bg-fg text-bg",
                    )}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={option.service}
                      checked={selectedService === option.service}
                      onChange={() => {
                        setSelectedService(option.service);
                        setShowServiceError(false);
                      }}
                      className="sr-only"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="h-[68px] min-w-[200px] text-base uppercase md:min-w-[200px]"
              >
                Next
                <Icon size={22}>
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </Icon>
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
