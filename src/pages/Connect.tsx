import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import ComponentLoader from "../components/ComponentLoader";
import { MouseEvent, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";
import defaultPicture from "../assets/defaultPicture.png";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Connect = () => {
  const { getAuthHeaders, user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[] | null>();
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchUsers = async () => {
      setUsers(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users`,
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
  }, []);

  const toggleFollow = async (
    e: MouseEvent,
    userId: number, // Id of user to follow
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
    <>
      <Header />
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32">
        <Sidebar />
        <section className="max-w-2xl flex-1/10 border-gray-400 sm:border-x-1">
          <div className="flex items-center gap-2 px-4 py-2 text-xl font-bold text-sky-950">
            <Link to={`/`} className="rounded-full p-2 hover:bg-gray-200">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            Connect
          </div>
          <section className="w-full">
            {users ? (
              users.length === 0 ? (
                <div className="p-4 text-center">Its Empty Here!</div>
              ) : (
                users.map((_user) => {
                  return (
                    <Link
                      to={`/user/${_user.id}`}
                      key={_user.id}
                      className="flex items-center gap-2 p-4 transition-colors duration-200 hover:cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={_user.profile.imageUrl || defaultPicture}
                        alt={_user.name}
                        className="h-10 w-10 min-w-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-bold">{_user.name}</div>
                        <div className="text-gray-600">{_user.email}</div>
                      </div>
                      {user!.id !== _user.id &&
                        (_user.followers?.some(
                          (follower) => follower.id === user!.id,
                        ) ? (
                          <button
                            className="ml-auto cursor-pointer rounded-3xl border-1 border-sky-900 bg-white px-4 py-2 font-bold text-sky-950 hover:bg-gray-100"
                            onClick={(e) =>
                              toggleFollow(e, _user.id, "UNFOLLOW")
                            }
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            className="ml-auto cursor-pointer rounded-3xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700"
                            onClick={(e) => toggleFollow(e, _user.id, "FOLLOW")}
                          >
                            Follow
                          </button>
                        ))}
                    </Link>
                  );
                })
              )
            ) : (
              error || <ComponentLoader />
            )}
          </section>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Connect;
