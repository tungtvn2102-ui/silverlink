import type { Metadata } from "next";
import JobFields from "../JobFields";
import { createJob } from "../actions";

export const metadata: Metadata = { title: "Đăng tin tuyển dụng" };

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Đăng tin tuyển dụng
      </h1>
      <p className="mt-2 text-stone-600">
        Mẹo: ghi rõ giờ giấc linh hoạt và tính chất nhẹ nhàng của công việc —
        đó là điều người cao tuổi quan tâm nhất.
      </p>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Đăng tin không thành công. Vui lòng kiểm tra thông tin.
        </p>
      )}
      <form action={createJob} className="mt-6">
        <JobFields job={null} />
        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700"
        >
          Đăng tin
        </button>
      </form>
    </div>
  );
}
