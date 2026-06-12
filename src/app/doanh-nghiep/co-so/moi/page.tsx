import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FacilityForm from "../FacilityForm";

export const metadata: Metadata = { title: "Thêm cơ sở mới" };

export default async function NewFacilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep");

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!org) redirect("/doanh-nghiep");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Thêm cơ sở dưỡng lão
      </h1>
      <p className="mt-2 text-stone-600">
        Cơ sở mới sẽ được SilverLink kiểm chứng trước khi hiển thị công khai.
      </p>
      <FacilityForm orgId={org.id} facility={null} />
    </div>
  );
}
