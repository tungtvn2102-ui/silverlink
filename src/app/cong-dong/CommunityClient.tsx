"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, type User } from "firebase/auth";
import { CITIES } from "@/lib/constants";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

type Community = {
  id: string;
  name: string;
  description: string;
  city: string;
  emoji: string;
  createdBy: string;
  createdByName: string;
  createdAt: number;
};

type CommunityComment = {
  id: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: number;
};

type CommunityPost = {
  id: string;
  communityId: string;
  communityName: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: number;
  comments: CommunityComment[];
  reactions: Record<string, string[]>;
};

const STORE_KEY = "silverlink:community:v1";
const REACTION_EMOJIS = ["❤️", "👏", "🙏", "😊", "💡", "🌿"];
const COMMUNITY_EMOJIS = ["🌼", "🎵", "📚", "🚶", "🧘", "🍵", "♟️", "📷", "🌿", "💬"];
const POST_EMOJIS = ["😊", "🙏", "🌿", "❤️", "👏", "💡", "☕", "🎵"];

const DEFAULT_COMMUNITIES: Community[] = [
  {
    id: "general",
    name: "Câu chuyện thường ngày",
    description: "Chia sẻ nhẹ nhàng, hỏi thăm và kết nối với mọi người.",
    city: "",
    emoji: "💬",
    createdBy: "system",
    createdByName: "SilverLink",
    createdAt: 1,
  },
  {
    id: "care",
    name: "Kinh nghiệm chăm sóc",
    description: "Hỏi đáp về chăm sóc sức khỏe, sinh hoạt và tinh thần.",
    city: "",
    emoji: "🌿",
    createdBy: "system",
    createdByName: "SilverLink",
    createdAt: 2,
  },
];

function displayName(user: User | null) {
  return user?.displayName || user?.email || "Người dùng SilverLink";
}

function timeAgo(value: number) {
  const seconds = Math.floor((Date.now() - value) / 1000);
  if (seconds < 60) return "vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(value).toLocaleDateString("vi-VN");
}

function readLocalStore() {
  if (typeof window === "undefined") {
    return { communities: [] as Community[], posts: [] as CommunityPost[] };
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { communities: [] as Community[], posts: [] as CommunityPost[] };
    return JSON.parse(raw) as {
      communities: Community[];
      posts: CommunityPost[];
    };
  } catch {
    return { communities: [] as Community[], posts: [] as CommunityPost[] };
  }
}

function writeLocalStore(communities: Community[], posts: CommunityPost[]) {
  localStorage.setItem(STORE_KEY, JSON.stringify({ communities, posts }));
}

function mergeCommunities(communities: Community[]) {
  const map = new Map<string, Community>();
  for (const item of DEFAULT_COMMUNITIES) map.set(item.id, item);
  for (const item of communities) map.set(item.id, item);
  return [...map.values()].sort((a, b) => b.createdAt - a.createdAt);
}

