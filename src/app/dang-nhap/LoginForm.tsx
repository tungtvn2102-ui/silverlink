"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { getAuthErrorMessage } from "@/lib/firebase/auth";

export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const auth = getFirebaseAuth();

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        String(form.get("email")),
        String(form.get("password"))
      );

      if (!credential.user.emailVerified) {
        await sendEmailVerification(credential.user);
        await signOut(auth);
        setNotice(
          "Email chưa được xác nhận. Chúng tôi đã gửi lại liên kết xác nhận."
        );
        return;
      }

      router.push(next.startsWith("/") ? next : "/tai-khoan");
      router.refresh();
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
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
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 focus:border-brand-500"
        />
      </div>
      {notice && (
        <p role="status" className="rounded-lg bg-brand-50 px-4 py-3 text-brand-800">
          {notice}
        </p>
      )}
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
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
      <p className="text-center text-stone-600">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-bold text-brand-700 underline">
          Đăng ký miễn phí
        </Link>
      </p>
    </form>
  );
}
