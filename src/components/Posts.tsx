import { MouseEvent, useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { useNavigate } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getTimeDifference } from "../utils/Utils";
import { Post } from "../types";
import { BookmarkIcon, HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import { clipText } from "../utils/Utils";
import {
  HeartIcon as LikeIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  ChatBubbleOvalLeftIcon as CommentIcon,
  ArrowPathRoundedSquareIcon as RepostIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// Using this component for multiple use cases like bookmarks, following Posts, user posts etc.
const Posts = ({
  showFollowingPosts,
  userId,
  showBookmarks,
  searchQueryBookmarks,
  newPosts = null,
  searchQueryAll,
}: {
  showFollowingPosts?: boolean;
  userId?: number;
  showBookmarks?: boolean;
  searchQueryBookmarks?: string;
  newPosts?: Post[] | null;
  searchQueryAll?: string;
}) => {
  const { getAuthHeaders, user } = useContext(AuthContext);

  // To add newly created posts by the current user.
  const [posts, setPosts] = useState<Post[] | null>(newPosts);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const filteredPosts = useMemo(() => {
    if (searchQueryBookmarks && showBookmarks && posts) {
      return posts.filter((post) =>
        post.content.toLowerCase().includes(searchQueryBookmarks.toLowerCase()),
      );
    }
    return posts;
  }, [posts, searchQueryBookmarks, showBookmarks]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (newPosts && posts) {
        setPosts([...newPosts, ...posts]);
        return;
      }
      setPosts(null);

      try {
        // Applying different filters based on the page user has opened
        let filter = "";
        if (userId) filter = `userId=${userId}`;
        else if (showBookmarks) filter = `showBookmarks=${showBookmarks}`;
        else if (showFollowingPosts) filter = `following=${showFollowingPosts}`;
        else if (searchQueryAll) filter = `search=${searchQueryAll}`;

        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts?${filter}`,
          {
            method: "GET",
            headers: headers,
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
  }, [showFollowingPosts, newPosts, searchQueryAll]);

  const handleUserClick = (e: MouseEvent, authorId: number) => {
    e.stopPropagation(); // Prevent parent <Link> navigation
    navigate(`/user/${authorId}`);
  };

  const handlePostUpdate = async (
    e: MouseEvent,
    postId: number,
    isLiked: string | null = null,
    isBookmarked: string | null = null,
  ) => {
    e.stopPropagation();

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
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ isLiked, isBookmarked }),
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
      {filteredPosts ? (
        filteredPosts.length === 0 ? (
          <div className="p-4 text-center">No Posts Found!</div>
        ) : (
          filteredPosts.map((post: Post) => {
            const diff = getTimeDifference(post.createdAt);
            return (
              <section
                onClick={() => navigate(`/post/${post.id}`)}
                key={post.id}
                className="flex w-full gap-2 border-b-1 border-gray-400 px-4 py-2 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
              >
                <div onClick={(e) => handleUserClick(e, post.author.id)}>
                  <img
                    src={post.author.profile.imageUrl || defaultPicture}
                    alt="profile picture"
                    className="h-10 w-10 min-w-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex flex-col items-start">
                    <div
                      className="flex gap-1"
                      onClick={(e) => handleUserClick(e, post.author.id)}
                    >
                      <div className="font-bold hover:underline">
                        {clipText(post.author.name)}
                      </div>
                      ·<div className="text-gray-600">{clipText(post.author.email)}</div>·
                      <div className="text-gray-600">{diff}</div>
                    </div>
                    <div>{post.content}</div>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-gray-600">
                    <div className="flex w-full items-center justify-between gap-5 select-none">
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
                        <CommentIcon className="h-5 w-5" />
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
                        0
                      </div>
                      <div
                        className="flex items-center gap-1 hover:text-sky-700"
                        title="Engagement"
                      >
                        <ChartBarIcon className="h-5 w-5" />
                      </div>
                      <div>
                        {post.bookmarkedBy.some(
                          (obj) => obj.id === user!.id,
                        ) ? (
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
