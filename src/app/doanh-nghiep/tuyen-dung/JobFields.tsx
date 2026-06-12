import { CITIES } from "@/lib/constants";
import { JOB_TYPES, JOB_TAGS, type Job } from "@/lib/jobs";

/** Shared job form fields for create & edit (server-action forms). */
export default function JobFields({ job }: { job: Job | null }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="j-title" className="mb-1 block font-semibold">
          Tiêu đề công việc
        </label>
        <input
          id="j-title"
          name="title"
          required
          defaultValue={job?.title ?? ""}
          placeholder="VD: Cố vấn kế toán bán thời gian"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="j-type" className="mb-1 block font-semibold">
            Loại hình
          </label>
          <select
            id="j-type"
            name="job_type"
            defaultValue={job?.job_type ?? "part_time"}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            {JOB_TYPES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="j-city" className="mb-1 block font-semibold">
            Tỉnh / Thành phố
          </label>
          <select
            id="j-city"
            name="city"
            defaultValue={job?.city ?? "TP. Hồ Chí Minh"}
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
          <label htmlFor="j-district" className="mb-1 block font-semibold">
            Quận / Huyện
          </label>
          <input
            id="j-district"
            name="district"
            defaultValue={job?.district ?? ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="j-smin" className="mb-1 block font-semibold">
            Thu nhập từ (triệu/tháng)
          </label>
          <input
            id="j-smin"
            name="salary_min"
            type="number"
            min={0}
            step={0.5}
            defaultValue={job?.salary_min != null ? job.salary_min / 1_000_000 : ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
        <div>
          <label htmlFor="j-smax" className="mb-1 block font-semibold">
            Đến (triệu/tháng)
          </label>
          <input
            id="j-smax"
            name="salary_max"
            type="number"
            min={0}
            step={0.5}
            defaultValue={job?.salary_max != null ? job.salary_max / 1_000_000 : ""}
            className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </div>
      </div>
      <fieldset>
        <legend className="mb-2 font-semibold">
          Đặc điểm thân thiện với người cao tuổi
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {JOB_TAGS.map((t) => (
            <label
              key={t.key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 hover:border-brand-300"
            >
              <input
                type="checkbox"
                name={`tag-${t.key}`}
                defaultChecked={job?.tags.includes(t.key)}
                className="h-5 w-5 accent-brand-600"
              />
              <span className="font-medium">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="j-desc" className="mb-1 block font-semibold">
          Mô tả công việc
        </label>
        <textarea
          id="j-desc"
          name="description"
          rows={6}
          required
          defaultValue={job?.description ?? ""}
          placeholder="Mô tả công việc, yêu cầu và quyền lợi…"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
        />
      </div>
    </div>
  );
}
