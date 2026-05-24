import type { MetadataRoute } from "next";
import {
  fixtureCaseStudies,
  fixtureServices,
  fixtureTalks,
} from "@/lib/cms/fixtures";

const BASE = "https://mitchdesigns.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, priority: 1.0, changeFrequency: "weekly" },
    { url: `${BASE}/about`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE}/case-studies`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE}/faqs`, lastModified: now, priority: 0.7, changeFrequency: "monthly" },
    { url: `${BASE}/careers`, lastModified: now, priority: 0.6, changeFrequency: "weekly" },
    { url: `${BASE}/talks`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = fixtureServices.map((s) => ({
    url: `${BASE}/services/${s.slug}`,
    lastModified: now,
    priority: 0.85,
    changeFrequency: "monthly",
  }));

  const caseStudyRoutes: MetadataRoute.Sitemap = fixtureCaseStudies.map((c) => ({
    url: `${BASE}/case-studies/${c.slug}`,
    lastModified: new Date(c.publishedAt),
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const talkRoutes: MetadataRoute.Sitemap = fixtureTalks.map((t) => ({
    url: `${BASE}/talks/${t.slug}`,
    lastModified: new Date(t.publishedAt ?? t.date ?? Date.now()),
    priority: 0.7,
    changeFrequency: "monthly",
  }));

  return [...staticRoutes, ...serviceRoutes, ...caseStudyRoutes, ...talkRoutes];
}
