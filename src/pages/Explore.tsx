import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <section className="w-2xl border-x-1 border-gray-400 p-4">
        <form className="relative mb-4 w-full">
          <MagnifyingGlassIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-700" />
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-md w-full rounded-full bg-gray-200 py-2 pr-4 pl-11 outline-2 outline-gray-300 focus:bg-white"
          />
        </form>
      </section>
    </main>
  );
};

export default Explore;
