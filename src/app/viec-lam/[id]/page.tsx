import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  JOB_TYPE_LABELS,
  JOB_TAG_LABELS,
  salaryRange,
  type Job,
} from "@/lib/jobs";
import ApplyForm from "./ApplyForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("title, city")
    .eq("id", id)
    .maybeSingle();
  if (!data) return { title: "Không tìm thấy việc làm" };
  return { title: `${data.title} — Việc làm tại ${data.city}` };
}

export default async function JobPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ applied?: string }>;
}) {
  const { id } = await params;
  const { applied } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("jobs")
    .select("*, organizations(name)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const job = data as Job;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingApplication = false;
  let workProfile: {
    skills: string | null;
    experience_years: number | null;
    availability: string | null;
  } | null = null;
  if (user) {
    const [{ data: app }, { data: prof }] = await Promise.all([
      supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("applicant_id", user.id)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("skills, experience_years, availability")
        .eq("id", user.id)
        .single(),
    ]);
    existingApplication = !!app;
    workProfile = prof;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <Link href="/viec-lam" className="underline hover:text-brand-700">
          Việc làm
        </Link>{" "}
        / <span>{job.title}</span>
      </nav>

      <div className="mt-4 rounded-3xl border border-stone-200 bg-white p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-stone-900">
            {job.title}
          </h1>
          <span className="rounded-full bg-amber-100 px-4 py-1.5 font-bold text-amber-800">
            {JOB_TYPE_LABELS[job.job_type]}
          </span>
        </div>
        <p className="mt-2 text-lg text-stone-600">
          {job.organizations?.name}
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-stone-50 px-4 py-3">
            <dt className="text-sm text-stone-500">Khu vực</dt>
            <dd className="font-bold">
              📍 {[job.district, job.city].filter(Boolean).join(", ")}
            </dd>
          </div>
          <div className="rounded-xl bg-brand-50 px-4 py-3">
            <dt className="text-sm text-stone-500">Thu nhập</dt>
            <dd className="font-bold text-brand-800">💰 {salaryRange(job)}</dd>
          </div>
        </dl>
        {job.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-stone-100 px-4 py-1.5 font-semibold text-stone-700"
              >
                ✓ {JOB_TAG_LABELS[t] ?? t}
              </span>
            ))}
          </div>
        )}
        <h2 className="mt-6 text-xl font-bold text-stone-900">
          Mô tả công việc
        </h2>
        <p className="mt-2 whitespace-pre-line leading-relaxed text-stone-700">
          {job.description}
        </p>
      </div>

      <div id="ung-tuyen" className="mt-6 scroll-mt-24">
        {applied === "1" && (
          <p
            role="status"
            className="rounded-2xl bg-brand-50 p-5 font-semibold text-brand-800"
          >
            ✓ Đã gửi hồ sơ ứng tuyển! Nhà tuyển dụng sẽ liên hệ với bạn qua số
            điện thoại đã cung cấp.
          </p>
        )}
        {applied === "0" && (
          <p role="alert" className="rounded-2xl bg-red-50 p-5 text-red-700">
            Gửi hồ sơ không thành công. Có thể bạn đã ứng tuyển vị trí này rồi.
          </p>
        )}
        {!applied && existingApplication && (
          <p className="rounded-2xl bg-stone-100 p-5 font-semibold text-stone-700">
            Bạn đã ứng tuyển vị trí này. Theo dõi trạng thái trong{" "}
            <Link href="/tai-khoan" className="text-brand-700 underline">
              Tài khoản của tôi
            </Link>
            .
          </p>
        )}
        {!existingApplication && !applied && (
          <>
            {user ? (
              <ApplyForm jobId={job.id} workProfile={workProfile} />
            ) : (
              <div className="rounded-2xl bg-stone-50 p-6 text-center">
                <Link
                  href={`/dang-nhap?next=/viec-lam/${job.id}`}
                  className="inline-block rounded-xl bg-brand-600 px-8 py-3.5 text-lg font-bold text-white hover:bg-brand-700"
                >
                  Đăng nhập để ứng tuyển
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
