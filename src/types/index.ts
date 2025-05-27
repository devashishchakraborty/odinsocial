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
  _count?: {
    followers: number;
    following: number;
  };
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
  comments: Comment[];
  bookmarkedBy: { id: number }[];
}

export interface Comment {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  post?: Post;
  postId: number;
  replies?: Reply[];
}

export interface Reply {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  text: string;
  comment?: Comment;
  commentId: number;
}
