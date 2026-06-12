"use client";

import { useState, useTransition } from "react";
import { createBooking } from "./actions";

export default function BookingForm({
  facilityId,
  slug,
  defaultName,
}: {
  facilityId: string;
  slug: string;
  defaultName: string;
}) {
  const [minDate] = useState(() =>
    new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => createBooking(facilityId, slug, formData))
      }
      className="mt-4 space-y-3"
    >
      <div>
        <label htmlFor="bk-name" className="mb-1 block font-semibold">
          Họ tên người liên hệ
        </label>
        <input
          id="bk-name"
          name="full_name"
          required
          defaultValue={defaultName}
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
        />
      </div>
      <div>
        <label htmlFor="bk-phone" className="mb-1 block font-semibold">
          Số điện thoại
        </label>
        <input
          id="bk-phone"
          name="phone"
          type="tel"
          required
          pattern="0[0-9]{9,10}"
          placeholder="VD: 0901234567"
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="bk-date" className="mb-1 block font-semibold">
            Ngày mong muốn
          </label>
          <input
            id="bk-date"
            name="preferred_date"
            type="date"
            required
            min={minDate}
            className="w-full rounded-xl border border-stone-300 px-3 py-3"
          />
        </div>
        <div>
          <label htmlFor="bk-time" className="mb-1 block font-semibold">
            Buổi
          </label>
          <select
            id="bk-time"
            name="preferred_time"
            className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3"
          >
            <option value="morning">Buổi sáng</option>
            <option value="afternoon">Buổi chiều</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="bk-note" className="mb-1 block font-semibold">
          Ghi chú <span className="font-normal text-stone-500">(tuỳ chọn)</span>
        </label>
        <textarea
          id="bk-note"
          name="note"
          rows={2}
          placeholder="VD: Cần tư vấn chăm sóc người bệnh tiểu đường…"
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Đang gửi…" : "Gửi yêu cầu tham quan"}
      </button>
    </form>
  );
}
