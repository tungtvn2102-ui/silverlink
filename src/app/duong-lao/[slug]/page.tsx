import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  SERVICE_LABELS,
  priceRange,
  formatVND,
  type Facility,
  type Review,
} from "@/lib/facilities";
import Stars from "@/components/Stars";
import VerifiedBadge from "@/components/VerifiedBadge";
import BookingForm from "./BookingForm";
import ReviewForm from "./ReviewForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("facilities")
    .select("name, description, city")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return { title: "Không tìm thấy cơ sở" };
  return {
    title: `${data.name} — Nhà dưỡng lão tại ${data.city}`,
    description: data.description?.slice(0, 160),
  };
}

export default async function FacilityPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ booked?: string; reviewed?: string }>;
}) {
  const { slug } = await params;
  const { booked, reviewed } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("facilities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (!data) notFound();
  const facility = data as Facility;

  const [{ data: reviewRows }, authRes] = await Promise.all([
    supabase
      .from("reviews")
      .select("*, profiles(full_name)")
      .eq("facility_id", facility.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase.auth.getUser(),
  ]);
  const reviews = (reviewRows ?? []) as Review[];
  const user = authRes.data.user;

  let myReview: Review | null = null;
  let myName = "";
  if (user) {
    const [{ data: mine }, { data: prof }] = await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .eq("facility_id", facility.id)
        .eq("author_id", user.id)
        .maybeSingle(),
      supabase.from("profiles").select("full_name").eq("id", user.id).single(),
    ]);
    myReview = mine as Review | null;
    myName = prof?.full_name ?? "";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <Link href="/duong-lao" className="underline hover:text-brand-700">
          Nhà dưỡng lão
        </Link>{" "}
        / <span>{facility.name}</span>
      </nav>

      {/* Gallery */}
      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-stone-100 md:col-span-2">
          {facility.photo_urls[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={facility.photo_urls[0]}
              alt={`Hình ảnh ${facility.name}`}
              className="aspect-[3/2] h-full w-full object-cover"
            />
          ) : (
            <div className="grid aspect-[3/2] place-items-center text-7xl">
              🏡
            </div>
          )}
        </div>
        <div className="hidden gap-2 md:grid">
          {facility.photo_urls.slice(1, 3).map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={url}
              src={url}
              alt={`Hình ảnh ${facility.name} ${i + 2}`}
              className="aspect-[3/2] w-full rounded-2xl object-cover"
            />
          ))}
          {facility.photo_urls.length < 2 && (
            <div className="grid aspect-[3/2] place-items-center rounded-2xl bg-brand-50 text-4xl">
              🌳
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 gap-8 lg:flex">
        {/* Main info */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-extrabold text-stone-900">
              {facility.name}
            </h1>
            <VerifiedBadge />
          </div>
          <p className="mt-2 text-stone-600">📍 {facility.address}</p>
          <div className="mt-2">
            <Stars
              value={Number(facility.rating_avg)}
              count={facility.rating_count}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/duong-lao/so-sanh?ids=${facility.id}`}
              className="rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50"
            >
              ⚖️ So sánh cơ sở này
            </Link>
            {facility.phone && (
              <a
                href={`tel:${facility.phone}`}
                className="rounded-xl border-2 border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-100"
              >
                ☎️ {facility.phone}
              </a>
            )}
          </div>

          {/* Pricing */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-stone-900">Chi phí</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-brand-50 p-4">
                <p className="text-sm text-stone-600">Mức giá</p>
                <p className="mt-1 text-lg font-extrabold text-brand-800">
                  {priceRange(facility)}
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-600">Từ</p>
                <p className="mt-1 text-lg font-extrabold text-stone-800">
                  {formatVND(facility.price_min)} /tháng
                </p>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4">
                <p className="text-sm text-stone-600">Sức chứa</p>
                <p className="mt-1 text-lg font-extrabold text-stone-800">
                  {facility.capacity ? `${facility.capacity} người` : "—"}
                </p>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="mt-8">
            <h2 className="text-xl font-bold text-stone-900">
              Dịch vụ chăm sóc
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {facility.services.map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-white px-4 py-2 font-semibold text-stone-700 ring-1 ring-stone-200"
                >
                  ✓ {SERVICE_LABELS[s] ?? s}
                </li>
              ))}
              {facility.services.length === 0 && (
                <li className="text-stone-500">Đang cập nhật.</li>
              )}
            </ul>
          </section>

          {/* Description */}
          {facility.description && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-stone-900">Giới thiệu</h2>
              <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-700">
                {facility.description}
              </p>
            </section>
          )}

          {/* Reviews */}
          <section id="danh-gia" className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-bold text-stone-900">
              Đánh giá từ người dùng ({facility.rating_count})
            </h2>
            {reviewed === "1" && (
              <p
                role="status"
                className="mt-3 rounded-lg bg-brand-50 px-4 py-3 font-semibold text-brand-800"
              >
                ✓ Cảm ơn bạn! Đánh giá của bạn đã được ghi nhận.
              </p>
            )}
            {reviewed === "0" && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-red-700">
                Gửi đánh giá không thành công. Vui lòng thử lại.
              </p>
            )}

            <div className="mt-4 space-y-4">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-stone-200 bg-white p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-stone-900">
                      {r.profiles?.full_name || "Người dùng SilverLink"}
                    </p>
                    <p className="text-sm text-stone-500">
                      {new Date(r.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="mt-1">
                    <Stars value={r.rating} />
                  </div>
                  <p className="mt-2 leading-relaxed text-stone-700">
                    {r.body}
                  </p>
                </article>
              ))}
              {reviews.length === 0 && (
                <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-stone-500">
                  Chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ trải
                  nghiệm!
                </p>
              )}
            </div>

            {user ? (
              <ReviewForm
                facilityId={facility.id}
                slug={facility.slug}
                existing={
                  myReview
                    ? { rating: myReview.rating, body: myReview.body }
                    : null
                }
              />
            ) : (
              <p className="mt-4 rounded-2xl bg-stone-50 p-5 text-stone-600">
                <Link
                  href={`/dang-nhap?next=/duong-lao/${facility.slug}`}
                  className="font-bold text-brand-700 underline"
                >
                  Đăng nhập
                </Link>{" "}
                để viết đánh giá.
              </p>
            )}
          </section>
        </div>

        {/* Booking sidebar */}
        <aside
          id="tham-quan"
          className="mt-10 scroll-mt-24 lg:mt-0 lg:w-96 lg:shrink-0"
        >
          <div className="rounded-3xl border-2 border-brand-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="text-xl font-extrabold text-stone-900">
              Đặt lịch tham quan miễn phí
            </h2>
            <p className="mt-1 text-sm text-stone-600">
              Cơ sở sẽ liên hệ xác nhận trong vòng 24 giờ.
            </p>
            {booked === "1" && (
              <p
                role="status"
                className="mt-3 rounded-lg bg-brand-50 px-4 py-3 font-semibold text-brand-800"
              >
                ✓ Đã gửi yêu cầu! Theo dõi trạng thái trong mục Tài khoản của
                tôi.
              </p>
            )}
            {booked === "0" && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-red-700">
                Gửi yêu cầu không thành công. Vui lòng thử lại.
              </p>
            )}
            {user ? (
              <BookingForm
                facilityId={facility.id}
                slug={facility.slug}
                defaultName={myName}
              />
            ) : (
              <Link
                href={`/dang-nhap?next=/duong-lao/${facility.slug}`}
                className="mt-4 block rounded-xl bg-brand-600 px-4 py-3.5 text-center text-lg font-bold text-white hover:bg-brand-700"
              >
                Đăng nhập để đặt lịch
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
