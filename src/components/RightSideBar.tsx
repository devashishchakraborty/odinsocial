import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { User } from "../types";
import defaultPicture from "../assets/defaultPicture.png";
import ComponentLoader from "./ComponentLoader";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const RightSideBar = ({ currentUserId }: { currentUserId?: number }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[] | null>(null);
  const { getAuthHeaders, user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchUsers = async () => {
      setUsers(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users${currentUserId ? "?excludeUserId=" + currentUserId : ""}`,
          {
            method: "GET",
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const toggleFollow = async (
    e: MouseEvent,
    userId: number,
    action: string,
  ) => {
    e.preventDefault();
    if (!user || !userId) return;

    setUsers((prev) => {
      if (!prev) return prev;

      return prev?.map((_user) => {
        if (_user.id !== userId) return _user;

        const updatedUser = { ..._user };

        if (action === "FOLLOW") {
          updatedUser.followers = [...updatedUser.followers!, { id: user!.id }];
        } else if (action === "UNFOLLOW") {
          updatedUser.followers = updatedUser.followers!.filter(
            (follower) => follower.id !== user!.id,
          );
        }

        return updatedUser;
      });
    });

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}/toggle-follow`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ action }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  return (
    <section className="sticky top-0 h-screen overflow-y-auto p-4">
      <form className="relative mb-4">
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
      <section className="rounded-2xl border-1 border-gray-400">
        <h1 className="p-4 text-xl font-bold">Who to follow</h1>
        {users ? (
          users.length === 0 ? (
            <div className="p-4">No Users left to follow!</div>
          ) : (
            users.map((_user) => {
              return (
                <Link
                  to={`/user/${_user.id}`}
                  key={_user.id}
                  className="flex items-center justify-between gap-2 p-4 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex gap-2">
                    <img
                      src={_user.profile.imageUrl || defaultPicture}
                      alt={_user.name}
                      className="h-10 w-10 min-w-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold">{_user.name}</div>
                      <div className="text-gray-600">{_user.email}</div>
                    </div>
                  </div>

                  {_user.followers?.some(
                    (follower) => follower.id === user!.id,
                  ) ? (
                    <button
                      className="cursor-pointer rounded-3xl border-1 border-sky-900 bg-white px-4 py-2 font-bold text-sky-950 hover:bg-gray-100"
                      onClick={(e) => toggleFollow(e, _user.id, "UNFOLLOW")}
                    >
                      Following
                    </button>
                  ) : (
                    <button
                      className="cursor-pointer rounded-3xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700"
                      onClick={(e) => toggleFollow(e, _user.id, "FOLLOW")}
                    >
                      Follow
                    </button>
                  )}
                </Link>
              );
            })
          )
        ) : (
          error || <ComponentLoader />
        )}
        <div className="rounded-b-2xl p-4 text-sky-700 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100">
          <Link to="#">Show More</Link>
        </div>
      </section>
    </section>
  );
};

export default RightSideBar;
