import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VERIFICATION_LABELS, type Organization } from "@/lib/types";
import OrgOnboarding from "./OrgOnboarding";

export const metadata: Metadata = { title: "Cổng doanh nghiệp" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  verified: "bg-brand-100 text-brand-800",
  rejected: "bg-red-100 text-red-700",
};

export default async function BusinessHome() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep");

  const { data: orgData } = await supabase
    .from("organizations")
    .select("*")
    .eq("owner_id", user.id)
    .maybeSingle();
  const org = orgData as Organization | null;

  if (!org) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-stone-900">
          Đăng ký doanh nghiệp
        </h1>
        <p className="mt-2 text-stone-600">
          Cung cấp thông tin pháp lý để SilverLink kiểm chứng. Sau khi được
          duyệt, bạn có thể đăng cơ sở dưỡng lão và tin tuyển dụng.
        </p>
        <OrgOnboarding />
      </div>
    );
  }

  const [{ count: facilityCount }, { count: bookingCount }, { count: jobCount }] =
    await Promise.all([
      supabase
        .from("facilities")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id),
      supabase
        .from("visit_bookings")
        .select("*, facilities!inner(org_id)", { count: "exact", head: true })
        .eq("facilities.org_id", org.id)
        .eq("status", "pending"),
      supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("org_id", org.id)
        .eq("status", "open"),
    ]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-extrabold text-stone-900">{org.name}</h1>
        <span
          className={`rounded-full px-3 py-1 font-bold ${STATUS_STYLES[org.verification_status]}`}
        >
          {VERIFICATION_LABELS[org.verification_status]}
        </span>
      </div>

      {org.verification_status === "pending" && (
        <p className="mt-4 rounded-2xl bg-amber-50 p-5 text-amber-900">
          ⏳ Hồ sơ của bạn đang chờ đội ngũ SilverLink kiểm chứng (thường trong
          1–2 ngày làm việc). Bạn có thể chuẩn bị trước thông tin cơ sở / tin
          tuyển dụng — chúng sẽ hiển thị công khai sau khi doanh nghiệp được
          duyệt.
        </p>
      )}
      {org.verification_status === "rejected" && (
        <p className="mt-4 rounded-2xl bg-red-50 p-5 text-red-800">
          Hồ sơ của bạn chưa được duyệt. Vui lòng liên hệ{" "}
          <a href="mailto:doanhnghiep@silverlink.vn" className="underline">
            doanhnghiep@silverlink.vn
          </a>{" "}
          để biết thêm chi tiết.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/doanh-nghiep/co-so"
          className="rounded-2xl border border-stone-200 bg-white p-6 hover:border-brand-300 hover:shadow"
        >
          <p className="text-4xl font-extrabold text-brand-700">
            {facilityCount ?? 0}
          </p>
          <p className="mt-1 font-semibold text-stone-700">Cơ sở dưỡng lão</p>
        </Link>
        <Link
          href="/doanh-nghiep/lich-hen"
          className="rounded-2xl border border-stone-200 bg-white p-6 hover:border-brand-300 hover:shadow"
        >
          <p className="text-4xl font-extrabold text-amber-600">
            {bookingCount ?? 0}
          </p>
          <p className="mt-1 font-semibold text-stone-700">
            Lịch hẹn chờ xác nhận
          </p>
        </Link>
        <Link
          href="/doanh-nghiep/tuyen-dung"
          className="rounded-2xl border border-stone-200 bg-white p-6 hover:border-brand-300 hover:shadow"
        >
          <p className="text-4xl font-extrabold text-indigo-600">
            {jobCount ?? 0}
          </p>
          <p className="mt-1 font-semibold text-stone-700">
            Tin tuyển dụng đang mở
          </p>
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold">Thông tin doanh nghiệp</h2>
        <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-stone-500">Mã số thuế</dt>
            <dd className="font-semibold">{org.tax_id || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Loại hình</dt>
            <dd className="font-semibold">
              {org.type === "facility_operator"
                ? "Cơ sở dưỡng lão"
                : org.type === "employer"
                  ? "Nhà tuyển dụng"
                  : "Cơ sở dưỡng lão & Nhà tuyển dụng"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Email liên hệ</dt>
            <dd className="font-semibold">{org.contact_email || "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-stone-500">Điện thoại</dt>
            <dd className="font-semibold">{org.contact_phone || "—"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
