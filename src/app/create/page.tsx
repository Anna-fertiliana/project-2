"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      fetchMyPosts();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
        `${API_URL}/api/users/${user.username}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPosts(data.data?.posts || []);
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
    <main className="max-w-md mx-auto text-white pb-24">

      {/* PROFILE HEADER */}
      <div className="flex items-center justify-between p-4">

        <div className="flex items-center gap-4">

          <img
            src={user.avatarUrl || "/avatar-placeholder.png"}
            className="w-16 h-16 rounded-full object-cover"
          />

          <div>
            <h1 className="font-bold text-lg">
              {user.username}
            </h1>

            <p className="text-sm text-gray-400">
              {user.email}
            </p>
          </div>

        </div>

        <Link href="/me/edit">
          <button className="px-3 py-1 text-sm border border-zinc-700 rounded-lg hover:bg-zinc-800">
            Edit
          </button>
        </Link>

      </div>

      {/* BIO */}
      {user.bio && (
        <p className="px-4 text-sm text-gray-300">
          {user.bio}
        </p>
      )}

      {/* STATS */}
      <div className="flex justify-around text-sm border-y border-zinc-800 py-3 mt-4">

        <div className="text-center">
          <p className="font-semibold">{posts.length}</p>
          <p className="text-gray-400">Posts</p>
        </div>

        <div className="text-center">
          <p className="font-semibold">
            {user.followersCount || 0}
          </p>
          <p className="text-gray-400">Followers</p>
        </div>

        <div className="text-center">
          <p className="font-semibold">
            {user.followingCount || 0}
          </p>
          <p className="text-gray-400">Following</p>
        </div>

      </div>

      {/* POSTS GRID */}
      <div className="mt-4">

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
                  className="aspect-square object-cover hover:opacity-80 transition"
                />
              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}