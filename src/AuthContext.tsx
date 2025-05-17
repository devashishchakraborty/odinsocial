import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface ContextType {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}

interface ProviderPropsType {
  children: ReactNode;
}

const AuthContext = createContext<ContextType>({
  count: 0,
  setCount: () => {},
});

const AuthProvider = ({ children }: ProviderPropsType) => {
  const [user, setUser] = useState<JwtPayload | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, isLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          let decoded = jwtDecode(token);
          const isExpired = decoded.exp && Date.now() >= decoded.exp * 1000;
          if (isExpired) {
            const accessToken = await refreshToken();
            decoded = jwtDecode(accessToken);
          }
          setUser(decoded);
        } catch (error) {
          console.error("Invalid token:", error);
        }
      }
    };
    getUser();
  }, []);

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
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("auth_token", data)
      return data;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const login = async (email: string, password: string) => {
    
  }

  return (
    <AuthContext.Provider value={{ count: 0, setCount: () => {} }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
