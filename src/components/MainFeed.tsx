import { MouseEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { Link, useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getTimeDifference } from "../utils/Utils";

type User = {
  id: number;
  email: string;
  name: string;
  profile: {
    id: number;
    bio: string | null;
    imageUrl: string | null;
    userId: number;
  };
};

type Post = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  likes: number;
  published: true;
  author: User;
  authorId: number;
  parentPostId: number | null;
  parentPost: Post | null;
  replies: Post[];
  RootPostId: number | null;
  RootPost: Post | null;
  thread: Post[];
  isThread: boolean;
  bookmarkedBy: User[];
};

const MainFeed = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshToken, decodeAndCheckExpiry } = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const { isExpired } = decodeAndCheckExpiry(token);
      if (isExpired) {
        const token = await refreshToken();
        localStorage.setItem("auth_token", token);
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  const handleUserClick = (e: MouseEvent, authorId: number) => {
    e.stopPropagation(); // Prevent parent <Link> navigation
    navigate(`/profile/${authorId}`);
  };

  if (error) return <section>{error}</section>;
  return (
    <section className="border-x-1 border-gray-400 w-2xl">
      <section className="flex border-b-1 border-gray-400">
        <div className="p-4 text-center hover:bg-gray-200 flex-1 border-r-1 border-gray-400 hover:cursor-pointer">
          All Posts
        </div>
        <div className="p-4 text-center hover:bg-gray-200 flex-1 hover:cursor-pointer">
          Following
        </div>
      </section>
      <section className="h-full">
        {posts ? (
          posts.map((post: Post) => {
            const diff = getTimeDifference(post.createdAt)
            return (
              <section
                onClick={() => navigate(`/posts/${post.id}`)}
                key={post.id}
                className="flex gap-2 p-4 border-b-1 border-gray-400 hover:cursor-pointer hover:bg-gray-100"
              >
                <div onClick={(e) => handleUserClick(e, post.author.id)}>
                  <img
                    src={post.author.profile.imageUrl || defaultPicture}
                    alt="default profile"
                    className="h-10 w-10"
                  />
                </div>

                <div>
                  <div
                    className="flex gap-1"
                    onClick={(e) => handleUserClick(e, post.author.id)}
                  >
                    <div className="font-bold hover:underline">
                      {post.author.name}
                    </div>
                    ·<div className="text-gray-800">{post.author.email}</div>·
                    <div className="text-gray-800">{diff}</div>
                  </div>
                  <div>{post.content}</div>
                </div>
              </section>
            );
          })
        ) : (
          <PageLoader />
        )}
      </section>
    </section>
  );
};

export default MainFeed;
