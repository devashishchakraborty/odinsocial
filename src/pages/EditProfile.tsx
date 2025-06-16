import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FormEvent, useContext, useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { AuthContext } from "../context/AuthContext";
import SmallLoader from "../components/SmallLoader";
import { User } from "../types";
import ComponentLoader from "../components/ComponentLoader";
import UploadImage from "../components/UploadImage";
import defaultPicture from "../assets/defaultPicture.png";
import RightSideBar from "../components/RightSideBar";

const EditProfile = () => {
  const { user, getAuthHeaders } = useContext(AuthContext);
  const [myProfile, setMyProfile] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setMyProfile(null);
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users/${user!.id}`,
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
        setName(data.name);
        setBio(data.profile.bio);
        setLocation(data.profile.location);
        setMyProfile(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchUser();
  }, []);

  const editProfile = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const headers = await getAuthHeaders();
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users`,
        {
          method: "PUT",
          headers: headers,
          body: JSON.stringify({ name, bio, location }),
        },
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      navigate(`/user/${user!.id}`);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-full flex-1 xl:px-16 2xl:px-32">
      <Sidebar />
      <section className="max-w-xl flex-1/10 border-gray-400 p-4 sm:border-x-1">
        <div className="mb-2 flex items-center gap-2 text-xl font-bold text-sky-950">
          <Link
            to={`/user/${user!.id}`}
            className="rounded-full p-2 hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          Edit Profile
        </div>

        {myProfile ? (
          <form
            className="relative mb-4 flex w-full flex-col gap-4 text-lg"
            onSubmit={(e) => editProfile(e)}
          >
            <UploadImage url={myProfile.profile.imageUrl || defaultPicture} />
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-md w-full rounded-sm bg-gray-200 p-2 outline-2 outline-gray-300 focus:bg-white"
              />
            </div>
            <div>
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Enter Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-md field-sizing-content w-full resize-none rounded-sm bg-gray-200 p-2 outline-2 outline-gray-300 focus:bg-white"
              ></textarea>
            </div>
            <div>
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="text-md w-full rounded-sm bg-gray-200 p-2 outline-2 outline-gray-300 focus:bg-white"
                required
              />
            </div>
            <button
              type="submit"
              className="flex cursor-pointer items-center gap-2 self-end rounded-4xl bg-sky-600 px-4 py-2 font-bold text-white hover:bg-sky-700 disabled:cursor-default disabled:bg-sky-300"
              disabled={
                name.length === 0 || location.length === 0 || isSubmitting
              }
            >
              {isSubmitting ? <SmallLoader className="px-2 py-0.5" /> : "Save"}
            </button>
          </form>
        ) : (
          <ComponentLoader />
        )}
        <div>{error}</div>
      </section>
      <RightSideBar />
    </main>
  );
};

export default EditProfile;
