import Sidebar from "../components/Sidebar";
import PostFeed from "../components/PostFeed";
const Notifications = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="notifications" />
      <PostFeed />
    </main>
  );
};

export default Notifications;
