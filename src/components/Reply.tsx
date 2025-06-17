import { Dispatch, SetStateAction, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Reply as ReplyType } from "../types";
import { Link } from "react-router-dom";
import defaultPicture from "../assets/defaultPicture.png";
import { clipText, getTimeDifference } from "../utils/Utils";
import { HeartIcon as LikeIcon } from "@heroicons/react/24/solid";
import { HeartIcon as LikeIconOutline } from "@heroicons/react/24/outline";

const Reply = ({
  reply,
  setReplies,
}: {
  reply: ReplyType;
  setReplies: Dispatch<SetStateAction<ReplyType[] | null>>;
}) => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const diff = getTimeDifference(reply.createdAt);
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
        `${import.meta.env.VITE_API_BASE_URL}/comments/replies/${replyId}`,
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
    <section key={reply.id} className="flex gap-2 px-2 py-1">
      <Link to={`/user/${reply.authorId}`}>
        <img
          src={reply.author.profile.imageUrl || defaultPicture}
          alt="profile picture"
          className="h-10 w-10 min-w-10 rounded-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-col items-start">
          <Link to={`/user/${reply.authorId}`} className="flex flex-wrap gap-1">
            <div className="font-bold hover:underline">{clipText(reply.author.name)}</div>
            ·<div className="text-gray-600">{clipText(reply.author.email)}</div>·
            <div className="text-gray-600">{diff}</div>
          </Link>
          <div>{reply.text}</div>
        </div>

        <div className="flex items-center gap-10 text-gray-600 select-none">
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
};

export default Reply;
