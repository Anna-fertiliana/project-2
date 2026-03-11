"use client";

import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <nav className="w-full border-b border-zinc-800 px-4 py-3">

      <div className="flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-7 h-7" />
          <span className="font-bold text-white">Sociality</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">

          <div className="relative">

            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>

            <input
              type="text"
              placeholder="Search"
              className="w-full bg-zinc-900 pl-10 pr-3 py-2 rounded-full text-sm outline-none"
            />

          </div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {user ? (
            <Link href="/profile" className="flex items-center gap-2">

              <span className="hidden md:block text-sm">
                {user.username}
              </span>

              <img
                src={user.avatarUrl || "/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover"
              />

            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2 text-sm border border-zinc-700 rounded-full hover:border-purple-500 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="px-5 py-2 text-sm rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>

    </nav>
  );
}