import { useContext } from "react";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import PageLoader from "./components/PageLoader";
import Explore from "./pages/Explore";
import Messages from "./pages/Messages";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import EditProfile from "./pages/EditProfile";
import Connect from "./pages/Connect";

const PublicRoute = () => {
  const { isAuthenticated, isAuthenticating } = useContext(AuthContext);

  return isAuthenticated ? (
    <Navigate to="/" replace />
  ) : isAuthenticating ? (
    <PageLoader />
  ) : (
    <Outlet />
  );
};

const ProtectedRoute = () => {
  const { isAuthenticated, isAuthenticating } = useContext(AuthContext);

  return isAuthenticated ? (
    <Outlet />
  ) : isAuthenticating ? (
    <PageLoader />
  ) : (
    <Navigate to="/login" replace />
  );
};
function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/user/:userId/followers" element={<Followers />} />
        <Route path="/user/:userId/following" element={<Following />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
