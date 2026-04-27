import type { MetadataRoute } from "next";
import { allWorkItems } from "@/data/homeContent";

const BASE = "https://eduba.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/workloom`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...allWorkItems.map((work) => ({
      url: `${BASE}/works/${work.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
