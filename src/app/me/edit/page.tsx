"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        const user = data.data?.user || data.data;

        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          avatarUrl: user.avatarUrl || "",
        });
      }
    } catch (err) {
      console.error("FETCH PROFILE ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);

    const preview = URL.createObjectURL(file);

    setForm({
      ...form,
      avatarUrl: preview,
    });
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        router.push("/login");
        return;
      }

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("bio", form.bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("UPDATE PROFILE:", data);

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      router.push("/profile");

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white text-center py-10">
        Loading...
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto text-white pb-20 px-4">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-6">

        <button
          onClick={() => router.back()}
          className="text-gray-400"
        >
          ←
        </button>

        <h1 className="text-lg font-semibold">
          Edit Profile
        </h1>

      </div>

      <div className="flex gap-8">

        {/* AVATAR */}
        <div className="flex flex-col items-center">

          <img
            src={form.avatarUrl || "/avatar-placeholder.png"}
            className="w-24 h-24 rounded-full object-cover"
          />

          <label className="cursor-pointer text-sm text-blue-400 mt-3">

            Change Photo

            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />

          </label>

        </div>

        {/* FORM */}
        <div className="flex-1 space-y-4">

          <div>
            <label className="text-sm text-gray-400">
              Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Username
            </label>

            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Email
            </label>

            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Number Phone
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">
              Bio
            </label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 mt-1"
            />
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-2 rounded-full font-medium mt-4"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>

    </main>
  );
}