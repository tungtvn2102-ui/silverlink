"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function applyToJob(jobId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/dang-nhap?next=/viec-lam/${jobId}`);

  // Keep the senior work profile up to date as part of the application
  const skills = String(formData.get("skills") ?? "").trim();
  const experienceRaw = String(formData.get("experience_years") ?? "").trim();
  const availability = String(formData.get("availability") ?? "").trim();
  await supabase
    .from("profiles")
    .update({
      skills: skills || null,
      experience_years: experienceRaw ? Number(experienceRaw) : null,
      availability: availability || null,
    })
    .eq("id", user.id);

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    applicant_id: user.id,
    phone: String(formData.get("phone") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim() || null,
  });

  revalidatePath(`/viec-lam/${jobId}`);
  redirect(`/viec-lam/${jobId}?applied=${error ? "0" : "1"}`);
}
