import { Link } from "react-router-dom";
import MdiBird from "../icons/MdiBird";
import MdiHomeOutline from "../icons/MdiHomeOutline";
import MdiBookmarkOutline from "../icons/MdiBookmarkOutline";
import MdiEmailOutline from "../icons/MdiEmailOutline";
import MdiUserOutline from "../icons/MdiUserOutline";
import MdiSearch from "../icons/MdiSearch";
import MdiHome from "../icons/MdiHome";
import MdiSearchDarker from "../icons/MdiSearchDarker";
import MdiBookmark from "../icons/MdiBookmark";
import MdiEmail from "../icons/MdiEmail";
import MdiUser from "../icons/MdiUser";
const Sidebar = ({ selected }: { selected: string }) => {
  return (
    <section className="flex flex-col text-xl items-start w-3xs">
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
        {selected === "home" ? (
          <>
            <MdiHome className="h-8 w-8" /> <b>Home</b>
          </>
        ) : (
          <>
            <MdiHomeOutline className="h-8 w-8" /> Home
          </>
        )}
      </Link>
      <Link
        to="/explore"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        {selected === "explore" ? (
          <>
            <MdiSearchDarker className="h-8 w-8" /> <b>Explore</b>
          </>
        ) : (
          <>
            <MdiSearch className="h-8 w-8" /> Explore
          </>
        )}
      </Link>
      <Link
        to="/bookmarks"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        {selected === "bookmarks" ? (
          <>
            <MdiBookmark className="h-8 w-8" /> <b>Bookmarks</b>
          </>
        ) : (
          <>
            <MdiBookmarkOutline className="h-8 w-8" /> Bookmarks
          </>
        )}
      </Link>
      <Link
        to="/messages"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        {selected === "messages" ? (
          <>
            <MdiEmail className="h-8 w-8" /> <b>Messages</b>
          </>
        ) : (
          <>
            <MdiEmailOutline className="h-8 w-8" /> Messages
          </>
        )}
      </Link>
      <Link
        to="/1"
        className="flex items-center gap-3 text-sky-950 py-2 px-4 hover:bg-gray-200 rounded-4xl"
      >
        {selected === "profile" ? (
          <>
            <MdiUser className="h-8 w-8" /> <b>Profile</b>
          </>
        ) : (
          <>
            <MdiUserOutline className="h-8 w-8" /> Profile
          </>
        )}
      </Link>
    </section>
  );
};

export default Sidebar;
