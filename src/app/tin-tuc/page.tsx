import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cẩm nang chăm sóc & tin tức",
  description:
    "Cẩm nang SilverLink về dinh dưỡng, chăm sóc sức khỏe, chọn cơ sở dưỡng lão và tin tức liên quan đến người cao tuổi.",
};

const CATEGORIES = [
  {
    id: "dinh-duong",
    title: "Dinh dưỡng",
    intro:
      "Gợi ý bữa ăn, bổ sung nước, chất xơ, đạm và cách điều chỉnh khẩu phần theo sức khỏe.",
    items: [
      "Bữa ăn mềm, dễ nhai nhưng vẫn đủ năng lượng",
      "Theo dõi cân nặng và dấu hiệu thiếu nước",
      "Trao đổi với bác sĩ khi có tiểu đường, tăng huyết áp hoặc bệnh thận",
    ],
  },
  {
    id: "suc-khoe",
    title: "Chăm sóc sức khỏe",
    intro:
      "Các việc gia đình nên chuẩn bị trước khi chăm sóc tại nhà hoặc đặt lịch tham quan cơ sở.",
    items: [
      "Lập danh sách thuốc, liều dùng và người phụ trách nhắc thuốc",
      "Ghi lại lịch tái khám, hồ sơ bệnh án và số điện thoại khẩn cấp",
      "Quan sát giấc ngủ, té ngã, thay đổi trí nhớ và tâm trạng",
    ],
  },
  {
    id: "duong-lao",
    title: "Chọn cơ sở dưỡng lão",
    intro:
      "Tập trung vào minh bạch vận hành, năng lực chăm sóc và sự phù hợp với thói quen của người thân.",
    items: [
      "Hỏi tỷ lệ điều dưỡng / người cao tuổi và lịch trực đêm",
      "Xem phòng ở, bếp ăn, khu sinh hoạt và khu phục hồi chức năng",
      "Yêu cầu bảng giá, phí phát sinh và điều kiện hủy dịch vụ",
    ],
  },
  {
    id: "tin-tuc",
    title: "Tin tức & chính sách",
    intro:
      "Theo dõi các cập nhật liên quan đến an sinh, chăm sóc dài hạn và cơ hội trong silver economy.",
    items: [
      "Chính sách hỗ trợ người cao tuổi và gia đình chăm sóc",
      "Xu hướng dịch vụ chăm sóc dài hạn tại Việt Nam",
      "Cơ hội việc làm, cố vấn và cộng tác sau nghỉ hưu",
    ],
  },
];

export default function NewsPage() {
  return (
    <div className="bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold leading-tight text-stone-950 md:text-5xl">
              Cẩm nang chăm sóc & tin tức cho gia đình
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Một nơi để đọc nhanh các chủ đề quan trọng trước khi chọn nhà
              dưỡng lão, chăm sóc tại nhà hoặc tìm cơ hội phù hợp cho người cao
              tuổi.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800 hover:bg-brand-100"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl gap-5 px-4 py-10 md:grid-cols-2">
        {CATEGORIES.map((category) => (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-24 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-2xl font-extrabold text-stone-950">
              {category.title}
            </h2>
            <p className="mt-3 leading-7 text-stone-600">{category.intro}</p>
            <ul className="mt-5 space-y-3">
              {category.items.map((item) => (
                <li key={item} className="flex gap-3 text-stone-700">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-black text-brand-800">
                    ✓
                  </span>
                  <span className="leading-6">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-2xl bg-brand-700 p-7 text-white md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <h2 className="text-2xl font-extrabold">
              Cần hỏi tình huống cụ thể?
            </h2>
            <p className="mt-2 max-w-2xl leading-7 text-brand-50">
              Cẩm nang giúp chuẩn bị kiến thức nền. Khi cần kinh nghiệm thực
              tế, hãy hỏi cộng đồng hoặc xem hồ sơ cơ sở đã kiểm chứng.
            </p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0">
            <Link
              href="/cong-dong"
              className="rounded-xl bg-white px-5 py-3 text-center font-bold text-brand-800 hover:bg-brand-50"
            >
              Hỏi cộng đồng
            </Link>
            <Link
              href="/duong-lao"
              className="rounded-xl border border-white/40 px-5 py-3 text-center font-bold text-white hover:bg-white/10"
            >
              Xem cơ sở
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
