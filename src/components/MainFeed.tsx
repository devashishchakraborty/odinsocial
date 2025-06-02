import { useState } from "react";
import Posts from "./Posts";

const MainFeed = () => {
  const [showFollowingPosts, setShowFollowingPosts] = useState(false);

  return (
    <section className="border-x-1 border-gray-400 w-2xl">
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
      <Posts showFollowingPosts={showFollowingPosts}/>
    </section>
  );
};

export default MainFeed;
