"use client";

import { useState, useTransition } from "react";
import { submitReview } from "./actions";

export default function ReviewForm({
  facilityId,
  slug,
  existing,
}: {
  facilityId: string;
  slug: string;
  existing: { rating: number; body: string } | null;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 5);
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => submitReview(facilityId, slug, formData))
      }
      className="mt-6 rounded-2xl bg-stone-50 p-5"
    >
      <h3 className="font-bold text-stone-900">
        {existing ? "Cập nhật đánh giá của bạn" : "Viết đánh giá"}
      </h3>
      <fieldset className="mt-3">
        <legend className="mb-1 font-semibold">Chấm điểm</legend>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} sao`}
              aria-pressed={rating === n}
              className={`text-3xl transition ${
                n <= rating ? "text-amber-500" : "text-stone-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </fieldset>
      <div className="mt-3">
        <label htmlFor="rv-body" className="mb-1 block font-semibold">
          Trải nghiệm của bạn
        </label>
        <textarea
          id="rv-body"
          name="body"
          rows={4}
          required
          minLength={20}
          defaultValue={existing?.body ?? ""}
          placeholder="Chia sẻ trải nghiệm thực tế của bạn về cơ sở này (ít nhất 20 ký tự)…"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-xl bg-brand-600 px-6 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {pending ? "Đang gửi…" : existing ? "Cập nhật đánh giá" : "Gửi đánh giá"}
      </button>
    </form>
  );
}
