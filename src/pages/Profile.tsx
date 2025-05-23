import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Profile = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="profile" />
      <MainFeed />
    </main>
  );
};

export default Profile;
