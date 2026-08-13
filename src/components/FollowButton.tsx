"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type Props = {
  username: string;
  initialFollowed: boolean;
};

interface UserProfile {
  isFollowedByMe?: boolean;
  followersCount?: number;
}

interface UserResponse {
  data?: UserProfile;
}

interface MutationContext {
  previous?: UserResponse;
}

export default function FollowButton({
  username,
  initialFollowed,
}: Props) {

  const queryClient =
    useQueryClient();

  const mutation =
    useMutation<
      unknown,
      Error,
      void,
      MutationContext
    >({


      mutationFn: async (): Promise<unknown> => {
        const cachedUser =
          queryClient.getQueryData<UserResponse>(
            [
              "user",
              username,
            ]
          );


        const user =
          cachedUser?.data;

        if(user?.isFollowedByMe){

          return axiosInstance.delete(
            `/api/follow/${username}`
          );
        }
        return axiosInstance.post(
          `/api/follow/${username}`
        );
      },

      // ================= OPTIMISTIC UPDATE

      onMutate: async (): Promise<MutationContext> => {

        await queryClient.cancelQueries({
          queryKey: [
            "user",
            username,
          ],
        });

        const previous =
          queryClient.getQueryData<UserResponse>(
            [
              "user",
              username,
            ]
          );

        queryClient.setQueryData<UserResponse>(
          [
            "user",
            username,
          ],

          (old) => {
            if(!old?.data){
              return old;
            }

            const current =
              old.data;

            const followed =
              current.isFollowedByMe ?? false;

            return {
              ...old,
              data: {
                ...current,

                isFollowedByMe:
                  !followed,

                followersCount:
                  followed

                    ? Math.max(
                        (current.followersCount ?? 1) - 1,
                        0
                      )

                    : (current.followersCount ?? 0) + 1,
              },
            };
          }
        );

        return {
          previous,
        };
      },

      // ================= ROLLBACK

      onError: (
        _error,
        _variables,
        context
      ) => {

        if(context?.previous){
          queryClient.setQueryData(
            [
              "user",
              username,
            ],
            context.previous
          );
        }
      },

      // ================= SYNC

      onSettled: () => {
        void queryClient.invalidateQueries({
          queryKey: [
            "user",
            username,
          ],
        });
      },
    });

  const cachedUser =
    queryClient.getQueryData<UserResponse>(
      [
        "user",
        username,
      ]
    );

  const user =
    cachedUser?.data;
  const isFollowed =
    user?.isFollowedByMe ??
    initialFollowed;

  return (

    <button
      type="button"
      onClick={() =>
        mutation.mutate()
      }

      disabled={
        mutation.isPending
      }

      className={`
        px-4
        py-1.5
        rounded-full
        text-sm
        font-medium
        transition
        ${
          isFollowed
            ? "bg-zinc-800 border border-zinc-700 text-white"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        }
        ${
          mutation.isPending
            ? "opacity-50"
            : ""
        }
      `}
    >
      {
        mutation.isPending
          ? "Loading..."
          : isFollowed
          ? "Following"
          : "Follow"
      }
    </button>
  );
}