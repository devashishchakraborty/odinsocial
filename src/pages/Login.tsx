import { useContext, useState } from "react";
import Loading from "../components/Loading";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { login, isSubmitting } = useContext(AuthContext);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const response = await login(email, password);
    if (response.success) {
      window.location.reload();
    } else {
      setLoginError(response.error.message);
    }
  };

  return (
    <>
      <main className="flex h-full items-center justify-center p-4 text-lg sm:px-16 lg:gap-8 xl:gap-16 xl:px-32">
        <section className="hidden flex-col gap-4 text-lg lg:flex">
          <section>
            <h1 className="mb-8 text-5xl font-bold text-sky-800 font-['Cinzel']">OdinSocial</h1>
            <p>
              Connect. Share. Inspire. Your social space, built the way it
              should be.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-3xl font-bold text-sky-700">
              What You Can Do on OdinSocial
            </h2>
            <ul className="flex list-disc flex-col gap-4">
              <li>
                <h3 className="text-xl font-bold text-sky-700">
                  Build Your Network
                </h3>
                <p>Follow friends, creators, and inspiring people.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold text-sky-700">
                  Share Your Moments
                </h3>
                <p>Post photos, stories, and updates that matter to you.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold text-sky-700">
                  Start Conversations
                </h3>
                <p>React, comment, and chat — express yourself fully.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold text-sky-700">
                  Privacy First
                </h3>
                <p>You control your content and your experience.</p>
              </li>
              <li>
                <h3 className="text-xl font-bold text-sky-700">Simple & Fun</h3>
                <p>Social media that feels good to use — fast and intuitive.</p>
              </li>
            </ul>
          </section>
        </section>
        <section className="flex flex-col items-center">
          <h1 className="mb-4 hidden text-2xl font-bold sm:text-3xl lg:block">
            Sign in
          </h1>
          <h1 className="mb-4 text-4xl font-bold text-sky-800 lg:hidden font-['Cinzel']">
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
              <Link
                className="text-sky-600 hover:text-sky-700 hover:underline"
                to="/sign-up"
              >
                Sign Up
              </Link>
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
