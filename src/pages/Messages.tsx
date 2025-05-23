import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Messages = () => {
  return (
    <main className="px-30 flex h-full">
      <Sidebar selected="messages"/>
      <MainFeed />
    </main>
  );
};

export default Messages;
