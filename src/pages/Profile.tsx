import Sidebar from "../components/Sidebar";
import Posts from "../components/Posts";
import { useContext, useEffect, useState } from "react";
import { User } from "../types";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import ComponentLoader from "../components/ComponentLoader";
import defaultPicture from "../assets/defaultPicture.png";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState(null);
  const { decodeAndCheckExpiry, refreshToken } = useContext(AuthContext);
  const { userId } = useParams();
  useEffect(() => {
    const fetchUser = async () => {
      setUser(null);
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      const { isExpired } = decodeAndCheckExpiry(token);
      if (isExpired) {
        const token = await refreshToken();
        localStorage.setItem("auth_token", token);
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  if (error) return <section>{error}</section>;

  return (
    <main className="flex h-full px-30">
      <Sidebar selected="profile" />
      <section className="w-2xl border-x-1 border-gray-400">
        <div className="h-30 w-full bg-linear-to-tr from-pink-500 via-sky-500 to-green-500"></div>
        <section className="border-b-1 border-gray-400 p-4">
          {user ? (
            <section className="flex flex-col gap-4">
              <div>
                <div className="flex h-15 justify-between">
                  <div>
                    <div className="relative bottom-20 rounded-full border-4 border-sky-900">
                      <img
                        src={user.profile.imageUrl || defaultPicture}
                        alt="profile picture"
                        className="h-30 min-w-max"
                      />
                    </div>
                  </div>
                  <div>
                    <button className="font-bold px-4 py-2 bg-sky-900 text-white rounded-3xl">Follow</button>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-sky-950">
                    {user.name}
                  </div>
                  <div className="text-gray-600">{user.email}</div>
                </div>
              </div>
              <div>
                <b>{user._count?.followers}</b> Followers |{" "}
                <b>{user._count?.following}</b> Following
              </div>
            </section>
          ) : (
            <ComponentLoader />
          )}
        </section>
        {user ? <Posts userId={user.id} /> : <ComponentLoader />}
      </section>
    </main>
  );
};

export default Profile;
