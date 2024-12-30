import { createContext, ReactNode, useEffect, useState } from "react";
import * as apiClient from "../api-client";
import { useNavigate } from "react-router-dom";

// Define the types for authentication context
type AuthContextType = {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        await apiClient.validateToken();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token validation failed:", error);
        setIsAuthenticated(false);
        navigate("/sign-in");
      }
    };
    validateToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated: setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};
