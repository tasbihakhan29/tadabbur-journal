import type { MetadataRoute } from "next";
import { getAllReflections } from "@/lib/db-reflections";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const reflections = await getAllReflections();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/archive`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const reflectionRoutes: MetadataRoute.Sitemap = reflections.map((r) => ({
    url: `${siteConfig.url}/reflection/${r.surah}/${r.ayahStart}`,
    lastModified: r.date ? new Date(r.date) : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...reflectionRoutes];
}
