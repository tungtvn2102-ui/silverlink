import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Connection } from "@/lib/community";
import { sendRequest, respondRequest, removeConnection } from "./actions";

export const metadata: Metadata = { title: "Bạn bè" };

function Avatar({ name }: { name: string }) {
  return (
    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-lg font-bold text-brand-800">
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

export default async function FriendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/dang-nhap?next=/ban-be");

  const { data: connRows } = await supabase
    .from("connections")
    .select(
      "*, requester:profiles!connections_requester_id_fkey(full_name, city), addressee:profiles!connections_addressee_id_fkey(full_name, city)"
    )
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });
  const connections = (connRows ?? []) as Connection[];

  const incoming = connections.filter(
    (c) => c.status === "pending" && c.addressee_id === user.id
  );
  const outgoing = connections.filter(
    (c) => c.status === "pending" && c.requester_id === user.id
  );
  const friends = connections.filter((c) => c.status === "accepted");
  const connectedIds = new Set(
    connections.flatMap((c) => [c.requester_id, c.addressee_id])
  );

  // Suggestions: individual users (not businesses) I'm not yet connected to
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("city")
    .eq("id", user.id)
    .single();
  let suggestionQuery = supabase
    .from("profiles")
    .select("id, full_name, city, role")
    .in("role", ["senior", "family"])
    .neq("id", user.id)
    .limit(12);
  if (myProfile?.city) {
    suggestionQuery = suggestionQuery.eq("city", myProfile.city);
  }
  const { data: suggestionRows } = await suggestionQuery;
  const suggestions = (suggestionRows ?? []).filter(
    (p) => !connectedIds.has(p.id)
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-stone-900">Bạn bè</h1>

      {/* Incoming requests */}
      {incoming.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-stone-900">
            Lời mời kết bạn ({incoming.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {incoming.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={c.requester?.full_name ?? ""} />
                  <div>
                    <p className="font-bold">{c.requester?.full_name}</p>
                    {c.requester?.city && (
                      <p className="text-sm text-stone-500">
                        📍 {c.requester.city}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <form action={respondRequest.bind(null, c.id, true)}>
                    <button className="rounded-xl bg-brand-600 px-5 py-2.5 font-bold text-white hover:bg-brand-700">
                      ✓ Đồng ý
                    </button>
                  </form>
                  <form action={respondRequest.bind(null, c.id, false)}>
                    <button className="rounded-xl border-2 border-stone-300 px-5 py-2.5 font-bold text-stone-600 hover:bg-white">
                      Từ chối
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Friends */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-stone-900">
          Bạn bè của tôi ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <p className="mt-3 rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center text-stone-500">
            Chưa có bạn bè nào. Hãy gửi lời mời từ gợi ý bên dưới!
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {friends.map((c) => {
              const other =
                c.requester_id === user.id ? c.addressee : c.requester;
              return (
                <li
                  key={c.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={other?.full_name ?? ""} />
                    <div>
                      <p className="font-bold">{other?.full_name}</p>
                      {other?.city && (
                        <p className="text-sm text-stone-500">
                          📍 {other.city}
                        </p>
                      )}
                    </div>
                  </div>
                  <form action={removeConnection.bind(null, c.id)}>
                    <button className="rounded-xl px-4 py-2 font-semibold text-stone-400 hover:bg-stone-100 hover:text-red-600">
                      Hủy kết bạn
                    </button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Sent */}
      {outgoing.length > 0 && (
        <section className="mt-6">
          <h2 className="text-xl font-bold text-stone-900">
            Đã gửi lời mời ({outgoing.length})
          </h2>
          <ul className="mt-3 space-y-2">
            {outgoing.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-stone-50 px-4 py-3"
              >
                <p className="font-semibold text-stone-700">
                  {c.addressee?.full_name}
                </p>
                <form action={removeConnection.bind(null, c.id)}>
                  <button className="text-sm font-semibold text-stone-400 underline hover:text-red-600">
                    Thu hồi
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Suggestions */}
      <section className="mt-6">
        <h2 className="text-xl font-bold text-stone-900">
          Gợi ý kết bạn{myProfile?.city ? ` tại ${myProfile.city}` : ""}
        </h2>
        {suggestions.length === 0 ? (
          <p className="mt-3 text-stone-500">
            Chưa có gợi ý nào. Hãy cập nhật tỉnh / thành phố trong hồ sơ để tìm
            bạn bè gần bạn.
          </p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {suggestions.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar name={p.full_name} />
                  <div className="min-w-0">
                    <p className="truncate font-bold">{p.full_name}</p>
                    {p.city && (
                      <p className="text-sm text-stone-500">📍 {p.city}</p>
                    )}
                  </div>
                </div>
                <form action={sendRequest.bind(null, p.id)}>
                  <button className="shrink-0 rounded-xl border-2 border-brand-600 px-4 py-2 font-bold text-brand-700 hover:bg-brand-50">
                    + Kết bạn
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
