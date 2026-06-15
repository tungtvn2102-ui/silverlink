import { FirebaseError } from "firebase/app";

const PROFILE_KEY_PREFIX = "silverlink:firebase-profile:";

export type FirebaseRole = "senior" | "family" | "business";

export type LocalFirebaseProfile = {
  uid: string;
  fullName: string;
  role: FirebaseRole;
  city?: string;
  district?: string;
  bio?: string;
  skills?: string;
  experienceYears?: string;
  availability?: string;
};

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return "Có lỗi xảy ra. Vui lòng thử lại.";
  }

  switch (error.code) {
    case "auth/email-already-in-use":
      return "Email này đã được đăng ký. Vui lòng đăng nhập.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Email hoặc mật khẩu không đúng.";
    case "auth/invalid-email":
      return "Email không hợp lệ.";
    case "auth/weak-password":
      return "Mật khẩu cần ít nhất 6 ký tự.";
    case "auth/too-many-requests":
      return "Bạn thử quá nhiều lần. Vui lòng đợi một lúc rồi thử lại.";
    case "auth/operation-not-allowed":
      return "Firebase chưa bật đăng nhập bằng Email/Password.";
    case "auth/unauthorized-continue-uri":
      return "Firebase chưa cho phép domain của website trong Authorized domains.";
    default:
      return `Xác thực thất bại: ${error.message}`;
  }
}

export function saveLocalFirebaseProfile(profile: LocalFirebaseProfile) {
  localStorage.setItem(`${PROFILE_KEY_PREFIX}${profile.uid}`, JSON.stringify(profile));
}

export function getLocalFirebaseProfile(
  uid: string
): LocalFirebaseProfile | null {
  const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${uid}`);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as LocalFirebaseProfile;
  } catch {
    return null;
  }
}
