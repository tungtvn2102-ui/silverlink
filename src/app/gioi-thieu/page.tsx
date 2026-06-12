import type { Metadata } from "next";

export const metadata: Metadata = { title: "Giới thiệu" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Về SilverLink
      </h1>
      <div className="mt-6 space-y-4 text-stone-700 leading-relaxed">
        <p>
          Việt Nam đang bước vào giai đoạn già hóa dân số nhanh chóng — dự kiến
          đạt ngưỡng “dân số già” vào 2036–2038 với hơn 17 triệu người trên 60
          tuổi. Tuy nhiên, thị trường phục vụ nhóm này còn rời rạc và thiếu tin
          cậy: thông tin nhà dưỡng lão khó tìm, người cao tuổi còn sức khỏe và
          kinh nghiệm nhưng không có kênh kết nối việc làm phù hợp.
        </p>
        <p>
          <strong>SilverLink</strong> là nền tảng 3-trong-1 dành riêng cho
          người cao tuổi và hệ sinh thái xung quanh họ:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Nhà Dưỡng Lão</strong> — danh mục cơ sở được kiểm chứng, so
            sánh dịch vụ &amp; giá, đặt lịch tham quan, đánh giá từ người dùng
            thực.
          </li>
          <li>
            <strong>Việc Làm &amp; Kết Nối</strong> — kết nối người cao tuổi
            với doanh nghiệp có nhu cầu tuyển dụng, hỗ trợ khởi nghiệp sau nghỉ
            hưu.
          </li>
          <li>
            <strong>Cộng Đồng</strong> — mạng xã hội nhẹ nhàng, dễ dùng: kết
            bạn, chia sẻ, tham gia hội nhóm sở thích theo địa phương.
          </li>
        </ul>
        <p>
          Chúng tôi tin rằng người cao tuổi không phải là gánh nặng — họ là tài
          nguyên chưa được khai thác đúng cách. SilverLink hoạt động trong
          khuôn khổ quy định của Bộ Lao động - Thương binh &amp; Xã hội và Bộ Y
          tế.
        </p>
      </div>
    </div>
  );
}
