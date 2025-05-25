import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Notifications = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="notifications" />
      <MainFeed />
    </main>
  );
};

export default Notifications;
