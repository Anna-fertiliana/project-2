"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "next/navigation";
import { Heart, Send } from "lucide-react";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";
import type { Post } from "@/types/post";


interface CurrentUser {
  username: string;
}

interface UserProfile {
  id: string;
  name?: string;
  username: string;
  avatarUrl?: string | null;
  bio?: string | null;
  followersCount?: number;
  followingCount?: number;
  isFollowedByMe?: boolean;
}

interface UserResponse {
  data?: UserProfile;
}

interface UserPostsResponse {
  data?: {
    posts?: Post[];
  };
}

export default function UserProfilePage() {
  const params = useParams();
  const username =
    Array.isArray(params.username)
      ? params.username[0]
      : params.username;

  if (!username) {
  return (
    <div className="text-white text-center py-20">
      User not found
    </div>
  );
}

  const [me, setMe,] = useState<CurrentUser | null>(null);

  useEffect(() => {

    try {
      const savedUser =
        localStorage.getItem("user");

      if(savedUser){
        const parsedUser =
          JSON.parse(savedUser) as CurrentUser;
        setMe(parsedUser);
      }
    } catch(error){

      console.error(
        "Failed parsing user:",
        error );
    }
  }, []);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } =
    useQuery<UserResponse>({
      queryKey: [
        "user",
        username,
      ],
      queryFn: async () => {
        const response =
          await axiosInstance.get<UserResponse>(
            `/api/users/${username}`
          );

        return response.data;
      },
      enabled: Boolean(username),
    });

  const {
    data: postData,
    isLoading: postLoading,
  } =
    useQuery<UserPostsResponse>({
      queryKey: [
        "user-posts",
        username,
      ],

      queryFn: async () => {
        const response =
          await axiosInstance.get<UserPostsResponse>(
            `/api/users/${username}/posts`
          );
        return response.data;
      },
      enabled: Boolean(username),
    });

  const user =
    userData?.data;

  const posts =
    postData?.data?.posts ?? [];

  if(userLoading){

    return (
      <div className="
        text-white
        text-center
        py-20
      ">
        Loading profile...
      </div>
    );
  }

  if(userError || !user){

    return (
      <div className="
        text-white
        text-center
        py-20">
        User not found
      </div>
    );
  }

  return (

    <div className="text-white pb-24">

      {/* HEADER */}

      <div className="px-4 pt-6">
        <div className="
          flex
          items-start
          justify-between
          gap-4">

          <div className="
            flex
            flex-col
            items-center
            text-center
            sm:flex-row
            sm:text-left
            sm:items-start
            sm:gap-6">

            <img
              src={
                user.avatarUrl ||
                "/avatar.png"
              }
              alt="Profile"
              onError={(
                e: React.SyntheticEvent<HTMLImageElement>
              ) => {

                e.currentTarget.src =
                  "/avatar.png";
              }}
              className="
                w-20
                h-20
                sm:w-24
                sm:h-24
                rounded-full
                object-cover
                border
                border-zinc-700"/>

            <div className="mt-4 sm:mt-0">
              <h2 className="
                text-lg
                font-semibold">
                {
                  user.name ||
                  user.username
                }
              </h2>
              <p className="
                text-gray-400
                text-sm">
                @{user.username}
              </p>

              <p className="
                text-gray-300
                text-sm
                mt-2
                max-w-xs">
                {
                  user.bio ||
                  "No bio"
                }
              </p>

              <div className="
                flex
                gap-2
                mt-3">
                {
                  me?.username !== username && (
                    <FollowButton
                      username={username}
                      initialFollowed={
                        user.isFollowedByMe ?? false
                      }
                    />
                  )
                }

                <button
                  type="button"
                  className="
                    w-9
                    h-9
                    flex
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-zinc-700
                    text-zinc-400
                    hover:text-white
                    hover:bg-zinc-800">
                  <Send size={16}/>
                </button>
              </div>
            </div>
           </div>
        </div>
      </div>

      {/* STATS */}

      <div className="
        flex
        justify-around
        text-center
        border-y
        border-zinc-800
        mt-6
        py-3
        text-sm">

        <div>
          <p className="font-semibold">
            {posts.length}
          </p>

          <p className="text-gray-400">
            Posts
          </p>
        </div>

        <Link
          href={`/users/${username}/followers`}
          className="hover:opacity-80">
          <p className="font-semibold">
            {user.followersCount ?? 0}
          </p>

          <p className="text-gray-400">
            Followers
          </p>
        </Link>

        <Link
          href={`/users/${username}/following`}
          className="hover:opacity-80">
          <p className="font-semibold">
            {user.followingCount ?? 0}
          </p>

          <p className="text-gray-400">
            Following
          </p>
        </Link>

        <div className="hidden sm:block">
          <p className="font-semibold">
            0
          </p>
          <p className="text-gray-400">
            Likes
          </p>
        </div>
      </div>

      {/* TABS */}

      <div className="
        flex
        justify-center
        gap-10
        border-b
        border-zinc-800
        py-3
        text-sm">

        <button
          type="button"
          className="
            border-b-2
            border-white
            pb-1">
          Gallery
        </button>

        <button
          type="button"
          className="
            text-gray-400
            flex
            items-center
            gap-1">
          <Heart size={14}/>
          Liked
        </button>
      </div>

      {/* POSTS */}
      {postLoading ? (

          <p className="
            text-center
            text-gray-400
            py-10">
            Loading posts...
          </p>
        ) : posts.length === 0 ? (
          <p className="
            text-center
            text-gray-500
            mt-10">
            No posts yet
          </p>
        ) : (

          <div className="
            grid
            grid-cols-3
            gap-[2px]
            mt-[2px]">

            {
              posts.map(
                (post: Post) => (
                  <div
                    key={post.id}
                    className="
                      relative
                      group">

                    <img
                      src={
                        post.imageUrl ||
                        "/placeholder.png"
                      }
                      alt="Post"
                      className="
                        aspect-square
                        object-cover"/>

                    <div className="
                      hidden
                      sm:flex
                      absolute
                      inset-0
                      bg-black/40
                      opacity-0
                      group-hover:opacity-100
                      items-center
                      justify-center
                      text-white
                      text-sm">
                      ❤️ {post.likeCount ?? 0}
                    </div>
                  </div>
                )
              )
            }
          </div>
        )
      }
    </div>
  );
}