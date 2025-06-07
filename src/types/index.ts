export interface User {
  id: number;
  email: string;
  name: string;
  createdAt?: Date;
  profile: {
    id: number;
    bio: string | null;
    imageUrl: string | null;
    userId: number;
  };
  followers?: { id: number }[];
  following?: { id: number }[];
}

export interface Post {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likedBy: { id: number }[];
  published: true;
  author: User;
  authorId: number;
  comments: { id: number }[];
  bookmarkedBy: { id: number }[];
}

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  post?: Post;
  postId: number;
  author: User;
  authorId: number;
  replies: { id: number }[];
  likedBy: { id: number }[];
}

export interface Reply {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  comment?: Comment;
  commentId: number;
  author: User;
  authorId: number;
  likedBy: { id: number }[];
}

export type Action =
  | { type: "SHOW"; commentId: number }
  | { type: "HIDE"; commentId: number };
