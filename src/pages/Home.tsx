import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Home = () => {
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="home" />
      <MainFeed />
    </main>
  );
};

export default Home;
