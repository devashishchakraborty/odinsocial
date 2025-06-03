import {
  ActionDispatch,
  FormEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { Reply as ReplyType, Action } from "../types";
import SmallLoader from "./SmallLoader";
import Reply from "./Reply";

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
  const { getAuthHeaders } = useContext(AuthContext);
  const [replies, setReplies] = useState<ReplyType[] | null>(null);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  // For setting new replies added by user and separating them to not unnecessarily fetch all replies
  const [newReplies, setNewReplies] = useState<ReplyType[] | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      if (!showReplies) return;
      if (replies) return;

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
        setNewReplies(null);
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

      setNewReply("");

      if (showReplies) {
        setReplies((prev) => {
          if (!prev) return [data];
          return [data, ...prev];
        });
      } else {
        setNewReplies((prev) => {
          if (!prev) return [data];
          return [data, ...prev];
        });
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (error) return <section>{error}</section>;

  return (
    <>
      {repliesCount > 0 && (
        <div
          className="cursor-pointer px-4 text-sm font-bold text-gray-600 hover:text-gray-700"
          onClick={() => setShowReplies(!showReplies)}
        >
          {showReplies ? "Hide" : `View ${repliesCount}`} Replies
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
                {isSubmittingReply ? (
                  <SmallLoader className="px-3 py-0" />
                ) : (
                  "Reply"
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {showReplies ? (
        replies ? (
          replies.map((reply: ReplyType) => (
            <Reply reply={reply} setReplies={setReplies} />
          ))
        ) : (
          <SmallLoader />
        )
      ) : (
        newReplies &&
        newReplies.map((reply: ReplyType) => (
          <Reply reply={reply} setReplies={setNewReplies} />
        ))
      )}
    </>
  );
};

export default Replies;
