import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Messages = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="messages" />
      <MainFeed />
    </main>
  );
};

export default Messages;
