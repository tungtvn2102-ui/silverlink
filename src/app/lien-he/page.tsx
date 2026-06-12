import type { Metadata } from "next";

export const metadata: Metadata = { title: "Liên hệ" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">Liên hệ</h1>
      <p className="mt-4 text-stone-700">
        Chúng tôi luôn sẵn sàng lắng nghe — dù bạn là gia đình cần tư vấn, cơ
        sở dưỡng lão muốn hợp tác hay doanh nghiệp muốn tuyển dụng.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-2xl" aria-hidden>
            📧
          </p>
          <h2 className="mt-2 font-bold">Email</h2>
          <p className="mt-1 text-stone-600">hotro@silverlink.vn</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-2xl" aria-hidden>
            ☎️
          </p>
          <h2 className="mt-2 font-bold">Đường dây hỗ trợ</h2>
          <p className="mt-1 text-stone-600">
            1900 0000 (8:00–17:30, T2–T7)
          </p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-2xl" aria-hidden>
            🏢
          </p>
          <h2 className="mt-2 font-bold">Hợp tác doanh nghiệp</h2>
          <p className="mt-1 text-stone-600">doanhnghiep@silverlink.vn</p>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <p className="text-2xl" aria-hidden>
            📍
          </p>
          <h2 className="mt-2 font-bold">Văn phòng</h2>
          <p className="mt-1 text-stone-600">TP. Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>
    </div>
  );
}
