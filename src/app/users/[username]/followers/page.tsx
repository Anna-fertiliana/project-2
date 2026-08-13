"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";

interface CurrentUser {
  username: string;
}

interface FollowerUser {
  id: string;
  username: string;
  name?: string | null;
  avatarUrl?: string | null;
  isFollowingMe?: boolean;
  isFollowedByMe?: boolean;
}

interface FollowersResponse {
  data?: {
    users?: FollowerUser[];
  };
}

export default function FollowersPage() {

  const params = useParams();
  const router = useRouter();

  const username =
    Array.isArray(params.username)
      ? params.username[0]
      : params.username;

  const [me, setMe] =
    useState<CurrentUser | null>(null);

  useEffect(() => {

    try {
      const storedUser =
        localStorage.getItem("user");

      if (storedUser) {

        const parsedUser =
          JSON.parse(storedUser) as CurrentUser;
        setMe(parsedUser);
      }

    } catch (error) {

      console.error(
        "Failed parsing user:",
        error
      );
    }
  }, []);

  const {
    data,
    isLoading,
  } =
    useQuery<FollowersResponse>({

      queryKey: [
        "followers",
        username,
      ],

      queryFn: async () => {

        const response =
          await axiosInstance.get<FollowersResponse>(
            `/api/users/${username}/followers`
          );
        return response.data;

      },

      enabled: Boolean(username),
    });

  const followers =
    data?.data?.users ?? [];

  if (!username) {

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

    <div className="
      text-white
      min-h-screen
      pb-24">

      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-3
        px-4
        py-4
        border-b
        border-zinc-800
        sticky
        top-0
        bg-black
        z-10">

        <button
          type="button"
          onClick={() => router.back()}>
          <ArrowLeft size={20}/>
        </button>

        <h1 className="
          font-semibold
          text-lg ">
          Followers
        </h1>
      </div>

      {/* LOADING */}

      {
        isLoading && (
          <div className="
            p-4
            space-y-4">

            {
              Array.from({
                length: 6,
              }).map(
                (_, index) => (

                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      gap-3
                      animate-pulse">

                    <div className="
                      w-10
                      h-10
                      rounded-full
                      bg-zinc-800"/>

                    <div className="
                      flex-1
                      space-y-2">

                      <div className="
                        w-32
                        h-3
                        bg-zinc-800
                        rounded "/>

                      <div className="
                        w-20
                        h-2
                        bg-zinc-800
                        rounded "/>
                    </div>
                  </div>
                )
              )
            }
          </div>
        )
      }

      {/* LIST */}

      {
        !isLoading && (
          <div className="
            divide-y
            divide-zinc-800 ">

            {
              followers.length === 0 && (

                <div className="
                  text-center
                  py-16
                  text-gray-500
                  text-sm">
                  No followers yet
                </div>
              )
            }

            {
              followers.map(
                (user) => (
                  <div
                    key={user.id}
                    className="
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      hover:bg-zinc-900
                      transition">

                    {/* LEFT */}

                    <Link
                      href={`/users/${user.username}`}
                      className="
                        flex
                        items-center
                        gap-3
                        flex-1">

                      <img
                        src={
                          user.avatarUrl ||
                          "/avatar.png"
                        }
                        alt="Avatar"
                        onError={(
                          e: React.SyntheticEvent<
                            HTMLImageElement
                          >
                        ) => {

                          e.currentTarget.src =
                            "/avatar.png";

                        }}
                        className="
                          w-10
                          h-10
                          rounded-full
                          object-cover
                          bg-zinc-800"/>

                      <div>

                        <p className="
                          text-sm
                          font-semibold">
                          {user.username}
                        </p>

                        <p className="
                          text-xs
                          text-gray-400">
                          {user.name}
                        </p>

                        {
                          user.isFollowingMe && (

                            <p className="
                              text-[10px]
                              text-gray-500">
                              Follows you
                            </p>
                          )
                        }
                      </div>
                    </Link>

                    {/* RIGHT */}

                    {
                      me?.username !==
                      user.username && (
                        <FollowButton
                          username={
                            user.username
                          }
                          initialFollowed={
                            user.isFollowedByMe ??
                            false
                          }
                        />
                      )
                    }
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