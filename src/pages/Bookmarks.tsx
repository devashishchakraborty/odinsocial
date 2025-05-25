import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
const Bookmarks = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="bookmarks" />
      <PostFeed />
    </main>
  );
};

export default Bookmarks;
