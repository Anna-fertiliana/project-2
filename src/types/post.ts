import { User } from "./user";
import { Comment } from "./comment";

export interface Post {
  id: string;
  caption: string;
  imageUrl: string;

  author: User;

  likeCount: number;
  commentCount: number;

  likedByMe: boolean;
  savedByMe: boolean;

  comments?: Comment[];

  createdAt: string;
  updatedAt?: string;
}