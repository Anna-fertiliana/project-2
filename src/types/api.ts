import type { Post } from "./post";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FeedResponse {
  posts: Post[];
}

export interface PostResponse {
  data: Post;
}