"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";
import { axiosInstance } from "@/lib/axios";
import type { FollowUser } from "@/types/user";

type Props = {
  username: string;
  type: "followers" | "following";
};

interface CurrentUser {
  username: string;
}

interface FollowListResponse {
  data?: {
    users?: FollowUser[];
  };
}

export default function FollowListPage({
  username,
  type,
}: Props) {

  const router = useRouter();
  const [
    me,
    setMe,
  ] = useState<CurrentUser | null>(null);

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      if(storedUser){
        const parsedUser =
          JSON.parse(storedUser) as CurrentUser;
        setMe(parsedUser);
      }
    } catch(error){

      console.error(
        "Failed parsing user:",
        error
      );
    }
  }, []);

  const endpoint =
    type === "followers"
      ? `/api/users/${username}/followers`
      : `/api/users/${username}/following`;

  const {
    data,
    isLoading,
  } =
    useQuery<FollowListResponse>({

      queryKey: [
        type,
        username,
      ],

      queryFn: async () => {
        const response =
          await axiosInstance.get<FollowListResponse>(
            endpoint
          );
        return response.data;
      },
      enabled:
        Boolean(username),
    });

  const users =
    data?.data?.users ?? [];

  if(isLoading){

    return (
      <div className="
        text-white
        text-center
        py-20
      ">
        Loading {type}...
      </div>
    );
  }

  return (
    <div className="
      text-white
      min-h-screen
    ">

      {/* HEADER */}

      <div className="
        flex
        items-center
        gap-3
        px-4
        py-4
        border-b
        border-zinc-800
      ">
        <button
          type="button"
          onClick={() =>
            router.back()
          }
        >
          <ArrowLeft size={20}/>
       </button>

        <h1 className="
          font-semibold
          text-lg
          capitalize
        ">
          {type}
        </h1>
      </div>

      {/* LIST */}

      <div className="
        divide-y
        divide-zinc-800
      ">

        {
          users.length === 0 && (
            <p className="
              text-center
              text-gray-500
              py-10
            ">
              No {type} yet
            </p>
          )
        }
        {
          users.map(
            (user) => (
              <div
                key={user.id}
                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                "
              >

                {/* LEFT */}

                <div
                  onClick={() =>
                    router.push(
                      `/users/${user.username}`
                    )
                  }
                  className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                  "
                >

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
                    "
                  />

                  <div>
                    <p className="
                      text-sm
                      font-semibold
                    ">
                      {user.username}
                    </p>
                    <p className="
                      text-xs
                      text-gray-400
                    ">
                      {user.name}
                    </p>
                  </div>
                </div>

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
    </div>
  );
}