import type { Metadata } from "next";
import SignupForm from "./SignupForm";

export const metadata: Metadata = { title: "Đăng ký" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">
        Đăng ký miễn phí
      </h1>
      <p className="mt-2 text-stone-600">
        Tạo tài khoản SilverLink chỉ trong một phút.
      </p>
      <SignupForm />
    </div>
  );
}
