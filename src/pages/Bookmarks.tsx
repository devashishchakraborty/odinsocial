import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Bookmarks = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="bookmarks" />
      <MainFeed />
    </main>
  );
};

export default Bookmarks;
