export interface User {
  id: number;
  email: string;
  name: string;
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
  comments: { id: number }[];
  bookmarkedBy: { id: number }[];
}
