import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Explore = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <MainFeed />
    </main>
  );
};

export default Explore;
