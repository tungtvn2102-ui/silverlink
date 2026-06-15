import Link from "next/link";
import { CITIES } from "@/lib/constants";
import { FACILITY_SERVICES } from "@/lib/facilities";
import Logo from "@/components/Logo";

const CITY_LINKS = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ"];

const SERVICE_CARDS = [
  {
    title: "Tìm nhà dưỡng lão",
    desc: "Lọc cơ sở theo thành phố, ngân sách, dịch vụ chăm sóc và đánh giá thực tế.",
    href: "/duong-lao",
    action: "Xem danh mục",
  },
  {
    title: "Đọc cẩm nang chăm sóc",
    desc: "Dinh dưỡng, vận động, sức khỏe tinh thần và tin tức chính sách cho gia đình.",
    href: "/tin-tuc",
    action: "Mở cẩm nang",
  },
  {
    title: "Tìm việc làm linh hoạt",
    desc: "Kết nối người cao tuổi với công việc bán thời gian, tư vấn và cộng tác.",
    href: "/viec-lam",
    action: "Tìm việc",
  },
  {
    title: "Tham gia cộng đồng",
    desc: "Hỏi kinh nghiệm, tham gia hội nhóm sở thích và chia sẻ câu chuyện hằng ngày.",
    href: "/cong-dong",
    action: "Vào cộng đồng",
  },
];

const GUIDE_LINKS = [
  {
    title: "Dinh dưỡng cho người cao tuổi",
    desc: "Gợi ý bữa ăn mềm, đủ đạm, dễ tiêu hóa và phù hợp bệnh nền thường gặp.",
    href: "/tin-tuc#dinh-duong",
  },
  {
    title: "Chăm sóc sức khỏe tại nhà",
    desc: "Theo dõi thuốc, lịch tái khám, dấu hiệu cần gọi bác sĩ và chuẩn bị hồ sơ.",
    href: "/tin-tuc#suc-khoe",
  },
  {
    title: "Tin tức & chính sách",
    desc: "Cập nhật các thông tin đáng chú ý về an sinh, chăm sóc và silver economy.",
    href: "/tin-tuc#tin-tuc",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[1.02fr_0.98fr] md:items-center md:py-14">
          <div>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-stone-950 md:text-6xl">
              Chọn chăm sóc tốt hơn cho cha mẹ, bắt đầu từ thông tin rõ ràng
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
              SilverLink giúp gia đình tìm nhà dưỡng lão đã kiểm chứng, đọc
              cẩm nang chăm sóc, hỏi cộng đồng và mở thêm cơ hội việc làm phù
              hợp cho người cao tuổi.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/duong-lao"
                className="rounded-xl bg-brand-700 px-7 py-4 text-center text-lg font-bold text-white shadow-sm hover:bg-brand-800"
              >
                Tìm nhà dưỡng lão
              </Link>
              <Link
                href="/tin-tuc"
                className="rounded-xl border border-stone-300 bg-white px-7 py-4 text-center text-lg font-bold text-stone-900 hover:border-brand-600 hover:text-brand-700"
              >
                Đọc cẩm nang
              </Link>
            </div>

            <div className="mt-7 grid gap-3 text-sm font-semibold text-stone-700 sm:grid-cols-3">
              <div className="rounded-xl bg-brand-50 px-4 py-3">
                Cơ sở được kiểm chứng
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3">
                Nội dung chăm sóc dễ hiểu
              </div>
              <div className="rounded-xl bg-stone-100 px-4 py-3">
                Cộng đồng thân thiện
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
                Bắt đầu nhanh
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

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-sm">
          <Logo className="h-auto w-56" />
          <p className="mt-5 text-lg leading-8 text-stone-700">
            SilverLink là nền tảng dành cho gia đình có người cao tuổi tại Việt
            Nam: một nơi để tìm cơ sở chăm sóc uy tín, đọc kiến thức cần thiết,
            kết nối cộng đồng và mở thêm cơ hội sau nghỉ hưu.
          </p>
          <Link
            href="/gioi-thieu"
            className="mt-5 inline-flex rounded-xl bg-brand-700 px-5 py-3 font-bold text-white hover:bg-brand-800"
          >
            Tìm hiểu về SilverLink
          </Link>
        </div>

        <div>
          <h2 className="text-3xl font-extrabold text-stone-950">
            Bắt đầu theo nhu cầu của bạn
          </h2>
          <p className="mt-2 max-w-2xl text-stone-600">
            Các phần chính được tách rõ để gia đình không phải đoán nên đi đâu
            trước.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {SERVICE_CARDS.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
              >
                <h3 className="text-xl font-extrabold text-stone-950">
                  {card.title}
                </h3>
                <p className="mt-2 leading-7 text-stone-600">{card.desc}</p>
                <p className="mt-4 font-bold text-brand-700">{card.action}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-extrabold text-stone-950">
                Tìm nhanh theo thành phố
              </h2>
              <p className="mt-2 max-w-2xl text-stone-600">
                Bắt đầu từ khu vực gần gia đình nhất, sau đó so sánh dịch vụ,
                chi phí và lịch tham quan.
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
                className="rounded-2xl border border-stone-200 bg-stone-50 p-5 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-white hover:shadow-md"
              >
                <p className="text-sm font-bold uppercase tracking-wide text-brand-700">
                  Danh sách cơ sở
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-stone-950">
                  {city}
                </h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">
                  Lọc cơ sở theo khu vực, giá tham khảo, dịch vụ chăm sóc và
                  đánh giá từ gia đình đã sử dụng.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-stone-950">
              Cẩm nang chăm sóc & tin tức
            </h2>
            <p className="mt-2 max-w-2xl text-stone-600">
              Nội dung được gom theo tình huống thường gặp để gia đình chuẩn bị
              tốt hơn trước khi chọn dịch vụ chăm sóc.
            </p>
          </div>
          <Link
            href="/tin-tuc"
            className="font-bold text-brand-700 underline underline-offset-4"
          >
            Xem tất cả bài viết
          </Link>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {GUIDE_LINKS.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="rounded-2xl bg-stone-950 p-6 text-white transition hover:-translate-y-0.5 hover:bg-brand-800"
            >
              <h3 className="text-xl font-extrabold">{guide.title}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-200">
                {guide.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
