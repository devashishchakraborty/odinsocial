import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { User } from "../types";

interface UserPayload extends User, JwtPayload {}

interface AuthContextType {
  user: UserPayload | null;
  setUser: Dispatch<SetStateAction<UserPayload | null>>;
  isAuthenticated: boolean;
  isSubmitting: boolean;
  isAuthenticating: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  register: (
    name: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: any }>;
  logout: () => void;
  getAuthHeaders: () => Promise<{
    "Content-Type": string;
    Authorization: string;
  }>;
}

interface ProviderPropsType {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isSubmitting: false,
  isAuthenticating: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  getAuthHeaders: async () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer `,
  }),
});

const AuthProvider = ({ children }: ProviderPropsType) => {
  // const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      let token = localStorage.getItem("auth_token");
      if (!token) {
        setIsAuthenticating(false);
        return;
      }
      try {
        let accessToken = token;
        let { decoded, isExpired } = decodeAndCheckExpiry(accessToken);
        if (isExpired) {
          accessToken = await refreshToken();
          decoded = jwtDecode(accessToken);
        }
        setUser(decoded);
        setIsAuthenticated(true);
        localStorage.setItem("auth_token", accessToken);
      } catch (error) {
        console.error("Invalid token:", error);
      } finally {
        setIsAuthenticating(false);
      }
    };
    getUser();
  }, []);

  const decodeAndCheckExpiry = (token: string) => {
    const decoded = jwtDecode<UserPayload>(token);
    const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;
    return { decoded, isExpired };
  };

  const getAuthHeaders = async () => {
    let token = localStorage.getItem("auth_token");
    if (token) {
      const { isExpired } = decodeAndCheckExpiry(token);
      if (isExpired) {
        token = await refreshToken();
        if (token) localStorage.setItem("auth_token", token);
      }
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/refresh`,
        {
          method: "POST",
          credentials: "include", // Crucial for cross-origin cookies
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 401) {
          logout();
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.accessToken;
    } catch (err) {
      console.error("Error fetching data:", err);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        throw new Error(
          response.status === 400
            ? (await response.json()).error
            : `HTTP error! Status: ${response.status}`,
        );
      }
      const data = await response.json();
      localStorage.setItem("auth_token", data.accessToken);
      return { success: true };
    } catch (err: any) {
      console.error(err);
      return { success: false, error: err };
    } finally {
      setIsSubmitting(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/sign-up`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error:", err);
      return { success: false, error: err };
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isSubmitting,
        isAuthenticating,
        isAuthenticated,
        login,
        logout,
        register,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
