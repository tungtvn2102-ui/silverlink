"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function FirebaseAuthLinks() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setReady(true);
    });

    return unsubscribe;
  }, []);

  if (!ready) {
    return <div className="h-10 w-28" aria-hidden />;
  }

  if (user) {
    const name = user.displayName || user.email || "Tài khoản";

    return (
      <Link
        href="/tai-khoan"
        className="flex items-center gap-2 rounded-full bg-brand-50 py-1.5 pl-2 pr-4 font-semibold text-brand-800 hover:bg-brand-100"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-700 text-sm font-bold text-white">
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="hidden max-w-32 truncate sm:inline">{name}</span>
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/dang-nhap"
        className="hidden rounded-lg px-4 py-2 font-bold text-stone-700 hover:bg-stone-100 sm:block"
      >
        Đăng nhập
      </Link>
      <Link
        href="/dang-ky"
        className="rounded-lg bg-brand-700 px-4 py-2 font-bold text-white hover:bg-brand-800"
      >
        Đăng ký
      </Link>
    </>
  );
}
