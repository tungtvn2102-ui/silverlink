import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/doanh-nghiep", label: "Tổng quan" },
  { href: "/doanh-nghiep/co-so", label: "Cơ sở dưỡng lão" },
  { href: "/doanh-nghiep/lich-hen", label: "Lịch tham quan" },
  { href: "/doanh-nghiep/tuyen-dung", label: "Tuyển dụng" },
];

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || (profile.role !== "business" && profile.role !== "admin")) {
    redirect("/tai-khoan");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-600">
        Cổng doanh nghiệp
      </p>
      <nav className="mt-3 flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-4 py-2 font-semibold text-stone-700 hover:bg-brand-50 hover:text-brand-800"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
