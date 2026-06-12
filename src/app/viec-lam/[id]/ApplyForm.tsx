"use client";

import { useTransition } from "react";
import { applyToJob } from "./actions";

export default function ApplyForm({
  jobId,
  workProfile,
}: {
  jobId: string;
  workProfile: {
    skills: string | null;
    experience_years: number | null;
    availability: string | null;
  } | null;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(() => applyToJob(jobId, formData))
      }
      className="rounded-3xl border-2 border-brand-200 bg-white p-7"
    >
      <h2 className="text-xl font-extrabold text-stone-900">
        Ứng tuyển vị trí này
      </h2>
      <p className="mt-1 text-sm text-stone-600">
        Hồ sơ làm việc của bạn sẽ được gửi kèm cho nhà tuyển dụng.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="ap-phone" className="mb-1 block font-semibold">
            Số điện thoại liên hệ
          </label>
          <input
            id="ap-phone"
            name="phone"
            type="tel"
            required
            pattern="0[0-9]{9,10}"
            placeholder="VD: 0901234567"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="ap-skills" className="mb-1 block font-semibold">
            Kỹ năng / Chuyên môn
          </label>
          <input
            id="ap-skills"
            name="skills"
            defaultValue={workProfile?.skills ?? ""}
            placeholder="VD: Kế toán, dạy học, tư vấn quản lý…"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ap-exp" className="mb-1 block font-semibold">
              Số năm kinh nghiệm
            </label>
            <input
              id="ap-exp"
              name="experience_years"
              type="number"
              min={0}
              max={70}
              defaultValue={workProfile?.experience_years ?? ""}
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="ap-avail" className="mb-1 block font-semibold">
              Thời gian có thể làm
            </label>
            <input
              id="ap-avail"
              name="availability"
              defaultValue={workProfile?.availability ?? ""}
              placeholder="VD: Buổi sáng, 3 ngày/tuần"
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
        </div>
        <div>
          <label htmlFor="ap-msg" className="mb-1 block font-semibold">
            Lời nhắn cho nhà tuyển dụng{" "}
            <span className="font-normal text-stone-500">(tuỳ chọn)</span>
          </label>
          <textarea
            id="ap-msg"
            name="message"
            rows={3}
            placeholder="Giới thiệu ngắn gọn về bản thân và lý do bạn phù hợp…"
            className="w-full rounded-xl border border-stone-300 px-4 py-3"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {pending ? "Đang gửi hồ sơ…" : "Gửi hồ sơ ứng tuyển"}
        </button>
      </div>
    </form>
  );
}
