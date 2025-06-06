import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { useContext, useEffect, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ComponentLoader from "../components/ComponentLoader";
import defaultPicture from "../assets/defaultPicture.png";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { convertTimestampToDate } from "../utils/Utils";
import RightSideBar from "../components/RightSideBar";

const Profile = () => {
  const [_user, _setUser] = useState<User | null>(null); // User Profile I'm gonna view
  const [error, setError] = useState(null);
  const { getAuthHeaders, user } = useContext(AuthContext);
  const { userId } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
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
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        _setUser(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, []);
  
  if (error) return <section>{error}</section>;

  return (
    <main className="flex flex-1 min-h-full px-30">
      <Sidebar selected={parseInt(userId!) === user!.id ? `profile` : null} />
      <section className="w-2xl border-x-1 border-gray-400">
        <div className="h-30 w-full bg-linear-to-tr from-pink-500 via-sky-500 to-green-500"></div>
        <section className="border-b-1 border-gray-400 p-4">
          {_user ? (
            <section className="flex flex-col gap-4">
              <div>
                <div className="flex h-15 justify-between">
                  <div>
                    <div className="relative bottom-20 rounded-full border-4 border-white bg-white">
                      <img
                        src={_user.profile.imageUrl || defaultPicture}
                        alt="profile picture"
                        className="h-30 w-30 min-w-max rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    {_user.id === user!.id ? (
                      <button className="cursor-pointer rounded-3xl border-1 border-sky-900 bg-white px-4 py-2 font-bold text-sky-950 hover:bg-gray-100">
                        Edit Profile
                      </button>
                    ) : (
                      <button className="cursor-pointer rounded-3xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700">
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
              <div className="flex items-center gap-4 text-gray-700">
                <div className="flex items-center gap-1">
                  <MapPinIcon className="h-4 w-4"/> India
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDaysIcon className="h-4 w-4"/> Joined {convertTimestampToDate(_user.createdAt!)}
                </div>
              </div>
              <div className="flex gap-4 text-gray-700">
                <div>
                  <b className="text-sky-950">{_user._count?.followers}</b> Followers
                </div>
                <div>
                  <b className="text-sky-950">{_user._count?.following}</b> Following
                </div>
              </div>
            </section>
          ) : (
            <ComponentLoader />
          )}
        </section>
        {_user ? <Posts userId={_user.id} /> : <ComponentLoader />}
      </section>
      <RightSideBar/>
    </main>
  );
};

export default Profile;
