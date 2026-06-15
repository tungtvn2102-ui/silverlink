"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  sendEmailVerification,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { CITIES } from "@/lib/constants";
import { ROLE_LABELS } from "@/lib/types";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  getAuthErrorMessage,
  getLocalFirebaseProfile,
  saveLocalFirebaseProfile,
  type FirebaseRole,
  type LocalFirebaseProfile,
} from "@/lib/firebase/auth";

const DEFAULT_ROLE: FirebaseRole = "family";

export default function AccountClient() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LocalFirebaseProfile | null>(null);
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setReady(true);

      if (!nextUser) {
        setProfile(null);
        router.replace("/dang-nhap?next=/tai-khoan");
        return;
      }

      setProfile(
        getLocalFirebaseProfile(nextUser.uid) ?? {
          uid: nextUser.uid,
          fullName: nextUser.displayName || "",
          role: DEFAULT_ROLE,
        }
      );
    });
  }, [router]);

  async function onSave(formData: FormData) {
    if (!user) return;

    setSaved(false);
    setError(null);

    const nextProfile: LocalFirebaseProfile = {
      uid: user.uid,
      fullName: String(formData.get("full_name") ?? "").trim(),
      role: String(formData.get("role") ?? DEFAULT_ROLE) as FirebaseRole,
      city: String(formData.get("city") ?? ""),
      district: String(formData.get("district") ?? "").trim(),
      bio: String(formData.get("bio") ?? "").trim(),
      skills: String(formData.get("skills") ?? "").trim(),
      experienceYears: String(formData.get("experience_years") ?? "").trim(),
      availability: String(formData.get("availability") ?? "").trim(),
    };

    try {
      await updateProfile(user, { displayName: nextProfile.fullName });
      saveLocalFirebaseProfile(nextProfile);
      setProfile(nextProfile);
      setSaved(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  async function resendVerification() {
    if (!user) return;

    setNotice(null);
    setError(null);

    try {
      await sendEmailVerification(user);
      setNotice("Đã gửi lại email xác nhận.");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  }

  async function onSignOut() {
    await signOut(getFirebaseAuth());
    router.push("/");
    router.refresh();
  }

  if (!ready || !profile || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <p className="rounded-2xl bg-white p-6 text-stone-600 shadow-sm">
          Đang tải tài khoản...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Tài khoản của tôi
          </h1>
          <p className="mt-1 text-stone-600">
            {ROLE_LABELS[profile.role]} · {user.email}
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="rounded-xl border-2 border-stone-300 px-4 py-2.5 font-bold text-stone-700 hover:bg-stone-100"
        >
          Đăng xuất
        </button>
      </div>

      {!user.emailVerified && (
        <div className="mt-5 rounded-2xl bg-amber-50 p-5 text-amber-900">
          <p className="font-bold">Email chưa được xác nhận.</p>
          <p className="mt-1 text-sm">
            Bạn cần xác nhận email trước khi dùng đầy đủ các tính năng tài
            khoản.
          </p>
          <button
            onClick={resendVerification}
            className="mt-3 rounded-lg bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700"
          >
            Gửi lại email xác nhận
          </button>
        </div>
      )}

      {profile.role === "business" && (
        <div className="mt-5 rounded-2xl bg-brand-50 p-5 text-brand-900">
          <p className="font-bold">Tài khoản doanh nghiệp đã dùng Firebase.</p>
          <p className="mt-1 text-sm">
            Các trang quản lý doanh nghiệp cũ vẫn cần phiên Supabase server.
            Cần thêm Firebase Admin để mở khóa phần đó bằng Firebase.
          </p>
        </div>
      )}

      {notice && (
        <p role="status" className="mt-5 rounded-lg bg-brand-50 px-4 py-3 text-brand-800">
          {notice}
        </p>
      )}
      {saved && (
        <p role="status" className="mt-5 rounded-lg bg-brand-50 px-4 py-3 font-semibold text-brand-800">
          Đã lưu thay đổi.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}

      <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-stone-900">
          Hoạt động của tôi
        </h2>
        <p className="mt-3 text-stone-600">
          Hoạt động đặt lịch, ứng tuyển và cộng đồng sẽ hiển thị lại sau khi
          backend được nối sang Firebase Admin. Hiện tại bạn vẫn có thể xem các
          danh mục công khai.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/duong-lao" className="font-bold text-brand-700 underline">
            Tìm nhà dưỡng lão
          </Link>
          <Link href="/viec-lam" className="font-bold text-brand-700 underline">
            Xem việc làm
          </Link>
        </div>
      </section>

      <form action={onSave} className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-bold text-stone-900">
          Thông tin cá nhân
        </h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="full_name" className="mb-1 block font-semibold">
              Họ và tên
            </label>
            <input
              id="full_name"
              name="full_name"
              defaultValue={profile.fullName}
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-1 block font-semibold">
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              defaultValue={profile.role}
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
            >
              <option value="family">Người thân</option>
              <option value="senior">Người cao tuổi</option>
              <option value="business">Doanh nghiệp</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="mb-1 block font-semibold">
                Tỉnh / Thành phố
              </label>
              <select
                id="city"
                name="city"
                defaultValue={profile.city ?? ""}
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Chọn</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="mb-1 block font-semibold">
                Quận / Huyện
              </label>
              <input
                id="district"
                name="district"
                defaultValue={profile.district ?? ""}
                className="w-full rounded-xl border border-stone-300 px-4 py-3"
              />
            </div>
          </div>
          <div>
            <label htmlFor="bio" className="mb-1 block font-semibold">
              Giới thiệu ngắn
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={profile.bio ?? ""}
              className="w-full rounded-xl border border-stone-300 px-4 py-3"
            />
          </div>
          <fieldset className="rounded-xl bg-stone-50 p-4">
            <legend className="px-1 font-bold text-stone-800">
              Hồ sơ làm việc
            </legend>
            <div className="mt-2 space-y-4">
              <div>
                <label htmlFor="skills" className="mb-1 block font-semibold">
                  Kỹ năng / Chuyên môn
                </label>
                <input
                  id="skills"
                  name="skills"
                  defaultValue={profile.skills ?? ""}
                  className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="experience_years"
                    className="mb-1 block font-semibold"
                  >
                    Số năm kinh nghiệm
                  </label>
                  <input
                    id="experience_years"
                    name="experience_years"
                    type="number"
                    min={0}
                    max={70}
                    defaultValue={profile.experienceYears ?? ""}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                  />
                </div>
                <div>
                  <label htmlFor="availability" className="mb-1 block font-semibold">
                    Thời gian có thể làm
                  </label>
                  <input
                    id="availability"
                    name="availability"
                    defaultValue={profile.availability ?? ""}
                    className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
