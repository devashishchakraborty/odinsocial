import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
const Messages = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="messages" />
      <PostFeed />
    </main>
  );
};

export default Messages;
