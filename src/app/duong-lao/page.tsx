import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import {
  FACILITY_SERVICES,
  SERVICE_LABELS,
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

const CITY_SHORTCUTS = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];

const CHECKLIST = [
  "Hỏi rõ tỷ lệ điều dưỡng / người cao tuổi và lịch trực đêm.",
  "Xem phòng ở, khu phục hồi chức năng, bếp ăn và khu sinh hoạt chung.",
  "Yêu cầu bảng giá theo tháng, chi phí phát sinh và điều kiện hủy dịch vụ.",
  "Đọc đánh giá thực tế, sau đó đặt lịch tham quan trước khi quyết định.",
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
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-stone-950 md:text-5xl">
                Danh sách nhà dưỡng lão đã kiểm chứng
              </h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
                Bắt đầu như một danh mục địa phương: chọn thành phố, lọc dịch
                vụ cần thiết, xem giá tham khảo, sau đó mở từng hồ sơ để đặt
                lịch tham quan hoặc so sánh cạnh nhau.
              </p>
            </div>
            <div className="rounded-2xl bg-brand-50 p-5 ring-1 ring-brand-100">
              <p className="text-sm font-bold uppercase tracking-wide text-brand-800">
                Gợi ý nhanh
              </p>
              <p className="mt-2 text-stone-700">
                Nếu chưa biết bắt đầu từ đâu, hãy lọc theo thành phố của gia
                đình trước rồi chọn dịch vụ chăm sóc quan trọng nhất.
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link
              href="/duong-lao"
              className={`rounded-full px-4 py-2 text-sm font-bold ${
                !city
                  ? "bg-brand-700 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              Tất cả
            </Link>
            {CITY_SHORTCUTS.map((item) => (
              <Link
                key={item}
                href={`/duong-lao?city=${encodeURIComponent(item)}`}
                className={`rounded-full px-4 py-2 text-sm font-bold ${
                  city === item
                    ? "bg-brand-700 text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[1fr_320px]">
        <div>
          <form
            method="get"
            className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5"
          >
            <div className="lg:col-span-2">
              <label htmlFor="q" className="sr-only">
                Tìm theo tên
              </label>
              <input
                id="q"
                name="q"
                defaultValue={q ?? ""}
                placeholder="Tìm theo tên cơ sở..."
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
            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-5">
              <button
                type="submit"
                className="rounded-xl bg-brand-700 px-6 py-3 font-bold text-white hover:bg-brand-800"
              >
                Tìm kiếm
              </button>
              <select
                name="sort"
                defaultValue={sort ?? ""}
                aria-label="Sắp xếp"
                className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Đánh giá cao nhất</option>
                <option value="price_asc">Giá thấp đến cao</option>
                <option value="price_desc">Giá cao đến thấp</option>
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

          <div className="mt-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-2xl font-extrabold text-stone-950">
                {facilities.length} cơ sở phù hợp
              </p>
              <p className="mt-1 text-stone-600">
                {city
                  ? `Kết quả tại ${city}`
                  : "Sắp xếp theo đánh giá và mức độ phù hợp"}
              </p>
            </div>
            <Link
              href="/duong-lao/so-sanh"
              className="font-bold text-brand-700 underline underline-offset-4"
            >
              Mở trang so sánh
            </Link>
          </div>

          {facilities.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
              Chưa tìm thấy cơ sở phù hợp. Hãy thử nới rộng bộ lọc hoặc chọn
              thành phố gần nhất.
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {facilities.map((f) => (
                <article
                  key={f.id}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="grid gap-0 md:grid-cols-[240px_1fr]">
                    <Link
                      href={`/duong-lao/${f.slug}`}
                      className="relative block min-h-52 bg-stone-100 md:min-h-full"
                    >
                      {f.photo_urls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={f.photo_urls[0]}
                          alt={`Hình ảnh ${f.name}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="grid h-full min-h-52 place-items-center text-5xl">
                          🏡
                        </div>
                      )}
                    </Link>
                    <div className="p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <Link href={`/duong-lao/${f.slug}`}>
                            <h2 className="text-xl font-extrabold text-stone-950 hover:text-brand-700">
                              {f.name}
                            </h2>
                          </Link>
                          <p className="mt-1 text-sm font-semibold text-stone-500">
                            {[f.district, f.city].filter(Boolean).join(", ")}
                          </p>
                        </div>
                        <VerifiedBadge />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <Stars
                          value={Number(f.rating_avg)}
                          count={f.rating_count}
                        />
                        {f.capacity && (
                          <span className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-700">
                            {f.capacity} chỗ
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-xl font-extrabold text-brand-700">
                        {priceRange(f)}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {f.services.slice(0, 4).map((item) => (
                          <span
                            key={item}
                            className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-800"
                          >
                            {SERVICE_LABELS[item] ?? item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <Link
                          href={`/duong-lao/${f.slug}`}
                          className="rounded-xl bg-brand-700 px-5 py-3 font-bold text-white hover:bg-brand-800"
                        >
                          Xem hồ sơ
                        </Link>
                        <Link
                          href={`/duong-lao/so-sanh/them?add=${f.id}`}
                          className="rounded-xl border border-stone-300 px-5 py-3 font-bold text-stone-800 hover:border-brand-600 hover:text-brand-700"
                        >
                          Thêm vào so sánh
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold text-stone-950">
              Checklist khi chọn cơ sở
            </h2>
            <div className="mt-4 space-y-3">
              {CHECKLIST.map((item) => (
                <div key={item} className="flex gap-3 text-sm text-stone-700">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-black text-brand-800">
                    ✓
                  </span>
                  <p className="leading-6">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-stone-950 p-5 text-white">
            <h2 className="text-xl font-extrabold">Cần tư vấn thêm?</h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Nếu gia đình đang phân vân giữa nhiều cơ sở, hãy lưu các hồ sơ
              vào trang so sánh rồi hỏi cộng đồng SilverLink về trải nghiệm
              thực tế.
            </p>
            <Link
              href="/cong-dong"
              className="mt-4 inline-block rounded-xl bg-white px-4 py-3 font-bold text-stone-950 hover:bg-stone-100"
            >
              Hỏi cộng đồng
            </Link>
          </section>
        </aside>
      </main>
    </div>
  );
}
