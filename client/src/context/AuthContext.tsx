import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Admin authentication password - in a real app, this would be handled server-side
const ADMIN_PASSWORD = "admin123";

interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const defaultAuthContext: AuthContextType = {
  isAdmin: false,
  login: () => false,
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem("trossachs_auth");
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setIsAdmin(!!authData.isAdmin);
      } catch (err) {
        console.error("Error parsing auth data from localStorage:", err);
        localStorage.removeItem("trossachs_auth");
      }
    }
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("trossachs_auth", JSON.stringify({ isAdmin }));
  }, [isAdmin]);

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}