import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import RightSideBar from "../components/RightSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Followers = () => {
  const { userId } = useParams();
  return (
    <>
      <Header />
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32">
        <Sidebar />
        <section className="max-w-xl flex-1/10 border-gray-400 sm:border-x-1">
          <div className="flex items-center gap-2 px-4 py-2 text-xl font-bold text-sky-950">
            <Link
              to={`/user/${userId}`}
              className="rounded-full p-2 hover:bg-gray-200"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            Followers
          </div>
          <Users type="followers" />
        </section>
        <RightSideBar />
      </main>
      <Footer/>
    </>
  );
};

export default Followers;
