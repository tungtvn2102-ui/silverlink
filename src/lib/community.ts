export type Group = {
  id: string;
  name: string;
  description: string | null;
  city: string | null;
  cover_emoji: string;
  created_by: string;
  created_at: string;
  group_members?: { count: number }[];
};

export type Post = {
  id: string;
  group_id: string | null;
  author_id: string;
  body: string;
  image_url: string | null;
  status: "published" | "flagged" | "removed";
  created_at: string;
  profiles?: { full_name: string; city: string | null } | null;
  groups?: { name: string } | null;
  comments?: Comment[];
  reactions?: { profile_id: string }[];
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
  profiles?: { full_name: string } | null;
};

export type Connection = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  requester?: { full_name: string; city: string | null } | null;
  addressee?: { full_name: string; city: string | null } | null;
};

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}
