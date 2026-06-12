import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import {
  JOB_TYPES,
  JOB_TAGS,
  JOB_TYPE_LABELS,
  JOB_TAG_LABELS,
  salaryRange,
  type Job,
} from "@/lib/jobs";

export const metadata: Metadata = {
  title: "Việc làm cho người cao tuổi",
  description:
    "Việc làm bán thời gian, linh hoạt, tư vấn dành riêng cho người cao tuổi — từ các doanh nghiệp đã được SilverLink kiểm chứng.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    city?: string;
    type?: string;
    tag?: string;
  }>;
}) {
  const { q, city, type, tag } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("jobs")
    .select("*, organizations(name)")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("title", `%${q}%`);
  if (city) query = query.eq("city", city);
  if (type) query = query.eq("job_type", type);
  if (tag) query = query.contains("tags", [tag]);

  const { data } = await query.limit(60);
  const jobs = (data ?? []) as Job[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Việc làm cho người cao tuổi
      </h1>
      <p className="mt-1 text-stone-600">
        Kinh nghiệm của bạn là tài sản quý. Tất cả tin đăng đến từ doanh nghiệp
        đã được kiểm chứng.
      </p>

      <form
        method="get"
        className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Tìm công việc…"
          aria-label="Tìm công việc"
          className="rounded-xl border border-stone-300 px-4 py-3"
        />
        <select
          name="city"
          defaultValue={city ?? ""}
          aria-label="Tỉnh / thành phố"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3"
        >
          <option value="">Mọi tỉnh / thành</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="type"
          defaultValue={type ?? ""}
          aria-label="Loại công việc"
          className="rounded-xl border border-stone-300 bg-white px-4 py-3"
        >
          <option value="">Mọi loại hình</option>
          {JOB_TYPES.map((t) => (
            <option key={t.key} value={t.key}>
              {t.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700"
        >
          🔍 Tìm việc
        </button>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-4">
          {JOB_TAGS.map((t) => (
            <Link
              key={t.key}
              href={
                tag === t.key
                  ? "/viec-lam"
                  : `/viec-lam?tag=${t.key}${city ? `&city=${encodeURIComponent(city)}` : ""}`
              }
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition ${
                tag === t.key
                  ? "bg-brand-600 text-white ring-brand-600"
                  : "bg-white text-stone-700 ring-stone-200 hover:ring-brand-400"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </form>

      <p className="mt-6 font-semibold text-stone-700">
        {jobs.length} việc làm đang tuyển
      </p>
      {jobs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa có việc làm phù hợp. Hãy thử bỏ bớt bộ lọc.
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {jobs.map((j) => (
            <li key={j.id}>
              <Link
                href={`/viec-lam/${j.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-stone-900">
                    {j.title}
                  </h2>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
                    {JOB_TYPE_LABELS[j.job_type]}
                  </span>
                </div>
                <p className="mt-1 text-stone-600">
                  {j.organizations?.name} · 📍{" "}
                  {[j.district, j.city].filter(Boolean).join(", ")}
                </p>
                <p className="mt-1 font-bold text-brand-700">
                  💰 {salaryRange(j)}
                </p>
                {j.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {j.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-stone-100 px-3 py-0.5 text-sm text-stone-600"
                      >
                        {JOB_TAG_LABELS[t] ?? t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
