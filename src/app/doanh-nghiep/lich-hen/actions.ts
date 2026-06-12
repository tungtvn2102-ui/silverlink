"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setBookingStatus(bookingId: string, status: string) {
  if (!["confirmed", "declined", "completed"].includes(status)) return;
  const supabase = await createClient();
  // RLS only lets the facility's org owner (or admin) update
  await supabase
    .from("visit_bookings")
    .update({ status })
    .eq("id", bookingId);
  revalidatePath("/doanh-nghiep/lich-hen");
}
