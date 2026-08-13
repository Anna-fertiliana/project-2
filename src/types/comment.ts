import { User } from "./user";

export interface Comment {
  id: string;
  content: string;

  user: User;

  createdAt: string;
  updatedAt?: string;
}