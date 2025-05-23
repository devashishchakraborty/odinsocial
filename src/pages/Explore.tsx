import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Explore = () => {
  return (
    <main className="px-30 flex h-full">
      <Sidebar selected="explore"/>
      <MainFeed />
    </main>
  );
};

export default Explore;
