import type { Metadata } from "next";

export const metadata: Metadata = { title: "Chính sách bảo mật" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Chính sách bảo mật
      </h1>
      <div className="mt-6 space-y-6 text-stone-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-stone-900">
            1. Dữ liệu chúng tôi thu thập
          </h2>
          <p className="mt-2">
            Họ tên, email, khu vực sinh sống và thông tin bạn tự cung cấp khi
            đặt lịch tham quan, ứng tuyển việc làm hoặc đăng bài trong cộng
            đồng. Số điện thoại chỉ được thu thập khi bạn chủ động cung cấp
            trong yêu cầu đặt lịch hoặc ứng tuyển.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">
            2. Dữ liệu được dùng như thế nào
          </h2>
          <p className="mt-2">
            Yêu cầu đặt lịch tham quan chỉ được chia sẻ với cơ sở dưỡng lão bạn
            chọn. Hồ sơ ứng tuyển chỉ hiển thị với nhà tuyển dụng của tin đăng
            đó. Chúng tôi không bán dữ liệu cá nhân cho bên thứ ba.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">3. Lưu trữ &amp; bảo vệ</h2>
          <p className="mt-2">
            Dữ liệu được lưu trữ trên hạ tầng đám mây đạt chuẩn bảo mật, mã hóa
            khi truyền tải. Quyền truy cập dữ liệu được kiểm soát theo nguyên
            tắc tối thiểu cần thiết.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">4. Quyền của bạn</h2>
          <p className="mt-2">
            Bạn có quyền xem, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân bất cứ
            lúc nào qua trang Tài khoản hoặc liên hệ với chúng tôi.
          </p>
        </section>
      </div>
    </div>
  );
}
