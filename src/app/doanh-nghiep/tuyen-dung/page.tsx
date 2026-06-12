import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JOB_TYPE_LABELS, salaryRange, type Job } from "@/lib/jobs";
import { setJobStatus } from "./actions";

export const metadata: Metadata = { title: "Quản lý tuyển dụng" };

export default async function EmployerJobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep/tuyen-dung");

  const { data: org } = await supabase
    .from("organizations")
    .select("id, verification_status")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!org) redirect("/doanh-nghiep");

  const { data } = await supabase
    .from("jobs")
    .select("*, job_applications(count)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });
  const jobs = (data ?? []) as (Job & {
    job_applications: { count: number }[];
  })[];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-extrabold text-stone-900">
          Tin tuyển dụng
        </h1>
        <Link
          href="/doanh-nghiep/tuyen-dung/moi"
          className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700"
        >
          + Đăng tin mới
        </Link>
      </div>

      {org.verification_status !== "verified" && (
        <p className="mt-4 rounded-2xl bg-amber-50 p-5 text-amber-900">
          ⏳ Tin tuyển dụng chỉ hiển thị công khai sau khi doanh nghiệp được
          kiểm chứng.
        </p>
      )}

      {jobs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa có tin tuyển dụng nào.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {jobs.map((j) => (
            <li
              key={j.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="min-w-0">
                <p className="text-lg font-bold text-stone-900">{j.title}</p>
                <p className="text-sm text-stone-500">
                  {JOB_TYPE_LABELS[j.job_type]} · {j.city} · {salaryRange(j)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 text-sm font-bold ${
                      j.status === "open"
                        ? "bg-brand-100 text-brand-800"
                        : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {j.status === "open" ? "Đang tuyển" : "Đã đóng"}
                  </span>
                  <span className="text-sm font-semibold text-stone-600">
                    {j.job_applications[0]?.count ?? 0} hồ sơ ứng tuyển
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/doanh-nghiep/tuyen-dung/${j.id}`}
                  className="rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50"
                >
                  Hồ sơ & chỉnh sửa
                </Link>
                <form
                  action={setJobStatus.bind(
                    null,
                    j.id,
                    j.status === "open" ? "closed" : "open"
                  )}
                >
                  <button className="rounded-xl border-2 border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-100">
                    {j.status === "open" ? "Đóng tin" : "Mở lại"}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
