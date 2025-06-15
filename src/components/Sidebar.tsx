import { Link } from "react-router-dom";

import {
  HomeIcon as HomeIconOutline,
  MagnifyingGlassCircleIcon as ExploreIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  EnvelopeIcon as MessagesIconOutline,
  UserCircleIcon as ProfileIconOutline,
  BellIcon as NotificationIconOutline,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MagnifyingGlassCircleIcon as ExploreIcon,
  BookmarkIcon,
  EnvelopeIcon as MessagesIcon,
  UserCircleIcon as ProfileIcon,
  BellIcon as NotificationIcon,
} from "@heroicons/react/24/solid";
import Fa6SolidDragon from "../assets/OdinSocial";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ selected = null }: { selected?: string | null }) => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div className="sticky top-0 hidden h-screen overflow-y-auto sm:block px-4">
      <section className="flex h-full xl:w-3xs flex-col items-start text-xl">
        <Link
          to="/"
          className="flex items-center gap-2 p-4 font-['Cinzel'] text-2xl font-black text-sky-800"
        >
          <Fa6SolidDragon className="h-8 w-8" />
          <span className="hidden md:block">OdinSocial</span>
        </Link>
        <Link
          to="/"
          className={`flex items-center gap-3 ${selected === "home" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "home" ? (
            <HomeIcon className="h-8 w-8" />
          ) : (
            <HomeIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Home</span>
        </Link>
        <Link
          to="/explore"
          className={`flex items-center gap-3 ${selected === "explore" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "explore" ? (
            <ExploreIcon className="h-8 w-8" />
          ) : (
            <ExploreIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Explore</span>
        </Link>
        <Link
          to="/notifications"
          className={`flex items-center gap-3 ${selected === "notifications" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "notifications" ? (
            <NotificationIcon className="h-8 w-8" />
          ) : (
            <NotificationIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Notifications</span>
        </Link>
        <Link
          to="/bookmarks"
          className={`flex items-center gap-3 ${selected === "bookmarks" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "bookmarks" ? (
            <BookmarkIcon className="h-8 w-8" />
          ) : (
            <BookmarkIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Bookmarks</span>
        </Link>
        <Link
          to="/messages"
          className={`flex items-center gap-3 ${selected === "messages" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "messages" ? (
            <MessagesIcon className="h-8 w-8" />
          ) : (
            <MessagesIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Messages</span>
        </Link>
        <Link
          to={`/user/${user!.id}`}
          className={`flex items-center gap-3 ${selected === "profile" && "font-bold"} rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200`}
        >
          {selected === "profile" ? (
            <ProfileIcon className="h-8 w-8" />
          ) : (
            <ProfileIconOutline className="h-8 w-8" />
          )}
          <span className="hidden md:block">Profile</span>
        </Link>

        <button
          onClick={() => logout()}
          className="mt-auto mb-4 flex cursor-pointer items-center gap-3 rounded-4xl px-4 py-2 text-pink-600 transition-colors duration-200 hover:bg-pink-600 hover:text-white"
        >
          <ArrowLeftStartOnRectangleIcon className="h-8 w-8" />
          <span className="hidden md:block">Logout</span>
        </button>
      </section>
    </div>
  );
};

export default Sidebar;
