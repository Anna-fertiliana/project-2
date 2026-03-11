"use client";

import { useEffect, useState } from "react";
import PostCard from "./PostCard";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://be-social-media-api-production.up.railway.app/api/posts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const data = await res.json();

        console.log("Feed response:", data);

        if (!data?.data?.posts) {
          setPosts([]);
          return;
        }

        setPosts(data.data.posts);

      } catch (error) {
        console.error("Feed error:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading feed...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No posts available
      </div>
    );
  }

  return (
    <section className="flex justify-center px-4 mt-6">
      <div className="w-full max-w-xl space-y-6">
        {posts.map((post: any) => (
          <PostCard
            key={post.id}
            postId={post.id}
            image={post.imageUrl}
            caption={post.caption}
            username={post.author?.username}
            avatar={post.author?.avatarUrl}
            likes={post.likeCount}
            comments={post.commentCount}
            isLiked={post.likedByMe}
          />
        ))}
      </div>
    </section>
  );
}