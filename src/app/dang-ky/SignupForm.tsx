"use client";

import { useState } from "react";
import Link from "next/link";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import {
  getAuthErrorMessage,
  saveLocalFirebaseProfile,
  type FirebaseRole,
} from "@/lib/firebase/auth";

const ROLES = [
  {
    value: "senior",
    title: "Tôi là người cao tuổi",
    desc: "Tìm nơi chăm sóc, việc làm phù hợp và bạn bè đồng trang lứa.",
  },
  {
    value: "family",
    title: "Tôi tìm cho người thân",
    desc: "Tìm nhà dưỡng lão uy tín và dịch vụ tin cậy cho cha mẹ, ông bà.",
  },
  {
    value: "business",
    title: "Tôi là doanh nghiệp",
    desc: "Cơ sở dưỡng lão hoặc doanh nghiệp tuyển dụng lao động cao tuổi.",
  },
] as const;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://silverlink-six.vercel.app";

export default function SignupForm() {
  const [role, setRole] = useState<FirebaseRole>("family");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const fullName = String(form.get("full_name") ?? "").trim();
    const auth = getFirebaseAuth();

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        String(form.get("email")),
        String(form.get("password"))
      );

      await updateProfile(credential.user, { displayName: fullName });
      saveLocalFirebaseProfile({
        uid: credential.user.uid,
        fullName,
        role,
      });
      await sendEmailVerification(credential.user, {
        url: `${SITE_URL}/dang-nhap`,
      });
      await signOut(auth);
      setDone(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 rounded-2xl bg-brand-50 p-6 text-center">
        <p className="text-2xl">📬</p>
        <h2 className="mt-2 text-xl font-bold text-brand-800">
          Kiểm tra email của bạn
        </h2>
        <p className="mt-2 text-stone-700">
          Firebase đã gửi liên kết xác nhận. Vui lòng mở email và bấm vào liên
          kết trước khi đăng nhập.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <fieldset>
        <legend className="mb-2 font-semibold">Bạn là ai?</legend>
        <div className="space-y-2">
          {ROLES.map((r) => (
            <label
              key={r.value}
              className={`block cursor-pointer rounded-xl border-2 p-4 transition ${
                role === r.value
                  ? "border-brand-600 bg-brand-50"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              <span className="font-bold text-stone-900">{r.title}</span>
              <span className="mt-1 block text-sm text-stone-600">
                {r.desc}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="full_name" className="mb-1 block font-semibold">
          Họ và tên
        </label>
        <input
          id="full_name"
          name="full_name"
          required
          autoComplete="name"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1 block font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 focus:border-brand-500"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block font-semibold">
          Mật khẩu <span className="font-normal text-stone-500">(ít nhất 6 ký tự)</span>
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 focus:border-brand-500"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-brand-600 px-4 py-3.5 text-lg font-bold text-white hover:bg-brand-700 disabled:opacity-60"
      >
        {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>
      <p className="text-center text-sm text-stone-500">
        Bằng việc đăng ký, bạn đồng ý với{" "}
        <Link href="/dieu-khoan" className="underline">
          Điều khoản sử dụng
        </Link>{" "}
        và{" "}
        <Link href="/bao-mat" className="underline">
          Chính sách bảo mật
        </Link>
        .
      </p>
      <p className="text-center text-stone-600">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-bold text-brand-700 underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
