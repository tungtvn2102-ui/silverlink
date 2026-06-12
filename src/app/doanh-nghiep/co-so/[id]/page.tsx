import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Facility } from "@/lib/facilities";
import FacilityForm from "../FacilityForm";

export const metadata: Metadata = { title: "Chỉnh sửa cơ sở" };

export default async function EditFacilityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep");

  const { data } = await supabase
    .from("facilities")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const facility = data as Facility;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Chỉnh sửa: {facility.name}
      </h1>
      <FacilityForm orgId={facility.org_id} facility={facility} />
    </div>
  );
}
