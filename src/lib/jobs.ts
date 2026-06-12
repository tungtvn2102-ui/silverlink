export const JOB_TYPES = [
  { key: "part_time", label: "Bán thời gian" },
  { key: "flexible", label: "Giờ linh hoạt" },
  { key: "consulting", label: "Tư vấn / Cố vấn" },
  { key: "volunteer", label: "Tình nguyện" },
] as const;

export const JOB_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  JOB_TYPES.map((t) => [t.key, t.label])
);

export const JOB_TAGS = [
  { key: "light_physical", label: "Công việc nhẹ nhàng" },
  { key: "remote_ok", label: "Làm tại nhà được" },
  { key: "flexible_hours", label: "Giờ giấc linh hoạt" },
  { key: "no_experience", label: "Không cần kinh nghiệm" },
  { key: "mentoring", label: "Truyền đạt kinh nghiệm" },
] as const;

export const JOB_TAG_LABELS: Record<string, string> = Object.fromEntries(
  JOB_TAGS.map((t) => [t.key, t.label])
);

export type Job = {
  id: string;
  org_id: string;
  title: string;
  description: string;
  job_type: string;
  city: string;
  district: string | null;
  salary_min: number | null;
  salary_max: number | null;
  tags: string[];
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  organizations?: { name: string } | null;
};

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_id: string;
  phone: string;
  message: string | null;
  status: "submitted" | "viewed" | "contacted" | "rejected";
  created_at: string;
  jobs?: { title: string; org_id: string } | null;
  profiles?: {
    full_name: string;
    skills: string | null;
    experience_years: number | null;
    availability: string | null;
    bio: string | null;
    city: string | null;
  } | null;
};

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  submitted: "Đã gửi",
  viewed: "Đã xem",
  contacted: "Đã liên hệ",
  rejected: "Không phù hợp",
};

export function salaryRange(j: Pick<Job, "salary_min" | "salary_max">): string {
  const fmt = (n: number) =>
    `${(n / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })} triệu`;
  if (j.salary_min == null && j.salary_max == null) return "Thỏa thuận";
  if (j.salary_min != null && j.salary_max != null)
    return `${fmt(j.salary_min)} – ${fmt(j.salary_max)} /tháng`;
  return `Từ ${fmt((j.salary_min ?? j.salary_max)!)} /tháng`;
}
