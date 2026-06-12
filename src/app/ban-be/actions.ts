"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function sendRequest(addresseeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/ban-be");

  await supabase.from("connections").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
  });
  revalidatePath("/ban-be");
}

export async function respondRequest(connectionId: string, accept: boolean) {
  const supabase = await createClient();
  await supabase
    .from("connections")
    .update({ status: accept ? "accepted" : "declined" })
    .eq("id", connectionId);
  revalidatePath("/ban-be");
}

export async function removeConnection(connectionId: string) {
  const supabase = await createClient();
  await supabase.from("connections").delete().eq("id", connectionId);
  revalidatePath("/ban-be");
}
