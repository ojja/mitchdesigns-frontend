"use client";

import { useEffect } from "react";

const CALENDLY_URL =
  "https://calendly.com/ola-ashraf-mitchdesigns/schedule-project-brief-meeting-1";

export function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://assets.calendly.com/assets/external/widget.css"
      />
      <div
        className="calendly-inline-widget w-full"
        data-url={CALENDLY_URL}
        style={{ minWidth: 320, height: 700 }}
      />
    </>
  );
}
