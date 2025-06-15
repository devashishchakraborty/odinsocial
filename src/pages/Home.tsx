import Sidebar from "../components/Sidebar";
import MainFeed from "../components/MainFeed";
import RightSideBar from "../components/RightSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <>
      <Header />
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32 ">
        <Sidebar selected="home" />
        <MainFeed />
        <RightSideBar />
      </main>
      <Footer selected="home"/>
    </>
  );
};

export default Home;
