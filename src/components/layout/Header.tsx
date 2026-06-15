import Link from "next/link";
import type { Profile } from "@/lib/types";
import LargeTextToggle from "@/components/LargeTextToggle";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/duong-lao", label: "Dưỡng lão" },
  { href: "/tin-tuc", label: "Cẩm nang" },
  { href: "/viec-lam", label: "Việc làm" },
  { href: "/cong-dong", label: "Cộng đồng" },
];

export default function Header({
  profile,
  largeText,
}: {
  profile: Profile | null;
  largeText: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 text-stone-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Logo compact />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-bold text-stone-700 hover:bg-brand-50 hover:text-brand-800 lg:px-4"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LargeTextToggle initial={largeText} />
          {profile ? (
            <Link
              href={
                profile.role === "admin"
                  ? "/admin"
                  : profile.role === "business"
                    ? "/doanh-nghiep"
                    : "/tai-khoan"
              }
              className="flex items-center gap-2 rounded-full bg-brand-50 py-1.5 pl-2 pr-4 font-semibold text-brand-800 hover:bg-brand-100"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">
                {(profile.full_name || "?").charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline max-w-32 truncate">
                {profile.full_name || "Tài khoản"}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/dang-nhap"
                className="hidden rounded-lg px-4 py-2 font-bold text-stone-700 hover:bg-stone-100 sm:block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="rounded-lg bg-brand-700 px-4 py-2 font-bold text-white hover:bg-brand-800"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
