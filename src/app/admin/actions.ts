"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin" ? supabase : null;
}

export async function setOrgStatus(orgId: string, status: string) {
  if (!["verified", "rejected"].includes(status)) return;
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase
    .from("organizations")
    .update({ verification_status: status })
    .eq("id", orgId);
  revalidatePath("/admin");
}

export async function setFacilityStatus(facilityId: string, status: string) {
  if (!["verified", "rejected"].includes(status)) return;
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase
    .from("facilities")
    .update({ verification_status: status })
    .eq("id", facilityId);
  revalidatePath("/admin");
}

export async function setReviewStatus(reviewId: string, status: string) {
  if (!["published", "removed"].includes(status)) return;
  const supabase = await requireAdmin();
  if (!supabase) return;
  await supabase.from("reviews").update({ status }).eq("id", reviewId);
  revalidatePath("/admin");
}
