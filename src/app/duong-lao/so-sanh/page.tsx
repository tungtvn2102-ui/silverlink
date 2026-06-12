import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  FACILITY_SERVICES,
  formatVND,
  type Facility,
} from "@/lib/facilities";
import Stars from "@/components/Stars";

export const metadata: Metadata = { title: "So sánh nhà dưỡng lão" };

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;
  const idList = (ids ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const supabase = await createClient();

  const { data: allData } = await supabase
    .from("facilities")
    .select("id, name, city")
    .eq("published", true)
    .eq("verification_status", "verified")
    .order("name");
  const all = allData ?? [];

  let selected: Facility[] = [];
  if (idList.length > 0) {
    const { data } = await supabase
      .from("facilities")
      .select("*")
      .in("id", idList);
    // preserve URL order
    selected = idList
      .map((id) => (data ?? []).find((f) => f.id === id))
      .filter(Boolean) as Facility[];
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-stone-900">
        So sánh nhà dưỡng lão
      </h1>
      <p className="mt-1 text-stone-600">
        Chọn tối đa 3 cơ sở để so sánh giá, dịch vụ và đánh giá cạnh nhau.
      </p>

      {/* Picker */}
      <form method="get" className="mt-6 flex flex-wrap items-end gap-3">
        <input type="hidden" name="ids" value={idList.join(",")} />
        <div>
          <label htmlFor="add" className="mb-1 block font-semibold">
            Thêm cơ sở vào bảng so sánh
          </label>
          <select
            id="add"
            name="add"
            className="w-72 max-w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            {all
              .filter((f) => !idList.includes(f.id))
              .map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.city})
                </option>
              ))}
          </select>
        </div>
        <AddButton idList={idList} />
      </form>

      {selected.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa có cơ sở nào trong bảng so sánh. Hãy thêm cơ sở ở trên, hoặc mở
          một cơ sở từ{" "}
          <Link href="/duong-lao" className="font-bold text-brand-700 underline">
            danh mục
          </Link>{" "}
          và bấm “So sánh”.
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-44 p-3 align-bottom text-stone-500">
                  Tiêu chí
                </th>
                {selected.map((f) => (
                  <th key={f.id} className="p-3 align-bottom">
                    <Link
                      href={`/duong-lao/${f.slug}`}
                      className="text-lg font-extrabold text-brand-700 underline"
                    >
                      {f.name}
                    </Link>
                    <p className="mt-1 text-sm font-normal text-stone-500">
                      {[f.district, f.city].filter(Boolean).join(", ")}
                    </p>
                    <Link
                      href={`/duong-lao/so-sanh?ids=${idList
                        .filter((id) => id !== f.id)
                        .join(",")}`}
                      className="mt-1 inline-block text-sm text-red-600 underline"
                    >
                      Bỏ khỏi so sánh
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-stone-200 [&_td]:p-3 [&_th]:border-t [&_th]:border-stone-200 [&_th]:p-3">
              <tr className="bg-white">
                <th className="font-semibold text-stone-700">Đánh giá</th>
                {selected.map((f) => (
                  <td key={f.id}>
                    <Stars
                      value={Number(f.rating_avg)}
                      count={f.rating_count}
                    />
                  </td>
                ))}
              </tr>
              <tr>
                <th className="font-semibold text-stone-700">
                  Chi phí / tháng
                </th>
                {selected.map((f) => (
                  <td key={f.id} className="font-bold text-brand-800">
                    {f.price_min != null
                      ? `${formatVND(f.price_min)} – ${formatVND(f.price_max)}`
                      : "Liên hệ"}
                  </td>
                ))}
              </tr>
              <tr className="bg-white">
                <th className="font-semibold text-stone-700">Sức chứa</th>
                {selected.map((f) => (
                  <td key={f.id}>
                    {f.capacity ? `${f.capacity} người` : "—"}
                  </td>
                ))}
              </tr>
              {FACILITY_SERVICES.map((s, i) => (
                <tr key={s.key} className={i % 2 === 0 ? "" : "bg-white"}>
                  <th className="font-semibold text-stone-700">{s.label}</th>
                  {selected.map((f) => (
                    <td key={f.id}>
                      {f.services.includes(s.key) ? (
                        <span className="font-bold text-brand-700">✓ Có</span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-white">
                <th />
                {selected.map((f) => (
                  <td key={f.id}>
                    <Link
                      href={`/duong-lao/${f.slug}#tham-quan`}
                      className="inline-block rounded-xl bg-brand-600 px-4 py-2.5 font-bold text-white hover:bg-brand-700"
                    >
                      Đặt lịch tham quan
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddButton({ idList }: { idList: string[] }) {
  // GET form: server re-renders with ?ids=…&add=… — merge happens via formAction-less JS-free trick:
  // we simply read both params; merging is done client-side-free by the form below.
  return (
    <button
      type="submit"
      formAction="/duong-lao/so-sanh/them"
      disabled={idList.length >= 3}
      className="rounded-xl bg-brand-600 px-5 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-50"
    >
      + Thêm vào so sánh
    </button>
  );
}
