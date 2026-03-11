"use client";

import Link from "next/link";
import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Password tidak sama");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          username: form.username,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Register berhasil!");
        router.push("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-purple-900 px-4">
      <div className="w-full max-w-sm bg-[#0B0F19]/80 backdrop-blur rounded-2xl border border-gray-800 p-6 shadow-xl text-white">

        {/* Logo + Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="w-7 h-7" />
            <h1 className="font-semibold text-lg">Sociality</h1>
          </div>
          <h2 className="text-xl font-bold mt-2">Register</h2>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="text-sm">Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              placeholder="Enter your name"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>


          {/* Email */}
          <div>
            <label className="text-sm">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm">Number Phone</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              placeholder="Enter your number phone"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              placeholder="Confirm your password"
              onChange={handleChange}
              required
              className="w-full mt-1 bg-[#111827] border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 font-medium mt-2 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-4 text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-400">
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
}