import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: facilities } = await supabase
    .from("facilities")
    .select("slug, updated_at")
    .eq("published", true)
    .eq("verification_status", "verified");

  const staticPages: MetadataRoute.Sitemap = [
    "",
    "/duong-lao",
    "/viec-lam",
    "/cong-dong",
    "/tin-tuc",
    "/gioi-thieu",
    "/dieu-khoan",
    "/bao-mat",
    "/lien-he",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "daily",
    priority: path === "" ? 1 : 0.8,
  }));

  const facilityPages: MetadataRoute.Sitemap = (facilities ?? []).map((f) => ({
    url: `${BASE}/duong-lao/${f.slug}`,
    lastModified: new Date(f.updated_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticPages, ...facilityPages];
}
