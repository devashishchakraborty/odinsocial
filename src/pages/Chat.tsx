import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import Messages from "../components/Messages";
import { clipText } from "../utils/Utils.ts";
import { User } from "../types/index.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import Sidebar from "../components/Sidebar.tsx";
import defaultPicture from "../assets/defaultPicture.png";

const Chat = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState(null);
  const [currentTexter, setCurrentTexter] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const { getAuthHeaders } = useContext(AuthContext);

  const filteredUsers =
    users &&
    users.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()),
    );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/users?getMessages=true`,
          {
            method: "GET",
            headers,
          },
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}. ${data.message}`,
          );
        }
        setUsers(data);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  if (error) {
    return (
      <main>
        <section>{error}</section>
      </main>
    );
  }

  return (
    <main className="flex h-full px-30">
      <Sidebar selected="messages" />
      <section
        className={`${currentTexter ? "hidden" : "flex"} h-full w-full min-w-xs flex-col sm:flex sm:w-sm sm:border-x-2 sm:border-gray-200`}
      >
        <section className="flex h-16 items-center gap-4 border-b-2 border-b-gray-200 p-2 pr-4">
          <input
            id="search"
            name="search"
            type="text"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="text-md w-full rounded-full bg-gray-200 px-4 py-1 outline-2 outline-gray-200 focus:bg-white"
          />
        </section>
        <section className="flex flex-col overflow-auto">
          {filteredUsers ? (
            filteredUsers.length > 0 &&
            filteredUsers.map((texter) => {
              return (
                <section
                  className={`flex ${currentTexter?.id == texter.id && "bg-sky-600 hover:bg-sky-600"} cursor-pointer items-center gap-4 border-b-2 border-b-gray-200 px-4 py-2 hover:bg-gray-200`}
                  key={texter.id}
                  onClick={() => setCurrentTexter(texter)}
                >
                  <div>
                    <img
                      src={texter.profile.imageUrl || defaultPicture}
                      alt="Profile picture"
                      className="h-10 w-10 min-w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div
                      className={`font-bold ${currentTexter?.id == texter.id && "text-white"} `}
                    >
                      {texter.name}
                    </div>
                    <div
                      className={`text-gray-500 ${currentTexter?.id == texter.id && "text-white"}`}
                    >
                      {clipText(
                        texter.latestMessage
                          ? texter.latestMessage.authorId === texter.id
                            ? texter.latestMessage.text
                            : "You: " + texter.latestMessage.text
                          : "Start a new chat!",
                      )}
                    </div>
                  </div>
                </section>
              );
            })
          ) : (
            <div className="flex justify-center p-8">
              <Loading />
            </div>
          )}
        </section>
      </section>
      <Messages
        currentTexter={currentTexter}
        setUsers={setUsers}
        setCurrentTexter={setCurrentTexter}
      />
    </main>
  );
};

export default Chat;
