import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-extrabold text-stone-900">Đăng nhập</h1>
      <p className="mt-2 text-stone-600">
        Chào mừng quay lại SilverLink.
      </p>
      <LoginForm next={next ?? "/"} />
    </div>
  );
}
