import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BOOKING_STATUS_LABELS, type VisitBooking } from "@/lib/facilities";
import { setBookingStatus } from "./actions";

export const metadata: Metadata = { title: "Lịch tham quan" };

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-brand-100 text-brand-800",
  declined: "bg-red-100 text-red-700",
  completed: "bg-stone-200 text-stone-700",
};

export default async function BookingInboxPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/doanh-nghiep/lich-hen");

  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!org) redirect("/doanh-nghiep");

  const { data } = await supabase
    .from("visit_bookings")
    .select("*, facilities!inner(name, slug, org_id)")
    .eq("facilities.org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(100);
  const bookings = (data ?? []) as VisitBooking[];

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-stone-900">
        Yêu cầu tham quan
      </h1>
      <p className="mt-1 text-stone-600">
        Xác nhận hoặc từ chối yêu cầu — khách sẽ thấy trạng thái trong tài
        khoản của họ. Hãy gọi điện xác nhận giờ hẹn cụ thể.
      </p>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center text-stone-500">
          Chưa có yêu cầu tham quan nào.
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-stone-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-stone-900">
                    {b.full_name}{" "}
                    <a
                      href={`tel:${b.phone}`}
                      className="font-semibold text-brand-700 underline"
                    >
                      {b.phone}
                    </a>
                  </p>
                  <p className="mt-1 text-stone-600">
                    {b.facilities?.name} ·{" "}
                    {new Date(b.preferred_date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "numeric",
                      year: "numeric",
                    })}{" "}
                    ({b.preferred_time === "morning" ? "buổi sáng" : "buổi chiều"})
                  </p>
                  {b.note && (
                    <p className="mt-1 rounded-lg bg-stone-50 px-3 py-2 text-sm text-stone-600">
                      “{b.note}”
                    </p>
                  )}
                </div>
                <span
                  className={`rounded-full px-3 py-1 font-bold ${STATUS_STYLES[b.status]}`}
                >
                  {BOOKING_STATUS_LABELS[b.status]}
                </span>
              </div>
              {(b.status === "pending" || b.status === "confirmed") && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {b.status === "pending" && (
                    <>
                      <form
                        action={setBookingStatus.bind(null, b.id, "confirmed")}
                      >
                        <button className="rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700">
                          ✓ Xác nhận
                        </button>
                      </form>
                      <form
                        action={setBookingStatus.bind(null, b.id, "declined")}
                      >
                        <button className="rounded-xl border-2 border-red-300 px-5 py-2.5 font-bold text-red-700 hover:bg-red-50">
                          Từ chối
                        </button>
                      </form>
                    </>
                  )}
                  {b.status === "confirmed" && (
                    <form
                      action={setBookingStatus.bind(null, b.id, "completed")}
                    >
                      <button className="rounded-xl border-2 border-stone-300 px-5 py-2.5 font-bold text-stone-700 hover:bg-stone-100">
                        Đánh dấu đã hoàn thành
                      </button>
                    </form>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
