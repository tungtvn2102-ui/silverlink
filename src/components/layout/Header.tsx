import Link from "next/link";
import FirebaseAuthLinks from "@/components/FirebaseAuthLinks";
import LargeTextToggle from "@/components/LargeTextToggle";
import Logo from "@/components/Logo";

const NAV = [
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/duong-lao", label: "Dưỡng lão" },
  { href: "/tin-tuc", label: "Cẩm nang" },
  { href: "/viec-lam", label: "Việc làm" },
  { href: "/cong-dong", label: "Cộng đồng" },
];

export default function Header({ largeText }: { largeText: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 text-stone-900 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Logo compact />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
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
          <FirebaseAuthLinks />
        </div>
      </div>
    </header>
  );
}
