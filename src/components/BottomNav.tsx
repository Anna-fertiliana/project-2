"use client";

import Link from "next/link";

export default function BottomNav() {
  return (
    <div
      className="
        fixed bottom-6 left-1/2 -translate-x-1/2
        bg-zinc-900 px-8 py-3 rounded-full
        flex items-center gap-10 text-white shadow-lg
        z-50
      "
    >

      {/* HOME */}
      <Link href="/feed" className="text-sm">
        Home
      </Link>

      {/* CREATE POST */}
      <Link
        href="/create"
        className="
        bg-purple-600 w-10 h-10 rounded-full
        flex items-center justify-center text-xl
        hover:bg-purple-700 transition
        "
      >
        +
      </Link>

      {/* PROFILE */}
      <Link href="/profile" className="text-sm">
        Profile
      </Link>

    </div>
  );
}