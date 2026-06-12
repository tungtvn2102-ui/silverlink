import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROLE_LABELS, type Profile } from "@/lib/types";
import { CITIES } from "@/lib/constants";
import { BOOKING_STATUS_LABELS, type VisitBooking } from "@/lib/facilities";
import {
  APPLICATION_STATUS_LABELS,
  type JobApplication,
} from "@/lib/jobs";
import { updateProfile, signOut } from "./actions";

const APP_STATUS_STYLES: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-800",
  viewed: "bg-indigo-100 text-indigo-800",
  contacted: "bg-brand-100 text-brand-800",
  rejected: "bg-stone-200 text-stone-600",
};

const BOOKING_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-brand-100 text-brand-800",
  declined: "bg-red-100 text-red-700",
  completed: "bg-stone-200 text-stone-700",
};

export const metadata: Metadata = { title: "Tài khoản của tôi" };

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/tai-khoan");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as { data: Profile | null };
  if (!profile) redirect("/dang-nhap");

  const [{ data: bookingRows }, { data: applicationRows }] = await Promise.all([
    supabase
      .from("visit_bookings")
      .select("*, facilities(name, slug)")
      .eq("requester_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("job_applications")
      .select("*, jobs(title, org_id)")
      .eq("applicant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  const bookings = (bookingRows ?? []) as VisitBooking[];
  const applications = (applicationRows ?? []) as JobApplication[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Tài khoản của tôi
          </h1>
          <p className="mt-1 text-stone-600">
            {ROLE_LABELS[profile.role]} · {user.email}
          </p>
        </div>
        <form action={signOut}>
          <button className="rounded-xl border-2 border-stone-300 px-4 py-2.5 font-bold text-stone-700 hover:bg-stone-100">
            Đăng xuất
          </button>
        </form>
      </div>

      {(profile.role === "business" || profile.role === "admin") && (
        <Link
          href={profile.role === "admin" ? "/admin" : "/doanh-nghiep"}
          className="mt-4 block rounded-2xl bg-brand-600 px-5 py-4 text-center text-lg font-bold text-white hover:bg-brand-700"
        >
          {profile.role === "admin"
            ? "Vào trang quản trị →"
            : "Vào trang doanh nghiệp →"}
        </Link>
      )}

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-stone-900">
          Hoạt động của tôi
        </h2>
        {applications.length > 0 && (
          <>
            <h3 className="mt-4 font-bold text-stone-700">
              Hồ sơ ứng tuyển
            </h3>
            <ul className="mt-2 space-y-3">
              {applications.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3"
                >
                  <div>
                    <Link
                      href={`/viec-lam/${a.job_id}`}
                      className="font-bold text-brand-700 hover:underline"
                    >
                      {a.jobs?.title ?? "Việc làm"}
                    </Link>
                    <p className="text-sm text-stone-600">
                      Ứng tuyển ngày{" "}
                      {new Date(a.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${APP_STATUS_STYLES[a.status]}`}
                  >
                    {APPLICATION_STATUS_LABELS[a.status]}
                  </span>
                </li>
              ))}
            </ul>
            {bookings.length > 0 && (
              <h3 className="mt-5 font-bold text-stone-700">
                Lịch tham quan
              </h3>
            )}
          </>
        )}
        {bookings.length === 0 ? (
          applications.length === 0 ? (
            <p className="mt-3 text-stone-600">
              Bạn chưa có hoạt động nào.{" "}
              <Link href="/duong-lao" className="font-bold text-brand-700 underline">
                Tìm nhà dưỡng lão →
              </Link>
            </p>
          ) : null
        ) : (
          <ul className="mt-4 space-y-3">
            {bookings.map((b) => (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stone-50 px-4 py-3"
              >
                <div>
                  <Link
                    href={`/duong-lao/${b.facilities?.slug ?? ""}`}
                    className="font-bold text-brand-700 hover:underline"
                  >
                    {b.facilities?.name ?? "Cơ sở"}
                  </Link>
                  <p className="text-sm text-stone-600">
                    Tham quan{" "}
                    {new Date(b.preferred_date).toLocaleDateString("vi-VN")} ·{" "}
                    {b.preferred_time === "morning" ? "buổi sáng" : "buổi chiều"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${BOOKING_STATUS_STYLES[b.status]}`}
                >
                  {BOOKING_STATUS_LABELS[b.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-stone-900">
          Thông tin cá nhân
        </h2>
        {saved === "1" && (
          <p
            role="status"
            className="mt-3 rounded-lg bg-brand-50 px-4 py-3 font-semibold text-brand-800"
          >
            ✓ Đã lưu thay đổi.
          </p>
        )}
        {saved === "0" && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-red-700">
            Lưu không thành công. Vui lòng thử lại.
          </p>
        )}
        <form action={updateProfile} className="mt-4 space-y-4">
          <div>
            <label htmlFor="full_name" className="mb-1 block font-semibold">
              Họ và tên
            </label>
            <input
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name}
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block font-semibold">
                Tỉnh / Thành phố
              </label>
              <select
                id="city"
                name="city"
                defaultValue={profile.city ?? ""}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">— Chọn —</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="mb-1 block font-semibold">
                Quận / Huyện
              </label>
              <input
                id="district"
                name="district"
                defaultValue={profile.district ?? ""}
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="mb-1 block font-semibold">
              Giới thiệu ngắn
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile.bio ?? ""}
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>

          {profile.role === "senior" && (
            <fieldset className="rounded-xl bg-stone-50 p-4">
              <legend className="px-1 font-bold text-stone-800">
                Hồ sơ làm việc (hiện với nhà tuyển dụng khi bạn ứng tuyển)
              </legend>
              <div className="mt-2 space-y-4">
                <div>
                  <label htmlFor="skills" className="mb-1 block font-semibold">
                    Kỹ năng / Chuyên môn
                  </label>
                  <input
                    id="skills"
                    name="skills"
                    placeholder="VD: Kế toán, dạy học, tư vấn quản lý…"
                    defaultValue={profile.skills ?? ""}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="experience_years"
                      className="mb-1 block font-semibold"
                    >
                      Số năm kinh nghiệm
                    </label>
                    <input
                      id="experience_years"
                      name="experience_years"
                      type="number"
                      min={0}
                      max={70}
                      defaultValue={profile.experience_years ?? ""}
                      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="availability"
                      className="mb-1 block font-semibold"
                    >
                      Thời gian có thể làm
                    </label>
                    <input
                      id="availability"
                      name="availability"
                      placeholder="VD: Buổi sáng, 3 ngày/tuần"
                      defaultValue={profile.availability ?? ""}
                      className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                    />
                  </div>
                </div>
              </div>
            </fieldset>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </div>
  );
}
