"use client";

import { motion } from "framer-motion";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface Props {
  postId: string;
  onClose: () => void;
}

interface CommentUser {
  username: string;
  avatarUrl?: string | null;
}

interface CommentItem {
  id: string | number;
  content: string;
  user?: CommentUser;
}

interface CommentsResponse {
  data?: {
    comments?: CommentItem[];
  };
}

interface MutationContext {
  previous?: CommentsResponse;
}

export default function CommentMobile({
  postId,
  onClose,
}: Props) {

  const queryClient =
    useQueryClient();
  const [text, setText] =
    useState("");
  const {
    data,
    isLoading,
  } =
    useQuery<CommentsResponse>({
      queryKey: [
        "comments",
        postId,
      ],

      queryFn: async () => {
        const response =
          await axiosInstance.get<CommentsResponse>(
            `/api/posts/${postId}/comments`
          );
        return response.data;
      },
    });

  const comments =
    data?.data?.comments ?? [];

  const mutation =
    useMutation<
      unknown,
      Error,
      string,
      MutationContext
    >({

      mutationFn: async (
        content: string
      ) => {

        const response =
          await axiosInstance.post(
            `/api/posts/${postId}/comments`,
            {
              content,
            }
          );

        return response.data;
      },

      onMutate: async (
        content
      ) => {

        await queryClient.cancelQueries({
          queryKey: [
            "comments",
            postId,
          ],
        });

        const previous =
          queryClient.getQueryData<CommentsResponse>(
            [
              "comments",
              postId,
            ]
          );

        const fakeComment: CommentItem =
        {
          id: Date.now(),
          content,
          user: {
            username: "You",
            avatarUrl:
              "/avatar.png",
          },
        };

        queryClient.setQueryData<CommentsResponse>(
          [
            "comments",
            postId,
          ],
          (old) => {

            const oldComments =
              old?.data?.comments ?? [];

            return {
              ...old,
              data: {
                ...old?.data,
                comments: [
                  ...oldComments,
                  fakeComment,
                ],
              },
            };
          }
        );

        setText("");

        return {
          previous,
        };
      },
      onError: (
        _error,
        _variables,
        context
      ) => {

        if(context?.previous){
          queryClient.setQueryData(
            [
              "comments",
              postId,
            ],
            context.previous
          );
        }
      },

      onSettled: () => {
        void queryClient.invalidateQueries({
          queryKey: [
            "comments",
            postId,
          ],
        });
      },
    });

  const handlePost =
    (): void => {
      if(!text.trim()) return;
      mutation.mutate(text);
    };

  return (

    <div className="
      w-full
      h-full
      flex
      items-end
    ">

      <motion.div

        initial={{
          y: "100%",
        }}

        animate={{
          y: 0,
        }}

        exit={{
          y: "100%",
        }}

        transition={{
          type: "spring",
          stiffness: 100,
          damping: 25,
        }}

        className="
          w-full
          h-[88%]
          bg-zinc-900
          rounded-t-2xl
          flex
          flex-col
        "
      >

        {/* HANDLE */}

        <div className="
          w-12
          h-1.5
          bg-zinc-700
          rounded-full
          mx-auto
          my-3
        "/>

        {/* HEADER */}

        <div className="
          flex
          justify-between
          items-center
          px-4
          pb-3
        ">
          <h2 className="
            text-white
            text-sm
            font-semibold
          ">
            Comments
          </h2>

          <button
            type="button"
            onClick={onClose}
          >
            <X className="
              text-zinc-400
            "/>
          </button>
        </div>

        {/* COMMENTS */}

        <div className="
          flex-1
          overflow-y-auto
          px-4
          space-y-4
          pb-4
        ">

          {
            isLoading ? (
              <p className="
                text-gray-400
                text-center
                text-sm
              ">
                Loading...
              </p>
            ) : comments.length === 0 ? (
              <p className="
                text-gray-400
                text-center
                text-sm
              ">
                No comments yet
              </p>
            ) : (

              comments.map(
                (comment) => (

                  <div
                    key={comment.id}
                    className="
                      flex
                      gap-3
                    "
                  >
                    <img
                      src={
                        comment.user?.avatarUrl ||
                        "/avatar.png"
                      }
                      alt="Avatar"
                      className="
                        w-8
                        h-8
                        rounded-full
                        object-cover
                      "
                    />

                    <div>
                      <p className="
                        text-sm
                        text-white
                        font-medium
                      ">
                        {
                          comment.user?.username ||
                          "User"
                        }
                      </p>

                      <p className="
                        text-sm
                        text-gray-300
                      ">
                        {comment.content}
                      </p>

                      <span className="
                        text-xs
                        text-gray-500
                      ">
                        just now
                      </span>
                    </div>
                  </div>
                )
              )
            )
          }
        </div>

        {/* INPUT */}

        <div className="
          border-t
          border-zinc-800
          px-4
          py-3
          flex
          items-center
          gap-2
        ">


          <input
            value={text}
            onChange={(event) =>
              setText(
                event.target.value
              )
            }

            placeholder="Add a comment..."

            className="
              flex-1
              bg-zinc-800
              text-white
              text-sm
              px-4
              py-2
              rounded-full
              outline-none
            "
          />

          <button
            type="button"
            onClick={handlePost}
            disabled={
              !text.trim() ||
              mutation.isPending
            }

            className="
              text-blue-500
              text-sm
              font-medium
              disabled:opacity-40
            ">
            Post
          </button>
        </div>
      </motion.div>
    </div>
  );
}