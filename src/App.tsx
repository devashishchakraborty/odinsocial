import { useContext } from "react";
import "./App.css";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Home from "./pages/Home";
import PageLoader from "./components/PageLoader";

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
      </Route>
    </Routes>
  );
}

export default App;
