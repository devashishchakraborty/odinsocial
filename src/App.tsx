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
        <Route path="/user/:userId" element={<Profile />} />
        <Route path="/post/:postId" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
