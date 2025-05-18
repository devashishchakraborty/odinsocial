import { useState } from "react";
import Loading from "../components/Loading";

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error(
          response.status === 400
            ? (await response.json()).err
            : `HTTP error! Status: ${response.status}`
        );
      }
      const data = await response.json();
      localStorage.setItem("auth_token", data.accessToken);
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex p-4 text-lg sm:px-16 xl:px-32 lg:gap-8 xl:gap-16 justify-center items-center h-full">
        <section className="hidden lg:flex flex-col gap-4 text-lg">
          <section>
            <h1 className="text-5xl font-bold text-sky-700 mb-8">OdinSocial</h1>
            <p>
              Connect. Share. Inspire. Your social space, built the way it
              should be.
            </p>
          </section>

          <section>
            <h2 className="text-3xl text-sky-700 font-bold mb-4">
              What You Can Do on OdinSocial
            </h2>
            <ul className="flex flex-col gap-4 list-disc">
              <li>
                <h3 className="text-xl text-sky-700 font-bold">
                  Build Your Network
                </h3>
                <p>Follow friends, creators, and inspiring people.</p>
              </li>
              <li>
                <h3 className="text-xl text-sky-700 font-bold">
                  Share Your Moments
                </h3>
                <p>Post photos, stories, and updates that matter to you.</p>
              </li>
              <li>
                <h3 className="text-xl text-sky-700 font-bold">
                  Start Conversations
                </h3>
                <p>React, comment, and chat — express yourself fully.</p>
              </li>
              <li>
                <h3 className="text-xl text-sky-700 font-bold">
                  Privacy First
                </h3>
                <p>You control your content and your experience.</p>
              </li>
              <li>
                <h3 className="text-xl text-sky-700 font-bold">Simple & Fun</h3>
                <p>Social media that feels good to use — fast and intuitive.</p>
              </li>
            </ul>
          </section>
        </section>
        <section className="flex flex-col items-center">
          <h1 className="hidden lg:block mb-4 text-2xl font-bold sm:text-3xl">
            Sign in
          </h1>
          <h1 className="lg:hidden text-4xl font-bold text-sky-700 mb-4">
            OdinSocial
          </h1>
          <form
            onSubmit={handleLogin}
            className="relative flex min-w-3/4 flex-col gap-4 sm:max-w-xl sm:min-w-lg"
          >
            <input
              className="rounded-sm border-2 border-gray-300 bg-gray-50 p-3 outline-sky-600 focus:bg-white sm:p-4"
              type="text"
              name="email"
              placeholder="Email"
              aria-label="Email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="rounded-sm border-2 border-gray-300 bg-gray-50 p-3 outline-sky-600 focus:bg-white sm:p-4"
              type="password"
              name="password"
              placeholder="Password"
              aria-label="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="flex cursor-pointer justify-center rounded-sm bg-sky-500 p-4 text-white hover:bg-sky-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loading /> : "Login"}
            </button>
            <button
              type="button"
              className="flex cursor-pointer justify-center rounded-sm bg-gray-500 p-4 text-white hover:bg-gray-600"
              disabled={isSubmitting}
              onClick={() => {
                setEmail("guest@email.com");
                setPassword("guest");
              }}
            >
              Fill Guest Info
            </button>

            <div>
              Don't have an account?{" "}
              <a
                className="text-sky-600 hover:underline hover:text-sky-700"
                href="/sign-up"
              >
                Sign Up
              </a>
            </div>
            <small>
              <i className="text-red-700">{loginError}</i>
            </small>
          </form>
        </section>
      </main>
    </>
  );
};

export default Login;
