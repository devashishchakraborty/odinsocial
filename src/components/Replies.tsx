import { FormEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Reply } from "../types";
import { Link } from "react-router-dom";
import defaultPicture from "../assets/defaultPicture.png";
import { getTimeDifference } from "../utils/Utils";
import { HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import {
  HeartIcon as LikeIconOutline,
  ChatBubbleOvalLeftIcon as ReplyIcon,
} from "@heroicons/react/24/outline";
import PageLoader from "./PageLoader";


const Replies = ({
  commentId,
  showReplies = false,
}: {
  commentId: number;
  showReplies: boolean;
}) => {
  const { getAuthHeaders, user } = useContext(AuthContext);
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setReplies(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/posts/comments/${commentId}/replies`,
          {
            method: "GET",
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setReplies(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchComments();
  }, []);

  const addNewReply = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingReply(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/comments/${commentId}/replies`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ newReply }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setReplies((prev) => {
        if (!prev) return [data];
        return [data, ...prev];
      });
      setNewReply("");
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleReplyUpdate = async (
    replyId: number,
    isLiked: string | null = null,
  ) => {
    // Optimistic UI changes
    setReplies((replies) => {
      return replies!.map((reply) => {
        if (reply.id !== replyId) return reply;

        const updatedReply = { ...reply };

        if (isLiked === "true") {
          updatedReply.likedBy = [
            ...updatedReply.likedBy,
            { id: user!.id },
          ];
        } else if (isLiked === "false") {
          updatedReply.likedBy = updatedReply.likedBy.filter(
            (likedBy) => likedBy.id !== user!.id,
          );
        }

        return updatedReply;
      });
    });

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts/comments/replies/${replyId}`,
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
          onSubmit={addNewReply}
        >
          <textarea
            name="reply"
            id="reply"
            className="field-sizing-content flex-1 resize-none p-2 text-xl focus:outline-0"
            placeholder="Add your reply"
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="flex cursor-pointer items-center gap-2 rounded-4xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
            disabled={newReply.length === 0 || isSubmittingReply}
          >
            Reply
          </button>
        </form>
      </section>

      <section className="flex flex-col">
        {replies ? (
          replies.length === 0 ? (
            <div className="p-4 text-center">Be the first to comment!</div>
          ) : (
            replies.map((reply: Reply) => {
              const diff = getTimeDifference(reply.createdAt);
              return (
                <section
                  key={reply.id}
                  className="flex gap-2 border-b-1 border-gray-400 px-4 py-2"
                >
                  <Link to={`/${reply.authorId}`}>
                    <img
                      src={reply.author.profile.imageUrl || defaultPicture}
                      alt="profile picture"
                      className="h-10 w-10 min-w-max rounded-full"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-col items-start">
                      <Link to={`/${reply.authorId}`} className="flex gap-1">
                        <div className="font-bold hover:underline">
                          {reply.author.name}
                        </div>
                        ·
                        <div className="text-gray-600">
                          {reply.author.email}
                        </div>
                        ·<div className="text-gray-600">{diff}</div>
                      </Link>
                      <div>{reply.text}</div>
                    </div>

                    <div className="flex w-sm items-center gap-10 text-gray-600 select-none">
                      <div
                        className="flex cursor-pointer items-center gap-1 hover:text-pink-700"
                        title="Like"
                      >
                        {reply.likedBy.some((obj) => obj.id === user!.id) ? (
                          <LikeIcon
                            className="h-5 w-5 text-pink-600"
                            onClick={() =>
                              handleReplyUpdate(reply.id, "false")
                            }
                          />
                        ) : (
                          <LikeIconOutline
                            className="h-5 w-5"
                            onClick={() =>
                              handleReplyUpdate(reply.id, "true")
                            }
                          />
                        )}
                        {reply.likedBy.length}
                      </div>

                      <div
                        className="flex cursor-pointer items-center gap-1 rounded-2xl px-2 py-1 hover:bg-gray-200"
                        title="Reply"
                      >
                        <ReplyIcon
                          className="h-5 w-5"
                          onClick={() => handleReplyUpdate(reply.id)}
                        />
                        Reply
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
    </>
  );
};

export default Replies;
