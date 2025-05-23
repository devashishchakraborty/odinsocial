import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Profile = () => {
  return (
    <main className="px-30 flex h-full">
      <Sidebar selected="profile"/>
      <MainFeed />
    </main>
  );
};

export default Profile;
