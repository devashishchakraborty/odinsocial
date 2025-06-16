import Footer from "../components/Footer";
import Header from "../components/Header";
import RightSideBar from "../components/RightSideBar";
import Sidebar from "../components/Sidebar";
const Notifications = () => {
  return (
    <>
      <Header />
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32 ">
        <Sidebar selected="notifications" />
        <section className="flex flex-1/10 items-center justify-center sm:border-x-1 border-gray-400">
          This page is under construction!
        </section>
        <RightSideBar/>
      </main>
      <Footer selected="notifications" />
    </>
  );
};

export default Notifications;
