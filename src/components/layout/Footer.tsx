import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-stone-200 bg-white pb-24 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="text-xl font-extrabold text-brand-700">SilverLink</p>
          <p className="mt-2 text-stone-600">
            Kết nối — Chăm sóc — Trao cơ hội cho người cao tuổi Việt Nam.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Silver Economy, Golden Opportunity.
          </p>
        </div>
        <div>
          <p className="font-bold text-stone-800">Dịch vụ</p>
          <ul className="mt-2 space-y-2 text-stone-600">
            <li>
              <Link href="/duong-lao" className="hover:text-brand-700">
                Nhà dưỡng lão
              </Link>
            </li>
            <li>
              <Link href="/viec-lam" className="hover:text-brand-700">
                Việc làm cao tuổi
              </Link>
            </li>
            <li>
              <Link href="/cong-dong" className="hover:text-brand-700">
                Cộng đồng
              </Link>
            </li>
            <li>
              <Link href="/doanh-nghiep" className="hover:text-brand-700">
                Dành cho doanh nghiệp
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-stone-800">SilverLink</p>
          <ul className="mt-2 space-y-2 text-stone-600">
            <li>
              <Link href="/gioi-thieu" className="hover:text-brand-700">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/dieu-khoan" className="hover:text-brand-700">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="/bao-mat" className="hover:text-brand-700">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-brand-700">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-100 py-4 text-center text-sm text-stone-500">
        © {new Date().getFullYear()} SilverLink. Hoạt động trong khuôn khổ quy
        định của Bộ LĐ-TB&XH và Bộ Y tế.
      </div>
    </footer>
  );
}
