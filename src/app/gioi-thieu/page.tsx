import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description:
    "SilverLink là nền tảng kết nối nhà dưỡng lão được kiểm chứng, cẩm nang chăm sóc, việc làm cao tuổi và cộng đồng thân thiện.",
};

const PILLARS = [
  {
    title: "Nhà dưỡng lão đã kiểm chứng",
    desc: "Danh mục cơ sở có thông tin rõ ràng về vị trí, dịch vụ, giá tham khảo, đánh giá và lịch tham quan.",
    href: "/duong-lao",
  },
  {
    title: "Cẩm nang chăm sóc",
    desc: "Nội dung dễ đọc về dinh dưỡng, sức khỏe, chuẩn bị hồ sơ và các tin tức liên quan đến người cao tuổi.",
    href: "/tin-tuc",
  },
  {
    title: "Việc làm & cộng đồng",
    desc: "Kết nối kinh nghiệm sau nghỉ hưu với cơ hội phù hợp, đồng thời tạo không gian chia sẻ nhẹ nhàng.",
    href: "/viec-lam",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-7">
            <Logo className="h-auto w-64 max-w-full" />
            <p className="mt-5 text-lg font-semibold leading-8 text-stone-700">
              Kết nối — Chăm sóc — Trao cơ hội cho người cao tuổi Việt Nam.
            </p>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold leading-tight text-stone-950 md:text-5xl">
              SilverLink là nền tảng hỗ trợ gia đình trong hành trình chăm sóc
              người cao tuổi
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-600">
              Thông tin về nhà dưỡng lão, chăm sóc sức khỏe, việc làm sau nghỉ
              hưu và cộng đồng thường nằm rải rác ở nhiều nơi. SilverLink gom
              các nhu cầu đó vào một trải nghiệm rõ ràng hơn để gia đình có thể
              tìm hiểu, so sánh và hỏi kinh nghiệm trước khi ra quyết định.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/duong-lao"
                className="rounded-xl bg-brand-700 px-6 py-3 text-center font-bold text-white hover:bg-brand-800"
              >
                Tìm cơ sở chăm sóc
              </Link>
              <Link
                href="/tin-tuc"
                className="rounded-xl border border-stone-300 px-6 py-3 text-center font-bold text-stone-900 hover:border-brand-600 hover:text-brand-700"
              >
                Đọc cẩm nang
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <section className="grid gap-5 md:grid-cols-3">
          {PILLARS.map((pillar) => (
            <Link
              key={pillar.href}
              href={pillar.href}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <h2 className="text-xl font-extrabold text-stone-950">
                {pillar.title}
              </h2>
              <p className="mt-3 leading-7 text-stone-600">{pillar.desc}</p>
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-2xl bg-stone-950 p-7 text-white">
          <h2 className="text-2xl font-extrabold">Vì sao SilverLink tồn tại?</h2>
          <div className="mt-4 space-y-4 leading-8 text-stone-200">
            <p>
              Việt Nam đang bước vào giai đoạn già hóa dân số nhanh. Nhiều gia
              đình cần thêm thông tin đáng tin cậy để chọn mô hình chăm sóc phù
              hợp, trong khi người cao tuổi vẫn có kinh nghiệm, kỹ năng và nhu
              cầu kết nối xã hội rất lớn.
            </p>
            <p>
              SilverLink được xây dựng để giảm sự rời rạc đó: cơ sở chăm sóc có
              hồ sơ rõ hơn, gia đình có thêm kiến thức nền, người cao tuổi có
              thêm cơ hội tham gia cộng đồng và tiếp tục đóng góp theo nhịp phù
              hợp.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
