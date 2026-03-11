import LikeButton from "@/components/LikeButton";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

type PostCardProps = {
  postId: string;
  image: string;
  caption: string;
  username: string;
  avatar: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
};

export default function PostCard({
  postId,
  image,
  caption,
  username,
  avatar,
  likes,
  comments,
  isLiked = false,
}: PostCardProps) {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={avatar || "/avatar-placeholder.png"}
          alt={username}
          className="w-9 h-9 rounded-full object-cover"
        />

        <span className="text-white font-semibold text-sm">
          {username}
        </span>
      </div>

      {/* Post Image */}
      <Link href={`/posts/${postId}`}>
        <img
          src={image}
          alt={caption}
          className="w-full h-[320px] object-cover cursor-pointer"
        />
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">

        {/* Actions */}
        <div className="flex items-center gap-4">
          
          <LikeButton
            postId={postId}
            initialLiked={isLiked}
            initialCount={likes}
          />

          <Link
            href={`/posts/${postId}`}
            className="flex items-center gap-1 text-gray-400 hover:text-white"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{comments}</span>
          </Link>

        </div>

        {/* Caption */}
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-white">
            {username}
          </span>{" "}
          {caption}
        </p>

      </div>
    </div>
  );
}