import { MouseEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getTimeDifference } from "../utils/Utils";
import { Post } from "../types";
import {
  BookmarkIcon,
  HandThumbUpIcon as LikeIcon,
} from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon as LikeIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  ChatBubbleOvalLeftIcon as CommentIcon,
  ArrowPathRoundedSquareIcon as RepostIcon,
} from "@heroicons/react/24/outline";

const Posts = ({
  showFollowingPosts,
  userId,
}: {
  showFollowingPosts?: boolean;
  userId?: number;
}) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const { decodeAndCheckExpiry, refreshToken, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(null);
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const { isExpired } = decodeAndCheckExpiry(token);
      if (isExpired) {
        const token = await refreshToken();
        localStorage.setItem("auth_token", token);
      }

      try {
        const filter: string = userId
          ? `userId=${userId}`
          : `following=${showFollowingPosts}`;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts?${filter}`,
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
  }, [showFollowingPosts]);

  const handleUserClick = (e: MouseEvent, authorId: number) => {
    e.stopPropagation(); // Prevent parent <Link> navigation
    navigate(`/${authorId}`);
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

    // Optimistic UI changes
    setPosts((posts) => {
      return posts!.map((post) => {
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
    <section className="flex flex-col">
      {posts ? (
        posts.length === 0 ? (
          <div className="p-4 text-center">No Posts Found!</div>
        ) : (
          posts.map((post: Post) => {
            const diff = getTimeDifference(post.createdAt);
            return (
              <section
                onClick={() => navigate(`/posts/${post.id}`)}
                key={post.id}
                className="flex gap-2 border-b-1 border-gray-400 px-4 py-2 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
              >
                <div onClick={(e) => handleUserClick(e, post.author.id)}>
                  <img
                    src={post.author.profile.imageUrl || defaultPicture}
                    alt="profile picture"
                    className="h-10 w-10 min-w-max"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col items-start">
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

                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex w-sm items-center justify-between gap-10 select-none">
                      <div
                        className="flex items-center gap-1 hover:text-pink-700"
                        title="Like"
                      >
                        {post.likedBy.some((obj) => obj.id === user!.id) ? (
                          <LikeIcon
                            className="h-5 w-5 text-pink-600"
                            onClick={(e) =>
                              handlePostUpdate(e, post.id, "false")
                            }
                          />
                        ) : (
                          <LikeIconOutline
                            className="h-5 w-5"
                            onClick={(e) =>
                              handlePostUpdate(e, post.id, "true")
                            }
                          />
                        )}
                        {post.likedBy.length}
                      </div>

                      <div
                        className="flex items-center gap-1 hover:text-sky-700"
                        title="Comment"
                      >
                        <CommentIcon
                          className="h-5 w-5"
                          onClick={(e) => handlePostUpdate(e, post.id)}
                        />
                        {post.comments.length}
                      </div>
                      <div
                        className="flex items-center gap-1 hover:text-green-700"
                        title="Repost"
                      >
                        <RepostIcon
                          className="h-5 w-5"
                          onClick={(e) => handlePostUpdate(e, post.id)}
                        />
                        {post.comments.length}
                      </div>
                    </div>

                    {post.bookmarkedBy.some((obj) => obj.id === user!.id) ? (
                      <BookmarkIcon
                        className="h-5 w-5 text-sky-600 hover:text-sky-700"
                        onClick={(e) =>
                          handlePostUpdate(e, post.id, null, "false")
                        }
                      />
                    ) : (
                      <BookmarkIconOutline
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
        )
      ) : (
        <PageLoader />
      )}
    </section>
  );
};

export default Posts;
