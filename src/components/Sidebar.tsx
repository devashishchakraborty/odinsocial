import { Link } from "react-router-dom";

import {
  HomeIcon as HomeIconOutline,
  MagnifyingGlassCircleIcon as ExploreIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  EnvelopeIcon as MessagesIconOutline,
  UserCircleIcon as ProfileIconOutline,
  BellIcon as NotificationIconOutline,
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

const Sidebar = ({ selected }: {selected: string | null}) => {
  return (
    <section className="flex min-w-2xs flex-col items-start text-xl">
      <Link
        to="/"
        className="flex items-center p-4 font-['Cinzel'] text-2xl font-black text-sky-800 gap-2"
      >
        <Fa6SolidDragon className="h-8 w-8"/>OdinSocial
      </Link>
      <Link
        to="/"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "home" ? (
          <>
            <HomeIcon className="h-8 w-8" /> <b>Home</b>
          </>
        ) : (
          <>
            <HomeIconOutline className="h-8 w-8" /> Home
          </>
        )}
      </Link>
      <Link
        to="/explore"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "explore" ? (
          <>
            <ExploreIcon className="h-8 w-8" /> <b>Explore</b>
          </>
        ) : (
          <>
            <ExploreIconOutline className="h-8 w-8" /> Explore
          </>
        )}
      </Link>
      <Link
        to="/notifications"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "notifications" ? (
          <>
            <NotificationIcon className="h-8 w-8" /> <b>Notifications</b>
          </>
        ) : (
          <>
            <NotificationIconOutline className="h-8 w-8" /> Notifications
          </>
        )}
      </Link>
      <Link
        to="/bookmarks"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "bookmarks" ? (
          <>
            <BookmarkIcon className="h-8 w-8" /> <b>Bookmarks</b>
          </>
        ) : (
          <>
            <BookmarkIconOutline className="h-8 w-8" /> Bookmarks
          </>
        )}
      </Link>
      <Link
        to="/messages"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "messages" ? (
          <>
            <MessagesIcon className="h-8 w-8" /> <b>Messages</b>
          </>
        ) : (
          <>
            <MessagesIconOutline className="h-8 w-8" /> Messages
          </>
        )}
      </Link>
      <Link
        to="/1"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "profile" ? (
          <>
            <ProfileIcon className="h-8 w-8" /> <b>Profile</b>
          </>
        ) : (
          <>
            <ProfileIconOutline className="h-8 w-8" /> Profile
          </>
        )}
      </Link>
    </section>
  );
};

export default Sidebar;
