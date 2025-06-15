import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import { Link } from "react-router-dom";
import Fa6SolidDragon from "../assets/OdinSocial";
import {
  ArrowLeftStartOnRectangleIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const [showMenuBox, setShowMenuBox] = useState(false);
  return (
    <header className="sm:hidden">
      <nav className="px-4">
        <ul className="flex items-center justify-between">
          <li>
            <Link to={"/user/" + user!.id}>
              <img
                className="h-10 w-10 min-w-10 rounded-full object-cover"
                src={user?.profile.imageUrl || defaultPicture}
                alt=""
              />
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="flex items-center gap-2 p-4 font-['Cinzel'] text-2xl font-black text-sky-800"
            >
              <Fa6SolidDragon className="h-8 w-8" />
              OdinSocial
            </Link>
          </li>
          <li className="relative">
            <EllipsisVerticalIcon
              className="h-8 w-8"
              onClick={() => setShowMenuBox((prev) => !prev)}
            />

            {showMenuBox && (
              <section className="absolute right-0 z-2 bg-white shadow-md/30">
                <ul className="flex flex-col">
                  <li>
                    <div
                      onClick={() => logout()}
                      className="flex items-center gap-2 rounded-sm px-4 py-2 text-xl hover:bg-pink-600 hover:text-white"
                    >
                      Logout
                      <ArrowLeftStartOnRectangleIcon className="h-6 w-6 rotate-180" />
                    </div>
                  </li>
                </ul>
              </section>
            )}
          </li>
        </ul>
      </nav>
      {showMenuBox && (
        <div
          className="absolute top-0 z-1 h-screen w-screen"
          onClick={() => setShowMenuBox(false)}
        ></div>
      )}
    </header>
  );
}
