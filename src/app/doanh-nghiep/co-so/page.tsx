import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VERIFICATION_LABELS } from "@/lib/types";
import { priceRange, type Facility } from "@/lib/facilities";

export const metadata: Metadata = { title: "Quản lý cơ sở" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-brand-100 text-brand-800",
  rejected: "bg-red-100 text-red-700",
};

export default async function FacilitiesAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep/co-so");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, verification_status")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!org) redirect("/doanh-nghiep");

  const { data } = await supabase
    .from("facilities")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });
  const facilities = (data ?? []) as Facility[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-stone-900">
          Cơ sở dưỡng lão của bạn
        </h1>
        <Link
          href="/doanh-nghiep/co-so/moi"
          className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700"
        >
          + Thêm cơ sở
        </Link>
      </div>

      {facilities.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa có cơ sở nào. Bấm “Thêm cơ sở” để tạo hồ sơ đầu tiên.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {facilities.map((f) => (
            <li
              key={f.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="min-w-0">
                <p className="text-lg font-bold text-stone-900">{f.name}</p>
                <p className="text-sm text-stone-500">
                  {[f.district, f.city].filter(Boolean).join(", ")} ·{" "}
                  {priceRange(f)}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 text-sm font-bold ${STATUS_STYLES[f.verification_status]}`}
                  >
                    {VERIFICATION_LABELS[f.verification_status]}
                  </span>
                  <span
                    className={`rounded-full px-3 py-0.5 text-sm font-bold ${
                      f.published
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {f.published ? "Đang đăng" : "Bản nháp"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {f.published && f.verification_status === "verified" && (
                  <Link
                    href={`/duong-lao/${f.slug}`}
                    className="rounded-xl border-2 border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-100"
                  >
                    Xem trang
                  </Link>
                )}
                <Link
                  href={`/doanh-nghiep/co-so/${f.id}`}
                  className="rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
