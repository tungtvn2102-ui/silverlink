"use client";

import { useState } from "react";

export default function LargeTextToggle({ initial }: { initial: boolean }) {
  const [on, setOn] = useState(initial);

  function toggle() {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle("lt", next);
    document.cookie = `sl-lt=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      title="Bật / tắt chữ lớn"
      className={`rounded-lg px-3 py-2 font-bold transition ${
        on ? "bg-white text-brand-700" : "bg-white/10 text-white hover:bg-white/20"
      }`}
    >
      <span aria-hidden>A</span>
      <span className="text-xs align-top" aria-hidden>
        A
      </span>
      <span className="sr-only">Chữ lớn</span>
    </button>
  );
}