export default function CommunityClient() {
  const [user, setUser] = useState<User | null>(null);
  const [communities, setCommunities] = useState<Community[]>(DEFAULT_COMMUNITIES);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState("all");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [useLocalFallback, setUseLocalFallback] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), setUser);
  }, []);

  useEffect(() => {
    const db = getFirebaseDb();
    const communitiesQuery = query(
      collection(db, "communities"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const postsQuery = query(
      collection(db, "communityPosts"),
      orderBy("createdAt", "desc"),
      limit(100)
    );

    const unsubCommunities = onSnapshot(
      communitiesQuery,
      (snapshot) => {
        setUseLocalFallback(false);
        setCommunities(
          mergeCommunities(
            snapshot.docs.map((item) => ({
              id: item.id,
              ...(item.data() as Omit<Community, "id">),
            }))
          )
        );
      },
      () => {
        const local = readLocalStore();
        setUseLocalFallback(true);
        setCommunities(mergeCommunities(local.communities));
        setPosts(local.posts);
      }
    );

    const unsubPosts = onSnapshot(
      postsQuery,
      (snapshot) => {
        setUseLocalFallback(false);
        setPosts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...(item.data() as Omit<CommunityPost, "id">),
          }))
        );
      },
      () => {
        const local = readLocalStore();
        setUseLocalFallback(true);
        setCommunities(mergeCommunities(local.communities));
        setPosts(local.posts);
      }
    );

    return () => {
      unsubCommunities();
      unsubPosts();
    };
  }, []);

  const selectedCommunity = communities.find((item) => item.id === selectedCommunityId);
  const visiblePosts = useMemo(() => {
    if (selectedCommunityId === "all") return posts;
    return posts.filter((post) => post.communityId === selectedCommunityId);
  }, [posts, selectedCommunityId]);

  async function createCommunity(formData: FormData) {
    if (!user) {
      setError("Vui lòng đăng nhập để tạo cộng đồng.");
      return;
    }

    const community: Community = {
      id: crypto.randomUUID(),
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      city: String(formData.get("city") ?? ""),
      emoji: String(formData.get("emoji") ?? "🌼"),
      createdBy: user.uid,
      createdByName: displayName(user),
      createdAt: Date.now(),
    };

    if (!community.name) return;

    try {
      if (useLocalFallback) {
        const local = readLocalStore();
        const nextCommunities = [community, ...local.communities];
        writeLocalStore(nextCommunities, local.posts);
        setCommunities(mergeCommunities(nextCommunities));
      } else {
        await setDoc(doc(getFirebaseDb(), "communities", community.id), community);
      }
      setSelectedCommunityId(community.id);
      setNotice("Đã tạo cộng đồng mới.");
    } catch {
      const local = readLocalStore();
      const nextCommunities = [community, ...local.communities];
      writeLocalStore(nextCommunities, local.posts);
      setUseLocalFallback(true);
      setCommunities(mergeCommunities(nextCommunities));
      setSelectedCommunityId(community.id);
      setNotice("Đã tạo cộng đồng trên trình duyệt này. Bật Firestore để đồng bộ cho mọi người.");
    }
  }

  async function createPost() {
    if (!user) {
      setError("Vui lòng đăng nhập để đăng bài.");
      return;
    }

    const trimmed = body.trim();
    if (!trimmed) return;

    const community = selectedCommunity ?? DEFAULT_COMMUNITIES[0];
    const post: CommunityPost = {
      id: crypto.randomUUID(),
      communityId: community.id,
      communityName: community.name,
      authorId: user.uid,
      authorName: displayName(user),
      body: trimmed,
      createdAt: Date.now(),
      comments: [],
      reactions: {},
    };

    try {
      if (useLocalFallback) {
        const local = readLocalStore();
        const nextPosts = [post, ...local.posts];
        writeLocalStore(local.communities, nextPosts);
        setPosts(nextPosts);
      } else {
        await setDoc(doc(getFirebaseDb(), "communityPosts", post.id), post);
      }
      setBody("");
    } catch {
      const local = readLocalStore();
      const nextPosts = [post, ...local.posts];
      writeLocalStore(local.communities, nextPosts);
      setUseLocalFallback(true);
      setPosts(nextPosts);
      setNotice("Đã lưu bài viết trên trình duyệt này. Bật Firestore để đồng bộ cho mọi người.");
    }
  }

  async function addComment(post: CommunityPost, commentBody: string) {
    if (!user) {
      setError("Vui lòng đăng nhập để bình luận.");
      return;
    }

    const trimmed = commentBody.trim();
    if (!trimmed) return;

    const comment: CommunityComment = {
      id: crypto.randomUUID(),
      authorId: user.uid,
      authorName: displayName(user),
      body: trimmed,
      createdAt: Date.now(),
    };

    if (useLocalFallback) {
      const local = readLocalStore();
      const nextPosts = local.posts.map((item) =>
        item.id === post.id ? { ...item, comments: [...item.comments, comment] } : item
      );
      writeLocalStore(local.communities, nextPosts);
      setPosts(nextPosts);
      return;
    }

    await updateDoc(doc(getFirebaseDb(), "communityPosts", post.id), {
      comments: arrayUnion(comment),
    });
  }

  async function toggleReaction(post: CommunityPost, emoji: string) {
    if (!user) {
      setError("Vui lòng đăng nhập để thả emoji.");
      return;
    }

    const hasReacted = post.reactions[emoji]?.includes(user.uid);

    if (useLocalFallback) {
      const local = readLocalStore();
      const nextPosts = local.posts.map((item) => {
        if (item.id !== post.id) return item;
        const nextUsers = hasReacted
          ? (item.reactions[emoji] ?? []).filter((id) => id !== user.uid)
          : [...(item.reactions[emoji] ?? []), user.uid];
        return {
          ...item,
          reactions: { ...item.reactions, [emoji]: nextUsers },
        };
      });
      writeLocalStore(local.communities, nextPosts);
      setPosts(nextPosts);
      return;
    }

    await updateDoc(doc(getFirebaseDb(), "communityPosts", post.id), {
      [`reactions.${emoji}`]: hasReacted ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  }

  return (
    <div className="mx-auto max-w-6xl gap-8 px-4 py-8 lg:flex">
      <main className="min-w-0 flex-1">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-700">
          Cộng đồng SilverLink
        </p>
        <h1 className="mt-1 text-3xl font-extrabold text-stone-900">
          Cộng đồng
        </h1>
        <p className="mt-1 text-stone-600">
          Tạo cộng đồng, chia sẻ câu chuyện, bình luận và thả emoji với những
          người dùng khác.
        </p>

        {useLocalFallback && (
          <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
            Firestore chưa sẵn sàng hoặc chưa mở quyền ghi. Nội dung mới đang
            được lưu tạm trên trình duyệt này.
          </p>
        )}
        {notice && (
          <p className="mt-5 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800">
            {notice}
          </p>
        )}
        {error && (
          <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCommunityId("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              selectedCommunityId === "all"
                ? "bg-brand-700 text-white"
                : "bg-white text-stone-700 ring-1 ring-stone-200"
            }`}
          >
            Tất cả
          </button>
          {communities.map((community) => (
            <button
              key={community.id}
              onClick={() => setSelectedCommunityId(community.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                selectedCommunityId === community.id
                  ? "bg-brand-700 text-white"
                  : "bg-white text-stone-700 ring-1 ring-stone-200"
              }`}
            >
              {community.emoji} {community.name}
            </button>
          ))}
        </div>

        {user ? (
          <section className="mt-5 rounded-2xl border border-stone-200 bg-white p-5">
            <label htmlFor="new-post" className="mb-2 block font-semibold">
              Chia sẻ trong {selectedCommunity?.name ?? "cộng đồng chung"}
            </label>
            <textarea
              id="new-post"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              placeholder="Bạn muốn chia sẻ điều gì hôm nay?"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {POST_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setBody((current) => `${current}${emoji}`)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-stone-100 text-lg hover:bg-brand-50"
                    aria-label={`Thêm ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button
                onClick={createPost}
                className="rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700"
              >
                Đăng bài
              </button>
            </div>
          </section>
        ) : (
          <p className="mt-5 rounded-2xl bg-brand-50 p-5 text-stone-700">
            <Link
              href="/dang-nhap?next=/cong-dong"
              className="font-bold text-brand-700 underline"
            >
              Đăng nhập
            </Link>{" "}
            để tạo cộng đồng, đăng bài, bình luận và thả emoji.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {visiblePosts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
              user={user}
              onComment={addComment}
              onReact={toggleReaction}
            />
          ))}
          {visiblePosts.length === 0 && (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
              Chưa có bài viết nào trong mục này.
            </p>
          )}
        </div>
      </main>

      <aside className="mt-10 lg:mt-0 lg:w-80 lg:shrink-0">
        <h2 className="text-xl font-bold text-stone-900">Tạo cộng đồng</h2>
        {user ? (
          <form action={createCommunity} className="mt-3 space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <div>
              <label htmlFor="community-name" className="mb-1 block font-semibold">
                Tên cộng đồng
              </label>
              <input
                id="community-name"
                name="name"
                required
                placeholder="VD: CLB dưỡng sinh Hà Nội"
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5"
              />
            </div>
            <div>
              <label htmlFor="community-emoji" className="mb-1 block font-semibold">
                Biểu tượng
              </label>
              <select
                id="community-emoji"
                name="emoji"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
              >
                {COMMUNITY_EMOJIS.map((emoji) => (
                  <option key={emoji} value={emoji}>
                    {emoji}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="community-city" className="mb-1 block font-semibold">
                Khu vực
              </label>
              <select
                id="community-city"
                name="city"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5"
              >
                <option value="">Toàn quốc</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="community-description" className="mb-1 block font-semibold">
                Mô tả
              </label>
              <textarea
                id="community-description"
                name="description"
                rows={3}
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5"
              />
            </div>
            <button className="w-full rounded-xl bg-brand-600 px-4 py-3 font-bold text-white hover:bg-brand-700">
              Tạo cộng đồng
            </button>
          </form>
        ) : (
          <p className="mt-3 rounded-2xl bg-white p-5 text-stone-600">
            Đăng nhập để tạo cộng đồng mới.
          </p>
        )}

        <h2 className="mt-6 text-xl font-bold text-stone-900">Danh sách</h2>
        <ul className="mt-3 space-y-2">
          {communities.map((community) => {
            const count = posts.filter((post) => post.communityId === community.id).length;

            return (
              <li key={community.id}>
                <button
                  onClick={() => setSelectedCommunityId(community.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-left hover:border-brand-300"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-2xl">
                    {community.emoji}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold text-stone-900">
                      {community.name}
                    </span>
                    <span className="text-sm text-stone-500">
                      {count} bài viết{community.city ? ` · ${community.city}` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

function CommunityPostCard({
  post,
  user,
  onComment,
  onReact,
}: {
  post: CommunityPost;
  user: User | null;
  onComment: (post: CommunityPost, body: string) => Promise<void>;
  onReact: (post: CommunityPost, emoji: string) => Promise<void>;
}) {
  const [comment, setComment] = useState("");

  return (
    <article className="rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-800">
            {post.authorName.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="font-bold text-stone-900">{post.authorName}</p>
            <p className="text-sm text-stone-500">
              {timeAgo(post.createdAt)} · {post.communityName}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-800">
        {post.body}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-stone-100 pt-3">
        {REACTION_EMOJIS.map((emoji) => {
          const count = post.reactions[emoji]?.length ?? 0;
          const active = !!user && post.reactions[emoji]?.includes(user.uid);

          return (
            <button
              key={emoji}
              onClick={() => onReact(post, emoji)}
              className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                active ? "bg-brand-100 text-brand-800" : "bg-stone-100 text-stone-600"
              }`}
            >
              {emoji} {count > 0 ? count : ""}
            </button>
          );
        })}
      </div>

      {post.comments.length > 0 && (
        <ul className="mt-3 space-y-2">
          {post.comments.slice(-5).map((item) => (
            <li key={item.id} className="rounded-xl bg-stone-50 px-4 py-2.5">
              <p className="text-sm">
                <span className="font-bold text-stone-800">{item.authorName}</span>{" "}
                <span className="text-stone-400">· {timeAgo(item.createdAt)}</span>
              </p>
              <p className="text-stone-700">{item.body}</p>
            </li>
          ))}
        </ul>
      )}

      {user && (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await onComment(post, comment);
            setComment("");
          }}
          className="mt-3 flex gap-2"
        >
          <label htmlFor={`comment-${post.id}`} className="sr-only">
            Viết bình luận
          </label>
          <input
            id={`comment-${post.id}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Viết bình luận..."
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
