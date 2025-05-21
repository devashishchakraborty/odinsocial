import { Link } from "react-router-dom";
import MdiBird from "../icons/MdiBird";
import MdiHomeOutline from "../icons/MdiHomeOutline";
import MdiBookmarkOutline from "../icons/MdiBookmarkOutline";
import MdiEmailOutline from "../icons/MdiEmailOutline";
import MdiUserOutline from "../icons/MdiUserOutline";
import MdiSearch from "../icons/MdiSearch";
const Sidebar = () => {
  return (
    <section className="flex flex-col text-xl items-start">
      <Link
        to="/"
        className="flex items-center p-2 rounded-full hover:bg-gray-200"
      >
        <MdiBird className="h-12 w-12 text-sky-600" />
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        <MdiHomeOutline className="h-8 w-8" /> Home
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        <MdiSearch className="h-8 w-8" /> Explore
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        <MdiBookmarkOutline className="h-8 w-8" /> Bookmarks
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        <MdiEmailOutline className="h-8 w-8" /> Messages
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        <MdiUserOutline className="h-8 w-8" /> Profile
      </Link>
    </section>
  );
};

export default Sidebar;
