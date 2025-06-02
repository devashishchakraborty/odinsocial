import { FormEvent, useContext, useEffect, useReducer, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { Link } from "react-router-dom";
import PageLoader from "./PageLoader";
import { getTimeDifference } from "../utils/Utils";
import { Action, Comment } from "../types";
import { HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon as LikeIconOutline,
  ChatBubbleOvalLeftIcon as ReplyIcon,
} from "@heroicons/react/24/outline";
import Replies from "./Replies";

const reducer = (state: number[], action: Action): number[] => {
  switch (action.type) {
    case "SHOW":
      return [...state, action.commentId];
    case "HIDE":
      return state.filter((id) => id !== action.commentId);
    default:
      return state;
  }
};

const Comments = ({ postId }: { postId: number }) => {
  const { getAuthHeaders, user } = useContext(AuthContext);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // To set the comment Ids for visibility of reply input form under a comment
  const [showReplyFormIds, replyFormDispatch] = useReducer(reducer, []);

  useEffect(() => {
    const fetchComments = async () => {
      setComments(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
          {
            method: "GET",
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchComments();
  }, []);

  const addNewComment = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingComment(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ newComment }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setComments((prev) => {
        if (!prev) return [data];
        return [data, ...prev];
      });
      setNewComment("");
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentUpdate = async (
    commentId: number,
    isLiked: string | null = null,
  ) => {
    // Optimistic UI changes
    setComments((comments) => {
      return comments!.map((comment) => {
        if (comment.id !== commentId) return comment;

        const updatedComment = { ...comment };

        if (isLiked === "true") {
          updatedComment.likedBy = [
            ...updatedComment.likedBy,
            { id: user!.id },
          ];
        } else if (isLiked === "false") {
          updatedComment.likedBy = updatedComment.likedBy.filter(
            (likedBy) => likedBy.id !== user!.id,
          );
        }

        return updatedComment;
      });
    });

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ isLiked }),
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
    <>
      <section className="flex gap-2 border-b-1 border-gray-400 px-4 pt-2 pb-4">
        <Link to={`/${user!.id}`}>
          <img
            src={user!.profile.imageUrl || defaultPicture}
            alt="profile picture"
            className="h-10 w-10 min-w-max rounded-full"
          />
        </Link>

        <form
          action="#"
          className="flex flex-1 items-end"
          onSubmit={addNewComment}
        >
          <textarea
            name="comment"
            id="comment"
            className="field-sizing-content flex-1 resize-none p-2 text-xl focus:outline-0"
            placeholder="Add your comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 rounded-4xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
            disabled={newComment.length === 0 || isSubmittingComment}
          >
            Comment
          </button>
        </form>
      </section>

      <section className="flex flex-col">
        {comments ? (
          comments.length === 0 ? (
            <div className="p-4 text-center">Be the first to comment!</div>
          ) : (
            comments.map((comment: Comment) => {
              const diff = getTimeDifference(comment.createdAt);
              return (
                <section
                  key={comment.id}
                  className="flex gap-2 border-b-1 border-gray-400 px-4 py-2"
                >
                  <Link to={`/${comment.authorId}`}>
                    <img
                      src={comment.author.profile.imageUrl || defaultPicture}
                      alt="profile picture"
                      className="h-10 w-10 min-w-max rounded-full"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col items-start">
                      <Link to={`/${comment.authorId}`} className="flex gap-1">
                        <div className="font-bold hover:underline">
                          {comment.author.name}
                        </div>
                        ·
                        <div className="text-gray-600">
                          {comment.author.email}
                        </div>
                        ·<div className="text-gray-600">{diff}</div>
                      </Link>
                      <div>{comment.text}</div>
                    </div>

                    <div className="flex w-sm items-center gap-10 text-gray-600 select-none">
                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-pink-700"
                        title="Like"
                      >
                        {comment.likedBy.some((obj) => obj.id === user!.id) ? (
                          <LikeIcon
                            className="h-5 w-5 text-pink-600"
                            onClick={() =>
                              handleCommentUpdate(comment.id, "false")
                            }
                          />
                        ) : (
                          <LikeIconOutline
                            className="h-5 w-5"
                            onClick={() =>
                              handleCommentUpdate(comment.id, "true")
                            }
                          />
                        )}
                        {comment.likedBy.length}
                      </div>

                      <div
                        className="flex cursor-pointer items-center gap-1 rounded-2xl px-2 py-1 hover:bg-gray-200"
                        title="Reply"
                        onClick={() =>
                          replyFormDispatch({
                            commentId: comment.id,
                            type: "SHOW",
                          })
                        }
                      >
                        <ReplyIcon className="h-5 w-5" />
                        Reply
                      </div>
                    </div>
                    {/* Showing replies based on the comment Id and whether the user wants to view them by passing appropriate state props and dispatch function for state changes */}
                    <Replies
                      commentId={comment.id}
                      showReplyForm={showReplyFormIds.includes(comment.id)}
                      setShowReplyForm={replyFormDispatch}
                      repliesCount={comment.replies.length}
                    />
                  </div>
                </section>
              );
            })
          )
        ) : (
          <PageLoader />
        )}
      </section>
    </>
  );
};

export default Comments;
