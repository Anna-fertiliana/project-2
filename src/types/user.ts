export interface User {
  id: number;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl: string | null;
}

export interface FollowUser extends User {
  isFollowedByMe: boolean;
}