import { Link } from "react-router-dom";

import {
  HomeIcon as HomeIconOutline,
  MagnifyingGlassCircleIcon as ExploreIconOutline,
  BookmarkIcon as BookmarkIconOutline,
  EnvelopeIcon as MessagesIconOutline,
  BellIcon as NotificationIconOutline,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  MagnifyingGlassCircleIcon as ExploreIcon,
  BookmarkIcon,
  EnvelopeIcon as MessagesIcon,
  BellIcon as NotificationIcon,
} from "@heroicons/react/24/solid";

const Footer = ({ selected = null }: { selected?: string | null }) => {
  return (
    <footer className="sticky bottom-0 flex bg-white p-1 text-xl justify-between sm:hidden">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "home" ? (
          <HomeIcon className="h-8 w-8" />
        ) : (
          <HomeIconOutline className="h-8 w-8" />
        )}
      </Link>
      <Link
        to="/explore"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "explore" ? (
          <ExploreIcon className="h-8 w-8" />
        ) : (
          <ExploreIconOutline className="h-8 w-8" />
        )}
      </Link>
      <Link
        to="/notifications"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "notifications" ? (
          <NotificationIcon className="h-8 w-8" />
        ) : (
          <NotificationIconOutline className="h-8 w-8" />
        )}
      </Link>
      <Link
        to="/bookmarks"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "bookmarks" ? (
          <BookmarkIcon className="h-8 w-8" />
        ) : (
          <BookmarkIconOutline className="h-8 w-8" />
        )}
      </Link>
      <Link
        to="/messages"
        className="flex items-center gap-3 rounded-4xl px-4 py-2 text-sky-950 transition-colors duration-200 hover:bg-gray-200"
      >
        {selected === "messages" ? (
          <MessagesIcon className="h-8 w-8" />
        ) : (
          <MessagesIconOutline className="h-8 w-8" />
        )}
      </Link>
    </footer>
  );
};

export default Footer;
