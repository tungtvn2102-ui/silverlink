"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createPost(groupId: string | null, formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/dang-nhap?next=/cong-dong");

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await supabase.from("posts").insert({
    group_id: groupId,
    author_id: user.id,
    body,
  });
  revalidatePath(groupId ? `/cong-dong/nhom/${groupId}` : "/cong-dong");
}

export async function createComment(postId: string, path: string, formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect(`/dang-nhap?next=${encodeURIComponent(path)}`);

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    body,
  });
  revalidatePath(path);
}

export async function toggleReaction(postId: string, path: string, hasReacted: boolean) {
  const { supabase, user } = await requireUser();
  if (!user) redirect(`/dang-nhap?next=${encodeURIComponent(path)}`);

  if (hasReacted) {
    await supabase
      .from("reactions")
      .delete()
      .eq("post_id", postId)
      .eq("profile_id", user.id);
  } else {
    await supabase
      .from("reactions")
      .insert({ post_id: postId, profile_id: user.id });
  }
  revalidatePath(path);
}

export async function flagPost(postId: string, path: string) {
  const { supabase, user } = await requireUser();
  if (!user) redirect(`/dang-nhap?next=${encodeURIComponent(path)}`);
  await supabase.from("posts").update({ status: "flagged" }).eq("id", postId);
  revalidatePath(path);
}

export async function createGroup(formData: FormData) {
  const { supabase, user } = await requireUser();
  if (!user) redirect("/dang-nhap?next=/cong-dong");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) redirect("/cong-dong");

  const { data: group } = await supabase
    .from("groups")
    .insert({
      name,
      description: String(formData.get("description") ?? "").trim() || null,
      city: String(formData.get("city") ?? "") || null,
      cover_emoji: String(formData.get("cover_emoji") ?? "🌼") || "🌼",
      created_by: user.id,
    })
    .select()
    .single();

  if (group) {
    await supabase.from("group_members").insert({
      group_id: group.id,
      member_id: user.id,
      role: "moderator",
    });
    redirect(`/cong-dong/nhom/${group.id}`);
  }
  redirect("/cong-dong");
}

export async function joinGroup(groupId: string) {
  const { supabase, user } = await requireUser();
  if (!user) redirect(`/dang-nhap?next=/cong-dong/nhom/${groupId}`);
  await supabase
    .from("group_members")
    .insert({ group_id: groupId, member_id: user.id });
  revalidatePath(`/cong-dong/nhom/${groupId}`);
}

export async function leaveGroup(groupId: string) {
  const { supabase, user } = await requireUser();
  if (!user) return;
  await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("member_id", user.id);
  revalidatePath(`/cong-dong/nhom/${groupId}`);
}
