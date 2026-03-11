"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

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
        setUser(data.data?.user || data.data);
      }
    } catch (error) {
      console.error("Profile error:", error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchMyPosts = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/me/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (res.ok) {
      setPosts(data.data?.items || data.data || []);
    }

  } catch (error) {
    console.error("Posts error:", error);
  } finally {
    setLoadingPosts(false);
  }
};

  if (loadingProfile) {
    return (
      <div className="p-6 text-white text-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-white text-center">
        Failed to load profile
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto text-white pb-24">

    {/* PROFILE HEADER */}

    <div className="flex items-center justify-between p-4">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        <img
          src={user.avatarUrl || "/avatar-placeholder.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover"
        />

        <div>
          <h1 className="font-bold text-lg">
            {user.username}
          </h1>

          <p className="text-sm text-gray-400">
            {user.name}
          </p>
        </div>

      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">

        <Link href="/me/edit">
          <button className="px-3 py-1 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800">
            Edit Profile
          </button>
        </Link>

        <button
          onClick={() => {
            navigator.share?.({
              title: "My Profile",
              url: window.location.href
            });
          }}
          className="p-2 border border-zinc-700 rounded-lg hover:bg-zinc-800"
        >
          <Share2 size={18} />
        </button>

      </div>

    </div>

      {/* STATS */}
      <div className="flex justify-center gap-10 text-center border-y border-zinc-800 py-4">

        <div>
          <p className="font-semibold text-lg">
            {posts.length}
          </p>
          <p className="text-gray-400 text-sm">
            Posts
          </p>
        </div>

        <div>
          <p className="font-semibold text-lg">
            {user.followersCount || 0}
          </p>
          <p className="text-gray-400 text-sm">
            Followers
          </p>
        </div>

        <div>
          <p className="font-semibold text-lg">
            {user.followingCount || 0}
          </p>
          <p className="text-gray-400 text-sm">
            Following
          </p>
        </div>

      </div>

      {/* TABS */}
      <div className="flex justify-center gap-10 text-sm border-b border-zinc-800 py-3">

        <button className="font-semibold border-b-2 border-white pb-1">
          Gallery
        </button>

        <button className="text-gray-400">
          Saved
        </button>

      </div>

      {/* POSTS GRID */}
      <div className="mt-4 px-2">

        {loadingPosts && (
          <p className="text-center text-gray-400 py-10">
            Loading posts...
          </p>
        )}

        {!loadingPosts && posts.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No posts yet
          </p>
        )}

        {!loadingPosts && posts.length > 0 && (
          <div className="grid grid-cols-3 gap-1">

            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
              >
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="aspect-square object-cover hover:opacity-80 transition rounded-md"
                />
              </Link>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}