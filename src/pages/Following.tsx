import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Users from "../components/Users";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
const Following = () => {
  const { userId } = useParams();
  return (
    <main className="flex min-h-full flex-1 px-30">
      <Sidebar />
      <section className="w-2xl border-x-1 border-gray-400">
      <div className="flex items-center gap-2 px-4 py-2 text-xl font-bold text-sky-950">
          <Link
            to={`/user/${userId}`}
            className="rounded-full p-2 hover:bg-gray-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          Following
        </div>

        <Users type="following" />
      </section>
    </main>
  );
};

export default Following;
