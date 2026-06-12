"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CITIES } from "@/lib/constants";
import { FACILITY_SERVICES, type Facility } from "@/lib/facilities";
import { slugify } from "@/lib/slug";

export default function FacilityForm({
  orgId,
  facility,
}: {
  orgId: string;
  facility: Facility | null;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>(facility?.photo_urls ?? []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    // Upload any newly selected photos first
    const files = (form.getAll("photos") as File[]).filter((f) => f.size > 0);
    const photoUrls = [...photos];
    for (const file of files.slice(0, 6)) {
      if (file.size > 5 * 1024 * 1024) {
        setLoading(false);
        setError("Mỗi ảnh tối đa 5MB.");
        return;
      }
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${orgId}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("facility-photos")
        .upload(path, file);
      if (upErr) {
        setLoading(false);
        setError("Tải ảnh lên thất bại. Vui lòng thử lại.");
        return;
      }
      const { data } = supabase.storage
        .from("facility-photos")
        .getPublicUrl(path);
      photoUrls.push(data.publicUrl);
    }

    const name = String(form.get("name"));
    const district = String(form.get("district") ?? "");
    const priceMin = form.get("price_min")
      ? Number(form.get("price_min")) * 1_000_000
      : null;
    const priceMax = form.get("price_max")
      ? Number(form.get("price_max")) * 1_000_000
      : null;

    const payload = {
      org_id: orgId,
      name,
      city: String(form.get("city")),
      district: district || null,
      address: String(form.get("address")),
      description: String(form.get("description") ?? "") || null,
      capacity: form.get("capacity") ? Number(form.get("capacity")) : null,
      price_min: priceMin,
      price_max: priceMax,
      phone: String(form.get("phone") ?? "") || null,
      services: FACILITY_SERVICES.map((s) => s.key).filter(
        (k) => form.get(`svc-${k}`) === "on"
      ),
      photo_urls: photoUrls,
      published: form.get("published") === "on",
    };

    let saveError;
    if (facility) {
      ({ error: saveError } = await supabase
        .from("facilities")
        .update(payload)
        .eq("id", facility.id));
    } else {
      const slug = `${slugify(name)}-${slugify(district || String(form.get("city")))}-${Date.now().toString(36).slice(-4)}`;
      ({ error: saveError } = await supabase
        .from("facilities")
        .insert({ ...payload, slug }));
    }

    setLoading(false);
    if (saveError) {
      setError("Lưu không thành công. Vui lòng kiểm tra thông tin và thử lại.");
      return;
    }
    router.push("/doanh-nghiep/co-so");
    router.refresh();
  }

  async function removePhoto(url: string) {
    setPhotos((p) => p.filter((u) => u !== url));
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label htmlFor="f-name" className="mb-1 block font-semibold">
          Tên cơ sở
        </label>
        <input
          id="f-name"
          name="name"
          required
          defaultValue={facility?.name ?? ""}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="f-city" className="mb-1 block font-semibold">
            Tỉnh / Thành phố
          </label>
          <select
            id="f-city"
            name="city"
            required
            defaultValue={facility?.city ?? "TP. Hồ Chí Minh"}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-district" className="mb-1 block font-semibold">
            Quận / Huyện
          </label>
          <input
            id="f-district"
            name="district"
            defaultValue={facility?.district ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
      </div>
      <div>
        <label htmlFor="f-address" className="mb-1 block font-semibold">
          Địa chỉ đầy đủ
        </label>
        <input
          id="f-address"
          name="address"
          required
          defaultValue={facility?.address ?? ""}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="f-pmin" className="mb-1 block font-semibold">
            Giá từ (triệu/tháng)
          </label>
          <input
            id="f-pmin"
            name="price_min"
            type="number"
            min={0}
            step={0.5}
            defaultValue={
              facility?.price_min != null ? facility.price_min / 1_000_000 : ""
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="f-pmax" className="mb-1 block font-semibold">
            Đến (triệu/tháng)
          </label>
          <input
            id="f-pmax"
            name="price_max"
            type="number"
            min={0}
            step={0.5}
            defaultValue={
              facility?.price_max != null ? facility.price_max / 1_000_000 : ""
            }
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="f-capacity" className="mb-1 block font-semibold">
            Sức chứa (người)
          </label>
          <input
            id="f-capacity"
            name="capacity"
            type="number"
            min={1}
            defaultValue={facility?.capacity ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
      </div>
      <div>
        <label htmlFor="f-phone" className="mb-1 block font-semibold">
          Số điện thoại cơ sở
        </label>
        <input
          id="f-phone"
          name="phone"
          type="tel"
          defaultValue={facility?.phone ?? ""}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <fieldset>
        <legend className="mb-2 font-semibold">Dịch vụ cung cấp</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {FACILITY_SERVICES.map((s) => (
            <label
              key={s.key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 hover:border-brand-300"
            >
              <input
                type="checkbox"
                name={`svc-${s.key}`}
                defaultChecked={facility?.services.includes(s.key)}
                className="h-5 w-5 accent-brand-600"
              />
              <span className="font-medium">{s.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="f-desc" className="mb-1 block font-semibold">
          Giới thiệu cơ sở
        </label>
        <textarea
          id="f-desc"
          name="description"
          rows={5}
          defaultValue={facility?.description ?? ""}
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>

      {/* Photos */}
      <div>
        <p className="mb-2 font-semibold">Hình ảnh</p>
        {photos.length > 0 && (
          <ul className="mb-3 flex flex-wrap gap-3">
            {photos.map((url) => (
              <li key={url} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Ảnh cơ sở"
                  className="h-24 w-36 rounded-xl object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  aria-label="Xóa ảnh"
                  className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-red-600 font-bold text-white"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          name="photos"
          type="file"
          accept="image/*"
          multiple
          aria-label="Tải ảnh lên"
          className="w-full rounded-xl border border-dashed border-stone-300 bg-white px-4 py-3 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-4 file:py-2 file:font-bold file:text-brand-800"
        />
        <p className="mt-1 text-sm text-stone-500">
          Tối đa 6 ảnh, mỗi ảnh 5MB. Ảnh đầu tiên là ảnh đại diện.
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-stone-50 px-4 py-3">
        <input
          type="checkbox"
          name="published"
          defaultChecked={facility?.published ?? true}
          className="h-5 w-5 accent-brand-600"
        />
        <span className="font-semibold">
          Đăng công khai (hiển thị sau khi cơ sở được SilverLink kiểm chứng)
        </span>
      </label>

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
        {loading ? "Đang lưu…" : facility ? "Lưu thay đổi" : "Tạo cơ sở"}
      </button>
    </form>
  );
}
