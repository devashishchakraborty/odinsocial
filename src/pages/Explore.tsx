import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import Users from "../components/Users";
import { useRef, useState } from "react";
const Explore = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex h-full px-30">
      <Sidebar selected="explore" />
      <section className="w-xl border-x-1 border-gray-400">
        <form
          className="relative w-full p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const value = inputRef.current!.value || "";
            if (value.length > 0) setQuery(value);
          }}
        >
          <MagnifyingGlassIcon className="absolute top-1/2 left-8 h-5 w-5 -translate-y-1/2 text-gray-700" />
          <input
            ref={inputRef}
            id="search"
            name="search"
            type="text"
            placeholder="Search on OdinSocial"
            className="text-md w-full rounded-full bg-gray-200 py-2 pr-4 pl-11 outline-2 outline-gray-300 focus:bg-white"
          />
        </form>
        {query && (
          <>
            <div className="px-4 text-2xl font-bold text-sky-900">People</div>
            <Users searchQuery={query} />

            <div className="px-4 text-2xl font-bold text-sky-900">Posts</div>
            <Posts searchQueryAll={query} />
          </>
        )}
      </section>
    </main>
  );
};

export default Explore;
