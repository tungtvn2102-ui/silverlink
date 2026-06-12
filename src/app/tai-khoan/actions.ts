"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap");

  const experienceRaw = String(formData.get("experience_years") ?? "").trim();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim(),
      city: String(formData.get("city") ?? "") || null,
      district: String(formData.get("district") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      skills: String(formData.get("skills") ?? "").trim() || null,
      experience_years: experienceRaw ? Number(experienceRaw) : null,
      availability: String(formData.get("availability") ?? "").trim() || null,
    })
    .eq("id", user.id);

  if (error) redirect("/tai-khoan?saved=0");
  revalidatePath("/", "layout");
  redirect("/tai-khoan?saved=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
