import { FormEvent, useContext, useState } from "react";
import Posts from "./Posts";
import SmallLoader from "./SmallLoader";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";

const MainFeed = () => {
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [newPost, setNewPost] = useState("");
  const [error, setError] = useState(null);

  const addNewPost = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingPost(true);
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/posts`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({ content: newPost }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setNewPost("");
      window.location.reload();
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <section className="w-2xl border-x-1 border-gray-400">
      <section className="flex border-b-1 border-gray-400">
        <div
          className={`relative flex-1 border-r-1 border-gray-400 p-4 ${showFollowingPosts || "font-bold"} text-center transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200`}
          onClick={() => setShowFollowingPosts(false)}
        >
          All Posts
          {showFollowingPosts || (
            <div className="absolute bottom-0.5 left-1/2 h-1 w-15 -translate-x-1/2 rounded-full bg-sky-900"></div>
          )}
        </div>
        <div
          className={`relative flex-1 p-4 text-center ${showFollowingPosts && "font-bold"} transition-colors duration-200 hover:cursor-pointer hover:bg-gray-200`}
          onClick={() => setShowFollowingPosts(true)}
        >
          Following
          {showFollowingPosts && (
            <div className="absolute bottom-0.5 left-1/2 h-1 w-15 -translate-x-1/2 rounded-full bg-sky-900"></div>
          )}
        </div>
      </section>
      <section className="flex gap-2 border-b-1 border-gray-400 p-4">
        <Link to={`/user/${user!.id}`}>
          <img
            src={user!.profile.imageUrl || defaultPicture}
            alt="profile picture"
            className="h-10 w-10 min-w-max rounded-full"
          />
        </Link>

        <form action="#" className="flex flex-col flex-1" onSubmit={(e) => addNewPost(e)}>
          <textarea
            name="post"
            id="post"
            className="field-sizing-content flex-1 resize-none p-2 text-xl focus:outline-0"
            placeholder="Write your post here"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="flex cursor-pointer items-center self-end gap-2 rounded-4xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
            disabled={newPost.length === 0 || isSubmittingPost}
          >
            {isSubmittingPost ? <SmallLoader className="px-6 py-0" /> : "Post"}
          </button>
        </form>
        {error && <section>{error}</section>}
      </section>

      <Posts showFollowingPosts={showFollowingPosts} />
    </section>
  );
};

export default MainFeed;
