import { useContext } from "react";
import "./App.css";
import { AuthContext } from "./AuthContext";
import Login from "./pages/Login";

function App() {
  const AuthState = useContext(AuthContext);
  return (
    <>
      <Login />
    </>
  );
}

export default App;
