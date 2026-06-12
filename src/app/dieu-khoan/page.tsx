import type { Metadata } from "next";

export const metadata: Metadata = { title: "Điều khoản sử dụng" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Điều khoản sử dụng
      </h1>
      <div className="mt-6 space-y-6 text-stone-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold text-stone-900">1. Phạm vi dịch vụ</h2>
          <p className="mt-2">
            SilverLink là nền tảng trung gian kết nối người dùng với các cơ sở
            dưỡng lão, nhà tuyển dụng và cộng đồng. SilverLink không trực tiếp
            cung cấp dịch vụ chăm sóc y tế hay tuyển dụng; quyết định cuối cùng
            và hợp đồng dịch vụ được ký kết trực tiếp giữa người dùng và đơn vị
            cung cấp.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">2. Tài khoản</h2>
          <p className="mt-2">
            Bạn chịu trách nhiệm về tính chính xác của thông tin đăng ký và bảo
            mật mật khẩu. Tài khoản doanh nghiệp phải cung cấp thông tin pháp
            lý (mã số thuế, giấy phép hoạt động) để được kiểm chứng trước khi
            đăng tin.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">3. Nội dung &amp; đánh giá</h2>
          <p className="mt-2">
            Đánh giá phải dựa trên trải nghiệm thực. Nghiêm cấm nội dung sai sự
            thật, xúc phạm, quảng cáo trá hình. SilverLink có quyền gỡ nội dung
            vi phạm và khóa tài khoản tái phạm.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">4. Trách nhiệm</h2>
          <p className="mt-2">
            SilverLink kiểm chứng giấy phép của đơn vị đăng tin nhưng không bảo
            đảm tuyệt đối chất lượng dịch vụ. Người dùng nên tham quan trực
            tiếp cơ sở và kiểm tra hợp đồng trước khi quyết định.
          </p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-stone-900">5. Thay đổi điều khoản</h2>
          <p className="mt-2">
            Điều khoản có thể được cập nhật; thay đổi quan trọng sẽ được thông
            báo trên nền tảng trước khi có hiệu lực.
          </p>
        </section>
      </div>
    </div>
  );
}
