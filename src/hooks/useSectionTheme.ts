"use client";

import { useEffect, useState } from "react";

export type SectionTheme = "light" | "dark" | "beige";

/**
 * Watches sections marked with `data-theme` and reports the theme currently
 * intersecting the top of the viewport. Used by Header to flip its variant
 * as the user scrolls between sections of different backgrounds.
 *
 * Sections must render with `data-theme="dark"` (or "beige") for this to pick
 * them up. The Section component already does this.
 */
export function useSectionTheme(headerOffsetPx = 72): SectionTheme {
  const [theme, setTheme] = useState<SectionTheme>("light");

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-theme]"),
    );
    if (sections.length === 0) return;

    const update = () => {
      const probeY = headerOffsetPx + 1;
      // Walk sections and find the one whose rect contains probeY.
      // Falls back to "light" if nothing matches (e.g. user is above first themed section).
      let next: SectionTheme = "light";
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          const t = el.dataset.theme as SectionTheme | undefined;
          if (t === "dark" || t === "beige") next = t;
          else next = "light";
          break;
        }
      }
      setTheme((prev) => (prev === next ? prev : next));
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [headerOffsetPx]);

  return theme;
}
