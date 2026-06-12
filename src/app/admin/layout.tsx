import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") redirect("/tai-khoan");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="text-sm font-bold uppercase tracking-wide text-red-600">
        Khu vực quản trị
      </p>
      <div className="mt-3">{children}</div>
    </div>
  );
}
