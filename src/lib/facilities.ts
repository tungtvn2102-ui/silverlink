import type { VerificationStatus } from "@/lib/types";

export const FACILITY_SERVICES = [
  { key: "nursing_24_7", label: "Điều dưỡng 24/7" },
  { key: "physiotherapy", label: "Vật lý trị liệu" },
  { key: "memory_care", label: "Chăm sóc sa sút trí tuệ" },
  { key: "meals", label: "Bữa ăn dinh dưỡng" },
  { key: "medical_checkup", label: "Khám sức khỏe định kỳ" },
  { key: "recreation", label: "Hoạt động giải trí" },
  { key: "rehab", label: "Phục hồi chức năng" },
  { key: "short_term", label: "Lưu trú ngắn hạn" },
  { key: "garden", label: "Khuôn viên cây xanh" },
  { key: "religious", label: "Không gian tâm linh" },
] as const;

export type ServiceKey = (typeof FACILITY_SERVICES)[number]["key"];

export const SERVICE_LABELS: Record<string, string> = Object.fromEntries(
  FACILITY_SERVICES.map((s) => [s.key, s.label])
);

export type Facility = {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  city: string;
  district: string | null;
  address: string;
  description: string | null;
  capacity: number | null;
  price_min: number | null;
  price_max: number | null;
  phone: string | null;
  services: string[];
  photo_urls: string[];
  published: boolean;
  verification_status: VerificationStatus;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  facility_id: string;
  author_id: string;
  rating: number;
  body: string;
  status: "published" | "flagged" | "removed";
  created_at: string;
  profiles?: { full_name: string } | null;
};

export type VisitBooking = {
  id: string;
  facility_id: string;
  requester_id: string;
  full_name: string;
  phone: string;
  preferred_date: string;
  preferred_time: "morning" | "afternoon";
  note: string | null;
  status: "pending" | "confirmed" | "declined" | "completed";
  created_at: string;
  facilities?: { name: string; slug: string } | null;
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  declined: "Đã từ chối",
  completed: "Đã hoàn thành",
};

/** Format a VND amount as e.g. "12 triệu" / "850 nghìn" */
export function formatVND(amount: number | null): string {
  if (amount == null) return "—";
  if (amount >= 1_000_000_000)
    return `${(amount / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} tỷ`;
  if (amount >= 1_000_000)
    return `${(amount / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
  return `${(amount / 1_000).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} nghìn`;
}

export function priceRange(f: Pick<Facility, "price_min" | "price_max">): string {
  if (f.price_min == null && f.price_max == null) return "Liên hệ";
  if (f.price_min != null && f.price_max != null)
    return `${formatVND(f.price_min)} – ${formatVND(f.price_max)} /tháng`;
  return `Từ ${formatVND(f.price_min ?? f.price_max)} /tháng`;
}
