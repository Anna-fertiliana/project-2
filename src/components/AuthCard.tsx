"use client";

import Link from "next/link";
import { useState } from "react";

interface AuthCardProps {
  title: string;
  buttonText: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthCard({
  title,
  buttonText,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    localStorage.setItem("token", data.data.token);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    window.location.href = "/feed";

  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat login");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="w-full max-w-md mx-auto rounded-xl border border-gray-800 bg-[#0B0F19]/80 backdrop-blur p-6 shadow-xl text-white">

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-7 h-7" />
          <h1 className="text-lg font-semibold">Sociality</h1>
        </div>

        <h2 className="text-xl font-bold mt-2">{title}</h2>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>

        <div>
          <label className="text-sm">Email</label>

          <input
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            onChange={handleChange}
            className="w-full mt-1 rounded-md bg-[#111827] border border-gray-700 px-3 py-2 text-sm outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-sm">Password</label>

          <input
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            onChange={handleChange}
            className="w-full mt-1 rounded-md bg-[#111827] border border-gray-700 px-3 py-2 text-sm outline-none focus:border-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 font-medium hover:opacity-90 transition"
        >
          {loading ? "Loading..." : buttonText}
        </button>

      </form>

      <p className="text-center text-sm mt-4 text-gray-400">
        {footerText}{" "}
        <Link href={footerLink} className="text-purple-400 hover:underline">
          {footerLinkText}
        </Link>
      </p>

    </div>
  );
}
