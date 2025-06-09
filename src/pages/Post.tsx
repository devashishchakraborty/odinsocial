import Sidebar from "../components/Sidebar";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Post as PostType } from "../types";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { BookmarkIcon, HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon as LikeIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  ChatBubbleOvalLeftIcon as CommentIcon,
  ArrowPathRoundedSquareIcon as RepostIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import ComponentLoader from "../components/ComponentLoader";
import { formatDate } from "../utils/Utils";
import Comments from "../components/Comments";
import RightSideBar from "../components/RightSideBar";

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<PostType | null>(null);
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setPost(null);

      try {
        if (!parseInt(postId!)) {
          throw new Error("Page Not Found!");
        }

        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
          {
            method: "GET",
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Post Not Found!"
              : `HTTP error! Status: ${response.status}`,
          );
        }
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchPosts();
  }, []);

  const handlePostUpdate = async (
    isLiked: string | null = null,
    isBookmarked: string | null = null,
  ) => {
    // Optimistic UI changes
    setPost((post) => {
      if (!post) return post;

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

  return (
    <main className="flex min-h-full flex-1 px-30">
      <Sidebar selected={null} />
      <section className="flex max-w-xl flex-1 flex-col border-x-1 border-gray-400">
        <div className="flex items-center gap-2 px-4 py-2 text-xl font-bold text-sky-950">
          <Link to="/" className="rounded-full p-2 hover:bg-gray-200">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          Post
        </div>

        <section className="flex flex-col gap-4 px-4 py-2">
          {post ? (
            <>
              <section className="flex gap-2">
                <div className="flex flex-1 flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <Link to={`/user/${post.authorId}`}>
                      <img
                        src={post.author.profile.imageUrl || defaultPicture}
                        alt="profile picture"
                        className="h-10 w-10 min-w-max rounded-full"
                      />
                    </Link>
                    <div className="flex flex-col items-start gap-2">
                      <Link
                        to={`/user/${post.authorId}`}
                        className="flex flex-col leading-[1.2]"
                      >
                        <div className="font-bold hover:underline">
                          {post.author.name}
                        </div>
                        <div className="text-gray-600">{post.author.email}</div>
                      </Link>
                    </div>
                  </div>
                  <div className="text-lg">{post.content}</div>
                  <Link
                    to={`/post/${post.id}`}
                    className="text-gray-600 hover:underline"
                  >
                    {formatDate(post.createdAt)}
                  </Link>

                  <div className="flex items-center justify-between gap-2 border-y-1 border-gray-400 px-1 py-2 text-gray-600">
                    <div className="flex w-full items-center justify-between select-none">
                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-pink-700"
                        title="Like"
                      >
                        {post.likedBy.some((obj) => obj.id === user!.id) ? (
                          <LikeIcon
                            className="h-6 w-6 text-pink-600"
                            onClick={() => handlePostUpdate("false")}
                          />
                        ) : (
                          <LikeIconOutline
                            className="h-6 w-6"
                            onClick={() => handlePostUpdate("true")}
                          />
                        )}
                        {post.likedBy.length}
                      </div>

                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-sky-700"
                        title="Comment"
                      >
                        <CommentIcon className="h-6 w-6" />
                        {post.comments.length}
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-green-700"
                        title="Repost"
                      >
                        <RepostIcon className="h-6 w-6" /> 0
                      </div>
                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-sky-700"
                        title="Bookmark"
                      >
                        {post.bookmarkedBy.some(
                          (obj) => obj.id === user!.id,
                        ) ? (
                          <BookmarkIcon
                            className="h-6 w-6 text-sky-600 hover:text-sky-700"
                            onClick={() => handlePostUpdate(null, "false")}
                          />
                        ) : (
                          <BookmarkIconOutline
                            className="h-6 w-6 hover:text-sky-700"
                            onClick={() => handlePostUpdate(null, "true")}
                          />
                        )}
                        {post.bookmarkedBy.length}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : error ? (
            <div className="flex items-center justify-center font-bold">
              {error}
            </div>
          ) : (
            <ComponentLoader />
          )}
        </section>
        {post && <Comments postId={post.id} />}
      </section>
      <RightSideBar />
    </main>
  );
};

export default Post;
