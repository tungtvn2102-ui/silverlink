import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CITIES } from "@/lib/constants";
import type { Group, Post } from "@/lib/community";
import PostCard from "./PostCard";
import { createPost, createGroup } from "./actions";

export const metadata: Metadata = {
  title: "Cộng đồng",
  description:
    "Cộng đồng thân thiện cho người cao tuổi Việt Nam: chia sẻ, kết bạn và tham gia hội nhóm sở thích.",
};

export default async function CommunityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: postRows }, { data: groupRows }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        "*, profiles(full_name, city), groups(name), comments(*, profiles(full_name)), reactions(profile_id)"
      )
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("groups")
      .select("*, group_members(count)")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  const posts = (postRows ?? []) as Post[];
  const groups = (groupRows ?? []) as Group[];

  return (
    <div className="mx-auto max-w-6xl gap-8 px-4 py-8 lg:flex">
      {/* Feed */}
      <div className="min-w-0 flex-1">
        <h1 className="text-3xl font-extrabold text-stone-900">Cộng đồng</h1>
        <p className="mt-1 text-stone-600">
          Nơi chia sẻ nhẹ nhàng giữa những người bạn đồng trang lứa.
        </p>

        {user ? (
          <form
            action={createPost.bind(null, null)}
            className="mt-5 rounded-2xl border border-stone-200 bg-white p-5"
          >
            <label htmlFor="new-post" className="mb-1 block font-semibold">
              Hôm nay bạn muốn chia sẻ điều gì?
            </label>
            <textarea
              id="new-post"
              name="body"
              rows={3}
              required
              placeholder="VD: Sáng nay tôi tập dưỡng sinh ở công viên, không khí thật trong lành…"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
            <button className="mt-3 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700">
              Đăng bài
            </button>
          </form>
        ) : (
          <p className="mt-5 rounded-2xl bg-brand-50 p-5 text-stone-700">
            <Link
              href="/dang-nhap?next=/cong-dong"
              className="font-bold text-brand-700 underline"
            >
              Đăng nhập
            </Link>{" "}
            để chia sẻ và kết nối với cộng đồng.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              userId={user?.id ?? null}
              path="/cong-dong"
              showGroup
            />
          ))}
          {posts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
              Chưa có bài viết nào. Hãy là người mở đầu câu chuyện!
            </p>
          )}
        </div>
      </div>

      {/* Groups sidebar */}
      <aside className="mt-10 lg:mt-0 lg:w-80 lg:shrink-0">
        <h2 className="text-xl font-bold text-stone-900">Hội nhóm</h2>
        <ul className="mt-3 space-y-2">
          {groups.map((g) => (
            <li key={g.id}>
              <Link
                href={`/cong-dong/nhom/${g.id}`}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 hover:border-brand-300"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
                  {g.cover_emoji}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-bold text-stone-900">
                    {g.name}
                  </span>
                  <span className="text-sm text-stone-500">
                    {g.group_members?.[0]?.count ?? 0} thành viên
                    {g.city ? ` · ${g.city}` : ""}
                  </span>
                </span>
              </Link>
            </li>
          ))}
          {groups.length === 0 && (
            <li className="rounded-2xl border border-dashed border-stone-300 bg-white p-5 text-center text-stone-500">
              Chưa có hội nhóm nào.
            </li>
          )}
        </ul>

        {user && (
          <details className="mt-4 rounded-2xl border border-stone-200 bg-white p-5">
            <summary className="cursor-pointer font-bold text-brand-700">
              + Tạo hội nhóm mới
            </summary>
            <form action={createGroup} className="mt-3 space-y-3">
              <div>
                <label htmlFor="g-name" className="mb-1 block font-semibold">
                  Tên nhóm
                </label>
                <input
                  id="g-name"
                  name="name"
                  required
                  placeholder="VD: CLB Dưỡng sinh Quận 3"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5"
                />
              </div>
              <div>
                <label htmlFor="g-emoji" className="mb-1 block font-semibold">
                  Biểu tượng
                </label>
                <select
                  id="g-emoji"
                  name="cover_emoji"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
                >
                  {["🌼", "🏸", "🎶", "🌿", "📚", "🚶", "🧘", "🍵", "♟️", "📷"].map(
                    (e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div>
                <label htmlFor="g-city" className="mb-1 block font-semibold">
                  Khu vực
                </label>
                <select
                  id="g-city"
                  name="city"
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
                >
                  <option value="">Toàn quốc</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="g-desc" className="mb-1 block font-semibold">
                  Giới thiệu
                </label>
                <textarea
                  id="g-desc"
                  name="description"
                  rows={2}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5"
                />
              </div>
              <button className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700">
                Tạo nhóm
              </button>
            </form>
          </details>
        )}

        <Link
          href="/ban-be"
          className="mt-4 block rounded-2xl bg-indigo-50 p-5 font-bold text-indigo-800 hover:bg-indigo-100"
        >
          👥 Bạn bè & lời mời kết bạn →
        </Link>
      </aside>
    </div>
  );
}
