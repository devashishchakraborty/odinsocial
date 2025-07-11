import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { useContext, useEffect, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";
import { Link, useParams } from "react-router-dom";
import ComponentLoader from "../components/ComponentLoader";
import defaultPicture from "../assets/defaultPicture.png";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { convertTimestampToDate } from "../utils/Utils";
import RightSideBar from "../components/RightSideBar";
import Footer from "../components/Footer";

const Profile = () => {
  const [_user, _setUser] = useState<User | null>(null); // User Profile I'm gonna view
  const [error, setError] = useState<string | null>(null);
  const { getAuthHeaders, user } = useContext(AuthContext);
  const { userId } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId || !parseInt(userId)) return setError("User Not found");
      _setUser(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
          {
            method: "GET",
            headers: headers,
          },
        );
        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "User Not Found"
              : `HTTP error! Status: ${response.status}`,
          );
        }
        const data = await response.json();
        _setUser(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, [userId]);

  const toggleFollow = async (action: string) => {
    if (!user || !_user) return;

    _setUser((prev) => {
      if (!prev) return prev;

      const updatedUser = { ...prev };

      if (action === "FOLLOW") {
        updatedUser.followers = [...updatedUser.followers!, { id: user!.id }];
      } else if (action === "UNFOLLOW") {
        updatedUser.followers = prev.followers!.filter(
          (follower) => follower.id !== user!.id,
        );
      }

      return updatedUser;
    });

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${_user.id}/toggle-follow`,
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

  if (error) return <section>{error}</section>;

  return (
    <>
      <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32">
        <Sidebar selected={parseInt(userId!) === user!.id ? `profile` : null} />
        <section className="flex-1/10 border-gray-400 sm:border-x-1">
          {_user ? (
            <>
              <section className="flex h-14 items-center gap-4 px-4 py-2">
                <Link
                  to="/"
                  className="cursor-pointer rounded-full p-2 text-xl hover:bg-gray-200"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </Link>
                <Link to={`/user/${userId}`} className="text-xl font-bold">
                  {_user.name}
                </Link>
              </section>
              <div className="h-30 w-full bg-linear-to-tr from-pink-500 via-sky-500 to-green-500"></div>
              <section className="border-b-1 border-gray-400 p-4">
                <section className="flex flex-col gap-2">
                  <div>
                    <div className="flex h-15 justify-between">
                      <div>
                        <div className="relative bottom-20 rounded-full border-4 border-white bg-white">
                          <img
                            src={_user.profile.imageUrl || defaultPicture}
                            alt="profile picture"
                            className="h-30 w-30 min-w-30 rounded-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        {_user.id === user!.id ? (
                          <Link
                            to="/edit-profile"
                            className="cursor-pointer rounded-3xl border-1 border-sky-900 bg-white px-4 py-2 font-bold text-sky-950 hover:bg-gray-100"
                          >
                            Edit Profile
                          </Link>
                        ) : _user.followers?.some(
                            (follower) => follower.id === user!.id,
                          ) ? (
                          <button
                            className="cursor-pointer rounded-3xl border-1 border-sky-900 bg-white px-4 py-2 font-bold text-sky-950 hover:bg-gray-100"
                            onClick={() => toggleFollow("UNFOLLOW")}
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            className="cursor-pointer rounded-3xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700"
                            onClick={() => toggleFollow("FOLLOW")}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-sky-950">
                        {_user.name}
                      </div>
                      <div className="text-gray-700">{_user.email}</div>
                    </div>
                  </div>
                  <div>{_user.profile.bio}</div>
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />{" "}
                      {_user.profile.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDaysIcon className="h-4 w-4" /> Joined{" "}
                      {convertTimestampToDate(_user.createdAt!)}
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-700">
                    <Link to={`/user/${_user.id}/followers`}>
                      <b className="text-sky-950">{_user.followers?.length}</b>{" "}
                      Followers
                    </Link>
                    <Link to={`/user/${_user.id}/following`}>
                      <b className="text-sky-950">{_user.following?.length}</b>{" "}
                      Following
                    </Link>
                  </div>
                </section>
              </section>
            </>
          ) : (
            <ComponentLoader />
          )}
          {_user ? <Posts userId={_user.id} /> : <ComponentLoader />}
        </section>
        <RightSideBar currentUserId={parseInt(userId!)} />
      </main>
      <Footer />
    </>
  );
};

export default Profile;
