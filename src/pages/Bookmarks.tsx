import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import RightSideBar from "../components/RightSideBar";
import Footer from "../components/Footer";
const Bookmarks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <>
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32 ">
      <Sidebar selected="bookmarks" />
        <section className="flex-1/10 sm:border-x-1 border-gray-400">
          <div className="flex items-center gap-4 p-4 text-2xl font-bold text-sky-950">
            <Link to="/" className="rounded-full p-2 hover:bg-gray-200">
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            Bookmarks
          </div>
          <div className="relative border-b-1 border-gray-400 p-4">
            <MagnifyingGlassIcon className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 text-gray-700" />
            <input
              id="search"
              name="search"
              type="text"
              placeholder="Search bookmarks"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-md w-full rounded-full bg-gray-200 py-2 pr-4 pl-11 outline-2 outline-gray-300 focus:bg-white"
            />
          </div>
          <Posts showBookmarks={true} searchQueryBookmarks={searchQuery} />
        </section>
        <RightSideBar />
      </main>
      <Footer selected="bookmarks"/>
    </>
  );
};

export default Bookmarks;
