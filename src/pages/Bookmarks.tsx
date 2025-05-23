import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Bookmarks = () => {
  return (
    <main className="px-30 flex h-full">
      <Sidebar selected="bookmarks"/>
      <MainFeed />
    </main>
  );
};

export default Bookmarks;
