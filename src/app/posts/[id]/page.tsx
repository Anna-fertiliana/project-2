"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Heart,
  MessageCircle,
  Bookmark,
  X,
  Smile,
} from "lucide-react";
import EmojiPicker, {
  type EmojiClickData,
} from "emoji-picker-react";

import type { Comment } from "@/types/comment";
import type { Post } from "@/types/post";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://be-social-media-api-production.up.railway.app";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  const [commentText, setCommentText] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [commentLoading, setCommentLoading] =
    useState(true);

  const [showEmoji, setShowEmoji] =
    useState(false);


  useEffect(() => {
    if (!id) return;

    void fetchPost();
    void fetchComments();
  }, [id]);


  const fetchPost = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_URL}/api/posts/${id}`
      );

      const data: unknown = await response.json();

      if (
        response.ok &&
        typeof data === "object" &&
        data !== null &&
        "data" in data
      ) {
        setPost(
          (data as { data: Post }).data
        );
      }

    } catch (error) {
      console.error(
        "Failed fetching post:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  const fetchComments = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${API_URL}/api/posts/${id}/comments`
      );

      const data: unknown = await response.json();

      let commentList: Comment[] = [];


      if (
        typeof data === "object" &&
        data !== null
      ) {

        const result =
          data as {
            data?: unknown;
            comments?: unknown;
          };


        if (Array.isArray(result.data)) {
          commentList =
            result.data as Comment[];

        } else if (
          typeof result.data === "object" &&
          result.data !== null &&
          "comments" in result.data &&
          Array.isArray(
            (result.data as {
              comments?: unknown;
            }).comments
          )
        ) {
          commentList =
            (result.data as {
              comments: Comment[];
            }).comments;

        } else if (
          Array.isArray(result.comments)
        ) {
          commentList =
            result.comments as Comment[];
        }
      }


      setComments(commentList);

    } catch (error) {

      console.error(
        "Failed fetching comments:",
        error
      );

    } finally {

      setCommentLoading(false);

    }
  };


  const handleAddComment = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {

    e.preventDefault();

    if (!commentText.trim()) return;


    try {

      const response = await fetch(
        `${API_URL}/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            content: commentText,
          }),
        }
      );


      if (response.ok) {

        setCommentText("");

        await fetchComments();

      }


    } catch (error) {

      console.error(
        "Failed adding comment:",
        error
      );

    }
  };


  const handleEmojiClick = (
    emojiData: EmojiClickData
  ): void => {

    setCommentText(
      (prev) =>
        prev + emojiData.emoji
    );

  };


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }


  if (!post) {
    return null;
  }


  return (
    <div className="fixed inset-0 bg-black/80 z-50">

      <div
        className="
          w-full h-full flex flex-col
          md:items-center md:justify-center
        "
      >

        <div
          className="
            bg-zinc-900 w-full h-full flex flex-col
            md:w-[900px]
            md:h-[600px]
            md:grid
            md:grid-cols-2
            md:rounded-xl
            md:overflow-hidden
          "
        >

          <button
            type="button"
            onClick={() => router.back()}
            className="
              absolute top-4 right-4
              text-white z-10
            "
          >
            <X size={22}/>
          </button>


          {/* IMAGE */}
          <div className="bg-black h-[300px] md:h-full">

            <img
              src={post.imageUrl}
              alt="Post"
              className="
                w-full h-full object-cover
              "
            />

          </div>



          {/* RIGHT */}
          <div className="flex flex-col h-full">


            {/* HEADER */}
            <div
              className="
                flex items-center gap-3
                p-4
                border-b border-zinc-800
              "
            >

              <img
                src={
                  post.author?.avatarUrl ||
                  "/avatar.png"
                }
                alt="Avatar"
                className="
                  w-8 h-8 rounded-full
                "
              />

              <span className="text-white font-semibold">
                {
                  post.author?.username ||
                  "User"
                }
              </span>

            </div>



            {/* CAPTION */}
            <div
              className="
                p-4
                border-b border-zinc-800
                text-sm text-gray-300
              "
            >

              <span
                className="
                  font-semibold
                  text-white mr-2
                "
              >
                {
                  post.author?.username ||
                  "User"
                }
              </span>

              {post.caption}

            </div>



            {/* COMMENTS */}
            <div
              className="
                flex-1
                overflow-y-auto
                p-4
                space-y-4
              "
            >

              {
                commentLoading ? (

                  <p className="text-gray-400 text-sm">
                    Loading comments...
                  </p>

                ) : comments.length === 0 ? (

                  <p className="text-gray-400 text-sm">
                    No comments yet
                  </p>

                ) : (

                  comments.map((comment) => (

                    <div
                      key={comment.id}
                      className="flex gap-3"
                    >

                      <img
                        src={
                          comment.user?.avatarUrl ||
                          "/avatar.png"
                        }
                        alt="Avatar"
                        className="
                          w-7 h-7 rounded-full
                        "
                      />


                      <p className="text-sm">

                        <span
                          className="
                            font-semibold
                            text-white mr-1
                          "
                        >
                          {
                            comment.user?.username ||
                            "User"
                          }
                        </span>


                        <span className="text-gray-300">
                          {comment.content}
                        </span>

                      </p>

                    </div>

                  ))

                )
              }

            </div>




            {/* ACTION */}
            <div
              className="
                border-t border-zinc-800
                p-4
                space-y-3
                relative
              "
            >


              <div className="flex justify-between">

                <div
                  className="
                    flex gap-4
                    text-white
                  "
                >

                  <Heart size={22}/>

                  <MessageCircle size={22}/>


                  <Smile
                    size={22}
                    onClick={() =>
                      setShowEmoji(
                        (prev)=>!prev
                      )
                    }
                    className="cursor-pointer"
                  />

                </div>


                <Bookmark size={22}/>

              </div>



              <p className="text-sm text-gray-400">
                ❤️ {post.likeCount || 0} likes
              </p>



              {
                showEmoji && (

                  <div
                    className="
                      absolute
                      bottom-20
                      right-4
                      z-20
                    "
                  >

                    <EmojiPicker
                      onEmojiClick={
                        handleEmojiClick
                      }
                    />

                  </div>

                )
              }




              <form
                onSubmit={handleAddComment}
                className="
                  flex gap-2
                "
              >

                <input
                  value={commentText}
                  onChange={(e)=>
                    setCommentText(
                      e.target.value
                    )
                  }
                  placeholder="Add comment..."
                  className="
                    flex-1
                    bg-zinc-800
                    px-3 py-2
                    rounded-md
                    text-sm
                    outline-none
                    text-white
                  "
                />


                <button
                  type="submit"
                  className="
                    text-blue-500
                    font-semibold
                    text-sm
                  "
                >
                  Post
                </button>


              </form>


            </div>


          </div>


        </div>


      </div>

    </div>
  );
}