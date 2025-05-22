import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Home = () => {
  return (
    <main className="px-30 flex h-full">
      <Sidebar />
      <MainFeed />
    </main>
  );
};

export default Home;
