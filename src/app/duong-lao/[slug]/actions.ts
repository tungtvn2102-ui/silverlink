"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createBooking(
  facilityId: string,
  slug: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/dang-nhap?next=/duong-lao/${slug}`);

  const { error } = await supabase.from("visit_bookings").insert({
    facility_id: facilityId,
    requester_id: user.id,
    full_name: String(formData.get("full_name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    preferred_date: String(formData.get("preferred_date") ?? ""),
    preferred_time: String(formData.get("preferred_time") ?? "morning"),
    note: String(formData.get("note") ?? "").trim() || null,
  });

  revalidatePath(`/duong-lao/${slug}`);
  redirect(`/duong-lao/${slug}?booked=${error ? "0" : "1"}#tham-quan`);
}

export async function submitReview(
  facilityId: string,
  slug: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/dang-nhap?next=/duong-lao/${slug}`);

  const { error } = await supabase.from("reviews").upsert(
    {
      facility_id: facilityId,
      author_id: user.id,
      rating: Number(formData.get("rating") ?? 5),
      body: String(formData.get("body") ?? "").trim(),
    },
    { onConflict: "facility_id,author_id" }
  );

  revalidatePath(`/duong-lao/${slug}`);
  redirect(`/duong-lao/${slug}?reviewed=${error ? "0" : "1"}#danh-gia`);
}
