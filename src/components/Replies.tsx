import {
  ActionDispatch,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { Reply, Action } from "../types";
import { Link } from "react-router-dom";
import defaultPicture from "../assets/defaultPicture.png";
import { getTimeDifference } from "../utils/Utils";
import { HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import { HeartIcon as LikeIconOutline } from "@heroicons/react/24/outline";
import ComponentLoader from "./ComponentLoader";
import SmallLoader from "./SmallLoader";

// Taking the commentIds from those parent Comments component where the form input to take reply would be visible
const Replies = ({
  commentId,
  repliesCount,
  showReplyForm,
  setShowReplyForm,
}: {
  commentId: number;
  repliesCount: number;
  showReplyForm: boolean;
  setShowReplyForm: ActionDispatch<[action: Action]>;
}) => {
  const { getAuthHeaders, user } = useContext(AuthContext);
  const [_repliesCount, setRepliesCount] = useState(repliesCount);
  const [replies, setReplies] = useState<Reply[] | null>(null);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!showReplies) return;
      if (replies) return replies;

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/replies`,
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
    fetchReplies();
  }, [showReplies]);

  const addNewReply = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingReply(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/replies`,
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

  // For liking replies
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
          updatedReply.likedBy = [...updatedReply.likedBy, { id: user!.id }];
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
      {_repliesCount > 0 && (
        <div
          className="cursor-pointer px-4 text-sm font-bold text-gray-600 hover:text-gray-700"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "Hide" : `View ${_repliesCount}`} Replies
        </div>
      )}

      {showReplyForm && (
        <section className="flex gap-2 px-4 pt-2 pb-4">
          <form
            action="#"
            className="relative flex flex-1 flex-col"
            onSubmit={addNewReply}
          >
            <textarea
              name="reply"
              id="reply"
              className="field-sizing-content flex-1 resize-none rounded-2xl p-2 pb-12 outline-2 outline-gray-300 focus:outline-gray-400"
              placeholder="Add your reply"
              value={newReply}
              onChange={(e) =>
                e.target.value.length < 120 && setNewReply(e.target.value)
              }
              required
            ></textarea>
            <div className="absolute right-2 bottom-2 flex gap-2 self-end">
              <button
                type="reset"
                className="flex cursor-pointer items-center gap-2 rounded-4xl bg-gray-600 px-3 py-1 font-bold text-white hover:bg-gray-700 disabled:cursor-default disabled:bg-gray-400"
                onClick={() => {
                  setNewReply("");
                  setShowReplyForm({ commentId, type: "HIDE" });
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex cursor-pointer items-center gap-2 rounded-4xl bg-sky-600 px-3 py-1 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
                disabled={newReply.length === 0 || isSubmittingReply}
              >
                Reply
              </button>
            </div>
          </form>
        </section>
      )}

      {showReplies && (replies 
        ? replies.map((reply: Reply) => {
            const diff = getTimeDifference(reply.createdAt);
            return (
              <section key={reply.id} className="flex gap-2 px-2 py-1">
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
                      ·<div className="text-gray-600">{reply.author.email}</div>
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
                          onClick={() => handleReplyUpdate(reply.id, "false")}
                        />
                      ) : (
                        <LikeIconOutline
                          className="h-5 w-5"
                          onClick={() => handleReplyUpdate(reply.id, "true")}
                        />
                      )}
                      {reply.likedBy.length}
                    </div>
                  </div>
                </div>
              </section>
            );
          })
        : <SmallLoader/>)}
    </>
  );
};

export default Replies;
