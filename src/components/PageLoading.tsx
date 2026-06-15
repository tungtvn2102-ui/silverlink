export default function PageLoading({
  title = "Đang tải nội dung",
}: {
  title?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10" role="status" aria-live="polite">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="h-7 w-64 max-w-full animate-pulse rounded bg-stone-200" />
        <p className="mt-4 font-semibold text-stone-600">{title}...</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
            >
              <div className="h-5 w-3/4 animate-pulse rounded bg-stone-200" />
              <div className="mt-4 h-4 w-full animate-pulse rounded bg-stone-200" />
              <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-stone-200" />
              <div className="mt-5 h-10 w-32 animate-pulse rounded-xl bg-brand-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
