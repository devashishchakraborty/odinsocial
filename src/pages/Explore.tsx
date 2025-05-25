import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
const Explore = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <PostFeed />
    </main>
  );
};

export default Explore;
