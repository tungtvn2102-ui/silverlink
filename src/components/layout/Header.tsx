import Link from "next/link";
import type { Profile } from "@/lib/types";
import LargeTextToggle from "@/components/LargeTextToggle";

const NAV = [
  { href: "/duong-lao", label: "Nhà dưỡng lão" },
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
    <header className="sticky top-0 z-40 bg-brand-700 text-white shadow-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg font-extrabold">
            S
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Silver<span className="text-brand-200">Link</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 font-semibold hover:bg-white/10"
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
              className="flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-2 pr-4 font-semibold hover:bg-white/20"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-200 text-sm font-bold text-brand-800">
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
                className="hidden sm:block rounded-lg px-4 py-2 font-semibold hover:bg-white/10"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                className="rounded-lg bg-white px-4 py-2 font-bold text-brand-700 hover:bg-brand-50"
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
