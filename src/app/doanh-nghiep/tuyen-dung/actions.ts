"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JOB_TAGS } from "@/lib/jobs";

function jobPayload(formData: FormData) {
  const sMin = String(formData.get("salary_min") ?? "").trim();
  const sMax = String(formData.get("salary_max") ?? "").trim();
  return {
    title: String(formData.get("title") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    job_type: String(formData.get("job_type") ?? "part_time"),
    city: String(formData.get("city") ?? ""),
    district: String(formData.get("district") ?? "").trim() || null,
    salary_min: sMin ? Number(sMin) * 1_000_000 : null,
    salary_max: sMax ? Number(sMax) * 1_000_000 : null,
    tags: JOB_TAGS.map((t) => t.key).filter(
      (k) => formData.get(`tag-${k}`) === "on"
    ),
  };
}

export async function createJob(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep/tuyen-dung");

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!org) redirect("/doanh-nghiep");

  const { error } = await supabase
    .from("jobs")
    .insert({ ...jobPayload(formData), org_id: org.id });

  revalidatePath("/doanh-nghiep/tuyen-dung");
  redirect(error ? "/doanh-nghiep/tuyen-dung/moi?error=1" : "/doanh-nghiep/tuyen-dung");
}

export async function updateJob(jobId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("jobs")
    .update(jobPayload(formData))
    .eq("id", jobId);
  revalidatePath("/doanh-nghiep/tuyen-dung");
  redirect(
    error
      ? `/doanh-nghiep/tuyen-dung/${jobId}?error=1`
      : "/doanh-nghiep/tuyen-dung"
  );
}

export async function setJobStatus(jobId: string, status: string) {
  if (!["open", "closed"].includes(status)) return;
  const supabase = await createClient();
  await supabase.from("jobs").update({ status }).eq("id", jobId);
  revalidatePath("/doanh-nghiep/tuyen-dung");
}

export async function setApplicationStatus(
  applicationId: string,
  status: string
) {
  if (!["viewed", "contacted", "rejected"].includes(status)) return;
  const supabase = await createClient();
  await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", applicationId);
  revalidatePath("/doanh-nghiep/tuyen-dung");
}
