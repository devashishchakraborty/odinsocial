import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
import RightSideBar from "../components/RightSideBar";
const Home = () => {
  return (
    <main className="flex flex-1 min-h-full px-30">
      <Sidebar selected="home" />
      <MainFeed />
      <RightSideBar/>
    </main>
  );
};

export default Home;
