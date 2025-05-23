import { MouseEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getTimeDifference } from "../utils/Utils";
import MdiLikeOutline from "../icons/MdiLikeOutline";
import MdiLike from "../icons/MdiLike";
import MdiBookmarkOutline from "../icons/MdiBookmarkOutline";
import MdiBookmark from "../icons/MdiBookmark";

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
  likedBy: { id: number }[];
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
  bookmarkedBy: { id: number }[];
};

const MainFeed = () => {
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { refreshToken, decodeAndCheckExpiry, user } = useContext(AuthContext);
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
          },
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

  const handlePostUpdate = async (
    e: MouseEvent,
    postId: number,
    isLiked: string | null = null,
    isBookmarked: string | null = null,
  ) => {
    e.stopPropagation();
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const { isExpired } = decodeAndCheckExpiry(token);
    if (isExpired) {
      const token = await refreshToken();
      localStorage.setItem("auth_token", token);
    }

    setPosts((posts) => {
      return posts?.map((post) => {
        if (post.id !== postId) return post;

        const updatedPost = { ...post };

        if (isLiked === "true") {
          updatedPost.likedBy = [...post.likedBy, { id: user!.id }];
        } else if (isLiked === "false") {
          updatedPost.likedBy = post.likedBy.filter(
            (likedBy) => likedBy.id !== user!.id,
          );
        }

        if (isBookmarked === "true") {
          updatedPost.bookmarkedBy = [...post.bookmarkedBy, { id: user!.id }];
        } else if (isBookmarked === "false") {
          updatedPost.bookmarkedBy = post.bookmarkedBy.filter(
            (bookmarkedBy) => bookmarkedBy.id !== user!.id,
          );
        }

        return updatedPost;
      });
    });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify({ userId: user!.id, isLiked, isBookmarked }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  if (error) return <section>{error}</section>;
  return (
    <section className="w-2xl border-x-1 border-gray-400">
      <section className="flex border-b-1 border-gray-400">
        <div className="flex-1 border-r-1 border-gray-400 p-4 text-center transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200">
          All Posts
        </div>
        <div className="flex-1 p-4 text-center transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200">
          Following
        </div>
      </section>
      <section className="flex flex-col">
        {posts ? (
          posts.map((post: Post) => {
            const diff = getTimeDifference(post.createdAt);
            return (
              <section
                onClick={() => navigate(`/posts/${post.id}`)}
                key={post.id}
                className="flex gap-2 border-b-1 border-gray-400 p-4 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
              >
                <div onClick={(e) => handleUserClick(e, post.author.id)}>
                  <img
                    src={post.author.profile.imageUrl || defaultPicture}
                    alt="default profile"
                    className="h-10 w-10 min-w-max"
                  />
                </div>
                <div className="flex flex-col gap-2">
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
                  <div className="flex items-center gap-1 text-gray-600">
                    {post.likedBy.some((obj) => obj.id === user!.id) ? (
                      <MdiLike
                        className="h-5 w-5 text-sky-600 hover:text-sky-700"
                        onClick={(e) => handlePostUpdate(e, post.id, "false")}
                      />
                    ) : (
                      <MdiLikeOutline
                        className="h-5 w-5 hover:text-sky-700"
                        onClick={(e) => handlePostUpdate(e, post.id, "true")}
                      />
                    )}
                    {post.likedBy.length}

                    {post.bookmarkedBy.some((obj) => obj.id === user!.id) ? (
                      <MdiBookmark
                        className="h-5 w-5 text-sky-600 hover:text-sky-700"
                        onClick={(e) =>
                          handlePostUpdate(e, post.id, null, "false")
                        }
                      />
                    ) : (
                      <MdiBookmarkOutline
                        className="h-5 w-5 hover:text-sky-700"
                        onClick={(e) =>
                          handlePostUpdate(e, post.id, null, "true")
                        }
                      />
                    )}
                  </div>
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
