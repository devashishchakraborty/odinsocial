import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
const Home = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="home" />
      <PostFeed />
    </main>
  );
};

export default Home;
