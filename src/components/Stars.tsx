export default function Stars({
  value,
  count,
}: {
  value: number;
  count?: number;
}) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden className="text-amber-500 tracking-tight">
        {"★".repeat(rounded)}
        <span className="text-stone-300">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="font-semibold text-stone-700">
        {value > 0 ? Number(value).toFixed(1) : "Mới"}
      </span>
      {count !== undefined && count > 0 && (
        <span className="text-sm text-stone-500">({count} đánh giá)</span>
      )}
      <span className="sr-only">{value.toFixed(1)} trên 5 sao</span>
    </span>
  );
}
