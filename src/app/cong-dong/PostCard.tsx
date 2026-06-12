import Link from "next/link";
import type { Post } from "@/lib/community";
import { timeAgo } from "@/lib/community";
import { createComment, toggleReaction, flagPost } from "./actions";

export default function PostCard({
  post,
  userId,
  path,
  showGroup = false,
}: {
  post: Post;
  userId: string | null;
  path: string;
  showGroup?: boolean;
}) {
  const reactions = post.reactions ?? [];
  const comments = post.comments ?? [];
  const hasReacted = !!userId && reactions.some((r) => r.profile_id === userId);

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-800">
            {(post.profiles?.full_name || "?").charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-stone-900">
              {post.profiles?.full_name || "Người dùng SilverLink"}
            </p>
            <p className="text-sm text-stone-500">
              {timeAgo(post.created_at)}
              {showGroup && post.groups && (
                <>
                  {" · trong "}
                  <Link
                    href={`/cong-dong/nhom/${post.group_id}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {post.groups.name}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>
        {userId && (
          <form action={flagPost.bind(null, post.id, path)}>
            <button
              title="Báo cáo bài viết"
              aria-label="Báo cáo bài viết"
              className="rounded-lg px-2 py-1 text-stone-400 hover:bg-stone-100 hover:text-red-600"
            >
              ⚑
            </button>
          </form>
        )}
      </div>

      <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-800">
        {post.body}
      </p>

      <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3">
        <form
          action={toggleReaction.bind(null, post.id, path, hasReacted)}
        >
          <button
            aria-pressed={hasReacted}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-bold transition ${
              hasReacted
                ? "bg-red-50 text-red-600"
                : "text-stone-500 hover:bg-stone-100"
            }`}
          >
            {hasReacted ? "❤️" : "🤍"} {reactions.length > 0 && reactions.length}
            <span className="sr-only">Yêu thích</span>
          </button>
        </form>
        <span className="text-stone-500">
          💬 {comments.length} bình luận
        </span>
      </div>

      {comments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {comments.slice(0, 5).map((c) => (
            <li key={c.id} className="rounded-xl bg-stone-50 px-4 py-2.5">
              <p className="text-sm">
                <span className="font-bold text-stone-800">
                  {c.profiles?.full_name || "Người dùng"}
                </span>{" "}
                <span className="text-stone-400">· {timeAgo(c.created_at)}</span>
              </p>
              <p className="text-stone-700">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {userId && (
        <form
          action={createComment.bind(null, post.id, path)}
          className="mt-3 flex gap-2"
        >
          <label htmlFor={`cm-${post.id}`} className="sr-only">
            Viết bình luận
          </label>
          <input
            id={`cm-${post.id}`}
            name="body"
            required
            placeholder="Viết bình luận…"
            className="min-w-0 flex-1 rounded-xl border border-stone-300 px-4 py-2.5"
          />
          <button className="rounded-xl bg-brand-600 px-4 py-2.5 font-bold text-white hover:bg-brand-700">
            Gửi
          </button>
        </form>
      )}
    </article>
  );
}
