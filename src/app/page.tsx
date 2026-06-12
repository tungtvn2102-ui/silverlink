import Link from "next/link";
import { CITIES } from "@/lib/constants";
import { FACILITY_SERVICES } from "@/lib/facilities";

const CITY_LINKS = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];

const FEATURED_CARDS = [
  {
    title: "Nhà dưỡng lão đã kiểm chứng",
    desc: "Ưu tiên cơ sở có giấy phép, địa chỉ rõ ràng, thông tin giá và dịch vụ minh bạch.",
    href: "/duong-lao",
    meta: "Danh mục chăm sóc",
  },
  {
    title: "Việc làm phù hợp sau nghỉ hưu",
    desc: "Kết nối người cao tuổi với công việc bán thời gian, tư vấn hoặc hỗ trợ cộng đồng.",
    href: "/viec-lam",
    meta: "Cơ hội linh hoạt",
  },
  {
    title: "Cộng đồng gia đình và người cao tuổi",
    desc: "Chia sẻ kinh nghiệm, tìm nhóm cùng sở thích và giữ liên lạc dễ dàng hơn.",
    href: "/cong-dong",
    meta: "Kết nối an toàn",
  },
];

const GUIDE_LINKS = [
  "Cách chọn nhà dưỡng lão theo tình trạng sức khỏe",
  "Những câu hỏi nên đặt khi đi tham quan cơ sở",
  "Dấu hiệu một cơ sở chăm sóc vận hành minh bạch",
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-14">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-stone-950 md:text-6xl">
              Tìm nhà dưỡng lão phù hợp cho cha mẹ
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              SilverLink giúp gia đình so sánh cơ sở chăm sóc người cao tuổi
              theo thành phố, mức giá, dịch vụ và đánh giá thực tế. Mỗi hồ sơ
              được trình bày rõ ràng để bạn có thể gọi hỏi, đặt lịch tham quan
              và ra quyết định tự tin hơn.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/duong-lao"
                className="rounded-xl bg-brand-700 px-7 py-4 text-center text-lg font-bold text-white shadow-sm hover:bg-brand-800"
              >
                Tìm nhà dưỡng lão
              </Link>
              <Link
                href="/duong-lao/so-sanh"
                className="rounded-xl border border-stone-300 bg-white px-7 py-4 text-center text-lg font-bold text-stone-900 hover:border-brand-600 hover:text-brand-700"
              >
                So sánh cơ sở
              </Link>
            </div>

            <div className="mt-7 grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3">
              <div className="rounded-xl bg-brand-50 px-4 py-3">
                Hồ sơ đã kiểm chứng
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3">
                Giá theo tháng rõ ràng
              </div>
              <div className="rounded-xl bg-stone-100 px-4 py-3">
                Đặt lịch tham quan online
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-stone-100 shadow-xl shadow-stone-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/elder-care-hero.png"
                alt="Người cao tuổi được chăm sóc trong không gian sáng và an toàn"
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-stone-200">
              <p className="text-sm font-bold text-brand-800">
                Gợi ý bắt đầu
              </p>
              <p className="mt-1 text-sm text-stone-600">
                Lọc theo thành phố, dịch vụ cần thiết và ngân sách trước khi
                liên hệ cơ sở.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-brand-50/80">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <form
            action="/duong-lao"
            method="get"
            className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200 md:grid-cols-[1.1fr_1.1fr_1fr_auto]"
          >
            <label className="block">
              <span className="text-sm font-bold text-stone-700">
                Tỉnh / thành phố
              </span>
              <select
                name="city"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Mọi tỉnh / thành</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-stone-700">
                Dịch vụ cần tìm
              </span>
              <select
                name="service"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Mọi dịch vụ</option>
                {FACILITY_SERVICES.slice(0, 6).map((service) => (
                  <option key={service.key} value={service.key}>
                    {service.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-stone-700">
                Ngân sách
              </span>
              <select
                name="budget"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Mọi mức giá</option>
                <option value="10">Dưới 10 triệu/tháng</option>
                <option value="15">Dưới 15 triệu/tháng</option>
                <option value="20">Dưới 20 triệu/tháng</option>
                <option value="30">Dưới 30 triệu/tháng</option>
              </select>
            </label>
            <button
              type="submit"
              className="self-end rounded-xl bg-brand-700 px-6 py-3.5 font-bold text-white hover:bg-brand-800"
            >
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-950">
              Tìm nhanh theo thành phố
            </h2>
            <p className="mt-2 max-w-2xl text-stone-600">
              Mô hình danh sách theo địa phương giúp gia đình bắt đầu từ nơi
              gần nhà nhất, sau đó mới so sánh dịch vụ và chi phí.
            </p>
          </div>
          <Link
            href="/duong-lao"
            className="font-bold text-brand-700 underline underline-offset-4"
          >
            Xem toàn bộ danh mục
          </Link>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CITY_LINKS.map((city) => (
            <Link
              key={city}
              href={`/duong-lao?city=${encodeURIComponent(city)}`}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
                Danh sách cơ sở
              </p>
              <h3 className="mt-2 text-2xl font-extrabold text-stone-950">
                {city}
              </h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Lọc cơ sở theo khu vực, giá tham khảo, dịch vụ chăm sóc và đánh
                giá từ gia đình đã sử dụng.
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-950">
              Ba hướng hỗ trợ trong một nền tảng
            </h2>
            <div className="mt-7 grid gap-5 md:grid-cols-3 lg:grid-cols-1">
              {FEATURED_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group rounded-2xl border border-stone-200 bg-stone-50 p-6 transition hover:border-brand-300 hover:bg-white hover:shadow-md"
                >
                  <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
                    {card.meta}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold text-stone-950 group-hover:text-brand-700">
                    {card.title}
                  </h3>
                  <p className="mt-2 leading-7 text-stone-600">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl bg-stone-950 p-7 text-white">
            <h2 className="text-2xl font-extrabold">
              Kinh nghiệm chăm sóc người cao tuổi
            </h2>
            <p className="mt-3 leading-7 text-stone-300">
              Điểm mạnh đáng học từ các trang nội dung chuyên ngành là giúp gia
              đình hiểu bối cảnh trước khi chọn dịch vụ. SilverLink sẽ đưa phần
              hướng dẫn vào đúng nơi người dùng ra quyết định.
            </p>
            <div className="mt-6 space-y-3">
              {GUIDE_LINKS.map((guide) => (
                <div
                  key={guide}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  {guide}
                </div>
              ))}
            </div>
            <Link
              href="/cong-dong"
              className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-bold text-stone-950 hover:bg-stone-100"
            >
              Hỏi cộng đồng
            </Link>
          </aside>
        </div>
      </section>
    </>
  );
}
