import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  APPLICATION_STATUS_LABELS,
  type Job,
  type JobApplication,
} from "@/lib/jobs";
import JobFields from "../JobFields";
import { updateJob, setApplicationStatus } from "../actions";

export const metadata: Metadata = { title: "Hồ sơ ứng tuyển" };

const APP_STATUS_STYLES: Record<string, string> = {
  submitted: "bg-amber-100 text-amber-800",
  viewed: "bg-indigo-100 text-indigo-800",
  contacted: "bg-brand-100 text-brand-800",
  rejected: "bg-stone-200 text-stone-600",
};

export default async function EmployerJobDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep/tuyen-dung");

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const job = data as Job;

  const { data: appRows } = await supabase
    .from("job_applications")
    .select(
      "*, profiles(full_name, skills, experience_years, availability, bio, city)"
    )
    .eq("job_id", job.id)
    .order("created_at", { ascending: false });
  const applications = (appRows ?? []) as JobApplication[];

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-extrabold text-stone-900">{job.title}</h1>

      {/* Applications */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-stone-900">
          Hồ sơ ứng tuyển ({applications.length})
        </h2>
        {applications.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-stone-500">
            Chưa có hồ sơ nào.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {applications.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-stone-900">
                      {a.profiles?.full_name || "Ứng viên"}
                      {a.profiles?.city && (
                        <span className="ml-2 text-sm font-normal text-stone-500">
                          📍 {a.profiles.city}
                        </span>
                      )}
                    </p>
                    <a
                      href={`tel:${a.phone}`}
                      className="font-semibold text-brand-700 underline"
                    >
                      ☎️ {a.phone}
                    </a>
                    <dl className="mt-2 space-y-1 text-sm text-stone-700">
                      {a.profiles?.skills && (
                        <div>
                          <dt className="inline font-semibold">Kỹ năng: </dt>
                          <dd className="inline">{a.profiles.skills}</dd>
                        </div>
                      )}
                      {a.profiles?.experience_years != null && (
                        <div>
                          <dt className="inline font-semibold">
                            Kinh nghiệm:{" "}
                          </dt>
                          <dd className="inline">
                            {a.profiles.experience_years} năm
                          </dd>
                        </div>
                      )}
                      {a.profiles?.availability && (
                        <div>
                          <dt className="inline font-semibold">
                            Thời gian:{" "}
                          </dt>
                          <dd className="inline">{a.profiles.availability}</dd>
                        </div>
                      )}
                    </dl>
                    {a.message && (
                      <p className="mt-2 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
                        “{a.message}”
                      </p>
                    )}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-bold ${APP_STATUS_STYLES[a.status]}`}
                  >
                    {APPLICATION_STATUS_LABELS[a.status]}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {a.status === "submitted" && (
                    <form action={setApplicationStatus.bind(null, a.id, "viewed")}>
                      <button className="rounded-xl border-2 border-stone-300 px-4 py-2 font-bold text-stone-700 hover:bg-stone-100">
                        Đánh dấu đã xem
                      </button>
                    </form>
                  )}
                  {a.status !== "contacted" && a.status !== "rejected" && (
                    <>
                      <form
                        action={setApplicationStatus.bind(null, a.id, "contacted")}
                      >
                        <button className="rounded-xl bg-brand-600 px-4 py-2 font-bold text-white hover:bg-brand-700">
                          ✓ Đã liên hệ
                        </button>
                      </form>
                      <form
                        action={setApplicationStatus.bind(null, a.id, "rejected")}
                      >
                        <button className="rounded-xl border-2 border-red-300 px-4 py-2 font-bold text-red-700 hover:bg-red-50">
                          Không phù hợp
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Edit */}
      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">Chỉnh sửa tin</h2>
        {error && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-red-700">
            Lưu không thành công. Vui lòng kiểm tra thông tin.
          </p>
        )}
        <form action={updateJob.bind(null, job.id)} className="mt-4">
          <JobFields job={job} />
          <button
            type="submit"
            className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700"
          >
            Lưu thay đổi
          </button>
        </form>
      </section>
    </div>
  );
}
