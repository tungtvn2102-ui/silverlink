import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Organization } from "@/lib/types";
import type { Facility, Review } from "@/lib/facilities";
import type { Post } from "@/lib/community";
import { timeAgo } from "@/lib/community";
import {
  setOrgStatus,
  setFacilityStatus,
  setReviewStatus,
  setPostStatus,
} from "./actions";

export const metadata: Metadata = { title: "Quản trị" };

export default async function AdminPage() {
  const supabase = await createClient();

  const [orgsRes, facilitiesRes, flaggedRes, flaggedPostsRes, statsOrgs, statsUsers] =
    await Promise.all([
      supabase
        .from("organizations")
        .select("*")
        .eq("verification_status", "pending")
        .order("created_at"),
      supabase
        .from("facilities")
        .select("*, organizations(name, verification_status)")
        .eq("verification_status", "pending")
        .order("created_at"),
      supabase
        .from("reviews")
        .select("*, profiles(full_name), facilities(name, slug)")
        .eq("status", "flagged")
        .order("created_at"),
      supabase
        .from("posts")
        .select("*, profiles!posts_author_id_fkey(full_name, city), groups(name)")
        .eq("status", "flagged")
        .order("created_at"),
      supabase
        .from("organizations")
        .select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
    ]);

  const pendingOrgs = (orgsRes.data ?? []) as Organization[];
  const pendingFacilities = (facilitiesRes.data ?? []) as (Facility & {
    organizations: { name: string; verification_status: string } | null;
  })[];
  const flagged = (flaggedRes.data ?? []) as (Review & {
    facilities: { name: string; slug: string } | null;
  })[];
  const flaggedPosts = (flaggedPostsRes.data ?? []) as Post[];

  // Signed URLs so admins can open private license docs
  const licenseUrls = new Map<string, string>();
  for (const org of pendingOrgs) {
    if (org.license_doc_path) {
      const { data } = await supabase.storage
        .from("verification-docs")
        .createSignedUrl(org.license_doc_path, 3600);
      if (data?.signedUrl) licenseUrls.set(org.id, data.signedUrl);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900">
        Bảng điều khiển quản trị
      </h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-3xl font-extrabold text-brand-700">
            {statsUsers.count ?? 0}
          </p>
          <p className="font-semibold text-stone-600">Người dùng</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-3xl font-extrabold text-brand-700">
            {statsOrgs.count ?? 0}
          </p>
          <p className="font-semibold text-stone-600">Doanh nghiệp</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-3xl font-extrabold text-amber-600">
            {pendingOrgs.length + pendingFacilities.length}
          </p>
          <p className="font-semibold text-stone-600">Hồ sơ chờ kiểm chứng</p>
        </div>
      </div>

      {/* Pending organizations */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-stone-900">
          Doanh nghiệp chờ kiểm chứng ({pendingOrgs.length})
        </h2>
        {pendingOrgs.length === 0 ? (
          <p className="mt-3 text-stone-500">Không có hồ sơ nào đang chờ.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pendingOrgs.map((org) => (
              <li
                key={org.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{org.name}</p>
                    <p className="text-sm text-stone-600">
                      MST: {org.tax_id || "—"} · {org.contact_email} ·{" "}
                      {org.contact_phone}
                    </p>
                    {org.description && (
                      <p className="mt-1 text-sm text-stone-600">
                        {org.description}
                      </p>
                    )}
                    {licenseUrls.has(org.id) ? (
                      <a
                        href={licenseUrls.get(org.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-block font-bold text-brand-700 underline"
                      >
                        📄 Xem giấy phép
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-semibold text-amber-700">
                        ⚠ Chưa nộp giấy phép
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <form action={setOrgStatus.bind(null, org.id, "verified")}>
                      <button className="rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700">
                        ✓ Duyệt
                      </button>
                    </form>
                    <form action={setOrgStatus.bind(null, org.id, "rejected")}>
                      <button className="rounded-xl border-2 border-red-300 px-5 py-2.5 font-bold text-red-700 hover:bg-red-50">
                        Từ chối
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Pending facilities */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-stone-900">
          Cơ sở chờ kiểm chứng ({pendingFacilities.length})
        </h2>
        {pendingFacilities.length === 0 ? (
          <p className="mt-3 text-stone-500">Không có cơ sở nào đang chờ.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {pendingFacilities.map((f) => (
              <li
                key={f.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold">{f.name}</p>
                    <p className="text-sm text-stone-600">
                      {f.address} · Doanh nghiệp: {f.organizations?.name}
                      {f.organizations?.verification_status !== "verified" && (
                        <span className="ml-2 font-bold text-amber-700">
                          (doanh nghiệp chưa được duyệt)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form
                      action={setFacilityStatus.bind(null, f.id, "verified")}
                    >
                      <button className="rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700">
                        ✓ Duyệt
                      </button>
                    </form>
                    <form
                      action={setFacilityStatus.bind(null, f.id, "rejected")}
                    >
                      <button className="rounded-xl border-2 border-red-300 px-5 py-2.5 font-bold text-red-700 hover:bg-red-50">
                        Từ chối
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flagged reviews */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-stone-900">
          Đánh giá bị báo cáo ({flagged.length})
        </h2>
        {flagged.length === 0 ? (
          <p className="mt-3 text-stone-500">Không có nội dung chờ xử lý.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {flagged.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <p className="text-sm text-stone-500">
                  {r.profiles?.full_name} viết về{" "}
                  <Link
                    href={`/duong-lao/${r.facilities?.slug}`}
                    className="font-bold text-brand-700 underline"
                  >
                    {r.facilities?.name}
                  </Link>{" "}
                  · {r.rating}★
                </p>
                <p className="mt-2 text-stone-700">{r.body}</p>
                <div className="mt-3 flex gap-2">
                  <form
                    action={setReviewStatus.bind(null, r.id, "published")}
                  >
                    <button className="rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50">
                      Khôi phục
                    </button>
                  </form>
                  <form action={setReviewStatus.bind(null, r.id, "removed")}>
                    <button className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">
                      Gỡ bỏ
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Flagged posts */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-stone-900">
          Bài viết bị báo cáo ({flaggedPosts.length})
        </h2>
        {flaggedPosts.length === 0 ? (
          <p className="mt-3 text-stone-500">Không có bài viết chờ xử lý.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {flaggedPosts.map((p) => (
              <li
                key={p.id}
                className="rounded-2xl border border-stone-200 bg-white p-5"
              >
                <p className="text-sm text-stone-500">
                  {p.profiles?.full_name} · {timeAgo(p.created_at)}
                  {p.groups?.name && ` · trong nhóm ${p.groups.name}`}
                </p>
                <p className="mt-2 whitespace-pre-line text-stone-700">
                  {p.body}
                </p>
                <div className="mt-3 flex gap-2">
                  <form action={setPostStatus.bind(null, p.id, "published")}>
                    <button className="rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50">
                      Khôi phục
                    </button>
                  </form>
                  <form action={setPostStatus.bind(null, p.id, "removed")}>
                    <button className="rounded-xl bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700">
                      Gỡ bỏ
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
