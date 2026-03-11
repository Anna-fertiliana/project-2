"use client";

import { useState } from "react";

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {

    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    const prevLiked = liked;
    const prevCount = count;

    setLoading(true);

    try {

      if (liked) {

        setLiked(false);
        setCount((c) => Math.max(0, c - 1));

        await fetch(`${API_URL}/api/posts/${postId}/like`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      } else {

        setLiked(true);
        setCount((c) => c + 1);

        await fetch(`${API_URL}/api/posts/${postId}/like`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      }

    } catch (error) {

      console.error(error);

      // rollback
      setLiked(prevLiked);
      setCount(prevCount);

    } finally {

      setLoading(false);

    }

  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 text-sm"
    >
      <span
        className={
          liked
            ? "text-red-500"
            : "text-gray-400"
        }
      >
        ♥
      </span>

      <span>{count}</span>
    </button>
  );
}