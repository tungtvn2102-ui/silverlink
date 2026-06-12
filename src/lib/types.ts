export type UserRole = "senior" | "family" | "business" | "admin";
export type VerificationStatus = "pending" | "verified" | "rejected";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  city: string | null;
  district: string | null;
  large_text: boolean;
  bio: string | null;
  skills: string | null;
  experience_years: number | null;
  availability: string | null;
  created_at: string;
  updated_at: string;
};

export type Organization = {
  id: string;
  owner_id: string;
  name: string;
  type: "facility_operator" | "employer" | "both";
  verification_status: VerificationStatus;
  tax_id: string | null;
  license_doc_path: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  senior: "Người cao tuổi",
  family: "Người thân",
  business: "Doanh nghiệp",
  admin: "Quản trị viên",
};

export const VERIFICATION_LABELS: Record<VerificationStatus, string> = {
  pending: "Chờ kiểm chứng",
  verified: "Đã kiểm chứng",
  rejected: "Bị từ chối",
};
