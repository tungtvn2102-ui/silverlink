import Link from "next/link";

const PILLARS = [
  {
    href: "/duong-lao",
    emoji: "🏡",
    title: "Nhà Dưỡng Lão",
    desc: "Danh mục cơ sở được kiểm chứng, so sánh dịch vụ & giá, đặt lịch tham quan và đọc đánh giá từ người dùng thực.",
    cta: "Tìm nhà dưỡng lão",
    bg: "bg-brand-50",
  },
  {
    href: "/viec-lam",
    emoji: "💼",
    title: "Việc Làm & Kết Nối",
    desc: "Kết nối người cao tuổi với doanh nghiệp cần tuyển dụng kinh nghiệm — công việc nhẹ nhàng, thời gian linh hoạt.",
    cta: "Xem việc làm",
    bg: "bg-amber-50",
  },
  {
    href: "/cong-dong",
    emoji: "🌼",
    title: "Cộng Đồng",
    desc: "Mạng xã hội nhẹ nhàng, dễ dùng: kết bạn, chia sẻ và tham gia hội nhóm sở thích theo địa phương.",
    cta: "Vào cộng đồng",
    bg: "bg-indigo-50",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-brand-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center md:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight md:text-5xl">
            Kết nối — Chăm sóc — Trao cơ hội cho người cao tuổi Việt Nam
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">
            Tìm nhà dưỡng lão uy tín cho cha mẹ, việc làm phù hợp sau nghỉ hưu,
            và một cộng đồng thân thiện — tất cả trong một nền tảng đáng tin cậy.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/duong-lao"
              className="w-full rounded-2xl bg-white px-8 py-4 text-lg font-bold text-brand-700 shadow-lg hover:bg-brand-50 sm:w-auto"
            >
              🏡 Tìm nhà dưỡng lão
            </Link>
            <Link
              href="/viec-lam"
              className="w-full rounded-2xl border-2 border-white/60 px-8 py-4 text-lg font-bold text-white hover:bg-white/10 sm:w-auto"
            >
              💼 Tìm việc làm
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-200">
            Miễn phí cho người dùng cá nhân · Cơ sở được kiểm chứng bởi SilverLink
          </p>
        </div>
      </section>

      {/* 3 pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-center text-3xl font-extrabold text-stone-900">
          Một nền tảng — ba điều quan trọng nhất
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p) => (
            <div
              key={p.href}
              className={`flex flex-col rounded-3xl ${p.bg} p-7`}
            >
              <span className="text-4xl" aria-hidden>
                {p.emoji}
              </span>
              <h3 className="mt-3 text-2xl font-bold text-stone-900">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-stone-700">{p.desc}</p>
              <Link
                href={p.href}
                className="mt-5 inline-block rounded-xl bg-brand-600 px-5 py-3 text-center font-bold text-white hover:bg-brand-700"
              >
                {p.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-center text-3xl font-extrabold text-stone-900">
            Vì sao gia đình tin chọn SilverLink?
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 p-6">
              <p className="text-3xl" aria-hidden>
                ✅
              </p>
              <h3 className="mt-2 text-xl font-bold">Kiểm chứng thực tế</h3>
              <p className="mt-2 text-stone-600">
                Mỗi cơ sở dưỡng lão và doanh nghiệp đều được đội ngũ SilverLink
                xác minh giấy phép trước khi xuất hiện trên nền tảng.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 p-6">
              <p className="text-3xl" aria-hidden>
                💬
              </p>
              <h3 className="mt-2 text-xl font-bold">Đánh giá minh bạch</h3>
              <p className="mt-2 text-stone-600">
                Đánh giá đến từ người dùng thực đã tham quan hoặc sử dụng dịch
                vụ — không chỉnh sửa, không che giấu.
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 p-6">
              <p className="text-3xl" aria-hidden>
                👵
              </p>
              <h3 className="mt-2 text-xl font-bold">
                Thiết kế cho người lớn tuổi
              </h3>
              <p className="mt-2 text-stone-600">
                Chữ to, nút bấm rõ ràng, thao tác đơn giản. Bật chế độ “Chữ
                lớn” bất cứ lúc nào bằng nút A trên thanh tiêu đề.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For businesses */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl bg-stone-900 p-8 text-white md:p-12">
          <div className="md:flex md:items-center md:justify-between md:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold">
                Dành cho doanh nghiệp
              </h2>
              <p className="mt-3 max-w-xl text-stone-300">
                Bạn là cơ sở dưỡng lão muốn tiếp cận hàng nghìn gia đình, hoặc
                doanh nghiệp muốn tuyển dụng lao động giàu kinh nghiệm? Đăng ký
                và đưa dịch vụ của bạn lên SilverLink.
              </p>
            </div>
            <Link
              href="/doanh-nghiep"
              className="mt-6 inline-block shrink-0 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-stone-900 hover:bg-stone-100 md:mt-0"
            >
              Đăng ký doanh nghiệp →
            </Link>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-3xl px-4 pb-16 text-center">
        <blockquote className="text-2xl font-semibold italic text-brand-800">
          “Người cao tuổi không phải là gánh nặng — họ là tài nguyên chưa được
          khai thác đúng cách.”
        </blockquote>
        <p className="mt-3 font-bold text-stone-500">
          SilverLink — Silver Economy, Golden Opportunity
        </p>
      </section>
    </>
  );
}
