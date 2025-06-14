import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import RightSideBar from "../components/RightSideBar";
const Bookmarks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="bookmarks" />
      <section className="w-xl border-x-1 border-gray-400">
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
  );
};

export default Bookmarks;
