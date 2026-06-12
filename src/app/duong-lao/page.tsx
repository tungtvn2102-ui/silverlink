import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import {
  FACILITY_SERVICES,
  priceRange,
  type Facility,
} from "@/lib/facilities";
import Stars from "@/components/Stars";
import VerifiedBadge from "@/components/VerifiedBadge";

export const metadata: Metadata = {
  title: "Tìm nhà dưỡng lão uy tín",
  description:
    "Danh mục nhà dưỡng lão được SilverLink kiểm chứng: so sánh dịch vụ, giá cả và đánh giá thực tế, đặt lịch tham quan trực tuyến.",
};

type Search = {
  q?: string;
  city?: string;
  service?: string;
  budget?: string;
  sort?: string;
};

const BUDGETS = [
  { value: "10", label: "Dưới 10 triệu/tháng" },
  { value: "15", label: "Dưới 15 triệu/tháng" },
  { value: "20", label: "Dưới 20 triệu/tháng" },
  { value: "30", label: "Dưới 30 triệu/tháng" },
];

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const { q, city, service, budget, sort } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("facilities")
    .select("*")
    .eq("published", true)
    .eq("verification_status", "verified");

  if (q) query = query.ilike("name", `%${q}%`);
  if (city) query = query.eq("city", city);
  if (service) query = query.contains("services", [service]);
  if (budget) query = query.lte("price_min", Number(budget) * 1_000_000);

  if (sort === "price_asc")
    query = query.order("price_min", { ascending: true, nullsFirst: false });
  else if (sort === "price_desc")
    query = query.order("price_min", { ascending: false });
  else query = query.order("rating_avg", { ascending: false });

  const { data } = await query.limit(60);
  const facilities = (data ?? []) as Facility[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Tìm nhà dưỡng lão
      </h1>
      <p className="mt-1 text-stone-600">
        Tất cả cơ sở dưới đây đã được SilverLink kiểm chứng giấy phép hoạt động.
      </p>

      {/* Filters — plain GET form, no JS needed */}
      <form
        method="get"
        className="mt-6 grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <div className="lg:col-span-2">
          <label htmlFor="q" className="sr-only">
            Tìm theo tên
          </label>
          <input
            id="q"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Tìm theo tên cơ sở…"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="city" className="sr-only">
            Tỉnh / thành phố
          </label>
          <select
            id="city"
            name="city"
            defaultValue={city ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Mọi tỉnh / thành</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="service" className="sr-only">
            Dịch vụ
          </label>
          <select
            id="service"
            name="service"
            defaultValue={service ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Mọi dịch vụ</option>
            {FACILITY_SERVICES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="budget" className="sr-only">
            Ngân sách
          </label>
          <select
            id="budget"
            name="budget"
            defaultValue={budget ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Mọi mức giá</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 sm:col-span-2 lg:col-span-5">
          <button
            type="submit"
            className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700"
          >
            🔍 Tìm kiếm
          </button>
          <select
            name="sort"
            defaultValue={sort ?? ""}
            aria-label="Sắp xếp"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Đánh giá cao nhất</option>
            <option value="price_asc">Giá thấp → cao</option>
            <option value="price_desc">Giá cao → thấp</option>
          </select>
          {(q || city || service || budget) && (
            <Link
              href="/duong-lao"
              className="self-center font-semibold text-stone-500 underline"
            >
              Xóa bộ lọc
            </Link>
          )}
        </div>
      </form>

      {/* Results */}
      <p className="mt-6 font-semibold text-stone-700">
        {facilities.length} cơ sở phù hợp
      </p>
      {facilities.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa tìm thấy cơ sở phù hợp. Hãy thử nới rộng bộ lọc.
        </div>
      ) : (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facilities.map((f) => (
            <Link
              key={f.id}
              href={`/duong-lao/${f.slug}`}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative aspect-[3/2] bg-stone-100">
                {f.photo_urls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.photo_urls[0]}
                    alt={`Hình ảnh ${f.name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-5xl">
                    🏡
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-bold text-stone-900 group-hover:text-brand-700">
                    {f.name}
                  </h2>
                </div>
                <p className="mt-1 text-sm text-stone-500">
                  📍 {[f.district, f.city].filter(Boolean).join(", ")}
                </p>
                <div className="mt-2">
                  <Stars value={Number(f.rating_avg)} count={f.rating_count} />
                </div>
                <p className="mt-2 font-bold text-brand-700">
                  {priceRange(f)}
                </p>
                <div className="mt-3">
                  <VerifiedBadge />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-brand-50 p-6 text-center">
        <p className="font-semibold text-brand-900">
          Muốn so sánh các cơ sở cạnh nhau? Mở từng cơ sở và bấm “So sánh”, hoặc
          xem trang{" "}
          <Link href="/duong-lao/so-sanh" className="underline">
            so sánh cơ sở
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
