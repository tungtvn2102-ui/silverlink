"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function OrgOnboarding() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const file = form.get("license") as File | null;
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/dang-nhap?next=/doanh-nghiep");
      return;
    }

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        owner_id: user.id,
        name: String(form.get("name")),
        type: String(form.get("type")),
        tax_id: String(form.get("tax_id")),
        contact_email: String(form.get("contact_email")),
        contact_phone: String(form.get("contact_phone")),
        description: String(form.get("description") ?? "") || null,
      })
      .select()
      .single();

    if (orgError || !org) {
      setLoading(false);
      setError("Không thể tạo hồ sơ doanh nghiệp. Vui lòng thử lại.");
      return;
    }

    if (file && file.size > 0) {
      if (file.size > 10 * 1024 * 1024) {
        setLoading(false);
        setError("Tệp giấy phép tối đa 10MB.");
        return;
      }
      const ext = file.name.split(".").pop() ?? "pdf";
      const path = `${org.id}/giay-phep.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("verification-docs")
        .upload(path, file, { upsert: true });
      if (!uploadError) {
        await supabase
          .from("organizations")
          .update({ license_doc_path: path })
          .eq("id", org.id);
      }
    }

    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="org-name" className="mb-1 block font-semibold">
          Tên doanh nghiệp / cơ sở
        </label>
        <input
          id="org-name"
          name="name"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="org-type" className="mb-1 block font-semibold">
          Loại hình
        </label>
        <select
          id="org-type"
          name="type"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        >
          <option value="facility_operator">Cơ sở dưỡng lão</option>
          <option value="employer">Doanh nghiệp tuyển dụng</option>
          <option value="both">Cả hai</option>
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="org-tax" className="mb-1 block font-semibold">
            Mã số thuế
          </label>
          <input
            id="org-tax"
            name="tax_id"
            required
            pattern="[0-9]{10}(-[0-9]{3})?"
            placeholder="VD: 0312345678"
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="org-phone" className="mb-1 block font-semibold">
            Điện thoại liên hệ
          </label>
          <input
            id="org-phone"
            name="contact_phone"
            type="tel"
            required
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
      </div>
      <div>
        <label htmlFor="org-email" className="mb-1 block font-semibold">
          Email liên hệ
        </label>
        <input
          id="org-email"
          name="contact_email"
          type="email"
          required
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="org-desc" className="mb-1 block font-semibold">
          Giới thiệu ngắn{" "}
          <span className="font-normal text-stone-500">(tuỳ chọn)</span>
        </label>
        <textarea
          id="org-desc"
          name="description"
          rows={3}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="org-license" className="mb-1 block font-semibold">
          Giấy phép hoạt động{" "}
          <span className="font-normal text-stone-500">(PDF / ảnh, tối đa 10MB)</span>
        </label>
        <input
          id="org-license"
          name="license"
          type="file"
          accept=".pdf,image/*"
          className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-bold file:text-brand-800"
        />
        <p className="mt-1 text-sm text-stone-500">
          Chỉ đội ngũ kiểm chứng SilverLink xem được tệp này.
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Đang gửi hồ sơ…" : "Gửi hồ sơ kiểm chứng"}
      </button>
    </form>
  );
}
