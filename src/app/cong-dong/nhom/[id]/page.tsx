import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Group, Post } from "@/lib/community";
import PostCard from "../../PostCard";
import { createPost, joinGroup, leaveGroup } from "../../actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("groups")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  return { title: data ? `Nhóm ${data.name}` : "Không tìm thấy nhóm" };
}

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("groups")
    .select("*, group_members(count)")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const group = data as Group;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: postRows }, memberRes] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "*, profiles!posts_author_id_fkey(full_name, city), comments(*, profiles(full_name)), reactions(profile_id)"
      )
      .eq("group_id", group.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30),
    user
      ? supabase
          .from("group_members")
          .select("member_id")
          .eq("group_id", group.id)
          .eq("member_id", user.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  const posts = (postRows ?? []) as Post[];
  const isMember = !!memberRes.data;
  const path = `/cong-dong/nhom/${group.id}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav aria-label="Breadcrumb" className="text-sm text-stone-500">
        <Link href="/cong-dong" className="underline hover:text-brand-700">
          Cộng đồng
        </Link>{" "}
        / <span>{group.name}</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-50 p-6">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-4xl shadow-sm">
            {group.cover_emoji}
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">
              {group.name}
            </h1>
            <p className="text-stone-600">
              {group.group_members?.[0]?.count ?? 0} thành viên
              {group.city ? ` · ${group.city}` : ""}
            </p>
          </div>
        </div>
        {user &&
          (isMember ? (
            <form action={leaveGroup.bind(null, group.id)}>
              <button className="rounded-xl border-2 border-stone-300 px-5 py-2.5 font-bold text-stone-600 hover:bg-white">
                Rời nhóm
              </button>
            </form>
          ) : (
            <form action={joinGroup.bind(null, group.id)}>
              <button className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
                + Tham gia nhóm
              </button>
            </form>
          ))}
      </div>
      {group.description && (
        <p className="mt-4 text-stone-700">{group.description}</p>
      )}

      {user && isMember && (
        <form
          action={createPost.bind(null, group.id)}
          className="mt-6 rounded-2xl border border-stone-200 bg-white p-5"
        >
          <label htmlFor="group-post" className="mb-1 block font-semibold">
            Chia sẻ với nhóm
          </label>
          <textarea
            id="group-post"
            name="body"
            rows={3}
            required
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />
          <button className="mt-3 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
            Đăng bài
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {posts.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            userId={user?.id ?? null}
            path={path}
          />
        ))}
        {posts.length === 0 && (
          <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
            Nhóm chưa có bài viết nào.
          </p>
        )}
      </div>
    </div>
  );
}
