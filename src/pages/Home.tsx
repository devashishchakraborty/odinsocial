import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
const Home = () => {
  return (
    <main className="px-40 flex">
      <Sidebar />
      <MainFeed />
    </main>
  );
};

export default Home;
